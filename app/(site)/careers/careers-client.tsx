'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/lib/jobs';
import { OpeningCard } from '@/app/components/careers/OpeningCard';
import JobApplicationModal from '@/app/components/JobApplicationModal';
import { CareersAuthGate } from '@/app/components/careers/CareersAuthGate';

export function CareersClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/careers/visible')
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
    <CareersAuthGate>
      {({ user, isAuthReady }) => (
        <section className="py-12 md:py-16 px-6 bg-[#ecf5fa]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Current Openings</h2>
              <p className="text-slate-500 text-xs md:text-sm font-bold">
                Explore our available positions and find the perfect fit for your skills.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">Loading openings...</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-5">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <OpeningCard
                      key={(job as any)._id || job.id}
                      job={job}
                      onApply={handleApply}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 bg-[#F5F4ED]/50 rounded-[2rem] border-2 border-dashed border-[#E5F4F4]">
                    <p className="text-[#006569]/40 font-black uppercase tracking-widest text-[10px]">No active openings at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <JobApplicationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            job={selectedJob}
            user={user}
          />
        </section>
      )}
    </CareersAuthGate>
  );
}
