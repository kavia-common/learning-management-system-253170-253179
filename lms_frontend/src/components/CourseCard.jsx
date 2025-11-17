import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CourseCard({ course }) {
  /** Displays course summary card */
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{course.title}</h3>
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{course.level || 'General'}</span>
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{course.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{course.content_count || 0} items</span>
        <Link
          to={`/courses/${course.id}`}
          className="text-sm text-blue-700 hover:underline"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
