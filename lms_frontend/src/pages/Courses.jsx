import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function Courses() {
  /** Lists available courses (fetch from Supabase when configured) */
  const supabase = getSupabaseClient();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, level, content_count')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      } catch {
        setCourses([]);
      }
    })();
  }, [supabase]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Courses</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        {courses.length === 0 && (
          <div className="text-sm text-gray-600">
            No courses found or Supabase not configured.
          </div>
        )}
      </div>
    </div>
  );
}
