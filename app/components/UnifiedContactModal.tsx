'use client';

import { useState, useEffect } from 'react';

export type FormType = 'quote' | 'enquire' | 'support' | 'callback' | 'demo' | 'general';

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
    email: '',
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
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType: type,
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset form for next time
        setFormData({
          name: '',
          email: '',
          contact: '',
          service: prefillService,
          description: prefillDetails
        });
      }, 2500);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to send request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'quote': return 'Request a Quote';
      case 'enquire': return 'Product Enquiry';
      case 'support': return 'Priority Support';
      case 'callback': return 'Request Callback';
      case 'demo': return 'Book a Free Demo';
      default: return 'Contact Us';
    }
  };

  const getBadge = () => {
    switch (type) {
      case 'quote': return 'Custom Pricing';
      case 'enquire': return 'Detailed Info';
      case 'support': return '15-Min Response';
      case 'callback': return 'Quick Connect';
      case 'demo': return 'Live Showcase';
      default: return 'Get in Touch';
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-[#0f0529]/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.5)] relative animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div className="bg-white sm:p-6 p-6 text-slate-900 relative overflow-hidden border-b border-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[60px] opacity-60 -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-50 rounded-full blur-[50px] opacity-40 -ml-12 -mb-12" />
          
          <button 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-[20] w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 sm:mb-3 border border-slate-200">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#0371a3] animate-pulse"></span>
              {getBadge()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-[#0f0529]">{getTitle()}</h2>
            <p className="mt-1.5 sm:mt-2 text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium">
              Fill in the details below and our team will get back to you within <span className="text-[#0371a3] font-bold">15 minutes</span>.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="sm:p-6 p-6 bg-slate-50/50">
          {isSuccess ? (
            <div className="py-6 sm:py-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-inner">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f0529] mb-1">Request Received!</h3>
              <p className="text-slate-500 text-xs sm:text-sm">We'll contact you within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sm:space-y-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2 sm:py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0371a3]/20 focus:border-[#0371a3] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2 sm:py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0371a3]/20 focus:border-[#0371a3] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Contact No. *</label>
                  <input
                    required
                    type="tel"
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                    placeholder="+91 00000 00000"
                    className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2 sm:py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0371a3]/20 focus:border-[#0371a3] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Service / Product</label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    placeholder="e.g. TallyPrime Gold"
                    className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2 sm:py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0371a3]/20 focus:border-[#0371a3] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Additional Requirements</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us more about your needs..."
                  rows={2}
                  className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0371a3]/20 focus:border-[#0371a3] transition-all shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-11 sm:h-12 bg-[#0371a3] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-[#00ABE4] transition-all flex items-center justify-center gap-3 overflow-hidden active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
