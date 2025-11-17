import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RoleRoute
 * Restricts access to users with at least one allowed role.
 */
export default function RoleRoute({ children, allowed = [] }) {
  const { user, roles, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const ok = roles.some((r) => allowed.includes(r));
  if (!ok) return <Navigate to="/" replace />;

  return children;
}
