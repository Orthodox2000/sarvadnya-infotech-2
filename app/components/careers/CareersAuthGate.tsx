'use client';

import { useState, useEffect } from 'react';
import { AuthForms } from './AuthForms';
import { IdCard } from './IdCard';

interface CareersAuthGateProps {
  children: (props: { user: any; isAuthReady: boolean }) => React.ReactNode;
}

export function CareersAuthGate({ children }: CareersAuthGateProps) {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/careers/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
      setIsAuthReady(true);
    }
  };
  
  const handleSuccess = (u: any) => {
    setUser(u);
  };
  
  const handleLogout = async () => {
    await fetch('/api/auth/careers/logout', { method: 'POST' });
    setUser(null);
  };
  
  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <AuthForms onSuccess={handleSuccess} />
      </div>
    );
  }
  
  return (
    <div>
      <IdCard user={user} onLogout={handleLogout} />
      {children({ user, isAuthReady })}
    </div>
  );
}
