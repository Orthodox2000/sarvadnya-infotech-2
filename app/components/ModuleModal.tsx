'use client';

import { useEffect, useState, useCallback } from 'react';
import { Module } from '@/lib/modules';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onEnquire: (module: Module) => void;
}

export default function ModuleModal({ isOpen, onClose, module, onEnquire }: ModuleModalProps) {
  const [showPricing, setShowPricing] = useState(false);
  const [mathA, setMathA] = useState(0);
  const [mathB, setMathB] = useState(0);
  const [mathInput, setMathInput] = useState('');
  const [mathError, setMathError] = useState(false);

  const newQuestion = useCallback(() => {
    setMathA(Math.floor(Math.random() * 20) + 5);
    setMathB(Math.floor(Math.random() * 10) + 3);
    setMathInput('');
    setMathError(false);
  }, []);

  const revealPricing = () => {
    if (Number(mathInput.trim()) === mathA + mathB) {
      setShowPricing(true);
      setMathError(false);
    } else {
      setMathError(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowPricing(false);
      newQuestion();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, newQuestion]);

  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-teal-50 text-[#006569] text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100 mb-4">
            {module.category}
          </span>
          <h3 className="text-2xl md:text-4xl font-black mb-4 text-slate-900">{module.title}</h3>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base border-l-4 border-[#006569] pl-6 italic font-medium">
            {module.fullDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#006569] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006569]"></span>
              Core Features
            </h4>
            <ul className="space-y-3">
              {module.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <svg className="w-4 h-4 text-[#006569] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Business Benefits
            </h4>
            <ul className="space-y-3">
              {module.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <svg className="w-4 h-4 text-[#006569] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {module.pricing && module.pricing.length > 0 && (
          <div className="mb-10">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#006569] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006569]"></span>
              Module Pricing
            </h4>

            {!showPricing ? (
              <div>
                <button
                  onClick={revealPricing}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-[#006569] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-900/10 transition-all hover:bg-[#045A57]"
                >
                  View Price
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/40 p-4">
                  <p className="text-sm text-slate-700 font-medium mb-3">
                    Solve to reveal pricing: <span className="font-black text-[#006569]">{mathA} + {mathB} = ?</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      value={mathInput}
                      onChange={(e) => setMathInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') revealPricing(); }}
                      placeholder="Your answer"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006569]/30"
                    />
                    <button
                      onClick={revealPricing}
                      className="rounded-lg bg-[#006569] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#045A57] transition-all"
                    >
                      Reveal Price
                    </button>
                  </div>
                  {mathError && (
                    <p className="mt-2 text-xs font-bold text-red-600">Wrong answer — try again.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="overflow-hidden rounded-xl border border-teal-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-teal-50 text-[#006569]">
                        <th className="text-left px-3 py-2.5 font-black text-[10px] uppercase tracking-wider">Package</th>
                        <th className="text-right px-3 py-2.5 font-black text-[10px] uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {module.pricing.map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-teal-50/40' : 'bg-white'}>
                          <td className="px-3 py-2.5 text-slate-700 text-[12px] font-semibold">{row.label}</td>
                          <td className="px-3 py-2.5 text-right text-[#006569] text-[12px] font-black whitespace-nowrap">{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => { setShowPricing(false); newQuestion(); }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#006569] hover:underline"
                >
                  Hide Pricing
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onEnquire(module)}
            className="flex-1 py-4 bg-[#006569] text-white rounded-2xl font-bold hover:bg-[#006569] transition-all shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2"
          >
            Enquire Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
          <button 
            className="flex-1 py-4 border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}