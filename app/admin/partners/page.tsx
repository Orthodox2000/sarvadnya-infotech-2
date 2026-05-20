'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Partner = {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt?: string;
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPartner, setNewPartner] = useState({ name: '', imageUrl: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/partners');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPartners(data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch partners.', type: 'error' });
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
      setNewPartner({ ...newPartner, imageUrl: data.url });
      setMessage({ text: 'Image uploaded successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to upload image.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.imageUrl) {
      setMessage({ text: 'Please upload an image first.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessage({ text: 'Partner added!', type: 'success' });
      setNewPartner({ name: '', imageUrl: '' });
      fetchPartners();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Failed to add partner.', type: 'error' });
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
      setMessage({ text: 'Partner deleted!', type: 'success' });
      fetchPartners();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete partner.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center py-10">Loading partners...</div>;

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-[#0f0529]">Certified Partners</h1>
        <p className="text-slate-500 text-sm mt-1">Manage partner logos displayed on the homepage.</p>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Add Partner */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-[#0f0529] mb-6">Add New Partner</h2>
          <form onSubmit={handleAddPartner} className="space-y-4">
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
              placeholder="Partner Name"
              value={newPartner.name}
              onChange={e => setNewPartner({...newPartner, name: e.target.value})}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-2">Partner Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                  {newPartner.imageUrl ? (
                    <Image src={newPartner.imageUrl} alt="Preview" fill className="object-contain p-2" />
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
                    id="partner-logo-upload"
                  />
                  <label 
                    htmlFor="partner-logo-upload"
                    className="inline-block bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Choose Logo'}
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
              {submitting ? 'Adding...' : 'Add Partner'}
            </button>
          </form>
        </div>

        {/* List Partners */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0f0529] mb-6">Current Partners ({partners.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {partners.map(partner => (
              <div key={partner._id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center group relative">
                <div className="relative w-full h-24 mb-3">
                  <Image src={partner.imageUrl} alt={partner.name} fill className="object-contain" />
                </div>
                <span className="font-bold text-[#0f0529] text-sm">{partner.name}</span>
                
                <button 
                  onClick={() => handleDelete(partner._id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-slate-300 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {partners.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">No partners found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
