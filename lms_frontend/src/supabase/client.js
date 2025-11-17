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

  const url = process.env.REACT_APP_SUPABASE_URL;
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY; // backward compat with container_env list

  if (!url || !anonKey) {
    // Non-fatal warning—allows app to render with limited functionality.
    // Do not log secrets and avoid spamming prod logs.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        'Supabase env vars missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.'
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
