import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function Courses() {
  /** Lists available courses (mocked in demo mode) */
  getSupabaseClient(); // ensure stub init for consistency
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Mocked dataset
    const mock = [
      { id: 'c1', title: 'Ocean LMS 101', description: 'A starter course to explore the LMS.', level: 'Beginner', content_count: 2 },
      { id: 'c2', title: 'Advanced Topics', description: 'Dive deeper into LMS features.', level: 'Advanced', content_count: 0 },
    ];
    setCourses(mock);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Courses</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}
