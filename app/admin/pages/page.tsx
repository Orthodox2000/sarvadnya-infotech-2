'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type SectionContent = {
  section: string;
  content: any;
};

export default function AdminPages() {
  const [activePage, setActivePage] = useState<'about' | 'team'>('about');
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
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', activePage)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContent(data.content);
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
          }
        };
        setContent(defaults[activePage]);
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${activePage}-${field}-${Date.now()}.${fileExt}`;
      const filePath = `pages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setContent({ ...content, [field]: publicUrl });
      setMessage({ text: 'Image uploaded!', type: 'success' });
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
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section: activePage, 
          content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'section' });

      if (error) throw error;
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
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActivePage('about')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activePage === 'about' ? 'bg-[#7338a0] text-white' : 'bg-slate-100 text-slate-500'}`}
        >
          About Us
        </button>
        <button 
          onClick={() => setActivePage('team')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activePage === 'team' ? 'bg-[#7338a0] text-white' : 'bg-slate-100 text-slate-500'}`}
        >
          Team
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        {activePage === 'about' ? (
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
        ) : (
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
      </div>
    </div>
  );
}
