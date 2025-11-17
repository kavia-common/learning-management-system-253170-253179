/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a harmless no-op client that mimics the Supabase API used in the app.
 * No environment variables are referenced and no network calls are made.
 */
let supabaseInstance = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a singleton no-op Supabase-like client. */
  if (supabaseInstance) return supabaseInstance;

  // Minimal in-memory mock store for demo
  const memory = {
    users: [],
    courses: [],
    course_content: [],
    enrollments: [],
    quizzes: [],
    quiz_questions: [],
    quiz_submissions: [],
  };

  // Helper to chain a simple "query builder" with limited select/eq/single/order
  const table = (name) => ({
    select: () => ({
      _filters: {},
      _single: false,
      _order: null,
      eq(field, value) {
        this._filters[field] = value;
        return this;
      },
      single() {
        this._single = true;
        return this;
      },
      order(field, { ascending } = { ascending: true }) {
        this._order = { field, ascending };
        return this;
      },
      async then(resolve) {
        let items = Array.isArray(memory[name]) ? [...memory[name]] : [];
        // apply filters (equality only)
        for (const [k, v] of Object.entries(this._filters || {})) {
          if (name === 'enrollments' && k === 'user_id' && this._select?.includes('course:course_id')) {
            // very limited shape handling used in Dashboard.jsx: map to { course: { id,title,description } }
          }
          items = items.filter((row) => row?.[k] === v);
        }
        // ordering
        if (this._order) {
          const { field, ascending } = this._order;
          items.sort((a, b) => {
            const av = a?.[field];
            const bv = b?.[field];
            return (av > bv ? 1 : av < bv ? -1 : 0) * (ascending ? 1 : -1);
          });
        }
        // return shape similar to supabase-js
        const data = this._single ? items[0] ?? null : items;
        resolve({ data, error: null });
      },
      catch() { /* no-op for promise compat */ },
    }),
    insert: (payload) => ({
      async select() {
        // pretend insert succeeds and returns object with a generated id
        const now = Date.now().toString(36);
        const rows = Array.isArray(payload) ? payload : [payload];
        const withIds = rows.map((r) => ({ id: r.id || now + Math.random().toString(36).slice(2), ...r }));
        memory[name].push(...withIds);
        return { data: withIds, error: null };
      },
      async single() {
        const now = Date.now().toString(36);
        const row = { id: payload.id || now + Math.random().toString(36).slice(2), ...payload };
        memory[name].push(row);
        return { data: row, error: null };
      },
      async then(resolve) {
        memory[name].push(Array.isArray(payload) ? payload[0] : payload);
        resolve({ data: null, error: null });
      },
    }),
    update: () => ({
      eq() {
        return { then(resolve){ resolve({ data: null, error: null }); } };
      },
    }),
  });

  supabaseInstance = {
    from: (name) => table(name),
    auth: {
      async getSession() {
        // Not authenticated in no-op mode
        return { data: { session: null }, error: null };
      },
      onAuthStateChange() {
        // Return unsubscribe handle
        return { data: { subscription: { unsubscribe() {} } } };
      },
      async signInWithPassword() {
        // Always fail (auth disabled)
        return { data: null, error: { message: 'Authentication disabled in demo mode' } };
      },
      async signUp() {
        // Always succeed superficially, but no real account is created
        return { data: { user: { id: 'demo-user', email: 'demo@example.com' } }, error: null };
      },
      async signOut() {
        return { error: null };
      },
    },
    storage: {
      from() {
        return {
          async createSignedUrl() {
            // No storage in demo; return empty url
            return { data: { signedUrl: '' }, error: null };
          },
          async upload() {
            // Pretend success
            return { data: { path: 'noop' }, error: null };
          },
        };
      },
    },
  };

  return supabaseInstance;
}
