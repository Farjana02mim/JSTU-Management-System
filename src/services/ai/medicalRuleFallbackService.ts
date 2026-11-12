/**
 * Medical Center AI Rule-Based Fallback Service
 * 
 * Deterministic, reliable health education & medical center navigation responder.
 * Runs seamlessly when server proxy or Gemini API key is unavailable.
 * Strictly adheres to negative constraints: NO diagnosis, NO prescribing, NO personal records access.
 * 
 * // Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { AuthSessionContext, AIChatMessage, AIServiceResponse } from './aiTypes';
import { MedicalAISafety } from './medicalAISafety';
import { MedicalAITools } from './medicalAITools';

export class MedicalRuleFallbackAIService {
  /**
   * Evaluates question deterministically and synthesizes safe health guidance.
   * // Real enforcement must move to Firestore rules / Cloud Functions.
   */
  async sendMessage(
    prompt: string,
    _history: AIChatMessage[],
    session: AuthSessionContext,
    lang: 'en' | 'bn' = 'en'
  ): Promise<AIServiceResponse> {
    const isBn = lang === 'bn';
    const cleanPrompt = (prompt || '').toLowerCase().trim();

    // 1. Safety Pre-check Filter
    const safetyHit = MedicalAISafety.evaluatePreCheck(cleanPrompt, lang);
    if (safetyHit) {
      return {
        reply: safetyHit.reply,
        sources: ['medical_emergency_desk'],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 2. Specific Medicine / Dosage Request Block
    const medicineRequest = /what\s*medicine|which\s*tablet|dose|dosage|prescribe|paracetamol|antibiotic|কী\s*ঔষধ|কী\s*ওষুধ|ডোজ|প্যারাসিটামল|অ্যান্টিবায়োটিক/i;
    if (medicineRequest.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `আমি কোনো ওষুধ বা নির্দিষ্ট মাত্রার (dosage) পরামর্শ দিতে পারি না। যেকোনো অসুস্থতায় সঠিক ওষুধ ও সেবনবিধি জানার জন্য বিশ্ববিদ্যালয়ের মেডিকেল সেন্টারে চিকিৎসকের শরণাপন্ন হওয়া আবশ্যক।

মেডিকেল সেন্টারে আসার সাধারণ প্রস্তুতি:
• আপনার স্টুডেন্ট আইডি কার্ড সঙ্গে আনুন।
• বর্তমান শারীরিক অনুভূতি এবং পূর্বের প্রেসক্রিপশন থাকলে ডাক্তারকে জানান।
• /student/medical পোর্টাল থেকে অথবা সরাসরি সেন্টারে উপস্থিত হয়ে ডাক্তার দেখাতে পারেন।

When to see a doctor: লক্ষণ স্থায়ী হলে বা তীব্র হলে বিলম্ব না করে চিকিৎসকের সাথে দেখা করুন।

General information, not medical advice.`
          : `I cannot recommend specific medicines, dosages, or schedules. Safe and effective medical treatment requires a physical examination and direct clinical judgment by a licensed physician.

To consult a doctor at the JSTU Medical Center:
• Bring your Student ID card.
• Book a slot online at /student/medical or walk in to the outpatient desk during open hours.
• Free essential medicines from the university dispensary are provided strictly per the doctor's prescription.

When to see a doctor: If symptoms persist or cause discomfort, please consult our campus medical officers promptly.

General information, not medical advice.`,
        sources: ['medical_services_policy'],
        isFallback: true,
        toolsUsed: ['getMedicalCenterInfo']
      };
    }

    // 3. Appointment Inquiry for Authenticated Patient
    if (/my\s*appointment|my\s*booking|আমার\s*অ্যাপয়েন্টমেন্ট|আমার\s*বুকিং/i.test(cleanPrompt)) {
      const toolRes = MedicalAITools.getMyAppointments(session);
      let replyText = '';

      if (toolRes.appointments.length === 0) {
        replyText = isBn
          ? `আপনার বর্তমানে কোনো নির্ধারিত মেডিকেল অ্যাপয়েন্টমেন্ট নেই।

নতুন অ্যাপয়েন্টমেন্ট বুক করার নিয়ম:
১. /student/medical পেজে যান।
২. ডাক্তার ও উপযুক্ত সময় বেছে নিন।
৩. সংক্ষেপে কারণ লিখে সাবমিট করুন।

General information, not medical advice.`
          : `You currently have no scheduled medical appointments.

How to book an appointment:
1. Navigate to the /student/medical portal page.
2. Select an available doctor (or any doctor), date, and open time slot.
3. Provide a brief reason (up to 300 characters) and submit.

General information, not medical advice.`;
      } else {
        const listText = toolRes.appointments
          .map((a, i) => `${i + 1}. Dr. ${a.doctorName} | Date: ${a.date} (${a.timeSlot}) - Status: ${a.status}`)
          .join('\n');

        replyText = isBn
          ? `আপনার বর্তমান অ্যাপয়েন্টমেন্টের তালিকা:
${listText}

গোপনীয়তা সুরক্ষা: ব্যক্তিগত প্রেসক্রিপশন ও ভিজিট নোট শুধুমাত্র মেডিকেল পোর্টাল থেকে ব্যক্তিগতভাবে দেখা যাবে।

General information, not medical advice.`
          : `Here are your scheduled appointments:
${listText}

Privacy protection: Clinical visit notes and prescriptions are strictly private and can only be viewed inside your personal medical portal.

General information, not medical advice.`;
      }

      return {
        reply: replyText,
        sources: ['my_appointments_records'],
        isFallback: true,
        toolsUsed: ['getMyAppointments']
      };
    }

    // 4. Booking, Cancellation & Rescheduling Guidance
    if (/book|how\s*to\s*book|cancel|reschedule|বুক|কিভাবে\s*বুক|বাতিল|পুনঃনির্ধারণ/i.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `জেএসটিইউ মেডিকেল সেন্টারে অ্যাপয়েন্টমেন্ট বুকিং প্রক্রিয়া:
১. **বুকিং:** /student/medical পেজে যান -> ডাক্তার নির্বাচন করুন -> তারিখ ও সময় বেছে নিন -> আবেদন নিশ্চিত করুন।
২. **বাতিল বা পরিবর্তন:** একই পোর্টাল পেজের 'আমার অ্যাপয়েন্টমেন্টস' ট্যাবে গিয়ে 'Cancel' বা 'Reschedule' বাটনে ক্লিক করুন।
৩. **জরুরি অবস্থা:** জরুরি চিকিৎসায় অ্যাপয়েন্টমেন্ট ছাড়াই সরাসরি মেডিকেল সেন্টারের ইমার্জেন্সি ডেস্কে চলে আসুন।

General information, not medical advice.`
          : `How to book, cancel, or reschedule an appointment:
1. **Booking:** Visit /student/medical -> Select a doctor or "Any available" -> Choose an open slot -> Confirm your booking.
2. **Cancellation / Rescheduling:** In the "My Appointments" tab on the same page, click "Cancel" or "Reschedule".
3. **Walk-ins & Emergencies:** For acute illnesses or emergencies, walk in directly to the Emergency Room without an appointment.

General information, not medical advice.`,
        sources: ['medical_appointment_guide'],
        isFallback: true,
        toolsUsed: ['getMedicalCenterInfo']
      };
    }

    // 5. Roster & Doctors Information
    if (/doctor|duty|roster|specialist|ডাক্তার|রোস্টার|ডিউটি|বিশেষজ্ঞ/i.test(cleanPrompt)) {
      const roster = MedicalAITools.getDutyRoster();
      const docList = roster.doctors
        .map(d => `• ${d.name} (${d.specialty}) - Chamber: ${d.room} - Days: ${d.dutyDays.join(', ')}`)
        .join('\n');

      return {
        reply: isBn
          ? `জেএসটিইউ মেডিকেল সেন্টারের কর্তব্যরত চিকিৎসকদের তালিকা:
${docList}

বিস্তারিত রোস্টার ও সময়সূচী মেডিকেল সেন্টারের নোটিশ বোর্ড এবং /medical-center পেজের 'Doctors' ট্যাবে পাওয়া যাবে।

General information, not medical advice.`
          : `JSTU Medical Center Duty Doctors Roster:
${docList}

You can view complete day-by-day shift schedules on the /medical-center public page under the "Doctors" tab.

General information, not medical advice.`,
        sources: ['duty_roster'],
        isFallback: true,
        toolsUsed: ['getDutyRoster']
      };
    }

    // 6. Healthy Sleep Tips
    if (/sleep|insomnia|rest|ঘুম|অনিদ্রা/i.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `সুস্থ ও সতেজ ঘুমের জন্য বৈজ্ঞানিক স্বাস্থ্য টিপস:
• **নির্দিষ্ট সময়সূচী:** প্রতিদিন একই সময়ে ঘুমাতে যান এবং সকালে নির্দিষ্ট সময়ে উঠুন।
• **স্ক্রিন বিরতি:** ঘুমানোর অন্তত ৩০-৪৫ মিনিট আগে ফোন, ল্যাপটপ বা নীল আলোর পর্দা বন্ধ রাখুন।
• **ক্যাফেইন পরিহার:** বিকাল ও সন্ধ্যার পর চা, কফি বা এনার্জি ড্রিংক এড়িয়ে চলুন।
• **ঘুমের পরিবেশ:** ঘর শান্ত, অন্ধকার এবং আরামদায়ক তাপমাত্রায় রাখুন।
• **পরীক্ষার সময়ের অভ্যাস:** পরীক্ষার আগের রাতে সম্পূর্ণ নির্ঘুম না থেকে অন্তত ৬-৭ ঘণ্টা বিশ্রাম নেওয়া স্মৃতিকৌশল বৃদ্ধিতে সাহায্য করে।

When to see a doctor: অনিদ্রা যদি দুই সপ্তাহের বেশি সময় ধরে পড়াশোনা ও দৈনন্দিন জীবনে ব্যাঘাত ঘটায়, তবে মেডিকেল সেন্টারের কাউন্সিলর বা ডাক্তারের পরামর্শ নিন।

General information, not medical advice.`
          : `Healthy Sleep Hygiene for Students:
• **Consistent Rhythm:** Go to bed and wake up at roughly the same time every day, even on weekends.
• **Screen Curfew:** Turn off blue-light phone screens and laptops 30-45 minutes before sleep.
• **Caffeine Timing:** Avoid coffee, strong tea, and energy drinks after late afternoon.
• **Restful Environment:** Keep your study/bedroom cool, dark, and well-ventilated.
• **Exam Rest:** Cramming all night reduces memory retention; 6 to 8 hours of sleep consolidates memory and improves cognitive performance.

When to see a doctor: If insomnia or chronic fatigue persists for more than two weeks, consult our campus clinical counselor or medical officers.

General information, not medical advice.`,
        sources: ['wellness_education_sleep'],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 7. Exam Stress & Mental Wellbeing
    if (/stress|anxiety|depression|exam\s*stress|মানসিক\s*চাপ|উদ্বেগ|দুশ্চিন্তা/i.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `পরীক্ষার মানসিক চাপ ও দুশ্চিন্তা নিয়ন্ত্রণের স্বাস্থ্য টিপস:
• **পরিকল্পিত বিরতি:** টানা পড়ার পরিবর্তে পোমোডোরো পদ্ধতি (২৫ মিনিট পড়া, ৫ মিনিট বিরতি) অনুসরণ করুন।
• **শ্বাস-প্রশ্বাসের ব্যায়াম:** গভীর শ্বাস নিন (৪ সেকেন্ড শ্বাস গ্রহণ, ৪ সেকেন্ড ধারণ, ৪ সেকেন্ডে শ্বাস ত্যাগ) - এটি তাৎক্ষণিক স্নায়ু শান্ত করে।
• **শরীরচর্চা ও হাঁটা:** প্রতিদিন ১৫-২০ মিনিট খোলা বাতাসে হাঁটুন।
• **কথা বলুন:** বন্ধুদের সাথে কথা বলুন এবং নিজের অনুভূতির কথা শেয়ার করুন।
• **ক্যাম্পাস কাউন্সিলিং:** জেএসটিইউ মেডিকেল সেন্টারের কক্ষ ২০২-এ ক্লিনিক্যাল কাউন্সিলর প্রতি রবি, মঙ্গল ও বৃহস্পতিবার সকাল ১০:০০ - বিকাল ৪:০০ পর্যন্ত পরামর্শ দিয়ে থাকেন।

When to see a doctor: অতিরিক্ত মানসিক চাপ, প্যানিক আক্রমণ বা অনুভূতি নিয়ন্ত্রণে না এলে অবিলম্বে ক্লিনিক্যাল কাউন্সিলরের সাহায্য নিন।

General information, not medical advice.`
          : `Managing Academic Stress & Exam Anxiety:
• **Paced Study Intervals:** Break revision into manageable chunks (e.g., the Pomodoro technique: 25 minutes focused study, 5-minute break).
• **Box Breathing:** Inhale deeply for 4 seconds, hold for 4 seconds, exhale gently for 4 seconds. This rapidly calms the autonomic nervous system.
• **Physical Movement:** A 15-minute brisk walk across campus releases endorphins and reduces tension.
• **Social Connection:** Share your feelings with a trusted classmate or family member.
• **Campus Counseling:** JSTU provides free, confidential mental health counseling in Room 202 (Sun, Tue, Thu: 10:00 AM - 4:00 PM).

When to see a doctor: If anxiety feels unmanageable, triggers panic attacks, or interferes with eating or sleep, please meet our campus counselor.

General information, not medical advice.`,
        sources: ['mental_wellbeing_guide'],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 8. First Aid for Minor Burn
    if (/burn|scald|পোড়া|হাত\s*পুড়ে/i.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `ছোটখাটো অগভীর পোড়ার তাৎক্ষণিক প্রাথমিক চিকিৎসা (First Aid):
১. **ঠান্ডা পানি প্রবাহ:** পোড়া স্থানটিতে অবিলম্বে কলের স্বাভাবিক ঠান্ডা পানি টানা ১০-১৫ মিনিট ধরে ঢালুন। (বরফ বা অতিরিক্ত ঠান্ডা পানি সরাসরি লাগাবেন না)।
২. **যা করবেন না:** টুথপেস্ট, তেল, ডিমের সাদা অংশ বা মাখন লাগাবেন না; এতে ইনফেকশন হতে পারে।
৩. **ফোস্কা গলাবেন না:** কোনো ফোস্কা উঠলে তা ফাটাবেন না, কারণ এটি চামড়ার প্রাকৃতিক সুরক্ষা।
৪. **পরিষ্কার ব্যান্ডেজ:** পরিষ্কার জীবাণুমুক্ত গজ বা সুতি কাপড় দিয়ে আলতো করে ঢেকে রাখুন।

When to see a doctor: যদি পোড়া স্থান বড় হয়, মুখ বা জয়েন্টে হয়, অথবা তীব্র ব্যথা বা পুঁজ দেখা দেয়, তবে দ্রুত মেডিকেল সেন্টারের জরুরি ডেস্কে চলে আসুন।

General information, not medical advice.`
          : `First Aid for a Minor Burn:
1. **Cool Water Immediately:** Hold the affected area under gentle, cool running tap water for 10-15 minutes. (Do NOT apply ice directly, as extreme cold damages delicate skin tissue).
2. **What NOT to do:** Do NOT apply toothpaste, butter, oils, or raw egg, as these trap heat and promote severe bacterial infection.
3. **Leave Blisters Intact:** Never puncture or pop blisters; the skin bubble serves as a natural sterile barrier.
4. **Gentle Cover:** Cover the burn loosely with a clean, sterile non-stick bandage or clean cloth.

When to see a doctor: If the burn is larger than 2 inches, involves the face, hands, or joints, or shows signs of blistering or infection, visit the JSTU Medical Center immediately.

General information, not medical advice.`,
        sources: ['first_aid_education'],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 9. Common Seasonal Illnesses (Cold, Flu, Hydration, Prevention)
    if (/cold|flu|fever|cough|sore\s*throat|ঠান্ডা|কাশি|জ্বর|গলা\s*ব্যথা/i.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `মৌসুমি সর্দি, সাধারণ জ্বর ও কাশির ক্ষেত্রে সাধারণ স্বাস্থ্য সচেতনতা:
• **পর্যাপ্ত বিশ্রাম:** শরীরকে ভাইরাসের বিরুদ্ধে লড়তে পর্যাপ্ত ঘুমের সুযোগ দিন।
• **তরল গ্রহণ:** প্রচুর কুসুম গরম পানি, স্যুপ, লেবু চা ও ওরাল স্যালাইন পান করে হাইড্রেটেড থাকুন।
• **লবণ পানিতে গার্গল:** হালকা গরম পানিতে সামান্য লবণ মিশিয়ে দিনে ২-৩ বার কুলকুচি করলে গলার অস্বস্তি কমে।
• **হাইজিন:** নিয়মিত সাবান দিয়ে হাত ধোবেন এবং হাঁচি-কাশির সময় রুমাল বা কনুই ব্যবহার করবেন।

When to see a doctor: জ্বর যদি ১০২° ফারেনহাইটের বেশি হয়, ৩ দিনের বেশি স্থায়ী হয়, অথবা তীব্র শ্বাসকষ্ট বা বুক ব্যথা থাকে, তবে অবিলম্বে মেডিকেল সেন্টারের চিকিৎসকের কাছে যান।

General information, not medical advice.`
          : `General Care for Seasonal Colds & Viral Flu:
• **Plenty of Rest:** Allow your body energy to recover by resting and avoiding strenuous activity.
• **Warm Hydration:** Drink plenty of warm water, clear soups, herbal tea, or electrolyte fluids to stay well hydrated.
• **Warm Salt Water Gargle:** Gargling with warm salt water 2-3 times a day helps soothe an irritated throat.
• **Respiratory Hygiene:** Wash hands frequently with soap and cover coughs with your elbow to prevent spreading germs across the campus dorms.

When to see a doctor: Seek medical attention if a fever exceeds 102°F (38.9°C), lasts more than 3 days, or is accompanied by chest tightness or breathing difficulty.

General information, not medical advice.`,
        sources: ['seasonal_illness_prevention'],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 10. Medical Rest Certificates & Leave Workflow
    if (/certificate|leave|rest|ছুটি|সনদ|মেডিকেল\s*সার্টিফিকেট/i.test(cleanPrompt)) {
      return {
        reply: isBn
          ? `জেএসটিইউ মেডিকেল রেস্ট সার্টিফিকেট ও ছুটির নীতিমালা:
১. **সনদ প্রদান:** মেডিকেল সেন্টারে চিকিৎসক রোগী পরীক্ষার পর প্রয়োজনবোধে বিশ্রামের দিন (sick-rest days) উল্লেখ করে ডিজিটাল রেস্ট সার্টিফিকেট ইস্যু করেন।
২. **গোপনীয়তা সুরক্ষা:** সার্টিফিকেটে কোনো ডায়াগনোসিস বা রোগ সংক্রান্ত সংবেদনশীল বিবরণ থাকে না—কেবল শিক্ষার্থীর নাম, আইডি, অনুমোদিত বিশ্রামের সময়কাল এবং চিকিৎসকের তথ্য থাকে।
৩. **যাচাই ও ছুটির আবেদন:** প্রতিটি সার্টিফিকেটের একটি অনন্য ভেরিফিকেশন আইডি থাকে যা /verify/medical পেজে কিউআর কোড স্ক্যান করে তাৎক্ষণিক যাচাই করা যায়। শিক্ষার্থী এই সার্টিফিকেট দিয়ে পোর্টাল থেকে ছুটির আবেদন করতে পারেন।

General information, not medical advice.`
          : `JSTU Medical Rest Certificates & Leave Workflow:
1. **Issuance:** Following a completed clinical examination, a university Medical Officer may issue a digital Medical Rest Certificate specifying recommended rest days.
2. **Privacy by Design:** In strict adherence to student privacy, certificates contain NO diagnostic descriptions or private health details—they certify only student identity, excused rest dates, and the physician's designation.
3. **Verification & Excused Absence:** Every certificate carries a unique 128-bit verification ID verifiable at /verify/medical. Students can submit it through the portal leave application workflow for department approval.

General information, not medical advice.`,
        sources: ['medical_certificates_policy'],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 11. General Center Overview & Hours
    const centerInfo = MedicalAITools.getMedicalCenterInfo();
    return {
      reply: isBn
        ? `জেএসটিইউ মেডিকেল সেন্টারের সাধারণ তথ্যাবলী:
• **অবস্থান:** ${centerInfo.location}
• **খোলা থাকার সময়:** ${centerInfo.openingHours}
• **জরুরি হটলাইন:** ${centerInfo.emergencyDesk}
• **অ্যাম্বুলেন্স:** ${centerInfo.ambulanceHotline}

আমি শিক্ষার্থীদের সাধারণ সুস্থতা, ঘুম, মানসিক চাপ ব্যবস্থাপনা, প্রাথমিক চিকিৎসা এবং মেডিকেল সেন্টারের সেবা সম্পর্কে সাধারণ তথ্য দিতে পারি। আপনার সুনির্দিষ্ট প্রশ্নটি লিখুন।

General information, not medical advice.`
        : `Jamalpur Science & Technology University Medical Center:
• **Location:** ${centerInfo.location}
• **Hours:** ${centerInfo.openingHours}
• **Emergency Desk:** ${centerInfo.emergencyDesk}
• **Ambulance:** ${centerInfo.ambulanceHotline}

I can help with general wellness guidance (sleep, study-life balance, hydration, first aid basics) and Medical Center procedures. How can I assist you today?

General information, not medical advice.`,
      sources: ['medical_center_info'],
      isFallback: true,
      toolsUsed: ['getMedicalCenterInfo']
    };
  }
}
