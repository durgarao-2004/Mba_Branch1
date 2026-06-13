'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ── Types ─────────────────────────────────────────────────────────────────────

type Stage = 'verifying' | 'form' | 'success' | 'invalid';

type FormErrors = {
  password?: string;
  confirm?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

type StrengthResult = { level: 0 | 1 | 2 | 3; label: string; colour: string };

function getStrength(p: string): StrengthResult {
  if (p.length === 0) return { level: 0, label: '',       colour: ''              };
  if (p.length < 6)   return { level: 0, label: 'Too short', colour: 'bg-red-400' };
  if (p.length < 8)   return { level: 1, label: 'Weak',      colour: 'bg-orange-400' };

  const has = (re: RegExp) => re.test(p);
  const score = [
    has(/[A-Z]/), has(/[a-z]/), has(/\d/), has(/[^a-zA-Z0-9]/),
  ].filter(Boolean).length;

  if (score <= 2) return { level: 1, label: 'Weak',   colour: 'bg-orange-400' };
  if (score === 3) return { level: 2, label: 'Good',   colour: 'bg-blue-500'   };
  return              { level: 3, label: 'Strong', colour: 'bg-emerald-500' };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResetClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const oobCode = searchParams.get('oobCode') ?? '';
  const mode    = searchParams.get('mode')    ?? '';

  const [stage,           setStage]           = useState<Stage>('verifying');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirm,         setConfirm]         = useState('');
  const [showPwd,         setShowPwd]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState<FormErrors>({});
  const [submitting,      setSubmitting]      = useState(false);
  const [invalidMessage,  setInvalidMessage]  = useState('');

  // ── Verify code on mount ────────────────────────────────────────────────────

  useEffect(() => {
    if (mode !== 'resetPassword' || !oobCode) {
      setInvalidMessage('This reset link is invalid. Please request a new one.');
      setStage('invalid');
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((accountEmail) => {
        setEmail(accountEmail);
        setStage('form');
      })
      .catch((err: { code?: string }) => {
        const code = err.code ?? '';
        if (code === 'auth/expired-action-code') {
          setInvalidMessage('This reset link has expired. Reset links are only valid for 1 hour.');
        } else if (code === 'auth/invalid-action-code') {
          setInvalidMessage('This reset link has already been used or is invalid.');
        } else {
          setInvalidMessage('Unable to verify reset link. Please request a new one.');
        }
        setStage('invalid');
      });
  }, [oobCode, mode]);

  // ── Auto-redirect after success ─────────────────────────────────────────────

  useEffect(() => {
    if (stage !== 'success') return;
    const t = setTimeout(() => router.replace('/login'), 4000);
    return () => clearTimeout(t);
  }, [stage, router]);

  // ── Form validation ─────────────────────────────────────────────────────────

  function validate(): boolean {
    const e: FormErrors = {};
    if (password.length < 8)      e.password = 'Password must be at least 8 characters.';
    if (password !== confirm)      e.confirm  = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStage('success');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/expired-action-code') {
        setInvalidMessage('This reset link expired while you were filling in the form. Please request a new one.');
        setStage('invalid');
      } else if (code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak. Use at least 8 characters with mixed case and numbers.' });
      } else {
        setErrors({ password: 'Failed to update password. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ── Input class helper ──────────────────────────────────────────────────────

  const inpCls = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors placeholder-slate-400 ${
      err
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  const strength = getStrength(password);

  // ── Shared page shell ───────────────────────────────────────────────────────

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );

  // ── STAGE: verifying ────────────────────────────────────────────────────────

  if (stage === 'verifying') {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Verifying your reset link…</p>
        </div>
      </Shell>
    );
  }

  // ── STAGE: invalid ──────────────────────────────────────────────────────────

  if (stage === 'invalid') {
    return (
      <Shell>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-7">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset link problem</h1>
            <p className="text-blue-200 text-sm mt-1">We couldn&apos;t verify this link</p>
          </div>

          <div className="px-8 py-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ✕
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Link invalid or expired</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {invalidMessage}
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Request a new reset link
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-700 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  // ── STAGE: success ──────────────────────────────────────────────────────────

  if (stage === 'success') {
    return (
      <Shell>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-7">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Password updated</h1>
            <p className="text-blue-200 text-sm mt-1">You can now log in with your new password</p>
          </div>

          <div className="px-8 py-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Password reset successful!</h2>
            <p className="text-sm text-slate-500 mb-2 leading-relaxed">
              Your password has been updated for{' '}
              <span className="font-medium text-slate-700">{email}</span>.
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Redirecting to login in a moment…
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Go to Login →
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // ── STAGE: form ─────────────────────────────────────────────────────────────

  return (
    <Shell>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Header band */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-7">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create new password</h1>
          <p className="text-blue-200 text-sm mt-1 truncate">
            Resetting password for <span className="font-medium text-white">{email}</span>
          </p>
        </div>

        <div className="px-8 py-7">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                New password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={`${inpCls(errors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon visible={showPwd} />
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < strength.level ? strength.colour : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`text-xs font-medium ${
                      strength.level === 3 ? 'text-emerald-600' :
                      strength.level === 2 ? 'text-blue-600'    :
                      'text-orange-600'
                    }`}>
                      {strength.label}
                    </p>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setErrors((prev) => ({ ...prev, confirm: '' }));
                  }}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className={`${inpCls(errors.confirm)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>

              {confirm.length > 0 && password.length > 0 && !errors.confirm && (
                <p className={`mt-1.5 text-xs font-medium ${
                  password === confirm ? 'text-emerald-600' : 'text-orange-500'
                }`}>
                  {password === confirm ? '✓ Passwords match' : 'Passwords do not match yet'}
                </p>
              )}
              {errors.confirm && (
                <p className="mt-1.5 text-xs text-red-600">{errors.confirm}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
            >
              {submitting ? 'Updating password…' : 'Update Password'}
            </button>

            <p className="text-center text-xs text-slate-400">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-700 font-medium hover:underline text-xs">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Shell>
  );
}
