import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
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
      text: "Hello! I'm Sara, your Sarvadnya Assistant. How can I help you automate your business with Tally today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAudioPromptId, setShowAudioPromptId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isMediaSupported, setIsMediaSupported] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check for Media API support on mount
  useEffect(() => {
    const supported = !!(
      typeof navigator !== 'undefined' && 
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' && 
      typeof MediaRecorder !== 'undefined'
    );
    setIsMediaSupported(supported);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isAiResponding]);

  // Autofocus input when modal opens or response finishes
  useEffect(() => {
    if (isOpen && !isAiResponding && !isTyping) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isAiResponding, isTyping]);

  if (!isOpen) return null;

  const playVoiceResponse = (text: string, fullResponse = false) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    // Clean text: remove buttons [[Label|URL]] and markdown **text**
    let cleanText = text
      .replace(/\[\[.*?\|.*?\]\]/g, '') // Remove buttons
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/[*#_~]/g, '')           // Remove other markdown
      .trim();

    if (!fullResponse) {
      // Truncate to first 3 sentences or bullets
      const sentences = cleanText.split(/(?<=[.?!])\s+/);
      if (sentences.length > 3) {
        cleanText = sentences.slice(0, 3).join(' ');
      }
    }

    if (!cleanText) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to find a high-quality professional voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural')) && 
      (v.name.includes('US') || v.name.includes('UK')) && 
      v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    // Check if mediaDevices API is available (only available in secure contexts/HTTPS)
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('MediaDevices API not available in this context');
      alert('Audio recording is not supported in this browser or context. Please ensure you are using HTTPS.');
      return;
    }

    // Check if MediaRecorder is available
    if (typeof MediaRecorder === 'undefined') {
      console.warn('MediaRecorder not available');
      alert('Your browser does not support audio recording.');
      return;
    }

    try {
      // NOTE: MediaDevices API requires a Secure Context (HTTPS or localhost).
      // If testing remotely over local network (e.g. http://192.168.1.X), 
      // you must enable the 'unsafely-treat-insecure-origin-as-secure' flag 
      // in chrome://flags or edge://flags for the specific origin.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleVoiceInput(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone permission denied or error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Microphone access was denied. Please enable it in your browser settings to use voice input.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No microphone was found on your device. Please connect a microphone and try again.');
      } else {
        alert('Could not access microphone. Please check your device settings.');
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceInput = async (blob: Blob) => {
    setIsTyping(true);
    try {
      const formData = new FormData();
      formData.append('file', blob);

      const response = await fetch('/api/chat/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.text) {
        // Send the transcribed text as a message
        await processChatMessage(data.text);
      } else {
        throw new Error(data.error || 'Transcription failed');
      }
    } catch (err) {
      console.error('Voice input error:', err);
      setIsTyping(false);
      await typeMessage("Sorry, I couldn't understand the audio. Please try again.");
    }
  };

  const typeMessage = async (fullText: string) => {
    const id = (Date.now() + 1).toString();
    setIsAiResponding(true);
    
    // Add empty message first
    setMessages(prev => [...prev, { id, text: '', sender: 'ai', timestamp: new Date(), showAudioPrompt: false }]);
    
    let currentText = '';
    const words = fullText.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: currentText } : m));
      // 50ms delay as requested (0.05s)
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setIsAiResponding(false);
    
    // After typing is done, show the audio prompt for this specific message
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showAudioPrompt: true } : m));
    setShowAudioPromptId(id);
  };

  const processChatMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const apiMessages = messages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
      apiMessages.push({ role: 'user', content: text });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setIsTyping(false);
      await typeMessage(data.message);
    } catch (err: any) {
      console.error('Chat error:', err);
      setIsTyping(false);
      await typeMessage(err.message || "I'm sorry, I'm having trouble connecting right now. Please try again later.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || isAiResponding) return;

    const userText = inputText.trim();
    setInputText('');
    await processChatMessage(userText);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[3001] w-[calc(100%-3rem)] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
      <div 
        className="relative overflow-hidden w-full rounded-[2rem] flex flex-col h-[500px] text-slate-900 shadow-[0_20px_50px_rgba(3,113,163,0.2)] border border-slate-100 bg-white/95 backdrop-blur-md pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0371a3] text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                   <div className="bg-[#70f2f2] w-full h-full flex items-center justify-center font-black text-[#0371a3] text-lg">S</div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0371a3] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">Ask Sara</h3>
                <p className="text-[10px] text-sky-200 font-bold uppercase tracking-widest leading-none mt-0.5">Sarvadnya Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/5 text-sky-300'}`}
                title={voiceEnabled ? 'Disable Voice Response' : 'Enable Voice Response'}
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
          className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#f0f9ff]/50"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#00ABE4] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text.split('\n').map((line, i) => {
                  // Check for [[Label|URL]] pattern
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
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-[#0371a3] rounded-lg font-bold hover:bg-[#0371a3] hover:text-white transition-all my-1.5 border border-sky-200 shadow-sm mx-1"
                            >
                              <span className="text-[10px] uppercase tracking-wider">{label}</span>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                          );
                        }

                        return part.split(/(\*\*.*?\*\*)/).map((subPart, k) => {
                          if (subPart.startsWith('**') && subPart.endsWith('**')) {
                            return <strong key={k} className={`font-black ${msg.sender === 'user' ? 'text-sky-200' : 'text-[#0371a3]'}`}>{subPart.slice(2, -2)}</strong>;
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
                  <span className="text-[10px] text-[#0371a3] font-bold uppercase tracking-wider ml-2">Read aloud?</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        playVoiceResponse(msg.text, false);
                        setShowAudioPromptId(null);
                      }}
                      className="px-2 py-1 bg-white border border-sky-200 text-[#0371a3] text-[9px] font-black uppercase rounded-lg hover:bg-sky-50 transition-colors shadow-sm"
                    >
                      Summary
                    </button>
                    <button 
                      onClick={() => {
                        playVoiceResponse(msg.text, true);
                        setShowAudioPromptId(null);
                      }}
                      className="px-2 py-1 bg-white border border-sky-200 text-[#0371a3] text-[9px] font-black uppercase rounded-lg hover:bg-sky-50 transition-colors shadow-sm"
                    >
                      Full Response
                    </button>
                    <button 
                      onClick={() => setShowAudioPromptId(null)}
                      className="px-2 py-1 bg-white border border-slate-200 text-slate-400 text-[9px] font-black uppercase rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(isTyping || isAiResponding) && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#00ABE4]/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#00ABE4]/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#00ABE4]/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button 
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' 
                  : isSpeaking
                    ? 'bg-slate-100 text-[#00ABE4] border border-[#00ABE4]/20'
                    : 'bg-slate-50 text-slate-400 hover:text-[#00ABE4] hover:bg-sky-50 border border-slate-100'
              }`}
              disabled={isAiResponding || isTyping || isSpeaking}
              title={isSpeaking ? "Sara is speaking..." : isRecording ? "Stop Recording" : "Voice Input"}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-[#00ABE4] rounded-full animate-[pulse_1s_infinite]"></span>
                  <span className="w-1 h-4 bg-[#00ABE4] rounded-full animate-[pulse_1s_infinite_0.2s]"></span>
                  <span className="w-1 h-3 bg-[#00ABE4] rounded-full animate-[pulse_1s_infinite_0.4s]"></span>
                </div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <input 
              ref={inputRef}
              type="text"
              placeholder={isRecording ? "Listening..." : "Type your message..."}
              className={`flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all ${isRecording ? 'placeholder-red-400 text-red-500 font-medium' : ''}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAiResponding || isRecording}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping || isAiResponding || isRecording}
              className="w-10 h-10 rounded-xl bg-[#00ABE4] text-white flex items-center justify-center shadow-lg shadow-[#00ABE4]/20 disabled:opacity-50 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
