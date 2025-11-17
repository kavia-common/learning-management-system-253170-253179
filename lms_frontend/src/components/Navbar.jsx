import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with branding and dynamic env notice */
  const { user, profile, supabaseReady } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700" />
          <span className="font-semibold text-gray-900">Ocean LMS</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/courses" className="text-sm text-gray-700 hover:text-blue-600">Courses</Link>
          {user && (
            <Link to="/dashboard" className="text-sm text-gray-700 hover:text-blue-600">Dashboard</Link>
          )}
          {profile?.role === 'admin' || profile?.role === 'trainer' ? (
            <Link to="/admin" className="text-sm text-gray-700 hover:text-blue-600">Admin</Link>
          ) : null}
          {!supabaseReady && (
            <span className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs text-yellow-800">
              Supabase not configured
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
