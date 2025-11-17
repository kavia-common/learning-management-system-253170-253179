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
    if (import.meta?.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        'Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
      );
    }
  }

  supabaseInstance = createClient(url || '', anonKey || '', {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
}
