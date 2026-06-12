'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':       'Incorrect password. Please try again.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/invalid-credential':   'Invalid email or password.',
    'auth/too-many-requests':    'Too many failed attempts. Please try again later.',
    'auth/user-disabled':        'This account has been disabled.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
  };
  return map[code] ?? 'Login failed. Please try again.';
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-7">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-blue-200 text-sm mt-1">Log in to your student account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

            {/* Global error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                <span className="mt-0.5 flex-shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@college.edu"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Your password"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">or</span>
              </div>
            </div>

            {/* Signup link */}
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-700 font-medium hover:underline">
                Create one free
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Protected by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
