'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function timeLeft(seconds: number): string {
  const remaining = Math.max(0, seconds - Date.now() / 1000);
  if (remaining <= 0) return 'shortly';
  const days  = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const mins  = Math.floor((remaining % 3600) / 60);
  if (days > 0)  return `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} and ${mins} minute${mins !== 1 ? 's' : ''}`;
  return `${mins} minute${mins !== 1 ? 's' : ''}`;
}

export default function SuspendedPage() {
  const router                                    = useRouter();
  const { currentUser, userProfile, loading, profileLoading } = useAuth();

  const suspEnds = userProfile?.suspensionEndsAt?.seconds ?? 0;
  const isSuspended = suspEnds > Date.now() / 1000;

  // Redirect away if not actually suspended
  useEffect(() => {
    if (loading || profileLoading) return;
    if (!currentUser) { router.replace('/login'); return; }
    if (!isSuspended) router.replace('/dashboard');
  }, [loading, profileLoading, currentUser, isSuspended, router]);

  if (loading || profileLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-7">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Account Suspended</h1>
            <p className="text-amber-100 text-sm mt-1">Your access has been temporarily restricted</p>
          </div>

          <div className="px-8 py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⏳
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Hi {userProfile?.fullName?.split(' ')[0] ?? 'there'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your account has been suspended for{' '}
                <strong className="text-amber-700">{timeLeft(suspEnds)}</strong>.
                During this period you cannot access the learning platform.
              </p>
            </div>

            {userProfile?.suspendedReason && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Reason</p>
                <p className="text-sm text-amber-900">{userProfile.suspendedReason}</p>
              </div>
            )}

            {suspEnds > 0 && (
              <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6 text-center">
                <p className="text-xs text-slate-500">Access restores on</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {new Date(suspEnds * 1000).toLocaleString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              If you believe this is a mistake, contact the platform administrator.
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
              <Link
                href="/"
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
