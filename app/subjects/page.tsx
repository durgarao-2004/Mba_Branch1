import type { Metadata } from 'next';
import SubjectCard from '@/components/SubjectCard';
import { subjects } from '@/lib/subjects';

export const metadata: Metadata = {
  title: 'All Subjects',
  description: 'Browse all six core MBA subjects — Financial Management, Economics, Marketing, OB, Data Science, and Information Systems.',
};

export default function SubjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-2">
          MBA Curriculum
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">All Subjects</h1>
        <p className="text-slate-500 max-w-xl text-base">
          Six core MBA subjects, each with classroom lecture notes, structured summaries, quizzes, and
          downloadable revision material.
        </p>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

      {/* Future subjects teaser */}
      <div className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200">
        <h2 className="font-semibold text-slate-700 mb-3 text-sm">Coming Soon</h2>
        <div className="flex flex-wrap gap-2">
          {['Operations Management', 'HR Management', 'Accounting', 'Statistics'].map((s) => (
            <span
              key={s}
              className="badge bg-slate-200 text-slate-500"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
