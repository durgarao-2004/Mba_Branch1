import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search lectures, subjects, and key concepts across all MBA Learning Hub content.',
};

export default function SearchPage() {
  return <SearchClient />;
}
