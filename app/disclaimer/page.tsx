import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimer regarding MBA Learning Hub content, academic accuracy, and intended use.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Disclaimer</h1>
        <p className="text-slate-500 text-sm">Last updated: June 5, 2026</p>
      </div>

      {/* Primary disclaimer box */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <h2 className="font-bold text-amber-900 text-base mb-2">Important Notice</h2>
            <p className="text-amber-800 text-sm leading-relaxed font-medium">
              These notes are independently prepared summaries intended for educational and revision
              purposes only. They may not fully represent official faculty materials or institutional
              content.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <Section title="1. Student-Led Initiative">
          <p>
            MBA Learning Hub is an independent, student-led initiative. It is not affiliated with,
            endorsed by, or representing any university, college, business school, faculty member,
            or official academic institution. All content is prepared independently by contributors
            based on publicly available academic knowledge and standard MBA curriculum materials.
          </p>
        </Section>

        <Section title="2. Educational Use Only">
          <p>
            All content on this platform — including lecture notes, summaries, quizzes, examples,
            and case studies — is intended solely for educational, revision, and self-study purposes.
            This content should not be treated as a substitute for:
          </p>
          <ul>
            <li>Official course materials provided by your institution</li>
            <li>Lectures, tutorials, or seminars from qualified faculty</li>
            <li>Academic textbooks and peer-reviewed publications</li>
            <li>Professional financial, legal, medical, or business advice</li>
          </ul>
          <p>
            Students are strongly encouraged to refer to their institution&apos;s official syllabus
            and course materials as the primary source for examinations and assessments.
          </p>
        </Section>

        <Section title="3. No Official Institutional Affiliation">
          <p>
            MBA Learning Hub has no formal relationship with any academic institution or examination body.
            References to Indian corporations, institutions, and business examples are used purely
            for illustrative and educational purposes. They do not imply endorsement by or
            partnership with those organisations.
          </p>
        </Section>

        <Section title="4. Accuracy and Completeness">
          <p>
            While we strive to ensure that all content is accurate, up to date, and aligned with
            standard MBA curricula, we make no warranty — express or implied — regarding the
            completeness, accuracy, or fitness of the content for any particular purpose. Academic
            frameworks, business theories, and case study data may evolve over time.
          </p>
          <p>
            Users should independently verify any information before relying on it for academic
            submission, professional advice, or business decisions.
          </p>
        </Section>

        <Section title="5. No Redistribution Without Permission">
          <p>
            Content on MBA Learning Hub may not be redistributed, republished, sold, sublicensed, or
            used for commercial purposes without express written permission from the platform
            administrators. Personal study use and sharing among students for non-commercial
            educational purposes is permitted, provided proper attribution is given.
          </p>
        </Section>

        <Section title="6. Limitation of Liability">
          <p>
            MBA Learning Hub and its contributors shall not be held liable for any academic consequences,
            examination results, professional decisions, or financial losses arising from reliance
            on content published on this platform. Use of this platform is entirely at the
            user&apos;s own risk.
          </p>
        </Section>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap gap-4">
        <Link href="/terms" className="text-sm text-blue-600 hover:underline">Terms & Conditions</Link>
        <Link href="/privacy" className="text-sm text-blue-600 hover:underline">Privacy Policy</Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to Home</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-bold text-slate-900 text-base mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
