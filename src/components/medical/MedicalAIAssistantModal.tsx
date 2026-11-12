import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Sparkles,
  X,
  Send,
  Trash2,
  AlertTriangle,
  PhoneCall,
  Ambulance,
  ShieldAlert,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { AIChatMessage, AuthSessionContext } from '../../services/ai/aiTypes';
import { getMedicalAIService, MedicalAIServiceResponse } from '../../services/ai/medicalAIService';
import { MEDICAL_EMERGENCY_NUMBERS } from '../../services/ai/medicalAISafety';
import { HOURLY_USER_QUOTA, MAX_USER_INPUT_LENGTH } from '../../services/ai/aiGuardrails';

interface SuggestionChip {
  en: string;
  bn: string;
}

const MEDICAL_SUGGESTIONS: SuggestionChip[] = [
  { en: 'Healthy sleep tips', bn: 'স্বাস্থ্যকর ঘুমের টিপস' },
  { en: 'How do I book a doctor?', bn: 'কিভাবে ডাক্তার বুক করব?' },
  { en: 'Managing exam stress', bn: 'পরীক্ষার মানসিক চাপ নিয়ন্ত্রণ' },
  { en: 'First aid for a minor burn', bn: 'ছোটখাটো পোড়ায় প্রাথমিক চিকিৎসা' }
];

interface MedicalAIChatMessage extends AIChatMessage {
  isEmergency?: boolean;
}

