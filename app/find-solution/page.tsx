'use client';

import { useState, useMemo, useEffect } from 'react';

// --- CONFIGURATION ---
const MIN_ANSWERS = 6;

interface Option {
  label: string;
  value: string;
  hint?: string;
  scores?: Record<string, number>;
}

interface Question {
  id: string;
  phase: string;
  title: string;
  hint: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  // PHASE 1: BUSINESS PROFILE
  {
    id: 'business_type',
    phase: 'Business Profile',
    title: 'What best describes your business today?',
    hint: 'Choose the option that most closely reflects how your business operates right now.',
    options: [
      { label: 'New business', value: 'New', hint: 'Recently launched and building your operating rhythm.', scores: { tallySilver: 25, growth: 10 } },
      { label: 'Startup', value: 'Startup', hint: 'You are validating a new idea or preparing to scale.', scores: { tallySilver: 20, growth: 10 } },
      { label: 'Established business', value: 'Established', hint: 'Running steadily with regular accounting and reporting needs.', scores: { tallyGold: 15, amc: 10 } }
    ]
  },
  {
    id: 'industry',
    phase: 'Business Profile',
    title: 'Which industry best matches your primary operations?',
    hint: 'Choose the industry that most closely reflects the way your business earns revenue and serves customers.',
    options: [
      { label: 'Trading & Distribution', value: 'Trading', hint: 'Buying and selling goods across supply chains.', scores: { whatsapp: 10, mobile: 10 } },
      { label: 'Manufacturing', value: 'Manufacturing', hint: 'Producing goods from raw materials.', scores: { industryModule: 30, automation: 20 } },
      { label: 'Logistics & Transport', value: 'Logistics', hint: 'Managing fleet, shipments, and deliveries.', scores: { industryModule: 30, mobile: 20 } },
      { label: 'Garments & Fashion', value: 'Garments', hint: 'Apparel design, production, and retail.', scores: { industryModule: 30, automation: 10 } },
      { label: 'Services & Others', value: 'Services', hint: 'Consulting, hospitality, or other service businesses.', scores: { training: 10, amc: 10 } }
    ]
  },
  {
    id: 'users',
    phase: 'Business Profile',
    title: 'How many users need regular access to your accounting system?',
    hint: 'Include the people who will actually log in, create entries, view reports, or manage day-to-day work.',
    options: [
      { label: '1 User', value: '1', hint: 'Single person handling accounts.', scores: { tallySilver: 50, efficiency: 10 } },
      { label: '2-5 Users', value: '2-5', hint: 'Small team working together.', scores: { tallyGold: 50, efficiency: 20 } },
      { label: '6-15 Users', value: '6-15', hint: 'Growing team with concurrent access needs.', scores: { tallyGold: 60, cloud: 10, efficiency: 30 } },
      { label: '15-50 Users', value: '15-50', hint: 'Large team across departments.', scores: { tallyGold: 30, tallyServer: 40, cloud: 20, automation: 20, risk: 20 } },
      { label: '50+ Users', value: '50+', hint: 'Enterprise-scale concurrent access.', scores: { tallyServer: 70, cloud: 30, automation: 30, risk: 30 } }
    ]
  },

