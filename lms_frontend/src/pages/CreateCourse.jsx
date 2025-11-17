import React, { useState } from 'react';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function CreateCourse() {
  /** Allows admin/trainer to create a course and upload content files to storage */
  const supabase = getSupabaseClient();
  const [course, setCourse] = useState({ title: '', description: '', level: 'General' });
  const [contentFiles, setContentFiles] = useState([]); // [{file, type}]
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const addFile = (file, type) => {
    if (!file || !type) return;
    setContentFiles((prev) => [...prev, { file, type }]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErr('');
    try {
      const { data: created, error } = await supabase
        .from('courses')
        .insert({ title: course.title, description: course.description, level: course.level })
        .select()
        .single();
      if (error) throw error;

      let position = 1;
      for (const item of contentFiles) {
        const ext = item.file.name.split('.').pop();
        const path = `${created.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const bucket = 'course-media';
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, item.file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (upErr) throw upErr;

        await supabase.from('course_content').insert({
          course_id: created.id,
          title: item.file.name,
          type: item.type,
          bucket,
          storage_path: path,
          position,
        });
        position += 1;
      }

      await supabase.from('courses').update({ content_count: position - 1 }).eq('id', created.id);
      setMsg('Course created successfully.');
      setCourse({ title: '', description: '', level: 'General' });
      setContentFiles([]);
    } catch (e2) {
      setErr(e2?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Create Course</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-700">Title</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Level</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={course.level}
              onChange={(e) => setCourse({ ...course, level: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Description</label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm font-medium text-gray-900">Upload Content</div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-700">Video</label>
              <input type="file" accept="video/*" onChange={(e) => addFile(e.target.files?.[0], 'video')} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700">PDF</label>
              <input type="file" accept="application/pdf" onChange={(e) => addFile(e.target.files?.[0], 'pdf')} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500">Queued items:</div>
            <ul className="text-sm text-gray-700">
              {contentFiles.map((f, i) => (
                <li key={i}>
                  {f.file.name} <span className="text-xs text-gray-500">({f.type})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {err && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{err}</div>}
        {msg && <div className="rounded-md bg-green-50 p-2 text-sm text-green-700">{msg}</div>}

        <button
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}
