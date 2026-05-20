'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { showToast } from '@/app/components/NotificationToast';

export default function AdminLearning() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFolder, setFilterFolder] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

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
      const method = editingItem._id ? 'PUT' : 'POST';
      const body = editingItem._id 
        ? { id: editingItem._id, ...editingItem } 
        : editingItem;

      const response = await fetch('/api/tutorials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

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
      if (data.error) throw new Error(data.error);
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f0529]">Learning Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Manage videos, links, and tutorials for your users.</p>
        </div>
        <button 
          onClick={startAdd}
          className="bg-[#7338a0] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          + Add New Content
        </button>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Search and Filter */}
      {!editingItem && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search by title or tags..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#7338a0] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#7338a0] outline-none font-bold text-slate-700"
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
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl mb-12 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#0f0529]">{editingItem._id ? 'Edit Content' : 'New Content'}</h2>
            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-900 font-bold">Cancel</button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Title</label>
                  <input 
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] font-bold"
                    value={editingItem.title}
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] font-bold"
                    value={editingItem.type}
                    onChange={e => setEditingItem({...editingItem, type: e.target.value})}
                  >
                    <option value="video">YouTube Video</option>
                    <option value="link">External Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">YouTube ID or Link URL</label>
                  <input 
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    placeholder={editingItem.type === 'video' ? 'e.g. dQw4w9WgXcQ' : 'https://example.com/guide'}
                    value={editingItem.url}
                    onChange={e => setEditingItem({...editingItem, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Folder / Category</label>
                  <input 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    placeholder="e.g. Webinars, GST Guide, Mobile App"
                    value={editingItem.folder}
                    onChange={e => setEditingItem({...editingItem, folder: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0] h-32"
                    value={editingItem.description}
                    onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tags (comma separated)</label>
                  <input 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7338a0]"
                    placeholder="e.g. tallyprime, gst, training"
                    value={editingItem.tags?.join(', ')}
                    onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})}
                  />
                </div>
                {editingItem.type === 'video' && editingItem.url && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Auto-Thumbnail Preview</label>
                    <div className="relative aspect-video w-48 rounded-xl overflow-hidden bg-slate-100">
                      <img src={getYoutubeThumbnail(editingItem.url)} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                disabled={saving}
                className="flex-1 bg-[#7338a0] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Content'}
              </button>
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-8 py-4 border border-slate-200 rounded-2xl font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col group">
              <div className="relative aspect-video w-full mb-4 rounded-2xl overflow-hidden bg-slate-50">
                {item.type === 'video' ? (
                  <img src={getYoutubeThumbnail(item.url)} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 bg-indigo-50">
                    <svg className="w-12 h-12 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[8px] font-bold rounded-full uppercase tracking-wider">
                  {item.folder || 'General'}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-[#0f0529] line-clamp-1">{item.title}</h3>
                <p className="text-slate-400 text-[10px] mt-1 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-bold rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="flex-1 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="py-2 px-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">No content found matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