  // PHASE 2: SYSTEM ANALYSIS
  {
    id: 'current_setup',
    phase: 'System Analysis',
    title: 'What accounting setup are you using at the moment?',
    hint: 'Tell us whether you are using TallyPrime, another tool, spreadsheets, or a manual process.',
    options: [
      { label: 'TallyPrime', value: 'TallyPrime', hint: 'Already using TallyPrime for accounting.', scores: { efficiency: 40, growth: 20 } },
      { label: 'Other Software', value: 'Other', hint: 'Using another accounting software.', scores: { training: 20, growth: 10, efficiency: -20 } },
      { label: 'Excel & Manual Work', value: 'Manual', hint: 'Still managing books on Excel or paper.', scores: { tdl: 20, automation: 50, training: 10, risk: 40, efficiency: -40, growth: -20 } },
      { label: 'Multiple Systems', value: 'Multiple', hint: 'Juggling multiple tools and spreadsheets.', scores: { automation: 40, cloud: 10, risk: 20, efficiency: -30, growth: -10 } },
      { label: 'Starting Fresh', value: 'Fresh', hint: 'No existing system — building from scratch.', scores: { training: 20, growth: 20, efficiency: -10 } }
    ]
  },
  {
    id: 'tss',
    phase: 'System Analysis',
    title: 'What is the current status of your TSS subscription?',
    hint: 'Tally Software Services keeps your TallyPrime features and updates current.',
    options: [
      { label: 'Active', value: 'Active', hint: 'TSS is currently valid and running.', scores: { efficiency: 20 } },
      { label: 'Expired', value: 'Expired', hint: 'TSS has lapsed and needs renewal.', scores: { tss: 40, risk: 20, efficiency: -10 } },
      { label: 'Not Sure', value: 'Unknown', hint: 'Not sure about the current TSS status.', scores: { tss: 20, risk: 10, efficiency: -5 } }
    ]
  },
  {
    id: 'data_location',
    phase: 'System Analysis',
    title: 'Where does your business operate from?',
    hint: 'This helps us understand whether your team works from one office, multiple branches, or a distributed setup.',
    options: [
      { label: 'Single office', value: 'Local', hint: 'Most work is handled from one location.', scores: { cloud: 20, backup: 20, risk: 20 } },
      { label: 'Multiple branches', value: 'Branches', hint: 'Your team works across more than one branch or office.', scores: { cloud: 50, efficiency: -10 } },
      { label: 'Field or site operations', value: 'Field', hint: 'Your team spends much of the day on-site or on the move.', scores: { mobile: 30, cloud: 10, risk: 20 } },
      { label: 'Remote or hybrid team', value: 'Remote', hint: 'People work from different places and still need shared access.', scores: { cloud: 40, mobile: 20, growth: 10 } }
    ]
  },

  // PHASE 3: BUSINESS CHALLENGES
  {
    id: 'challenge',
    phase: 'Business Challenges',
    title: 'What is the main operational challenge you want to solve first?',
    hint: 'Choose the issue that is currently creating the most friction, delay, or risk in your business.',
    options: [
      { label: 'Too Much Manual Work', value: 'Manual', hint: 'Repetitive tasks consuming too much time.', scores: { automation: 40, tdl: 30 } },
      { label: 'Inventory Management', value: 'Inventory', hint: 'Struggling to track stock across locations.', scores: { industryModule: 20, automation: 20 } },
      { label: 'Reporting & Visibility', value: 'Visibility', hint: 'Lack of real-time business insights.', scores: { mobile: 30, training: 10 } },
      { label: 'Multi-Branch Operations', value: 'Branches', hint: 'Difficulty managing multiple branches centrally.', scores: { cloud: 40, efficiency: -20 } },
      { label: 'Data Security & Backup', value: 'Security', hint: 'Worried about data loss or breaches.', scores: { backup: 50, cloud: 10, risk: 50 } }
    ]
  },
  {
    id: 'excel_dependency',
    phase: 'Business Challenges',
    title: 'How often do you rely on Excel for reporting or manual follow-up work?',
    hint: 'This helps us understand how much of your process still happens outside TallyPrime.',
    options: [
      { label: 'Daily', value: 'Daily', hint: 'Using Excel every single day.', scores: { automation: 50, tdl: 40, efficiency: -30 } },
      { label: 'Frequently', value: 'Frequent', hint: 'Multiple times a week.', scores: { automation: 30, tdl: 20, efficiency: -10 } },
      { label: 'Sometimes', value: 'Sometimes', hint: 'Once in a while for specific reports.', scores: { automation: 10 } },
      { label: 'Rarely', value: 'Rarely', hint: 'Hardly ever need Excel.', scores: { efficiency: 20 } },
      { label: 'Never', value: 'Never', hint: 'Everything is handled inside Tally.', scores: { efficiency: 40 } }
    ]
  },

