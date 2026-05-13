'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';
import QuickSupportModal from '../components/QuickSupportModal';

const ServiceSection = ({ id, title, subtitle, description, features, image, reverse = false, stats = [] }: any) => (
  <section id={id} className={`py-20 px-6 max-w-7xl mx-auto flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
    <div className="flex-1">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-color)]/5 text-[var(--primary-color)] text-[10px] font-bold uppercase tracking-wider mb-4 border border-[var(--primary-color)]/10">
        {subtitle}
      </div>
      <h2 className="text-3xl md:text-5xl font-black mb-6 text-[var(--heading-color)] leading-tight">{title}</h2>
      <p className="text-[var(--para-color)] opacity-80 text-sm md:text-lg mb-8 leading-relaxed">
        {description}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm font-bold text-[var(--heading-color)] opacity-90">{f}</span>
          </div>
        ))}
      </div>

      {stats.length > 0 && (
        <div className="flex flex-wrap gap-8 pt-6 border-t border-[var(--primary-color)]/5">
          {stats.map((s: any, i: number) => (
            <div key={i}>
              <div className="text-2xl font-black text-[var(--primary-color)]">{s.value}</div>
              <div className="text-[10px] font-bold text-[var(--para-color)] opacity-40 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="flex-1 w-full">
      <div className="relative aspect-square md:aspect-video rounded-[2rem] overflow-hidden shadow-2xl group">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--heading-color)]/40 to-transparent" />
      </div>
    </div>
  </section>
);

export default function ServicesPage() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--heading-color)]">
      {/* Hero Section */}
      <section className="bg-[var(--heading-color)] text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--primary-color)] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--accent-color)] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">Our Services</h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From official cloud hosting to priority maintenance, we provide end-to-end Tally solutions to keep your business running at peak performance.
          </p>
        </div>
      </section>

      {/* 1. Support & Efficiency */}
      <ServiceSection 
        id="support"
        subtitle="Certified Support Desk"
        title="Unmatched Support Efficiency"
        description="Our support team is more than just a helpdesk—they are certified Tally experts. We pride ourselves on resolving 90% of issues within the first call, ensuring your operations never miss a beat."
        image="https://images.unsplash.com/photo-1521791136064-7986c2959213?auto=format&fit=crop&q=80&w=800"
        features={[
          "90% First-Call Resolution",
          "Certified Technical Experts",
          "Dedicated Account Managers",
          "On-site & Remote Assistance"
        ]}
        stats={[
          { value: "15min", label: "Avg. Response Time" },
          { value: "5000+", label: "Queries Resolved" },
          { value: "99%", label: "Client Satisfaction" }
        ]}
      />

      {/* 2. NoSky Backup */}
      <div className="bg-white/50">
        <ServiceSection 
          id="nosky-backup"
          reverse
          subtitle="Enterprise Protection"
          title="NoSky Backup Solution"
          description="Eliminate the risk of data loss with our specialized NoSky Backup service. Designed specifically for Tally data and business documents, it provides a secure, automated fortress for your most critical assets with AES-256 encryption."
          image="https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?auto=format&fit=crop&q=80&w=800"
          features={[
            "Automated Incremental Backups",
            "Ransomware Protection",
            "One-Click Data Restore",
            "Centralized Status Monitoring"
          ]}
          stats={[
            { value: "100%", label: "Data Integrity" },
            { value: "Zero", label: "Manual Effort" },
            { value: "AWS", label: "Infrastructure" }
          ]}
        />
      </div>

      {/* 3. Cloud Access & Windows VM */}
      <ServiceSection 
        id="cloud-access"
        subtitle="Remote Work Ready"
        title="Cloud Access & Windows VM"
        description="Experience a seamless remote office with our official AWS and Windows VM solutions. Host your Tally and business applications on high-performance virtual machines accessible from any device, anywhere, with full control."
        image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
        features={[
          "Official AWS Infrastructure",
          "Dedicated Windows VM",
          "Any-Device Accessibility",
          "Full Administrative Control"
        ]}
      />

      {/* 4. Biz Analyst (Mobile App) */}
      <div className="bg-slate-50/50">
        <ServiceSection 
          id="biz-analyst"
          reverse
          subtitle="Business on Your Fingertips"
          title="Biz Analyst - Mobile App"
          description="Monitor your business metrics, outstanding payments, and sales performance directly on your Android or iOS device. Biz Analyst syncs in real-time with your Tally data."
          image="/PartnerBrands/BizAnalyst.png"
          features={[
            "Real-time Data Sync",
            "Outstanding Reminders",
            "Sales Team Tracking",
            "Financial Snapshots"
          ]}
        />
      </div>

      {/* 5. Tally to WhatsApp */}
      <div className="bg-[#25D366]/5 border-y border-[#25D366]/10">
        <ServiceSection 
          id="whatsapp"
          subtitle="Instant Communication"
          title="Tally to WhatsApp Integration"
          description="Eliminate manual emailing. Send invoices, payment reminders, and ledger reports directly from Tally to your customers' WhatsApp with a single click."
          image="/tally2whatsapp.png"
          features={[
            "Direct Invoice Sharing",
            "Automated Reminders",
            "Custom Message Templates",
            "No Manual Data Entry"
          ]}
        />
      </div>

      {/* 5. AMC & TSS */}
      <ServiceSection 
        id="amc"
        subtitle="Business Continuity"
        title="AMC & TSS Renewal"
        description="Stay compliant with the latest statutory updates (GST, TDS, etc.) and keep your Tally software healthy with our priority Annual Maintenance Contracts."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
        features={[
          "Regular System Health Checks",
          "Data Audits & Validation",
          "Priority Update Installation",
          "Unlimited Remote Sessions"
        ]}
      />

      {/* Call to Action */}
      <section className="py-20 px-6 bg-[var(--heading-color)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">Ready to Optimize Your Business?</h2>
          <p className="text-white/60 mb-10 text-lg">
            Consult with our experts today and find the perfect mix of services to scale your operations efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="px-10 py-4 bg-[var(--primary-color)] text-white rounded-full font-bold hover:bg-white hover:text-[var(--heading-color)] transition-all inline-flex items-center justify-center"
            >
              Schedule Free Consultation
            </Link>
            <a href="tel:+919876543210" className="px-10 py-4 border border-white/20 rounded-full font-bold hover:bg-white/10 transition-all">
              Call Support Now
            </a>
          </div>
        </div>
      </section>

      <QuickSupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
      <Footer />
    </div>
  );
}
