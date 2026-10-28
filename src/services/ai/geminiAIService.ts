/**
 * JSTU Gemini AI Service
 * 
 * Client-side AIService implementation.
 * Connects to server-side `/api/ai/chat` (where @google/genai operates securely with process.env.GEMINI_API_KEY).
 * Automatically and seamlessly fails over to RuleBasedFallbackAIService if the server or model is offline.
 * 
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { AIService, AIServiceResponse, AIChatMessage, AuthSessionContext } from './aiTypes';
import { RuleBasedFallbackAIService } from './ruleBasedFallbackService';
import { AIGuardrails } from './aiGuardrails';

export class GeminiAIService implements AIService {
  private fallbackService = new RuleBasedFallbackAIService();

  /**
   * Sends user prompt with defense guards and session grounding.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  async sendMessage(
    prompt: string,
    history: AIChatMessage[],
    session: AuthSessionContext,
    lang?: 'en' | 'bn'
  ): Promise<AIServiceResponse> {
    // 1. Sanitize input & enforce character limits
    const sanitized = AIGuardrails.sanitizeInput(prompt);
    if (sanitized.error && sanitized.text.length === 0) {
      return {
        reply: lang === 'bn' ? 'অনুগ্রহ করে একটি বৈধ প্রশ্ন লিখুন।' : 'Please enter a valid academic question.',
        sources: [],
        isFallback: true,
        toolsUsed: []
      };
    }

    const cleanPrompt = sanitized.text;

    // 2. Check and enforce hourly quota (30 messages/hour)
    const quotaCheck = AIGuardrails.checkAndIncrementQuota(session.uid);
    if (!quotaCheck.allowed) {
      return {
        reply: lang === 'bn'
          ? `প্রতি ঘণ্টার এআই প্রশ্নসীমা (৩০টি/ঘণ্টা) অতিক্রান্ত হয়েছে। দয়া করে ${quotaCheck.resetInMinutes} মিনিট অপেক্ষা করুন অথবা পোর্টাল লিঙ্ক ব্যবহার করুন।`
          : quotaCheck.errorMessage || 'Hourly AI quota reached. Please try again later.',
        sources: [],
        isFallback: true,
        toolsUsed: []
      };
    }

    // 3. Attempt server-side Gemini API call
    try {
      const response = await fetch('/api/ai/chat', {
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
            uid: session.uid,
            role: session.role,
            departmentId: session.departmentId || session.deptId,
            studentId: session.studentId,
            fullName: session.fullName,
            email: session.email
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
            toolsUsed: Array.isArray(data.toolsUsed) ? data.toolsUsed : []
          };
        }
      }
    } catch {
      // Server unreachable or proxy not running -> seamless fallback below
    }

    // 4. Graceful Fallback Mode: executes ground tools locally without live model
    return await this.fallbackService.sendMessage(cleanPrompt, history, session, lang);
  }
}

// Singleton helper
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new GeminiAIService();
  }
  return aiServiceInstance;
}
