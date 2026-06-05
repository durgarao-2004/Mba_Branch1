'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success';

interface FormData {
  subject: string;
  reason: string;
  notes: string;
  email: string;
}

const EMPTY: FormData = { subject: '', reason: '', notes: '', email: '' };

/*
  To wire up a real backend, replace handleSubmit with a fetch to Formspree:

  const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
*/

export default function RequestForm() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function set(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!data.subject.trim()) e.subject = 'Subject name is required.';
    if (!data.reason.trim()) e.reason = 'Please tell us why you need this subject.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormState('submitting');
    // Simulate a short delay (replace with real fetch in production)
    await new Promise((r) => setTimeout(r, 900));
    setFormState('success');
  }

  function reset() {
    setData(EMPTY);
    setErrors({});
    setFormState('idle');
  }

  if (formState === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-emerald-800 mb-2">Request Submitted!</h2>
        <p className="text-emerald-700 text-sm mb-1">
          We&apos;ve received your request for <strong>&quot;{data.subject}&quot;</strong>.
        </p>
        <p className="text-emerald-600 text-sm mb-6">
          We&apos;ll review it within 48 hours and prioritise based on community demand.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Subject name */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Subject Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="subject"
          type="text"
          value={data.subject}
          onChange={(e) => set('subject', e.target.value)}
          placeholder="e.g. Operations Management, Business Statistics…"
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-150 bg-white
            ${errors.subject
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
            }`}
        />
        {errors.subject && (
          <p className="text-rose-600 text-xs mt-1.5">{errors.subject}</p>
        )}
      </div>

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Why do you need this? <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="reason"
          value={data.reason}
          onChange={(e) => set('reason', e.target.value)}
          placeholder="Tell us your programme, semester, and why this subject matters for your studies…"
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-150 bg-white resize-none
            ${errors.reason
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
            }`}
        />
        {errors.reason && (
          <p className="text-rose-600 text-xs mt-1.5">{errors.reason}</p>
        )}
      </div>

      {/* Optional notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Any specific topics or chapters?{' '}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="e.g. Focus on EOQ model, Lean Six Sigma, Linear Programming…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 bg-white resize-none"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your email{' '}
          <span className="font-normal text-slate-400">(optional — to notify you when added)</span>
        </label>
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="student@university.edu"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 bg-white"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition-colors duration-150 text-sm"
      >
        {formState === 'submitting' ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Submitting…
          </>
        ) : (
          '✉ Submit Request'
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        No account needed. We use your information only to respond to this request.
      </p>
    </form>
  );
}