  // PHASE 4: GROWTH & AUTOMATION
  {
    id: 'growth_focus',
    phase: 'Growth & Automation',
    title: 'Which improvement would create the most value for your business right now?',
    hint: 'Pick the area that would most improve speed, visibility, convenience, or control.',
    options: [
      { label: 'Mobile Access', value: 'Mobile', hint: 'Access reports and data on the go.', scores: { mobile: 50, growth: 30 } },
      { label: 'WhatsApp Automation', value: 'WhatsApp', hint: 'Send invoices and reports via WhatsApp.', scores: { whatsapp: 50, automation: 20, growth: 30 } },
      { label: 'Process Automation', value: 'Automation', hint: 'Automate repetitive accounting tasks.', scores: { tdl: 50, automation: 40, growth: 20 } },
      { label: 'Better Reports', value: 'Reporting', hint: 'Deeper insights and dashboards.', scores: { mobile: 20, training: 20, efficiency: 20 } },
      { label: 'Secure Remote Access', value: 'Remote', hint: 'Access your data from anywhere securely.', scores: { cloud: 50, growth: 20, risk: -10 } }
    ]
  },
  {
    id: 'industry_module',
    phase: 'Growth & Automation',
    title: 'Do you need a specialised module for your industry workflow?',
    hint: 'Choose the industry-specific functionality that best matches your daily operations.',
    options: [
      { label: 'Logistics', value: 'Logistics', hint: 'Fleet and shipment management.', scores: { industryModule: 50 } },
      { label: 'Manufacturing', value: 'Manufacturing', hint: 'BOM, batch, and production tracking.', scores: { industryModule: 50 } },
      { label: 'Garments', value: 'Garments', hint: 'Size, colour, and style management.', scores: { industryModule: 50 } },
      { label: 'C&F Agency', value: 'CF', hint: 'Carrying and forwarding agent needs.', scores: { industryModule: 50 } },
      { label: 'Not Needed', value: 'None', hint: 'Standard Tally features are sufficient.', scores: { efficiency: 10 } }
    ]
  },

  // PHASE 5: IMPLEMENTATION READINESS
  {
    id: 'timeline',
    phase: 'Implementation Readiness',
    title: 'When are you planning to implement the recommended changes?',
    hint: 'This helps us understand whether you need immediate support or are still evaluating options.',
    options: [
      { label: 'Immediately', value: 'ASAP', hint: 'Need to start right away.', scores: { lead: 30 } },
      { label: 'Within 30 Days', value: '30 Days', hint: 'Planning within the next month.', scores: { lead: 20 } },
      { label: 'Within 3 Months', value: '3 Months', hint: 'Evaluating options for this quarter.', scores: { lead: 10 } },
      { label: 'Exploring Options', value: 'Exploring', hint: 'Just researching for now.', scores: { lead: 0 } }
    ]
  },
  {
    id: 'support_level',
    phase: 'Implementation Readiness',
    title: 'What level of ongoing support would you prefer?',
    hint: 'Select the level of help your team would feel most comfortable with after implementation.',
    options: [
      { label: 'Basic Support', value: 'Basic', hint: 'Standard help when needed.', scores: { efficiency: 10 } },
      { label: 'Priority Support', value: 'Priority', hint: 'Faster response and dedicated queue.', scores: { amc: 50 } },
      { label: 'Dedicated Assistance', value: 'Dedicated', hint: 'A personal consultant assigned.', scores: { amc: 70, training: 20 } },
      { label: 'Staff Training', value: 'Training', hint: 'Training for your team members.', scores: { training: 50 } },
      { label: 'Fully Managed Service', value: 'Managed', hint: 'We handle everything end-to-end.', scores: { amc: 80, cloud: 30, tss: 20 } }
    ]
  }
];

