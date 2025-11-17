import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** Auth/session context backed by Supabase when configured, otherwise disabled with banner */
  user: null,
  profile: null,
  roles: [],
  loading: false,
  supabaseReady: false,
  signIn: async () => ({ error: { message: 'Supabase not configured' } }),
  signUp: async () => ({ error: { message: 'Supabase not configured' } }),
  signOut: async () => ({ error: null }),
  refreshProfile: async () => {},
});

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication context. */
  return useContext(AuthContext);
}

// Fetch profile helper
async function fetchProfile(supabase, uid) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', uid)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides real Supabase auth when env vars exist, with graceful fallback banner if not.
   */
  const supabase = getSupabaseClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured() && !supabase.__disabled;

  // Initialize session and subscribe to auth state
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      setLoading(true);
      if (!supabaseReady) {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setLoading(false);
        return;
      }
      const { data: sessionRes } = await supabase.auth.getSession();
      const session = sessionRes?.session || null;
      const authUser = session?.user || null;
      setUser(authUser);
      if (authUser?.id) {
        const p = await fetchProfile(supabase, authUser.id);
        setProfile(p);
        setRoles(p?.role ? [p.role] : []);
      } else {
        setProfile(null);
        setRoles([]);
      }
      setLoading(false);

      const { data } = supabase.auth.onAuthStateChange(async (_, s) => {
        const u = s?.user || null;
        setUser(u);
        if (u?.id) {
          const p2 = await fetchProfile(supabase, u.id);
          setProfile(p2);
          setRoles(p2?.role ? [p2.role] : []);
        } else {
          setProfile(null);
          setRoles([]);
        }
      });
      unsub = () => data.subscription.unsubscribe();
    })();
    return () => unsub();
  }, [supabase, supabaseReady]);

  const signIn = async ({ email, password }) => {
    if (!supabaseReady) return { error: { message: 'Supabase not configured' } };
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async ({ email, password, fullName }) => {
    if (!supabaseReady) return { error: { message: 'Supabase not configured' } };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: (import.meta.env.VITE_FRONTEND_URL || window.location.origin) + '/login',
        data: { full_name: fullName || '' },
      },
    });
    if (error) return { error };
    // create profile row best-effort (may require RLS allowing owner)
    try {
      if (data?.user?.id) {
        await supabase
          .from('users')
          .insert({ id: data.user.id, email, full_name: fullName || '', role: 'student' });
      }
    } catch {
      // ignore if RLS prevents insertion pre-confirmation
    }
    return { error: null };
  };

  const signOut = async () => {
    if (!supabaseReady) return { error: null };
    return await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (!supabaseReady || !user?.id) return;
    const p = await fetchProfile(supabase, user.id);
    setProfile(p);
    setRoles(p?.role ? [p.role] : []);
  };

  const value = useMemo(
    () => ({ user, profile, roles, loading, signIn, signUp, signOut, refreshProfile, supabaseReady }),
    [user, profile, roles, loading, supabaseReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
