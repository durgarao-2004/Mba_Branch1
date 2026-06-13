import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for MBA Learning Hub — how we collect, use, and protect your personal data on this educational platform.',
  openGraph: {
    title: 'Privacy Policy — MBA Learning Hub',
    description: 'How MBA Learning Hub handles your personal data, Firebase auth, and usage analytics.',
  },
};

const sections = [
  {
    title: '1. Who We Are',
    body: 'MBA Learning Hub is a free, student-driven educational platform providing lecture notes, quizzes, case studies, attendance tools, and revision material for MBA students. This Privacy Policy explains how we collect, use, store, and protect your personal data when you register and use the Platform.',
  },
  {
    title: '2. Data We Collect',
    body: 'When you register, we collect: (a) Full name — for displaying on your profile and personalized content. (b) Email address — for account authentication and platform notifications. (c) Academic details: semester, specialization, and areas of interest — to personalize your learning experience. (d) Account metadata: creation date, last active timestamp, role (student/admin/mentor). When you use the Platform, we automatically collect: (e) Quiz completion data — which quizzes you have completed and your scores, stored in Firestore for your personal analytics. (f) Notification preferences — which announcements you have read. (g) Usage patterns via anonymized Vercel Analytics (page views, navigation — no personally identifiable information). (h) Device and session information may be collected by Firebase Authentication as part of the sign-in process.',
  },
  {
    title: '3. Firebase Authentication & Data Storage',
    body: 'We use Google Firebase for authentication and data storage. When you register, Firebase Authentication creates a secure user account linked to your email and stores your authentication token in your browser. Your profile data (name, semester, specialization, interests, role) is stored in Google Firestore under your unique user ID (UID). Firebase is GDPR-compliant and subject to Google\'s data processing terms. Your data is stored on Google\'s secure cloud infrastructure and is never sold to third parties by Google or by us.',
  },
  {
    title: '4. Quiz & Learning Analytics',
    body: 'MBA Learning Hub stores your quiz completion history in Firestore to track your learning progress. This includes: which lecture quizzes you have attempted, completion timestamps, and personal progress metrics. This data is used solely to power your personal learning dashboard and is not shared with your institution, faculty, or any third party. We do not use quiz results to evaluate or rank you in any formal academic context.',
  },
  {
    title: '5. Attendance Tool Data',
    body: 'The Attendance Tracker is a personal productivity tool. Any attendance data you enter is stored in your browser\'s localStorage — it does not leave your device and is not transmitted to our servers. If an attendance sync feature is added in the future, this policy will be updated accordingly. MBA Learning Hub bears no responsibility for institutional disputes arising from use of this tool.',
  },
  {
    title: '6. Subject Request Data',
    body: 'When you submit a subject or lecture request, you may provide: your name, email address (optional), the subject you are requesting, and your reason. This data is used only to: acknowledge your request, prioritize content creation, and notify you when the content is published. It is not used for marketing or shared with third parties.',
  },
  {
    title: '7. Notifications & Announcements',
    body: 'When you receive an in-platform announcement from our admin team, Firestore records which announcements you have read (a "readBy" array tracking UIDs). This is used to show you only unread notifications and calculate notification counts on your dashboard. This data is never used for marketing profiling.',
  },
  {
    title: '8. Analytics',
    body: 'We use Vercel Analytics for aggregate, anonymized website traffic analysis. This tool does not use cookies, does not collect personally identifiable information, and is GDPR-compliant. It provides us with aggregate data such as: total page views, popular subjects visited, geographic distribution (country level), and device types. No individual user behaviour is tracked or profiled.',
  },
  {
    title: '9. Cookies & LocalStorage',
    body: 'We use Firebase Authentication\'s session cookie to maintain your login state. We use browser localStorage to store: your notification read state, platform preferences (e.g., language choice), quiz progress, and popup display history. We do not use advertising cookies, third-party tracking cookies, or cross-site tracking. See our Cookie Policy for full details.',
  },
  {
    title: '10. Referral Program Data',
    body: 'If and when a referral program is launched, we will collect referral tracking data (who referred whom) to attribute rewards correctly. This data will be stored securely in Firestore and will only be used for reward calculation and fraud prevention. Full details will be provided in the Referral Program Terms at launch.',
  },
  {
    title: '11. How We Use Your Data',
    body: 'We use your data to: (a) Authenticate your account and maintain your session securely. (b) Personalize your learning dashboard with relevant content, quiz history, and progress. (c) Send targeted announcements relevant to your semester and specialization. (d) Improve the Platform by understanding which subjects and features are most used. (e) Maintain platform security and detect abuse. We do NOT use your data for: advertising, selling to third parties, building commercial profiles, or contacting you outside platform notifications without your consent.',
  },
  {
    title: '12. Data Sharing',
    body: 'We share your data with: (a) Google Firebase — for authentication, database storage, and platform infrastructure. (b) Vercel — for hosting and aggregate analytics. No other third parties receive your personal data. We do not sell, rent, or trade your personal information. In the event of a legal requirement (court order, law enforcement request), we will disclose only the minimum data legally required and will notify you where permitted by law.',
  },
  {
    title: '13. Data Retention',
    body: 'Your account and associated data are retained as long as your account is active. If you request account deletion, we will delete or anonymize your personal data within 30 days of receiving your written request. Firestore Audit Log entries (admin actions) may be retained for longer periods as required for platform integrity and dispute resolution. Aggregate analytics data is retained in anonymized form indefinitely.',
  },
  {
    title: '14. Your Rights',
    body: 'Under applicable data protection laws, including the Digital Personal Data Protection Act, 2023 (India), you have the right to: (a) Access the personal data we hold about you. (b) Request correction of inaccurate data. (c) Request deletion of your data (right to erasure). (d) Withdraw consent for data processing (note: withdrawal may limit your ability to use authenticated features). (e) Lodge a complaint with the appropriate Data Protection Board. To exercise any of these rights, email privacy@mbalearninghub.in.',
  },
  {
    title: '15. Security',
    body: 'We implement industry-standard security measures to protect your data: (a) Firebase Authentication with secure token management for all accounts. (b) Firestore Security Rules enforcing role-based access control. (c) HTTPS-only communication across all Platform pages. (d) No plaintext storage of passwords — all authentication is handled by Firebase. No security system is 100% infallible. If you suspect your account has been compromised, change your password immediately and contact support@mbalearninghub.in.',
  },
  {
    title: '16. Children\'s Privacy',
    body: 'The Platform is intended for students who are at least 13 years of age. We do not knowingly collect personal data from children under 13. If you believe a minor has registered without parental consent, contact us at privacy@mbalearninghub.in and we will delete the account.',
  },
  {
    title: '17. Changes to This Policy',
    body: 'This Privacy Policy may be updated periodically as the Platform adds new features. Material changes will be reflected in the "Last updated" date above and notified to registered users via a platform announcement. Continued use after changes constitutes acceptance of the revised policy.',
  },
  {
    title: '18. Contact',
    body: 'For any privacy-related queries, data requests, or to exercise your rights, contact our Data Protection contact at privacy@mbalearninghub.in. We aim to respond to all privacy enquiries within 5 business days and will resolve data deletion or correction requests within 30 days.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Privacy Policy</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: June 13, 2026</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🔒</span>
          <div className="text-sm text-emerald-800 leading-relaxed">
            <strong>Short version:</strong> We collect your name, email, and academic details to power your
            personalized learning experience. We use Firebase for authentication and storage. We do not
            sell your data. You can request deletion at any time.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap gap-4">
        <Link href="/terms" className="text-sm text-blue-600 hover:underline">Terms &amp; Conditions</Link>
        <Link href="/cookie-policy" className="text-sm text-blue-600 hover:underline">Cookie Policy</Link>
        <Link href="/disclaimer" className="text-sm text-blue-600 hover:underline">Disclaimer</Link>
        <Link href="/contact" className="text-sm text-blue-600 hover:underline">Contact</Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to Home</Link>
      </div>
    </div>
  );
}
