import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResetClient from './ResetClient';

export const metadata: Metadata = {
  title: 'Reset Password | MBA Learning Hub',
  description: 'Set a new password for your MBA Learning Hub account.',
  robots: { index: false, follow: false },
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Verifying reset link…</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetClient />
    </Suspense>
  );
}
