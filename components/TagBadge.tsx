import { LectureTag, Difficulty } from '@/types';

const TAG_CONFIG: Record<LectureTag, { label: string; className: string }> = {
  'exam-important': {
    label: 'Exam Important',
    className: 'bg-rose-50 text-rose-700 border border-rose-200',
  },
  'beginner-friendly': {
    label: 'Beginner Friendly',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  'core-concept': {
    label: 'Core Concept',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  'revision-important': {
    label: 'Revision Must',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; className: string; dot: string }> = {
  beginner: {
    label: 'Beginner',
    className: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-blue-100 text-blue-800 border border-blue-200',
    dot: 'bg-blue-500',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-rose-100 text-rose-800 border border-rose-200',
    dot: 'bg-rose-500',
  },
};

interface TagBadgeProps {
  tag: LectureTag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  const config = TAG_CONFIG[tag];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
