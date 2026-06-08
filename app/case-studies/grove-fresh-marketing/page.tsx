import type { Metadata } from 'next';
import GroveFreshContent from './GroveFreshContent';

const BASE_URL = 'https://mba.collabex.online';
const url = `${BASE_URL}/case-studies/grove-fresh-marketing`;

export const metadata: Metadata = {
  title: 'Grove Fresh Marketing Strategy — MBA Marketing Management Case Study',
  description:
    'A detailed MBA marketing case study on Grove Fresh — analysing market segmentation, branding, consumer behaviour, and the 4Ps of marketing for a fresh produce brand.',
  keywords: [
    'Grove Fresh case study',
    'MBA marketing case study',
    'marketing management MBA',
    'consumer behaviour case study',
    'market segmentation MBA',
    'branding MBA notes',
    'marketing mix 4Ps',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: 'article',
    url,
    title: 'Grove Fresh Marketing Strategy — MBA Case Study',
    description:
      'Marketing strategy case study on Grove Fresh — segmentation, branding, and the 4Ps applied to a fresh produce business. Ideal for MBA Marketing Management revision.',
    siteName: 'MBA Learning Hub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Grove Fresh Marketing Case Study — MBA Learning Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grove Fresh Marketing Strategy — MBA Case Study',
    description:
      'Consumer behaviour, segmentation, and branding case study on Grove Fresh. MBA Marketing Management.',
    images: ['/og-image.png'],
  },
};

export default function GroveFreshMarketingPage() {
  return <GroveFreshContent />;
}
