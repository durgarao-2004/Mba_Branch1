import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import QuizComponent from '@/components/QuizComponent';
import LectureDownloadButtons from '@/components/LectureDownloadButtons';
import LectureSidebar, { SidebarSection } from '@/components/LectureSidebar';
import { TagBadge, DifficultyBadge } from '@/components/TagBadge';
import LectureHelpfulness from '@/components/LectureHelpfulness';
import ReportIssueButton from '@/components/ReportIssueButton';
import QuickRevision from '@/components/QuickRevision';
import JsonLd from '@/components/JsonLd';
import { subjects, getSubjectBySlug } from '@/lib/subjects';
import { getLecture, getAllLectureSlugs } from '@/lib/content';
import { LectureTag } from '@/types';

const BASE_URL = 'https://mba.collabex.online';

interface PageProps {
  params: Promise<{ subject: string; lecture: string }>;
}

const BASE_SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: 'summary',        label: 'Lecture Summary',     icon: '📋' },
  { id: 'quick-revision', label: '5-Min Revision',      icon: '⚡' },
  { id: 'concepts',       label: 'Key Concepts',        icon: '🔑' },
  { id: 'notes',          label: 'Detailed Notes',      icon: '📝' },
  { id: 'example',        label: 'Real-World Example',  icon: '🌍' },
  { id: 'case-study',     label: 'Case Study',          icon: '📊' },
  { id: 'takeaways',      label: 'Key Takeaways',       icon: '✅' },
  { id: 'quiz',           label: 'Knowledge Quiz',      icon: '🧠' },
];

