/**
 * JSTU Rule-Based Fallback AI Service
 * 
 * Provides instantaneous, deterministic responses using the grounded tools
 * whenever the Gemini live API is offline, unconfigured, or rate limited.
 * 
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { AIService, AIServiceResponse, AIChatMessage, AuthSessionContext } from './aiTypes';
import { AIGroundingTools } from './aiGroundingTools';
import { AIGuardrails } from './aiGuardrails';

export class RuleBasedFallbackAIService implements AIService {
  /**
   * Processes prompt against grounded tools using intent recognition.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  async sendMessage(
    prompt: string,
    _history: AIChatMessage[],
    session: AuthSessionContext,
    lang?: 'en' | 'bn'
  ): Promise<AIServiceResponse> {
    const isBn = lang === 'bn' || /[\u0980-\u09FF]/.test(prompt);
    const lower = prompt.toLowerCase();
    const toolsUsed: string[] = [];

    // 1. ROUTINE / SCHEDULE INTENT
    if (
      lower.includes('routine') ||
      lower.includes('schedule') ||
      lower.includes('class') ||
      lower.includes('tomorrow') ||
      lower.includes('lecture') ||
      lower.includes('period') ||
      lower.includes('রুটিন') ||
      lower.includes('ক্লাস') ||
      lower.includes('আগামীকাল') ||
      lower.includes('সময়সূচি')
    ) {
      toolsUsed.push('getMyRoutine');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getMyRoutine(session);

      if (data.schedule.length === 0) {
        return {
          reply: isBn
            ? 'আপনার বর্তমান সেমিস্টারের জন্য কোনো সক্রিয় ক্লাস রুটিন পাওয়া যায়নি।'
            : 'No active class schedule was found for your registered semester.',
          sources: ['routine'],
          isFallback: true,
          toolsUsed
        };
      }

      // Check if user specifically asked about tomorrow
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      const tomorrowIdx = (new Date().getDay() + 1) % 7;
      const tomorrowName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][tomorrowIdx];
      const isTomorrowQuery = lower.includes('tomorrow') || lower.includes('আগামীকাল');

      const filteredSchedule = isTomorrowQuery && days.includes(tomorrowName)
        ? data.schedule.filter(s => s.day.toLowerCase() === tomorrowName.toLowerCase())
        : data.schedule;

      if (isBn) {
        let reply = isTomorrowQuery
          ? `📅 **আগামীকাল (${tomorrowName})-এর ক্লাস রুটিন:**\n`
          : `📅 **আপনার সাপ্তাহিক ক্লাস রুটিন:**\n`;
        if (filteredSchedule.length === 0) {
          reply += `আগামীকাল আপনার কোনো নির্ধারিত ক্লাস নেই।`;
        } else {
          for (const s of filteredSchedule.slice(0, 5)) {
            reply += `• **${s.courseCode}** (${s.courseTitle}): ${s.day} ${s.timeSlot}, রুম: ${s.room}\n`;
          }
        }
        return {
          reply: reply.trim(),
          sources: ['routine'],
          isFallback: true,
          toolsUsed
        };
      } else {
        let reply = isTomorrowQuery
          ? `📅 **Class Schedule for Tomorrow (${tomorrowName}):**\n`
          : `📅 **Your Weekly Class Routine:**\n`;
        if (filteredSchedule.length === 0) {
          reply += `You have no scheduled classes tomorrow.`;
        } else {
          for (const s of filteredSchedule.slice(0, 5)) {
            reply += `• **${s.courseCode}** (${s.courseTitle}): ${s.day} at ${s.timeSlot}, Room: ${s.room}\n`;
          }
        }
        return {
          reply: reply.trim(),
          sources: ['routine'],
          isFallback: true,
          toolsUsed
        };
      }
    }

    // 2. ATTENDANCE INTENT
    if (
      lower.includes('attendance') ||
      lower.includes('absent') ||
      lower.includes('present') ||
      lower.includes('lowest attendance') ||
      lower.includes('উপস্থিতি') ||
      lower.includes('অনুপস্থিত') ||
      lower.includes('হাজিরা')
    ) {
      toolsUsed.push('getMyAttendance');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getMyAttendance(session);

      if (data.courses.length === 0) {
        return {
          reply: isBn
            ? 'আপনার বর্তমান কোর্সের কোনো উপস্থিতি রেকর্ড পাওয়া যায়নি।'
            : 'No attendance records were found for your registered courses.',
          sources: ['attendance'],
          isFallback: true,
          toolsUsed
        };
      }

      // Sort by lowest attendance
      const sorted = [...data.courses].sort((a, b) => a.percentage - b.percentage);
      const lowest = sorted[0];

      if (lower.includes('lowest') || lower.includes('কম উপস্থিতি') || lower.includes('সবচেয়ে কম')) {
        const reply = isBn
          ? `📊 আপনার সবচেয়ে কম উপস্থিতি রয়েছে **${lowest.courseCode}** (${lowest.courseTitle}) কোর্সে: **${lowest.percentage}%** (উপস্থিত: ${lowest.attendedClasses}/${lowest.totalClasses} ক্লাস)।` +
            (lowest.percentage < 75 ? ` ⚠️ সতর্কবার্তা: এটি বিশ্ববিদ্যালয়ের ন্যূনতম ৭৫% কলেজিয়েট সীমার নিচে রয়েছে!` : '')
          : `📊 Your lowest attendance is in **${lowest.courseCode}** (${lowest.courseTitle}) at **${lowest.percentage}%** (${lowest.attendedClasses}/${lowest.totalClasses} classes attended).` +
            (lowest.percentage < 75 ? ` ⚠️ Warning: This is below the mandatory 75% collegiate attendance requirement!` : '');

        return {
          reply,
          sources: ['attendance'],
          isFallback: true,
          toolsUsed
        };
      }

      if (isBn) {
        let reply = `📊 **আপনার উপস্থিতি বিবরণী (সামগ্রিক: ${data.overallAttendancePercentage}%):**\n`;
        for (const c of data.courses) {
          reply += `• **${c.courseCode}**: ${c.percentage}% (${c.attendedClasses}/${c.totalClasses} ক্লাস)\n`;
        }
        if (data.warningNote) {
          reply += `\n⚠️ ${data.warningNote}`;
        }
        return { reply: reply.trim(), sources: ['attendance'], isFallback: true, toolsUsed };
      } else {
        let reply = `📊 **Your Attendance Overview (Overall: ${data.overallAttendancePercentage}%):**\n`;
        for (const c of data.courses) {
          reply += `• **${c.courseCode}**: ${c.percentage}% (${c.attendedClasses}/${c.totalClasses} classes)\n`;
        }
        if (data.warningNote) {
          reply += `\n⚠️ ${data.warningNote}`;
        }
        return { reply: reply.trim(), sources: ['attendance'], isFallback: true, toolsUsed };
      }
    }

    // 3. PUBLISHED RESULTS / CGPA / SGPA INTENT
    if (
      lower.includes('result') ||
      lower.includes('cgpa') ||
      lower.includes('sgpa') ||
      lower.includes('gpa') ||
      lower.includes('grade') ||
      lower.includes('marks') ||
      lower.includes('ফলাফল') ||
      lower.includes('সিজিপিএ') ||
      lower.includes('জিপিএ') ||
      lower.includes('গ্রেড')
    ) {
      toolsUsed.push('getMyPublishedResults');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getMyPublishedResults(session);

      if (data.publishedSemesters.length === 0) {
        return {
          reply: isBn
            ? 'পরীক্ষা নিয়ন্ত্রক দপ্তর কর্তৃক আনুষ্ঠানিকভাবে প্রকাশিত কোনো ফলাফল পাওয়া যায়নি। (খসড়া নম্বর প্রকাশের পর দৃশ্যমান হবে)'
            : 'No officially published examination results were found. Only finalized records published by the Controller of Examinations are displayed.',
          sources: ['published_results'],
          isFallback: true,
          toolsUsed
        };
      }

      if (isBn) {
        let reply = `🎓 **প্রকাশিত পরীক্ষার ফলাফল (সর্বমোট সিজিপিএ: ${data.cumulativeCGPA.toFixed(2)}):**\n`;
        for (const sem of data.publishedSemesters) {
          reply += `\n**${sem.semesterName}** (এসজিপিএ: ${sem.sgpa.toFixed(2)}):\n`;
          for (const c of sem.courses.slice(0, 4)) {
            reply += `• ${c.courseCode}: গ্রেড ${c.grade} (জিপি ${c.gradePoint.toFixed(2)})\n`;
          }
        }
        reply += `\n*নোট: শুধুমাত্র আনুষ্ঠানিকভাবে অনুমোদিত ও প্রকাশিত ফলাফল প্রদর্শিত হয়েছে।*`;
        return { reply: reply.trim(), sources: ['published_results'], isFallback: true, toolsUsed };
      } else {
        let reply = `🎓 **Official Published Results (Cumulative CGPA: ${data.cumulativeCGPA.toFixed(2)}):**\n`;
        for (const sem of data.publishedSemesters) {
          reply += `\n**${sem.semesterName}** (SGPA: ${sem.sgpa.toFixed(2)}):\n`;
          for (const c of sem.courses.slice(0, 4)) {
            reply += `• ${c.courseCode}: Grade ${c.grade} (GP ${c.gradePoint.toFixed(2)})\n`;
          }
        }
        reply += `\n*Note: Displays officially ratified and published results only.*`;
        return { reply: reply.trim(), sources: ['published_results'], isFallback: true, toolsUsed };
      }
    }

    // 4. FEES / DUES INTENT
    if (
      lower.includes('fee') ||
      lower.includes('due') ||
      lower.includes('tuition') ||
      lower.includes('payment') ||
      lower.includes('cleared') ||
      lower.includes('ফি') ||
      lower.includes('বকেয়া') ||
      lower.includes('টাকা') ||
      lower.includes('পেমেন্ট')
    ) {
      toolsUsed.push('getMyFeeStatus');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getMyFeeStatus(session);

      if (isBn) {
        const reply = `💳 **ফি ও বকেয়া স্ট্যাটাস (${data.semester}):**\n` +
          `• টিউশন ফি: ৳${data.tuitionFee.toLocaleString()}\n` +
          `• পরীক্ষা ফি: ৳${data.examFee.toLocaleString()}\n` +
          `• ল্যাব ও লাইব্রেরি ফি: ৳${(data.labFee + data.libraryFee).toLocaleString()}\n` +
          `• মোট পরিশোধিত: ৳${data.totalPaid.toLocaleString()}\n` +
          `• বকেয়া: **৳${data.totalDue.toLocaleString()}**\n` +
          `• অবস্থা: **${data.isCleared ? 'পরিশোধিত (Cleared)' : 'বকেয়া রয়েছে (Pending)'}**`;
        return { reply, sources: ['fee_status'], isFallback: true, toolsUsed };
      } else {
        const reply = `💳 **Fee & Payment Status (${data.semester}):**\n` +
          `• Tuition Fee: BDT ${data.tuitionFee.toLocaleString()}\n` +
          `• Exam Fee: BDT ${data.examFee.toLocaleString()}\n` +
          `• Lab & Library Fee: BDT ${(data.labFee + data.libraryFee).toLocaleString()}\n` +
          `• Total Paid: BDT ${data.totalPaid.toLocaleString()}\n` +
          `• Outstanding Dues: **BDT ${data.totalDue.toLocaleString()}**\n` +
          `• Status: **${data.isCleared ? 'All Dues Cleared' : 'Payment Pending'}**`;
        return { reply, sources: ['fee_status'], isFallback: true, toolsUsed };
      }
    }

    // 5. APPLICATIONS INTENT (Status & Tracking)
    if (
      lower.includes('my application') ||
      lower.includes('application status') ||
      lower.includes('track') ||
      lower.includes('আবেদন স্ট্যাটাস') ||
      lower.includes('আমার আবেদন') ||
      lower.includes('আবেদনের অবস্থা')
    ) {
      toolsUsed.push('getMyApplications');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getMyApplications(session);

      if (data.applications.length === 0) {
        return {
          reply: isBn
            ? 'আপনার কোনো সক্রিয় বা পূর্ববর্তী অনলাইন আবেদন পাওয়া যায়নি। আপনি "Paperless Applications" মেনু থেকে নতুন আবেদন করতে পারেন।'
            : 'No active paperless applications were found. You can submit new requests via the "Applications" section in your portal.',
          sources: ['applications'],
          isFallback: true,
          toolsUsed
        };
      }

      if (isBn) {
        let reply = `📝 **আপনার অনলাইন আবেদনসমূহ (${data.totalActive}টি প্রক্রিয়াধীন):**\n`;
        for (const app of data.applications) {
          reply += `• **${app.applicationNumber}** (${app.type}): অবস্থা **${app.status}** (বর্তমান ধাপ: ${app.currentStepRole})\n`;
        }
        return { reply: reply.trim(), sources: ['applications'], isFallback: true, toolsUsed };
      } else {
        let reply = `📝 **Your Online Applications (${data.totalActive} active):**\n`;
        for (const app of data.applications) {
          reply += `• **${app.applicationNumber}** (${app.type}): Status **${app.status}** (Currently at: ${app.currentStepRole})\n`;
        }
        return { reply: reply.trim(), sources: ['applications'], isFallback: true, toolsUsed };
      }
    }

    // 6. REQUIREMENTS / POLICIES INTENT
    if (
      lower.includes('transcript') ||
      lower.includes('certificate') ||
      lower.includes('testimonial') ||
      lower.includes('leave') ||
      lower.includes('drop') ||
      lower.includes('withdraw') ||
      lower.includes('scholarship') ||
      lower.includes('clearance') ||
      lower.includes('permission') ||
      lower.includes('requirement') ||
      lower.includes('কাগজপত্র') ||
      lower.includes('কী প্রয়োজন') ||
      lower.includes('ট্রান্সক্রিপ্ট') ||
      lower.includes('সনদ') ||
      lower.includes('ছুটি') ||
      lower.includes('বৃত্তি') ||
      lower.includes('ছাড়পত্র')
    ) {
      toolsUsed.push('getApplicationRequirements');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);

      let appType = 'transcript';
      if (lower.includes('certificate') || lower.includes('সনদ')) appType = 'certificate';
      else if (lower.includes('testimonial') || lower.includes('প্রশংসাপত্র')) appType = 'testimonial';
      else if (lower.includes('leave') || lower.includes('ছুটি')) appType = 'leave';
      else if (lower.includes('drop') || lower.includes('withdraw') || lower.includes('প্রত্যাহার')) appType = 'course_withdrawal';
      else if (lower.includes('scholarship') || lower.includes('বৃত্তি')) appType = 'scholarship';
      else if (lower.includes('clearance') || lower.includes('ছাড়পত্র')) appType = 'clearance';
      else if (lower.includes('permission') || lower.includes('অনুমতি')) appType = 'exam_permission';

      const data = AIGroundingTools.getApplicationRequirements(session, appType);

      if (isBn) {
        let reply = `📜 **${data.titleBn} সংক্রান্ত তথ্য:**\n` +
          `• অনুমোদনের ধাপসমূহ: ${data.approvalChain.join(' ➔ ')}\n` +
          `• ফি: ${data.fee.descriptionBn}\n` +
          `• প্রক্রিয়াকরণ সময়: ${data.processingDays} কার্যদিবস\n` +
          `• প্রয়োজনীয় কাগজপত্র:\n`;
        for (const doc of data.requiredDocuments) {
          reply += `  - ${doc.bn}\n`;
        }
        reply += `• যোগ্যতা: ${data.eligibilityBn}`;
        return { reply, sources: ['application_policies'], isFallback: true, toolsUsed };
      } else {
        let reply = `📜 **${data.titleEn} Policy & Requirements:**\n` +
          `• Approval Chain: ${data.approvalChain.join(' ➔ ')}\n` +
          `• Fee: ${data.fee.descriptionEn}\n` +
          `• Processing Time: ~${data.processingDays} working day(s)\n` +
          `• Required Documents:\n`;
        for (const doc of data.requiredDocuments) {
          reply += `  - ${doc.en}\n`;
        }
        reply += `• Eligibility: ${data.eligibilityEn}`;
        return { reply, sources: ['application_policies'], isFallback: true, toolsUsed };
      }
    }

    // 7. NOTICES INTENT
    if (
      lower.includes('notice') ||
      lower.includes('circular') ||
      lower.includes('announcement') ||
      lower.includes('বিজ্ঞপ্তি') ||
      lower.includes('নোটিশ')
    ) {
      toolsUsed.push('getLatestNotices');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getLatestNotices(session);

      if (isBn) {
        let reply = `📢 **জেএসটিইউ সর্বশেষ অফিশিয়াল নোটিশসমূহ:**\n`;
        for (const n of data.notices.slice(0, 4)) {
          reply += `• [${n.category}] **${n.titleBn || n.title}** (${n.publishDate}) - ${n.department}\n`;
        }
        reply += `\n*অফিশিয়াল নোটিশবোর্ড থেকে যাচাই করে নিন।*`;
        return { reply: reply.trim(), sources: ['notices'], isFallback: true, toolsUsed };
      } else {
        let reply = `📢 **Latest JSTU Official Notices:**\n`;
        for (const n of data.notices.slice(0, 4)) {
          reply += `• [${n.category}] **${n.title}** (${n.publishDate}) - Department of ${n.department}\n`;
        }
        reply += `\n*Please verify details on the official Notice Board.*`;
        return { reply: reply.trim(), sources: ['notices'], isFallback: true, toolsUsed };
      }
    }

    // 8. UNIVERSITY INFO INTENT
    if (
      lower.includes('university') ||
      lower.includes('jstu') ||
      lower.includes('campus') ||
      lower.includes('faculty') ||
      lower.includes('department') ||
      lower.includes('location') ||
      lower.includes('বিশ্ববিদ্যালয়') ||
      lower.includes('জেএসটিইউ') ||
      lower.includes('ক্যাম্পাস') ||
      lower.includes('অনুষদ') ||
      lower.includes('বিভাগ')
    ) {
      toolsUsed.push('getUniversityInfo');
      AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);
      const data = AIGroundingTools.getUniversityInfo(session);

      if (isBn) {
        const reply = `🏛️ **${data.universityName}:**\n` +
          `• প্রতিষ্ঠিত: ২০১২ খ্রিষ্টাব্দ\n` +
          `• অবস্থান: জামালপুর-২০১২, বাংলাদেশ (${data.campusSize})\n` +
          `• অনুষদসমূহ: ${data.faculties.map(f => f.nameBn).join(', ')}\n` +
          `• বিভাগসমূহ: ${data.departments.map(d => d.code).join(', ')}\n` +
          `• প্রধান দপ্তরসমূহ: রেজিস্টার দপ্তর, পরীক্ষা নিয়ন্ত্রক দপ্তর, হিসাব দপ্তর, আইসিটি সেল।`;
        return { reply, sources: ['university_info'], isFallback: true, toolsUsed };
      } else {
        const reply = `🏛️ **${data.universityName}:**\n` +
          `• Established: ${data.established}\n` +
          `• Location: ${data.location} (${data.campusSize})\n` +
          `• Key Faculties: ${data.faculties.map(f => f.name).join(', ')}\n` +
          `• Academic Departments: ${data.departments.map(d => d.code).join(', ')}\n` +
          `• Key Administrative Offices: Registrar Office, Controller of Examinations, Accounts & Finance, ICT Cell.`;
        return { reply, sources: ['university_info'], isFallback: true, toolsUsed };
      }
    }

    // DEFAULT GUIDANCE RESPONSE
    if (isBn) {
      return {
        reply: `স্বাগতম! আমি জেএসটিইউ স্মার্ট ক্যাম্পাস এআই সহকারী। আমি আপনাকে নিম্নলিখিত বিষয়ে সহায়তা করতে পারি:\n\n` +
          `• 📅 **ক্লাস রুটিন:** "আগামীকাল আমার কী ক্লাস আছে?"\n` +
          `• 📊 **উপস্থিতি:** "কোন কোর্সে আমার উপস্থিতি সবচেয়ে কম?"\n` +
          `• 🎓 **ফলাফল:** "আমার প্রকাশিত সিজিপিএ কত?"\n` +
          `• 📜 **আবেদন নিয়মাবলী:** "ট্রান্সক্রিপ্টের জন্য কী কী প্রয়োজন?"\n` +
          `• 💳 **বকেয়া ফি:** "আমার বর্তমান বকেয়া ফি কত?"\n` +
          `• 📢 **নোটিশ:** "সাম্প্রতিক পরীক্ষার নোটিশ কী?"\n\n` +
          `অনুগ্রহ করে আপনার সুনির্দিষ্ট প্রশ্নটি লিখুন।`,
        sources: [],
        isFallback: true,
        toolsUsed: []
      };
    } else {
      return {
        reply: `Hello! I am the JSTU Smart Campus AI Assistant. I can assist you with:\n\n` +
          `• 📅 **Class Routine:** "Which class do I have tomorrow?"\n` +
          `• 📊 **Attendance Tracking:** "Which course has my lowest attendance?"\n` +
          `• 🎓 **Examination Results:** "What is my latest published CGPA?"\n` +
          `• 📜 **Application Guidelines:** "What do I need for a transcript or certificate?"\n` +
          `• 💳 **Fee & Dues Status:** "What is my tuition fee status?"\n` +
          `• 📢 **Official Circulars:** "What are the latest exam notices?"\n\n` +
          `Please select a prompt chip above or type your academic question.`,
        sources: [],
        isFallback: true,
        toolsUsed: []
      };
    }
  }
}
