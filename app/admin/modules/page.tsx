'use client';

import React, { useState, useEffect } from 'react';
import { Module } from '@/lib/modules';
import Image from 'next/image';

export default function AdminModules() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/modules');
      const data = await response.json();
      if (data && !data.error) {
        setModules(data);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch modules.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingModule._id ? 'PUT' : 'POST';
      const body = editingModule._id 
        ? { id: editingModule._id, ...editingModule } 
        : editingModule;

      const response = await fetch('/api/modules', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'Module saved successfully!', type: 'success' });
      setEditingModule(null);
      fetchModules();
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || 'Save failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      const response = await fetch(`/api/modules?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setMessage({ text: 'Module deleted successfully!', type: 'success' });
      fetchModules();
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || 'Delete failed.', type: 'error' });
    }
  };

  const startAdd = () => {
    setEditingModule({
      title: '',
      shortDescription: '',
      fullDescription: '',
      videoUrl: '',
      brochureUrl: '',
      image: '',
      features: [''],
      benefits: [''],
      category: 'Vertical Solution'
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentUrl = editingModule?.image || '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'module');
    formData.append('name', editingModule.title || 'untitled');
    if (currentUrl) formData.append('oldUrl', currentUrl);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.url) {
        setEditingModule({ ...editingModule, image: data.url });
        setMessage({ text: 'Image uploaded and cloud-synced!', type: 'success' });
        // If we're editing an existing module, we should save immediately to ensure DB sync
        if (editingModule._id) {
           const updateRes = await fetch('/api/modules', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...editingModule, id: editingModule._id, image: data.url })
           });
           const updateData = await updateRes.json();
           if (updateData.error) throw new Error(updateData.error);
           setTimeout(() => window.location.reload(), 1000);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage({ text: 'Image upload failed.', type: 'error' });
    }
  };

  const updateList = (field: 'features' | 'benefits', index: number, value: string) => {
    const newList = [...editingModule[field]];
    newList[index] = value;
    setEditingModule({ ...editingModule, [field]: newList });
  };

  const addListItem = (field: 'features' | 'benefits') => {
    setEditingModule({ ...editingModule, [field]: [...editingModule[field], ''] });
  };

  const removeListItem = (field: 'features' | 'benefits', index: number) => {
    const newList = editingModule[field].filter((_: any, i: number) => i !== index);
    setEditingModule({ ...editingModule, [field]: newList });
  };

  if (loading) return <div className="text-center py-20">Loading Modules...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f0529]">Manage Modules</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your product modules and industry solutions.</p>
        </div>
        <button 
          onClick={startAdd}
          className="bg-[#7338a0] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          + Create New Module
        </button>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {editingModule ? (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl mb-12 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#0f0529]">{editingModule._id ? 'Edit Module' : 'New Module'}</h2>
            <button onClick={() => setEditingModule(null)} className="text-slate-400 hover:text-slate-900">Cancel</button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Module Title</label>
                  <input 
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] font-bold"
                    value={editingModule.title}
                    onChange={e => setEditingModule({...editingModule, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] font-bold"
                    value={editingModule.category}
                    onChange={e => setEditingModule({...editingModule, category: e.target.value})}
                  >
                    <option>Vertical Solution</option>
                    <option>Utility Module</option>
                    <option>Business Booster</option>
                    <option>Custom TDL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Short Description</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-24"
                    value={editingModule.shortDescription}
                    onChange={e => setEditingModule({...editingModule, shortDescription: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Description</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-32"
                    value={editingModule.fullDescription}
                    onChange={e => setEditingModule({...editingModule, fullDescription: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Module Image</label>
                  <div className="flex gap-4 items-start">
                    <div className="relative w-32 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {editingModule.image ? (
                        <Image src={editingModule.image} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Images are stored directly in MongoDB.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Video URL (Embed)</label>
                  <input 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    value={editingModule.videoUrl}
                    placeholder="https://www.youtube.com/embed/..."
                    onChange={e => setEditingModule({...editingModule, videoUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Brochure URL</label>
                  <input 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    value={editingModule.brochureUrl}
                    onChange={e => setEditingModule({...editingModule, brochureUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Core Features</label>
                  <button type="button" onClick={() => addListItem('features')} className="text-indigo-600 text-xs font-bold">+ Add Feature</button>
                </div>
                <div className="space-y-3">
                  {editingModule.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        className="flex-1 p-3 bg-slate-50 rounded-xl border-none text-sm"
                        value={feature}
                        onChange={e => updateList('features', idx, e.target.value)}
                      />
                      <button type="button" onClick={() => removeListItem('features', idx)} className="text-red-300 hover:text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Business Benefits</label>
                  <button type="button" onClick={() => addListItem('benefits')} className="text-indigo-600 text-xs font-bold">+ Add Benefit</button>
                </div>
                <div className="space-y-3">
                  {editingModule.benefits.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        className="flex-1 p-3 bg-slate-50 rounded-xl border-none text-sm"
                        value={benefit}
                        onChange={e => updateList('benefits', idx, e.target.value)}
                      />
                      <button type="button" onClick={() => removeListItem('benefits', idx)} className="text-red-300 hover:text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                disabled={saving}
                className="flex-1 bg-[#7338a0] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Module'}
              </button>
              <button 
                type="button"
                onClick={() => setEditingModule(null)}
                className="px-8 py-4 border border-slate-200 rounded-2xl font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div key={m._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <div className="relative h-32 w-full mb-4 rounded-2xl overflow-hidden bg-slate-50">
                {m.image ? (
                  <Image src={m.image} alt={m.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">No Image</div>
                )}
              </div>
              <div className="mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{m.category}</span>
                <h3 className="font-bold text-[#0f0529] mt-1">{m.title}</h3>
              </div>
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => setEditingModule(m)}
                  className="flex-1 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(m._id)}
                  className="py-2 px-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
