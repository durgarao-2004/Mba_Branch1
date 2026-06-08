import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { subjects } from '@/lib/subjects';
import { getAllLectureSlugs } from '@/lib/content';

const BASE_URL = 'https://mba.collabex.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static pages ───────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/subjects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/attendance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/request`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // ── Subject pages ──────────────────────────────────────────────────────────
  const subjectPages: MetadataRoute.Sitemap = subjects.map((subject) => ({
    url: `${BASE_URL}/subjects/${subject.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── Lecture pages ──────────────────────────────────────────────────────────
  const lectureSlugs = getAllLectureSlugs();
  const lecturePages: MetadataRoute.Sitemap = lectureSlugs.map(({ subject, lecture }) => ({
    url: `${BASE_URL}/subjects/${subject}/${lecture}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Case study pages ───────────────────────────────────────────────────────
  const caseStudyPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/case-studies/dominos-pulse-mis`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-studies/grove-fresh-marketing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticPages, ...subjectPages, ...lecturePages, ...caseStudyPages];
}
