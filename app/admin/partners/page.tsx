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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [activeTab]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/partners?type=${activeTab}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAssets(data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch assets.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setNewAsset({ ...newAsset, imageUrl: data.url });
      setMessage({ text: 'Image uploaded successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to upload image.', type: 'error' });
    } finally {
      setUploading(false);
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
      if (data.error) throw new Error(data.error);

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
      if (data.error) throw new Error(data.error);
      setMessage({ text: 'Asset deleted!', type: 'success' });
      fetchAssets();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete asset.', type: 'error' });
    }
  };

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-[#0f0529]">Asset Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage brand logos, About Us images, and Team photos.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { id: 'brand', label: 'Brand Partners' },
          { id: 'about', label: 'About Us Gallery' },
          { id: 'team', label: 'Our Team' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${activeTab === tab.id ? 'bg-[#7338a0] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Add Asset */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-[#0f0529] mb-6">Add New {activeTab === 'brand' ? 'Partner' : 'Image'}</h2>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
              placeholder={activeTab === 'team' ? 'Member Name' : 'Asset Title'}
              value={newAsset.name}
              onChange={e => setNewAsset({...newAsset, name: e.target.value})}
              required
            />

            {activeTab !== 'brand' && (
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24"
                placeholder={activeTab === 'team' ? 'Role / Short Quote' : 'Description (Optional)'}
                value={newAsset.description}
                onChange={e => setNewAsset({...newAsset, description: e.target.value})}
              />
            )}
            
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
                    onChange={handleFileUpload}
                    className="hidden" 
                    id="asset-upload"
                  />
                  <label 
                    htmlFor="asset-upload"
                    className="inline-block bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  <p className="text-[10px] text-slate-400 mt-2 ml-1">PNG, JPG or SVG. Max 2MB.</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting || uploading}
              className="w-full bg-[#7338a0] text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Adding...' : `Add to ${activeTab.toUpperCase()}`}
            </button>
          </form>
        </div>

        {/* List Assets */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0f0529] mb-6">Current {activeTab === 'brand' ? 'Partners' : 'Images'} ({assets.length})</h2>
          {loading ? (
            <div className="text-center py-10">Loading assets...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assets.map(asset => (
                <div key={asset._id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center group relative">
                  <div className="relative w-full h-32 mb-3">
                    <Image src={asset.imageUrl} alt={asset.name} fill className="object-contain rounded-xl" />
                  </div>
                  <span className="font-bold text-[#0f0529] text-sm">{asset.name}</span>
                  {asset.description && <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{asset.description}</p>}
                  
                  <button 
                    onClick={() => handleDelete(asset._id)}
                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-slate-300 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
