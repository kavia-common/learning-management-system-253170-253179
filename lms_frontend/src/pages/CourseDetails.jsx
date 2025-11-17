import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import PdfViewer from '../components/PdfViewer';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function CourseDetails() {
  /** Displays course details and content list with playable/viewable media */
  const { id } = useParams();
  const supabase = getSupabaseClient();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [active, setActive] = useState(null);
  const [signedUrl, setSignedUrl] = useState('');

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('courses').select('*').eq('id', id).single();
      setCourse(c || null);
      const { data } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', id)
        .order('position', { ascending: true });
      setContents(data || []);
      if (data?.length) setActive(data[0]);
    })();
  }, [id, supabase]);

  useEffect(() => {
    (async () => {
      if (!active) {
        setSignedUrl('');
        return;
      }
      if (!active.storage_path) {
        setSignedUrl('');
        return;
      }
      // Get signed URL from storage bucket
      const path = active.storage_path;
      const bucket = active.bucket || 'course-media';
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
      setSignedUrl(error ? '' : data?.signedUrl || '');
    })();
  }, [active, supabase]);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-4">
          <h1 className="text-xl font-semibold text-gray-900">{course?.title || 'Course'}</h1>
          <p className="text-sm text-gray-600">{course?.description}</p>
        </div>
        <div className="space-y-4">
          {active?.type === 'video' ? <VideoPlayer url={signedUrl} /> : null}
          {active?.type === 'pdf' ? <PdfViewer url={signedUrl} /> : null}
          {!active && <div className="text-sm text-gray-600">No content available.</div>}
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 text-sm font-medium text-gray-900">Contents</div>
          <ul className="grid gap-2">
            {contents.map((ct) => (
              <li key={ct.id}>
                <button
                  onClick={() => setActive(ct)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    active?.id === ct.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  {ct.title} <span className="text-xs text-gray-500">({ct.type})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 text-sm font-medium text-gray-900">Quiz</div>
          <Link to={`/courses/${id}/quiz`} className="text-sm text-blue-700 hover:underline">
            Take quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
