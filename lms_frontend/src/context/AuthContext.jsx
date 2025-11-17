import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** This context provides a disabled-auth state with no backend requirements. */
  user: null,
  profile: null,
  roles: [],
  loading: false,
  signIn: async () => ({ error: { message: 'Authentication disabled in demo mode' } }),
  signUp: async () => ({ error: { message: 'Authentication disabled in demo mode' } }),
  signOut: async () => ({ error: null }),
  refreshProfile: async () => {},
});

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication context. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides a no-auth context. Supabase client is a no-op stub.
   * All features depending on authentication are disabled.
   */
  const supabase = getSupabaseClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Maintain API parity; ensure no network calls are made.
    (async () => {
      setLoading(false);
      setUser(null);
      setProfile(null);
      setRoles([]);
    })();
    // subscribe/unsubscribe to maintain shape
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async () => ({ error: { message: 'Authentication disabled in demo mode' } });
  const signUp = async () => ({ error: { message: 'Authentication disabled in demo mode' } });
  const signOut = async () => ({ error: null });
  const refreshProfile = async () => {};

  const value = useMemo(
    () => ({ user, profile, roles, loading, signIn, signUp, signOut, refreshProfile }),
    [user, profile, roles, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
