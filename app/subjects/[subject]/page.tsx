import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LectureCard from '@/components/LectureCard';
import EmptyLectureState from '@/components/EmptyLectureState';
import JsonLd from '@/components/JsonLd';
import { subjects, getSubjectBySlug } from '@/lib/subjects';

const BASE_URL = 'https://mba.collabex.online';

interface PageProps {
  params: Promise<{ subject: string }>;
}

export async function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subject: slug } = await params;
  const subject = getSubjectBySlug(slug);
  if (!subject) return { title: 'Subject Not Found' };

  const title = `${subject.name} Lecture Notes & Study Material`;
  const description = `${subject.description} Access ${subject.lectures.length > 0 ? subject.lectures.length + ' structured lecture notes with' : 'structured lecture notes with'} quizzes, key concepts, and downloadable revision material.`;
  const url = `${BASE_URL}/subjects/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'MBA Learning Hub',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${subject.name} — MBA Learning Hub`,
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

export default async function SubjectPage({ params }: PageProps) {
  const { subject: slug } = await params;
  const subject = getSubjectBySlug(slug);

  if (!subject) notFound();

  const url = `${BASE_URL}/subjects/${slug}`;

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: subject.name,
    description: subject.description,
    url,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'MBA Learning Hub',
      url: BASE_URL,
    },
    hasCourseInstance: subject.lectures.map((lecture) => ({
      '@type': 'CourseInstance',
      name: lecture.title,
      url: `${url}/${lecture.slug}`,
      courseMode: 'online',
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Subjects', item: `${BASE_URL}/subjects` },
      { '@type': 'ListItem', position: 3, name: subject.name, item: url },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/subjects" className="hover:text-slate-600 transition-colors">Subjects</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{subject.name}</span>
      </nav>

      {/* Subject header */}
      <div className={`${subject.bgClass} border-2 ${subject.borderClass} rounded-2xl p-6 sm:p-8 mb-8`}>
        <div className="flex items-start gap-5">
          <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm border ${subject.borderClass} flex-shrink-0`}>
            {subject.icon}
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${subject.colorClass} mb-2`}>
              {subject.name}
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {subject.description}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-slate-400">
                📚 {subject.lectures.length > 0
                  ? `${subject.lectures.length} lecture${subject.lectures.length !== 1 ? 's' : ''} available`
                  : 'Lectures uploading soon'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures */}
      <div>
        <h2 className="font-bold text-slate-900 text-lg mb-4">Lectures</h2>

        {subject.lectures.length === 0 ? (
          <EmptyLectureState subjectName={subject.name} />
        ) : (
          <div className="space-y-3">
            {subject.lectures.map((lecture, i) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                subjectSlug={subject.slug}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
