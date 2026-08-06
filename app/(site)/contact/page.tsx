'use client';

import { useState, useEffect } from "react";
import { Phone, Mail, Clock, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import Footer from "../../components/Footer";

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

const serviceSectors = [
  "TallyPrime",
  "Tally Certified Partner",
  "HRMS / Payroll",
  "Cloud / Hosting",
  "AWS / Windows Server",
  "Custom Module",
  "Annual Maintenance",
  "Other",
];

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    serviceSector: '',
    message: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service') || params.get('reason') || '';
    const message = params.get('message') || params.get('details') || '';

    if (!service && !message) return;

    setFormData(prev => ({
      ...prev,
      serviceSector: prev.serviceSector || service,
      message: prev.message || message
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.firstName,
          email: formData.email,
          contact: formData.phone,
          service: formData.serviceSector,
          formType: 'general',
          description: formData.message
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIsSuccess(true);
      setFormData({ firstName: '', email: '', phone: '', serviceSector: '', message: '' });
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
  const whatsappPhone = settings?.whatsapp_phone || supportPhone;
  const supportEmail = settings?.support_email || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@sarvadnyainfotech.com";

  const getMapSrc = (input: string) => {
    if (!input || typeof input !== 'string') return "";
    const trimmed = input.trim();
    if (trimmed.includes('<iframe')) {
        const match = trimmed.match(/src=["']([^"']+)["']/i);
        return match ? match[1] : "";
    }
    return trimmed;
  };

  const mapSrc = getMapSrc(settings?.map_iframe_url || process.env.NEXT_PUBLIC_MAP_IFRAME_URL || "") || "https://maps.google.com/maps?q=Kuberje%20Complex%2C%20Belapur%2C%20Navi%20Mumbai%2C%20MH&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const socialMedia = [
    { name: 'WhatsApp', handle: whatsappPhone, url: `https://wa.me/${whatsappPhone.replace(/\D/g, '')}`, iconColor: 'text-[#25D366]', bgColor: 'bg-[#25D366]/10' },
    { name: 'Facebook', handle: settings?.facebook_handle || 'Sarvadnya Infotech', url: settings?.facebook_url || process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', iconColor: 'text-[#1877F2]', bgColor: 'bg-[#1877F2]/10' },
    { name: 'Instagram', handle: settings?.instagram_handle || '@sarvadnya_infotech', url: settings?.instagram_url || process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', iconColor: 'text-[#E4405F]', bgColor: 'bg-[#E4405F]/10' },
    { name: 'LinkedIn', handle: settings?.linkedin_handle || 'Sarvadnya Infotech LLP', url: settings?.linkedin_url || process.env.NEXT_PUBLIC_LINKEDIN_URL || '#', iconColor: 'text-[#0077B5]', bgColor: 'bg-[#0077B5]/10' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] font-inter text-[#033B38]">
      {/* Header */}
      <section className="px-6 pt-16 pb-10 md:pt-24 md:pb-14 text-center bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#033B38]/5 border border-[#033B38]/10 text-[#033B38] text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006569]" />
            Contact Us
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-semibold tracking-tight text-[#033B38] leading-tight">
            Let&apos;s talk about <span className="italic text-[#006569]">your business</span>
          </h1>
          <p className="mt-4 text-[#5A5F5A] text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto">
            Have questions about Tally? Need a custom module? Our team is here to help you optimize your business workflows.
          </p>
        </div>
      </section>

      {/* Contact Band */}
      <section className="bg-[#033B38] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <a
            href={`tel:${supportPhone.split(',')[0].trim()}`}
            className="flex items-center gap-4 group"
          >
            <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#006569] transition-colors">
              <Phone className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Call Us</span>
              <span className="block text-base md:text-lg font-bold mt-0.5">{formatPhoneDisplay(supportPhone.split(',')[0].trim())}</span>
            </span>
          </a>
          <span className="hidden md:block w-px h-10 bg-white/15" />
          <a
            href={`mailto:${supportEmail}`}
            className="flex items-center gap-4 group"
          >
            <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#006569] transition-colors">
              <Mail className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Email Support</span>
              <span className="block text-base md:text-lg font-bold mt-0.5">{supportEmail}</span>
            </span>
          </a>
          <span className="hidden md:block w-px h-10 bg-white/15" />
          <div className="flex items-center gap-4 group">
            <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#006569]">
              <Clock className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Support Hours</span>
              <span className="block text-sm font-bold mt-0.5">Mon–Sat: 10AM – 7PM</span>
            </span>
          </div>
        </div>
      </section>

      {/* Form + Location */}
      <section className="max-w-7xl mx-auto px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Form Column */}
          <div className="bg-white rounded-[2rem] border border-[#033B38]/10 p-8 md:p-12 shadow-[0_20px_60px_rgba(3,59,56,0.06)]">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold tracking-tight">
              Send us a <span className="italic text-[#006569]">request</span>
            </h2>
            <p className="mt-2 text-sm text-[#5A5F5A] font-medium">
              Fill out the form and our team will get back to you within 15 minutes.
            </p>

            {isSuccess ? (
              <div className="mt-10 py-12 text-center">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#033B38] mb-1">Request Received!</h3>
                <p className="text-sm text-[#5A5F5A] font-medium">Our team will call you back within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#033B38]/40 mb-1.5">First Name</label>
                    <input
                      required
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-transparent border-b border-[#033B38]/20 py-2.5 text-sm text-[#033B38] placeholder:text-[#033B38]/30 focus:outline-none focus:border-[#006569] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#033B38]/40 mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full bg-transparent border-b border-[#033B38]/20 py-2.5 text-sm text-[#033B38] placeholder:text-[#033B38]/30 focus:outline-none focus:border-[#006569] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#033B38]/40 mb-1.5">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value.replace(/[^0-9+]/g, '')})}
                      placeholder="+91 00000 00000"
                      className="w-full bg-transparent border-b border-[#033B38]/20 py-2.5 text-sm text-[#033B38] placeholder:text-[#033B38]/30 focus:outline-none focus:border-[#006569] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#033B38]/40 mb-1.5">Service Sector</label>
                    <div className="relative">
                      <select
                        value={formData.serviceSector}
                        onChange={e => setFormData({...formData, serviceSector: e.target.value})}
                        className="w-full appearance-none bg-transparent border-b border-[#033B38]/20 py-2.5 text-sm text-[#033B38] focus:outline-none focus:border-[#006569] transition-colors cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        {serviceSectors.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#033B38]/40" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#033B38]/40 mb-1.5">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you today?"
                    rows={4}
                    className="w-full bg-transparent border-b border-[#033B38]/20 py-2.5 text-sm text-[#033B38] placeholder:text-[#033B38]/30 focus:outline-none focus:border-[#006569] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 bg-[#033B38] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(3,59,56,0.25)] hover:bg-[#006569] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Request Now
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Location Column */}
          <div className="bg-[#033B38] text-white rounded-[2rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#006569]/20 rounded-full blur-[100px] -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
                <MapPin className="w-4 h-4" />
                Our Location
              </div>
              <h3 className="font-playfair text-2xl font-semibold mb-3">Visit Our Office</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                {settings?.office_address || "Sarvadnya Infotech LLP, Business Hub, Pune, Maharashtra, India"}
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-2xl font-bold">4.9</span>
                <span className="text-amber-400 tracking-widest text-sm">★★★★★</span>
                <span className="text-xs text-white/50 font-medium">(34 reviews)</span>
              </div>
              <div className="mt-6 rounded-[1.5rem] overflow-hidden border border-white/10 relative h-56 bg-slate-100">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Grid */}
      <section className="pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-[#006569] mb-6 text-center md:text-left">Connect with Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialMedia.map((social) => (
            <a
              key={social.name}
              href={social.url}
              className={`p-5 min-h-20 rounded-2xl ${social.bgColor} border border-transparent hover:border-slate-200 transition-all duration-300 group shadow-sm flex items-center gap-4`}
            >
              <div className={`shrink-0 ${social.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {social.name === 'WhatsApp' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.563 6.024L0 24l6.135-1.608a11.81 11.81 0 005.908 1.567h.005c6.635 0 12.045-5.411 12.047-12.047 0-3.217-1.252-6.242-3.525-8.514z"/></svg>}
                {social.name === 'Facebook' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>}
                {social.name === 'Instagram' && <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>}
                {social.name === 'LinkedIn' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#006569] leading-none mb-1.5">{social.name}</p>
                <p className="text-xs opacity-60 font-medium truncate">{social.handle}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
