import type { Metadata } from 'next';
import DominosMISContent from './DominosMISContent';

const BASE_URL = 'https://mba.collabex.online';
const url = `${BASE_URL}/case-studies/dominos-pulse-mis`;

export const metadata: Metadata = {
  title: "Domino's PULSE MIS — Management Information Systems Case Study",
  description:
    "How Domino's Pizza used its PULSE Management Information System to slash order times, improve accuracy, and scale to 18,000+ locations globally. A detailed MBA MIS case study.",
  keywords: [
    "Domino's MIS case study",
    'PULSE management information system',
    'MBA case study MIS',
    'information systems MBA',
    'pizza delivery technology',
    'restaurant technology MIS',
    'MBA information systems notes',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: 'article',
    url,
    title: "Domino's PULSE MIS — MBA Case Study",
    description:
      "How Domino's used its PULSE MIS to scale to 18,000+ locations. A real-world MBA Information Systems case study with analysis and key lessons.",
    siteName: 'MBA Learning Hub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Domino's PULSE MIS Case Study — MBA Learning Hub",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Domino's PULSE MIS — MBA Case Study",
    description:
      "How Domino's used its PULSE Management Information System to revolutionize pizza delivery. MBA IS case study.",
    images: ['/og-image.png'],
  },
};

export default function DominosMISPage() {
  return <DominosMISContent />;
}
