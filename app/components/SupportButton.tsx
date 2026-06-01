'use client';

import { useState, useEffect } from 'react';
import QuickSupportModal from './QuickSupportModal';

export default function SupportButton({ initialSettings }: { initialSettings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState(initialSettings?.whatsapp_phone || initialSettings?.support_phone || "9821309060");

  useEffect(() => {
    if (initialSettings) return;
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.whatsapp_phone) {
          setWhatsappPhone(data.whatsapp_phone);
        } else if (data.support_phone) {
          setWhatsappPhone(data.support_phone);
        }
      } catch (err) {
        console.error('Failed to fetch whatsapp phone:', err);
      }
    };
    fetchSettings();
  }, [initialSettings]);

  const whatsappNumber = whatsappPhone.replace(/\D/g, '').length === 10 
    ? '91' + whatsappPhone.replace(/\D/g, '') 
    : whatsappPhone.replace(/\D/g, '');

  useEffect(() => {
    const checkOpen = () => {
      if (window.location.hash === '#ask-sara' || window.location.search.includes('ask-sara=true')) {
        setIsOpen(true);
      }
    };
    checkOpen();
    window.addEventListener('hashchange', checkOpen);
    return () => window.removeEventListener('hashchange', checkOpen);
  }, []);

  const handleOpenAi = async () => {
    setIsOpen(true);
    
    // Proactively request microphone permission on user action
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.warn('Proactive mic permission failed:', err);
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[3000] flex flex-col gap-3 items-end">
        {/* Ask Sara Button (Top) */}
        <button
          onClick={handleOpenAi}
          aria-label="Ask AI"
          className="flex items-center gap-2 bg-[#00ABE4] text-white px-4 py-2.5 rounded-full shadow-[0_15px_40px_rgba(0,171,228,0.3)] hover:shadow-[0_20px_50px_rgba(0,171,228,0.4)] transition-all duration-500 ease-in-out transform hover:-translate-y-1 active:scale-95 group relative"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 border-2 border-[#00ABE4]"></span>
            </span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-[12px] tracking-tight">Ask Sara</span>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-4 w-44 p-3 bg-white text-slate-900 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-y-2 group-hover:translate-y-0 border border-slate-100">
            <p className="text-[10px] font-bold leading-tight text-[#00ABE4]">Sara • Smart Assistant</p>
            <p className="text-[9px] text-slate-500 mt-1 font-medium">Ask Sara about TallyPrime features, hosting, or modules.</p>
            <div className="absolute top-full right-8 w-2 h-2 bg-white border-b border-r border-slate-100 rotate-45 -translate-y-1" />
          </div>
        </button>

        {/* WhatsApp Button (Bottom) */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.2)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.3)] transition-all duration-500 ease-in-out transform hover:-translate-y-1 active:scale-95 group"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="font-bold text-[12px] tracking-tight">WhatsApp</span>
        </a>
      </div>

      <QuickSupportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
