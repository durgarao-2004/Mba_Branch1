import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for MBA Learning Hub — how we handle your data on this educational platform.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: June 5, 2026</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🔒</span>
          <div className="text-sm text-emerald-800 leading-relaxed">
            <strong>Short version:</strong> MBA Learning Hub is a static educational platform. We do not
            collect personal data through the platform itself, require login, or store user
            information. The only data we may receive is what you voluntarily submit via the
            subject request form.
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {[
          {
            title: '1. Who We Are',
            body: 'MBA Learning Hub is a free, student-led educational platform providing MBA learning resources. We are not a registered company and do not operate commercially. This privacy policy explains our approach to any data that may be processed through use of this platform.',
          },
          {
            title: '2. Data We Do Not Collect',
            body: 'MBA Learning Hub does not require user accounts, registration, or login. We do not track individual user behaviour, maintain user profiles, collect payment information, use advertising cookies, sell user data to third parties, or store browsing history.',
          },
          {
            title: '3. Data from Subject Requests',
            body: 'When you submit a subject request, you voluntarily provide: (a) Subject name and description — used to create new content. (b) Reason/context — used to prioritise content development. (c) Email address (optional) — used only to notify you when your requested content is published. This data is not shared with third parties, not used for marketing, and retained only as long as necessary to fulfil the request.',
          },
          {
            title: '4. Analytics',
            body: 'We may use privacy-respecting, cookie-free analytics (such as Vercel Analytics or Plausible) to understand aggregate traffic — e.g. which subjects are most visited. These tools do not collect personally identifiable information, do not use cookies, and are GDPR compliant. No individual user is tracked or profiled.',
          },
          {
            title: '5. Third-Party Services',
            body: 'The platform is hosted on Vercel, which may collect standard server logs (IP address, request timestamps) as part of normal hosting operations. This is governed by Vercel\'s own privacy policy. Google Fonts is used for typography; font files are loaded via Google\'s CDN, which may log request metadata per Google\'s privacy policy.',
          },
          {
            title: '6. Cookies',
            body: 'MBA Learning Hub does not use tracking cookies, advertising cookies, or session cookies. Any cookies set by third-party hosting or font providers are minimal and technical in nature. You may disable cookies in your browser without affecting your ability to use this platform.',
          },
          {
            title: '7. Your Rights',
            body: 'If you have submitted a subject request and wish to have your data removed, contact us and we will delete it within 30 days. As we collect minimal voluntary data, there is no user account to delete or profile to correct for standard platform users.',
          },
          {
            title: '8. Changes to This Policy',
            body: 'This privacy policy may be updated periodically. Material changes will be reflected in the "Last updated" date above. Continued use of the platform after changes constitutes acceptance of the revised policy.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap gap-4">
        <Link href="/terms" className="text-sm text-blue-600 hover:underline">Terms &amp; Conditions</Link>
        <Link href="/disclaimer" className="text-sm text-blue-600 hover:underline">Disclaimer</Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to Home</Link>
      </div>
    </div>
  );
}
