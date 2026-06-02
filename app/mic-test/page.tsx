'use client';

import { useState, useEffect } from 'react';
import { requestMediaPermissions, MediaPermissionsErrorType } from 'mic-check';

export default function MicTestPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'granted' | 'denied' | 'error'>('idle');
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    const secure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost');
    setIsSecure(secure);
  }, []);

  async function startTest() {
    setStatus('checking');
    setErrorType(null);
    setErrorMessage(null);

    try {
      const granted = await requestMediaPermissions({ audio: true });
      if (granted) {
        setStatus('granted');
      } else {
        setStatus('denied');
      }
    } catch (err: any) {
      console.error('[MicTest] Error:', err);
      setStatus('error');
      setErrorType(err.type || err.name || 'Unknown');
      
      if (err.type === MediaPermissionsErrorType.SystemPermissionDenied) {
        setErrorMessage("System-level permission denied. Check your OS Privacy settings.");
      } else if (err.type === MediaPermissionsErrorType.UserPermissionDenied) {
        setErrorMessage("User denied permission in the browser.");
      } else if (err.type === MediaPermissionsErrorType.CouldNotStartVideoSource) {
        setErrorMessage("Microphone busy or could not be started.");
      } else {
        setErrorMessage(err.message || "An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-[#0371a3]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Microphone Diagnostic</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Hardware Testing Utility</p>
          </div>
        </div>

        {!isSecure && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-xs leading-relaxed">
            <strong className="block mb-1 font-black">SECURITY ALERT: Insecure Context</strong>
            This page is not running on HTTPS. Browsers will automatically block microphone access on insecure connections.
          </div>
        )}

        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
            status === 'granted' ? 'bg-green-50 border-green-200 text-green-700' :
            status === 'denied' ? 'bg-amber-50 border-amber-200 text-amber-700' :
            status === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            <div className="mb-4">
              {status === 'checking' ? (
                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              ) : status === 'granted' ? (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
            </div>
            
            <h2 className="text-lg font-black uppercase tracking-tight">
              {status === 'idle' ? 'Ready to Test' :
               status === 'checking' ? 'Testing...' :
               status === 'granted' ? 'Access Granted' :
               status === 'denied' ? 'Access Denied' : 'Test Error'}
            </h2>
            
            {errorMessage && <p className="mt-2 text-xs font-medium leading-relaxed">{errorMessage}</p>}
            {errorType && <p className="mt-1 text-[10px] opacity-60 font-mono">Code: {errorType}</p>}
          </div>

          <button
            onClick={startTest}
            disabled={status === 'checking'}
            className="w-full py-4 bg-[#0371a3] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#025b8a] transition-all shadow-lg shadow-sky-900/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {status === 'idle' ? 'Start Diagnostic' : 'Run Again'}
          </button>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Diagnostic Guide</h3>
            <ul className="space-y-2 text-[11px] text-slate-600 font-medium">
              <li className="flex gap-2">
                <span className="text-sky-500">•</span>
                Ensure no other apps (Zoom/Teams) are using the mic.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-500">•</span>
                Check the Lock icon in your address bar for site permissions.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-500">•</span>
                macOS users: Check System Settings {'>'} Privacy {'>'} Microphone.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
