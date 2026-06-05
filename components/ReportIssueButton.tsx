'use client';

import { useState } from 'react';

type IssueType = 'incorrect-concept' | 'broken-download' | 'quiz-mistake' | 'formatting' | 'other';
type PanelState = 'idle' | 'open' | 'submitting' | 'success';

const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: 'incorrect-concept', label: 'Incorrect concept or information' },
  { value: 'broken-download',   label: 'Broken or missing download' },
  { value: 'quiz-mistake',      label: 'Quiz question/answer mistake' },
  { value: 'formatting',        label: 'Formatting or display issue' },
  { value: 'other',             label: 'Other' },
];

interface Props {
  lectureTitle: string;
}

export default function ReportIssueButton({ lectureTitle }: Props) {
  const [state, setState] = useState<PanelState>('idle');
  const [issueType, setIssueType] = useState<IssueType>('incorrect-concept');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe the issue so we can investigate.');
      return;
    }
    setState('submitting');
    setSubmitError('');
    try {
      const res = await fetch('https://formspree.io/f/xwvjvvpz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          lecture: lectureTitle,
          issueType,
          description,
          _subject: `Issue Report: ${lectureTitle}`,
          _source: 'Report Issue Button',
        }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('open');
      setSubmitError('Failed to submit. Please try again.');
    }
  }

  function reset() {
    setState('idle');
    setDescription('');
    setError('');
    setIssueType('incorrect-concept');
  }

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('open')}
        className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 px-3 py-1.5 rounded-lg"
      >
        ⚠️ Report an Issue
      </button>
    );
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
        <span className="text-xl">✅</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-800">Issue Reported — Thank you!</p>
          <p className="text-xs text-emerald-600 mt-0.5">We&apos;ll review and fix it as soon as possible.</p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-emerald-600 hover:text-emerald-800 font-medium shrink-0"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
          ⚠️ Report an Issue
        </p>
        <button
          onClick={reset}
          className="text-xs text-amber-500 hover:text-amber-700 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-amber-600 mb-4">
        Found something wrong in <strong>&quot;{lectureTitle}&quot;</strong>? Let us know so we can fix it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-amber-800 mb-1.5">Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value as IssueType)}
            className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
          >
            {ISSUE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-800 mb-1.5">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setError(''); }}
            placeholder="Describe what's wrong so we can investigate…"
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border text-xs bg-white outline-none resize-none transition-all ${
              error
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                : 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
            }`}
          />
          {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
        </div>

        {submitError && (
          <p className="text-rose-500 text-xs bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-xs"
        >
          {state === 'submitting' ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting…
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  );
}
