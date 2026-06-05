import type { Metadata } from 'next';
import RequestForm from './RequestForm';

export const metadata: Metadata = {
  title: 'Request a Subject',
  description: 'Request a new subject to be added to MBA Learning Hub. Tell us what you need and we will prioritise it.',
};

export default function RequestPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          📬 Community Driven
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Request a Subject
        </h1>
        <p className="text-slate-500 leading-relaxed">
          Don&apos;t see what you need? Tell us which subject you&apos;d like added and we&apos;ll
          prioritise it for the next update.
        </p>
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { icon: '⚡', title: 'Fast Review', body: 'Requests reviewed within 48 hours.' },
          { icon: '🆓', title: 'Completely Free', body: 'No signup or payment needed.' },
          { icon: '🎯', title: 'Community First', body: 'Most-requested subjects added first.' },
        ].map((item) => (
          <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-xs font-semibold text-slate-700 mb-1">{item.title}</p>
            <p className="text-xs text-slate-500">{item.body}</p>
          </div>
        ))}
      </div>

      <RequestForm />
    </div>
  );
}
