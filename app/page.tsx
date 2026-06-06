import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import SubjectCard from '@/components/SubjectCard';
import { subjects } from '@/lib/subjects';

export const metadata: Metadata = {
  title: 'MBA Learning Hub — Student-Driven MBA Learning Platform',
};

const howItWorks = [
  {
    step: '01',
    title: 'Choose Your Subject',
    description: 'Browse the six core MBA subjects and select the one covered in your recent class.',
  },
  {
    step: '02',
    title: 'Open a Lecture',
    description: 'Pick a lecture uploaded after your classroom session to access full notes and summaries.',
  },
  {
    step: '03',
    title: 'Read & Revise',
    description: 'Study the lecture summary, detailed notes, and real-world case studies from your class.',
  },
  {
    step: '04',
    title: 'Test Yourself',
    description: 'Take the embedded MCQ quiz to check your understanding before exams.',
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* About the platform */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">
                What is MBA Learning Hub?
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">
                Your classroom. Organized and always ready.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                MBA Learning Hub organizes your real classroom lectures into structured study material
                — updated after each session so your notes are always current and exam-ready.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Every uploaded lecture comes with a structured summary, key concepts, detailed
                notes, real-world examples, case studies, and an interactive quiz — built directly
                from what was taught in class that day.
              </p>
              <Link href="/subjects" className="btn-primary">
                Browse All Subjects →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '📊', label: 'Financial Management', color: 'bg-blue-50 border-blue-200' },
                { emoji: '📈', label: 'Managerial Economics', color: 'bg-emerald-50 border-emerald-200' },
                { emoji: '🤝', label: 'Org. Behavior', color: 'bg-violet-50 border-violet-200' },
                { emoji: '🎯', label: 'Marketing Mgmt', color: 'bg-rose-50 border-rose-200' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`${item.color} border rounded-xl p-4 text-center`}
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <p className="text-xs font-medium text-slate-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Subject preview cards */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">
              Core Subjects
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Six subjects. Growing daily.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Updated regularly with real classroom lecture summaries and revision material — new
              content added after every session.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/subjects" className="btn-secondary">
              View All Subjects →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Four simple steps to go from confused to confident.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-blue-100 z-0" />
                )}
                <div className="relative z-10 bg-white rounded-xl border border-slate-200 p-5 h-full">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance Tool CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 rounded-2xl p-8 sm:p-12 text-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                📊 Attendance Survival Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Track Your Attendance
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-7 text-sm sm:text-base leading-relaxed">
                Instantly know if you can skip a class — or how many you need to attend to stay eligible. Fast, free, and no login required.
              </p>
              <Link
                href="/attendance"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-7 py-3 rounded-xl transition-colors duration-150"
              >
                📊 Open Attendance Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Hub CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-8 sm:p-12 text-center">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                📖 New — Case Study Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Explore real business case studies
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-7 text-sm sm:text-base leading-relaxed">
                Browse classroom-inspired MBA business scenarios by subject. Submit your own case study idea and help shape the hub.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-7 py-3 rounded-xl transition-colors duration-150"
                >
                  📖 Explore Case Studies
                </Link>
                <Link
                  href="/case-studies#submit"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3 rounded-xl transition-colors duration-150"
                >
                  📝 Submit an Idea
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request a Subject */}
      <section className="pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-8 sm:p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                📬 Community Driven
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Don&apos;t see your subject?
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-7 text-sm sm:text-base leading-relaxed">
                Request a new subject and our team will prioritize adding it to the platform.
                Completely free, no signup required.
              </p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-7 py-3 rounded-xl transition-colors duration-150"
              >
                ✉ Request a Subject
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-blue-100 mb-8 text-base">
            Real classroom notes, revision material, and quizzes — updated after every lecture, completely free.
          </p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Explore Subjects →
          </Link>
        </div>
      </section>
    </>
  );
}