export async function generateStaticParams() {
  return getAllLectureSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subject: subjectSlug, lecture: lectureSlug } = await params;
  const lecture = getLecture(subjectSlug, lectureSlug);
  const subject = getSubjectBySlug(subjectSlug);
  if (!lecture || !subject) return { title: 'Lecture Not Found' };

  const title = `${lecture.title} — ${subject.name} Notes`;
  const description = lecture.summary.slice(0, 155) + (lecture.summary.length > 155 ? '…' : '');
  const url = `${BASE_URL}/subjects/${subjectSlug}/${lectureSlug}`;

  return {
    title,
    description,
    keywords: [
      lecture.title,
      subject.name,
      'MBA notes',
      'lecture notes',
      ...(lecture.concepts?.slice(0, 5) ?? []),
      ...(lecture.tags ?? []),
    ],
    authors: [{ name: 'MBA Learning Hub', url: BASE_URL }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'MBA Learning Hub',
      publishedTime: lecture.date,
      modifiedTime: lecture.updatedAt ?? lecture.date,
      authors: ['MBA Learning Hub'],
      tags: lecture.tags,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${lecture.title} — ${subject.name} | MBA Learning Hub`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default async function LecturePage({ params }: PageProps) {
  const { subject: subjectSlug, lecture: lectureSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);
  const lecture = getLecture(subjectSlug, lectureSlug);
  if (!subject || !lecture) notFound();

  const url = `${BASE_URL}/subjects/${subjectSlug}/${lectureSlug}`;

  const sidebarSections = lecture.quickRevision
    ? BASE_SIDEBAR_SECTIONS
    : BASE_SIDEBAR_SECTIONS.filter((s) => s.id !== 'quick-revision');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: lecture.title,
    description: lecture.summary.slice(0, 160),
    url,
    datePublished: lecture.date,
    dateModified: lecture.updatedAt ?? lecture.date,
    author: {
      '@type': 'Organization',
      name: 'MBA Learning Hub',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MBA Learning Hub',
      url: BASE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: lecture.concepts?.join(', '),
    articleSection: subject.name,
    educationalLevel: 'Graduate',
    about: {
      '@type': 'Course',
      name: subject.name,
      url: `${BASE_URL}/subjects/${subjectSlug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Subjects', item: `${BASE_URL}/subjects` },
      { '@type': 'ListItem', position: 3, name: subject.name, item: `${BASE_URL}/subjects/${subjectSlug}` },
      { '@type': 'ListItem', position: 4, name: lecture.title, item: url },
    ],
  };

  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${lecture.title} — Knowledge Quiz`,
    url,
    educationalLevel: 'Graduate',
    about: { '@type': 'Course', name: subject.name },
    hasPart: lecture.quiz.map((q) => ({
      '@type': 'Question',
      text: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.options[q.correct],
      },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={quizSchema} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/subjects" className="hover:text-slate-600 transition-colors">Subjects</Link>
        <span>/</span>
        <Link href={`/subjects/${subjectSlug}`} className="hover:text-slate-600 transition-colors">
          {subject.name}
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-[200px]">{lecture.title}</span>
      </nav>

      {/* Two-column layout */}
      <div className="lg:flex lg:gap-10 lg:items-start">

        {/* ─── Main content ───────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="mb-8">
            {/* Subject pill */}
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${subject.colorClass} ${subject.bgClass} border ${subject.borderClass} px-3 py-1 rounded-full mb-4`}>
              {subject.icon} {subject.name}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
              {lecture.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1.5">
                📅 <span>{fmt(lecture.date)}</span>
              </span>
              {lecture.estimatedReadTime && (
                <span className="flex items-center gap-1.5">
                  ⏱ <span>{lecture.estimatedReadTime} read</span>
                </span>
              )}
              {lecture.updatedAt && (
                <span className="flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1 rounded-full">
                  Updated: {fmt(lecture.updatedAt)}
                </span>
              )}
            </div>

            {/* Difficulty + Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {lecture.difficulty && <DifficultyBadge difficulty={lecture.difficulty} />}
              {lecture.tags?.map((tag) => (
                <TagBadge key={tag} tag={tag as LectureTag} />
              ))}
            </div>
          </div>

          {/* Download buttons + report issue */}
          <div className="mb-10">
            <LectureDownloadButtons lecture={lecture} />
            <div className="mt-3">
              <ReportIssueButton lectureTitle={lecture.title} />
            </div>
          </div>

          {/* ── Lecture Summary ──────────────────────────── */}
          <section id="summary" className="mb-8 scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-sm">📋</div>
              <h2 className="text-lg font-bold text-slate-900">Lecture Summary</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6">
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{lecture.summary}</p>
            </div>
          </section>

          {/* ── 5-Minute Revision ───────────────────────── */}
          {lecture.quickRevision && (
            <QuickRevision
              data={lecture.quickRevision}
              subjectColor={subject.colorClass}
              subjectBg={subject.bgClass}
              subjectBorder={subject.borderClass}
            />
          )}

          {/* ── Key Concepts ─────────────────────────────── */}
          <section id="concepts" className="mb-8 scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-sm">🔑</div>
              <h2 className="text-lg font-bold text-slate-900">Key Concepts</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {lecture.concepts.map((concept) => (
                <span
                  key={concept}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${subject.bgClass} ${subject.colorClass} ${subject.borderClass}`}
                >
                  {concept}
                </span>
              ))}
            </div>
          </section>

          {/* ── Detailed Notes ───────────────────────────── */}
          <section id="notes" className="mb-8 scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-sm">📝</div>
              <h2 className="text-lg font-bold text-slate-900">Detailed Notes</h2>
            </div>
            <div className="space-y-4">
              {lecture.notes.map((section, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-colors duration-150"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`w-6 h-6 rounded-full ${subject.bgClass} ${subject.colorClass} flex items-center justify-center text-xs font-bold flex-shrink-0 border ${subject.borderClass}`}>
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-base leading-snug">
                      {section.heading}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-8">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Real-World Example ───────────────────────── */}
          <section id="example" className="mb-8 scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">🌍</div>
              <h2 className="text-lg font-bold text-slate-900">Real-World Example</h2>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6">
              <p className="text-sm text-slate-700 leading-relaxed">{lecture.example}</p>
            </div>
          </section>

          {/* ── Case Study ───────────────────────────────── */}
          <section id="case-study" className="mb-8 scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center text-sm">📊</div>
              <h2 className="text-lg font-bold text-slate-900">Case Study</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6">
              <p className="text-sm text-slate-700 leading-relaxed">{lecture.caseStudy}</p>
            </div>
          </section>

          {/* ── Key Takeaways ────────────────────────────── */}
          <section id="takeaways" className="mb-10 scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center text-sm">✅</div>
              <h2 className="text-lg font-bold text-slate-900">Key Takeaways</h2>
            </div>
            <ul className="space-y-2.5">
              {lecture.takeaways.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3.5 bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-colors duration-150"
                >
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-slate-200 mb-10" />

          {/* ── Quiz ─────────────────────────────────────── */}
          <section id="quiz" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  🧠 Knowledge Quiz
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {lecture.quiz.length} questions · test your understanding of {lecture.title}
                </p>
              </div>
            </div>
            <QuizComponent questions={lecture.quiz} />
          </section>

          {/* Lecture helpfulness rating */}
          <LectureHelpfulness />

          {/* Back navigation */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <Link href={`/subjects/${subjectSlug}`} className="btn-secondary">
              ← Back to {subject.name}
            </Link>
          </div>
        </div>

        {/* ─── Sticky sidebar (desktop) ────────────────────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <LectureSidebar sections={sidebarSections} lectureTitle={lecture.title} />

            {/* Metadata card */}
            <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
              <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-widest">
                Lecture Info
              </p>
              {lecture.difficulty && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Difficulty</span>
                  <DifficultyBadge difficulty={lecture.difficulty} />
                </div>
              )}
              {lecture.estimatedReadTime && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Read time</span>
                  <span className="text-slate-600 font-medium">{lecture.estimatedReadTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Questions</span>
                <span className="text-slate-600 font-medium">{lecture.quiz.length} MCQs</span>
              </div>
              {lecture.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Updated</span>
                  <span className="text-slate-600 font-medium">{fmt(lecture.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
