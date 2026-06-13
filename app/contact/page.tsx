import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact & Grievance',
  description: 'Contact MBA Learning Hub for support, content requests, grievances, or partnership enquiries.',
  openGraph: {
    title: 'Contact & Grievance — MBA Learning Hub',
    description: 'Get in touch with the MBA Learning Hub team for support, content requests, or grievances.',
  },
};

const contactChannels = [
  {
    icon: '✉',
    title: 'General Support',
    email: 'collabex.market@gmail.com',
    description: 'For account issues, platform bugs, login problems, and general queries.',
    responseTime: 'Within 2 business days',
    color: 'blue',
  },
  {
    icon: '📚',
    title: 'Content & Academic',
    email: 'collabex.market@gmail.com',
    description: 'For content corrections, academic integrity concerns, and lecture requests.',
    responseTime: 'Within 3 business days',
    color: 'violet',
  },
  {
    icon: '⚖',
    title: 'Legal & Compliance',
    email: 'collabex.market@gmail.com',
    description: 'For copyright notices, DMCA takedown requests, and legal enquiries.',
    responseTime: 'Within 5 business days',
    color: 'slate',
  },
  {
    icon: '🤝',
    title: 'Partnerships & Collaborations',
    email: 'collabex.market@gmail.com',
    description: 'For college partnerships, company collaborations, sponsorships, and placement tie-ups.',
    responseTime: 'Within 5 business days',
    color: 'emerald',
  },
];

const faqItems = [
  {
    q: 'How do I report a bug or technical issue?',
    a: 'Use the "Report Issue" button available on every page, or email collabex.market@gmail.com with a description of the issue and your device/browser information.',
  },
  {
    q: 'How do I request a new subject or lecture?',
    a: 'Visit the Request a Subject page or email collabex.market@gmail.com. We consider all student requests and prioritize based on demand and available resources.',
  },
  {
    q: 'I found an error in the notes. What should I do?',
    a: 'Email collabex.market@gmail.com with the lecture name, the incorrect section, and the suggested correction. We review all content feedback within 3 business days.',
  },
  {
    q: 'My account has been suspended. How do I appeal?',
    a: 'Email collabex.market@gmail.com with your registered email address and a brief explanation of the situation. Our Grievance Officer reviews all appeals within 7 business days.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Email collabex.market@gmail.com from your registered email address requesting account deletion. We will process the request within 10 business days and confirm deletion.',
  },
  {
    q: 'I want to contribute content or become a mentor. How?',
    a: 'Email collabex.market@gmail.com with your academic background, area of expertise, and what you would like to contribute. We review all applications individually.',
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Contact</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Support</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Contact & Grievance</h1>
        <p className="text-slate-500 text-sm">We are here to help — Monday to Saturday, 9 AM – 6 PM IST</p>
      </div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {contactChannels.map((c) => (
          <a
            key={c.email}
            href={`mailto:${c.email}`}
            className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm rounded-2xl p-5 transition-all duration-200 block"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{c.icon}</span>
              <h2 className="font-semibold text-slate-900 text-sm">{c.title}</h2>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">{c.description}</p>
            <p className="text-xs font-mono text-blue-700 mb-1">{c.email}</p>
            <p className="text-[11px] text-slate-400">Response: {c.responseTime}</p>
          </a>
        ))}
      </div>

      {/* Grievance Officer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚖</span>
          <div>
            <h2 className="font-semibold text-amber-900 mb-1">Grievance Officer</h2>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              As required under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021,
              MBA Learning Hub has designated a Grievance Officer to address complaints regarding content and user experience.
            </p>
            <div className="text-sm text-amber-800">
              <p><strong>Name:</strong> MBA Learning Hub Support Team</p>
              <p><strong>Email:</strong>{' '}
                <a href="mailto:collabex.market@gmail.com" className="underline">
                  collabex.market@gmail.com
                </a>
              </p>
              <p><strong>Resolution Time:</strong> Within 30 days of receipt</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.q} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">{item.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform links */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h2 className="font-semibold text-slate-900 mb-3 text-sm">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            ✉ Submit Feedback
          </Link>
          <Link
            href="/request"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📚 Request a Subject
          </Link>
          <Link
            href="/feedback#report"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            🚩 Report an Issue
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 justify-center">
        {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Refund Policy', '/refund'], ['Disclaimer', '/disclaimer']].map(([l, h]) => (
          <Link key={h} href={h} className="hover:text-slate-600 transition-colors">{l}</Link>
        ))}
      </div>
    </div>
  );
}
