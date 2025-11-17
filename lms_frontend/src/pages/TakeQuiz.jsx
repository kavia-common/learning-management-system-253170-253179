import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Quiz from '../components/Quiz';
import { useAuth } from '../context/AuthContext';
import { getSupabaseClient } from '../supabase/client';

// PUBLIC_INTERFACE
export default function TakeQuiz() {
  /** Loads quiz and stores submission with score */
  const { id } = useParams();
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      // Fetch quiz and questions
      const { data: q } = await supabase.from('quizzes').select('*').eq('course_id', id).single();
      if (!q) return;
      const { data: qs } = await supabase
        .from('quiz_questions')
        .select('id, text, options, correct_index')
        .eq('quiz_id', q.id)
        .order('position', { ascending: true });
      setQuiz({ ...q, questions: qs || [] });
    })();
  }, [id, supabase]);

  const onSubmit = async ({ total, score, percent, answers }) => {
    setResult({ total, score, percent });
    if (!user || !quiz?.id) return;
    await supabase.from('quiz_submissions').insert({
      user_id: user.id,
      quiz_id: quiz.id,
      score,
      total,
      score_percent: percent,
      answers_json: answers,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Course Quiz</h1>
        <p className="text-sm text-gray-600">Answer questions and submit to record your score.</p>
      </div>
      {!quiz ? <div className="text-sm text-gray-600">No quiz found for this course.</div> : <Quiz quiz={quiz} onSubmit={onSubmit} />}
      {result && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-700">
            You scored {result.score} / {result.total} ({result.percent}%)
          </div>
        </div>
      )}
    </div>
  );
}
