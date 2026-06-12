'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// ── Constants ──────────────────────────────────────────────────────────────────

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];

const SPECIALIZATIONS = [
  'Finance',
  'Marketing',
  'Human Resource Management',
  'Operations Management',
  'Business Analytics',
  'International Business',
  'Entrepreneurship',
  'Information Technology',
  'General Management',
];

const INTEREST_OPTIONS = [
  'Financial Management',
  'Marketing Management',
  'Managerial Economics',
  'Organizational Behavior',
  'Information Systems',
  'Data Science',
  'Business Strategy',
  'Operations Research',
];

// ── Error mapper ───────────────────────────────────────────────────────────────

function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/too-many-requests':    'Too many attempts. Please try again later.',
  };
  return map[code] ?? 'Sign-up failed. Please try again.';
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    semester:        '',
    specialization:  '',
  });
  const [interests, setInterests]   = useState<string[]>([]);
  const [error, setError]           = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading]       = useState(false);

  // ── Field handlers ──────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  }

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim())           errors.fullName        = 'Full name is required.';
    if (!form.email.trim())              errors.email           = 'Email is required.';
    if (form.password.length < 6)        errors.password        = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
                                         errors.confirmPassword = 'Passwords do not match.';
    if (!form.semester)                  errors.semester        = 'Please select your semester.';
    if (!form.specialization)            errors.specialization  = 'Please select your specialization.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await updateProfile(cred.user, { displayName: form.fullName.trim() });

      await setDoc(doc(db, 'users', cred.user.uid), {
        uid:            cred.user.uid,
        fullName:       form.fullName.trim(),
        email:          form.email.trim().toLowerCase(),
        semester:       form.semester,
        specialization: form.specialization,
        interests,
        role:           'student',
        createdAt:      serverTimestamp(),
      });

      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-7">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-white/80 text-sm font-medium">MBA Learning Hub</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-blue-200 text-sm mt-1">Join the student learning community</p>
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

            {/* Full name */}
            <Field label="Full Name" error={fieldErrors.fullName}>
              <input
                name="fullName"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={form.fullName}
                onChange={handleChange}
                className={inputCls(!!fieldErrors.fullName)}
                autoComplete="name"
              />
            </Field>

            {/* Email */}
            <Field label="College Email" error={fieldErrors.email}>
              <input
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={handleChange}
                className={inputCls(!!fieldErrors.email)}
                autoComplete="email"
              />
            </Field>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Password" error={fieldErrors.password}>
                <input
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={inputCls(!!fieldErrors.password)}
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm Password" error={fieldErrors.confirmPassword}>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputCls(!!fieldErrors.confirmPassword)}
                  autoComplete="new-password"
                />
              </Field>
            </div>

            {/* Semester + Specialization row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Semester" error={fieldErrors.semester}>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className={selectCls(!!fieldErrors.semester)}
                >
                  <option value="">Select semester</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Specialization" error={fieldErrors.specialization}>
                <select
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className={selectCls(!!fieldErrors.specialization)}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Interests */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2.5">
                Areas of Interest <span className="text-slate-400 font-normal">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const active = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${
                        active
                          ? 'bg-blue-700 border-blue-700 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            {/* Footer link */}
            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-700 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-600">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

// ── Tiny helpers ───────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 outline-none transition-colors ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`;

const selectCls = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`;
