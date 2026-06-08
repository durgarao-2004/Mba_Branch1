import type { Metadata } from 'next';
import AttendanceClient from './AttendanceClient';

export const metadata: Metadata = {
  title: 'Attendance Calculator',
  description:
    'Calculate your MBA attendance percentage, find out how many classes you can skip while staying above 75%, and check how many you need to attend to recover.',
  alternates: {
    canonical: 'https://mba.collabex.online/attendance',
  },
  openGraph: {
    type: 'website',
    url: 'https://mba.collabex.online/attendance',
    title: 'MBA Attendance Calculator',
    description:
      'Calculate your MBA attendance percentage instantly. Know exactly how many classes you can skip or need to attend to maintain 75% attendance.',
    siteName: 'MBA Learning Hub',
  },
  twitter: {
    card: 'summary',
    title: 'MBA Attendance Calculator',
    description:
      'Instantly check your MBA attendance percentage and find out how many classes you can skip or need to attend.',
  },
};

export default function AttendancePage() {
  return <AttendanceClient />;
}
