import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  showContact?: boolean;
}

interface QuickSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSupportModal({ isOpen, onClose }: QuickSupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Sarvadnya AI Assistant. How can I assist you with TallyPrime or business automation today?",
      sender: 'ai',
      timestamp: new Date(),
      showContact: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Map current messages to format expected by Groq/OpenAI API
      const apiMessages = messages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
      apiMessages.push({ role: 'user', content: userText });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();

      if (data && data.error) throw new Error(data.error);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date(),
        showContact: true
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: err.message || "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly.",
        sender: 'ai',
        timestamp: new Date(),
        showContact: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                   <svg className="w-6 h-6 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0371a3] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">Sarvadnya AI</h3>
                <p className="text-[10px] text-sky-200 font-bold uppercase tracking-widest">Online</p>
              </div>
            </div>
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

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#f0f9ff]/50"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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

                {msg.sender === 'ai' && msg.showContact && (
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <p className="text-[9px] text-slate-400 mb-1.5 font-bold uppercase tracking-widest leading-tight">AI can make mistakes, take expert advice:</p>
                    <Link 
                      href="/contact" 
                      onClick={onClose}
                      className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-[#00ABE4]/10 rounded-xl hover:bg-[#0371a3] hover:text-white transition-all group w-full justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-widest">Contact Our Team</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
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
            <input 
              type="text"
              placeholder="Ask anything about Tally..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-[#00ABE4] text-white flex items-center justify-center shadow-lg shadow-[#00ABE4]/20 disabled:opacity-50 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="mt-3 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Powered by Sarvadnya AI & Groq
          </p>
        </div>
      </div>
    </div>
  );
}
