'use client';

import { useState, useEffect, useRef } from 'react';
import { requestMediaPermissions, MediaPermissionsErrorType } from 'mic-check';
import Recorder from 'recorder-js';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  fullText?: string; // v1.1.342: Store full response for "fake sync" playback
  sender: 'ai' | 'user';
  timestamp: Date;
  showContact?: boolean;
  showAudioPrompt?: boolean;
}

interface QuickSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Strict interface for recorder-js
interface VoiceRecorder {
  init: (stream: MediaStream) => Promise<void>;
  start: () => Promise<MediaStream | undefined>;
  stop: () => Promise<{ blob: Blob; buffer: Float32Array[] }>;
  stream?: MediaStream;
}

type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

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
  const [permissionStatus, setPermissionStatus] = useState<MicPermissionState>('prompt');
  const [isSecure, setIsSecure] = useState(true);
  const [isInitializingMic, setIsInitializingMic] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recorderInstanceRef = useRef<VoiceRecorder | null>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * ON-DEMAND HARDWARE HANDSHAKE (v1.1.343)
   * Triggered only when mic is clicked.
   */
  async function requestInitialPermission() {
    setIsInitializingMic(true);
    const secure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost');
    setIsSecure(secure);

    if (!secure) {
      setPermissionStatus('denied');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "**Security Error: HTTPS Required**\n\nBrowsers block microphone access on standard (HTTP) sites for your safety. Please switch to an **HTTPS** connection or test on **localhost** to use voice features.\n\nPermissions like 'Microphone' will **only appear** on secure sites.",
        sender: 'ai',
        timestamp: new Date()
      }]);
      setIsInitializingMic(false);
      return;
    }

    try {
      console.log('[Sara Security] Initiating hardware handshake using mic-check...');
      // Using mic-check for cross-browser consistency (v1.1.344)
      await requestMediaPermissions({ audio: true });
      setPermissionStatus('granted');
      setIsRecording(true); // Start recording immediately after grant
    } catch (err: any) {
      console.warn('[Sara Security] Handshake rejected:', err.name || err.type);
      handleMicCheckError(err);
    } finally {
      setIsInitializingMic(false);
    }
  }

  /**
   * CENTRALIZED MIC ERROR HANDLER (v1.1.344)
   * Provides actionable feedback based on specific 'mic-check' error types.
   */
  function handleMicCheckError(err: any) {
    setPermissionStatus('denied');
    let errorMessage = "**Microphone Access Required**\n\nTo use voice commands, please enable access in your browser settings:\n\n**Desktop:** Click the **Lock icon** next to the URL and set Microphone to **Allow**.\n\n**Mobile:** Tap **Site Settings** (or ⋮ menu), grant **Microphone** access, and **Reload**.";

    if (err.type === MediaPermissionsErrorType.SystemPermissionDenied) {
      errorMessage = "**System Permission Denied**\n\nYour operating system (macOS or Windows) has blocked this browser from accessing the microphone. Please check your **System Settings > Privacy & Security > Microphone** and ensure your browser is allowed.";
    } else if (err.type === MediaPermissionsErrorType.UserPermissionDenied) {
      errorMessage = "**Microphone Blocked**\n\nYou have denied microphone access for this site. To fix this:\n\n1. Click the **Camera/Lock icon** in the address bar.\n2. Select **'Always allow'** or reset permissions.\n3. **Refresh the page** to try again.";
    } else if (err.type === MediaPermissionsErrorType.CouldNotStartVideoSource) {
      errorMessage = "**Microphone Busy or Not Found**\n\nYour microphone could not be started. It might be in use by another application (like Zoom or Teams) or is not properly plugged in.";
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: errorMessage,
      sender: 'ai',
      timestamp: new Date()
    }]);
  }

  // Silent check for status on mount (no UI block)
  useEffect(() => {
    if (isOpen) {
      const secure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      setIsSecure(secure);

      if (typeof navigator !== 'undefined' && navigator.permissions && (navigator.permissions as any).query) {
        try {
          (navigator.permissions as any).query({ name: 'microphone' as PermissionName }).then((status: PermissionStatus) => {
            setPermissionStatus(status.state as MicPermissionState);
            status.onchange = () => setPermissionStatus(status.state as MicPermissionState);
          }).catch((err: any) => {
            console.warn('[Sara Debug] Permissions API mic query failed:', err);
          });
        } catch (e) {
          console.warn('[Sara Debug] Permissions API mic query not supported');
        }
      }
    }
  }, [isOpen]);

  /**
   * CLEANUP AUDIO RESOURCES
   */
  function cleanupAudio() {
    if (recorderInstanceRef.current && recorderInstanceRef.current.stream) {
      recorderInstanceRef.current.stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    }
    
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setVolumeLevel(0);
    analyserRef.current = null;
    recorderInstanceRef.current = null;
  }

  /**
   * VOICE RESPONSE ENGINE (v1.1.333)
   * Converts AI text response to high-fidelity speech.
   */
  function playVoiceResponse(text: string, isFullResponse: boolean) {
    if (typeof window === 'undefined' || !window.speechSynthesis || !voiceEnabled) return;

    // 1. Interrupt any current speech
    window.speechSynthesis.cancel();

    // 2. Clean text for natural speech (v1.1.356: Remove all markdown artifacts)
    let cleanText = text
      .replace(/\[\[.*?\|.*?\]\]/g, '') // Remove navigation buttons
      .replace(/\*/g, '')               // Remove all asterisks (bold/italic)
      .replace(/[\[\]]/g, '')           // Remove remaining brackets
      .replace(/#/g, '')                // Remove heading symbols
      .replace(/_/g, ' ')               // Replace underscores with spaces
      .replace(/[`]/g, '')              // Remove code backticks
      .trim();

    // 3. Intelligent Truncation (Summary Mode)
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

    // 4. Utterance Configuration
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') && 
      (v.name.includes('US') || v.name.includes('UK') || v.name.includes('India'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.05; // Smoother, more natural pacing
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('[Sara Voice] TTS Error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * VOICE INPUT HANDLER (v1.1.333)
   * Sends audio blob to transcription API and processes result.
   */
  async function handleVoiceInput(audioBlob: Blob) {
    setIsTyping(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      const response = await fetch('/api/chat/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.text && data.text.trim()) {
        await processChatMessage(data.text, true);
      }
    } catch (err) {
      console.error('[Sara Voice] Transcription Error:', err);
      alert("I couldn't hear that clearly. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }

  // Load voices on mount and when they change
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

  // Check for Media API support & Permissions on mount
  useEffect(() => {
    const secure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    setIsSecure(secure);

    const supported = !!(
      typeof navigator !== 'undefined' && 
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      (window.AudioContext || (window as any).webkitAudioContext)
    );
    setIsMediaSupported(supported);

    if (supported && typeof navigator !== 'undefined' && navigator.permissions && (navigator.permissions as any).query) {
      try {
        (navigator.permissions as any).query({ name: 'microphone' as PermissionName }).then((status: PermissionStatus) => {
          setPermissionStatus(status.state as MicPermissionState);
          status.onchange = () => setPermissionStatus(status.state as MicPermissionState);
        }).catch((err: any) => {
          console.warn('[Sara Debug] Permissions API mic query failed:', err);
        });
      } catch (e) {
        console.warn('[Sara Debug] Permissions API mic query not supported');
      }
    }
  }, [isOpen]);

  function handleCaptureError(err: any) {
    if (err.type) {
      handleMicCheckError(err);
    } else {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert("HARDWARE: No microphone detected on this device.");
      } else {
        alert(`ERROR: ${err.message}`);
      }
    }
  }

  /**
   * HARDWARE DIAGNOSTIC (v1.1.341)
   * Attempts to trigger ANY hardware prompt (Mic or Camera) to verify responsiveness.
   */
  async function runHardwareDiagnostic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("DIAGNOSTIC FAILED: Your browser has disabled all hardware access for this connection. You MUST switch to HTTPS.");
      return;
    }

    try {
      console.log('[Sara Diagnostic] Attempting hardware handshake via mic-check...');
      // Using mic-check for cross-browser consistency (v1.1.344)
      await requestMediaPermissions({ audio: true });
      setPermissionStatus('granted');
      alert("Verification Success: Your browser popups and microphone are working correctly!");
    } catch (err: any) {
      console.warn('[Sara Diagnostic] Verification failed:', err.name || err.type);
      if (err.type === MediaPermissionsErrorType.UserPermissionDenied) {
        setPermissionStatus('denied');
        alert("Verification Failed: Permission is still blocked in your settings. Please follow the instructions to Allow.");
      } else if (err.type === MediaPermissionsErrorType.SystemPermissionDenied) {
        alert("Verification Failed: System-level permission is denied. Check your OS privacy settings.");
      } else {
        alert(`Hardware Error: ${err.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * REFACTORED VOICE CAPTURE EFFECT (v1.1.337)
   * Implements a persistent request loop that keeps asking for permission until granted.
   */
  useEffect(() => {
    if (!isRecording || !isOpen) return;

    let isMounted = true;
    let activeStream: MediaStream | null = null;

    async function initializeAndStart() {
      // 1. Interrupt any current speech
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      // 2. PERSISTENT REQUEST LOOP
      while (isMounted && isRecording && !recorderInstanceRef.current) {
        try {
          console.log('[Sara Voice] Requesting microphone access...');
          
          try {
            activeStream = await navigator.mediaDevices.getUserMedia({ 
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                deviceId: selectedMicId ? { exact: selectedMicId } : undefined
              } 
            });
          } catch (innerErr) {
            activeStream = await navigator.mediaDevices.getUserMedia({ 
              audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true 
            });
          }

          if (!isMounted || !isRecording) {
            activeStream?.getTracks().forEach(t => t.stop());
            return;
          }

          // SUCCESS - Break out of loop
          setPermissionStatus('granted');
          break;

        } catch (err: any) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            console.warn('[Sara Voice] Access denied, retrying in 2s...');
            setPermissionStatus('denied');
            
            // Wait before next attempt to avoid browser spam protection
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (!isMounted || !isRecording) return;
            continue; // Try again
          } else {
            // Non-permission errors (hardware/not found) stop the loop
            console.error('[Sara Voice] Critical capture error:', err);
            if (isMounted) {
              handleCaptureError(err);
              setIsRecording(false);
            }
            return;
          }
        }
      }

      if (!activeStream || !isMounted || !isRecording) return;

      try {
        // 3. AUDIO CONTEXT & ANALYSER SETUP
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        const audioContext = new AudioContextClass();
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContext.createMediaStreamSource(activeStream);
        source.connect(analyser);

        // 4. RECORDER-JS INITIALIZATION
        const recorder = new Recorder(audioContext);
        await recorder.init(activeStream);

        if (!isMounted || !isRecording) {
          await audioContext.close();
          activeStream.getTracks().forEach(t => t.stop());
          return;
        }

        // 5. START CAPTURE & VISUALS
        await recorder.start();
        
        recorderInstanceRef.current = recorder;
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        startVolumeAnalysis(analyser);

      } catch (err: any) {
        console.error('[Sara Voice] Final Setup Failure:', err);
        if (isMounted) {
          setIsRecording(false);
          cleanupAudio();
        }
      }
    }

    initializeAndStart();

    return () => {
      isMounted = false;
    };
  }, [isRecording, isOpen, selectedMicId]);

  function startVolumeAnalysis(analyser: AnalyserNode) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function updateVolume() {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      let total = 0;
      for (let i = 0; i < bufferLength; i++) {
        total += dataArray[i];
      }
      const averageVolume = total / bufferLength;
      const volumePercentage = Math.min((averageVolume / 128) * 100, 100);
      setVolumeLevel(volumePercentage);
      
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    }

    updateVolume();
  }

  // Native Mic Button Listener to preserve user gesture
  useEffect(() => {
    if (!isOpen) return;
    const btn = micButtonRef.current;
    if (!btn) return;

    const handleMicClick = async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isRecording) {
        await stopRecording();
      } else {
        // FORCE PROMPT ON GESTURE (v1.1.338)
        // This ensures browsers like Safari/Chrome actually show the prompt
        try {
          console.log('[Sara Voice] User gesture detected, triggering initial prompt...');
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop()); // Close immediate test stream
          setPermissionStatus('granted');
        } catch (err: any) {
          console.warn('[Sara Voice] Initial gesture prompt failed or denied:', err.name);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setPermissionStatus('denied');
          }
        }
        setIsRecording(true);
      }
    };

    btn.addEventListener('click', handleMicClick);
    return () => btn.removeEventListener('click', handleMicClick);
  }, [isOpen, isRecording, selectedMicId]);

  async function stopRecording() {
    if (recorderInstanceRef.current) {
      try {
        const { blob } = await recorderInstanceRef.current.stop();
        setIsRecording(false); 
        await handleVoiceInput(blob);
      } catch (err) {
        console.error('[Sara Voice] Stop error:', err);
        setIsRecording(false);
      } finally {
        cleanupAudio();
      }
    } else {
      setIsRecording(false);
      cleanupAudio();
    }
  }

  const typeMessage = async (fullText: string) => {
    const id = (Date.now() + 1).toString();
    setIsAiResponding(true);
    
    // Add empty message first with audio prompt already enabled to show buttons while typing
    setMessages(prev => [...prev, { id, text: '', fullText, sender: 'ai', timestamp: new Date(), showAudioPrompt: true }]);
    setShowAudioPromptId(id);

    // AUTO-PLAY LOGIC: If a mode is already selected, play it immediately (v1.1.342)
    // Start audio as soon as reply starts coming for a "fake sync" feel
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
      // 50ms delay as requested (0.05s)
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setIsAiResponding(false);
    
    // After typing is done, show the audio prompt for this specific message
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showAudioPrompt: true } : m));
    setShowAudioPromptId(id);
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
      
      // Clean ALL markdown markers (v1.1.357)
      const cleanMessage = data.message ? data.message.replace(/\*/g, '') : "I'm sorry, I couldn't process that.";
      await typeMessage(cleanMessage);
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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 sm:left-auto sm:right-6 sm:px-0 z-[3001] sm:w-[380px] max-w-[380px] animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
      <div 
        className="relative overflow-hidden w-full mx-auto rounded-[2rem] flex flex-col h-[550px] max-h-[calc(100vh-140px)] text-slate-900 shadow-[0_20px_50px_rgba(3,113,163,0.2)] border border-slate-100 bg-white/95 backdrop-blur-md pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0371a3] text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                   <div className="bg-[#70f2f2] w-full h-full flex items-center justify-center font-black text-[#0371a3] text-lg">S</div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0371a3] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight">Ask Sara</h3>
                  {/* Status Badges */}
                  {!isSecure ? (
                    <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-[7px] font-black uppercase text-red-200">Insecure</span>
                  ) : permissionStatus === 'denied' ? (
                    <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-[7px] font-black uppercase text-amber-200 tracking-tighter">Mic Locked</span>
                  ) : permissionStatus === 'granted' ? (
                    <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-[7px] font-black uppercase text-green-200 tracking-tighter">Mic Ready</span>
                  ) : null}
                </div>
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
                              playVoiceResponse(msg.fullText || msg.text, false);
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
                              playVoiceResponse(msg.fullText || msg.text, true);
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
          {isRecording && permissionStatus === 'granted' && (
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
              ref={micButtonRef}
              type="button"
              onClick={() => {
                if (permissionStatus !== 'granted') {
                  requestInitialPermission();
                }
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                isRecording 
                  ? (permissionStatus === 'granted' ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-amber-500 text-white animate-bounce shadow-amber-500/20') 
                  : isSpeaking
                    ? 'bg-slate-100 text-[#00ABE4] border border-[#00ABE4]/20'
                    : 'bg-slate-50 text-slate-400 hover:text-[#00ABE4] hover:bg-sky-50 border border-slate-100'
              }`}
              disabled={isAiResponding || isTyping || isSpeaking}
              title={isSpeaking ? "Sara is speaking..." : isRecording ? "Stop Recording" : (permissionStatus === 'denied' ? "Microphone Blocked - Click to fix" : "Voice Input")}
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
              placeholder={isRecording ? (permissionStatus === 'granted' ? "Listening..." : "Allow Microphone...") : "Type your message..."}
              className={`flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all ${isRecording ? 'placeholder-amber-600 text-amber-700 font-medium' : ''}`}
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
