import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar navigation for the main app layout */
  const { profile } = useAuth();
  const isAdminLike = ['admin', 'trainer'].includes(profile?.role);

  const linkCls = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm transition ${
      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-4 md:block">
      <div className="mb-4">
        <div className="text-xs uppercase text-gray-400">Navigation</div>
      </div>
      <nav className="flex flex-col gap-1">
        <NavLink to="/" className={linkCls}>Home</NavLink>
        <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
        <NavLink to="/courses" className={linkCls}>Courses</NavLink>
        {isAdminLike && (
          <>
            <div className="mt-4 text-xs uppercase text-gray-400">Admin</div>
            <NavLink to="/admin" className={linkCls}>Admin Panel</NavLink>
            <NavLink to="/admin/create-course" className={linkCls}>Create Course</NavLink>
            <NavLink to="/admin/create-quiz" className={linkCls}>Create Quiz</NavLink>
            <NavLink to="/admin/assign-courses" className={linkCls}>Assign Courses</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
