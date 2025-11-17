import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Creates and returns a singleton Supabase client using environment variables.
 * This function guards against missing env variables in development and prevents
 * accidental hardcoding of secrets.
 *
 * Returns:
 *   SupabaseClient instance
 */
let supabaseInstance = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a singleton Supabase client. */
  if (supabaseInstance) return supabaseInstance;

  // Prefer Vite-style env vars; fall back to CRA-style for backward compatibility
  const url = import.meta?.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const anonKey =
    import.meta?.env?.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !anonKey) {
    const isProd = (import.meta?.env?.MODE === 'production') || (process.env.NODE_ENV === 'production');
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.warn(
        'Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
      );
      // eslint-disable-next-line no-console
      console.info('Env presence debug (no secrets):', {
        hasViteUrl: Boolean(import.meta?.env?.VITE_SUPABASE_URL),
        hasViteKey: Boolean(import.meta?.env?.VITE_SUPABASE_ANON_KEY),
        hasCRAUrl: Boolean(process.env?.REACT_APP_SUPABASE_URL),
        hasCRAKey: Boolean(process.env?.REACT_APP_SUPABASE_KEY || process.env?.REACT_APP_SUPABASE_ANON_KEY),
        mode: import.meta?.env?.MODE || process.env.NODE_ENV,
      });
    }
  }

  try {
    supabaseInstance = createClient(url || '', anonKey || '', {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e) {
    // Do not crash app; provide a minimal mock that throws on use with clear message
    // eslint-disable-next-line no-console
    console.error('[LMS] Failed to initialize Supabase client:', e?.message || e);
    const err = new Error('Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    supabaseInstance = {
      from() { throw err; },
      auth: {
        getSession: async () => ({ data: { session: null }, error: err }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signInWithPassword: async () => ({ data: null, error: err }),
        signUp: async () => ({ data: null, error: err }),
        signOut: async () => ({ error: null }),
      },
      storage: { from() { return { createSignedUrl: async () => ({ data: null, error: err }), upload: async () => ({ data: null, error: err }) }; } },
    };
  }

  return supabaseInstance;
}
