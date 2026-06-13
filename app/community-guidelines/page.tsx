import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description: 'Community guidelines for MBA Learning Hub — how to be a respectful, productive member of our student learning community.',
  openGraph: {
    title: 'Community Guidelines — MBA Learning Hub',
    description: 'The standards and values that guide our MBA student learning community.',
  },
};

const principles = [
  { icon: '🤝', title: 'Respect Every Student', body: 'Every member of this community is a student working toward their goals. Treat all members with the same respect you would want in return, regardless of their specialization, semester, academic background, or communication style.' },
  { icon: '🎓', title: 'Learn, Share, Grow', body: 'This platform exists to make MBA learning more accessible and effective. Ask questions, share insights, suggest improvements, and support your fellow students. A rising tide lifts all boats.' },
  { icon: '🚫', title: 'Zero Tolerance for Harassment', body: 'Any form of harassment — including but not limited to bullying, threatening language, discriminatory comments based on gender, caste, religion, region, or appearance — will result in immediate account suspension.' },
  { icon: '✅', title: 'Academic Integrity', body: 'Use the platform for genuine learning. Do not use notes or quiz content to gain unfair advantage in assessments where such use violates your institution\'s academic integrity policy. See our full Academic Integrity Policy for details.' },
  { icon: '🔒', title: 'No Content Sharing for Commercial Gain', body: 'The content on this platform is provided for your personal educational use. You may not resell, republish, redistribute, or monetize any content from MBA Learning Hub. Sharing links is welcome; sharing downloaded files for commercial purposes is prohibited.' },
  { icon: '📢', title: 'Constructive Feedback Only', body: 'We welcome suggestions and critiques that help us improve. Please frame all feedback constructively. Reports of abusive feedback submitted to our team will not be acted upon.' },
  { icon: '🔍', title: 'Authentic Participation', body: 'Do not create multiple accounts, impersonate other users or faculty members, or use automated bots to interact with the platform. Each student should have exactly one registered account.' },
  { icon: '💬', title: 'Messaging Etiquette', body: 'When contacting the platform team via the message system, keep communications professional and on-topic. Our team will respond to genuine queries. Spam, solicitation, or inappropriate messaging may result in your account being restricted.' },
];

const violations = [
  'First offence: Warning issued via notification',
  'Second offence: Temporary account suspension (7 days)',
  'Third offence: Permanent account suspension',
  'Severe violations (threats, harassment, illegal content): Immediate permanent suspension without warning',
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Community Guidelines</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Community</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Community Guidelines</h1>
        <p className="text-slate-500 text-sm">Last updated: June 13, 2026</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-sm text-blue-800 leading-relaxed">
        MBA Learning Hub is built by students, for students. These guidelines exist to keep our community a safe,
        respectful, and productive space for every MBA learner. By using this platform, you agree to abide by these principles.
      </div>

      <div className="space-y-4 mb-10">
        {principles.map((p) => (
          <div key={p.title} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">{p.icon}</span>
            <div>
              <h2 className="font-semibold text-slate-900 mb-1 text-base">{p.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-red-800 text-base mb-3">Enforcement & Consequences</h2>
        <p className="text-sm text-red-700 mb-4">
          Violations of these guidelines are taken seriously. Our admin team reviews all reported violations.
          Consequences are applied as follows:
        </p>
        <ul className="space-y-2">
          {violations.map((v) => (
            <li key={v} className="flex items-start gap-2 text-sm text-red-700">
              <span className="mt-0.5">•</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h2 className="font-semibold text-slate-900 mb-2">Reporting a Violation</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          If you witness a violation of these guidelines, please report it using the Report Issue button on any
          page, or contact us directly at{' '}
          <a href="mailto:support@mbalearninghub.in" className="text-blue-600 underline">
            support@mbalearninghub.in
          </a>. All reports are handled confidentially.
        </p>
        <Link
          href="/feedback#report"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          Report an Issue →
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 justify-center">
        {[['Terms', '/terms'], ['Academic Integrity', '/academic-integrity'], ['Contact', '/contact']].map(([l, h]) => (
          <Link key={h} href={h} className="hover:text-slate-600 transition-colors">{l}</Link>
        ))}
      </div>
    </div>
  );
}
