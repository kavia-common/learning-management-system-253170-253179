/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Initialize and return a real Supabase client using Vite env vars.
 */
import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

/**
 * Validate that env values exist and look roughly correct.
 * Does not guarantee reachability but helps catch obvious mistakes.
 */
function validateSupabaseEnv(url, anon) {
  const problems = [];
  if (!url) problems.push('VITE_SUPABASE_URL missing');
  if (!anon) problems.push('VITE_SUPABASE_ANON_KEY missing');
  if (url && !/^https?:\/\//i.test(url)) {
    problems.push('VITE_SUPABASE_URL must start with http:// or https://');
  }
  // anon key is a JWT; we don't strictly validate but ensure it's a non-empty string
  if (anon && typeof anon !== 'string') {
    problems.push('VITE_SUPABASE_ANON_KEY must be a string');
  }
  return { ok: problems.length === 0, problems };
}

/**
 * Return whether required env vars exist at runtime (Vite injects import.meta.env).
 */
// PUBLIC_INTERFACE
export function hasSupabaseEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anon);
}

/**
 * Attempt a minimal auth call to detect if the Supabase endpoint is reachable.
 * Best-effort: times out after 3s and returns false on failure.
 */
async function attemptAuthProbe(client) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    // getSession uses fetch under the hood; we can't inject signal, so just race with timeout
    const res = await Promise.race([
      client.auth.getSession(),
      new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 3000)),
    ]);
    clearTimeout(t);
    if (res?.timeout) return false;
    return true;
  } catch {
    return false;
  }
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

  const { ok, problems } = validateSupabaseEnv(supabaseUrl, supabaseAnonKey);

  if (ok) {
    try {
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      // annotate with a lazy connectivity flag (best-effort)
      client.__connectivity = { reachable: null };
      // fire and forget probe; do not block UI
      attemptAuthProbe(client).then((reachable) => {
        client.__connectivity.reachable = reachable;
        if (reachable === false) {
          // eslint-disable-next-line no-console
          console.warn(
            '[LMS] Supabase endpoint appears unreachable. Check VITE_SUPABASE_URL and network/firewall.'
          );
        }
      });
      supabaseInstance = client;
      return supabaseInstance;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[LMS] Failed to create Supabase client:', e);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('[LMS] Supabase env problems:', problems.join('; '));
  }

  // Graceful disabled stub (no network, but API shape to avoid crashes)
  const disabledError = { message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  supabaseInstance = {
    from() {
      return {
        select: () => ({ then: (resolve) => resolve({ data: [], error: disabledError }) }),
        insert: () => ({
          then: (resolve) => resolve({ data: null, error: disabledError }),
          select: async () => ({ data: null, error: disabledError }),
          single: async () => ({ data: null, error: disabledError }),
        }),
        update: () => ({
          then: (resolve) => resolve({ data: null, error: disabledError }),
          eq: () => ({ then: (resolve) => resolve({ data: null, error: disabledError }) }),
        }),
        eq: () => ({
          then: (resolve) => resolve({ data: [], error: disabledError }),
          single: async () => ({ data: null, error: disabledError }),
          order: () => ({ then: (resolve) => resolve({ data: [], error: disabledError }) }),
        }),
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
    __connectivity: { reachable: null },
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
