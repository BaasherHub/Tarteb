import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '@/core/lib/api';
import {
  clearSession,
  getStoredUser,
  hasSession,
  type StoredUser,
} from '@/core/services/tokenStorage';

export type AuthUser = StoredUser;
export type AuthSession = { user: AuthUser };

type AuthContextValue = {
  session: AuthSession | null;
  isReady: boolean;
  signOut: () => Promise<void>;
  /** Re-read session from storage — call after a successful login. */
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  const loadSession = useCallback(async () => {
    const [loggedIn, user] = await Promise.all([hasSession(), getStoredUser()]);
    setSession(loggedIn && user ? { user } : null);
  }, []);

  useEffect(() => {
    let mounted = true;
    void loadSession()
      .catch(() => setSession(null))
      .finally(() => { if (mounted) setIsReady(true); });
    return () => { mounted = false; };
  }, [loadSession]);

  const refreshSession = useCallback(async () => {
    await loadSession();
  }, [loadSession]);

  const signOut = useCallback(async () => {
    try { await api.auth.logout(); } catch { /* clear local state regardless */ }
    await clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, isReady, signOut, refreshSession }),
    [session, isReady, signOut, refreshSession],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
