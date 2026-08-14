'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import SaraText from '@/app/components/SaraText';
import { findMatchingTutorials, type Tutorial } from '@/lib/tutorial-matcher';
import { matchTopic, getTeachingFallbackResponse, type Topic } from '@/lib/sara-topics';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  topics?: Topic[];
  suggestedTutorials?: Tutorial[];
  showAudioPrompt?: boolean;
  timestamp: Date;
};

const WELCOME_TEXT = "Hi! I'm Sara, your TallyPrime learning assistant. I can walk you through GST setup, invoicing, inventory, payroll, bank reconciliation, reports, and much more. What would you like to learn today?";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function LearnSaraPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAudioPromptId, setShowAudioPromptId] = useState<string | null>(null);
  const [autoPlayMode, setAutoPlayMode] = useState<'summary' | 'full' | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll while the chat sheet is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Load tutorials
  useEffect(() => {
    fetch('/api/tutorials')
      .then(r => r.json())
      .then(data => { if (data && !data.error) setTutorials(data); })
      .catch(() => {});
  }, []);

  // Load voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const playVoiceResponse = useCallback((text: string, isFullResponse: boolean) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !voiceEnabled) return;

    window.speechSynthesis.cancel();

    let cleanText = text
      .replace(/\[\[.*?\|.*?\]\]/g, '')
      .replace(/\*/g, '')
      .replace(/[\[\]#`]/g, '')
      .trim();

    if (!isFullResponse) {
      const sentences = cleanText.split(/([.!?]+)/).filter(s => s.trim().length > 0);
      let summaryText = '';
      let sentenceCount = 0;
      for (let i = 0; i < sentences.length; i++) {
        summaryText += sentences[i];
        if (/[.!?]/.test(sentences[i])) {
          sentenceCount++;
          if (sentenceCount >= 3) break;
        }
      }
      cleanText = summaryText;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const preferredVoice = voices.find(v =>
      v.name.includes('Google') &&
      (v.name.includes('US') || v.name.includes('UK') || v.name.includes('India'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices, voiceEnabled]);

  // Welcome message on mount
  useEffect(() => {
    setIsTyping(true);
    const t = setTimeout(() => {
      const id = uid();
      setMessages([{
        id,
        role: 'assistant',
        text: WELCOME_TEXT,
        showAudioPrompt: true,
        timestamp: new Date()
      }]);
      setShowAudioPromptId(id);
      setIsTyping(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll — aggressively scroll the chat container to bottom
  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Immediate scroll (no smooth — ensures we always land at bottom)
    el.scrollTop = el.scrollHeight;
    // Second pass after paint for any late-rendered content
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  // Extra scroll safety net — when typing finishes or messages change, scroll again after a tick
  useEffect(() => {
    const t = setTimeout(scrollToBottom, 80);
    return () => clearTimeout(t);
  }, [messages, isTyping, scrollToBottom]);

  // Focus input
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Refocus the input once typing finishes so the user can immediately send the next message
  useEffect(() => {
    if (!isTyping) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [isTyping]);

  const matchTutorials = useCallback((query: string): Tutorial[] => {
    if (tutorials.length === 0) return [];
    return findMatchingTutorials(tutorials, query, 2, 8, true);
  }, [tutorials]);

  const addAssistantMessage = useCallback((text: string, topics?: Topic[], queryText?: string) => {
    const matched = queryText ? matchTutorials(queryText) : [];
    const id = uid();
    setMessages(prev => [...prev, {
      id,
      role: 'assistant',
      text,
      topics,
      suggestedTutorials: matched.length > 0 ? matched : undefined,
      showAudioPrompt: true,
      timestamp: new Date()
    }]);
    setShowAudioPromptId(id);
    if (autoPlayMode === 'summary') {
      playVoiceResponse(text, false);
    } else if (autoPlayMode === 'full') {
      playVoiceResponse(text, true);
    }
  }, [matchTutorials, autoPlayMode, playVoiceResponse]);

  const respondWithDelay = useCallback((text: string, topics?: Topic[], queryText?: string) => {
    setIsTyping(true);
    const delay = Math.min(900 + text.length * 10, 3000);
    setTimeout(() => {
      setIsTyping(false);
      addAssistantMessage(text, topics, queryText);
    }, delay);
  }, [addAssistantMessage]);

  const callLearnAI = useCallback(async (conversationHistory: { role: string; content: string }[]) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          mode: 'learn',
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.message || null;
    } catch {
      return null;
    }
  }, []);

  const handleTopicClick = (topic: Topic) => {
    setMessages(prev => [...prev, {
      id: uid(),
      role: 'user',
      text: topic.label,
      timestamp: new Date()
    }]);
    respondWithDelay(topic.answer, topic.followUp, topic.label);
  };

  const handleFollowUp = (topic: Topic) => {
    setMessages(prev => [...prev, {
      id: uid(),
      role: 'user',
      text: topic.label,
      timestamp: new Date()
    }]);
    respondWithDelay(topic.answer, topic.followUp, topic.label);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const query = inputValue.trim();
    setInputValue('');

    setMessages(prev => [...prev, {
      id: uid(),
      role: 'user',
      text: query,
      timestamp: new Date()
    }]);

    const result = matchTopic(query);
    if (result) {
      respondWithDelay(result.topic.answer, result.topic.followUp, query);
    } else {
      setIsTyping(true);

      const history = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role === 'assistant' ? 'assistant' as const : 'user' as const, content: m.text }));
      history.push({ role: 'user' as const, content: query });

      try {
        const aiResponse = await callLearnAI(history);
        setIsTyping(false);
        if (aiResponse) {
          addAssistantMessage(aiResponse, undefined, query);
        } else {
          respondWithDelay(getTeachingFallbackResponse(query), undefined, query);
        }
      } catch {
        setIsTyping(false);
        respondWithDelay(getTeachingFallbackResponse(query), undefined, query);
      }
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([]);
    setIsTyping(true);
    setTimeout(() => {
      const id = uid();
      setMessages([{
        id,
        role: 'assistant',
        text: WELCOME_TEXT,
        showAudioPrompt: true,
        timestamp: new Date()
      }]);
      setShowAudioPromptId(id);
      setIsTyping(false);
    }, 600);
  };

  const getYoutubeId = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return url.split('v=')[1]?.split('&')[0] || url.split('/').pop() || '';
    }
    return url;
  };

  const getYoutubeThumbnail = (url: string) => {
    const id = getYoutubeId(url);
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-[#006569] flex items-center justify-center shrink-0 shadow-md shadow-[#006569]/20">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
  );

  return (
    <div ref={containerRef} className="fixed inset-0 flex flex-col bg-[#F5F4ED] overflow-hidden z-[3200]">

      {/* Chat Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-1">

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 mb-4 animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Bot avatar (left) */}
              {msg.role === 'assistant' && <BotAvatar />}

              <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                {/* Message bubble */}
                <div className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#006569] text-white rounded-br-md'
                    : 'bg-white text-slate-700 rounded-bl-md border border-slate-100'
                }`}>
                  {msg.role === 'user' ? (
                    <SaraText text={msg.text} plain />
                  ) : (
                    <SaraText text={msg.text} accent="#006569" />
                  )}
                </div>

                {/* Timestamp */}
                <p className={`text-[9px] text-slate-400 mt-1 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.timestamp)}
                </p>

                {/* Audio Prompt */}
                {msg.role === 'assistant' && msg.showAudioPrompt && showAudioPromptId === msg.id && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-[#006569] font-bold uppercase tracking-wider">
                      {isSpeaking ? "Speaking..." : "Read aloud?"}
                    </span>
                    <div className="flex gap-1">
                      {isSpeaking ? (
                        <button
                          onClick={() => {
                            window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                            setAutoPlayMode(null);
                          }}
                          className="px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-[9px] font-black uppercase rounded-lg hover:bg-red-100 transition-colors shadow-sm flex items-center gap-1"
                        >
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
                          Stop
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setAutoPlayMode('summary');
                              playVoiceResponse(msg.text, false);
                              setShowAudioPromptId(msg.id);
                            }}
                            className={`px-2 py-1 border text-[9px] font-black uppercase rounded-lg transition-colors shadow-sm ${
                              autoPlayMode === 'summary'
                                ? 'bg-[#006569] border-[#006569] text-white'
                                : 'bg-white border-[#006569]/30 text-[#006569] hover:bg-[#E5F4F4]'
                            }`}
                          >
                            Summary
                          </button>
                          <button
                            onClick={() => {
                              setAutoPlayMode('full');
                              playVoiceResponse(msg.text, true);
                              setShowAudioPromptId(msg.id);
                            }}
                            className={`px-2 py-1 border text-[9px] font-black uppercase rounded-lg transition-colors shadow-sm ${
                              autoPlayMode === 'full'
                                ? 'bg-[#006569] border-[#006569] text-white'
                                : 'bg-white border-[#006569]/30 text-[#006569] hover:bg-[#E5F4F4]'
                            }`}
                          >
                            Full
                          </button>
                          <button
                            onClick={() => {
                              setAutoPlayMode(null);
                              setShowAudioPromptId(null);
                            }}
                            className="px-2 py-1 bg-white border border-slate-200 text-slate-400 text-[9px] font-black uppercase rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                          >
                            No
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Follow-up chips */}
                {msg.role === 'assistant' && msg.topics && msg.topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.topics.map((topic, ti) => (
                      <button
                        key={ti}
                        onClick={() => handleFollowUp(topic)}
                        className="px-3 py-1.5 bg-[#E5F4F4] hover:bg-[#006569] hover:text-white text-[#006569] rounded-full text-[11px] font-bold transition-all border border-[#006569]/15 hover:border-[#006569] hover:shadow-md active:scale-95"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested tutorials */}
                {msg.role === 'assistant' && msg.suggestedTutorials && msg.suggestedTutorials.length > 0 && (
                  <div className="mt-3 bg-[#F5F4ED] rounded-2xl p-3 border border-[#D4EAEA]">
                    <p className="text-[9px] font-bold text-[#006569] uppercase tracking-widest mb-2">
                      Related tutorials
                    </p>
                    <div className="space-y-1.5">
                      {msg.suggestedTutorials.map((tutorial) => (
                        <Link
                          key={tutorial._id}
                          href="/tutorials"
                          className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#D4EAEA]/50 hover:border-[#006569]/30 hover:shadow-sm transition-all group"
                        >
                          <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                            {tutorial.type === 'video' ? (
                              <img src={getYoutubeThumbnail(tutorial.url)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-4 h-4 text-[#006569]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 group-hover:text-[#006569] transition-colors leading-snug truncate">
                              {tutorial.title}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">
                              {tutorial.folder || 'Tutorial'} {tutorial.type === 'video' && '· Video'}
                            </p>
                          </div>
                          <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#006569] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar (right) */}
              {msg.role === 'user' && <UserAvatar />}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 mb-4 animate-[slideUp_0.4s_ease-out]">
              <BotAvatar />
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#006569]/40 rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.2s]" />
                  <span className="w-2 h-2 bg-[#006569]/40 rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.2s]" />
                  <span className="w-2 h-2 bg-[#006569]/40 rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="shrink-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#006569] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-[11px] font-black text-slate-900 leading-none truncate">Learn Sara</h3>
                <p className="text-[8px] text-[#006569] font-bold uppercase tracking-widest leading-none mt-0.5 truncate">Your TallyPrime Teacher</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  const newState = !voiceEnabled;
                  setVoiceEnabled(newState);
                  if (!newState && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${voiceEnabled ? 'bg-slate-100 text-[#006569] hover:bg-slate-200' : 'bg-[#006569] text-white'}`}
                title={voiceEnabled ? 'Mute Sara' : 'Unmute Sara'}
              >
                {voiceEnabled ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm13.172-1.414l-4.242-4.242m4.242 0l-4.242 4.242" />
                  </svg>
                )}
              </button>
              <Link
                href="/"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                title="Close Learn Sara"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-slate-50 rounded-full border border-slate-200 focus-within:border-[#006569]/40 focus-within:ring-2 focus-within:ring-[#006569]/10 transition-all px-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Sara to teach you anything about Tally..."
                disabled={isTyping}
                className="flex-1 bg-transparent px-4 py-3 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-[#006569] text-white flex items-center justify-center shrink-0 hover:bg-[#006569] disabled:opacity-30 disabled:hover:bg-[#006569] transition-all active:scale-90 shadow-lg shadow-[#006569]/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Slide-up animation keyframe */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
