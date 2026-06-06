import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeedbackButton from '@/components/FeedbackButton';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: {
    default: 'MBA Learning Hub — Student-Driven MBA Learning Platform',
    template: '%s | MBA Learning Hub',
  },
  description:
    'A student-driven MBA learning platform with daily classroom lecture notes, structured summaries, interactive quizzes, and downloadable revision material organized by subject.',
  keywords: ['MBA', 'lecture notes', 'revision', 'quiz', 'finance', 'marketing', 'economics', 'classroom notes'],
  openGraph: {
    title: 'MBA Learning Hub',
    description: 'Daily classroom lecture notes, quizzes, and revision material — organized for MBA students.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
