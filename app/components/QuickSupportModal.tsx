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
      text: "Hello! I'm Sara, your Sarvadnya Assistant. I can help you automate your business with Tally in any language—feel free to ask your questions in English, Hindi, or your preferred tongue!",
      sender: 'ai',
      timestamp: new Date(),
      showAudioPrompt: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAudioPromptId, setShowAudioPromptId] = useState<string | null>('1');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isMediaSupported, setIsMediaSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [autoPlayMode, setAutoPlayMode] = useState<'summary' | 'full' | null>(null);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load voices on mount and when they change
  useEffect(() => {
    const loadVoices = () => {
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

  // Check for Media API support on mount
  useEffect(() => {
    const isSecure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    console.log('[Sara Debug] Secure Context Status:', isSecure);
    console.log('[Sara Debug] Browser Protocol:', typeof window !== 'undefined' ? window.location.protocol : 'unknown');

    const supported = !!(
      typeof navigator !== 'undefined' && 
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' && 
      typeof MediaRecorder !== 'undefined'
    );
    console.log('[Sara Debug] Media APIs Supported:', supported);
    console.log('[Sara Debug] MediaRecorder Available:', typeof MediaRecorder !== 'undefined');
    
    setIsMediaSupported(supported);

    if (isOpen && typeof window !== 'undefined' && !isSecure) {
      console.warn('[Sara Warning] INSECURE CONTEXT: Microphone access WILL fail on most mobile browsers.');
    }
  }, [isOpen]);

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
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported or disabled');
      return;
    }

    try {
      // Stop any current speech immediately
      window.speechSynthesis.cancel();
      
      // Short delay to ensure cancel finishes
      setTimeout(() => {
        setIsSpeaking(true);

        // Process text based on summary vs full response
        let cleanText = '';
        
        if (!fullResponse) {
          // SUMMARY MODE: Read 3-4 lines/sentences UNTIL button section
          const buttonIndex = text.indexOf('[[');
          const textBeforeButtons = buttonIndex !== -1 ? text.substring(0, buttonIndex) : text;
          
          let processed = textBeforeButtons
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
            .replace(/[*#_~]/g, '')           // Remove other markdown
            .trim();

          // Split by sentences or newlines
          const segments = processed.split(/(?<=[.?!])\s+|\n+/);
          if (segments.length > 4) {
            cleanText = segments.slice(0, 4).join(' ');
          } else {
            cleanText = processed;
          }
        } else {
          // FULL RESPONSE: Read everything EXCEPT the buttons
          cleanText = text
            .replace(/\[\[.*?\|.*?\]\]/g, '') // Remove buttons
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
            .replace(/[*#_~]/g, '')           // Remove other markdown
            .trim();
        }

        if (!cleanText) {
          setIsSpeaking(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.15; // Slightly slower for better clarity as requested
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
        const preferredVoice = currentVoices.find(v => 
          (v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.name.includes('IN')) && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Heera') || v.name.includes('Ravi'))
        ) || currentVoices.find(v => v.lang === 'en-IN')
          || currentVoices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('india') || v.name.includes('IN')))
          || currentVoices.find(v => 
          (v.name.includes('Google') || v.name.includes('Natural')) && 
          (v.name.includes('US') || v.name.includes('UK')) && 
          v.lang.startsWith('en')
        ) || currentVoices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
          console.error('Speech error:', e);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (err) {
      console.error('Speech Synthesis Error:', err);
      setIsSpeaking(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Stop volume monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setVolumeLevel(0);
  };

  const startVolumeMeter = (stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i];
        }
        const average = total / bufferLength;
        const volume = Math.min((average / 128) * 100, 100);
        setVolumeLevel(volume);
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Volume meter failed:', err);
    }
  };

  const setupMicrophone = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser or context does not support microphone access. Please ensure you are using HTTPS or localhost.');
      return false;
    }

    try {
      // Trigger the browser's native permission notification popup
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Load available microphones with REAL LABELS now that they are unlocked
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter(d => d.kind === 'audioinput');
      setMicDevices(inputs);
      
      // If no mic selected yet, use the first one
      if (!selectedMicId && inputs.length > 0) {
        setSelectedMicId(inputs[0].deviceId);
      }

      // Always stop the tracks if you are just testing for permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Microphone access was denied. Please unlock your browser microphone settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No physical microphone detected on this machine.');
      } else {
        alert(`Mic Setup Error: ${err.message}`);
      }
      return false;
    }
  };

  const startRecording = async () => {
    // Interrupt any current speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    // Ensure we have permission and devices loaded
    if (micDevices.length === 0) {
      const success = await setupMicrophone();
      if (!success) return;
    }

    try {
      const constraints = {
        audio: {
          deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
          echoCancellation: true,
          noiseSuppression: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
        if (audioContextRef.current) audioContextRef.current.close();
      };

      mediaRecorder.start();
      setIsRecording(true);
      startVolumeMeter(stream);
    } catch (err: any) {
      console.error('Microphone recording error:', err);
      alert(`Could not start recording: ${err.message}`);
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
        // Send the transcribed text as a message and mark it as coming from voice
        await processChatMessage(data.text, true);
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
    
    // Add empty message first with audio prompt already enabled to show buttons while typing
    setMessages(prev => [...prev, { id, text: '', sender: 'ai', timestamp: new Date(), showAudioPrompt: true }]);
    setShowAudioPromptId(id);
    
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

    // AUTO-PLAY LOGIC: If a mode is already selected, play it immediately
    if (autoPlayMode === 'summary') {
      playVoiceResponse(fullText, false);
    } else if (autoPlayMode === 'full') {
      playVoiceResponse(fullText, true);
    }
  };

  const processChatMessage = async (text: string, isFromVoice = false) => {
    // Interrupt any current speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    // If message comes from voice, ensure auto-play is enabled (at least for summary)
    if (isFromVoice && !autoPlayMode) {
      setAutoPlayMode('summary');
    }

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
              {micDevices.length > 1 && (
                <div className="relative group">
                  <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl p-2 hidden group-hover:block z-50 w-48 animate-in fade-in slide-in-from-top-1">
                    <p className="text-[9px] font-black text-[#0371a3] uppercase mb-1.5 px-2">Microphone</p>
                    {micDevices.map(device => (
                      <button
                        key={device.deviceId}
                        onClick={() => setSelectedMicId(device.deviceId)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-bold truncate hover:bg-sky-50 transition-colors ${selectedMicId === device.deviceId ? 'text-[#0371a3] bg-sky-50' : 'text-slate-600'}`}
                      >
                        {device.label || `Mic ${micDevices.indexOf(device) + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  <span className="text-[10px] text-[#0371a3] font-bold uppercase tracking-wider ml-2">
                    {isSpeaking ? "Speaking..." : "Read aloud?"}
                  </span>
                  <div className="flex gap-1">
                    {isSpeaking ? (
                      <button 
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                          setAutoPlayMode(null); // Reset auto-play when explicitly stopped
                        }}
                        className="px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-[9px] font-black uppercase rounded-lg hover:bg-red-100 transition-colors shadow-sm flex items-center gap-1"
                      >
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
                        Stop Audio
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            if (isSpeaking && autoPlayMode === 'summary') {
                              window.speechSynthesis.cancel();
                              setIsSpeaking(false);
                            } else {
                              setAutoPlayMode('summary');
                              playVoiceResponse(msg.text, false);
                            }
                            setShowAudioPromptId(msg.id); 
                          }}
                          className={`px-2 py-1 border text-[9px] font-black uppercase rounded-lg transition-colors shadow-sm ${
                            isSpeaking && autoPlayMode === 'summary' 
                              ? 'bg-red-50 border-red-200 text-red-600' 
                              : 'bg-white border-sky-200 text-[#0371a3] hover:bg-sky-50'
                          }`}
                        >
                          {isSpeaking && autoPlayMode === 'summary' ? 'Stop' : 'Summary'}
                        </button>
                        <button 
                          onClick={() => {
                            if (isSpeaking && autoPlayMode === 'full') {
                              window.speechSynthesis.cancel();
                              setIsSpeaking(false);
                            } else {
                              setAutoPlayMode('full');
                              playVoiceResponse(msg.text, true);
                            }
                            setShowAudioPromptId(msg.id); 
                          }}
                          className={`px-2 py-1 border text-[9px] font-black uppercase rounded-lg transition-colors shadow-sm ${
                            isSpeaking && autoPlayMode === 'full' 
                              ? 'bg-red-50 border-red-200 text-red-600' 
                              : 'bg-white border-sky-200 text-[#0371a3] hover:bg-sky-50'
                          }`}
                        >
                          {isSpeaking && autoPlayMode === 'full' ? 'Stop' : 'Full Response'}
                        </button>
                        <button 
                          onClick={() => setShowAudioPromptId(null)}
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
                <span className="w-1.5 h-1.5 bg-[#00ABE4]/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#00ABE4]/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#00ABE4]/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          {/* Volume Meter */}
          {isRecording && (
            <div className="mb-2 px-1 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-black text-[#0371a3] uppercase tracking-tighter">Mic Volume</span>
                <span className="text-[8px] font-black text-[#0371a3]">{Math.round(volumeLevel)}%</span>
              </div>
              <div className="h-1 bg-sky-50 rounded-full overflow-hidden border border-sky-100/50">
                <div 
                  className="h-full bg-[#00ABE4] transition-all duration-75 ease-out rounded-full shadow-[0_0_8px_rgba(0,171,228,0.4)]"
                  style={{ width: `${volumeLevel}%` }}
                />
              </div>
            </div>
          )}
          
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
