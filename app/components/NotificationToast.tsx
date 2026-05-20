'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastCount = 0;
let addToastFn: (message: string, type: ToastType) => void;

export const showToast = (message: string, type: ToastType = 'info') => {
  if (addToastFn) addToastFn(message, type);
};

export default function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (message: string, type: ToastType) => {
      const id = ++toastCount;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported in this browser', 'error');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast('Notification permission granted!', 'success');
      new Notification('Sarvadnya Infotech', {
        body: 'Thank you for enabling notifications!',
        icon: '/favicon.ico'
      });
    } else {
      showToast('Notification permission denied', 'error');
    }
  };

  return (
    <div className="fixed top-24 right-6 z-[3000] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 pointer-events-auto ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            'bg-[#0f0529] text-white'
          }`}
        >
          {toast.type === 'success' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>}
          {toast.type === 'error' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>}
          <p className="font-bold text-sm tracking-tight">{toast.message}</p>
        </div>
      ))}
      
      {/* Hidden button for permission request, can be called via showToast logic if needed or from SupportButton */}
      <button id="request-notif-btn" onClick={requestPermission} className="hidden" />
    </div>
  );
}
