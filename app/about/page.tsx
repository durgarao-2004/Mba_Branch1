import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'MBA Learning Hub is a student-driven academic platform with daily classroom lecture notes, revision material, and interactive quizzes for MBA students.',
};

const roadmap = [
  {
    phase: 'Phase 1 (Now)',
    items: [
      '6 core subjects',
      'Classroom lecture notes and summaries',
      'MCQ quizzes per lecture',
      'PDF & DOCX downloads',
      'Mobile-responsive design',
    ],
    done: true,
  },
  {
    phase: 'Phase 2 (Planned)',
    items: [
      'More lectures across all subjects',
      'Student progress tracking',
      'Flashcard revision mode',
      'Advanced search and filtering',
      'Dark mode',
    ],
    done: false,
  },
  {
    phase: 'Phase 3 (Future)',
    items: [
      'Discussion forum for doubts',
      'Live classroom session integration',
      'Study group collaboration',
      'Performance analytics',
      'Mobile app',
    ],
    done: false,
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-2">About</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">MBA Learning Hub</h1>
        <p className="text-slate-500 max-w-2xl text-base leading-relaxed">
          A free, student-driven learning platform that turns classroom lectures into organized
          revision material — structured notes, summaries, quizzes, and downloadable study guides
          for all core MBA subjects.
        </p>
      </div>

      {/* Mission */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-blue-800 text-lg mb-3">Our Mission</h2>
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          MBA programmes are intense. Students juggle multiple subjects, assignments, and deadlines
          simultaneously. MBA Learning Hub exists to make learning more organized and accessible —
          by converting real classroom sessions into structured notes, revision-ready summaries, and
          interactive quizzes in one clean platform. No subscriptions. No logins. Just learning.
        </p>
      </section>

      {/* What we offer */}
      <section className="mb-10">
        <h2 className="font-bold text-slate-900 text-xl mb-5">What We Offer</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: '📝',
              title: 'Structured Lecture Notes',
              desc: 'Every classroom session is organized into clear sections: summary, key concepts, detailed notes, real-world examples, and case studies.',
            },
            {
              icon: '📋',
              title: 'Lecture Summaries',
              desc: 'Concise, well-structured summaries let you grasp the core of any lecture quickly — ideal for revision before exams.',
            },
            {
              icon: '🧠',
              title: 'Interactive Quizzes',
              desc: 'MCQ quizzes at the end of every lecture with instant feedback, detailed explanations, and score tracking.',
            },
            {
              icon: '⬇️',
              title: 'Downloadable Materials',
              desc: 'Export lecture notes as PDF or DOCX for offline study, printing, or sharing with your study group.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="font-bold text-slate-900 text-xl mb-5">How It Works</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          {[
            { step: '1', text: 'A classroom lecture takes place.' },
            { step: '2', text: 'The session is processed into structured notes, summaries, and quiz questions.' },
            { step: '3', text: 'The lecture is uploaded to the platform under the relevant subject.' },
            { step: '4', text: 'Students access organized notes, test themselves with quizzes, and download revision material.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {s.step}
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects covered */}
      <section className="mb-10">
        <h2 className="font-bold text-slate-900 text-xl mb-5">Subjects Covered</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: '📊', name: 'Financial Management',    slug: 'financial-management',    color: 'border-blue-200 bg-blue-50' },
            { icon: '📈', name: 'Managerial Economics',    slug: 'managerial-economics',    color: 'border-emerald-200 bg-emerald-50' },
            { icon: '🤝', name: 'Organizational Behavior', slug: 'organizational-behavior', color: 'border-violet-200 bg-violet-50' },
            { icon: '🎯', name: 'Marketing Management',    slug: 'marketing-management',    color: 'border-rose-200 bg-rose-50' },
            { icon: '🔬', name: 'Data Science',            slug: 'data-science',            color: 'border-amber-200 bg-amber-50' },
            { icon: '💻', name: 'Information Systems',     slug: 'information-systems',     color: 'border-cyan-200 bg-cyan-50' },
          ].map((s) => (
            <Link
              key={s.slug}
              href={`/subjects/${s.slug}`}
              className={`${s.color} border rounded-lg p-3 text-center hover:shadow-sm transition-shadow`}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-xs font-medium text-slate-700">{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-10">
        <h2 className="font-bold text-slate-900 text-xl mb-5">Roadmap</h2>
        <div className="space-y-4">
          {roadmap.map((phase) => (
            <div
              key={phase.phase}
              className={`rounded-xl border p-5 ${
                phase.done ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  phase.done ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {phase.done ? 'Live' : 'Upcoming'}
                </span>
                <h3 className="font-semibold text-slate-800 text-sm">{phase.phase}</h3>
              </div>
              <ul className="space-y-1">
                {phase.items.map((item) => (
                  <li key={item} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className={phase.done ? 'text-blue-500' : 'text-slate-300'}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-2">Start learning today</h2>
        <p className="text-blue-100 text-sm mb-5">
          Browse all subjects and access classroom notes, quizzes, and revision material — for free.
        </p>
        <Link
          href="/subjects"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          Browse Subjects →
        </Link>
      </div>

    </div>
  );
}
