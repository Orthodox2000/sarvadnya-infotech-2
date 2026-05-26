'use client';

import React, { useState, useEffect } from 'react';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content?section=home_faq');
      const data = await response.json();
      if (data && !data.error) {
        setFaqs(data);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch FAQs.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'home_faq', content: faqs })
      });

      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'FAQs updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Save failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => {
    setFaqs([{ question: '', answer: '' }, ...faqs]);
  };

  const removeFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const updateFaq = (idx: number, field: string, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[idx][field] = value;
    setFaqs(newFaqs);
  };

  if (loading) return <div className="text-center py-10">Loading FAQs...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">Manage FAQ</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit, or remove frequently asked questions.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={addFaq}
            className="bg-sky-50 text-[#0371a3] px-6 py-3 rounded-2xl font-bold hover:bg-sky-100 transition-all"
          >
            + Add Question
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0371a3] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
            <p className="text-slate-400">No FAQs found. Click "Add Question" to get started.</p>
          </div>
        ) : (
          faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative group">
              <button 
                onClick={() => removeFaq(idx)}
                className="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors"
                title="Remove Question"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <div className="pr-10">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Question {faqs.length - idx}</label>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] font-bold text-slate-800"
                  placeholder="e.g. How do I upgrade to TallyPrime?"
                  value={faq.question}
                  onChange={e => updateFaq(idx, 'question', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Answer</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-32 text-slate-600 leading-relaxed"
                  placeholder="Provide a detailed answer..."
                  value={faq.answer}
                  onChange={e => updateFaq(idx, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

