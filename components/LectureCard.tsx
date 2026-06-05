import Link from 'next/link';
import { LectureMeta } from '@/types';

interface LectureCardProps {
  lecture: LectureMeta;
  subjectSlug: string;
  index: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function LectureCard({ lecture, subjectSlug, index }: LectureCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 gap-3">
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-sm font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{lecture.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{lecture.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-12 sm:pl-0">
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {formatDate(lecture.date)}
        </span>
        <Link
          href={`/subjects/${subjectSlug}/${lecture.slug}`}
          className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"
        >
          Open
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
