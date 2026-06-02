'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Option {
  label: string;
  value: string;
  icon?: string;
  nextId?: string; // Branching logic
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: Option[];
}

const QUESTIONS_TREE: Record<string, Question> = {
  'business_status': {
    id: 'business_status',
    title: 'Business Status',
    subtitle: 'Where are you in your Tally journey?',
    options: [
      { label: 'Starting New Business', value: 'New Business', icon: 'M12 4v16m8-8H4', nextId: 'industry' },
      { label: 'Existing Tally User', value: 'Existing User', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', nextId: 'tss_status' },
      { label: 'Using Other Software', value: 'Migration', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', nextId: 'industry' }
    ]
  },
  'tss_status': {
    id: 'tss_status',
    title: 'TSS Maintenance',
    subtitle: 'Is your Tally Software Services (TSS) currently active?',
    options: [
      { label: 'Yes, Active', value: 'Active', icon: 'M5 13l4 4L19 7', nextId: 'industry' },
      { label: 'No, Expired', value: 'Expired', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', nextId: 'industry' },
      { label: 'I am not sure', value: 'Unknown', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', nextId: 'industry' }
    ]
  },
  'industry': {
    id: 'industry',
    title: 'Industry Vertical',
    subtitle: 'Select your primary business sector for specialized logic.',
    options: [
      { label: 'Logistics & Transport', value: 'Logistics', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5a1 1 0 01-1 1h-1m-6 0h-2', nextId: 'logistics_focus' },
      { label: 'Manufacturing / ERP', value: 'Manufacturing', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', nextId: 'manufacturing_focus' },
      { label: 'Garment / Fashion', value: 'Garments', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', nextId: 'garment_focus' },
      { label: 'Retail / Trading', value: 'Retail', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', nextId: 'user_scale' },
      { label: 'C&F Agency', value: 'CF Agency', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', nextId: 'user_scale' }
    ]
  },
  'logistics_focus': {
    id: 'logistics_focus',
    title: 'Fleet Operations',
    subtitle: 'Identify your primary operational focus.',
    options: [
      { label: 'Own Fleet Mgt', value: 'Own Fleet', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5a1 1 0 01-1 1h-1m-6 0h-2', nextId: 'user_scale' },
      { label: 'Brokerage / Booking', value: 'Brokerage', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', nextId: 'user_scale' }
    ]
  },
  'manufacturing_focus': {
    id: 'manufacturing_focus',
    title: 'Production Detail',
    subtitle: 'What level of material tracking do you require?',
    options: [
      { label: 'Strict Wastage Tracking', value: 'Wastage Mgt', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', nextId: 'user_scale' },
      { label: 'Basic BOM / Finished Goods', value: 'Standard Production', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', nextId: 'user_scale' }
    ]
  },
  'garment_focus': {
    id: 'garment_focus',
    title: 'Inventory Logic',
    subtitle: 'Do you need to track stock by Size and Color?',
    options: [
      { label: 'Multi-Dimension (Size/Color)', value: 'Matrix Inventory', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', nextId: 'user_scale' },
      { label: 'Standard SKU Tracking', value: 'Simple SKU', icon: 'M7 7h10M7 12h10M7 17h10', nextId: 'user_scale' }
    ]
  },
  'user_scale': {
    id: 'user_scale',
    title: 'User Capacity',
    subtitle: 'How many people will use Tally simultaneously?',
    options: [
      { label: 'Single User', value: '1 User', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', nextId: 'employee_count' },
      { label: 'Small Team (2-5)', value: 'Multi-User (2-5)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', nextId: 'employee_count' },
      { label: 'Large Dept (6-15)', value: 'Multi-User (6-15)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', nextId: 'employee_count' },
      { label: 'Enterprise (15+)', value: 'Tally Server', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', nextId: 'employee_count' }
    ]
  },
  'employee_count': {
    id: 'employee_count',
    title: 'Organization Strength',
    subtitle: 'Total employee count including all departments.',
    options: [
      { label: '< 20 Employees', value: 'Small', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0', nextId: 'infrastructure' },
      { label: '20 - 100 Employees', value: 'Medium', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16', nextId: 'infrastructure' },
      { label: '100+ Employees', value: 'Large', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4', nextId: 'infrastructure' }
    ]
  },
  'infrastructure': {
    id: 'infrastructure',
    title: 'Work Model',
    subtitle: 'How does your team need to access data?',
    options: [
      { label: 'Local Office Only', value: 'On-Premise', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16', nextId: 'modernization' },
      { label: 'Hybrid (Remote Work)', value: 'Hybrid Cloud', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', nextId: 'modernization' },
      { label: 'Multi-Branch Sync', value: 'Multi-Location Cloud', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9', nextId: 'modernization' }
    ]
  },
  'modernization': {
    id: 'modernization',
    title: 'Growth Priority',
    subtitle: 'Which upgrade will impact your business most?',
    options: [
      { label: 'WhatsApp Automation', value: 'WhatsApp', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20', nextId: 'timeline' },
      { label: 'Mobile Business Dashboard', value: 'Mobile App', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', nextId: 'timeline' },
      { label: 'Excel Data Automation', value: 'Excel Tool', icon: 'M9 17v-2m3 2v-4m3 2v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z', nextId: 'timeline' },
      { label: 'Data Security & Backup', value: 'Backup', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04', nextId: 'timeline' }
    ]
  },
  'timeline': {
    id: 'timeline',
    title: 'Modernization Timeline',
    subtitle: 'When do you wish to initiate these upgrades?',
    options: [
      { label: 'Immediate (This Week)', value: 'ASAP', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { label: 'Planning (This Month)', value: 'Evaluation', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
    ]
  }
};

export default function FindSolutionPage() {
  const [history, setHistory] = useState<string[]>(['business_status']);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: ''
  });

  const currentId = history[history.length - 1];
  const currentQuestion = QUESTIONS_TREE[currentId];

  useEffect(() => {
    setIsEntering(true);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }
    const timer = setTimeout(() => setIsEntering(false), 500);
    return () => clearTimeout(timer);
  }, [currentId, isFinished]);

  const handleOptionSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentId]: value }));
  };

  const next = () => {
    const selectedValue = answers[currentId];
    if (!selectedValue) return;

    const selectedOption = currentQuestion.options.find(o => o.value === selectedValue);
    if (selectedOption?.nextId) {
      setHistory(prev => [...prev, selectedOption.nextId!]);
    } else {
      setIsFinished(true);
      generateAIAdvice({ ...answers, [currentId]: selectedValue });
    }
  };

  const back = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const generateAIAdvice = async (finalAnswers: any) => {
    setIsAnalyzing(true);
    try {
      const summaryParts = Object.entries(finalAnswers).map(([key, val]) => `${key}: ${val}`);
      const summary = summaryParts.join(', ');

      const knowledgeMap = `
      SARVADNYA INFOTECH OFFERINGS MAP:
      - CORE PRODUCTS: TallyPrime Silver (Single User), TallyPrime Gold (Multi-User), TallyPrime Server (Enterprise/50+ Users).
      - CLOUD SOLUTIONS: AWS Cloud for Tally (Official Partnership), Windows Dedicated VM (Full Desktop), NoSky Backup (Automated Encrypted Cloud).
      - VERTICAL MODULES: Logistics & Transport (Fleet/Trip Sheets), C&F Agencies (Container Tracking), Housing Societies (Maintenance Billing), Garment Module (Size/Color/Fabric Matrix).
      - UTILITY MODULES: Excel to Tally Import, Sales & Commission Automation.
      - SERVICES: Tally AMC (Priority Annual Support), TDL Customization (Bespoke Feature Development), Corporate Training, Tally on Mobile (Real-time Reporting), Tally to WhatsApp (Direct Document Sharing).
      `;

      const prompt = `Act as the Senior Strategic Unit for Sarvadnya Infotech LLP. 
      Analyze this comprehensive user profile: "${summary}". 

      OUR KNOWLEDGE BASE:
      ${knowledgeMap}

      Provide an exhaustive, prioritized strategic roadmap tailored EXCLUSIVELY to their needs. 
      Recommend multiple integrated solutions per category from our OFFERINGS MAP to provide a complete digital ecosystem.

      PRECISION RULE:
      If recommending "TDL Customization" or "AUTOMATION (TDL)", you MUST specify a descriptive, industry-specific name for the customization (e.g., "Brokerage Commission Reconciliation TDL" or "Fleet Performance Dashboard TDL") based on their industry (${finalAnswers.industry}) and modernization goals.

      STRICT FORMAT RULES:
      1. Start with exactly "TABLE_START"
      2. Provide 6-10 rows using "|" separator. 
         Format: [CATEGORY] | [PRIORITY (CRITICAL/HIGH/STRATEGIC)] | [Product Recommendations] | [Reasoning based on answers like "${finalAnswers.industry}" and "${finalAnswers.modernization}"]
      3. Categories: CORE SOFTWARE, CLOUD, SECURITY, AUTOMATION (TDL), MOBILE, COMPLIANCE, TRAINING.
      4. End with exactly "TABLE_END"
      5. Conclude with "SUMMARY: [A deep, 3-4 sentence strategic assessment. Start with 'Based on our assessment of your ${finalAnswers.industry} operations, we recommend...']"

      Use collective language: "We recommend", "Our Unit suggests".`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      });

      const data = await res.json();
      const rawText = data.message || data.content;
      // Clean ALL markdown markers (v1.1.357)
      const aiText = rawText ? rawText.replace(/\*/g, '') : null;
      setAiResponse(aiText || "Analysis complete.");

      if (typeof window !== 'undefined' && aiText) {
        sessionStorage.setItem('last_consultation', JSON.stringify({
          answers: finalAnswers,
          advice: aiText
        }));
      }
    } catch (err) {
      setAiResponse("TABLE_START\nCORE SOFTWARE | CRITICAL | TallyPrime Gold | High priority for your multi-user requirements.\nCLOUD | HIGH | AWS Cloud | Required for your branch synchronization focus.\nAUTOMATION | STRATEGIC | WhatsApp TDL | Enhances customer engagement.\nTABLE_END\nSUMMARY: Based on our assessment, we recommend prioritizing your license upgrade to Gold to support your team scale.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseReportData = (text: string | null) => {
    if (!text) return { table: [], summary: '' };

    const tableRows: Array<{ type: string, priority: string, product: string, reason: string }> = [];
    let summary = '';

    const lines = text.split('\n');
    let inTable = false;

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine.includes('TABLE_START')) { inTable = true; return; }
      if (cleanLine.includes('TABLE_END')) { inTable = false; return; }

      if (inTable && cleanLine.includes('|')) {
        const parts = cleanLine.split('|').map(p => p.trim());
        if (parts.length >= 4) {
          tableRows.push({ type: parts[0], priority: parts[1], product: parts[2], reason: parts[3] });
        } else if (parts.length === 3) {
          tableRows.push({ type: parts[0], priority: 'HIGH', product: parts[1], reason: parts[2] });
        }
      }

      if (cleanLine.startsWith('SUMMARY:')) {
        summary = cleanLine.replace('SUMMARY:', '').trim();
      }
    });

    if (tableRows.length === 0 && text) {
      summary = text.replace(/TABLE_START|TABLE_END|CORE SOFTWARE|CLOUD|SECURITY|AUTOMATION|MOBILE|COMPLIANCE|TRAINING/g, '').trim();
    }

    return { table: tableRows, summary };
  };

  const reportData = parseReportData(aiResponse);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    try {
      const consultationSummary = `
CONSULTATION RESULTS:
--------------------
${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n')}

AI ADVICE:
---------
${aiResponse}

BUSINESS NAME: ${formData.businessName || 'Not Provided'}
      `;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
          service: 'Strategic Consultation',
          formType: 'demo',
          description: consultationSummary
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setHistory(['business_status']);
    setAnswers({});
    setIsFinished(false);
    setAiResponse(null);
    setIsSubmitted(false);
    setShowLeadModal(false);
    setFormData({ name: '', email: '', phone: '', businessName: '' });
  };

  return (
    <div className="min-h-0 bg-white flex flex-col items-center justify-start p-0 font-sans overflow-hidden">
      {/* Radiant Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#f0f9ff] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#e0f2fe] rounded-full blur-[140px]" />
      </div>

      <div className={`w-full flex flex-col lg:flex-row flex-1 transition-all duration-700 ${isEntering ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>

        {!isFinished ? (
          <>
            {/* LEFT SIDEBAR: Nav Tracker */}
            <div className="lg:w-64 bg-white border-b lg:border-r border-slate-100 flex flex-row lg:flex-col justify-between py-4 lg:py-12 px-6 lg:px-8 shrink-0 relative z-10">
              <div className="space-y-12 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-12 w-full lg:w-auto overflow-x-auto no-scrollbar">
                <div className="space-y-1 hidden lg:block shrink-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00ABE4]">Strategic Path</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight leading-none">Consultation</div>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 lg:space-y-6 shrink-0">
                  {history.map((id, i) => (
                    <div key={id} className="flex items-center gap-3 lg:gap-4 group shrink-0">
                      <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl border flex items-center justify-center text-[10px] lg:text-xs font-black transition-all duration-500 bg-[#00ABE4] border-[#00ABE4] text-white shadow-lg`}>
                        {i + 1}
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest hidden lg:block text-slate-900`}>
                        {id.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                  {!isFinished && (
                     <div className="flex items-center gap-3 lg:gap-4 group shrink-0 opacity-40">
                        <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl border border-slate-200 flex items-center justify-center text-[10px] lg:text-xs font-black text-slate-300`}>
                          {history.length + 1}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest hidden lg:block text-slate-300">
                          Next Step
                        </div>
                     </div>
                  )}
                </div>
              </div>

              <button
                onClick={back}
                disabled={history.length === 1}
                className="group flex items-center gap-3 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-[#0371a3] disabled:opacity-0 transition-all shrink-0 ml-auto lg:ml-0"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> <span className="hidden lg:inline">Go Back</span>
              </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-white flex flex-col justify-start px-6 lg:px-20 py-6 lg:py-10 relative z-10 overflow-y-auto">
              <div className="max-w-4xl w-full mx-auto space-y-6 lg:space-y-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#f0f9ff] border border-blue-100 text-[#00ABE4] text-[10px] font-black uppercase tracking-[0.3em]">
                    Assessment Step {history.length}
                  </div>
                  <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                    {currentQuestion.title}
                  </h1>
                  <p className="text-slate-500 text-xs lg:text-base font-medium leading-relaxed max-w-2xl">
                    {currentQuestion.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentId] === option.value;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`group relative flex items-center gap-4 lg:gap-6 p-4 lg:p-7 rounded-xl lg:rounded-3xl border-2 transition-all duration-500 bg-white ${
                          isSelected 
                            ? 'border-[#00ABE4] bg-[#f0f9ff] shadow-xl shadow-blue-900/5 -translate-y-0.5' 
                            : 'border-slate-50 hover:border-[#00ABE4]/20 hover:bg-slate-50 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className={`w-10 h-10 lg:w-14 lg:h-14 shrink-0 rounded-lg lg:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isSelected ? 'bg-[#00ABE4] text-white shadow-lg' : 'bg-[#f1f5f9] text-slate-400 group-hover:bg-white group-hover:text-[#00ABE4]'
                        }`}>
                          <svg className="w-5 h-5 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={option.icon} />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className={`block text-sm lg:text-base font-black tracking-tight transition-colors ${
                            isSelected ? 'text-[#0371a3]' : 'text-slate-900'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#00ABE4] shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: Action Control */}
            <div className="lg:w-80 bg-[#f8fafc] border-t lg:border-l border-slate-100 flex flex-col justify-center px-10 shrink-0 relative z-10">
              <div className="space-y-8">
                <div className="space-y-1 text-center lg:text-left hidden lg:block">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Phase Completion</div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Confirm Move</h4>
                </div>
                
                <button
                  onClick={next}
                  disabled={!answers[currentId]}
                  className="group relative w-full py-4 lg:py-6 bg-[#00ABE4] text-white rounded-xl lg:rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] lg:text-[11px] shadow-xl shadow-blue-500/10 hover:bg-[#0371a3] hover:shadow-blue-500/20 disabled:bg-slate-200 disabled:text-slate-400 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">{!currentQuestion.options.find(o => o.value === answers[currentId])?.nextId ? 'Analyze Path' : 'Next Step'}</span>
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <div className="hidden lg:block pt-8 border-t border-slate-200/60 text-center">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-loose">
                    Analysis Protocol <br/> v1.1.361
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full bg-white flex flex-col min-h-screen overflow-y-auto relative z-20 p-6 lg:p-20">
            <div className="max-w-7xl w-full mx-auto space-y-12 lg:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">

              {/* Report Header & Actions */}
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 border-b border-slate-100 pb-5">
                <div className="space-y-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f0f9ff] text-[#00ABE4] text-[9px] font-black uppercase tracking-[0.4em]">
                    Strategic Roadmap
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none italic">Results.</h2>
                </div>

                <div className="flex items-center gap-2.5 mb-1">
                  <button
                    onClick={restart}
                    className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 flex items-center gap-2 shadow-sm"
                  >
                    <span>↺</span> <span className="hidden sm:inline">Restart</span>
                  </button>

                  {!isSubmitted ? (
                    <button
                      onClick={() => setShowLeadModal(true)}
                      className="px-5 py-2.5 bg-[#00ABE4] text-white rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-[#0371a3] transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 group"
                    >
                      <span>Ready for Growth?</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                  ) : (
                    <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase tracking-widest text-[9px] border border-emerald-100 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white font-black">✓</span>
                      <span>Initiated</span>
                    </div>
                  )}
                </div>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-24 lg:py-40 space-y-6 lg:space-y-10">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 border-[8px] lg:border-[12px] border-[#f0f9ff] border-t-[#00ABE4] rounded-full animate-spin shadow-xl lg:shadow-2xl shadow-blue-500/20" />
                  <p className="text-xl lg:text-3xl font-black uppercase tracking-[0.6em] text-slate-900 animate-pulse text-center">Building Strategy...</p>
                </div>
              ) : (
                <div className="space-y-10 lg:space-y-14">

                  {/* RESULTS DISPLAY */}
                  <div className="space-y-6 lg:space-y-10">
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] border-2 border-slate-900 shadow-2xl bg-white w-full">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="px-8 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.4em]">Layer</th>
                            <th className="px-8 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.4em]">Priority</th>
                            <th className="px-8 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.4em]">Recommendation(s)</th>
                            <th className="px-8 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.4em]">Strategic Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {reportData.table.length > 0 ? reportData.table.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-8 lg:px-10 py-6 lg:py-8 text-[11px] font-bold text-[#00ABE4] uppercase tracking-widest align-top whitespace-nowrap">{row.type}</td>
                              <td className="px-8 lg:px-10 py-6 lg:py-8 align-top">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                  row.priority === 'CRITICAL' ? 'bg-red-50 text-red-500 border border-red-100' :
                                  row.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  {row.priority}
                                </span>
                              </td>
                              <td className="px-8 lg:px-10 py-6 lg:py-8 text-[16px] font-bold text-slate-900 tracking-tight leading-tight align-top">{row.product}</td>
                              <td className="px-8 lg:px-10 py-6 lg:py-8 text-[13px] font-medium text-slate-500 italic leading-relaxed align-top">"{row.reason}"</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="px-10 py-32 text-center text-slate-300 font-black text-2xl uppercase tracking-[0.5em]">Strategizing...</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE PARAGRAPH VIEW */}
                    <div className="md:hidden space-y-12 px-2">
                       {reportData.table.map((row, i) => (
                         <div key={i} className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="text-[11px] font-bold text-[#00ABE4] uppercase tracking-widest whitespace-nowrap">{row.type}</div>
                               <div className="h-px flex-1 bg-slate-100" />
                               <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                  row.priority === 'CRITICAL' ? 'text-red-500 bg-red-50 border border-red-100' :
                                  row.priority === 'HIGH' ? 'text-amber-600 bg-amber-50 border border-amber-100' : 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                                }`}>
                                  {row.priority}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900 tracking-tighter leading-tight">{row.product}</div>
                            <p className="text-[14px] font-medium text-slate-500 italic leading-relaxed border-l-4 border-slate-100 pl-6">
                               {row.reason}
                            </p>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Advisory Summary: Executive Refinement */}
                  <div className="max-w-4xl mx-auto text-center space-y-6 pt-8 lg:pt-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
                      Strategic Advisory Summary
                    </div>

                    <p className="text-[16px] lg:text-[20px] font-medium text-slate-600 leading-relaxed max-w-3xl mx-auto italic px-4">
                      {reportData.summary || "Strategizing your growth path..."}
                    </p>

                    <div className="flex flex-col items-center gap-2 pt-4">
                       <div className="w-8 h-px bg-slate-100" />
                       <div className="text-[9px] font-bold uppercase tracking-[0.6em] text-slate-300">Sarvadnya Strategic Unit</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 lg:pt-6 text-center">
                <p className="text-[10px] lg:text-[11px] text-slate-300 font-bold uppercase tracking-[1em]">
                  Sarvadnya Strategic Protocol • MMXXVI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LEAD CAPTURE MODAL */}
        {showLeadModal && !isSubmitted && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 lg:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative">
              <button 
                onClick={() => setShowLeadModal(false)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-10 lg:p-14 space-y-8 lg:space-y-10">
                <div className="space-y-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#00ABE4] rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                    <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Ready for Growth?</h4>
                  <p className="text-slate-500 text-sm lg:text-base font-medium leading-relaxed">Submit this strategic roadmap to our senior consultants to initiate implementation.</p>
                </div>

                <form onSubmit={handleSubmitLead} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. john@company.com"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formData.businessName}
                      onChange={e => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-[#00ABE4] focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:col-span-2 w-full py-5 lg:py-6 bg-[#00ABE4] text-white rounded-2xl lg:rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] lg:text-[12px] hover:bg-[#0371a3] transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 mt-4 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Initiate Implementation Protocol</span>
                        <span className="text-xl leading-none mt-[-2px]">→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
