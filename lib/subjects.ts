import { Subject } from '@/types';

export const subjects: Subject[] = [
  {
    id: 'financial-management',
    name: 'Financial Management',
    slug: 'financial-management',
    description: 'Master capital budgeting, cost of capital, valuation, and corporate financial strategy to drive business value.',
    icon: '📊',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    lectures: [
      {
        id: 'introduction-to-financial-management',
        title: 'Introduction to Financial Management',
        date: '2026-06-02',
        slug: 'introduction-to-financial-management',
        description: 'Meaning, objectives, forms of business, profit vs wealth maximization, agency problem',
      },
      {
        id: 'financial-system-markets-institutions',
        title: 'Financial System, Markets, Institutions & Intermediaries',
        date: '2026-06-13',
        slug: 'financial-system-markets-institutions',
        description: 'Financial system components, types of banks (Commercial, Cooperative, RRB, Foreign, Private), money market vs capital market, primary vs secondary market, debt vs equity, forwards vs futures, mutual funds, NBFCs, RBI, SEBI, IRDAI',
      },
    ],
  },
  {
    id: 'managerial-economics',
    name: 'Managerial Economics',
    slug: 'managerial-economics',
    description: 'Apply economic principles to managerial decisions including demand analysis, pricing strategy, and market competition.',
    icon: '📈',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    lectures: [
      {
        id: 'introduction-to-managerial-economics',
        title: 'Introduction to Managerial Economics',
        date: '2026-06-05',
        slug: 'introduction-to-managerial-economics',
        description: 'Economics definition, history of economic thought, scarcity, Micro vs Macro, Positive vs Normative economics, and role of government',
      },
    ],
  },
  {
    id: 'organizational-behavior',
    name: 'Organizational Behavior',
    slug: 'organizational-behavior',
    description: 'Understand individual and group dynamics, leadership effectiveness, and organizational culture for management success.',
    icon: '🤝',
    colorClass: 'text-violet-700',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-200',
    lectures: [],
  },
  {
    id: 'marketing-management',
    name: 'Marketing Management',
    slug: 'marketing-management',
    description: 'Learn consumer behavior, market segmentation, branding, and the strategic marketing mix for business growth.',
    icon: '🎯',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    lectures: [],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Harness data visualization, machine learning, and analytics to drive evidence-based business decisions.',
    icon: '🔬',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    lectures: [
      {
        id: 'data-types-measurement-and-visualization',
        title: 'Data Types, Measurement Scales & Business Visualization',
        date: '2026-06-13',
        slug: 'data-types-measurement-and-visualization',
        description: 'Cross-sectional vs longitudinal data, primary vs secondary, NOIR measurement scales, balanced/unbalanced Likert, chart selection guide, and all measures of central tendency with MBA business applications',
      },
    ],
  },
  {
    id: 'information-systems',
    name: 'Information Systems',
    slug: 'information-systems',
    description: 'Explore enterprise IT systems, cloud computing, digital transformation, and IS strategy for competitive advantage.',
    icon: '💻',
    colorClass: 'text-cyan-700',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200',
    lectures: [
      {
        id: 'introduction-to-information-systems',
        title: 'Introduction to Information Systems',
        date: '2026-06-07',
        slug: 'introduction-to-information-systems',
        description: 'What is IS, data vs information, components & dimensions of IS, management levels, TPS/MIS/DSS/ESS, strategic business objectives, digital firms',
      },
      {
        id: 'business-process-reengineering',
        title: 'Business Process Reengineering (BPR) & Process Integration',
        date: '2026-06-13',
        slug: 'business-process-reengineering',
        description: 'Business process vs function, cross-functional workflows, Procure-to-Pay, Ford Motors BPR case study, three-way matching, IT-enabled transformation, ERP/SAP integration, BPR vs BPI',
      },
    ],
  },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find((s) => s.slug === slug);
}
