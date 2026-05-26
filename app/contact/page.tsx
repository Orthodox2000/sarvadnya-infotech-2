'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "../components/Footer";

export type SiteSettings = {
  support_phone: string;
  whatsapp_phone: string;
  support_email: string;
  office_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  facebook_handle: string;
  instagram_handle: string;
  linkedin_handle: string;
  map_iframe_url: string;
};

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType: 'general',
          description: formData.message
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIsSuccess(true);
      setFormData({ name: '', email: '', contact: '', service: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data && !data.error) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch contact settings:', err);
    }
  };

  const formatPhoneDisplay = (phone: string) => {
      const cleaned = phone.trim();
      if (cleaned.startsWith('+')) return cleaned;
      if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
      if (cleaned.length === 10) return `+91${cleaned}`;
      return cleaned;
  };

  const supportPhone = settings?.support_phone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || "9821309060";
  const whatsappPhone = settings?.whatsapp_phone || (settings as any)?.whatsapp_phone || supportPhone;
  const supportEmail = settings?.support_email || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@sarvadnyainfotech.com";
  
  // Helper to extract src from iframe tag if provided
  const getMapSrc = (input: string) => {
    if (!input || typeof input !== 'string') return "";
    const trimmed = input.trim();
    if (trimmed.includes('<iframe')) {
        // Find src attribute anywhere in the HTML string
        const match = trimmed.match(/src=["']([^"']+)["']/i);
        return match ? match[1] : "";
    }
    return trimmed;
  };

  const mapSrc = getMapSrc(settings?.map_iframe_url || process.env.NEXT_PUBLIC_MAP_IFRAME_URL || "");

  const socialMedia = [
    { name: 'WhatsApp', handle: whatsappPhone, url: `https://wa.me/${whatsappPhone.replace(/\D/g, '')}`, iconColor: 'text-[#25D366]', bgColor: 'bg-[#25D366]/10' },
    { name: 'Facebook', handle: settings?.facebook_handle || 'Sarvadnya Infotech', url: settings?.facebook_url || process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', iconColor: 'text-[#1877F2]', bgColor: 'bg-[#1877F2]/10' },
    { name: 'Instagram', handle: settings?.instagram_handle || '@sarvadnya_infotech', url: settings?.instagram_url || process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', iconColor: 'text-[#E4405F]', bgColor: 'bg-[#E4405F]/10' },
    { name: 'LinkedIn', handle: settings?.linkedin_handle || 'Sarvadnya Infotech LLP', url: settings?.linkedin_url || process.env.NEXT_PUBLIC_LINKEDIN_URL || '#', iconColor: 'text-[#0077B5]', bgColor: 'bg-[#0077B5]/10' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Centered Tighter Hero Section */}
      <section 
        className="bg-[#f0f8fa] pt-8 pb-8 md:pt-12 md:pb-12 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5"
      >
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center',opacity: 0.2 }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-white/10 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-sky-200/20 blur-[110px] -ml-24 -mb-24" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-[6px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
            <span className="flex h-0.5 w-0.5 rounded-full bg-slate-400"></span>
            Contact Us
          </div>
          <div className="relative inline-block mb-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">Touch</span>
            </h1>
          </div>
          <p className="text-slate-600/80 text-[10px] md:text-sm max-w-xl mx-auto leading-relaxed font-semibold text-center">
            Have questions about Tally? Need a custom module? Our team is here to help you optimize your business workflows.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {supportPhone.split(',').map((num, i) => (
            <a 
              key={i}
              href={`tel:${num.trim()}`}
              className="w-full sm:w-auto px-8 py-4 bg-[#00ABE4] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {formatPhoneDisplay(num.trim())}
            </a>
          ))}
          <a 
            href={`mailto:${supportEmail}`}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Support
          </a>
        </div>
        <div className="pt-4 flex items-center justify-center gap-2 text-[#0371a3] font-bold uppercase tracking-wider text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mon-Sat: 10am - 7:00pm (Support Call)
        </div>
      </section>

      {/* Social Media Grid */}
      <section className="pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-bold text-[#0371a3] mb-6 text-center md:text-left">Connect with Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialMedia.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              className={`p-5 min-h-[80px] rounded-2xl ${social.bgColor} border border-transparent hover:border-slate-200 transition-all duration-300 group shadow-sm flex items-center gap-4`}
            >
              <div className={`flex-shrink-0 ${social.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {social.name === 'WhatsApp' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.563 6.024L0 24l6.135-1.608a11.81 11.81 0 005.908 1.567h.005c6.635 0 12.045-5.411 12.047-12.047 0-3.217-1.252-6.242-3.525-8.514z"/></svg>}
                {social.name === 'Facebook' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>}
                {social.name === 'Instagram' && <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>}
                {social.name === 'LinkedIn' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#0371a3] leading-none mb-1.5">{social.name}</p>
                <p className="text-xs opacity-60 font-medium truncate">{social.handle}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Detailed Contact Section & Support Form */}
      <section className="pb-20 px-6 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Support Form */}
          <div className="lg:col-span-3 relative overflow-hidden bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(3,113,163,0.1)] text-slate-900 border border-slate-100 group">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E9F1FA] rounded-full blur-[120px] opacity-60 -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f0f9ff] rounded-full blur-[100px] opacity-60 -ml-32 -mb-32 transition-transform duration-1000 group-hover:scale-110" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F1FA] border border-[#00ABE4]/20 text-[#0371a3] text-[10px] font-bold uppercase tracking-widest mb-4">
                <span className="flex h-2 w-2 rounded-full bg-[#00ABE4] animate-pulse"></span>
                Priority Support
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight text-[#0371a3]">
                Request a <span className="text-[#00ABE4]">Callback</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm max-w-lg font-medium">
                Certified experts will call you back within <span className="text-[#00ABE4] font-bold underline decoration-[#00ABE4]/30 underline-offset-4">15 minutes</span>.
              </p>
              
              {isSuccess ? (
                <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#0371a3] mb-2">Request Received!</h3>
                  <p className="text-slate-500 font-medium">Our team will call you back within 15 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.contact}
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                        placeholder="+91 00000 00000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Service Needed</label>
                      <input
                        type="text"
                        value={formData.service}
                        onChange={e => setFormData({...formData, service: e.target.value})}
                        placeholder="e.g. TallyPrime Upgrade"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="How can we help you today?"
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/10 focus:border-[#00ABE4] resize-none transition-all shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full mt-2 py-4 bg-[#00ABE4] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,171,228,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10">Send Request Now</span>
                        <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ABE4] via-[#0371a3] to-[#00ABE4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
              )}
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[9px] text-slate-400 font-medium">
                  🔒 Your data is secure with Sarvadnya Infotech LLP.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <Image src={`/sa.png`} alt="Support" width={20} height={20} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold">50+ Support Team Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-full flex flex-col">
               <h3 className="text-lg font-bold text-[#0371a3] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Our Location
               </h3>
               <div className="flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-slate-100 relative group">
                  {mapSrc ? (
                    <iframe 
                      src={mapSrc}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                      Map Not Configured
                    </div>
                  )}
               </div>
               <div className="mt-4 p-4 bg-[#f0f9ff] rounded-2xl border border-[#E9F1FA]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00ABE4] mb-1">Office Address</p>
                  <p className="text-xs text-[#0371a3] leading-relaxed font-medium">
                    {settings?.office_address || "Sarvadnya Infotech LLP, Business Hub, Pune, Maharashtra, India"}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
