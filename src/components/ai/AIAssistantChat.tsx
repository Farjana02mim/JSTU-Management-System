import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { AIChatMessage, AuthSessionContext } from '../../services/ai/aiTypes';
import { getAIService } from '../../services/ai/geminiAIService';
import { HOURLY_USER_QUOTA, MAX_USER_INPUT_LENGTH } from '../../services/ai/aiGuardrails';

interface SuggestionChip {
  en: string;
  bn: string;
}

const DEFAULT_SUGGESTIONS: SuggestionChip[] = [
  { en: 'Which class do I have tomorrow?', bn: 'আগামীকাল আমার কী ক্লাস আছে?' },
  { en: 'Which course has my lowest attendance?', bn: 'কোন কোর্সে আমার উপস্থিতি সবচেয়ে কম?' },
  { en: 'What do I need for a transcript?', bn: 'ট্রান্সক্রিপ্টের জন্য কী কী প্রয়োজন?' },
  { en: 'What is my fee / dues status?', bn: 'আমার বকেয়া ফি কত?' },
  { en: 'What are the latest exam notices?', bn: 'পরীক্ষা সংক্রান্ত সাম্প্রতিক নোটিশ কী?' },
  { en: 'What is the approval chain for leave?', bn: 'ছুটির অনুমোদনের ধাপ কী?' }
];

