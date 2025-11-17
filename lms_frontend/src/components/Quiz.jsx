import React, { useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function Quiz({ quiz, onSubmit }) {
  /**
   * Render a quiz with MCQ items and compute score.
   * quiz: { id, title, questions: [{ id, text, options: string[], correct_index }] }
   */
  const [answers, setAnswers] = useState({});
  const qList = useMemo(() => quiz?.questions || [], [quiz]);

  const handleChange = (qid, idx) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = qList.length;
    let score = 0;
    qList.forEach((q) => {
      if (answers[q.id] === q.correct_index) score += 1;
    });
    const percent = total ? Math.round((score / total) * 100) : 0;
    onSubmit?.({ total, score, percent, answers });
  };

  if (!quiz) return <div className="text-sm text-gray-500">No quiz available.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{quiz.title || 'Quiz'}</h2>
      {qList.map((q, idx) => (
        <div key={q.id} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm font-medium text-gray-900">Q{idx + 1}. {q.text}</div>
          <div className="grid gap-2">
            {q.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  checked={answers[q.id] === i}
                  onChange={() => handleChange(q.id, i)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
