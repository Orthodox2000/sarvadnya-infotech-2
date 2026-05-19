'use client';

import React, { useState, useEffect, useRef } from 'react';

type SectionContent = {
  section: string;
  content: any;
};

export default function AdminPages() {
  const [activePage, setActivePage] = useState<'about' | 'team' | 'home_hero' | 'home_stats' | 'home_partners' | 'home_faq' | 'home_quick_access'>('about');
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
          },
          team: {
            hero_title: 'Meet the Experts Behind Your Success',
            hero_quote: 'At Sarvadnya Infotech...',
            hero_image: '',
            culture_title: 'Our Employee Culture',
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
          home_partners: [],
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'site-assets');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setContent({ ...content, [field]: data.url });
      setMessage({ text: 'Image uploaded to Mega.nz!', type: 'success' });
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
      if (data.error) throw new Error(data.error);

      setMessage({ text: 'Page updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Save failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading page content...</div>;

  return (
    <div>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f0529]">Manage Pages</h1>
          <p className="text-slate-500 text-sm mt-1">Edit content and images for About and Team pages.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#7338a0] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Page Selector */}
      <div className="flex flex-wrap gap-4 mb-8">
        {['about', 'team', 'home_hero', 'home_stats', 'home_partners', 'home_faq', 'home_quick_access'].map((page) => (
          <button 
            key={page}
            onClick={() => setActivePage(page as any)}
            className={`px-6 py-2 rounded-xl font-bold transition-all uppercase text-[10px] tracking-widest ${activePage === page ? 'bg-[#7338a0] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {page.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        {activePage === 'about' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Hero Section</h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                  placeholder="Hero Title"
                  value={content.hero_title}
                  onChange={e => setContent({...content, hero_title: e.target.value})}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-32"
                  placeholder="Hero Description"
                  value={content.hero_description}
                  onChange={e => setContent({...content, hero_description: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Hero Image</h3>
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative group">
                  {content.hero_image ? (
                    <img src={content.hero_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-bold">{uploading === 'hero_image' ? 'Uploading...' : 'Change Image'}</span>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} />
                  </label>
                </div>
              </div>
            </div>

            {/* Partners Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              {/* Partner 1 */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Partner 1 (Suman Sawant)</h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                  placeholder="Name"
                  value={content.partner1_name}
                  onChange={e => setContent({...content, partner1_name: e.target.value})}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24"
                  placeholder="Quote/Description"
                  value={content.partner1_quote}
                  onChange={e => setContent({...content, partner1_quote: e.target.value})}
                />
                <div className="aspect-square w-32 bg-slate-100 rounded-2xl overflow-hidden relative group">
                   <img src={content.partner1_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                   <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'partner1_image')} />
                      <span className="text-[10px] text-white font-bold">Upload</span>
                   </label>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Partner 2 (Madhukar Sawant)</h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                  placeholder="Name"
                  value={content.partner2_name}
                  onChange={e => setContent({...content, partner2_name: e.target.value})}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24"
                  placeholder="Quote/Description"
                  value={content.partner2_quote}
                  onChange={e => setContent({...content, partner2_quote: e.target.value})}
                />
                <div className="aspect-square w-32 bg-slate-100 rounded-2xl overflow-hidden relative group">
                   <img src={content.partner2_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                   <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'partner2_image')} />
                      <span className="text-[10px] text-white font-bold">Upload</span>
                   </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'team' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Team Hero</h3>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                  placeholder="Hero Title"
                  value={content.hero_title}
                  onChange={e => setContent({...content, hero_title: e.target.value})}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-32"
                  placeholder="Hero Quote"
                  value={content.hero_quote}
                  onChange={e => setContent({...content, hero_quote: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[#0f0529]">Main Team Photo</h3>
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative group">
                  {content.hero_image ? (
                    <img src={content.hero_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-bold">{uploading === 'hero_image' ? 'Uploading...' : 'Change Image'}</span>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} />
                  </label>
                </div>
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-[#0f0529]">Team Testimonial</h3>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24"
                placeholder="Testimonial Text"
                value={content.testimonial}
                onChange={e => setContent({...content, testimonial: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                  placeholder="Author"
                  value={content.testimonial_author}
                  onChange={e => setContent({...content, testimonial_author: e.target.value})}
                />
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                  placeholder="Role"
                  value={content.testimonial_role}
                  onChange={e => setContent({...content, testimonial_role: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {activePage === 'home_hero' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#0f0529]">Hero Slides</h3>
              <button 
                onClick={() => setContent([...content, { badge: 'New Badge', titleText: 'New Title', description: '', image: '', features: [], ctaPrimary: { text: 'Explore', href: '/' } }])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add Slide
              </button>
            </div>
            <div className="space-y-8">
              {content.map((slide: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-4 relative">
                  <button 
                    onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <input 
                        className="w-full p-3 bg-white rounded-xl border-none text-sm"
                        placeholder="Badge"
                        value={slide.badge}
                        onChange={e => {
                          const newContent = [...content];
                          newContent[idx].badge = e.target.value;
                          setContent(newContent);
                        }}
                      />
                      <input 
                        className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold"
                        placeholder="Title"
                        value={slide.titleText}
                        onChange={e => {
                          const newContent = [...content];
                          newContent[idx].titleText = e.target.value;
                          setContent(newContent);
                        }}
                      />
                      <textarea 
                        className="w-full p-3 bg-white rounded-xl border-none text-sm h-24"
                        placeholder="Description"
                        value={slide.description}
                        onChange={e => {
                          const newContent = [...content];
                          newContent[idx].description = e.target.value;
                          setContent(newContent);
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-2">
                         <input 
                            className="w-full p-3 bg-white rounded-xl border-none text-xs"
                            placeholder="Color From (#hex)"
                            value={slide.colorFrom}
                            onChange={e => {
                              const newContent = [...content];
                              newContent[idx].colorFrom = e.target.value;
                              setContent(newContent);
                            }}
                          />
                          <input 
                            className="w-full p-3 bg-white rounded-xl border-none text-xs"
                            placeholder="Color To (#hex)"
                            value={slide.colorTo}
                            onChange={e => {
                              const newContent = [...content];
                              newContent[idx].colorTo = e.target.value;
                              setContent(newContent);
                            }}
                          />
                       </div>
                       <div className="aspect-video bg-white rounded-2xl overflow-hidden relative group">
                          {slide.image ? (
                            <img src={slide.image} className="w-full h-full object-contain p-4" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-300 text-xs">No Image</div>
                          )}
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-[10px] font-bold">Change</span>
                            <input type="file" className="hidden" onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const formData = new FormData();
                               formData.append('file', file);
                               formData.append('folder', 'site-assets');
                               const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                               const data = await res.json();
                               if (data.url) {
                                 const newContent = [...content];
                                 newContent[idx].image = data.url;
                                 setContent(newContent);
                               }
                            }} />
                          </label>
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
              <h3 className="font-bold text-[#0f0529]">Statistics</h3>
              <button 
                onClick={() => setContent([...content, { label: 'New Stat', value: 0, suffix: '+' }])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add Stat
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.map((stat: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-4 relative">
                   <button 
                    onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-[10px]"
                  >
                    Remove
                  </button>
                  <input 
                    className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold"
                    placeholder="Label"
                    value={stat.label}
                    onChange={e => {
                      const newContent = [...content];
                      newContent[idx].label = e.target.value;
                      setContent(newContent);
                    }}
                  />
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      className="w-full p-3 bg-white rounded-xl border-none text-sm"
                      placeholder="Value"
                      value={stat.value}
                      onChange={e => {
                        const newContent = [...content];
                        newContent[idx].value = parseInt(e.target.value);
                        setContent(newContent);
                      }}
                    />
                    <input 
                      className="w-32 p-3 bg-white rounded-xl border-none text-sm"
                      placeholder="Suffix"
                      value={stat.suffix}
                      onChange={e => {
                        const newContent = [...content];
                        newContent[idx].suffix = e.target.value;
                        setContent(newContent);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'home_partners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#0f0529]">Partner Logos</h3>
              <label className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl cursor-pointer">
                + Upload Partner
                <input type="file" className="hidden" onChange={async (e) => {
                   const file = e.target.files?.[0];
                   if (!file) return;
                   const formData = new FormData();
                   formData.append('file', file);
                   formData.append('folder', 'site-assets');
                   const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                   const data = await res.json();
                   if (data.url) setContent([...content, data.url]);
                }} />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {content.map((url: string, idx: number) => (
                 <div key={idx} className="aspect-square bg-slate-50 rounded-2xl relative group p-4">
                    <img src={url} className="w-full h-full object-contain" />
                    <button 
                      onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
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
                 <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-3 relative">
                    <button 
                      onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                    <input 
                      className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold pr-16"
                      placeholder="Question"
                      value={faq.question}
                      onChange={e => {
                        const newContent = [...content];
                        newContent[idx].question = e.target.value;
                        setContent(newContent);
                      }}
                    />
                    <textarea 
                      className="w-full p-3 bg-white rounded-xl border-none text-sm h-24"
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
              <h3 className="font-bold text-[#0f0529]">Quick Access Hub</h3>
              <button 
                onClick={() => setContent([...content, { title: 'New Category', iconName: 'core', description: '', theme: { bg: 'bg-indigo-50', accent: 'bg-indigo-500', text: 'text-indigo-600', hoverBg: 'hover:bg-indigo-600', hoverBorder: 'hover:border-indigo-200' }, links: [] }])}
                className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-2 rounded-xl"
              >
                + Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {content.map((cat: any, idx: number) => (
                 <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-4 relative">
                    <button 
                      onClick={() => setContent(content.filter((_: any, i: number) => i !== idx))}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Category {idx + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
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
                      <select 
                        className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold"
                        value={cat.iconName}
                        onChange={e => {
                          const newContent = [...content];
                          newContent[idx].iconName = e.target.value;
                          setContent(newContent);
                        }}
                      >
                        <option value="core">Tally Core</option>
                        <option value="cloud">Cloud</option>
                        <option value="custom">Customization</option>
                        <option value="support">Support</option>
                      </select>
                    </div>
                    <textarea 
                      className="w-full p-3 bg-white rounded-xl border-none text-sm h-20"
                      placeholder="Description"
                      value={cat.description}
                      onChange={e => {
                        const newContent = [...content];
                        newContent[idx].description = e.target.value;
                        setContent(newContent);
                      }}
                    />
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Links</p>
                         <button 
                           onClick={() => {
                             const newContent = [...content];
                             newContent[idx].links.push({ label: 'New Link', href: '/' });
                             setContent(newContent);
                           }}
                           className="text-[9px] font-bold text-indigo-600"
                         >
                           + Add Link
                         </button>
                       </div>
                       {cat.links.map((link: any, lIdx: number) => (
                         <div key={lIdx} className="flex gap-2 items-center">
                            <input 
                              className="w-full p-2 bg-white rounded-lg border-none text-xs"
                              placeholder="Label"
                              value={link.label}
                              onChange={e => {
                                const newContent = [...content];
                                newContent[idx].links[lIdx].label = e.target.value;
                                setContent(newContent);
                              }}
                            />
                            <input 
                              className="w-full p-2 bg-white rounded-lg border-none text-xs"
                              placeholder="Href"
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
                              className="text-red-300 hover:text-red-500 text-lg px-2"
                            >
                              ×
                            </button>
                         </div>
                       ))}
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