const RECOMMENDATION_MAP: Record<string, { label: string, category: string }> = {
  tallySilver: { label: 'TallyPrime Silver', category: 'CORE SOFTWARE' },
  tallyGold: { label: 'TallyPrime Gold', category: 'CORE SOFTWARE' },
  tallyServer: { label: 'TallyPrime Server', category: 'CORE SOFTWARE' },
  tss: { label: 'TSS Renewal', category: 'SERVICES' },
  cloud: { label: 'AWS Cloud for Tally', category: 'CLOUD' },
  backup: { label: 'TallyDrive Backup', category: 'SECURITY' },
  amc: { label: 'Priority AMC Support', category: 'SERVICES' },
  tdl: { label: 'Process Automation (TDL)', category: 'AUTOMATION' },
  mobile: { label: 'BizAnalyst Mobile App', category: 'MOBILE' },
  whatsapp: { label: 'Tally on WhatsApp', category: 'AUTOMATION' },
  training: { label: 'Corporate Staff Training', category: 'SERVICES' },
  industryModule: { label: 'Industry Vertical Module', category: 'SPECIALIZATION' }
};

// --- MAIN COMPONENT ---

export default function FindSolutionPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const answeredCount = Object.keys(answers).length;

  // --- SCORING ENGINE ---

  const scores = useMemo(() => {
    const s: Record<string, number> = {
      tallySilver: 0, tallyGold: 0, tallyServer: 0, tss: 0, cloud: 0, backup: 0,
      amc: 0, tdl: 0, mobile: 0, whatsapp: 0, training: 0, industryModule: 0,
      efficiency: 50, growth: 30, automation: 20, risk: 10, lead: 0
    };

    Object.entries(answers).forEach(([qId, val]) => {
      const q = QUESTIONS.find(q => q.id === qId);
      const opt = q?.options.find(o => o.value === val);
      if (opt?.scores) {
        Object.entries(opt.scores).forEach(([key, points]) => {
          if (key in s) s[key] += points;
        });
      }
    });

    return s;
  }, [answers]);

  const topRecommendations = useMemo(() => {
    const items = Object.entries(RECOMMENDATION_MAP).map(([key, info]) => ({
      key,
      ...info,
      score: scores[key] || 0
    }));
    return items.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [scores]);

  const businessScores = useMemo(() => {
    const normalize = (val: number) => Math.min(Math.max(val, 0), 100);
    return {
      efficiency: normalize(scores.efficiency),
      growth: normalize(scores.growth),
      automation: scores.automation > 60 ? 'High' : scores.automation > 30 ? 'Medium' : 'Low',
      risk: scores.risk > 60 ? 'High' : scores.risk > 30 ? 'Medium' : 'Low'
    };
  }, [scores]);

  // --- AI STRATEGIC INSIGHT ---

  useEffect(() => {
    if (showResults && !aiInsight && !isLoadingInsight) {
      const fetchInsight = async () => {
        setIsLoadingInsight(true);
        try {
          const response = await fetch('/api/ai/strategic-insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              answers,
              scores: businessScores,
              recommendations: topRecommendations
            })
          });
          const data = await response.json();
          if (data.insight) setAiInsight(data.insight);
        } catch (err) {
          console.error('Failed to fetch AI insight:', err);
        } finally {
          setIsLoadingInsight(false);
        }
      };
      fetchInsight();
    }
  }, [showResults, answers, businessScores, topRecommendations, aiInsight, isLoadingInsight]);

  // --- ACTIONS ---

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (answeredCount < MIN_ANSWERS) {
      setError(`Please answer at least ${MIN_ANSWERS} questions to get accurate recommendations. (${answeredCount}/${MIN_ANSWERS} answered)`);
      return;
    }
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  const restart = () => {
    setAnswers({});
    setShowResults(false);
    setError('');
    setAiInsight('');
    setShowLeadModal(false);
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', company: '' });
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const summary = `
  BUSINESS CONSULTATION V2 REPORT:
  -------------------------------
  EFFICIENCY: ${businessScores.efficiency}%
  GROWTH READINESS: ${businessScores.growth}%
  AUTOMATION POTENTIAL: ${businessScores.automation}
  RISK LEVEL: ${businessScores.risk}

  TOP RECOMMENDATIONS:
  1. ${topRecommendations[0]?.label}
  2. ${topRecommendations[1]?.label}
  3. ${topRecommendations[2]?.label}

  STRATEGIC AI INSIGHT:
  ${aiInsight || 'Processing...'}

  USER ANSWERS:
  ${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n')}
      `;

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
          service: 'V2 Strategic Consultation',
          formType: 'demo',
          description: summary
        })
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      {/* Radiant Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#f0f9ff] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#e0f2fe] rounded-full blur-[140px]" />
      </div>

      {!showResults ? (
        <div className="w-full flex-1 relative z-10 overflow-y-auto">
          {/* Header */}
          <div className="max-w-5xl mx-auto px-4 pt-8 pb-4 lg:pt-12 lg:pb-6">
              <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-blue-100 text-[#00ABE4] text-[9px] font-black uppercase tracking-[0.2em]">
                Consultation Compass
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                Business Consultation
              </h1>
              <p className="text-slate-500 text-sm font-medium max-w-xl">
                Answer a few focused questions and we will recommend the most suitable Tally setup for your business.
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Complete as many questions as you can for a more precise recommendation.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-5xl mx-auto px-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00ABE4] rounded-full transition-all duration-700"
                  style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest whitespace-nowrap">
                {answeredCount}/{QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="max-w-5xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {QUESTIONS.map(q => (
                <div
                  key={q.id}
                  title={q.hint}
                  className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-5 space-y-3 transition-all duration-300 hover:border-[#00ABE4]/20 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <label
                        htmlFor={`q-${q.id}`}
                        title={q.hint}
                        className="block text-sm lg:text-base font-semibold text-slate-900 tracking-tight cursor-help"
                      >
                        {q.title}
                      </label>
                    </div>
                    {answers[q.id] && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 shrink-0 flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      id={`q-${q.id}`}
                      value={answers[q.id] || ''}
                      onChange={e => handleSelect(q.id, e.target.value)}
                      className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00ABE4] focus:bg-[#f0f9ff] transition-all cursor-pointer hover:border-slate-200"
                    >
                      <option value="">Select the closest match</option>
                      {q.options.map(o => (
                        <option key={o.value} value={o.value} title={o.hint}>{o.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-4 h-4 text-slate-400 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Selected option hint */}
                  {answers[q.id] && (() => {
                    const selected = q.options.find(o => o.value === answers[q.id]);
                    return selected?.hint ? (
                      <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                        {selected.hint}
                      </p>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>

            {/* Submit Area */}
            <div className="mt-8 text-center space-y-3">
              {error && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold text-red-500">{error}</span>
                </div>
              )}
              <button
                onClick={handleSubmit}
                className="group relative px-10 py-4 bg-[#00ABE4] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-blue-500/10 hover:bg-[#0371a3] hover:shadow-blue-500/20 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-3 mx-auto"
              >
                <span>Generate Recommendation</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.5em]">
                Answer as many relevant questions as you can for a stronger consultation &bull; {answeredCount} answered
              </p>
            </div>
          </div>
        </div>
      ) : (
        // --- RESULTS PAGE ---
        <div className="w-full bg-white flex flex-col min-h-screen overflow-y-auto relative z-20 p-4 lg:p-12">
          <div className="max-w-6xl w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#f0f9ff] text-[#00ABE4] text-[9px] font-black uppercase tracking-[0.3em]">
                  Consultation Complete
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none italic">Your Consultation Summary.</h2>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                <a
                  href="#top-recommendations"
                  className="px-5 py-2.5 bg-[#f0f9ff] text-[#0371a3] rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-[#e0f2fe] transition-all border border-blue-100 shadow-sm"
                >
                  Jump to Recommendations
                </a>
                <button onClick={restart} className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 shadow-sm">
                  ↺ Restart
                </button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Efficiency', val: `${businessScores.efficiency}%`, color: 'text-[#00ABE4]' },
                { label: 'Growth', val: `${businessScores.growth}%`, color: 'text-emerald-500' },
                { label: 'Automation', val: businessScores.automation, color: 'text-blue-600' },
                { label: 'Risk Level', val: businessScores.risk, color: businessScores.risk === 'High' ? 'text-red-500' : 'text-amber-500' }
              ].map((m, i) => (
                <div key={i} className="bg-[#f8fafc] p-5 lg:p-6 rounded-2xl border border-slate-100 space-y-0.5 text-center">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.label}</div>
                  <div className={`text-2xl font-black ${m.color}`}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div id="top-recommendations" className="lg:col-span-2 space-y-6 scroll-mt-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <span className="w-6 h-px bg-[#00ABE4]" /> Top Recommendations
                </h3>
                <div className="space-y-3">
                  {topRecommendations.map((rec, i) => (
                    <div key={i} className="group bg-[#f8fafc] border border-slate-100 p-5 lg:p-6 rounded-2xl hover:border-[#00ABE4]/20 hover:shadow-lg transition-all duration-500 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-black text-[#00ABE4] uppercase tracking-[0.2em]">{rec.category}</div>
                        <div className="text-xl font-black text-slate-900 tracking-tight">{rec.label}</div>
                      </div>
                      <div className="text-3xl font-black text-slate-200 group-hover:text-[#00ABE4]/20 transition-colors">0{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Insight */}
              <div className="bg-[#f0f9ff] p-6 lg:p-8 rounded-[2rem] border border-blue-100 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ABE4]/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                <h3 className="text-lg font-black tracking-tight text-[#0371a3] flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Strategic Insight
                </h3>
                {isLoadingInsight ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-blue-200/50 rounded-full w-full" />
                    <div className="h-4 bg-blue-200/50 rounded-full w-[90%]" />
                    <div className="h-4 bg-blue-200/50 rounded-full w-[80%]" />
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm lg:text-base font-medium leading-relaxed italic animate-in fade-in duration-1000">
                    &ldquo;{aiInsight || `Based on your inputs, a ${topRecommendations[0]?.label || 'Tally solution'} is the most suitable fit for your business needs.`}&rdquo;
                  </p>
                )}
                <div className="pt-4 border-t border-blue-200/50">
                  <button onClick={() => setShowLeadModal(true)} className="w-full py-4 bg-[#0371a3] text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#00ABE4] transition-all shadow-lg shadow-blue-900/10">
                    Get Implementation Roadmap
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-10 text-center">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[1em]">
                Sarvadnya Infotech LLP &bull; Strategic Analysis Unit
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LEAD CAPTURE MODAL */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden relative">
            <button onClick={() => setShowLeadModal(false)} className="absolute top-8 right-8 p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {!isSubmitted ? (
              <div className="p-8 pt-20 pb-10 lg:p-12 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none">Complete Your Profile</h4>
                  <p className="text-slate-500 text-sm font-medium">Get a full implementation blueprint and costing for your business.</p>
                </div>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all" />
                    <input required type="email" placeholder="Work Email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all" />
                    <input required type="tel" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9+]/g, '') }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all" />
                    <input type="text" placeholder="Company Name" value={formData.company} onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#00ABE4] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#0371a3] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Get Solution Blueprint \u2192'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-10 pt-20 pb-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-3xl font-black text-slate-900">Protocol Initiated.</h4>
                <p className="text-slate-500 text-sm font-medium">Our senior consultant will contact you shortly with your detailed roadmap.</p>
                <button onClick={() => setShowLeadModal(false)} className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-[9px]">Close Portal</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
