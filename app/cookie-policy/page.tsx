import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for MBA Learning Hub — learn how we use cookies and localStorage for a better learning experience.',
  openGraph: {
    title: 'Cookie Policy — MBA Learning Hub',
    description: 'How MBA Learning Hub uses cookies and browser storage to improve your experience.',
  },
};

const sections = [
  {
    title: '1. What Are Cookies?',
    body: 'Cookies are small text files that websites store on your device (computer, phone, or tablet) when you visit them. They help websites remember information about your visit — such as your login session, preferences, and usage patterns — so you have a smoother, more personalized experience on subsequent visits.',
  },
  {
    title: '2. Does MBA Learning Hub Use Cookies?',
    body: 'MBA Learning Hub uses a minimal, privacy-first approach to cookies and browser storage. We do not use advertising cookies or third-party tracking cookies. Our cookie usage is limited to what is strictly necessary for the platform to function correctly and to remember your preferences for a better learning experience.',
  },
  {
    title: '3. Types of Storage We Use',
    body: 'We use the following types of browser storage: (a) Session Cookies — temporary cookies that are deleted when you close your browser. These maintain your login session with Firebase Authentication so you remain logged in while using the platform. (b) Persistent LocalStorage — we use your browser\'s localStorage to remember preferences such as your chosen language, quiz progress, notification settings, and whether you have seen the platform welcome popup. This data never leaves your device and is not transmitted to our servers. (c) Firebase Auth Token — when you log in, Firebase Authentication stores an authentication token securely in your browser to manage your session. This is essential for protected features like your dashboard, attendance, and personalized content.',
  },
  {
    title: '4. Third-Party Services and Their Cookies',
    body: 'MBA Learning Hub uses the following third-party services that may set their own cookies: (a) Firebase (Google) — for authentication and database services. Google\'s privacy policy applies to Firebase-set cookies. (b) Vercel Analytics — for aggregate, anonymized website traffic analysis. Vercel does not use personally identifiable cookies. (c) Google Fonts — fonts may be loaded from Google\'s CDN, which may set minimal performance-related cookies. We do not use Google Ads, Facebook Pixel, or any advertising or retargeting cookies.',
  },
  {
    title: '5. What We Do NOT Do',
    body: 'MBA Learning Hub does NOT: (a) Use cookies to serve targeted advertisements. (b) Sell your cookie data or browsing behaviour to third parties. (c) Track you across other websites. (d) Use cross-site tracking technologies. (e) Store sensitive personal or financial information in cookies.',
  },
  {
    title: '6. Controlling Cookies',
    body: 'You can control and manage cookies through your browser settings. Most browsers allow you to: view and delete existing cookies, block all cookies (note: this may prevent login and key features from working), allow cookies only from specific websites. To manage cookies, access your browser\'s Privacy or Security settings. Specific instructions are available in your browser\'s help documentation. Clearing localStorage will reset your platform preferences (language, popup history, quiz progress) but will not delete your account or Firestore data.',
  },
  {
    title: '7. Cookie Consent',
    body: 'By continuing to use MBA Learning Hub after reading this Cookie Policy, you consent to our use of essential cookies and localStorage as described above. A cookie consent banner may be implemented in future platform updates as regulatory requirements evolve. Non-essential cookies will always require your explicit consent before being set.',
  },
  {
    title: '8. Data Retention',
    body: 'Session cookies are deleted when you close your browser. LocalStorage data persists until you clear it manually or uninstall your browser. Firebase authentication tokens are managed by Firebase and typically refresh every hour. Vercel Analytics data is retained per Vercel\'s data retention policies.',
  },
  {
    title: '9. Updates to This Policy',
    body: 'This Cookie Policy may be updated periodically to reflect changes in our practices or legal requirements. The "Last updated" date at the top of this page indicates when it was last revised. We recommend reviewing this policy periodically.',
  },
  {
    title: '10. Contact',
    body: 'If you have any questions about our use of cookies or browser storage, please contact us at privacy@mbalearninghub.in. We will respond to all enquiries within 5 business days.',
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Cookie Policy</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Cookie Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: June 13, 2026</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-sm text-blue-800 leading-relaxed">
        <strong>Privacy-first approach.</strong> We use only essential cookies and browser storage needed for the
        platform to function. No advertising cookies. No cross-site tracking. No data sales.
      </div>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-2 text-base">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 justify-center">
        {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Disclaimer', '/disclaimer'], ['Contact', '/contact']].map(([l, h]) => (
          <Link key={h} href={h} className="hover:text-slate-600 transition-colors">{l}</Link>
        ))}
      </div>
    </div>
  );
}
