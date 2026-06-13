import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for MBA Learning Hub — understand how our free platform handles payments and future premium features.',
  openGraph: {
    title: 'Refund Policy — MBA Learning Hub',
    description: 'Our refund policy for any premium or paid features on MBA Learning Hub.',
  },
};

const sections = [
  {
    title: '1. Platform Status — Currently Free',
    body: 'As of the date of this policy, MBA Learning Hub is a free educational platform. No payment is required to access lecture notes, quizzes, revision materials, DOCX downloads, or any other content currently available on the platform. Therefore, there is no financial transaction to refund at this time for standard platform usage.',
  },
  {
    title: '2. Future Premium Features',
    body: 'MBA Learning Hub is actively developing premium features that may include: advanced AI-powered personalized revision plans, one-on-one mentorship sessions, career coaching services, premium case study modules, placement preparation packs, and referral reward cashouts. These features, when introduced, may carry a fee. This Refund Policy will govern all such paid transactions.',
  },
  {
    title: '3. Refund Eligibility (Future Paid Services)',
    body: 'When paid services are introduced, refund eligibility will be determined as follows: (a) Digital content that has been downloaded or accessed is generally non-refundable once delivery is confirmed. (b) Subscription services cancelled within 24 hours of purchase and before any content is accessed may be eligible for a full refund. (c) Mentorship or coaching sessions cancelled at least 48 hours before the scheduled session are eligible for a full refund. Cancellations within 48 hours may forfeit the session fee. (d) Technical failures or service unavailability caused by our systems may qualify for a full or partial refund at our discretion.',
  },
  {
    title: '4. Non-Refundable Situations',
    body: 'The following situations will generally not qualify for a refund: (a) Change of mind after accessing digital content. (b) Failure to attend a booked session without prior notice. (c) Academic performance dissatisfaction — we are an educational support platform and do not guarantee specific exam scores, grades, or placement outcomes. (d) Disruptions caused by third-party services (internet providers, device failures). (e) Violations of our Terms & Conditions resulting in account suspension.',
  },
  {
    title: '5. How to Request a Refund',
    body: 'To request a refund for any future paid service, email us at support@mbalearninghub.in with: (a) Your registered email address, (b) The transaction ID or payment reference number, (c) The reason for the refund request, (d) Any supporting documentation. We aim to acknowledge all refund requests within 2 business days and process eligible refunds within 7–10 business days from approval.',
  },
  {
    title: '6. Payment Gateway & Processing',
    body: 'Refunds, when approved, will be credited to the original payment method used at the time of purchase. Processing times may vary depending on your bank or payment provider (typically 5–10 business days after we initiate the refund). We will use industry-standard, PCI-DSS compliant payment processing partners for all transactions.',
  },
  {
    title: '7. Referral Rewards',
    body: 'Any credits, rewards, or incentives earned through the MBA Learning Hub referral program (when launched) are non-transferable, have no cash value unless explicitly stated, and are subject to their own terms and conditions which will be published at the time of the referral program launch.',
  },
  {
    title: '8. Contact for Refund Disputes',
    body: 'If you believe a refund decision is incorrect, you may escalate your concern to our Grievance Officer at grievance@mbalearninghub.in. We are committed to fair and transparent dispute resolution. Unresolved disputes may be referred to the appropriate consumer forum under the Consumer Protection Act, 2019 (India).',
  },
  {
    title: '9. Policy Updates',
    body: 'This Refund Policy may be updated as new features and payment mechanisms are introduced. The most current version will always be available at this URL. We will notify registered users of material changes via email or dashboard notifications.',
  },
];

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Refund Policy</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Refund Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: June 13, 2026</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 text-sm text-emerald-800 leading-relaxed">
        <strong>Platform is currently free.</strong> MBA Learning Hub does not currently charge for any services.
        This policy governs future paid features. If you have a billing concern, contact{' '}
        <a href="mailto:support@mbalearninghub.in" className="underline">support@mbalearninghub.in</a>.
      </div>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-2 text-base">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <p className="text-sm text-slate-600 mb-3">Questions about this policy?</p>
        <a
          href="mailto:support@mbalearninghub.in"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Contact Support
        </a>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 justify-center">
        {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Disclaimer', '/disclaimer'], ['Contact', '/contact']].map(([l, h]) => (
          <Link key={h} href={h} className="hover:text-slate-600 transition-colors">{l}</Link>
        ))}
      </div>
    </div>
  );
}
