import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** This context provides the authenticated user, roles, loading state, and auth methods. */
  user: null,
  profile: null,
  roles: [],
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
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
   * Provides Auth context to the app using Supabase session and profile table.
   */
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRoles = async (userId) => {
    if (!userId) {
      setProfile(null);
      setRoles([]);
      return;
    }
    // Fetch profile from 'users' table and map roles
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
      setRoles([data.role].filter(Boolean));
    } else {
      setProfile(null);
      setRoles([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(s);
      await fetchProfileAndRoles(s?.user?.id);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      await fetchProfileAndRoles(newSession?.user?.id);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async ({ email, password }) => {
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error) {
      await fetchProfileAndRoles(result.data.user.id);
    }
    return result;
  };

  const signUp = async ({ email, password, fullName }) => {
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    const redirectTo =
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FRONTEND_URL) ||
      process.env.VITE_FRONTEND_URL ||
      process.env.REACT_APP_FRONTEND_URL ||
      window.location.origin;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: fullName || '' },
      },
    });

    if (!error && data?.user) {
      // Create profile row
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName || '',
        role: 'student',
      });
      await fetchProfileAndRoles(data.user.id);
    }
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  const refreshProfile = async () => {
    await fetchProfileAndRoles(session?.user?.id);
  };

  const value = useMemo(
    () => ({
      user: session?.user || null,
      profile,
      roles,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, profile, roles, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
