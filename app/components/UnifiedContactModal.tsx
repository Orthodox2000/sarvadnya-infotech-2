'use client';

import { useState, useEffect } from 'react';

export type FormType = 'quote' | 'enquire' | 'support' | 'callback' | 'general';

interface UnifiedContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: FormType;
  prefillService?: string;
  prefillDetails?: string;
}

export default function UnifiedContactModal({ 
  isOpen, 
  onClose, 
  type = 'general',
  prefillService = '',
  prefillDetails = ''
}: UnifiedContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    service: prefillService,
    description: prefillDetails
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData(prev => ({
        ...prev,
        service: prefillService,
        description: prefillDetails
      }));
    } else {
      document.body.style.overflow = 'unset';
      setIsSuccess(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, prefillService, prefillDetails]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const getTitle = () => {
    switch (type) {
      case 'quote': return 'Request a Quote';
      case 'enquire': return 'Product Enquiry';
      case 'support': return 'Priority Support';
      case 'callback': return 'Request Callback';
      default: return 'Contact Us';
    }
  };

  const getBadge = () => {
    switch (type) {
      case 'quote': return 'Custom Pricing';
      case 'enquire': return 'Detailed Info';
      case 'support': return '15-Min Response';
      case 'callback': return 'Quick Connect';
      default: return 'Get in Touch';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0f0529]/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.5)] relative animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div className="bg-[#0f0529] md:p-6 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7338a0] rounded-full blur-[60px] opacity-50 -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-600 rounded-full blur-[50px] opacity-30 -ml-12 -mb-12" />
          
          <button 
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-[20]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-10">
            <span className="inline-block px-3 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-200 mb-2 border border-white/10">
              {getBadge()}
            </span>
            <h2 className="text-2xl font-black tracking-tight">{getTitle()}</h2>
            <p className="mt-1 text-xs text-indigo-100/70 leading-relaxed">
              Fill in the details below and our team will get back to you shortly.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="md:p-6 p-8 bg-slate-50/50">
          {isSuccess ? (
            <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0f0529] mb-1">Request Received!</h3>
              <p className="text-slate-500 text-sm">We'll contact you within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="md:space-y-3 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/20 focus:border-[#7338a0] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Contact No. *</label>
                  <input
                    required
                    type="tel"
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                    placeholder="+91 00000 00000"
                    className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/20 focus:border-[#7338a0] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Service / Product</label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  placeholder="e.g. TallyPrime Gold"
                  className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/20 focus:border-[#7338a0] transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Additional Requirements</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us more about your needs..."
                  rows={3}
                  className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/20 focus:border-[#7338a0] transition-all shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-12 bg-[#7338a0] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-[#4a2574] transition-all flex items-center justify-center gap-3 overflow-hidden active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Request</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        <div className="px-8 pb-4 bg-slate-50/50">
          <p className="text-center text-[10px] text-slate-400 font-medium">
            🔒 Your data is secure with Sarvadnya Infotech LLP.
          </p>
        </div>
      </div>
    </div>
  );
}
