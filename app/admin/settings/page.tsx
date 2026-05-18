'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Setting = {
  key: string;
  value: string;
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        if (error.code === 'PGRST205') {
          setMessage({ text: 'Table "site_settings" not found. Please run the SQL schema.', type: 'error' });
          return;
        }
        throw error;
      }
      setSettings(data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch settings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: setting.value })
          .eq('key', setting.key);
        
        if (error) throw error;
      }
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to save some settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading settings...</div>;

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-[#0f0529]">Site Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage contact information and social media links.</p>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#7338a0]">Contact Details</h2>
            {['NEXT_PUBLIC_SUPPORT_PHONE', 'NEXT_PUBLIC_SUPPORT_EMAIL', 'NEXT_PUBLIC_OFFICE_ADDRESS'].map(key => {
              const setting = settings.find(s => s.key === key);
              if (!setting) return null;
              return (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{key.replace('NEXT_PUBLIC_', '').replace('_', ' ')}</label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    value={setting.value}
                    onChange={e => handleChange(key, e.target.value)}
                  />
                </div>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#7338a0]">Social Media & Map</h2>
            {[
              'NEXT_PUBLIC_FACEBOOK_URL', 'NEXT_PUBLIC_FACEBOOK_HANDLE',
              'NEXT_PUBLIC_INSTAGRAM_URL', 'NEXT_PUBLIC_INSTAGRAM_HANDLE',
              'NEXT_PUBLIC_LINKEDIN_URL', 'NEXT_PUBLIC_LINKEDIN_HANDLE',
              'NEXT_PUBLIC_MAP_IFRAME_URL'
            ].map(key => {
              const setting = settings.find(s => s.key === key);
              // If it's a new field like HANDLE that might not exist in DB yet, 
              // we should handle that gracefully.
              const value = setting?.value || '';
              return (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {key.replace('NEXT_PUBLIC_', '').replace(/_/g, ' ')}
                  </label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    value={value}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={`Enter ${key.replace('NEXT_PUBLIC_', '').toLowerCase().replace(/_/g, ' ')}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#7338a0] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
