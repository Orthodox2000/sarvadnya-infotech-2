'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '@/lib/jobs';

type Application = {
  _id: string;
  createdAt: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience: string;
  resume_url: string;
  message: string;
};

export default function AdminCareers() {
  const [activeTab, setActiveTab] = useState<'listings' | 'applications'>('listings');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  useEffect(() => {
    if (activeTab === 'listings') {
      fetchJobs();
    } else {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/careers');
      const data = await res.json();
      if (data && data.error) throw new Error(data.error);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      
      if (data && data.error) throw new Error(data.error);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      const res = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingJob),
      });
      if (res.ok) {
        setEditingJob(null);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const openResume = (url: string) => {
    if (!url) {
      alert('Resume URL not found.');
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">Careers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage job openings and candidate applications.</p>
        </div>
        {activeTab === 'listings' && !editingJob && (
          <button 
            onClick={() => setEditingJob({ title: '', department: '', location: '', type: 'Full-time', shortDescription: '', fullDescription: '', aboutRole: '', lookingFor: '', whyJoinUs: '', postedAt: new Date().toISOString(), requirements: [], benefits: [] })}
            className="bg-[#0371a3] text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            Add New Job
          </button>
        )}
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => { setActiveTab('listings'); setEditingJob(null); }}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'listings' ? 'bg-[#0371a3] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Job Listings
        </button>
        <button 
          onClick={() => { setActiveTab('applications'); setEditingJob(null); }}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'applications' ? 'bg-[#0371a3] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Applications ({applications.length || '...'})
        </button>
      </div>

      {editingJob ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#0f172a] mb-6">{editingJob.id || (editingJob as any)._id ? 'Edit Job' : 'Add New Job'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Job Title" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingJob.title || ''}
                onChange={e => setEditingJob({...editingJob, title: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Department" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingJob.department || ''}
                onChange={e => setEditingJob({...editingJob, department: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingJob.location || ''}
                onChange={e => setEditingJob({...editingJob, location: e.target.value})}
                required
              />
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingJob.type || 'Full-time'}
                onChange={e => setEditingJob({...editingJob, type: e.target.value as any})}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <input 
                type="datetime-local" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingJob.postedAt ? new Date(editingJob.postedAt).toISOString().slice(0, 16) : ''}
                onChange={e => setEditingJob({...editingJob, postedAt: new Date(e.target.value).toISOString()})}
                required
              />
            </div>
            
            <textarea 
              placeholder="Short Description" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-24"
              value={editingJob.shortDescription || ''}
              onChange={e => setEditingJob({...editingJob, shortDescription: e.target.value})}
              required
            />
            
            <div className="grid grid-cols-1 gap-6">
              <textarea 
                placeholder="About the Role" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-32"
                value={editingJob.aboutRole || ''}
                onChange={e => setEditingJob({...editingJob, aboutRole: e.target.value})}
              />
              
              <textarea 
                placeholder="What We're Looking For" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-32"
                value={editingJob.lookingFor || ''}
                onChange={e => setEditingJob({...editingJob, lookingFor: e.target.value})}
              />
              
              <textarea 
                placeholder="Why Join Us?" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-32"
                value={editingJob.whyJoinUs || ''}
                onChange={e => setEditingJob({...editingJob, whyJoinUs: e.target.value})}
              />
            </div>
            
            <textarea 
              placeholder="Full Description (Technical/Additional Info)" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-48"
              value={editingJob.fullDescription || ''}
              onChange={e => setEditingJob({...editingJob, fullDescription: e.target.value})}
            />

            <div className="flex gap-4">
              <button type="submit" className="bg-[#0371a3] text-white px-8 py-3 rounded-2xl font-bold">Save Job</button>
              <button type="button" onClick={() => setEditingJob(null)} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </div>
      ) : activeTab === 'listings' ? (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading jobs...</div>
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job.id || (job as any)._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-[#0371a3]/30 transition-all">
                <div>
                  <h3 className="font-bold text-[#0f172a]">{job.title}</h3>
                  <p className="text-xs text-slate-500">{job.department} • {job.location} • {job.type}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingJob(job)}
                    className="px-3 py-1 text-xs font-bold text-[#0371a3] hover:bg-sky-50 rounded-lg transition-colors border border-sky-100"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete((job as any)._id)}
                    className="px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">No jobs found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Title</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Exp.</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading applications...</td></tr>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-[#0f172a]">{app.full_name}</div>
                        <div className="text-[10px] text-slate-400">{app.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-black text-[#0371a3] tabular-nums">{app.phone}</div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                        {app.job_title}
                      </td>
                      <td className="p-4">
                         <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 text-[#0371a3] border border-sky-100">
                           {app.experience}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => openResume(app.resume_url)}
                          className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#0371a3] text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          Resume
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center py-20 text-slate-400">No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

