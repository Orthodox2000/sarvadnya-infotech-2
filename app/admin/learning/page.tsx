'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { showToast } from '@/app/components/NotificationToast';

export default function AdminLearning() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFolder, setFilterFolder] = useState('All');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setTagInput(editingItem.tags?.join(', ') || '');
    } else {
      setTagInput('');
    }
  }, [editingItem]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tutorials');
      const data = await response.json();
      if (data && !data.error) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch items.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentUrl = editingItem?.thumbnail || '';

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'learning');
    formData.append('name', editingItem.title || 'thumbnail');
    if (currentUrl) formData.append('oldUrl', currentUrl);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setEditingItem({ ...editingItem, thumbnail: data.url, thumbnailOption: 'custom' });
      setMessage({ text: 'Thumbnail uploaded and cloud-synced!', type: 'success' });
      
      // If editing existing, sync to DB immediately
      if (editingItem._id) {
          const syncRes = await fetch('/api/tutorials', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...editingItem, id: editingItem._id, thumbnail: data.url, thumbnailOption: 'custom' })
          });
          const syncData = await syncRes.json();
          if (syncData.error) throw new Error(syncData.error);
          setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to upload thumbnail.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const folders = useMemo(() => {
    const sets = new Set(items.map(item => item.folder || 'Uncategorized'));
    return ['All', ...Array.from(sets)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesFolder = filterFolder === 'All' || (item.folder || 'Uncategorized') === filterFolder;
      return matchesSearch && matchesFolder;
    });
  }, [items, searchQuery, filterFolder]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const processedTags = tagInput.split(',').map(t => t.trim()).filter(t => t !== '');
      const finalItem = { ...editingItem, tags: processedTags };
      
      const method = finalItem._id ? 'PUT' : 'POST';
      const body = finalItem._id 
        ? { id: finalItem._id, ...finalItem } 
        : finalItem;

      const response = await fetch('/api/tutorials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'Item saved successfully!', type: 'success' });
      showToast('Content saved successfully!', 'success');
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || 'Save failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/tutorials?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setMessage({ text: 'Item deleted successfully!', type: 'success' });
      fetchItems();
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || 'Delete failed.', type: 'error' });
    }
  };

  const startAdd = () => {
    setEditingItem({
      title: '',
      description: '',
      url: '',
      type: 'video',
      folder: 'General',
      thumbnailOption: 'logo',
      tags: [],
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  };

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return '';
    // Handle both full URLs and just IDs
    const id = url.includes('youtube.com') || url.includes('youtu.be') 
      ? url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      : url;
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  if (loading) return <div className="text-center py-20">Loading Learning Center...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Learning Admin</h1>
          <p className="text-slate-500 text-sm mt-2 font-bold opacity-80">Manage videos, links, and tutorials for your users.</p>
        </div>
        <button 
          onClick={startAdd}
          className="bg-[#0371a3] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20 hover:scale-105 active:scale-95"
        >
          + Add New Content
        </button>
      </header>

      {message.text && (
        <div className={`mb-8 p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest border animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
             {message.text}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {!editingItem && (
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Search by title or tags..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-[#E9F1FA] rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#00ABE4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            className="px-8 py-4 bg-white border border-[#E9F1FA] rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none font-black text-[10px] uppercase tracking-widest text-slate-500 transition-all cursor-pointer"
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
        </div>
      )}

      {editingItem ? (
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#E9F1FA] shadow-2xl mb-12 animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingItem._id ? 'Edit Content' : 'New Content'}</h2>
            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
               Cancel
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">Title</label>
                  <input 
                    required
                    className="w-full p-5 bg-[#f0f9ff]/50 rounded-2xl border border-[#E9F1FA] focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all font-bold text-slate-900"
                    value={editingItem.title}
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">Type</label>
                        <select 
                            className="w-full p-5 bg-[#f0f9ff]/50 rounded-2xl border border-[#E9F1FA] focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all font-bold text-slate-900 cursor-pointer"
                            value={editingItem.type}
                            onChange={e => setEditingItem({...editingItem, type: e.target.value})}
                        >
                            <option value="video">Webinar (YouTube)</option>
                            <option value="link">Article (External)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">Folder / Category</label>
                        <input 
                            className="w-full p-5 bg-[#f0f9ff]/50 rounded-2xl border border-[#E9F1FA] focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all font-bold text-slate-900"
                            placeholder="e.g. Webinars, GST Guide"
                            value={editingItem.folder}
                            onChange={e => setEditingItem({...editingItem, folder: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">
                    {editingItem.type === 'video' ? 'YouTube Video ID or Link' : 'Target URL Link'}
                  </label>
                  <input 
                    required
                    className="w-full p-5 bg-[#f0f9ff]/50 rounded-2xl border border-[#E9F1FA] focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all font-bold text-slate-900"
                    placeholder={editingItem.type === 'video' ? 'e.g. dQw4w9WgXcQ' : 'https://example.com/guide'}
                    value={editingItem.url}
                    onChange={e => setEditingItem({...editingItem, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">Tags (comma separated)</label>
                  <input 
                    className="w-full p-5 bg-[#f0f9ff]/50 rounded-2xl border border-[#E9F1FA] focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all font-bold text-[#00ABE4]"
                    placeholder="e.g. tallyprime, gst, training"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">Description</label>
                  <textarea 
                    className="w-full p-5 bg-[#f0f9ff]/50 rounded-2xl border border-[#E9F1FA] focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all font-bold text-slate-600 h-[140px] resize-none"
                    value={editingItem.description}
                    onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>

                {editingItem.type === 'link' && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] ml-1">Thumbnail Configuration</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setEditingItem({...editingItem, thumbnailOption: 'logo'})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${editingItem.thumbnailOption === 'logo' ? 'border-[#00ABE4] bg-[#f0f9ff] text-[#00ABE4]' : 'border-[#E9F1FA] text-slate-300'}`}
                      >
                        Company Logo
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditingItem({...editingItem, thumbnailOption: 'custom'})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${editingItem.thumbnailOption === 'custom' ? 'border-[#00ABE4] bg-[#f0f9ff] text-[#00ABE4]' : 'border-[#E9F1FA] text-slate-300'}`}
                      >
                        Cloud Upload
                      </button>
                    </div>

                    {editingItem.thumbnailOption === 'custom' && (
                      <div className="flex items-center gap-4 p-5 bg-[#f0f9ff]/30 rounded-2xl border-2 border-dashed border-[#E9F1FA] group hover:border-[#00ABE4]/50 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden" 
                          id="thumbnail-upload"
                        />
                        <label 
                          htmlFor="thumbnail-upload"
                          className="px-6 py-3 bg-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-[#E9F1FA] cursor-pointer hover:bg-[#0371a3] hover:text-white transition-all transform active:scale-95"
                        >
                          {uploading ? 'Processing...' : 'Upload Image'}
                        </label>
                        {editingItem.thumbnail && (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#E9F1FA] bg-white shadow-inner p-1">
                            <img src={editingItem.thumbnail} alt="Thumb" className="w-full h-full object-cover rounded-lg" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] mb-3 ml-1">Asset Preview</label>
                  <div className="relative aspect-video w-full max-w-[320px] rounded-[1.5rem] overflow-hidden bg-[#f0f9ff] border-4 border-white shadow-2xl">
                    {editingItem.type === 'video' ? (
                      getYoutubeThumbnail(editingItem.url) ? (
                        <img src={getYoutubeThumbnail(editingItem.url)} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-white text-[8px] font-black text-slate-300 uppercase tracking-widest">Awaiting Video ID</div>
                      )
                    ) : (
                      editingItem.thumbnailOption === 'custom' && editingItem.thumbnail ? (
                        <img src={editingItem.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-white">
                          <img src="/logo.svg" alt="Logo" className="w-16 h-auto opacity-30" style={{ filter: 'invert(31%) sepia(94%) saturate(1131%) hue-rotate(167deg) brightness(91%) contrast(98%)' }} />
                        </div>
                      )
                    )}
                    <div className="absolute inset-0 bg-[#0371a3]/5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-[#E9F1FA]">
              <button 
                disabled={saving || uploading}
                className="flex-1 bg-[#0371a3] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#0371a3]/20 hover:bg-[#00ABE4] transition-all disabled:opacity-50 transform active:scale-95"
              >
                {saving ? 'Synchronizing...' : (editingItem._id ? 'Update Content' : 'Publish Content')}
              </button>
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-[2.5rem] border border-[#E9F1FA] shadow-sm flex flex-col h-full group hover:shadow-2xl hover:border-[#00ABE4]/20 transition-all duration-500">
              <div className="relative aspect-video w-full mb-6 rounded-[1.5rem] overflow-hidden bg-[#f0f9ff] border border-[#E9F1FA] shrink-0">
                {item.type === 'video' ? (
                  getYoutubeThumbnail(item.url) ? (
                    <img src={getYoutubeThumbnail(item.url)} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-white text-[8px] font-black text-slate-300 uppercase tracking-widest">No Video ID</div>
                  )
                ) : (
                  item.thumbnailOption === 'custom' && item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-white transition-transform duration-700 group-hover:scale-110">
                      <img src="/logo.svg" alt="Logo" className="w-20 h-auto opacity-30" style={{ filter: 'invert(31%) sepia(94%) saturate(1131%) hue-rotate(167deg) brightness(91%) contrast(98%)' }} />
                    </div>
                  )
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/40 backdrop-blur-md border border-white/40 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  {item.folder || 'General'}
                </div>
                <div className="absolute inset-0 bg-[#0371a3]/5 group-hover:bg-[#0371a3]/10 transition-colors" />
              </div>
              <div className="mb-6 flex-1 px-2">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#00ABE4] text-[9px] font-black uppercase tracking-widest bg-[#f0f9ff] px-2 py-0.5 rounded-full border border-[#E9F1FA]">
                        {item.type === 'video' ? 'Webinar' : 'Article'}
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold">{item.date}</span>
                </div>
                <h3 className="text-[17px] font-black text-slate-900 line-clamp-2 tracking-tight group-hover:text-[#00ABE4] transition-colors leading-tight mb-3">{item.title}</h3>
                <p className="text-slate-500 text-[11px] font-bold opacity-80 leading-relaxed line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-tighter text-[#00ABE4]/60">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex gap-3 pt-6 border-t border-[#f0f9ff]">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="flex-1 py-3 bg-[#f0f9ff] text-[#0371a3] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#0371a3] hover:text-white transition-all transform active:scale-95 border border-[#E9F1FA]"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-3 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-24 text-center bg-[#f0f9ff]/30 rounded-[3rem] border-2 border-dashed border-[#E9F1FA]">
              <p className="text-[#0371a3]/40 font-black uppercase tracking-widest text-[10px]">No content found matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