export const AIAssistantChat: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
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

  // Initial welcome message (Lost on session reload or clear chat)
  useEffect(() => {
    if (messages.length === 0 && profile) {
      setMessages([
        {
          id: 'welcome-0',
          sender: 'assistant',
          text: isBn
            ? `👋 স্বাগতম **${profile.fullName}**! আমি জেএসটিইউ ক্যাম্পাস সহকারী। আমি আপনার ক্লাসের রুটিন, উপস্থিতি, প্রকাশিত পরীক্ষার ফলাফল, ফি এবং বিভিন্ন সনদের আবেদন নিয়মাবলী সংক্রান্ত তথ্যে সহায়তা করতে পারি।`
            : `👋 Welcome, **${profile.fullName}**! I am your JSTU Smart Campus Assistant. I can assist you with your routine, course attendance, published results, fee status, and application procedures.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [profile, isBn, messages.length]);

  const handleClearChat = () => {
    setErrorNotice(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: isBn
          ? 'চ্যাট হিস্ট্রি মুছে ফেলা হয়েছে। আপনি নতুন কোনো তথ্য জানতে প্রশ্ন করতে পারেন।'
          : 'Chat history cleared. How may I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawPrompt = textToSend || inputText;
    if (!rawPrompt.trim() || isLoading || !profile) return;

    setErrorNotice(null);
    const userMessageText = rawPrompt.trim();
    setInputText('');

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const sessionContext: AuthSessionContext = {
      uid: profile.uid || user?.uid || 'demo_user',
      role: profile.role,
      departmentId: profile.departmentId,
      deptId: profile.departmentId,
      studentId: profile.studentId,
      fullName: profile.fullName,
      email: profile.email
    };

    try {
      const aiService = getAIService();
      const response = await aiService.sendMessage(
        userMessageText,
        messages,
        sessionContext,
        language as 'en' | 'bn'
      );

      const assistantMsg: AIChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        isFallback: response.isFallback
      };

      setMessages(prev => [...prev, assistantMsg]);
      setRemainingQuota(prev => Math.max(0, prev - 1));
    } catch (err: unknown) {
      const errString = err instanceof Error ? err.message : String(err);
      setErrorNotice(errString);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: isBn
            ? 'দুঃখিত, তথ্য পর্যালোচনায় সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।'
            : 'An unexpected error occurred while querying university records. Please try again.',
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

  // Only render if a user is logged in
  if (!profile) return null;

  return (
    <>
      {/* 1. Floating Launch Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          className="group relative flex items-center justify-center p-3.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/40 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <div className="relative">
            {isOpen ? (
              <X className="w-6 h-6 transition-transform transform rotate-0" />
            ) : (
              <Sparkles className="w-6 h-6 animate-pulse" />
            )}
          </div>
          
          {/* Subtle Demo AI indicator badge */}
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-400 text-gray-900 rounded-full border border-white shadow-xs">
            Demo
          </span>

          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md backdrop-blur-xs flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-blue-300" />
              <span>{isBn ? 'জেএসটিইউ এআই সহকারী' : 'JSTU AI Assistant'}</span>
            </div>
          )}
        </button>
      </div>

      {/* 2. Chat Panel Drawer / Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="ai-assistant-title"
          className="fixed bottom-22 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[430px] h-[580px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white flex items-center justify-between border-b border-blue-700/50 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-300/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="ai-assistant-title" className="text-sm font-bold tracking-tight text-white">
                    {isBn ? 'জেএসটিইউ ক্যাম্পাস সহকারী' : 'JSTU Campus AI'}
                  </h3>
                  <span className="px-1.5 py-0.5 bg-amber-400/90 text-gray-950 font-bold text-[10px] rounded-full uppercase tracking-wider">
                    Demo AI
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>{isBn ? 'গ্রাউন্ডেড ও সুরক্ষিত' : 'Secure & Grounded'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title={isBn ? 'চ্যাট মুছুন' : 'Clear Chat'}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title={isBn ? 'বন্ধ করুন' : 'Close'}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Official Disclaimer Banner */}
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200/70 text-[11px] text-amber-900 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                {isBn
                  ? 'এআই উত্তর নির্ভুল নাও হতে পারে; অফিশিয়াল নোটিশ যাচাই করুন।'
                  : 'AI answers may be wrong; check official notices.'}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-medium shrink-0 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {remainingQuota}/30
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>

                      {/* Source attribution line */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-gray-100 flex flex-wrap items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <span className="text-gray-400">
                            {isBn ? 'উৎস ভিত্তি:' : 'Based on:'}
                          </span>
                          {msg.sources.map((src) => (
                            <span
                              key={src}
                              className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded text-[10px] font-mono"
                            >
                              {src.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Offline Fallback indicator */}
                      {!isUser && msg.isFallback && (
                        <div className="mt-1 text-[9px] text-gray-400 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{isBn ? 'অফলাইন নিয়মভিত্তিক উত্তর' : 'Verified Rule Engine'}</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 border border-gray-300 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {isBn ? 'উপাত্ত যাচাই ও পর্যালোচনা করা হচ্ছে...' : 'Verifying university records...'}
                  </span>
                </div>
              </div>
            )}

            {/* Suggestion Chips (Visible when history is short) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-blue-600" />
                  <span>{isBn ? 'প্রস্তাবিত প্রশ্নাবলী:' : 'Suggested Questions:'}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_SUGGESTIONS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(isBn ? chip.bn : chip.en)}
                      className="text-left text-xs px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-98"
                    >
                      {isBn ? chip.bn : chip.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="px-3 py-1 bg-red-50 border-t border-red-200 text-[11px] text-red-700 flex items-center justify-between">
              <span>{errorNotice}</span>
              <button onClick={() => setErrorNotice(null)} className="text-red-900 font-bold ml-2">×</button>
            </div>
          )}

          {/* Input Area */}
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
                    ? 'আপনার প্রশ্ন লিখুন (যেমন: রুটিন, ফলাফল, সনদ)...'
                    : 'Ask about routine, attendance, results, fees...'
                }
                maxLength={MAX_USER_INPUT_LENGTH}
                disabled={isLoading}
                className="w-full pl-3.5 pr-20 py-2.5 text-xs sm:text-sm bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 focus:border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors disabled:opacity-50"
              />

              <div className="absolute right-1.5 flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                  {inputText.length}/{MAX_USER_INPUT_LENGTH}
                </span>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputText.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  aria-label="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 px-1">
              <span>
                {isBn ? 'নিরাপদ সেশন · লগ সংরক্ষণ হয় না' : 'Read-only · Session isolated'}
              </span>
              <span className="flex items-center gap-1">
                <span>JSTU Smart Campus</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
