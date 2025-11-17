/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Initialize and return a real Supabase client using Vite env vars.
 */
import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

/**
 * Return whether required env vars exist at runtime (Vite injects import.meta.env).
 */
function hasSupabaseEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anon);
}

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client if env vars are present; otherwise a minimal disabled stub.
 */
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseInstance;
  }

  // Graceful disabled stub (no network, but API shape to avoid crashes)
  const disabledError = { message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  supabaseInstance = {
    from() {
      return {
        select: () => ({ then: (resolve) => resolve({ data: [], error: disabledError }) }),
        insert: () => ({ then: (resolve) => resolve({ data: null, error: disabledError }), select: async () => ({ data: null, error: disabledError }), single: async () => ({ data: null, error: disabledError }) }),
        update: () => ({ then: (resolve) => resolve({ data: null, error: disabledError }), eq: () => ({ then: (resolve) => resolve({ data: null, error: disabledError }) }) }),
        eq: () => ({ then: (resolve) => resolve({ data: [], error: disabledError }), single: async () => ({ data: null, error: disabledError }), order: () => ({ then: (resolve) => resolve({ data: [], error: disabledError }) }) }),
        single: async () => ({ data: null, error: disabledError }),
        order: () => ({ then: (resolve) => resolve({ data: [], error: disabledError }) }),
      };
    },
    storage: {
      from() {
        return {
          createSignedUrl: async () => ({ data: { signedUrl: '' }, error: disabledError }),
          upload: async () => ({ data: null, error: disabledError }),
        };
      },
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: disabledError }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => ({ data: null, error: disabledError }),
      signUp: async () => ({ data: null, error: disabledError }),
      signOut: async () => ({ error: null }),
    },
    __disabled: true,
  };
  return supabaseInstance;
}

/**
 * PUBLIC_INTERFACE
 * isSupabaseConfigured
 * Returns boolean indicating whether the client is fully configured.
 */
export function isSupabaseConfigured() {
  return hasSupabaseEnv();
}
