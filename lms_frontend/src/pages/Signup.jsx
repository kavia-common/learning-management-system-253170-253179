import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Signup() {
  /** Signup form using Supabase auth */
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setMsg('');
    const { error } = await signUp(form);
    setLoading(false);
    if (error) setErr(error.message || 'Signup failed');
    else setMsg('Check your email to confirm your account.');
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">Create your account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700">Full name</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          {err && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{err}</div>}
          {msg && <div className="rounded-md bg-green-50 p-2 text-sm text-green-700">{msg}</div>}
          <button
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link className="text-blue-700 hover:underline" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
