/**
 * JSTU Medical AI Service (Client Side)
 * 
 * Communicates with server-side `/api/ai/medical-chat`.
 * Incorporates:
 * 1. Sanitization and input limit (500 chars).
 * 2. Per-user quota check (30 messages per hour).
 * 3. Client-side instant pre-check for emergency red flags and crises.
 * 4. Resilient failover to MedicalRuleFallbackAIService if server or Gemini is unreachable.
 * 
 * // Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { AIService, AIServiceResponse, AIChatMessage, AuthSessionContext } from './aiTypes';
import { MedicalAISafety } from './medicalAISafety';
import { MedicalRuleFallbackAIService } from './medicalRuleFallbackService';
import { AIGuardrails } from './aiGuardrails';

export interface MedicalAIServiceResponse extends AIServiceResponse {
  isEmergency?: boolean;
  emergencyContacts?: {
    emergencyDesk: string;
    ambulance: string;
    nationalHelpline: string;
    counselingHelpline: string;
  };
}

export class MedicalAIService implements AIService {
  private fallbackService = new MedicalRuleFallbackAIService();

  /**
   * Sends health information prompt with safety checks and session grounding.
   * // Real enforcement must move to Firestore rules / Cloud Functions.
   */
  async sendMessage(
    prompt: string,
    history: AIChatMessage[],
    session: AuthSessionContext,
    lang?: 'en' | 'bn'
  ): Promise<MedicalAIServiceResponse> {
    const isBn = lang === 'bn';

    // 1. Sanitize input & enforce character limit (500 characters)
    const sanitized = AIGuardrails.sanitizeInput(prompt);
    if (sanitized.error && sanitized.text.length === 0) {
      return {
        reply: isBn
          ? 'অনুগ্রহ করে স্বাস্থ্য তথ্য বা মেডিকেল সেন্টার সংক্রান্ত একটি প্রশ্ন লিখুন।'
          : 'Please enter a health information or Medical Center query.',
        sources: [],
        isFallback: true,
        toolsUsed: []
      };
    }

    const cleanPrompt = sanitized.text;

    // 2. Client-side Emergency Pre-check (Immediate fast response)
    const instantPreCheck = MedicalAISafety.evaluatePreCheck(cleanPrompt, lang);
    if (instantPreCheck) {
      return {
        reply: instantPreCheck.reply,
        sources: ['medical_emergency_desk'],
        isFallback: true,
        toolsUsed: [],
        isEmergency: instantPreCheck.urgentCard,
        emergencyContacts: instantPreCheck.emergencyContacts
      };
    }

    // 3. Quota check (30 messages per hour)
    const quotaCheck = AIGuardrails.checkAndIncrementQuota(session.uid || 'guest_visitor');
    if (!quotaCheck.allowed) {
      return {
        reply: isBn
          ? `প্রতি ঘণ্টার প্রশ্নসীমা (৩০টি) অতিক্রান্ত হয়েছে। অনুগ্রহ করে ${quotaCheck.resetInMinutes} মিনিট অপেক্ষা করুন অথবা মেডিকেল সেন্টারে সরাসরি যোগাযোগ করুন।`
          : quotaCheck.errorMessage || 'Hourly AI quota reached (30 messages/hour). Please try again later.',
        sources: [],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 4. Attempt server-side Gemini API call
    try {
      const response = await fetch('/api/ai/medical-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: cleanPrompt,
          history: history.slice(-6).map(m => ({
            sender: m.sender,
            text: m.text
          })),
          session: {
            uid: session.uid || 'guest_visitor',
            role: session.role || 'public',
            departmentId: session.departmentId || session.deptId,
            studentId: session.studentId,
            fullName: session.fullName || 'Campus Visitor',
            email: session.email || 'visitor@jstu.ac.bd'
          },
          lang: lang || 'en'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          return {
            reply: data.reply,
            sources: Array.isArray(data.sources) ? data.sources : [],
            isFallback: !!data.isFallback,
            toolsUsed: Array.isArray(data.toolsUsed) ? data.toolsUsed : [],
            isEmergency: !!data.isEmergency,
            emergencyContacts: data.emergencyContacts
          };
        }
      }
    } catch {
      // Server unreachable or proxy not running -> seamless fallback below
    }

    // 5. Deterministic fallback mode
    const fallbackRes = await this.fallbackService.sendMessage(cleanPrompt, history, session, lang);
    return {
      ...fallbackRes,
      isEmergency: false
    };
  }
}

// Singleton helper
let medicalAIServiceInstance: MedicalAIService | null = null;

export function getMedicalAIService(): MedicalAIService {
  if (!medicalAIServiceInstance) {
    medicalAIServiceInstance = new MedicalAIService();
  }
  return medicalAIServiceInstance;
}
