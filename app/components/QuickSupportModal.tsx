'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  fullText?: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  showContact?: boolean;
  showAudioPrompt?: boolean;
}

interface QuickSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSupportModal({ isOpen, onClose }: QuickSupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Sara, your Sarvadnya Assistant. I can help you automate your business with Tally—feel free to ask your questions!",
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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const interval = setInterval(() => scrollToBottom(), 100);
      return () => clearInterval(interval);
    }
  }, [isAiResponding, autoScrollEnabled]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const typeMessage = async (fullText: string) => {
    const id = Date.now().toString();
    setIsAiResponding(true);
    setAutoScrollEnabled(true); // Reset auto-scroll when a new message starts
    
    setMessages(prev => [...prev, { id, text: '', fullText, sender: 'ai', timestamp: new Date(), showAudioPrompt: true }]);
    setShowAudioPromptId(id);

    // PERSISTENT AUTO-PLAY: If a mode is selected, start audio immediately
    if (autoPlayMode === 'summary') {
      playVoiceResponse(fullText, false);
    } else if (autoPlayMode === 'full') {
      playVoiceResponse(fullText, true);
    }

    let currentText = '';
    const words = fullText.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: currentText } : m));
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    
    setIsAiResponding(false);
    
    // Focus back on input after typing (Desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
      inputRef.current?.focus();
    }
  };

  const processChatMessage = async (text: string) => {
    // Reset auto-scroll when user sends a message
    setAutoScrollEnabled(true);

    // Interrupt current speech on new message
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
      content: m.text
    }));
    apiMessages.push({ role: 'user', content: text });

    let attempts = 0;
    const maxAttempts = 2;
    let success = false;

    while (attempts < maxAttempts && !success) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with ${response.status}`);
        }

        const data = await response.json();
        setIsTyping(false);
        
        const cleanMessage = data.message ? data.message.replace(/\*/g, '') : "I'm sorry, I couldn't process that.";
        await typeMessage(cleanMessage);
        success = true;
      } catch (err: any) {
        attempts++;
        console.error(`Chat attempt ${attempts} failed:`, err);

        if (attempts >= maxAttempts) {
          setIsTyping(false);
          let userFriendlyError = "I'm sorry, I'm having trouble connecting right now. Please try again in a few moments.";
          
          if (err.message === 'Failed to fetch') {
            userFriendlyError = "**Connection Error**: I couldn't reach the server. Please check your internet connection or try again later.";
          } else if (err.message.includes('restricted')) {
            userFriendlyError = "**Service Notice**: My AI engine is currently resting. Please contact our support team directly for immediate help.";
          }
          
          await typeMessage(userFriendlyError);
        } else {
          // Wait 1s before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || isAiResponding) return;

    const userText = inputText.trim();
    setInputText('');
    await processChatMessage(userText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 sm:left-auto sm:right-6 sm:px-0 z-[3001] sm:w-[380px] max-w-[380px] animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
      <div 
        className="relative overflow-hidden w-full mx-auto rounded-[2rem] flex flex-col h-[550px] max-h-[calc(100vh-140px)] text-slate-900 shadow-[0_20px_50px_rgba(3,113,163,0.2)] border border-slate-100 bg-white/95 backdrop-blur-md pointer-events-auto"
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
                <p className="text-[10px] text-sky-200 font-bold uppercase tracking-widest leading-none mt-0.5">Sarvadnya Assistant</p>
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
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/5 text-sky-300'}`}
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
          className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#f0f9ff]/50 relative"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#316852] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text.split('\n').map((line, i) => {
                  const parts = line.split(/(\[\[.*?\|.*?\]\])/);

                  return (
                    <span key={i}>
                      {parts.map((part, j) => {
                        if (part.startsWith('[[') && part.endsWith(']]')) {
                          const [label, url] = part.slice(2, -2).split('|');
                          return (
                            <Link 
                              key={j}
                              href={url}
                              onClick={onClose}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-[#316852] rounded-lg font-bold hover:bg-[#316852] hover:text-white transition-all my-1.5 border border-sky-200 shadow-sm mx-1"
                            >
                              <span className="text-[10px] uppercase tracking-wider">{label}</span>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                          );
                        }

                        return part.split(/(\*\*.*?\*\*)/).map((subPart, k) => {
                          if (subPart.startsWith('**') && subPart.endsWith('**')) {
                            return <strong key={k} className={`font-black ${msg.sender === 'user' ? 'text-sky-200' : 'text-[#316852]'}`}>{subPart.slice(2, -2)}</strong>;
                          }
                          return subPart;
                        });
                      })}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  );
                })}
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
                              : 'bg-white border-sky-200 text-[#316852] hover:bg-sky-50'
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
                              : 'bg-white border-sky-200 text-[#316852] hover:bg-sky-50'
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
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input 
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#316852]/10 focus:border-[#316852] transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAiResponding}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping || isAiResponding}
              className="w-10 h-10 rounded-xl bg-[#316852] text-white flex items-center justify-center shadow-lg shadow-[#316852]/20 disabled:opacity-50 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="mt-3 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Sara • Intelligent Assistant
          </p>
        </div>

      </div>
    </div>
  );
}
