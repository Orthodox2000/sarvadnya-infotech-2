'use client';

import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import JobAccordion from '../components/JobAccordion';
import JobApplicationModal from '../components/JobApplicationModal';
import { Job } from '@/lib/jobs';

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/careers')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch jobs:', err);
        setLoading(false);
      });
  }, []);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-medium">
      {/* Compact Hero Section */}
      <section className="relative bg-[#0371a3] pt-8 pb-10 md:pt-8 md:pb-12 overflow-hidden border-b border-[#E9F1FA]/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ABE4] rounded-full blur-[120px] opacity-20 -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400 rounded-full blur-[100px] opacity-10 -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-sky-200 mb-4 border border-white/10">
            Join Our Mission
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Build the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-white">
              Business Intelligence
            </span>
          </h1>
          <p className="text-sky-100/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            We're on a journey to empower SMEs with cutting-edge Tally and Cloud solutions. 
            If you're passionate about technology and problem-solving, we'd love to have you on board.
          </p>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Current Openings</h2>
            <p className="text-slate-500 text-xs md:text-sm font-bold">
              Explore our available positions and find the perfect fit for your skills. 
              Don't see a role that fits? <a href="/contact" className="text-[#00ABE4] font-black hover:underline decoration-2 underline-offset-4">Send us your CV anyway!</a>
            </p>
          </div>

          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobAccordion 
                  key={(job as any)._id || job.id} 
                  job={job} 
                  onApply={handleApply} 
                />
              ))
            ) : (
              <div className="text-center py-16 bg-[#f0f9ff]/50 rounded-[2.5rem] border-2 border-dashed border-[#E9F1FA]">
                <p className="text-[#0371a3]/40 font-black uppercase tracking-widest text-[10px]">No active openings at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-16 bg-[#f0f9ff]/30 border-t border-[#E9F1FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">Life at Sarvadnya</h2>
            <p className="text-slate-500 text-xs max-w-xl mx-auto font-bold opacity-80">
              We value our employees and offer a range of benefits to ensure a healthy and productive work environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { 
                title: 'Health & Wellness', 
                desc: 'Comprehensive health coverage for you and your family.', 
                icon: (
                  <svg className="w-6 h-6 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              { 
                title: 'Flexible Work', 
                desc: 'Maintain a great work-life balance with flexible scheduling.', 
                icon: (
                  <svg className="w-6 h-6 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )
              },
              { 
                title: 'Global Exposure', 
                desc: 'Work with clients and technologies on an international scale.', 
                icon: (
                  <svg className="w-6 h-6 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )
              },
            ].map((perk, i) => (
              <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-[#E9F1FA] shadow-sm hover:shadow-2xl hover:border-[#00ABE4]/20 transition-all duration-500">
                <div className="w-12 h-12 bg-[#f0f9ff] rounded-2xl flex items-center justify-center mb-6 border border-[#E9F1FA]">
                  {perk.icon}
                </div>
                <h4 className="text-[17px] font-black text-slate-900 mb-3 tracking-tight">{perk.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-bold opacity-80">{perk.desc}</p>
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
