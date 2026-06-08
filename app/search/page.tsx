import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search MBA Notes & Lectures',
  description:
    'Search across all MBA lecture notes, key concepts, subjects, and case studies on MBA Learning Hub. Find exactly what you need to study.',
  alternates: {
    canonical: 'https://mba.collabex.online/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
