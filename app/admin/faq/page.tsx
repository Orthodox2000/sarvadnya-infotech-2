'use client';

import React, { useState, useEffect } from 'react';

const CATEGORY_OPTIONS = ['Products', 'Services', 'Technical', 'Contact'];

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

  const faqsByCategory = (category: string) =>
    faqs.filter(f => f.category === category);

  const addFaq = (category: string) => {
    setFaqs([{ question: '', answer: '', category }, ...faqs]);
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
          <p className="text-slate-500 text-sm mt-1">Add, edit, or remove questions organized by section.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0371a3] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-10">
        {CATEGORY_OPTIONS.map(category => {
          const sectionFaqs = faqsByCategory(category);
          return (
            <div key={category} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-[#f0f9ff] border-b border-[#E9F1FA]">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black text-[#0371a3]">{category}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E9F1FA] text-[#0371a3] text-[10px] font-black uppercase tracking-widest">
                    {sectionFaqs.length} {sectionFaqs.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </div>
                <button
                  onClick={() => addFaq(category)}
                  className="bg-[#0371a3] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#00ABE4] transition-all"
                >
                  + Add to {category}
                </button>
              </div>

              {sectionFaqs.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-slate-400">No questions in this section.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {sectionFaqs.map((faq, localIdx) => {
                    const globalIdx = faqs.indexOf(faq);
                    return (
                      <div key={globalIdx} className="p-6 space-y-4 relative group hover:bg-slate-50/50 transition-colors">
                        <button
                          onClick={() => removeFaq(globalIdx)}
                          className="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Question"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <div className="pr-10">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Question {sectionFaqs.length - localIdx}
                          </label>
                          <input
                            className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] font-bold text-slate-800"
                            placeholder="e.g. What is TallyPrime Silver?"
                            value={faq.question}
                            onChange={e => updateFaq(globalIdx, 'question', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Answer</label>
                          <textarea
                            className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-24 text-slate-600 leading-relaxed"
                            placeholder="Provide a detailed answer..."
                            value={faq.answer}
                            onChange={e => updateFaq(globalIdx, 'answer', e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Uncategorized */}
        {faqs.filter(f => !f.category || !CATEGORY_OPTIONS.includes(f.category)).length > 0 && (
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-red-50 border-b border-red-100">
              <h2 className="text-lg font-black text-red-600">Uncategorized</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {faqs.filter(f => !f.category || !CATEGORY_OPTIONS.includes(f.category)).map((faq, idx) => {
                const globalIdx = faqs.indexOf(faq);
                return (
                  <div key={globalIdx} className="p-6 space-y-4 relative group hover:bg-slate-50/50 transition-colors">
                    <button
                      onClick={() => removeFaq(globalIdx)}
                      className="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors"
                      title="Remove Question"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <div className="pr-10">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Question</label>
                      <input
                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] font-bold text-slate-800"
                        value={faq.question}
                        onChange={e => updateFaq(globalIdx, 'question', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                      <select
                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] font-medium text-slate-700"
                        value={faq.category || ''}
                        onChange={e => updateFaq(globalIdx, 'category', e.target.value)}
                      >
                        <option value="">Select a section</option>
                        {CATEGORY_OPTIONS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Answer</label>
                      <textarea
                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-24 text-slate-600 leading-relaxed"
                        value={faq.answer}
                        onChange={e => updateFaq(globalIdx, 'answer', e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
