'use client';

import React, { useState, useEffect, useRef } from 'react';

type SectionContent = {
  section: string;
  content: any;
};

export default function AdminPages() {
  const [activePage, setActivePage] = useState<'about' | 'team' | 'home_hero' | 'home_stats' | 'home_faq' | 'home_quick_access'>('about');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            hero_subtitle: 'Your Trusted Solution Partner',
            hero_description: 'Since 2008...',
            hero_image: '',
            partner1_name: 'Suman Sawant',
            partner1_quote: 'Suman brings...',
            partner1_image: '',
            partner2_name: 'Mr. Madhukar Sawant',
            partner2_quote: 'Madhukar specializes...',
            partner2_image: '',
            gallery_badge: 'Inside Sarvadnya',
            gallery_title: 'Our Workspace & Culture',
            gallery_description: 'A glimpse into our daily operations...'
          },
          team: {
            hero_title: 'Meet the Experts Behind Your Success',
            hero_quote: 'At Sarvadnya Infotech...',
            hero_image: '',
            culture_title: 'Our Employee Culture',
            culture_description: 'At Sarvadnya, we believe that a happy team leads to happy clients...',
            culture_items: [
              { title: 'Constant Innovation', desc: 'We encourage...' },
              { title: 'Collaborative Spirit', desc: 'Success is...' },
              { title: 'Client-First Mindset', desc: 'Our team...' }
            ],
            testimonial: 'Working at Sarvadnya...',
            testimonial_author: 'JD',
            testimonial_role: 'Senior Tally Consultant'
          },
          home_hero: [],
          home_stats: [],
          home_faq: [],
          home_quick_access: []
        };
        setContent(defaults[activePage as keyof typeof defaults] || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch page content.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, idx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentUrl = idx !== undefined && Array.isArray(content) 
        ? content[idx][field] 
        : content?.[field] || '';

    setUploading(idx !== undefined ? `${field}_${idx}` : field);
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

      if (idx !== undefined && Array.isArray(content)) {
        const newContent = [...content];
        newContent[idx][field] = data.url;
        setContent(newContent);
      } else {
        setContent({ ...content, [field]: data.url });
      }
      setMessage({ text: 'Image uploaded and renamed!', type: 'success' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Upload failed.', type: 'error' });
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activePage, content })
      });

      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'Page updated successfully!', type: 'success' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Save failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading page content...</div>;

  const isLocked = activePage === 'about' || activePage === 'team';

  return (
    <div>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f0529]">Manage Pages</h1>
          <p className="text-slate-500 text-sm mt-1">Edit content and images for all public pages.</p>
        </div>
        <div className="flex items-center gap-4">
            <a 
              href={`/${activePage === 'about' ? 'about' : activePage === 'team' ? 'team' : ''}`}
              target="_blank"
              className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-3 rounded-2xl hover:bg-indigo-100 transition-colors"
            >
              View Live Page
            </a>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-[#7338a0] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Page Selector */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'about', label: 'About Us' },
          { id: 'team', label: 'Our Team' },
          { id: 'home_hero', label: 'Hero Slides' },
          { id: 'home_stats', label: 'Counter Stats' },
          { id: 'home_faq', label: 'Home FAQ' },
          { id: 'home_quick_access', label: 'Access Hub' }
        ].map((page) => (
          <button 
            key={page.id}
            onClick={() => setActivePage(page.id as any)}
            className={`px-6 py-2 rounded-xl font-bold transition-all uppercase text-[10px] tracking-widest ${activePage === page.id ? 'bg-[#7338a0] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        {isLocked && (
            <div className="absolute top-0 right-0 p-4 z-20">
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm animate-pulse">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">Text Content Locked</span>
                </div>
            </div>
        )}

        {activePage === 'about' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                  Hero Section
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">About Page Top</span>
                </h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Hero Title"
                  value={content.hero_title}
                  onChange={e => setContent({...content, hero_title: e.target.value})}
                  readOnly={isLocked}
                />
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Hero Subtitle"
                  value={content.hero_subtitle}
                  onChange={e => setContent({...content, hero_subtitle: e.target.value})}
                  readOnly={isLocked}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-32 read-only:opacity-60"
                  placeholder="Hero Description"
                  value={content.hero_description}
                  onChange={e => setContent({...content, hero_description: e.target.value})}
                  readOnly={isLocked}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Hero Image Slot</h3>
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                  {content.hero_image ? (
                    <img src={content.hero_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                       <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       <span className="text-[10px] font-bold uppercase tracking-widest">No Hero Image</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-bold text-sm">{uploading === 'hero_image' ? 'Uploading...' : 'Replace Hero Image'}</span>
                    <span className="text-white/60 text-[10px] mt-1 font-medium">Visible at top of About Page</span>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} />
                  </label>
                </div>
              </div>
            </div>

            {/* Partners Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
              {/* Partner 1 */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                  Partner 1 Slot
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Leadership Section</span>
                </h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Name"
                  value={content.partner1_name}
                  onChange={e => setContent({...content, partner1_name: e.target.value})}
                  readOnly={isLocked}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24 read-only:opacity-60"
                  placeholder="Quote/Description"
                  value={content.partner1_quote}
                  onChange={e => setContent({...content, partner1_quote: e.target.value})}
                  readOnly={isLocked}
                />
                <div className="flex items-center gap-6">
                  <div className="aspect-square w-32 bg-slate-100 rounded-2xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                    <img src={content.partner1_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center p-2">
                        <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'partner1_image')} />
                        <span className="text-[10px] text-white font-bold">{uploading === 'partner1_image' ? 'Uploading...' : 'Change Photo'}</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo Tip</p>
                    <p className="text-xs text-slate-500 mt-1">Use a high-quality professional headshot with a clean background. Aspect ratio 1:1 works best.</p>
                  </div>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                  Partner 2 Slot
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Strategic Vision</span>
                </h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Name"
                  value={content.partner2_name}
                  onChange={e => setContent({...content, partner2_name: e.target.value})}
                  readOnly={isLocked}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24 read-only:opacity-60"
                  placeholder="Quote/Description"
                  value={content.partner2_quote}
                  onChange={e => setContent({...content, partner2_quote: e.target.value})}
                  readOnly={isLocked}
                />
                <div className="flex items-center gap-6">
                  <div className="aspect-square w-32 bg-slate-100 rounded-2xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                    <img src={content.partner2_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center p-2">
                        <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'partner2_image')} />
                        <span className="text-[10px] text-white font-bold">{uploading === 'partner2_image' ? 'Uploading...' : 'Change Photo'}</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo Tip</p>
                    <p className="text-xs text-slate-500 mt-1">Use a headshot consistent with Partner 1 for a unified leadership appearance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Header Section */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                Gallery Header
                <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Workspace Gallery</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Gallery Badge"
                  value={content.gallery_badge}
                  onChange={e => setContent({...content, gallery_badge: e.target.value})}
                  readOnly={isLocked}
                />
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Gallery Title"
                  value={content.gallery_title}
                  onChange={e => setContent({...content, gallery_title: e.target.value})}
                  readOnly={isLocked}
                />
              </div>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24 read-only:opacity-60"
                placeholder="Gallery Description"
                value={content.gallery_description}
                onChange={e => setContent({...content, gallery_description: e.target.value})}
                readOnly={isLocked}
              />
            </div>
          </div>
        )}

        {activePage === 'team' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                  Team Hero
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Team Page Top</span>
                </h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Hero Title"
                  value={content.hero_title}
                  onChange={e => setContent({...content, hero_title: e.target.value})}
                  readOnly={isLocked}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-32 read-only:opacity-60"
                  placeholder="Hero Quote"
                  value={content.hero_quote}
                  onChange={e => setContent({...content, hero_quote: e.target.value})}
                  readOnly={isLocked}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Main Team Photo Slot</h3>
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                  {content.hero_image ? (
                    <img src={content.hero_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                       <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       <span className="text-[10px] font-bold uppercase tracking-widest">No Team Photo</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-bold text-sm">{uploading === 'hero_image' ? 'Uploading...' : 'Change Team Photo'}</span>
                    <span className="text-white/60 text-[10px] mt-1 font-medium text-center px-4">This image appears at the top of the Team page</span>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} />
                  </label>
                </div>
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                Team Testimonial
                <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Bottom Quote Box</span>
              </h3>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24 read-only:opacity-60"
                placeholder="Testimonial Text"
                value={content.testimonial}
                onChange={e => setContent({...content, testimonial: e.target.value})}
                readOnly={isLocked}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Author"
                  value={content.testimonial_author}
                  onChange={e => setContent({...content, testimonial_author: e.target.value})}
                  readOnly={isLocked}
                />
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                  placeholder="Role"
                  value={content.testimonial_role}
                  onChange={e => setContent({...content, testimonial_role: e.target.value})}
                  readOnly={isLocked}
                />
              </div>
            </div>

            {/* Culture Section */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                    Culture Section
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Employee Culture</span>
                </h3>
                <input 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] read-only:opacity-60"
                    placeholder="Section Title"
                    value={content.culture_title}
                    onChange={e => setContent({...content, culture_title: e.target.value})}
                    readOnly={isLocked}
                />
                <textarea 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24 read-only:opacity-60"
                    placeholder="Culture Summary Text"
                    value={content.culture_description}
                    onChange={e => setContent({...content, culture_description: e.target.value})}
                    readOnly={isLocked}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(content.culture_items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item {idx + 1}</p>
                        <input 
                            className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold read-only:opacity-60"
                            placeholder="Title"
                            value={item.title}
                            onChange={e => {
                                const newItems = [...content.culture_items];
                                newItems[idx].title = e.target.value;
                                setContent({...content, culture_items: newItems});
                            }}
                            readOnly={isLocked}
                        />
                        <textarea 
                            className="w-full p-3 bg-white rounded-xl border-none text-xs h-24 read-only:opacity-60"
                            placeholder="Description"
                            value={item.desc}
                            onChange={e => {
                                const newItems = [...content.culture_items];
                                newItems[idx].desc = e.target.value;
                                setContent({...content, culture_items: newItems});
                            }}
                            readOnly={isLocked}
                        />
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePage === 'home_hero' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#0f0529] flex items-center gap-2">
                Hero Slides
                <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Home Page Carousel</span>
              </h3>
              <button 
                onClick={() => setContent([...content, { badge: 'New Badge', titleText: 'New Title', description: '', image: '', features: [], colorFrom: '#4f46e5', colorTo: '#7c3aed', ctaPrimary: { text: 'Explore', href: '/' } }])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add Slide
              </button>
            </div>
            <div className="space-y-8">
              {content.map((slide: any, idx: number) => (
                <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 relative border border-slate-100">
                  <button 
                    onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                    className="absolute top-6 right-6 p-2 bg-white text-red-400 hover:text-red-600 rounded-full shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Slide {idx + 1}</span>
                         <input 
                            className="flex-grow p-3 bg-white rounded-xl border-none text-[10px] font-bold uppercase tracking-widest text-[#7338a0]"
                            placeholder="Badge (e.g. New Version)"
                            value={slide.badge}
                            onChange={e => {
                            const newContent = [...content];
                            newContent[idx].badge = e.target.value;
                            setContent(newContent);
                            }}
                        />
                      </div>
                      <input 
                        className="w-full p-4 bg-white rounded-2xl border-none text-lg font-black text-[#0f0529]"
                        placeholder="Main Headline"
                        value={slide.titleText}
                        onChange={e => {
                          const newContent = [...content];
                          newContent[idx].titleText = e.target.value;
                          setContent(newContent);
                        }}
                      />
                      <textarea 
                        className="w-full p-4 bg-white rounded-2xl border-none text-sm h-24 text-slate-600 leading-relaxed"
                        placeholder="Sub-description"
                        value={slide.description}
                        onChange={e => {
                          const newContent = [...content];
                          newContent[idx].description = e.target.value;
                          setContent(newContent);
                        }}
                      />
                      
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bullet Features</p>
                        <div className="grid grid-cols-2 gap-2">
                           {[0,1,2,3].map(fIdx => (
                             <input 
                               key={fIdx}
                               className="w-full p-2 bg-white rounded-lg border-none text-[11px] font-medium"
                               placeholder={`Feature ${fIdx + 1}`}
                               value={slide.features?.[fIdx]?.text || ''}
                               onChange={e => {
                                 const newContent = [...content];
                                 if (!newContent[idx].features) newContent[idx].features = [];
                                 newContent[idx].features[fIdx] = { text: e.target.value };
                                 setContent(newContent);
                               }}
                             />
                           ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Primary CTA Button</p>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                className="w-full p-3 bg-white rounded-xl border-none text-[11px] font-bold"
                                placeholder="Button Text"
                                value={slide.ctaPrimary?.text || ''}
                                onChange={e => {
                                    const newContent = [...content];
                                    if (!newContent[idx].ctaPrimary) newContent[idx].ctaPrimary = { text: '', href: '/' };
                                    newContent[idx].ctaPrimary.text = e.target.value;
                                    setContent(newContent);
                                }}
                            />
                            <input 
                                className="w-full p-3 bg-white rounded-xl border-none text-[11px] font-mono"
                                placeholder="Link (e.g. /products)"
                                value={slide.ctaPrimary?.href || ''}
                                onChange={e => {
                                    const newContent = [...content];
                                    if (!newContent[idx].ctaPrimary) newContent[idx].ctaPrimary = { text: '', href: '/' };
                                    newContent[idx].ctaPrimary.href = e.target.value;
                                    setContent(newContent);
                                }}
                            />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gradient Start</p>
                            <div className="flex gap-2">
                                <input 
                                    type="color"
                                    className="w-10 h-10 p-1 bg-white rounded-lg border-none cursor-pointer"
                                    value={slide.colorFrom || '#4f46e5'}
                                    onChange={e => {
                                    const newContent = [...content];
                                    newContent[idx].colorFrom = e.target.value;
                                    setContent(newContent);
                                    }}
                                />
                                <input 
                                    className="flex-grow p-2 bg-white rounded-lg border-none text-[10px] font-mono"
                                    value={slide.colorFrom || '#4f46e5'}
                                    onChange={e => {
                                    const newContent = [...content];
                                    newContent[idx].colorFrom = e.target.value;
                                    setContent(newContent);
                                    }}
                                />
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gradient End</p>
                            <div className="flex gap-2">
                                <input 
                                    type="color"
                                    className="w-10 h-10 p-1 bg-white rounded-lg border-none cursor-pointer"
                                    value={slide.colorTo || '#7c3aed'}
                                    onChange={e => {
                                    const newContent = [...content];
                                    newContent[idx].colorTo = e.target.value;
                                    setContent(newContent);
                                    }}
                                />
                                <input 
                                    className="flex-grow p-2 bg-white rounded-lg border-none text-[10px] font-mono"
                                    value={slide.colorTo || '#7c3aed'}
                                    onChange={e => {
                                    const newContent = [...content];
                                    newContent[idx].colorTo = e.target.value;
                                    setContent(newContent);
                                    }}
                                />
                            </div>
                         </div>
                       </div>

                       <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slide Image Slot</p>
                        <div className="aspect-video bg-white rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                            {slide.image ? (
                                <img src={slide.image} className="w-full h-full object-contain p-6" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                                    <svg className="w-10 h-10 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center p-4">
                                <span className="text-white font-bold text-sm">{uploading === `image_${idx}` ? 'Uploading...' : 'Change Slide Image'}</span>
                                <span className="text-white/60 text-[10px] mt-1">This image floats in the hero section</span>
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'image', idx)} />
                            </label>
                        </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'home_stats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#0f0529]">Live Statistics Counter</h3>
              <button 
                onClick={() => setContent([...content, { label: 'New Stat', value: 0, suffix: '+' }])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add Stat
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.map((stat: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-4 relative border border-slate-100">
                   <button 
                    onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stat Label</p>
                    <input 
                        className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold"
                        placeholder="e.g. Happy Clients"
                        value={stat.label}
                        onChange={e => {
                        const newContent = [...content];
                        newContent[idx].label = e.target.value;
                        setContent(newContent);
                        }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Number</p>
                        <input 
                        type="number"
                        className="w-full p-3 bg-white rounded-xl border-none text-sm font-black"
                        placeholder="Value"
                        value={stat.value}
                        onChange={e => {
                            const newContent = [...content];
                            newContent[idx].value = parseInt(e.target.value);
                            setContent(newContent);
                        }}
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Suffix</p>
                        <input 
                        className="w-full p-3 bg-white rounded-xl border-none text-sm"
                        placeholder="e.g. +"
                        value={stat.suffix}
                        onChange={e => {
                            const newContent = [...content];
                            newContent[idx].suffix = e.target.value;
                            setContent(newContent);
                        }}
                        />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'home_faq' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#0f0529]">Frequently Asked Questions</h3>
              <button 
                onClick={() => setContent([{ question: 'New Question', answer: '' }, ...content])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-4">
               {content.map((faq: any, idx: number) => (
                 <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-3 relative border border-slate-100">
                    <button 
                      onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                    <input 
                      className="w-full p-4 bg-white rounded-2xl border-none text-sm font-bold pr-16 text-[#0f0529]"
                      placeholder="Question"
                      value={faq.question}
                      onChange={e => {
                        const newContent = [...content];
                        newContent[idx].question = e.target.value;
                        setContent(newContent);
                      }}
                    />
                    <textarea 
                      className="w-full p-4 bg-white rounded-2xl border-none text-sm h-32 leading-relaxed text-slate-600"
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={e => {
                        const newContent = [...content];
                        newContent[idx].answer = e.target.value;
                        setContent(newContent);
                      }}
                    />
                 </div>
               ))}
            </div>
          </div>
        )}

        {activePage === 'home_quick_access' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#0f0529]">Quick Access Hub Categories</h3>
              <button 
                onClick={() => setContent([...content, { title: 'New Category', iconName: 'core', description: '', theme: { bg: 'bg-indigo-50', accent: 'bg-indigo-500', text: 'text-indigo-600', hoverBg: 'hover:bg-indigo-600', hoverBorder: 'hover:border-indigo-200' }, links: [] }])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {content.map((cat: any, idx: number) => (
                 <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4 relative border border-slate-100">
                    <button 
                      onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                      className="absolute top-6 right-6 text-red-300 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Hub Category {idx + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</p>
                        <input 
                            className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold"
                            placeholder="Title"
                            value={cat.title}
                            onChange={e => {
                            const newContent = [...content];
                            newContent[idx].title = e.target.value;
                            setContent(newContent);
                            }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Icon Style</p>
                        <select 
                            className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold"
                            value={cat.iconName}
                            onChange={e => {
                            const newContent = [...content];
                            newContent[idx].iconName = e.target.value;
                            setContent(newContent);
                            }}
                        >
                            <option value="core">Tally Core (Blue)</option>
                            <option value="cloud">Cloud (Orange)</option>
                            <option value="custom">Customization (Emerald)</option>
                            <option value="support">Support (Indigo)</option>
                            <option value="education">Education (Amber)</option>
                            <option value="global">Global (Sky)</option>
                            <option value="consultancy">Consultancy (Slate)</option>
                            <option value="whatsapp">WhatsApp (Green)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Small Text</p>
                        <textarea 
                            className="w-full p-3 bg-white rounded-xl border-none text-xs h-20 leading-relaxed text-slate-500"
                            placeholder="Description"
                            value={cat.description}
                            onChange={e => {
                            const newContent = [...content];
                            newContent[idx].description = e.target.value;
                            setContent(newContent);
                            }}
                        />
                    </div>
                    <div className="space-y-3 pt-2">
                       <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Links</p>
                         <button 
                           onClick={() => {
                             const newContent = [...content];
                             if (!newContent[idx].links) newContent[idx].links = [];
                             newContent[idx].links.push({ label: 'New Link', href: '/' });
                             setContent(newContent);
                           }}
                           className="text-[10px] font-black text-[#7338a0] bg-white px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow"
                         >
                           + Add Link
                         </button>
                       </div>
                       <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {cat.links?.map((link: any, lIdx: number) => (
                            <div key={lIdx} className="flex gap-2 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-50">
                                <input 
                                className="flex-[2] p-2 bg-slate-50 rounded-lg border-none text-[11px] font-bold"
                                placeholder="Link Name"
                                value={link.label}
                                onChange={e => {
                                    const newContent = [...content];
                                    newContent[idx].links[lIdx].label = e.target.value;
                                    setContent(newContent);
                                }}
                                />
                                <input 
                                className="flex-[3] p-2 bg-slate-50 rounded-lg border-none text-[11px] font-mono"
                                placeholder="/path"
                                value={link.href}
                                onChange={e => {
                                    const newContent = [...content];
                                    newContent[idx].links[lIdx].href = e.target.value;
                                    setContent(newContent);
                                }}
                                />
                                <button 
                                onClick={() => {
                                    const newContent = [...content];
                                    newContent[idx].links.splice(lIdx, 1);
                                    setContent(newContent);
                                }}
                                className="text-red-300 hover:text-red-500 px-2"
                                >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
