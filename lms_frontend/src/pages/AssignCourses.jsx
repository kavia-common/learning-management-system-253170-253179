import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function AssignCourses() {
  /** Assign courses to users by creating enrollment or assignment rows */
  const supabase = getSupabaseClient();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.from('users').select('id, email, full_name').order('email');
      const { data: c } = await supabase.from('courses').select('id, title').order('title');
      setUsers(u || []);
      setCourses(c || []);
    })();
  }, [supabase]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      if (!userId || !courseId) throw new Error('Select both user and course');
      await supabase.from('enrollments').insert({ user_id: userId, course_id: courseId });
      setMsg('Assigned course to user.');
    } catch (e2) {
      setErr(e2?.message || 'Failed to assign course');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Assign Courses</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-700">User</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name ? `${u.full_name} (${u.email})` : u.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Course</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Select</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
        {err && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{err}</div>}
        {msg && <div className="rounded-md bg-green-50 p-2 text-sm text-green-700">{msg}</div>}
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Assign
        </button>
      </form>
    </div>
  );
}
