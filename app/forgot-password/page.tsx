'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        // Don't reveal whether email exists — show success either way for security
        setSent(true);
      } else if (code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-7">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset your password</h1>
            <p className="text-blue-200 text-sm mt-1">We&apos;ll send a reset link to your email</p>
          </div>

          <div className="px-8 py-7">

            {sent ? (
              /* ── Success state ─────────────────────────────────────── */
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  ✉
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  If an account exists for <span className="font-medium text-slate-700">{email}</span>,
                  a password reset link has been sent. Check your spam folder if you don&apos;t see it.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              /* ── Form state ────────────────────────────────────────── */
              <form onSubmit={handleSubmit} className="space-y-5">

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    <span className="mt-0.5 flex-shrink-0">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@college.edu"
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Remember your password?{' '}
                  <Link href="/login" className="text-blue-700 font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
