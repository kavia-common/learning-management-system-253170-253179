import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import PdfViewer from '../components/PdfViewer';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function CourseDetails() {
  /** Displays course details and content list with playable/viewable media (mocked) */
  const { id } = useParams();
  getSupabaseClient(); // ensure stub init
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [active, setActive] = useState(null);
  const [signedUrl, setSignedUrl] = useState('');

  useEffect(() => {
    // Mock course and content
    const mockCourse = { id, title: 'Ocean LMS 101', description: 'A starter course to explore the LMS.' };
    const mockContents = [
      { id: 'ct1', course_id: id, title: 'Welcome Video', type: 'video' },
      { id: 'ct2', course_id: id, title: 'Introduction PDF', type: 'pdf' },
    ];
    setCourse(mockCourse);
    setContents(mockContents);
    setActive(mockContents[0] || null);
  }, [id]);

  useEffect(() => {
    // No storage; use empty strings or example public URLs if needed
    if (!active) {
      setSignedUrl('');
      return;
    }
    if (active.type === 'video') {
      setSignedUrl(''); // could place a public demo URL if available
    } else if (active.type === 'pdf') {
      setSignedUrl('');
    } else {
      setSignedUrl('');
    }
  }, [active]);

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
          {(active?.type === 'video' || active?.type === 'pdf') && (
            <div className="text-xs text-gray-500">Content preview disabled in demo mode.</div>
          )}
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
