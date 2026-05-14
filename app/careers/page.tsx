'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import JobAccordion from '../components/JobAccordion';
import JobApplicationModal from '../components/JobApplicationModal';
import { jobs, Job } from '@/lib/jobs';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0f0529] py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7338a0] rounded-full blur-[120px] opacity-20 -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px] opacity-10 -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-6 border border-white/10">
            Join Our Mission
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight">
            Build the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#7338a0]">
              Business Intelligence
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            We're on a journey to empower SMEs with cutting-edge Tally and Cloud solutions. 
            If you're passionate about technology and problem-solving, we'd love to have you on board.
          </p>
        </div>
      </section>

      {/* Stats/Value Section */}
      <section className="py-8 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-row justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {[
              { label: 'Work Culture', val: 'Collaborative' },
              { label: 'Growth', val: 'Fast-paced' },
              { label: 'Learning', val: 'Continuous' },
              { label: 'Team', val: 'Expert-led' },
            ].map((stat, i) => (
              <div key={i} className="text-center min-w-[80px] flex-1">
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                <p className="text-[10px] md:text-sm font-bold text-[#0f0529] whitespace-nowrap">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f0529] mb-4">Current Openings</h2>
            <p className="text-slate-500 text-sm md:text-base">
              Explore our available positions and find the perfect fit for your skills. 
              Don't see a role that fits? <a href="/contact" className="text-[#7338a0] font-bold hover:underline">Send us your CV anyway!</a>
            </p>
          </div>

          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobAccordion 
                  key={job.id} 
                  job={job} 
                  onApply={handleApply} 
                />
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active openings at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-[#0f0529] mb-4">Life at Sarvadnya</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              We value our employees and offer a range of benefits to ensure a healthy and productive work environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { 
                title: 'Health & Wellness', 
                desc: 'Comprehensive health coverage for you and your family.', 
                icon: (
                  <svg className="w-8 h-8 text-[#7338a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              { 
                title: 'Flexible Work', 
                desc: 'Maintain a great work-life balance with flexible scheduling.', 
                icon: (
                  <svg className="w-8 h-8 text-[#7338a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )
              },
              { 
                title: 'Global Exposure', 
                desc: 'Work with clients and technologies on an international scale.', 
                icon: (
                  <svg className="w-8 h-8 text-[#7338a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )
              },
            ].map((perk, i) => (
              <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="mb-4">{perk.icon}</div>
                <h4 className="text-lg font-bold text-[#0f0529] mb-2">{perk.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JobApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        job={selectedJob} 
      />
      <Footer />
    </div>
  );
}
