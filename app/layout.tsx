import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeedbackButton from '@/components/FeedbackButton';
import { Analytics } from '@vercel/analytics/react';

const BASE_URL = 'https://mba.collabex.online';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'MBA Learning Hub — Student-Driven MBA Learning Platform',
    template: '%s | MBA Learning Hub',
  },

  description:
    'A student-driven MBA learning platform with daily classroom lecture notes, structured summaries, interactive quizzes, and downloadable revision material — organized by subject for MBA students.',

  keywords: [
    'MBA learning hub',
    'MBA lecture notes',
    'MBA revision material',
    'MBA case studies',
    'MBA quiz',
    'financial management notes',
    'managerial economics notes',
    'information systems MBA',
    'MBA study material',
    'MBA students India',
    'management education platform',
    'MBA classroom notes',
    'MBA subject notes',
    'MBA online learning',
  ],

  authors: [{ name: 'MBA Learning Hub', url: BASE_URL }],
  creator: 'MBA Learning Hub',
  publisher: 'MBA Learning Hub',

  // ── Google Search Console verification ─────────────────────────────────────
  // Replace the value below with your actual Google verification code.
  // Find it in Google Search Console → Settings → Ownership verification → HTML tag.
  // Example: if your tag is <meta name="google-site-verification" content="abc123"/>
  // set the value to 'abc123'.
  verification: {
    google: 'ymPfnVe-Rmd5SKFb9AeVuZXam5qNPVDnABQ7wXTSF-c',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'MBA Learning Hub',
    title: 'MBA Learning Hub — Student-Driven MBA Learning Platform',
    description:
      'Daily classroom lecture notes, structured summaries, interactive quizzes, case studies, and downloadable revision material for MBA students.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MBA Learning Hub — lecture notes, quizzes, and case studies for MBA students',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'MBA Learning Hub — Student-Driven MBA Learning Platform',
    description:
      'Daily classroom lecture notes, structured summaries, interactive quizzes, case studies, and downloadable revision material for MBA students.',
    images: ['/og-image.png'],
    creator: '@mbalearninghub',
  },

  alternates: {
    canonical: BASE_URL,
  },

  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MBA Learning Hub',
    url: BASE_URL,
    description:
      'A student-driven MBA learning platform with lecture notes, quizzes, case studies, and revision material.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'MBA Learning Hub',
    url: BASE_URL,
    description:
      'A student-driven MBA learning platform offering structured lecture notes, quizzes, case studies, and downloadable revision material.',
    educationalCredentialAwarded: 'MBA',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'MBA Subjects',
      itemListElement: [
        { '@type': 'Course', name: 'Financial Management', url: `${BASE_URL}/subjects/financial-management` },
        { '@type': 'Course', name: 'Managerial Economics', url: `${BASE_URL}/subjects/managerial-economics` },
        { '@type': 'Course', name: 'Information Systems', url: `${BASE_URL}/subjects/information-systems` },
        { '@type': 'Course', name: 'Marketing Management', url: `${BASE_URL}/subjects/marketing-management` },
        { '@type': 'Course', name: 'Organizational Behavior', url: `${BASE_URL}/subjects/organizational-behavior` },
        { '@type': 'Course', name: 'Data Science', url: `${BASE_URL}/subjects/data-science` },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FeedbackButton />
        <Analytics />
      </body>
    </html>
  );
}
