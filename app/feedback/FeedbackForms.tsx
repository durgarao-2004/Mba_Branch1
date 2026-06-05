'use client';

import { useState } from 'react';

type Tab = 'general' | 'report' | 'feature';
type FormState = 'idle' | 'submitting' | 'success';
type FeedbackType = 'improvement' | 'issue' | 'feature' | 'general';
type IssueType = 'incorrect-concept' | 'broken-download' | 'quiz-mistake' | 'formatting' | 'other';

/* ─── General Feedback Form ─────────────────────────────── */

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'improvement', label: 'Suggest Improvement', icon: '💡' },
  { value: 'issue',       label: 'Report Issue',        icon: '⚠️' },
  { value: 'feature',     label: 'Request Feature',     icon: '✨' },
  { value: 'general',     label: 'General Feedback',    icon: '💬' },
];

function GeneralFeedbackForm() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>('idle');
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const e: Record<string, string> = {};
    if (!subject.trim()) e.subject = 'Subject is required.';
    if (!message.trim()) e.message = 'Please enter your feedback.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState('submitting');
    setSubmitError('');
    try {
      const res = await fetch('https://formspree.io/f/xwvjvvpz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name || 'Anonymous',
          subject,
          type,
          message,
          _subject: `Feedback [${type}]: ${subject}`,
          _source: 'Feedback Page',
        }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('idle');
      setSubmitError('Failed to send. Please try again.');
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-bold text-slate-900 text-xl mb-2">Thank you!</h3>
        <p className="text-slate-500 text-sm mb-2">
          Your feedback has been submitted successfully.
        </p>
        <p className="text-slate-400 text-xs mb-6">
          Every message is reviewed and used to improve the platform.
        </p>
        <button
          onClick={() => { setState('idle'); setName(''); setSubject(''); setMessage(''); setType('general'); }}
          className="btn-primary"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: '' })); }}
            placeholder="e.g. Financial Management, quiz, design…"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 ${
              errors.subject ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.subject && <p className="text-rose-500 text-xs mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Feedback Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEEDBACK_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-xs font-medium transition-all duration-150 ${
                type === t.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="leading-tight text-center">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your Feedback <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
          placeholder="Share your thoughts, ideas, or concerns. Every piece of feedback is valuable…"
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 resize-none ${
            errors.message ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
          }`}
        />
        {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {submitError && (
        <p className="text-rose-500 text-xs text-center bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
      >
        {state === 'submitting' ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending…
          </>
        ) : (
          '💬 Send Feedback'
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        No account needed. Your feedback is treated confidentially.
      </p>
    </form>
  );
}

/* ─── Report Issue Form ─────────────────────────────────── */

const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: 'incorrect-concept', label: 'Incorrect concept or information' },
  { value: 'broken-download',   label: 'Broken or missing download' },
  { value: 'quiz-mistake',      label: 'Quiz question/answer mistake' },
  { value: 'formatting',        label: 'Formatting or display issue' },
  { value: 'other',             label: 'Other' },
];

function ReportIssueForm() {
  const [lecture, setLecture] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('incorrect-concept');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>('idle');
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = 'Please describe the issue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState('submitting');
    setSubmitError('');
    try {
      const res = await fetch('https://formspree.io/f/xwvjvvpz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          lecture: lecture || 'Not specified',
          issueType,
          description,
          _subject: `Issue Report${lecture ? `: ${lecture}` : ''}`,
          _source: 'Feedback Page — Report Issue',
        }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('idle');
      setSubmitError('Failed to submit. Please try again.');
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-bold text-slate-900 text-xl mb-2">Issue Reported!</h3>
        <p className="text-slate-500 text-sm mb-6">
          We&apos;ll investigate and fix it as soon as possible. Thank you for helping improve the platform.
        </p>
        <button
          onClick={() => { setState('idle'); setLecture(''); setDescription(''); setIssueType('incorrect-concept'); }}
          className="btn-primary"
        >
          Report Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Lecture / Page <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          value={lecture}
          onChange={(e) => setLecture(e.target.value)}
          placeholder="e.g. Introduction to Financial Management, Quiz page…"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-slate-50"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Type</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {ISSUE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setIssueType(t.value)}
              className={`text-left px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                issueType === t.value
                  ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Describe the Issue <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
          placeholder="Describe what's wrong so we can investigate and fix it quickly…"
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 resize-none ${
            errors.description ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
          }`}
        />
        {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {submitError && (
        <p className="text-rose-500 text-xs text-center bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:bg-amber-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
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
          '⚠️ Submit Report'
        )}
      </button>
    </form>
  );
}

/* ─── Feature Request Form ──────────────────────────────── */

function FeatureRequestForm() {
  const [feature, setFeature] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>('idle');
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const e: Record<string, string> = {};
    if (!feature.trim()) e.feature = 'Please name the feature you want.';
    if (!reason.trim()) e.reason = 'Please tell us why this would help.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState('submitting');
    setSubmitError('');
    try {
      const res = await fetch('https://formspree.io/f/xwvjvvpz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          feature,
          reason,
          _subject: `Feature Request: ${feature}`,
          _source: 'Feedback Page — Feature Request',
        }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('idle');
      setSubmitError('Failed to submit. Please try again.');
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="font-bold text-slate-900 text-xl mb-2">Feature Requested!</h3>
        <p className="text-slate-500 text-sm mb-6">
          Great idea! We&apos;ll add it to our product roadmap and prioritize based on demand.
        </p>
        <button
          onClick={() => { setState('idle'); setFeature(''); setReason(''); }}
          className="btn-primary"
        >
          Request Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Feature Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={feature}
          onChange={(e) => { setFeature(e.target.value); setErrors((p) => ({ ...p, feature: '' })); }}
          placeholder="e.g. Dark mode, flashcard mode, progress tracking…"
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 ${
            errors.feature ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
          }`}
        />
        {errors.feature && <p className="text-rose-500 text-xs mt-1">{errors.feature}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Why would this help? <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => { setReason(e.target.value); setErrors((p) => ({ ...p, reason: '' })); }}
          placeholder="Explain how this feature would improve your learning experience…"
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50 resize-none ${
            errors.reason ? 'border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
          }`}
        />
        {errors.reason && <p className="text-rose-500 text-xs mt-1">{errors.reason}</p>}
      </div>

      {submitError && (
        <p className="text-rose-500 text-xs text-center bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
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
          '✨ Submit Feature Request'
        )}
      </button>
    </form>
  );
}

/* ─── Tabbed container ──────────────────────────────────── */

const TABS: { id: Tab; label: string; icon: string; color: string }[] = [
  { id: 'general', label: 'General Feedback', icon: '💬', color: 'blue' },
  { id: 'report',  label: 'Report Issue',     icon: '⚠️', color: 'amber' },
  { id: 'feature', label: 'Feature Request',  icon: '✨', color: 'violet' },
];

const TAB_ACTIVE: Record<Tab, string> = {
  general: 'border-blue-500 bg-blue-50 text-blue-700',
  report:  'border-amber-500 bg-amber-50 text-amber-700',
  feature: 'border-violet-500 bg-violet-50 text-violet-700',
};

export default function FeedbackForms() {
  const [tab, setTab] = useState<Tab>('general');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex-1 justify-center ${
              tab === t.id
                ? TAB_ACTIVE[t.id] + ' border-b-2'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form area */}
      <div className="p-6 sm:p-8">
        {tab === 'general' && <GeneralFeedbackForm />}
        {tab === 'report'  && <ReportIssueForm />}
        {tab === 'feature' && <FeatureRequestForm />}
      </div>
    </div>
  );
}
