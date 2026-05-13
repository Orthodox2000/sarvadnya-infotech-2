'use client';

import Image from "next/image";
import Footer from "../components/Footer";

export default function ContactPage() {
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+919876543210";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@sarvadnyainfotech.com";
  const officeAddress = process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "123, Business Center, Main Road, Pune - 411001";
  
  const socialMedia = [
    { name: 'WhatsApp', handle: supportPhone, url: `https://wa.me/${supportPhone.replace(/\D/g, '')}`, iconColor: 'text-[#25D366]', bgColor: 'bg-[#25D366]/10' },
    { name: 'Facebook', handle: 'Sarvadnya Infotech', url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', iconColor: 'text-[#1877F2]', bgColor: 'bg-[#1877F2]/10' },
    { name: 'Instagram', handle: '@sarvadnya_infotech', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', iconColor: 'text-[#E4405F]', bgColor: 'bg-[#E4405F]/10' },
    { name: 'LinkedIn', handle: 'Sarvadnya Infotech LLP', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#', iconColor: 'text-[#0077B5]', bgColor: 'bg-[#0077B5]/10' },
  ];

  return (
    <main className="min-h-screen bg-[var(--background-color)]">
      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-[var(--heading-color)]">Get in <span className="text-[var(--primary-color)]">Touch</span></h1>
          <p className="text-lg text-[var(--para-color)] opacity-80">
            Have questions about Tally? Need a custom module? Or just want to say hello? Our team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href={`tel:${supportPhone}`}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--primary-color)] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us Now
            </a>
            <a 
              href={`mailto:${supportEmail}`}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--heading-color)] border border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
          </div>
          <div className="pt-4 flex items-center justify-center gap-2 text-[var(--primary-color)] font-bold uppercase tracking-wider text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mon-Sat: 10am - 7:00pm (Support Call)
          </div>
        </div>
      </section>

      {/* Social Media Grid */}
      <section className="pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-[var(--heading-color)] mb-8 text-center md:text-left">Connect with Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialMedia.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              className={`p-8 rounded-[2.5rem] ${social.bgColor} border border-transparent hover:border-white transition-all duration-300 group shadow-sm`}
            >
              <div className={`text-3xl mb-4 ${social.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {social.name === 'WhatsApp' && <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.563 6.024L0 24l6.135-1.608a11.81 11.81 0 005.908 1.567h.005c6.635 0 12.045-5.411 12.047-12.047 0-3.217-1.252-6.242-3.525-8.514z"/></svg>}
                {social.name === 'Facebook' && <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>}
                {social.name === 'Instagram' && <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>}
                {social.name === 'LinkedIn' && <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
              </div>
              <p className="font-black text-xl text-[var(--heading-color)]">{social.name}</p>
              <p className="text-sm opacity-60 font-medium">{social.handle}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Detailed Contact Section & Support Form */}
      <section className="pb-20 px-6 sm:px-12 lg:px-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:gap-12">
          {/* Support Form */}
          <div className="bg-[var(--heading-color)] p-8 md:p-12 rounded-[3rem] shadow-xl text-white flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/60 mb-2">Priority Support</p>
            <h2 className="text-3xl font-black mb-6">Request a Callback</h2>
            <p className="text-violet-100/70 mb-8 leading-relaxed">
              Share your details and our certified experts will call you back within 15 minutes to resolve your Tally queries.
            </p>
            
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Service Needed</label>
                <input
                  type="text"
                  placeholder="e.g. TallyPrime Upgrade"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Message</label>
                <textarea
                  placeholder="How can we help you?"
                  rows={3}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 py-4 bg-white text-[var(--heading-color)] rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Send Request Now
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
