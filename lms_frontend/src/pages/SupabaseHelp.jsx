import React from 'react';
import { hasSupabaseEnv } from '../supabase/client';

/**
 * PUBLIC_INTERFACE
 * SupabaseHelp
 * A simple diagnostic page to explain environment variables needed and current detection status.
 */
export default function SupabaseHelp() {
  const envPresent = hasSupabaseEnv();
  const url = import.meta.env.VITE_SUPABASE_URL;
  const keySet = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-xl font-semibold text-gray-900">Supabase Configuration Help</h1>
      <p className="text-sm text-gray-600">
        The LMS uses Supabase for authentication, database, and storage. Ensure the environment variables are set in your .env file.
      </p>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
        <div className="font-medium text-gray-900 mb-1">Current detection</div>
        <ul className="list-disc pl-5 text-gray-700">
          <li>VITE_SUPABASE_URL: {url ? <span className="text-green-700">set</span> : <span className="text-red-600">missing</span>}</li>
          <li>VITE_SUPABASE_ANON_KEY: {keySet ? <span className="text-green-700">set</span> : <span className="text-red-600">missing</span>}</li>
          <li>Overall status: {envPresent ? <span className="text-green-700">OK</span> : <span className="text-red-600">Not configured</span>}</li>
        </ul>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="font-medium text-gray-900">Required .env values</div>
        <pre className="rounded-md bg-gray-100 p-3 overflow-auto">
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FRONTEND_URL=http://localhost:3000
        </pre>
        <div>
          After updating .env, restart the dev server so Vite picks up the changes. If the endpoint is unreachable, check your network and the Supabase project URL.
        </div>
      </div>
    </div>
  );
}
