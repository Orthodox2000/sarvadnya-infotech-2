'use client';

import { useCallback, useEffect, useState } from 'react';

// CHANGE: 2026-10-05 — was `CareersAuthGate`, which HATED the openings list: when signed out it
// returned `<AuthForms />` and never called `children`, so a logged-out visitor saw a login card
// and NO job openings at all. It is no longer a gate. The contract is now a plain provider that
// always renders `children` and merely SUPPLIES auth state, so the /careers two-column layout can
// render openings on the left and the login/profile card on the right at the same time.
export interface CareersAuthState {
  /** The signed-in candidate, or null while signed out / before the check resolves. */
  user: any;
  /** False until the `/api/auth/careers/me` round-trip settles. The auth COLUMN waits on this;
   *  the openings list never does. */
  isAuthReady: boolean;
  /** Adopt a freshly authenticated candidate. Handed to <AuthForms onSuccess>. */
  setUser: (user: any) => void;
  /** POST logout, then drop the local user so the column falls back to the login form. */
  signOut: () => Promise<void>;
}

interface CareersAuthProviderProps {
  children: (props: CareersAuthState) => React.ReactNode;
}

export function CareersAuthProvider({ children }: CareersAuthProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // CHANGE: 2026-10-05 — the `cancelled` guard was added with the provider rename: this is a
    // component that no longer unmounts on a state change (the old gate could swap branches
    // mid-flight), so a slow /me response can resolve after the tree is gone.
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/careers/me');
        if (response.ok) {
          const data = await response.json();
          if (!cancelled) setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        if (!cancelled) setIsAuthReady(true);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/careers/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return <>{children({ user, isAuthReady, setUser, signOut })}</>;
}