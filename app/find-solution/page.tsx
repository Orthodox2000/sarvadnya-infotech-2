'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// --- CONFIGURATION ---

interface Option {
  label: string;
  value: string;
  icon?: string;
  scores?: Record<string, number>;
  nextId?: string;
}

interface Question {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  // PHASE 1: BUSINESS PROFILE
  {
    id: 'business_type',
    phase: 'Business Profile',
    title: 'What best describes your business?',
    subtitle: 'This helps us understand your organizational complexity.',
    options: [
      { label: 'New Business', value: 'New', icon: 'M12 4v16m8-8H4', scores: { tallySilver: 20, growth: 10 } },
      { label: 'Existing Business', value: 'Existing', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', scores: { amc: 10, tallyGold: 10 } },
      { label: 'Growing Business', value: 'Growing', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', scores: { tallyGold: 20, cloud: 10, growth: 20 } },
      { label: 'Multi-Branch Business', value: 'Multi-Branch', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9', scores: { cloud: 30, tallyGold: 20 } },
      { label: 'Enterprise Business', value: 'Enterprise', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', scores: { tallyServer: 30, amc: 20 } }
    ]
  },
  {
    id: 'industry',
    phase: 'Business Profile',
    title: 'Which industry best matches your operations?',
    subtitle: 'Industry-specific tools can solve 80% of manual overhead.',
    options: [
      { label: 'Trading & Distribution', value: 'Trading', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', scores: { whatsapp: 10, mobile: 10 } },
      { label: 'Manufacturing', value: 'Manufacturing', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', scores: { industryModule: 30, manufacturing: 30, automation: 20 } },
      { label: 'Logistics & Transport', value: 'Logistics', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5a1 1 0 01-1 1h-1m-6 0h-2', scores: { industryModule: 30, logistics: 30, mobile: 20 } },
      { label: 'Garments & Fashion', value: 'Garments', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', scores: { industryModule: 30, garments: 30, automation: 10 } },
      { label: 'Services & Others', value: 'Services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4', scores: { training: 10, amc: 10 } }
    ]
  },
  {
    id: 'users',
    phase: 'Business Profile',
    title: 'How many people need access to your system?',
    subtitle: 'Concurrency requirements determine the ideal Tally edition.',
    options: [
      { label: '1 User', value: '1', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', scores: { tallySilver: 50, efficiency: 10 } },
      { label: '2-5 Users', value: '2-5', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857', scores: { tallyGold: 50, efficiency: 20 } },
      { label: '6-15 Users', value: '6-15', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857', scores: { tallyGold: 60, cloud: 10, efficiency: 30 } },
      { label: '15-50 Users', value: '15-50', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', scores: { tallyGold: 30, tallyServer: 40, cloud: 20, automation: 20, risk: 20 } },
      { label: '50+ Users', value: '50+', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', scores: { tallyServer: 70, cloud: 30, automation: 30, risk: 30 } }
    ]
  },

  // PHASE 2: CURRENT SYSTEM ANALYSIS
  {
    id: 'current_setup',
    phase: 'System Analysis',
    title: 'How are you currently managing accounts?',
    subtitle: 'Transition paths vary based on your legacy foundation.',
    options: [
      { label: 'TallyPrime', value: 'TallyPrime', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', nextId: 'tss', scores: { efficiency: 40, growth: 20 } },
      { label: 'Other Software', value: 'Other', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', scores: { training: 20, growth: 10, efficiency: -20 } },
      { label: 'Excel & Manual Work', value: 'Manual', icon: 'M9 17v-2m3 2v-4m3 2v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z', scores: { tdl: 20, automation: 50, training: 10, risk: 40, efficiency: -40, growth: -20 } },
      { label: 'Multiple Systems', value: 'Multiple', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', scores: { automation: 40, cloud: 10, risk: 20, efficiency: -30, growth: -10 } },
      { label: 'Starting Fresh', value: 'Fresh', icon: 'M12 4v16m8-8H4', scores: { training: 20, growth: 20, efficiency: -10 } }
    ]
  },
  {
    id: 'tss',
    phase: 'System Analysis',
    title: 'What is your TSS status?',
    subtitle: 'Tally Software Services (TSS) unlocks cloud and mobile features.',
    options: [
      { label: 'Active', value: 'Active', icon: 'M5 13l4 4L19 7', scores: { efficiency: 20 } },
      { label: 'Expired', value: 'Expired', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', scores: { tss: 40, risk: 20, efficiency: -10 } },
      { label: 'Not Sure', value: 'Unknown', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', scores: { tss: 20, risk: 10, efficiency: -5 } }
    ]
  },
  {
    id: 'data_location',
    phase: 'System Analysis',
    title: 'Where is your business data stored?',
    subtitle: 'Data location significantly impacts security and accessibility.',
    options: [
      { label: 'Single Computer', value: 'Local', icon: 'M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', scores: { cloud: 20, backup: 20, risk: 30 } },
      { label: 'Office Server', value: 'Server', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', scores: { backup: 30, cloud: 10, risk: 20 } },
      { label: 'Multiple Locations', value: 'Branches', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9', scores: { cloud: 50, efficiency: -10 } },
      { label: 'Cloud', value: 'Cloud', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', scores: { efficiency: 30, growth: 20 } },
      { label: 'Not Sure', value: 'Unknown', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', scores: { risk: 40, backup: 20 } }
    ]
  },

  // PHASE 3: BUSINESS CHALLENGES
  {
    id: 'challenge',
    phase: 'Business Challenges',
    title: 'What is your biggest challenge today?',
    subtitle: 'Every friction point is an opportunity for automation.',
    options: [
      { label: 'Too Much Manual Work', value: 'Manual', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', scores: { automation: 40, tdl: 30 } },
      { label: 'Inventory Management', value: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', scores: { industryModule: 20, automation: 20 } },
      { label: 'Reporting & Visibility', value: 'Visibility', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', scores: { mobile: 30, training: 10 } },
      { label: 'Multi-Branch Operations', value: 'Branches', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', scores: { cloud: 40, efficiency: -20 } },
      { label: 'Data Security & Backup', value: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04', scores: { backup: 50, cloud: 10, risk: 50 } }
    ]
  },
  {
    id: 'excel_dependency',
    phase: 'Business Challenges',
    title: 'How often do you rely on Excel?',
    subtitle: 'Frequent manual entry into Excel indicates a need for TDL automation.',
    options: [
      { label: 'Daily', value: 'Daily', icon: 'M9 17v-2m3 2v-4m3 2v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z', scores: { automation: 50, tdl: 40, efficiency: -30 } },
      { label: 'Frequently', value: 'Frequent', icon: 'M9 17v-2m3 2v-4m3 2v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z', scores: { automation: 30, tdl: 20, efficiency: -10 } },
      { label: 'Sometimes', value: 'Sometimes', icon: 'M9 17v-2m3 2v-4m3 2v6', scores: { automation: 10 } },
      { label: 'Rarely', value: 'Rarely', icon: 'M5 13l4 4L19 7', scores: { efficiency: 20 } },
      { label: 'Never', value: 'Never', icon: 'M5 13l4 4L19 7', scores: { efficiency: 40 } }
    ]
  },

  // PHASE 4: GROWTH & AUTOMATION
  {
    id: 'growth_focus',
    phase: 'Growth & Automation',
    title: 'What would help your business grow faster?',
    subtitle: 'Strategic digital tools can accelerate operational velocity.',
    options: [
      { label: 'Mobile Access', value: 'Mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', scores: { mobile: 50, growth: 30 } },
      { label: 'WhatsApp Automation', value: 'WhatsApp', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20', scores: { whatsapp: 50, automation: 20, growth: 30 } },
      { label: 'Process Automation', value: 'Automation', icon: 'M13 10V3L4 14h7v7l9-11h-7z', scores: { tdl: 50, automation: 40, growth: 20 } },
      { label: 'Better Reports', value: 'Reporting', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', scores: { mobile: 20, training: 20, efficiency: 20 } },
      { label: 'Secure Remote Access', value: 'Remote', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', scores: { cloud: 50, growth: 20, risk: -10 } }
    ]
  },
  {
    id: 'industry_module',
    phase: 'Growth & Automation',
    title: 'Do you require industry specific functionality?',
    subtitle: 'Vertical specialization eliminates the need for external trackers.',
    options: [
      { label: 'Logistics', value: 'Logistics', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5a1 1 0 01-1 1h-1m-6 0h-2', scores: { industryModule: 50, logistics: 50 } },
      { label: 'Manufacturing', value: 'Manufacturing', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', scores: { industryModule: 50, manufacturing: 50 } },
      { label: 'Garments', value: 'Garments', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', scores: { industryModule: 50, garments: 50 } },
      { label: 'C&F Agency', value: 'CF', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', scores: { industryModule: 50, cf: 50 } },
      { label: 'Not Required', value: 'None', icon: 'M5 13l4 4L19 7', scores: { efficiency: 10 } }
    ]
  },

  // PHASE 5: IMPLEMENTATION READINESS
  {
    id: 'timeline',
    phase: 'Implementation Readiness',
    title: 'When are you planning improvements?',
    subtitle: 'Identifying your window for transition ensures resource availability.',
    options: [
      { label: 'Immediately', value: 'ASAP', icon: 'M13 10V3L4 14h7v7l9-11h-7z', scores: { lead: 30 } },
      { label: 'Within 30 Days', value: '30 Days', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', scores: { lead: 20 } },
      { label: 'Within 3 Months', value: '3 Months', icon: 'M8 7V3m8 4V3m-9 8h10', scores: { lead: 10 } },
      { label: 'Exploring Options', value: 'Exploring', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', scores: { lead: 0 } }
    ]
  },
  {
    id: 'support_level',
    phase: 'Implementation Readiness',
    title: 'What type of support do you expect?',
    subtitle: 'Service levels define our ongoing commitment to your success.',
    options: [
      { label: 'Basic Support', value: 'Basic', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', scores: { efficiency: 10 } },
      { label: 'Priority Support', value: 'Priority', icon: 'M5 13l4 4L19 7', scores: { amc: 50 } },
      { label: 'Dedicated Assistance', value: 'Dedicated', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', scores: { amc: 70, training: 20 } },
      { label: 'Staff Training', value: 'Training', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', scores: { training: 50 } },
      { label: 'Fully Managed Service', value: 'Managed', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04', scores: { amc: 80, cloud: 30, tss: 20 } }
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
  const [history, setHistory] = useState<string[]>(['business_type']);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });

  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const currentId = history[history.length - 1];
  const currentQuestion = QUESTIONS.find(q => q.id === currentId);

  // --- SCORING ENGINE ---

  const scores = useMemo(() => {
    const s = {
      tallySilver: 0, tallyGold: 0, tallyServer: 0, tss: 0, cloud: 0, backup: 0,
      amc: 0, tdl: 0, mobile: 0, whatsapp: 0, training: 0, industryModule: 0,
      efficiency: 50, growth: 30, automation: 20, risk: 10, lead: 0
    };

    Object.entries(answers).forEach(([qId, val]) => {
      const q = QUESTIONS.find(q => q.id === qId);
      const opt = q?.options.find(o => o.value === val);
      if (opt?.scores) {
        Object.entries(opt.scores).forEach(([key, points]) => {
          if (key in s) (s as any)[key] += points;
        });
      }
    });

    return s;
  }, [answers]);

  const topRecommendations = useMemo(() => {
    const items = Object.entries(RECOMMENDATION_MAP).map(([key, info]) => ({
      key,
      ...info,
      score: (scores as any)[key]
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
    if (isFinished && !aiInsight && !isLoadingInsight) {
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
  }, [isFinished, answers, businessScores, topRecommendations, aiInsight, isLoadingInsight]);

  // --- ACTIONS ---

  useEffect(() => {
    setIsEntering(true);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsEntering(false), 500);
    return () => clearTimeout(timer);
  }, [currentId, isFinished]);

  const handleOptionSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentId]: value }));
  };

  const next = () => {
    const selectedValue = answers[currentId];
    if (!selectedValue) return;

    const opt = currentQuestion?.options.find(o => o.value === selectedValue);
    if (opt?.nextId) {
      setHistory(prev => [...prev, opt.nextId!]);
      return;
    }

    const currentIndex = QUESTIONS.findIndex(q => q.id === currentId);
    if (currentIndex < QUESTIONS.length - 1) {
      // Logic for conditional phases could go here
      const nextQ = QUESTIONS[currentIndex + 1];
      
      // Skip logic: if current setup is not TallyPrime, skip TSS question
      if (nextQ.id === 'tss' && answers['current_setup'] !== 'TallyPrime') {
        setHistory(prev => [...prev, QUESTIONS[currentIndex + 2].id]);
      } else {
        setHistory(prev => [...prev, nextQ.id]);
      }
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsFinished(true);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const back = () => {
    if (history.length > 1) setHistory(prev => prev.slice(0, -1));
  };

  const restart = () => {
    setHistory(['business_type']);
    setAnswers({});
    setIsFinished(false);
    setIsSubmitted(false);
    setShowLeadModal(false);
    setAiInsight('');
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

  if (!currentQuestion && !isFinished) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      {/* Radiant Atmosphere (Radiant Sky Theme) */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#f0f9ff] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#e0f2fe] rounded-full blur-[140px]" />
      </div>

      {!isFinished ? (
        <div className={`w-full flex flex-col lg:flex-row flex-1 transition-all duration-700 ${isEntering ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>

          {/* LEFT SIDEBAR: Tracker */}
          <div className="lg:w-56 bg-white border-b lg:border-r border-slate-100 flex flex-row lg:flex-col justify-between py-4 lg:py-8 px-5 shrink-0 relative z-10">
            <div className="space-y-8 w-full">
              <div className="space-y-1 hidden lg:block">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00ABE4]">Solution Engine V2</div>
                <div className="text-lg font-black text-slate-900 tracking-tight leading-none">Consultation</div>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 lg:space-y-4 overflow-x-auto no-scrollbar">
                {['Profile', 'Analysis', 'Challenges', 'Growth', 'Readiness'].map((phase, i) => {
                  const isActive = currentQuestion?.phase.includes(phase);
                  return (
                    <div key={phase} className={`flex items-center gap-3 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-30'}`}>
                      <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-lg border flex items-center justify-center text-[9px] font-black ${isActive ? 'bg-[#00ABE4] border-[#00ABE4] text-white shadow-lg' : 'border-slate-200 text-slate-400'}`}>
                        {i + 1}
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest hidden lg:block text-slate-900">
                        {phase}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={back} disabled={history.length === 1} className="group flex items-center gap-2 px-5 py-2.5 bg-[#f0f9ff] border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#00ABE4] shadow-md hover:bg-white hover:border-[#00ABE4]/30 disabled:opacity-0 transition-all shrink-0">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> <span>Back</span>
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-white flex flex-col justify-start px-4 lg:px-12 py-4 lg:py-10 relative z-10 overflow-y-auto">
            <div className="max-w-3xl w-full mx-auto space-y-6 lg:space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-blue-100 text-[#00ABE4] text-[9px] font-black uppercase tracking-[0.2em]">
                  {currentQuestion?.phase}
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter leading-none">
                  {currentQuestion?.title}
                </h1>
                <p className="text-slate-500 text-xs lg:text-sm font-medium leading-relaxed max-w-xl">
                  {currentQuestion?.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {currentQuestion?.options.map((option, idx) => {
                  const isSelected = answers[currentId] === option.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`group relative flex items-center gap-3 p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-500 bg-white ${
                        isSelected 
                          ? 'border-[#00ABE4] bg-[#f0f9ff] shadow-lg shadow-blue-900/5 -translate-y-0.5' 
                          : 'border-slate-50 hover:border-[#00ABE4]/20 hover:bg-slate-50 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isSelected ? 'bg-[#00ABE4] text-white shadow-md' : 'bg-[#f1f5f9] text-slate-400 group-hover:bg-white group-hover:text-[#00ABE4]'
                      }`}>
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon} />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className={`block text-xs lg:text-sm font-black tracking-tight transition-colors ${
                          isSelected ? 'text-[#0371a3]' : 'text-slate-900'
                        }`}>
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Action */}
          <div className="lg:w-64 bg-white lg:bg-[#f8fafc] border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-center px-4 lg:px-8 py-4 lg:py-0 shrink-0 relative z-10">
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-3 py-6">
                   <div className="w-8 h-8 border-3 border-slate-200 border-t-[#00ABE4] rounded-full animate-spin" />
                   <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Processing...</div>
                </div>
              ) : (
                <>
                  <button
                    onClick={next}
                    disabled={!answers[currentId]}
                    className="group relative w-full py-4 lg:py-5 bg-[#00ABE4] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-blue-500/10 hover:bg-[#0371a3] hover:shadow-blue-500/20 disabled:bg-slate-200 disabled:text-slate-400 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <span>{history.length === QUESTIONS.length ? 'Analyze Results' : 'Continue'}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                  <div className="hidden lg:block pt-6 border-t border-slate-200/60 text-center">
                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-loose">
                      Strategic Protocol <br/> v1.1.381
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        // --- RESULT PAGE ---
        <div className="w-full bg-white flex flex-col min-h-screen overflow-y-auto relative z-20 p-4 lg:p-12">
          <div className="max-w-6xl w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#f0f9ff] text-[#00ABE4] text-[9px] font-black uppercase tracking-[0.3em]">
                  Analysis Complete
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none italic">Your Recommendations.</h2>
              </div>
              <button onClick={restart} className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 shadow-sm">
                ↺ Restart
              </button>
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
              <div className="lg:col-span-2 space-y-6">
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

              {/* Personalized Insight */}
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
                    "{aiInsight || `Because your business requires ${answers.users} user access, identifies ${answers.challenge} as a major bottleneck, and targets ${answers.growth_focus} for expansion, we highly recommend a transition to ${topRecommendations[0]?.label}.`}"
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
                Sarvadnya Infotech LLP • Strategic Analysis Unit
              </p>
            </div>
          </div>
        </div>
      )
}

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
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Get Solution Blueprint →'}
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
