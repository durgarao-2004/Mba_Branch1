interface EmptyLectureStateProps {
  subjectName: string;
}

export default function EmptyLectureState({ subjectName }: EmptyLectureStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
          <svg
            className="w-9 h-9 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.4}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        {/* Pulse dot */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-60" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-400 border-2 border-white" />
        </span>
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-slate-700 mb-2">
        No lecture notes uploaded yet
      </h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-1">
        Lecture summaries, quizzes, and revision material for{' '}
        <span className="font-medium text-slate-600">{subjectName}</span> will be
        updated after each classroom session.
      </p>
      <p className="text-xs text-slate-400 mt-3">
        Check back after upcoming lectures.
      </p>

      {/* Divider with label */}
      <div className="flex items-center gap-3 mt-8 w-full max-w-xs">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
          Live updates
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {['Summaries', 'Key Concepts', 'Case Studies', 'Quizzes', 'Downloads'].map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
