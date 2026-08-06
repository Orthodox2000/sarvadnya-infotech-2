'use client';

import { useEffect, useRef, useState } from 'react';
import { API_BASE, SITE_BASE } from '@/lib/api';

type Msg = { id: string; role: 'user' | 'assistant'; text: string };

const QUICK_PROMPTS = ['What is AMC?', 'Tally on Cloud pricing', 'Tally on WhatsApp', 'Cloud backup for Tally'];

const FALLBACK =
  "Thanks for reaching out! I'm offline right now, but our team replies fast. Meanwhile, call or WhatsApp us at +91 9821309060, or email info@sarvadnyainfotech.com.";

function clean(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/<\/?think[^>]*>/g, '')
    .trim();
}

function renderLinks(text: string): React.ReactNode[] {
  const parts = text.split(/\[\[(.*?)\|(.*?)\]\]/g);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const mod = i % 3;
    if (mod === 1) {
      const url = parts[i + 1];
      const href = url.startsWith('http') ? url : `${SITE_BASE}${url.startsWith('/') ? url : `/${url}`}`;
      nodes.push(
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-200 hover:bg-white"
        >
          {parts[i]} ↗
        </a>
      );
      i += 1;
    } else if (mod === 0 && parts[i]) {
      nodes.push(parts[i]);
    }
  }
  return nodes;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput('');
    const history: Msg[] = [...messages, { id: `u-${Date.now()}`, role: 'user', text: trimmed }];
    setMessages(history);
    setTyping(true);
    try {
      const apiMessages = history.map((m) => ({ role: m.role, content: m.text }));
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, mode: 'sales' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server responded with ${res.status}`);
      const reply = clean(data.message || '');
      setMessages([...history, { id: `a-${Date.now()}`, role: 'assistant', text: reply || FALLBACK }]);
    } catch {
      setMessages([...history, { id: `a-${Date.now()}`, role: 'assistant', text: FALLBACK }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[26rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-black">
                S
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-white" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Ask Sara</p>
                <p className="text-[10px] leading-tight text-brand-100">Sarvadnya's live AI assistant</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3.5 py-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[13px] text-slate-700 shadow-sm">
                  Hi! I'm Sara. Ask me anything about TallyPrime, cloud backup, AMC or any of our services.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-brand-700 shadow-sm ring-1 ring-brand-200 transition hover:bg-brand-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-[13px] text-white'
                      : 'max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 shadow-sm'
                  }
                >
                  {renderLinks(m.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Tally, pricing, support…"
              className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-[13px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="rounded-lg bg-brand-600 p-2 text-white transition hover:bg-brand-700 disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M3.4 20.4 22 12 3.4 3.6 3.5 10l13 2-13 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label="Open Ask Sara chat"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-xl ring-4 ring-white/60 transition hover:scale-105"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.2 4.6 3.1 6.1-.1 1.2-.5 2.3-1.1 3.2-.2.3 0 .7.3.8.8.2 1.7.1 2.4-.3.9-.4 1.6-.9 2.2-1.5 1 .2 2 .3 3.1.3 5.5 0 10-3.9 10-8.6S17.5 3 12 3Z" />
          </svg>
        )}
      </button>
    </>
  );
}
