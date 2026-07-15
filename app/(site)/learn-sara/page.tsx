'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { findMatchingTutorials, type Tutorial } from '@/lib/tutorial-matcher';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  topics?: Topic[];
  suggestedTutorials?: Tutorial[];
  timestamp: Date;
};

type Topic = {
  label: string;
  answer: string;
  followUp?: Topic[];
};

const saraTopics: Topic[] = [
  {
    label: "GST & Tax Filing",
    answer: "TallyPrime handles GST automatically. Here's what you need to know:\n\n- Enable GST: Go to Company Features (F11) > Enable GST\n- Auto-calculation: Tally calculates CGST, SGST, IGST on every invoice\n- E-Invoicing: Generate directly from Tally (one click)\n- GSTR-1: Gateway > Reports > Statutory Reports > GST > GSTR-1\n- GSTR-3B: Same path, select GSTR-3B\n- E-Way Bill: Generate for shipments above ₹50,000\n\nTallyPrime also auto-reconciles your GSTR-2A/2B with purchase records.",
    followUp: [
      { label: "How to file GSTR-1?", answer: "Steps to file GSTR-1:\n\n1. Gateway > Reports > Statutory Reports > GST > GSTR-1\n2. Review all outward supplies\n3. Check for errors (Tally highlights mismatches)\n4. Click 'Export' to generate JSON\n5. Upload to GST portal or use direct upload\n\nTally also auto-filters B2B, B2C, CDNR, and HSN summaries for you." },
      { label: "E-Invoicing steps", answer: "E-Invoicing in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Invoicing\n2. Set IRN threshold (currently ₹5 crore)\n3. Generate: While saving invoice, press Ctrl+I for IRN\n4. Tally auto-generates QR code and IRN\n5. Print the invoice with QR code\n\nNo external portal needed — everything happens inside Tally." },
    ]
  },
  {
    label: "Inventory Management",
    answer: "TallyPrime's inventory is more powerful than most people realize:\n\n- Stock Items: Create with units, opening balance, and godown\n- Godowns: Track stock across multiple locations (F11 > Enable Godowns)\n- Batches: For medicines, food, or perishables with expiry tracking\n- BOM: Bill of Materials for manufacturing businesses\n- Reorder Levels: Set minimum stock and get alerts\n- Valuation: FIFO, LIFO, or Average — pick your method\n\nPro tip: Use 'Stock Summary' report to see real-time inventory across all locations.",
    followUp: [
      { label: "Multi-location tracking", answer: "Multi-godown tracking:\n\n1. Enable Godowns: F11 > Inventory Features > Maintain Multiple Godowns\n2. Create Godowns: Inventory Info > Godowns > Create\n3. Transfer Stock: Use Stock Journal (Alt+F7) for inter-godown transfers\n4. Reports: Stock Summary shows per-godown quantities\n\nYou can also see godown-wise balance in any stock item report." },
      { label: "Barcode integration", answer: "Barcode support in TallyPrime:\n\n1. Enable barcodes: F11 > Inventory Features > Enable Barcodes\n2. Assign barcode to each stock item\n3. During invoicing, scan the barcode — item auto-fills\n4. Supports Code 128, EAN-13, and QR codes\n\nWorks with USB barcode scanners. Just plug and play." },
    ]
  },
  {
    label: "Banking & Reconciliation",
    answer: "TallyPrime makes banking effortless:\n\n- Auto BRS: Import bank statement (CSV/OFX) and match entries automatically\n- Cheque Printing: Design and print cheques directly\n- E-Payments: Send payments to vendors via NEFT/RTGS from Tally\n- Post-Dated Cheques: Track PDCs with maturity reminders\n- Cash Flow Reports: Predict future cash positions\n\nTo start auto-reconciliation: Go to Banking > Bank Reconciliation > select your bank > Import Statement.",
    followUp: [
      { label: "Auto bank reconciliation", answer: "Auto BRS steps:\n\n1. Go to Banking > Bank Reconciliation\n2. Select your bank ledger\n3. Click 'Import Bank Statement'\n4. Choose CSV, OFX, or QIF format\n5. Tally auto-matches entries by amount and date\n6. Review unmatched entries and manually match\n7. Accept — your BRS is done\n\nTime saved: Usually 2-3 hours of manual work becomes 5 minutes." },
    ]
  },
  {
    label: "Payroll & Employees",
    answer: "TallyPrime's built-in payroll handles everything:\n\n- Employee Profiles: Create with category, group, and statutory details\n- Pay Structure: Define basic, HRA, PF, ESI, and custom components\n- Attendance: Daily or production-based tracking\n- Auto PF/ESI: Employer and employee shares calculated automatically\n- Income Tax: Monthly projections and Form 16 generation\n- Payslips: Bulk print or email password-protected payslips\n\nEnable it: F11 > Payroll Features > Enable Payroll.",
    followUp: [
      { label: "Creating pay structure", answer: "Pay structure setup:\n\n1. Gateway > Payroll Info > Pay Heads > Create\n2. Create components:\n   - Basic (under Earnings, affects PF/ESI)\n   - HRA (under Earnings, statutory)\n   - PF Employee (under Deductions, statutory)\n   - PF Employer (under Contributions, statutory)\n3. Group components into Salary Details\n4. Assign to employees\n\nTally auto-calculates everything based on your structure." },
    ]
  },
  {
    label: "Reports & Analysis",
    answer: "TallyPrime has 400+ built-in reports:\n\n- Balance Sheet: Real-time, drill-down to any ledger\n- Profit & Loss: See your business health at a glance\n- Cash Flow: Day-wise cash position\n- Stock Analysis: Aging, movement, slow/fast moving items\n- Ratio Analysis: Key financial ratios auto-calculated\n- Excel Export: Any report can be exported to Excel\n- Multi-period: Compare reports across different periods\n\nKeyboard shortcuts: Alt+F1 for detailed view, Ctrl+F for search, F12 for configuration.",
    followUp: [
      { label: "Custom reports", answer: "Creating custom views:\n\n1. Open any standard report\n2. Press F12 (Configure)\n3. Change columns, rows, sorting, or grouping\n4. Save configuration — it becomes your custom view\n\nFor advanced needs:\n- Use Columnar reports (multiple periods side by side)\n- Use Cost Centre reports for department-wise tracking\n- Export to Excel and create your own dashboards\n\nTally also supports ODBC for real-time data in PowerBI or Excel." },
    ]
  },
  {
    label: "Keyboard Shortcuts",
    answer: "Master these shortcuts and TallyPrime becomes lightning fast:\n\n- Alt+G — Go To (find any feature instantly)\n- F1 — Switch between companies\n- F2 — Change date\n- F4 — Contra voucher\n- F5 — Payment voucher\n- F6 — Receipt voucher\n- F7 — Journal voucher\n- F8 — Sales voucher\n- F9 — Purchase voucher\n- Ctrl+A — Accept/Save\n- Ctrl+F — Search\n- Alt+F1 — Detailed view\n\nPro tip: Press Alt+G and type what you need — Tally finds it for you.",
    followUp: [
      { label: "Voucher shortcuts", answer: "Every voucher type has a shortcut:\n\n- F4 — Contra (bank-to-cash transfers)\n- F5 — Payment (outgoing money)\n- F6 — Receipt (incoming money)\n- F7 — Journal (adjustments)\n- F8 — Sales (your invoices)\n- F9 — Purchase (supplier bills)\n- F10 — Reversal Journal\n- Ctrl+F5 — Credit Note\n- Ctrl+F8 — Debit Note\n\nPlus: Ctrl+K opens the calculator panel from anywhere." },
    ]
  },
  {
    label: "Troubleshooting Tips",
    answer: "Common issues and fixes:\n\n- Data corruption: Use Data Integrity (Help > Troubleshooting > Data Integrity)\n- Slow performance: Compress data (Data > Compress)\n- Can't find a feature: Press Alt+G and search by name\n- GST mismatch: Use GST Reconciliation report\n- Bank BRS pending: Import statement via Banking menu\n- Backup lost: Check Tally.ESD/Backup folder\n- License issue: Reactivate via Help > Manage License\n\nAlways keep backups. TallyPrime does auto-backup, but manual is safer.",
    followUp: [
      { label: "Data backup & restore", answer: "Backup & Restore:\n\nBackup:\n1. Go to Data > Backup\n2. Select company\n3. Choose destination folder\n4. Press Enter to confirm\n\nRestore:\n1. Go to Data > Restore\n2. Select backup file\n3. Choose destination\n4. Confirm\n\nTip: Backup daily. Store on external drive or cloud. TallyPrime also has auto-cloud backup via TallyDrive." },
    ]
  }
];

