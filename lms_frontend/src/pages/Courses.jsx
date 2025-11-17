import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function Courses() {
  /** Lists available courses */
  const supabase = getSupabaseClient();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('courses')
        .select('id, title, description, level, content_count');
      setCourses(data || []);
    })();
  }, [supabase]);

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
