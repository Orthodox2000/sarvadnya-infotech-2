'use client';

import React, { useState, useEffect } from 'react';

type Review = {
  _id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  createdAt?: string;
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '', date: 'Just now' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reviews');
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setReviews(data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch reviews.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviews.length >= 4) {
      setMessage({ text: 'Maximum 4 reviews allowed.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);

      setMessage({ text: 'Review added!', type: 'success' });
      setNewReview({ name: '', rating: 5, text: '', date: 'Just now' });
      fetchReviews();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Failed to add review.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data && data.error) throw new Error(data.error);
      setMessage({ text: 'Review deleted!', type: 'success' });
      fetchReviews();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete review.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center py-10">Loading reviews...</div>;

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Google Reviews</h1>
        <p className="text-slate-500 text-sm mt-1">Manage reviews displayed on the homepage (Max 4).</p>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Add Review */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Review</h2>
          <form onSubmit={handleAddReview} className="space-y-4">
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
              placeholder="Customer Name"
              value={newReview.name}
              onChange={e => setNewReview({...newReview, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                value={newReview.rating}
                onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              >
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
                placeholder="Date (e.g. 2 weeks ago)"
                value={newReview.date}
                onChange={e => setNewReview({...newReview, date: e.target.value})}
                required
              />
            </div>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3] h-32"
              placeholder="Review Text"
              value={newReview.text}
              onChange={e => setNewReview({...newReview, text: e.target.value})}
              required
            />
            <button 
              type="submit" 
              disabled={submitting || reviews.length >= 4}
              className="w-full bg-[#0371a3] text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Adding...' : reviews.length >= 4 ? 'Limit Reached' : 'Add Review'}
            </button>
          </form>
        </div>

        {/* List Reviews */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Current Reviews ({reviews.length}/4)</h2>
          {reviews.map(review => (
            <div key={review._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-start group">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{review.name}</span>
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">{review.rating} ★</span>
                </div>
                <p className="text-xs text-slate-400">{review.date}</p>
                <p className="text-sm text-slate-600 line-clamp-2 italic">"{review.text}"</p>
              </div>
              <button 
                onClick={() => handleDelete(review._id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">No reviews found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
