'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SaraText from './SaraText';
import { findMatchingTutorials, type Tutorial } from '@/lib/tutorial-matcher';
import { matchTopic, getFallbackResponse, SARA_WELCOME, type Topic } from '@/lib/sara-topics';

interface Message {
  id: string;
  text: string;
  fullText?: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  showContact?: boolean;
  showAudioPrompt?: boolean;
  followUp?: Topic[];
  suggestedTutorials?: Tutorial[];
}

interface QuickSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSupportModal({ isOpen, onClose }: QuickSupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: SARA_WELCOME,
      sender: 'ai',
      timestamp: new Date(),
      showAudioPrompt: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAudioPromptId, setShowAudioPromptId] = useState<string | null>('1');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoPlayMode, setAutoPlayMode] = useState<'summary' | 'full' | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stopRequestedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  /**
   * VOICE INPUT ENGINE
   * Speech-to-text dictation for the input bar (desktop browsers with Web Speech API).
   */
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(' ');
      setInputText(transcript.trim());
      inputRef.current?.focus();
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  /**
   * VOICE RESPONSE ENGINE
   * Converts AI text response to speech.
   */
  function playVoiceResponse(text: string, isFullResponse: boolean) {
    if (typeof window === 'undefined' || !window.speechSynthesis || !voiceEnabled) return;

    // Interrupt current speech
    window.speechSynthesis.cancel();

    // Clean text (Remove markdown artifacts)
    let cleanText = text
      .replace(/\[\[.*?\|.*?\]\]/g, '') // Remove navigation buttons
      .replace(/\*/g, '')               // Remove all asterisks
      .replace(/[\[\]]/g, '')           // Remove remaining brackets
      .replace(/#/g, '')                // Remove heading symbols
      .trim();

    // Summary Mode: Truncate at 3rd sentence
    if (!isFullResponse) {
      const sentences = cleanText.split(/([.!?]+)/).filter(s => s.trim().length > 0);
      let summaryText = "";
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
  }

  // Load voices on mount
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

  // Fetch tutorials for matching
  useEffect(() => {
    fetch('/api/tutorials')
      .then(r => r.json())
      .then(data => { if (data && !data.error) setTutorials(data); })
      .catch(() => {});
  }, []);

  // Auto-scroll to bottom with smooth behavior
  const scrollToBottom = (force = false) => {
    if (scrollRef.current && (autoScrollEnabled || force)) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Detect user scroll to pause auto-scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // If user is more than 50px away from bottom, they are reading up
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScrollEnabled(isAtBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Special scroll for typing animation to keep bottom in view as text grows
  useEffect(() => {
    if (isAiResponding && autoScrollEnabled) {
      const interval = setInterval(() => scrollToBottom(), 300);
      return () => clearInterval(interval);
    }
  }, [isAiResponding, autoScrollEnabled]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const typeMessage = async (fullText: string, userQuery?: string) => {
    const id = Date.now().toString();
    stopRequestedRef.current = false;
    setIsAiResponding(true);
    setAutoScrollEnabled(true);

    setMessages(prev => [...prev, { id, text: '', fullText, sender: 'ai', timestamp: new Date(), showAudioPrompt: true }]);
    setShowAudioPromptId(id);

    if (autoPlayMode === 'summary') {
      playVoiceResponse(fullText, false);
    } else if (autoPlayMode === 'full') {
      playVoiceResponse(fullText, true);
    }

    const totalLen = fullText.length;
    const isMobile = window.innerWidth < 640;
    const chunkSize = isMobile ? 20 : 40;
    const revealDelay = isMobile ? 8 : 5;

    for (let pos = 0; pos < totalLen; pos += chunkSize) {
      if (stopRequestedRef.current) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, text: fullText } : m));
        break;
      }
      const displayed = fullText.slice(0, pos + chunkSize);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: displayed } : m));
      inputRef.current?.focus();
      await new Promise(resolve => setTimeout(resolve, revealDelay));
    }
    
    if (!stopRequestedRef.current) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: fullText } : m));
    }
    
    setIsAiResponding(false);

    if (userQuery && tutorials.length > 0) {
      const matched = findMatchingTutorials(tutorials, userQuery, 2, 8, true);
      if (matched.length > 0) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, suggestedTutorials: matched } : m));
      }
    }
    
    if (window.matchMedia('(hover: hover)').matches) {
      inputRef.current?.focus();
    }
  };

  const handleStop = () => {
    stopRequestedRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const processChatMessage = async (text: string) => {
    setAutoScrollEnabled(true);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const apiMessages = messages.map(m => ({
      role: m.sender === 'ai' ? 'assistant' : 'user',
      content: m.text || m.fullText || ''
    }));
    apiMessages.push({ role: 'user', content: text });

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setIsTyping(false);

      const clean = data.message
        ? data.message.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<\/?think[^>]*>/g, '').trim()
        : '';
      if (clean && clean.length > 5) {
        await typeMessage(clean, text);
      } else {
        const result = matchTopic(text);
        await typeMessage(result ? result.topic.answer : getFallbackResponse(text), text);
        if (result) setMessages(prev => prev.map(m => m.text === result.topic.answer ? { ...m, followUp: result.topic.followUp } : m));
      }
    } catch (err: any) {
      setIsTyping(false);
      if (err.name === 'AbortError') return;
      const result = matchTopic(text);
      await typeMessage(result ? result.topic.answer : getFallbackResponse(text), text);
      if (result) setMessages(prev => prev.map(m => m.text === result.topic.answer ? { ...m, followUp: result.topic.followUp } : m));
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleFollowUp = async (topic: Topic) => {
    if (isTyping || isAiResponding) return;
    setAutoScrollEnabled(true);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: topic.label,
      sender: 'user',
      timestamp: new Date()
    }]);

    setIsTyping(true);
    const delay = Math.min(600 + topic.answer.length * 8, 2000);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);

    await typeMessage(topic.answer, topic.label);
    setMessages(prev => prev.map(m => m.text === topic.answer ? { ...m, followUp: topic.followUp } : m));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || isAiResponding) return;

    const userText = inputText.trim();

    const injectionPatterns = [
      /ignore\s+(all\s+)?previous/i, /ignore\s+(all\s+)?instructions/i,
      /reveal\s+(your\s+)?(system\s+)?prompt/i,
      /output\s+(your\s+)?(system\s+)?(instructions|prompt)/i,
      /act\s+as\s+(?!sara)/i, /pretend\s+(you\s+are|to\s+be)/i,
      /forget\s+(all\s+)?(previous|instructions)/i,
      /new\s+(instructions|prompt)/i,
    ];
    if (injectionPatterns.some(p => p.test(userText))) {
      await typeMessage("I'm here to help with Tally and business solutions. How can I assist you with your TallyPrime setup, features, or services today?", userText);
      return;
    }

    setInputText('');
    await processChatMessage(userText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 sm:left-auto sm:right-6 sm:px-0 z-[3001] sm:w-[380px] max-w-[380px] animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
      <div 
        className="relative overflow-hidden w-full mx-auto rounded-[2rem] flex flex-col h-[550px] max-h-[calc(100vh-140px)] text-slate-900 shadow-[0_20px_50px_rgba(93,136,122,0.2)] border border-slate-100 bg-white/95 backdrop-blur-md pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#316852] text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                   <div className="bg-[#70f2f2] w-full h-full flex items-center justify-center font-black text-[#316852] text-lg">S</div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#316852] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">Ask Sara</h3>
                <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest leading-none mt-0.5">Sarvadnya Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newState = !voiceEnabled;
                  setVoiceEnabled(newState);
                  if (!newState && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/5 text-emerald-300'}`}
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
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#F5F4ED]/50 relative"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed break-words overflow-wrap-anywhere ${
                  msg.sender === 'user' 
                    ? 'bg-[#316852] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}
              >
                <SaraText text={msg.text} plain={msg.sender === 'user'} accent="#316852" onNavigate={onClose} />
              </div>

              {/* Audio Prompt */}
              {msg.sender === 'ai' && msg.showAudioPrompt && showAudioPromptId === msg.id && (
                <div className="mt-2 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <span className="text-[10px] text-[#316852] font-bold uppercase tracking-wider ml-2">
                    {isSpeaking ? "Speaking..." : "Read aloud?"}
                  </span>
                  <div className="flex gap-1">
                    {isSpeaking ? (
                      <button 
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                          setAutoPlayMode(null); // Explicit stop resets auto-play mode
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
                            playVoiceResponse(msg.fullText || msg.text, false);
                            setShowAudioPromptId(msg.id); 
                          }}
                          className={`px-2 py-1 border text-[9px] font-black uppercase rounded-lg transition-colors shadow-sm ${
                            autoPlayMode === 'summary' 
                              ? 'bg-[#316852] border-[#316852] text-white' 
                              : 'bg-white border-emerald-200 text-[#316852] hover:bg-emerald-50'
                          }`}
                        >
                          Summary
                        </button>
                        <button 
                          onClick={() => {
                            setAutoPlayMode('full');
                            playVoiceResponse(msg.fullText || msg.text, true);
                            setShowAudioPromptId(msg.id); 
                          }}
                          className={`px-2 py-1 border text-[9px] font-black uppercase rounded-lg transition-colors shadow-sm ${
                            autoPlayMode === 'full' 
                              ? 'bg-[#316852] border-[#316852] text-white' 
                              : 'bg-white border-emerald-200 text-[#316852] hover:bg-emerald-50'
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
              {msg.sender === 'ai' && msg.followUp && msg.followUp.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 ml-2">
                  {msg.followUp.map((topic, ti) => (
                    <button
                      key={ti}
                      onClick={() => handleFollowUp(topic)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-[#316852] hover:text-white text-[#316852] rounded-full text-[9px] font-bold transition-all border border-[#316852]/15 hover:border-[#316852] active:scale-95"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Suggested tutorials */}
              {msg.sender === 'ai' && msg.suggestedTutorials && msg.suggestedTutorials.length > 0 && (
                <div className="mt-2 ml-2 max-w-[90%]">
                  <p className="text-[8px] font-bold text-[#316852] uppercase tracking-widest mb-1.5">
                    You can also refer to these for additional info
                  </p>
                  <div className="space-y-1.5">
                    {msg.suggestedTutorials.map((tutorial) => (
                      <Link
                        key={tutorial._id}
                        href="/tutorials"
                        onClick={onClose}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-emerald-100 hover:border-[#316852]/30 hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-7 rounded overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                          {tutorial.type === 'video' ? (
                            <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          ) : (
                            <svg className="w-4 h-4 text-[#316852]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-900 group-hover:text-[#316852] transition-colors leading-snug truncate">
                            {tutorial.title}
                          </p>
                          <p className="text-[8px] text-slate-400 font-medium">
                            {tutorial.folder || 'Tutorial'}
                          </p>
                        </div>
                        <svg className="w-3 h-3 text-slate-300 group-hover:text-[#316852] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {(isTyping || isAiResponding) && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#316852]/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#316852]/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#316852]/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={isAiResponding ? (e) => { e.preventDefault(); handleStop(); } : handleSendMessage} className="flex items-center gap-2">
            <input 
              ref={inputRef}
              type="text"
              placeholder={isAiResponding ? "Sara is responding... (click ■ to stop)" : "Type your message..."}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#316852]/10 focus:border-[#316852] transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isTyping || isAiResponding}
              title={isListening ? 'Stop voice input' : 'Speak your question'}
              className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center transition-all active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse'
                  : 'bg-slate-100 text-[#316852] hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 disabled:opacity-40 disabled:hover:bg-slate-100'
              }`}
            >
              {isListening ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a4.5 4.5 0 004.5-4.5v-5a4.5 4.5 0 10-9 0v5a4.5 4.5 0 004.5 4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0016 0M12 20v3" />
                </svg>
              )}
            </button>
            {isAiResponding ? (
              <button 
                type="submit"
                className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20 transition-all active:scale-95"
                title="Stop response"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-[#316852] text-white flex items-center justify-center shadow-lg shadow-[#316852]/20 disabled:opacity-50 transition-all active:scale-95"
              >
                <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            )}
          </form>
          <p className="mt-3 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Sara • Sales Consultant
          </p>
        </div>

      </div>
    </div>
  );
}
