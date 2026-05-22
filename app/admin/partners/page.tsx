'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Asset = {
  _id: string;
  name: string;
  imageUrl: string;
  type: 'brand' | 'about' | 'team';
  description?: string;
  createdAt?: string;
};

export default function AdminAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'brand' | 'about' | 'team'>('brand');
  const [newAsset, setNewAsset] = useState({ name: '', imageUrl: '', description: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, [activeTab]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/partners?type=${activeTab}`, { cache: 'no-store' });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setAssets(data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch assets.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isReplacement: boolean = false, assetId?: string, oldUrl?: string, assetName?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = isReplacement ? assetId || 'replacing' : 'new';
    setUploading(uploadKey);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', activeTab);
    formData.append('name', assetName || (isReplacement ? '' : newAsset.name) || 'untitled');
    if (oldUrl) formData.append('oldUrl', oldUrl);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      
      if (isReplacement && assetId) {
          // Immediately update database with new URL
          const patchResponse = await fetch('/api/admin/partners', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: assetId, imageUrl: data.url })
          });
          const patchData = await patchResponse.json();
          if (patchData.error) throw new Error(patchData.error);
          setMessage({ text: 'Image replaced successfully!', type: 'success' });
          setTimeout(() => window.location.reload(), 1000);
      } else {
          setNewAsset({ ...newAsset, imageUrl: data.url });
          setMessage({ text: 'Image uploaded and renamed!', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: err instanceof Error ? err.message : 'Upload failed.', type: 'error' });
    } finally {
      setUploading(null);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.imageUrl) {
      setMessage({ text: 'Please upload an image first.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAsset, type: activeTab })
      });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'Asset added!', type: 'success' });
      setNewAsset({ name: '', imageUrl: '', description: '' });
      fetchAssets();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Failed to add asset.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setMessage({ text: 'Asset deleted!', type: 'success' });
      fetchAssets();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete asset.', type: 'error' });
    }
  };

  const tabInfo = {
    brand: { 
        label: 'Brand Partners', 
        hint: 'Appears in the "Our Network" reel on the Home Page.',
        url: '/'
    },
    about: { 
        label: 'About Us Gallery', 
        hint: 'Appears in the masonry gallery at the bottom of the About Us page.',
        url: '/about'
    },
    team: { 
        label: 'Our Team Members', 
        hint: 'Appears in the "The A-Team" grid on the Team page.',
        url: '/team'
    }
  };

  return (
    <div>
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f0529]">Asset Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage brand logos, About Us images, and Team photos.</p>
        </div>
        <a 
          href={tabInfo[activeTab].url}
          target="_blank"
          className="text-xs font-bold text-[#7338a0] bg-indigo-50 px-4 py-3 rounded-2xl hover:bg-indigo-100 transition-colors"
        >
          View Live {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
        </a>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {Object.entries(tabInfo).map(([id, info]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-6 py-2 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${activeTab === id ? 'bg-[#7338a0] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {info.label}
          </button>
        ))}
      </div>

      <div className="mb-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-xs font-bold text-indigo-700 tracking-tight">
            {tabInfo[activeTab].hint}
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Add Asset - Only for Brand Partners */}
        {activeTab === 'brand' ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-[#0f0529] mb-6">Add New Partner</h2>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                placeholder="Partner Name"
                value={newAsset.name}
                onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                required
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-2">Image File</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {newAsset.imageUrl ? (
                      <Image src={newAsset.imageUrl} alt="Preview" fill className="object-contain p-2" />
                    ) : (
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden" 
                      id="asset-upload"
                    />
                    <label 
                      htmlFor="asset-upload"
                      className="inline-block bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      {uploading === 'new' ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-[10px] text-slate-400 mt-2 ml-1">PNG, JPG or SVG. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting || !!uploading}
                className="w-full bg-[#7338a0] text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add to Brand Partners'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
                <h3 className="font-bold text-[#0f0529]">Slots are Locked</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">To maintain page layout integrity, you can only replace images for existing slots. Adding or removing slots is disabled for this section.</p>
            </div>
          </div>
        )}

        {/* List Assets */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0f0529] mb-6">Current {activeTab === 'brand' ? 'Partners' : 'Images'} ({assets.length})</h2>
          {loading ? (
            <div className="text-center py-10">Loading assets...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assets.map(asset => (
                <div key={asset._id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center group relative overflow-hidden">
                  <div className="relative w-full h-32 mb-3 bg-slate-50 rounded-xl overflow-hidden">
                    <Image src={asset.imageUrl} alt={asset.name} fill className="object-contain rounded-xl" />
                    
                    {/* Replace Image Overlay - Always available for about/team, or hover for brand */}
                    <label className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity cursor-pointer ${uploading === asset._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true, asset._id, asset.imageUrl, asset.name)} 
                            disabled={!!uploading}
                        />
                        <span className="text-[10px] text-white font-black uppercase tracking-widest bg-[#7338a0] px-3 py-1.5 rounded-full shadow-lg">
                            {uploading === asset._id ? 'Updating...' : 'Replace Image'}
                        </span>
                    </label>
                  </div>
                  <span className="font-bold text-[#0f0529] text-sm">{asset.name}</span>
                  {asset.description && <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{asset.description}</p>}
                  
                  {activeTab === 'brand' && (
                    <button 
                        onClick={() => handleDelete(asset._id)}
                        className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-slate-300 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {!loading && assets.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">No assets found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
