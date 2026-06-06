'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const SUBJECTS = [
  'Financial Management',
  'Managerial Economics',
  'Marketing Management',
  'Organizational Behavior',
  'Information Systems',
  'Data Science',
  'Other',
];

export default function CaseStudySubmitForm() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [company, setCompany] = useState('');
  const [problem, setProblem] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (!subject) e.subject = 'Please select a subject.';
    if (!topic.trim()) e.topic = 'Topic is required.';
    if (!company.trim()) e.company = 'Company / Business name is required.';
    if (!problem.trim()) e.problem = 'Please describe the business problem or idea.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState('submitting');
    try {
      const res = await fetch('https://formspree.io/f/mkoaovae', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name || 'Anonymous',
          subject,
          topic,
          company,
          problem,
          _subject: `Case Study Idea: ${topic} — ${company}`,
          _source: 'Case Study Hub',
        }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('error');
    }
  }

  function reset() {
    setName(''); setSubject(''); setTopic(''); setCompany(''); setProblem('');
    setErrors({}); setState('idle');
  }

  if (state === 'success') {
    return (
      <div className="text-center py-14 px-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
          🎓
        </div>
        <h3 className="font-bold text-slate-900 text-xl mb-2">Thank you!</h3>
        <p className="text-slate-600 text-sm mb-1 max-w-sm mx-auto">
          Your case study idea has been received.
        </p>
        <p className="text-slate-400 text-xs mb-7 max-w-sm mx-auto">
          Our team will review and may feature it as a curated classroom case study on this hub.
        </p>
        <button onClick={reset} className="btn-primary">
          Submit Another Idea
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Row: Name + Subject */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Your Name <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Subject <span className="text-rose-500">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: '' })); }}
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 ${
              errors.subject
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
            }`}
          >
            <option value="">Select a subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.subject && <p className="text-rose-500 text-xs mt-1">{errors.subject}</p>}
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Case Study Topic <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setErrors((p) => ({ ...p, topic: '' })); }}
          placeholder="e.g. Tesla investment expansion decision, Zomato pricing strategy…"
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 ${
            errors.topic
              ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }`}
        />
        {errors.topic && <p className="text-rose-500 text-xs mt-1">{errors.topic}</p>}
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Company / Business Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: '' })); }}
          placeholder="e.g. Amul, Infosys, Reliance, Tesla, Zomato…"
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 ${
            errors.company
              ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }`}
        />
        {errors.company && <p className="text-rose-500 text-xs mt-1">{errors.company}</p>}
      </div>

      {/* Problem / Idea */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Business Problem / Idea <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={problem}
          onChange={(e) => { setProblem(e.target.value); setErrors((p) => ({ ...p, problem: '' })); }}
          placeholder="Describe the business problem, management challenge, or idea you'd like explored as a case study. e.g. Amul cooperative business model and its supply chain efficiency…"
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 resize-none ${
            errors.problem
              ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }`}
        />
        {errors.problem && <p className="text-rose-500 text-xs mt-1">{errors.problem}</p>}
      </div>

      {state === 'error' && (
        <p className="text-rose-500 text-xs text-center bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          Something went wrong. Please check your connection and try again.
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
      >
        {state === 'submitting' ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting…
          </>
        ) : (
          '📝 Submit Case Study Idea'
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        No account needed. Ideas are reviewed manually and published by the platform team.
      </p>
    </form>
  );
}
