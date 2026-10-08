'use client';

import { useState } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/careers/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-black mb-4">Change Password</h2>
        {success ? (
          <p className="text-sm text-green-600">Password changed. Logging out...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full rounded-xl border px-4 py-2 text-sm" required />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password (min 6)</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} className="w-full rounded-xl border px-4 py-2 text-sm" required />
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-[#006569] text-white rounded-xl py-2 text-xs font-black">
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-slate-200 rounded-xl py-2 text-xs font-black">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}