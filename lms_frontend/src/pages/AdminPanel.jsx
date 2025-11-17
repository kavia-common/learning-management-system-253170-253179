import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function AdminPanel() {
  /** Admin panel hub for course and quiz management */
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-600">Manage courses, quizzes, and assignments.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/create-course" className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow">
          <div className="text-md font-medium text-gray-900">Create Course</div>
          <div className="text-sm text-gray-600">Add a new course with details and content.</div>
        </Link>
        <Link to="/admin/create-quiz" className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow">
          <div className="text-md font-medium text-gray-900">Create Quiz</div>
          <div className="text-sm text-gray-600">Build quizzes for your courses.</div>
        </Link>
        <Link to="/admin/assign-courses" className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow">
          <div className="text-md font-medium text-gray-900">Assign Courses</div>
          <div className="text-sm text-gray-600">Assign courses to users or groups.</div>
        </Link>
      </div>
    </div>
  );
}