interface MedicalAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalAIAssistantModal: React.FC<MedicalAIAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [messages, setMessages] = useState<MedicalAIChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState(HOURLY_USER_QUOTA);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Initial greeting (kept in browser memory only)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'med-welcome-0',
          sender: 'assistant',
          text: isBn
            ? `স্বাগতম! আমি জেএসটিইউ মেডিকেল সেন্টার স্বাস্থ্য তথ্য সহকারী। আমি সাধারণ স্বাস্থ্য সচেতনতা (ঘুম, মানসিক চাপ, মৌসুমি সর্দি, প্রাথমিক চিকিৎসা) এবং মেডিকেল সেন্টারের সেবা ও ডাক্তারদের সময়সূচী সংক্রান্ত তথ্যে সহায়তা করতে পারি।`
            : `Welcome! I am your JSTU Medical Center Health Information Assistant. I can share general wellness guidance (sleep, study-life balance, seasonal health, first aid basics) and Medical Center procedures or doctor schedules.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isBn, messages.length]);

  const handleClearChat = () => {
    setErrorNotice(null);
    setMessages([
      {
        id: `med-welcome-${Date.now()}`,
        sender: 'assistant',
        text: isBn
          ? 'চ্যাট হিস্ট্রি মুছে ফেলা হয়েছে। স্বাস্থ্য তথ্য বা সেবা সংক্রান্ত প্রশ্ন করতে পারেন।'
          : 'Chat history cleared. How can I assist with general health information today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawPrompt = textToSend || inputText;
    if (!rawPrompt.trim() || isLoading) return;

    setErrorNotice(null);
    const userMessageText = rawPrompt.trim();
    setInputText('');

    const userMsg: MedicalAIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const sessionContext: AuthSessionContext = {
      uid: profile?.uid || user?.uid || 'guest_visitor',
      role: profile?.role || 'public',
      departmentId: profile?.departmentId,
      deptId: profile?.departmentId,
      studentId: profile?.studentId,
      fullName: profile?.fullName || 'Campus Visitor',
      email: profile?.email || 'visitor@jstu.ac.bd'
    };

    try {
      const medicalService = getMedicalAIService();
      const response: MedicalAIServiceResponse = await medicalService.sendMessage(
        userMessageText,
        messages,
        sessionContext,
        language as 'en' | 'bn'
      );

      const assistantMsg: MedicalAIChatMessage = {
        id: `med-ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        isFallback: response.isFallback,
        isEmergency: response.isEmergency
      };

      setMessages(prev => [...prev, assistantMsg]);
      setRemainingQuota(prev => Math.max(0, prev - 1));
    } catch {
      setErrorNotice(
        isBn
          ? 'তথ্য প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Unable to process health query. Please try again.'
      );
      setMessages(prev => [
        ...prev,
        {
          id: `med-err-${Date.now()}`,
          sender: 'assistant',
          text: isBn
            ? 'দুঃখিত, সংযোগে ত্রুটি দেখা দিয়েছে। সাধারণ তথ্য জানতে বা জরুরি প্রয়োজনে সরাসরি মেডিকেল সেন্টারে যোগাযোগ করুন।'
            : 'Connection error. For urgent health matters, please contact the campus medical center directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="medical-ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[90vh] h-[640px]">
        {/* 1. Header with JSTU Navy Accent & Demo AI Badge */}
        <div className="px-4 py-3 bg-[#1E3A8A] text-white flex items-center justify-between border-b border-blue-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-rose-300 shadow-inner">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="medical-ai-modal-title" className="text-sm font-bold tracking-tight text-white">
                  {isBn ? 'মেডিকেল সেন্টার স্বাস্থ্য তথ্য সহকারী' : 'Medical Center AI Assistant'}
                </h3>
                <span className="px-2 py-0.5 bg-amber-400 text-gray-950 font-extrabold text-[10px] rounded-full uppercase tracking-wider shadow-xs">
                  Demo AI
                </span>
              </div>
              <p className="text-[10px] text-blue-100 flex items-center gap-1">
                <span>{isBn ? 'সাধারণ স্বাস্থ্য শিক্ষা ও সেবা নির্দেশিকা' : 'Health Wellness & Center Guide'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title={isBn ? 'চ্যাট মুছুন' : 'Clear Chat'}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title={isBn ? 'বন্ধ করুন' : 'Close'}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Permanent Mandatory Notice: "AI health information only. Not a doctor. Not for emergencies or diagnosis." */}
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-950 flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              {isBn
                ? 'এআই স্বাস্থ্য তথ্য মাত্র। কোনো ডাক্তার নয়। জরুরি পরিস্থিতি বা রোগ নির্ণয়ের জন্য প্রযোজ্য নয়।'
                : 'AI health information only. Not a doctor. Not for emergencies or diagnosis.'}
            </span>
          </div>
          <span className="text-[10px] text-amber-900 font-bold shrink-0 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-amber-700" />
            {remainingQuota}/30
          </span>
        </div>

        {/* 3. Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-[#1E3A8A] flex items-center justify-center shrink-0 mt-0.5">
                    <HeartPulse className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Urgent Emergency Card (Bypasses normal box if triggered) */}
                  {!isUser && msg.isEmergency ? (
                    <div className="p-3.5 bg-red-50 border-2 border-red-500 rounded-2xl rounded-bl-xs shadow-md text-gray-900">
                      <div className="flex items-center gap-2 text-red-700 font-bold text-xs sm:text-sm mb-2">
                        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                        <span>
                          {isBn
                            ? 'জরুরি চিকিৎসা সতর্কতা'
                            : 'This may be an emergency. Go to the nearest hospital or call local emergency services now.'}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                        {msg.text}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-red-200 flex flex-wrap gap-2 text-[11px]">
                        <a
                          href={`tel:${MEDICAL_EMERGENCY_NUMBERS.emergencyDesk}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{isBn ? 'জরুরি ডেস্ক' : 'Emergency Desk'}: {MEDICAL_EMERGENCY_NUMBERS.emergencyDesk}</span>
                        </a>
                        <a
                          href={`tel:${MEDICAL_EMERGENCY_NUMBERS.ambulance}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
                        >
                          <Ambulance className="w-3.5 h-3.5" />
                          <span>{isBn ? 'অ্যাম্বুলেন্স' : 'Ambulance'}: {MEDICAL_EMERGENCY_NUMBERS.ambulance}</span>
                        </a>
                        <a
                          href="tel:999"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-black transition-colors"
                        >
                          <span>999</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1E3A8A] text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>

                      {/* Small Footer on Assistant Answers: "General information, not medical advice" */}
                      {!isUser && (
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-slate-600 italic">
                          <span>
                            {isBn
                              ? 'সাধারণ তথ্য, চিকিৎসা উপদেশ নয়।'
                              : 'General information, not medical advice.'}
                          </span>
                          {msg.isFallback && (
                            <span className="not-italic text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-medium">
                              Rule Fallback
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-600 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Thinking / Loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-[#1E3A8A] flex items-center justify-center shrink-0">
                <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {isBn ? 'স্বাস্থ্য তথ্য পর্যালোচনা করা হচ্ছে...' : 'Reviewing general health information...'}
                </span>
              </div>
            </div>
          )}

          {/* Suggestion Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="pt-2">
              <p className="text-[11px] font-medium text-gray-600 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>{isBn ? 'প্রস্তাবিত স্বাস্থ্য প্রশ্নসমূহ:' : 'Suggested Health Topics:'}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {MEDICAL_SUGGESTIONS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(isBn ? chip.bn : chip.en)}
                    className="flex items-center justify-between text-left text-xs px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-800 hover:text-[#1E3A8A] rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer"
                  >
                    <span>{isBn ? chip.bn : chip.en}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Notice */}
        {errorNotice && (
          <div className="px-3 py-1.5 bg-red-50 border-t border-red-200 text-[11px] text-red-700 flex items-center justify-between">
            <span>{errorNotice}</span>
            <button onClick={() => setErrorNotice(null)} className="text-red-900 font-bold ml-2">×</button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isBn
                  ? 'স্বাস্থ্য সংক্রান্ত সাধারণ প্রশ্ন লিখুন (যেমন: ঘুম, স্ট্রেস, প্রাথমিক চিকিৎসা)...'
                  : 'Ask about sleep, stress, first aid, or doctor roster...'
              }
              maxLength={MAX_USER_INPUT_LENGTH}
              disabled={isLoading}
              className="w-full pl-3.5 pr-20 py-2.5 text-xs sm:text-sm bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 focus:border-[#1E3A8A] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors disabled:bg-slate-100 disabled:text-slate-600"
            />

            <div className="absolute right-1.5 flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">
                {inputText.length}/{MAX_USER_INPUT_LENGTH}
              </span>

              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="p-2 bg-[#1E3A8A] hover:bg-blue-800 disabled:bg-gray-200 text-white disabled:text-slate-600 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                aria-label="Send Health Question"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600 px-1">
            <span>
              {isBn ? 'লগ ও বার্তা সংরক্ষণ হয় না · গোপনীয় সেশন' : 'No clinical records stored · In-memory session'}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span>JSTU Medical Center</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MedicalAIAssistantFloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        aria-label="Open Medical Center AI Assistant"
        className="group relative flex items-center gap-2 px-4 py-3 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/50 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <HeartPulse className="w-5 h-5 text-rose-300 animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-tight text-white hidden sm:inline">
          {isBn ? 'স্বাস্থ্য তথ্য এআই' : 'Health AI'}
        </span>

        {/* Demo AI indicator badge */}
        <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-400 text-gray-950 rounded-full border border-white shadow-xs">
          Demo AI
        </span>

        {/* Tooltip for mobile / hover */}
        <div className="absolute right-0 bottom-full mb-2 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md backdrop-blur-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isBn ? 'মেডিকেল সেন্টার এআই সহকারী' : 'Medical Center AI Assistant'}</span>
        </div>
      </button>
    </div>
  );
};
