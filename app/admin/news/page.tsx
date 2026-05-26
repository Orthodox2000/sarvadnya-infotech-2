'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem } from '@/lib/news';

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchNews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;
    try {
      const res = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading news...</div>;

  return (
    <div>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">News & Updates</h1>
          <p className="text-slate-500 text-sm mt-1">Manage company news and press releases.</p>
        </div>
        <button 
          onClick={() => setEditingItem({ title: '', date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), category: 'Product Update', description: '', content: '', link: '#' })}
          className="bg-[#0371a3] text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          Add News Item
        </button>
      </header>

      {editingItem ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#0f172a] mb-6">{editingItem._id ? 'Edit News' : 'Add News Item'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Title" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingItem.title || ''}
                onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Category (e.g. Product Update, Achievement)" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingItem.category || ''}
                onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Date" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingItem.date || ''}
                onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Link (e.g. /products or #)" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={editingItem.link || ''}
                onChange={e => setEditingItem({...editingItem, link: e.target.value})}
                required
              />
            </div>
            
            <textarea 
              placeholder="Short Description" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-24"
              value={editingItem.description || ''}
              onChange={e => setEditingItem({...editingItem, description: e.target.value})}
              required
            />
            
            <textarea 
              placeholder="Full Content" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-48"
              value={editingItem.content || ''}
              onChange={e => setEditingItem({...editingItem, content: e.target.value})}
              required
            />

            <div className="flex gap-4">
              <button type="submit" className="bg-[#0371a3] text-white px-8 py-3 rounded-2xl font-bold">Save News</button>
              <button type="button" onClick={() => setEditingItem(null)} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {news.map(item => (
            <div key={(item as any)._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-[#0371a3]/30 transition-all">
              <div>
                <h3 className="font-bold text-[#0f172a]">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.category} • {item.date}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="px-3 py-1 text-xs font-bold text-[#0371a3] hover:bg-sky-50 rounded-lg transition-colors border border-sky-100"
                  title="Edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete((item as any)._id)}
                  className="px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                  title="Delete"
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

