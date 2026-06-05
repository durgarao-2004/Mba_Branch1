'use client';

import { useState } from 'react';

type FeedbackType = 'improvement' | 'issue' | 'feature' | 'general';
type FormState = 'idle' | 'submitting' | 'success';

interface FeedbackData {
  name: string;
  subject: string;
  type: FeedbackType;
  message: string;
}

const EMPTY: FeedbackData = { name: '', subject: '', type: 'general', message: '' };

const TYPES: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'improvement', label: 'Suggest Improvement', icon: '💡' },
  { value: 'issue',       label: 'Report Issue',        icon: '⚠️' },
  { value: 'feature',     label: 'Request Feature',     icon: '✨' },
  { value: 'general',     label: 'General Feedback',    icon: '💬' },
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<FeedbackData>(EMPTY);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackData, string>>>({});

  function set(field: keyof FeedbackData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FeedbackData, string>> = {};
    if (!data.subject.trim()) e.subject = 'Subject is required.';
    if (!data.message.trim()) e.message = 'Please enter your feedback.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormState('submitting');
    await new Promise((r) => setTimeout(r, 900));
    setFormState('success');
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setData(EMPTY);
      setErrors({});
      setFormState('idle');
    }, 300);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
        aria-label="Open feedback"
      >
        <span className="text-base leading-none">💬</span>
        <span>Feedback</span>
      </button>

      {/* Backdrop + Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Share Your Feedback</h2>
                <p className="text-xs text-slate-500 mt-0.5">Help us improve the platform for every student</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5">
              {formState === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Thank you!</h3>
                  <p className="text-slate-500 text-sm mb-1">
                    Your feedback helps us build a better learning experience.
                  </p>
                  <p className="text-slate-400 text-xs mb-6">
                    Every suggestion is reviewed and considered for future updates.
                  </p>
                  <button onClick={handleClose} className="btn-primary">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Name <span className="font-normal text-slate-400 normal-case">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Anonymous"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.subject}
                      onChange={(e) => set('subject', e.target.value)}
                      placeholder="e.g. Financial Management, quiz, navigation…"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-slate-50 ${
                        errors.subject
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                          : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-rose-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Feedback type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                      Feedback Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => set('type', t.value)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 text-left ${
                            data.type === t.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">{t.icon}</span>
                          <span className="leading-tight">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Your Feedback <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={data.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="Tell us what you think — suggestions, issues, or ideas are all welcome…"
                      rows={4}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-slate-50 resize-none ${
                        errors.message
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                          : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-rose-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    {formState === 'submitting' ? (
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
                    Your feedback is confidential and helps improve this platform.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
