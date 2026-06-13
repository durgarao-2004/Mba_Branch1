import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Academic Integrity Policy',
  description: 'Academic integrity policy for MBA Learning Hub — responsible use of notes, quizzes, and AI-generated content.',
  openGraph: {
    title: 'Academic Integrity Policy — MBA Learning Hub',
    description: 'How MBA Learning Hub promotes responsible, ethical learning and content use.',
  },
};

const sections = [
  {
    title: '1. Purpose of This Policy',
    body: 'MBA Learning Hub is committed to supporting genuine learning. This Academic Integrity Policy outlines the responsible and ethical use of all content on this platform, including AI-generated notes, quiz questions, case studies, and revision materials. Our goal is to enhance your understanding, not to enable academic dishonesty.',
  },
  {
    title: '2. Intended Use of Platform Content',
    body: 'All content on MBA Learning Hub — including lecture notes, summaries, quiz questions, and revision materials — is designed for: (a) Personal revision and exam preparation, (b) Supplementary study alongside official course materials, (c) Concept clarification and understanding, (d) Practice quizzes for self-assessment. Content must not be submitted as your own original work in academic assessments, dissertations, or assignments without proper attribution, as this may constitute plagiarism under your institution\'s academic integrity rules.',
  },
  {
    title: '3. AI-Generated Content Disclosure',
    body: 'Some content on MBA Learning Hub is created or enhanced using artificial intelligence tools. AI-generated content has been reviewed and edited by our team, but may still contain inaccuracies, oversimplifications, or outdated information. Students must: (a) Treat AI-generated notes as study aids, not authoritative academic sources, (b) Verify critical information against official textbooks, faculty materials, and peer-reviewed sources, (c) Not cite MBA Learning Hub as a primary academic reference in institutional submissions.',
  },
  {
    title: '4. Quiz and Assessment Integrity',
    body: 'The quiz system on MBA Learning Hub is designed for self-assessment and learning reinforcement. You must not: (a) Share quiz questions or answers with others for the purpose of giving them an unfair advantage in institutional assessments where the same questions appear, (b) Use quiz answers to cheat in institutional tests or exams, (c) Screenshot and distribute quiz content in ways that undermine the learning purpose of the tool. The quiz system tracks completion for your personal learning analytics only — it is not connected to any institutional assessment system.',
  },
  {
    title: '5. Attendance Tool Integrity',
    body: 'The Attendance Tracker on MBA Learning Hub is a personal productivity tool to help you monitor your own attendance. It is not connected to any institutional attendance system. You must not: (a) Use manipulated data from this tool to make false claims about attendance to your institution, (b) Use this tool to create fraudulent attendance records, (c) Share another student\'s attendance data without their consent. MBA Learning Hub bears no responsibility for any disputes arising from the use of this tool in institutional contexts.',
  },
  {
    title: '6. Content Attribution',
    body: 'When content from MBA Learning Hub is referenced in academic work, it must be clearly attributed as a secondary study resource. Example attribution: "MBA Learning Hub (2026). \'Introduction to Financial Management\' — Lecture Notes [Study Resource]. Retrieved from mbalearninghub.in." The platform and its notes are not peer-reviewed academic publications and should not be cited as primary academic sources in institutional submissions.',
  },
  {
    title: '7. Student Responsibility',
    body: 'Each student is individually responsible for understanding and complying with their institution\'s academic integrity policy. MBA Learning Hub does not take responsibility for academic integrity violations by students. If you are uncertain whether a specific use of platform content complies with your institution\'s rules, consult your faculty or academic integrity office before proceeding.',
  },
  {
    title: '8. Platform Content — Independent Preparation',
    body: 'All notes on MBA Learning Hub are independently prepared summaries based on commonly available MBA curriculum content, publicly available business case studies, and academic theory. They are NOT: (a) Official materials from any MBA institution, university, or college, (b) Endorsed by any faculty member or institution, (c) Guaranteed to match any specific institution\'s syllabus exactly. Students should treat all content as supplementary revision material and verify against their official course materials.',
  },
  {
    title: '9. Reporting Academic Integrity Concerns',
    body: 'If you observe content on MBA Learning Hub that appears to directly reproduce copyrighted institutional materials, plagiarize published academic work, or present misleading academic information, please report it to academic@mbalearninghub.in. We are committed to maintaining content standards and will investigate all legitimate reports promptly.',
  },
];

export default function AcademicIntegrityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Academic Integrity Policy</span>
        </div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Policy</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Academic Integrity Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: June 13, 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-sm text-amber-800 leading-relaxed">
        <strong>Important:</strong> MBA Learning Hub content is a study aid, not a substitute for official academic materials.
        Always verify critical information with your faculty and official textbooks. AI-generated content may contain
        inaccuracies — use it as a starting point for learning, not as a final academic reference.
      </div>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-2 text-base">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <p className="text-sm text-slate-600 mb-2 font-medium">Questions about responsible use?</p>
        <p className="text-sm text-slate-500 mb-3">
          Contact us at{' '}
          <a href="mailto:academic@mbalearninghub.in" className="text-blue-600 underline">
            academic@mbalearninghub.in
          </a>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 justify-center">
        {[['Terms', '/terms'], ['Disclaimer', '/disclaimer'], ['Community Guidelines', '/community-guidelines'], ['Contact', '/contact']].map(([l, h]) => (
          <Link key={h} href={h} className="hover:text-slate-600 transition-colors">{l}</Link>
        ))}
      </div>
    </div>
  );
}
