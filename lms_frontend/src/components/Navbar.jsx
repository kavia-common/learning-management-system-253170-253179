import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with branding and auth actions */
  const { user, signOut, profile } = useAuth();

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
          {!user ? (
            <>
              <Link to="/login" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Login</Link>
              <Link to="/signup" className="rounded-md border border-blue-600 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50">Sign up</Link>
            </>
          ) : (
            <button
              onClick={signOut}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
