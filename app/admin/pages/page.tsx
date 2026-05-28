'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPages() {
  const [activePage, setActivePage] = useState<'about' | 'team'>('about');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [activePage]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content?section=${activePage}`);
      const data = await response.json();
      
      if (data && !data.error) {
        setContent(data);
      } else {
        // Default structures
        const defaults = {
          about: {
            hero_title: 'SARVADNYA INFOTECH LLP',
            hero_subtitle: 'Your Solution Partner',
            hero_description: '',
            hero_image: '',
            partner1_name: 'Suman Sawant',
            partner1_quote: '',
            partner1_image: '',
            partner2_name: 'Mr. Madhukar Sawant',
            partner2_quote: '',
            partner2_image: '',
            gallery_badge: 'Inside Sarvadnya',
            gallery_title: 'Our Workspace & Culture',
            gallery_description: 'A glimpse into our daily operations...'
          },
          team: {
            hero_title: 'Meet the Experts',
            hero_quote: '',
            hero_image: '',
            culture_title: 'Our Employee Culture',
            culture_description: '',
            testimonial: '',
            testimonial_author: '',
            testimonial_role: ''
          }
        };
        setContent(defaults[activePage as keyof typeof defaults] || {});
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch page content.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activePage, content })
      });
      
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'Page content updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to save changes.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentUrl = content?.[field] || '';

    setUploading(field);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', activePage);
      formData.append('name', field);
      if (currentUrl) formData.append('oldUrl', currentUrl);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      // Update content state, but don't save to DB yet (user will hit Save button)
      setContent({ ...content, [field]: data.url });
      setMessage({ text: 'Image uploaded! Remember to save changes.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Upload failed.', type: 'error' });
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="text-center py-10 font-bold text-slate-400">Loading content...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Page Content</h1>
          <p className="text-slate-500 text-sm mt-1">Edit text and images for About and Team pages.</p>
        </div>
        <div className="flex gap-4">
            <a 
                href={`/${activePage}`}
                target="_blank"
                className="text-xs font-black text-slate-500 bg-slate-100 px-6 py-3 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center"
            >
                View Live Page
            </a>
            <button 
                onClick={handleSaveContent}
                disabled={saving}
                className="text-xs font-black text-white bg-[#0371a3] px-8 py-3 rounded-2xl hover:bg-[#00ABE4] transition-all shadow-lg shadow-[#0371a3]/20 active:scale-95 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save All Changes'}
            </button>
        </div>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
          {message.text}
        </div>
      )}

      {/* Page Selector */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'about', label: 'About Us Content' },
          { id: 'team', label: 'Our Team Content' }
        ].map((page) => (
          <button 
            key={page.id}
            onClick={() => setActivePage(page.id as any)}
            className={`px-6 py-2.5 rounded-xl font-black transition-all uppercase text-[10px] tracking-widest ${activePage === page.id ? 'bg-white text-[#0371a3] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 pb-20">
        {activePage === 'about' && (
          <div className="space-y-8">
            {/* Hero Section Editing */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-base uppercase tracking-wider">Hero Section</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Intro</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Main Title</label>
                            <input 
                                type="text"
                                value={content.hero_title || ''}
                                onChange={e => setContent({...content, hero_title: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subtitle</label>
                            <input 
                                type="text"
                                value={content.hero_subtitle || ''}
                                onChange={e => setContent({...content, hero_subtitle: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                            <textarea 
                                rows={6}
                                value={content.hero_description || ''}
                                onChange={e => setContent({...content, hero_description: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Banner Photo</label>
                        <div className="aspect-video bg-slate-50 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                            {content.hero_image ? (
                                <img src={content.hero_image} className="w-full h-full object-cover" alt="Hero" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest">No Image Set</span>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                                <span className="text-white font-black text-xs uppercase tracking-widest">{uploading === 'hero_image' ? 'Uploading...' : 'Replace Banner'}</span>
                                <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} disabled={!!uploading} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leadership Editing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Partner 1 */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Partner 1</h3>
                        <span className="text-[10px] font-bold text-[#0371a3] uppercase tracking-widest">Leadership</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="aspect-square w-32 bg-slate-50 rounded-full overflow-hidden relative group border-2 border-dashed border-slate-200">
                            {content.partner1_image ? (
                                <img src={content.partner1_image} className="w-full h-full object-cover" alt="Partner 1" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-300">
                                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest text-center px-2">{uploading === 'partner1_image' ? '...' : 'Change'}</span>
                                <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'partner1_image')} disabled={!!uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <input 
                                type="text"
                                value={content.partner1_name || ''}
                                onChange={e => setContent({...content, partner1_name: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Biography / Quote</label>
                            <textarea 
                                rows={8}
                                value={content.partner1_quote || ''}
                                onChange={e => setContent({...content, partner1_quote: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Partner 2 */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Partner 2</h3>
                        <span className="text-[10px] font-bold text-[#0371a3] uppercase tracking-widest">Strategic Vision</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="aspect-square w-32 bg-slate-50 rounded-full overflow-hidden relative group border-2 border-dashed border-slate-200">
                            {content.partner2_image ? (
                                <img src={content.partner2_image} className="w-full h-full object-cover" alt="Partner 2" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-300">
                                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest text-center px-2">{uploading === 'partner2_image' ? '...' : 'Change'}</span>
                                <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'partner2_image')} disabled={!!uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <input 
                                type="text"
                                value={content.partner2_name || ''}
                                onChange={e => setContent({...content, partner2_name: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Biography / Quote</label>
                            <textarea 
                                rows={8}
                                value={content.partner2_quote || ''}
                                onChange={e => setContent({...content, partner2_quote: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activePage === 'team' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-base uppercase tracking-wider">Team Page Layout</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Settings</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Title</label>
                            <input 
                                type="text"
                                value={content.hero_title || ''}
                                onChange={e => setContent({...content, hero_title: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Quote / Description</label>
                            <textarea 
                                rows={4}
                                value={content.hero_quote || ''}
                                onChange={e => setContent({...content, hero_quote: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Main Team Photo</label>
                        <div className="aspect-video w-full bg-slate-50 rounded-[2rem] overflow-hidden relative group border-2 border-dashed border-slate-200">
                            {content.hero_image ? (
                                <img src={content.hero_image} className="w-full h-full object-cover" alt="Team Hero" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                                    <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">No Photo Selected</span>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                                <div className="bg-white/10 p-4 rounded-full mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                </div>
                                <span className="text-white font-black text-xs uppercase tracking-widest">{uploading === 'hero_image' ? 'Uploading...' : 'Replace Team Photo'}</span>
                                <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} disabled={!!uploading} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Culture Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Culture Title</label>
                            <input 
                                type="text"
                                value={content.culture_title || ''}
                                onChange={e => setContent({...content, culture_title: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Culture Description</label>
                            <textarea 
                                rows={4}
                                value={content.culture_description || ''}
                                onChange={e => setContent({...content, culture_description: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                    </div>

                    {/* Testimonial Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Team Testimonial</label>
                            <textarea 
                                rows={3}
                                value={content.testimonial || ''}
                                onChange={e => setContent({...content, testimonial: e.target.value})}
                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-medium leading-relaxed resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
                                <input 
                                    type="text"
                                    value={content.testimonial_author || ''}
                                    onChange={e => setContent({...content, testimonial_author: e.target.value})}
                                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                                <input 
                                    type="text"
                                    value={content.testimonial_role || ''}
                                    onChange={e => setContent({...content, testimonial_role: e.target.value})}
                                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#00ABE4] transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-sky-50/50 rounded-2xl border border-sky-100/50">
                    <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">Requirement</p>
                    <p className="text-sky-900/60 text-xs font-medium leading-relaxed">
                        For the best presentation, use a high-resolution wide-angle photo of your team 
                        in the office workspace. Landscape orientation (16:9) is recommended.
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
