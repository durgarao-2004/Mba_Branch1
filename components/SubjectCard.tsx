import Link from 'next/link';
import { Subject } from '@/types';

interface SubjectCardProps {
  subject: Subject;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link href={`/subjects/${subject.slug}`}>
      <div className={`card p-6 h-full cursor-pointer group border-2 ${subject.borderClass} hover:scale-[1.02] transition-transform duration-200`}>
        <div className={`w-12 h-12 ${subject.bgClass} rounded-xl flex items-center justify-center text-2xl mb-4`}>
          {subject.icon}
        </div>

        <h3 className={`text-base font-semibold ${subject.colorClass} mb-2`}>
          {subject.name}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {subject.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-slate-400">
            {subject.lectures.length} lectures
          </span>
          <span className={`text-sm font-medium ${subject.colorClass} flex items-center gap-1 group-hover:gap-2 transition-all`}>
            Explore
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
