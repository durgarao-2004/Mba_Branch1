import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using MBA Learning Hub — the free academic learning platform.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Terms &amp; Conditions</h1>
        <p className="text-slate-500 text-sm">Last updated: June 5, 2026</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-sm text-blue-800 leading-relaxed">
        By accessing and using MBA Learning Hub, you agree to be bound by these Terms &amp; Conditions.
        If you do not agree, please discontinue use of the platform.
      </div>

      <div className="space-y-5">
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'These Terms & Conditions govern your access to and use of MBA Learning Hub. By using this platform, you confirm that you are at least 13 years of age and agree to comply with these terms. These terms may be updated periodically; continued use after updates constitutes acceptance.',
          },
          {
            title: '2. Platform Purpose',
            body: 'MBA Learning Hub is a free, student-led educational platform providing lecture notes, summaries, quizzes, and study materials for MBA students. The platform is provided on an "as is" basis for personal, non-commercial educational use only.',
          },
          {
            title: '3. Permitted Use',
            body: 'You may access, read, and download content for personal study and revision purposes. You may share content links with other students for non-commercial educational use. You may not copy, republish, sell, or exploit any content for commercial purposes without explicit written permission.',
          },
          {
            title: '4. Intellectual Property',
            body: 'All original content on MBA Learning Hub — including notes, summaries, quiz questions, case studies, and UI design — is the intellectual property of MBA Learning Hub contributors. Referenced business examples, company names, and academic theories remain the property of their respective owners and are used under fair-use educational provisions.',
          },
          {
            title: '5. No Warranties',
            body: 'MBA Learning Hub is provided without any warranty of accuracy, completeness, or fitness for purpose. We do not guarantee that the content reflects current examination syllabi, faculty requirements, or institutional standards. Users should verify all content independently.',
          },
          {
            title: '6. Limitation of Liability',
            body: 'To the maximum extent permitted by law, MBA Learning Hub and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of the platform, including academic performance, examination outcomes, or professional decisions.',
          },
          {
            title: '7. Third-Party Links',
            body: 'The platform may contain links to external websites and resources. MBA Learning Hub has no control over and assumes no responsibility for the content, privacy policies, or practices of third-party sites.',
          },
          {
            title: '8. Content Requests',
            body: 'When you submit a subject request, you grant MBA Learning Hub permission to use the information provided (subject name, reason, notes) to prioritise and create new content. Your email, if provided, will only be used to notify you when the requested content is published.',
          },
          {
            title: '9. Termination',
            body: 'We reserve the right to restrict or terminate access to the platform at any time, for any reason, without notice. This includes but is not limited to misuse, redistribution of content, or violation of these terms.',
          },
          {
            title: '10. Governing Law',
            body: 'These Terms & Conditions are governed by the laws of India. Any disputes arising from use of this platform shall be subject to the exclusive jurisdiction of courts in India.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap gap-4">
        <Link href="/privacy" className="text-sm text-blue-600 hover:underline">Privacy Policy</Link>
        <Link href="/disclaimer" className="text-sm text-blue-600 hover:underline">Disclaimer</Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to Home</Link>
      </div>
    </div>
  );
}
