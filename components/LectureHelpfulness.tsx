'use client';

import { useState } from 'react';

type Rating = 'helpful' | 'average' | 'needs-improvement';

const RATINGS: { value: Rating; emoji: string; label: string; activeClass: string }[] = [
  {
    value: 'helpful',
    emoji: '👍',
    label: 'Helpful',
    activeClass: 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-emerald-100 shadow-md',
  },
  {
    value: 'average',
    emoji: '😐',
    label: 'Average',
    activeClass: 'border-amber-400 bg-amber-50 text-amber-700 shadow-amber-100 shadow-md',
  },
  {
    value: 'needs-improvement',
    emoji: '👎',
    label: 'Needs Improvement',
    activeClass: 'border-rose-400 bg-rose-50 text-rose-700 shadow-rose-100 shadow-md',
  },
];

export default function LectureHelpfulness() {
  const [selected, setSelected] = useState<Rating | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSelect(rating: Rating) {
    if (done || submitting) return;
    setSelected(rating);
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('https://formspree.io/f/xwvjvvpz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          rating,
          _subject: `Lecture Helpfulness: ${rating}`,
          _source: 'Lecture Helpfulness Widget',
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setSelected(null);
      setSubmitError('Could not submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
      {done ? (
        <div className="py-2 animate-fade-in">
          <div className="text-4xl mb-3">🙏</div>
          <p className="font-bold text-slate-900 text-base mb-1">Thank you for your feedback!</p>
          <p className="text-sm text-slate-500">Your rating helps us improve the quality of this lecture.</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-1">Was this lecture helpful?</p>
          <p className="text-xs text-slate-400 mb-5">
            Your feedback helps improve revision material for all students
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => handleSelect(r.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selected === r.value
                    ? r.activeClass
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
          {submitError && (
            <p className="text-rose-500 text-xs mt-3">{submitError}</p>
          )}
          <p className="text-xs text-slate-400 mt-4">
            Help improve lecture quality — takes just one click
          </p>
        </>
      )}
    </div>
  );
}
