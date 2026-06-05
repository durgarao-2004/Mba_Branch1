import type { Metadata } from 'next';
import Link from 'next/link';
import RequestForm from './RequestForm';

export const metadata: Metadata = {
  title: 'Request a Subject',
  description: 'Request a new subject to be added to MBA Learning Hub. Tell us what you need and we will prioritise it.',
};

const FEATURE_CARDS = [
  {
    icon: '⚡',
    title: 'Fast Review',
    body: 'All requests are reviewed within 48 hours by our team.',
    bg: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '🆓',
    title: 'Always Free',
    body: 'No signup, no payment, no hassle. Just request and wait.',
    bg: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: '🎯',
    title: 'Community First',
    body: 'Most-requested subjects are added first. Your vote counts.',
    bg: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
];

const TRENDING = [
  'Operations Management',
  'Business Statistics',
  'Human Resource Management',
  'Strategic Management',
  'Supply Chain Management',
  'Business Ethics',
];

export default function RequestPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          📬 Community Driven
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Want Another Subject Added?
        </h1>
        <p className="text-slate-500 leading-relaxed max-w-xl mx-auto text-base">
          Don&apos;t see what you need? Tell us which subject you&apos;d like and we&apos;ll
          prioritize it for the next update — most-requested topics added first.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {FEATURE_CARDS.map((c) => (
          <div
            key={c.title}
            className={`${c.bg} border rounded-2xl p-5 flex items-start gap-4 shadow-sm`}
          >
            <div className={`${c.iconBg} w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
              {c.icon}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">{c.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-10">

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-slate-900 text-lg mb-1">Submit Your Request</h2>
            <p className="text-sm text-slate-500 mb-6">
              Fill in the details below and we&apos;ll review your request shortly.
            </p>
            <RequestForm />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 mt-8 lg:mt-0 space-y-5">

          {/* Trending */}
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              🔥 Trending Requests
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              These subjects have the most community demand right now.
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((s) => (
                <span
                  key={s}
                  className="bg-white border border-violet-200 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">How it works</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Submit your subject request below.' },
                { step: '2', text: 'We review based on difficulty and demand within 48h.' },
                { step: '3', text: 'High-demand subjects get added in the next update.' },
                { step: '4', text: 'You get structured notes, quiz, and downloads.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback CTA */}
          <Link
            href="/feedback"
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-sm rounded-2xl p-4 transition-all duration-200 group"
          >
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-blue-200 transition-colors">
              💬
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-xs">Have general feedback?</p>
              <p className="text-xs text-slate-500 mt-0.5">Visit our feedback page →</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
