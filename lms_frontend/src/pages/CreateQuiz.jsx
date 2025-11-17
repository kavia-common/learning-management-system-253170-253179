import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function CreateQuiz() {
  /** Build and save a quiz with MCQs for a course */
  const supabase = getSupabaseClient();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correct_index: 0 },
  ]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('courses').select('id, title').order('title');
      setCourses(data || []);
    })();
  }, [supabase]);

  const addQuestion = () => setQuestions((q) => [...q, { text: '', options: ['', '', '', ''], correct_index: 0 }]);

  const updateQ = (idx, patch) => {
    setQuestions((q) => q.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const updateOpt = (qIdx, oIdx, value) => {
    setQuestions((q) =>
      q.map((it, i) =>
        i === qIdx ? { ...it, options: it.options.map((o, oi) => (oi === oIdx ? value : o)) } : it
      )
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      if (!courseId) throw new Error('Select a course');
      const { data: qz, error } = await supabase
        .from('quizzes')
        .insert({ course_id: courseId, title })
        .select()
        .single();
      if (error) throw error;

      let position = 1;
      for (const q of questions) {
        await supabase.from('quiz_questions').insert({
          quiz_id: qz.id,
          position,
          text: q.text,
          options: q.options,
          correct_index: q.correct_index,
        });
        position += 1;
      }
      setMsg('Quiz created.');
      setCourseId('');
      setTitle('');
      setQuestions([{ text: '', options: ['', '', '', ''], correct_index: 0 }]);
    } catch (e2) {
      setErr(e2?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Create Quiz</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
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
          <div>
            <label className="mb-1 block text-sm text-gray-700">Quiz Title</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, qi) => (
            <div key={qi} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-2 text-sm font-medium text-gray-900">Question {qi + 1}</div>
              <input
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQ(qi, { text: e.target.value })}
                required
              />
              <div className="grid gap-2 md:grid-cols-2">
                {q.options.map((o, oi) => (
                  <input
                    key={oi}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder={`Option ${oi + 1}`}
                    value={o}
                    onChange={(e) => updateOpt(qi, oi, e.target.value)}
                    required
                  />
                ))}
              </div>
              <div className="mt-2">
                <label className="mb-1 block text-sm text-gray-700">Correct option index (0-3)</label>
                <input
                  type="number"
                  min={0}
                  max={3}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={q.correct_index}
                  onChange={(e) => updateQ(qi, { correct_index: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {err && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{err}</div>}
        {msg && <div className="rounded-md bg-green-50 p-2 text-sm text-green-700">{msg}</div>}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addQuestion}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
