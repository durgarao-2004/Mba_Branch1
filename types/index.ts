export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface NoteSection {
  heading: string;
  content: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type LectureTag =
  | 'exam-important'
  | 'beginner-friendly'
  | 'core-concept'
  | 'revision-important';

export interface QuickRevisionTerm {
  term: string;
  definition: string;
}

export interface QuickRevisionFormula {
  label: string;
  formula: string;
}

export interface QuickRevision {
  summaryPoints: string[];
  importantTerms: QuickRevisionTerm[];
  examTips: string[];
  keyFrameworks: string[];
  formulaRevision: QuickRevisionFormula[];
  likelyQuestions: string[];
}

export interface Lecture {
  id: string;
  title: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  difficulty?: Difficulty;
  tags?: LectureTag[];
  estimatedReadTime?: string;
  summary: string;
  concepts: string[];
  notes: NoteSection[];
  example: string;
  caseStudy: string;
  takeaways: string[];
  quiz: QuizQuestion[];
  docxPath: string;
  quickRevision?: QuickRevision;
}

export interface LectureMeta {
  id: string;
  title: string;
  date: string;
  slug: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  lectures: LectureMeta[];
}

export interface SearchResult {
  type: 'subject' | 'lecture';
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}
