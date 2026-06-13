import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using MBA Learning Hub — the free academic learning platform for MBA students.',
  openGraph: {
    title: 'Terms & Conditions — MBA Learning Hub',
    description: 'Read the Terms & Conditions governing your use of MBA Learning Hub.',
  },
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'These Terms & Conditions ("Terms") govern your access to and use of MBA Learning Hub ("Platform", "we", "us"). By registering an account or using the Platform in any way, you confirm that you are at least 13 years of age, have read and understood these Terms, and agree to be bound by them. If you do not agree, you must immediately discontinue all use of the Platform. These Terms may be updated periodically; continued use after updates constitutes acceptance of the revised Terms.',
  },
  {
    title: '2. Platform Purpose',
    body: 'MBA Learning Hub is a free, student-driven educational platform providing lecture notes, structured summaries, interactive quizzes, attendance tools, case studies, and downloadable revision material for MBA students. All content is intended solely for personal, non-commercial educational use. The Platform is an independent initiative and is not affiliated with, endorsed by, or representing any university, college, business school, faculty member, or official academic institution.',
  },
  {
    title: '3. Account Registration',
    body: 'You must create an account to access protected features on the Platform. You agree to: (a) provide accurate, truthful registration information including your full name, valid email address, current semester, and specialization; (b) maintain the security of your account password and not share it with others; (c) notify us immediately at support@mbalearninghub.in if you suspect unauthorized access to your account; (d) accept responsibility for all activity that occurs under your account. One student may hold only one account. Creating multiple accounts for the same person is prohibited.',
  },
  {
    title: '4. Permitted Use',
    body: 'You may: access, read, and download content for personal study and revision; share Platform links with fellow students for non-commercial educational discussion; use quiz tools for self-assessment; use the attendance tool for personal tracking. You may not: republish, resell, or commercially distribute any Platform content; share your login credentials with others ("account sharing"); download and redistribute lecture notes or quiz content en masse; use automated bots, scrapers, or crawlers to extract content; impersonate other users, faculty members, or Platform administrators.',
  },
  {
    title: '5. Anti-Piracy & Content Protection',
    body: 'All original content on MBA Learning Hub — including lecture summaries, quiz questions, case study analyses, quick revision modules, and UI design — is protected under applicable copyright law. Unauthorized copying, redistribution, resale, or commercial exploitation of any Platform content is strictly prohibited. We actively monitor for content piracy and reserve the right to take legal action against any party found reproducing, reselling, or distributing our content without explicit written authorization. Violations will result in immediate account suspension and may result in civil or criminal proceedings.',
  },
  {
    title: '6. Account Sharing Prohibition',
    body: 'Each registered account is for the sole use of the individual who registered it. Account sharing — the practice of allowing other people to use your account credentials to access Platform content — is strictly prohibited. If we detect account sharing through unusual login patterns, concurrent session detection, or user reports, we reserve the right to: issue a warning, suspend the account temporarily, or permanently terminate the account without refund. Platform content is designed for individual learning journeys; sharing an account defeats its purpose and undermines the community.',
  },
  {
    title: '7. AI-Generated Content Disclaimer',
    body: 'Some content on MBA Learning Hub is created, summarized, or enhanced using artificial intelligence (AI) tools. All AI-generated content has been reviewed and edited by our team; however, it may still contain inaccuracies, oversimplifications, errors, or outdated information. You acknowledge that: (a) AI-generated notes are study aids, not authoritative academic sources; (b) you will verify critical information against official textbooks, faculty materials, and peer-reviewed sources before relying on it; (c) MBA Learning Hub makes no warranty as to the accuracy or completeness of AI-assisted content; (d) you will not cite MBA Learning Hub as a primary academic source in institutional submissions.',
  },
  {
    title: '8. User Conduct',
    body: 'You agree to use the Platform in a manner consistent with our Community Guidelines. Prohibited conduct includes: uploading or transmitting harmful, offensive, or illegal content; harassing, bullying, or threatening other users or the Platform team; attempting to breach or circumvent Platform security measures; using the Platform to promote competing services; engaging in academic fraud using Platform resources. Any violation of these conduct standards may result in immediate account suspension without notice.',
  },
  {
    title: '9. Intellectual Property',
    body: 'All original content on MBA Learning Hub — including but not limited to lecture notes, quiz questions, case studies, revision modules, UI/UX design, and platform architecture — is the intellectual property of MBA Learning Hub contributors. Referenced business examples, company names, trademarks, academic theories, and publicly available case studies remain the property of their respective owners and are used under fair-use educational provisions. You may not claim ownership of, alter, or remove any copyright or attribution notices from Platform content.',
  },
  {
    title: '10. Referral Program',
    body: 'MBA Learning Hub may introduce a referral program that rewards users for inviting new students to the Platform. Any referral rewards, credits, or incentives are non-transferable, have no guaranteed cash value unless explicitly stated, and are subject to the separate Referral Program Terms & Conditions that will be published at program launch. We reserve the right to modify or discontinue any referral program at any time without liability. Fraudulent referrals (self-referrals, fake account creation) will result in reward forfeiture and account termination.',
  },
  {
    title: '11. No Warranties',
    body: 'MBA Learning Hub is provided on an "as is" and "as available" basis, without any warranty of any kind, express or implied. We do not guarantee: (a) that the Platform will be available at all times or free from errors; (b) that content reflects current examination syllabi or faculty requirements; (c) that use of Platform content will improve your academic performance or career outcomes. Users should independently verify all content against official academic sources.',
  },
  {
    title: '12. Limitation of Liability',
    body: 'To the maximum extent permitted by applicable law, MBA Learning Hub, its contributors, administrators, and associated individuals shall not be liable for: (a) any direct, indirect, incidental, special, or consequential damages arising from use of or inability to use the Platform; (b) academic performance, examination results, or institutional decisions; (c) professional or career outcomes; (d) data loss resulting from Platform outages; (e) losses arising from third-party service failures (Firebase, Vercel, etc.). Your use of the Platform is entirely at your own risk.',
  },
  {
    title: '13. Account Termination & Suspension',
    body: 'We reserve the right to suspend, restrict, or permanently terminate your account at any time, with or without prior notice, for reasons including but not limited to: violation of these Terms, account sharing, content piracy, abusive conduct toward other users or the team, fraudulent activity, or any use of the Platform that we deem harmful to the community. Terminated accounts are not entitled to any compensation, credit, or data recovery. You may request your account be deleted at any time by emailing support@mbalearninghub.in.',
  },
  {
    title: '14. Third-Party Services',
    body: 'The Platform uses third-party services including Firebase (Google) for authentication and database, Vercel for hosting, and Google Fonts for typography. Your use of the Platform is also subject to these providers\' respective terms and privacy policies. MBA Learning Hub has no control over and assumes no responsibility for the content, policies, or practices of third-party services.',
  },
  {
    title: '15. Data Protection & Privacy',
    body: 'Your use of the Platform is also governed by our Privacy Policy. We collect and process personal data (name, email, academic details, usage analytics) in accordance with that policy and applicable data protection laws including the Digital Personal Data Protection Act, 2023 (India). By registering, you consent to this data processing as described in our Privacy Policy.',
  },
  {
    title: '16. Governing Law & Disputes',
    body: 'These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from your use of this Platform shall first be attempted to be resolved through informal negotiation. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in India. For consumer complaints, you may also approach the appropriate Consumer Disputes Redressal Forum under the Consumer Protection Act, 2019.',
  },
  {
    title: '17. Severability',
    body: 'If any provision of these Terms is found to be invalid, illegal, or unenforceable by a competent court, that provision shall be modified to the minimum extent necessary to make it enforceable, or severed from these Terms. The remaining provisions shall continue in full force and effect.',
  },
  {
    title: '18. Contact',
    body: 'Questions about these Terms & Conditions? Contact us at legal@mbalearninghub.in. We aim to respond to all legal enquiries within 5 business days.',
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Terms & Conditions</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Terms &amp; Conditions</h1>
        <p className="text-slate-500 text-sm">Last updated: June 13, 2026</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-sm text-blue-800 leading-relaxed">
        By accessing and using MBA Learning Hub, you agree to be bound by these Terms &amp; Conditions.
        If you do not agree, please discontinue use of the platform immediately.
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
        <Link href="/privacy" className="text-sm text-blue-600 hover:underline">Privacy Policy</Link>
        <Link href="/disclaimer" className="text-sm text-blue-600 hover:underline">Disclaimer</Link>
        <Link href="/community-guidelines" className="text-sm text-blue-600 hover:underline">Community Guidelines</Link>
        <Link href="/academic-integrity" className="text-sm text-blue-600 hover:underline">Academic Integrity</Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to Home</Link>
      </div>
    </div>
  );
}
