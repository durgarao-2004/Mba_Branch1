import type { Metadata } from 'next';
import Link from 'next/link';
import FeedbackForms from './FeedbackForms';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share your feedback, report issues, or request new features for MBA Learning Hub. Your voice shapes the platform.',
};

const PHILOSOPHY = [
  {
    icon: '🎓',
    title: 'Student-First',
    body: 'Every decision we make is guided by what helps students learn better. Your feedback directly influences what we build next.',
  },
  {
    icon: '🔄',
    title: 'Continuous Improvement',
    body: 'We review every piece of feedback and use it to improve lectures, fix issues, and add features that actually matter.',
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    body: 'This platform exists because of students like you. Your ideas and reports make it better for everyone.',
  },
];

export default function FeedbackPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Hero */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          💬 Student Feedback Loop
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Help Us Build a Better Platform
        </h1>
        <p className="text-slate-500 leading-relaxed max-w-2xl text-base">
          Your feedback is the most valuable signal we have. Whether it&apos;s a correction, a suggestion,
          or a feature you wish existed — we want to hear it.
        </p>
      </div>

      {/* Philosophy cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {PHILOSOPHY.map((p) => (
          <div
            key={p.title}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-3xl mb-3">{p.icon}</div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">{p.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Forms */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Share Your Thoughts</h2>
          <p className="text-sm text-slate-500">
            Use the tabs below to submit feedback, report an issue, or request a feature.
          </p>
        </div>
        <FeedbackForms />
      </div>

      {/* What happens next */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-12">
        <h2 className="font-bold text-slate-900 text-lg mb-5 flex items-center gap-2">
          📬 What happens after you submit?
        </h2>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Your feedback is received and reviewed by our team within 48 hours.' },
            { step: '2', text: 'Issues are triaged by severity — critical errors are fixed first.' },
            { step: '3', text: 'Feature requests are added to our roadmap based on community demand.' },
            { step: '4', text: 'Improvements are released in the next platform update.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {s.step}
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/request"
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-violet-200 transition-colors">
            📬
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Request a Subject</p>
            <p className="text-xs text-slate-500 mt-0.5">Don&apos;t see your subject? Ask us to add it.</p>
          </div>
        </Link>

        <Link
          href="/subjects"
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-blue-200 transition-colors">
            📚
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Browse Subjects</p>
            <p className="text-xs text-slate-500 mt-0.5">Explore all available lecture notes.</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