const WELCOME_TEXT = "Hi! I'm Sara. I help small businesses simplify their accounting, billing, and taxes so you can focus on growing. How can I make your workday easier today?";

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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll and pin container below the sticky header
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const pin = () => {
      const el = containerRef.current;
      if (!el) return;
      const sticky = document.querySelector('[class*="sticky"][class*="z-"]') as HTMLElement | null;
      const top = sticky ? sticky.getBoundingClientRect().bottom : 0;
      el.style.top = `${top}px`;
    };

    pin();
    window.addEventListener('resize', pin);
    // Re-pin after productbar collapse/expand settles
    const t1 = setTimeout(pin, 200);
    const t2 = setTimeout(pin, 600);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('resize', pin);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Load tutorials
  useEffect(() => {
    fetch('/api/tutorials')
      .then(r => r.json())
      .then(data => { if (data && !data.error) setTutorials(data); })
      .catch(() => {});
  }, []);

  // Welcome message on mount
  useEffect(() => {
    setIsTyping(true);
    const t = setTimeout(() => {
      setMessages([{
        id: uid(),
        role: 'assistant',
        text: WELCOME_TEXT,
        timestamp: new Date()
      }]);
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

  const matchTutorials = useCallback((query: string): Tutorial[] => {
    if (tutorials.length === 0) return [];
    return findMatchingTutorials(tutorials, query, 3, 8);
  }, [tutorials]);

  const addAssistantMessage = useCallback((text: string, topics?: Topic[], queryText?: string) => {
    const matched = queryText ? matchTutorials(queryText) : [];
    setMessages(prev => [...prev, {
      id: uid(),
      role: 'assistant',
      text,
      topics,
      suggestedTutorials: matched.length > 0 ? matched : undefined,
      timestamp: new Date()
    }]);
  }, [matchTutorials]);

  // Simulate typing delay then respond
  const respondWithDelay = useCallback((text: string, topics?: Topic[], queryText?: string) => {
    setIsTyping(true);
    // Gentler timing: 900ms base + 10ms per character, capped at 3s
    const delay = Math.min(900 + text.length * 10, 3000);
    setTimeout(() => {
      setIsTyping(false);
      addAssistantMessage(text, topics, queryText);
    }, delay);
  }, [addAssistantMessage]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const query = inputValue.trim();
    setInputValue('');

    // Add user message
    setMessages(prev => [...prev, {
      id: uid(),
      role: 'user',
      text: query,
      timestamp: new Date()
    }]);

    // Find matching topic — broad keyword matching
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    const scoredTopics = saraTopics.map(t => {
      const labelLower = t.label.toLowerCase();
      const answerLower = t.answer.toLowerCase();
      let score = 0;
      
      // Exact label match
      if (labelLower.includes(queryLower)) score += 20;
      
      // Label keyword matches
      for (const word of queryWords) {
        if (labelLower.includes(word)) score += 5;
        if (answerLower.includes(word)) score += 2;
      }
      
      // Check follow-up labels too
      if (t.followUp) {
        for (const fu of t.followUp) {
          const fuLower = fu.label.toLowerCase();
          for (const word of queryWords) {
            if (fuLower.includes(word)) score += 3;
          }
        }
      }
      
      return { topic: t, score };
    }).sort((a, b) => b.score - a.score);

    const bestMatch = scoredTopics[0];
    if (bestMatch && bestMatch.score >= 5) {
      respondWithDelay(bestMatch.topic.answer, bestMatch.topic.followUp, query);
    } else {
      // Helpful fallback — still tries to guide the user
      respondWithDelay(
        `Good question! While I specialize in TallyPrime and business automation, here's what I can help with:\n\n- Accounting, billing & invoicing\n- GST filing & tax compliance\n- Inventory & stock management\n- Banking & reconciliation\n- Payroll & employee management\n- Reports & business insights\n- Keyboard shortcuts & productivity tips\n\nTry asking about any of these!`,
        undefined,
        query
      );
    }
  };

  const handleReset = () => {
    setMessages([]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{
        id: uid(),
        role: 'assistant',
        text: WELCOME_TEXT,
        timestamp: new Date()
      }]);
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
    <div className="w-8 h-8 rounded-full bg-[#4A6E62] flex items-center justify-center shrink-0 shadow-md shadow-[#4A6E62]/20">
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
    <div ref={containerRef} className="fixed left-0 right-0 bottom-0 flex flex-col bg-[#F5F4ED] overflow-hidden z-[100]">

      {/* Chat Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 mb-4 animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Bot avatar (left) */}
              {msg.role === 'assistant' && <BotAvatar />}

              <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                {/* Message bubble */}
                <div className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#4A6E62] text-white rounded-br-md'
                    : 'bg-white text-slate-700 rounded-bl-md border border-slate-100'
                }`}>
                  {msg.text}
                </div>

                {/* Timestamp */}
                <p className={`text-[9px] text-slate-400 mt-1 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.timestamp)}
                </p>

                {/* Follow-up chips */}
                {msg.role === 'assistant' && msg.topics && msg.topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.topics.map((topic, ti) => (
                      <button
                        key={ti}
                        onClick={() => handleFollowUp(topic)}
                        className="px-3 py-1.5 bg-[#F0F5F2] hover:bg-[#4A6E62] hover:text-white text-[#4A6E62] rounded-full text-[11px] font-bold transition-all border border-[#4A6E62]/15 hover:border-[#4A6E62] hover:shadow-md active:scale-95"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested tutorials */}
                {msg.role === 'assistant' && msg.suggestedTutorials && msg.suggestedTutorials.length > 0 && (
                  <div className="mt-3 bg-[#F5F4ED] rounded-2xl p-3 border border-[#E0EDE6]">
                    <p className="text-[9px] font-bold text-[#4A6E62] uppercase tracking-widest mb-2">
                      Related tutorials
                    </p>
                    <div className="space-y-1.5">
                      {msg.suggestedTutorials.map((tutorial) => (
                        <Link
                          key={tutorial._id}
                          href="/tutorials"
                          className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#E0EDE6]/50 hover:border-[#4A6E62]/30 hover:shadow-sm transition-all group"
                        >
                          <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                            {tutorial.type === 'video' ? (
                              <img src={getYoutubeThumbnail(tutorial.url)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-4 h-4 text-[#4A6E62]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 group-hover:text-[#4A6E62] transition-colors leading-snug truncate">
                              {tutorial.title}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">
                              {tutorial.folder || 'Tutorial'} {tutorial.type === 'video' && '· Video'}
                            </p>
                          </div>
                          <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#4A6E62] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
                  <span className="w-2 h-2 bg-[#4A6E62]/40 rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.2s]" />
                  <span className="w-2 h-2 bg-[#4A6E62]/40 rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.2s]" />
                  <span className="w-2 h-2 bg-[#4A6E62]/40 rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="shrink-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 bg-slate-50 rounded-full border border-slate-200 focus-within:border-[#4A6E62]/40 focus-within:ring-2 focus-within:ring-[#4A6E62]/10 transition-all px-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Sara anything about Tally..."
              disabled={isTyping}
              className="flex-1 bg-transparent px-4 py-3 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#4A6E62] text-white flex items-center justify-center shrink-0 hover:bg-[#3D5E52] disabled:opacity-30 disabled:hover:bg-[#4A6E62] transition-all active:scale-90 shadow-lg shadow-[#4A6E62]/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
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
