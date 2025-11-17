import React, { useEffect, useState } from 'react';
import ProgressChart from '../components/ProgressChart';
import { useAuth } from '../context/AuthContext';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard showing progress and enrollments */
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    // Simple chart data placeholder
    setProgress([
      { label: 'S1', percent: 40 },
      { label: 'S2', percent: 55 },
      { label: 'S3', percent: 72 },
    ]);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!user?.id) {
          setCourses([]);
          return;
        }
        // load enrollments -> join courses
        const { data: enrolls, error } = await supabase
          .from('enrollments')
          .select('course_id');
        if (error || !Array.isArray(enrolls) || enrolls.length === 0) {
          setCourses([]);
          return;
        }
        const ids = enrolls.map((e) => e.course_id);
        const { data: crs } = await supabase
          .from('courses')
          .select('id, title, description')
          .in('id', ids);
        setCourses(Array.isArray(crs) ? crs : []);
      } catch {
        setCourses([]);
      }
    })();
  }, [user, supabase]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Track your learning journey and manage courses.</p>
      </div>
      <ProgressChart data={progress} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Enrolled Courses</h2>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {courses?.map((c) => (
            <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="font-medium text-gray-900">{c.title}</div>
              <div className="text-sm text-gray-600">{c.description}</div>
            </li>
          ))}
          {courses?.length === 0 && <div className="text-sm text-gray-600">No enrollments to show.</div>}
        </ul>
      </div>
    </div>
  );
}
