import React, { useEffect, useState } from 'react';
import ProgressChart from '../components/ProgressChart';
import { useAuth } from '../context/AuthContext';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard showing enrolled courses and progress */
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: enrolls } = await supabase
        .from('enrollments')
        .select('course:course_id (id, title, description)')
        .eq('user_id', user.id);

      setCourses((enrolls || []).map((e) => e.course));

      // Demo progress data; could be derived from quiz_submissions
      const { data: submissions } = await supabase
        .from('quiz_submissions')
        .select('created_at, score_percent')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      const chart = (submissions || []).map((s, idx) => ({
        label: `S${idx + 1}`,
        percent: Math.round(s.score_percent || 0),
      }));
      setProgress(chart);
    };
    load();
  }, [supabase, user]);

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
          {courses?.length === 0 && <div className="text-sm text-gray-600">No enrollments yet.</div>}
        </ul>
      </div>
    </div>
  );
}
