'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/',            label: 'Home' },
  { href: '/subjects',    label: 'Subjects' },
  { href: '/case-studies',label: 'Case Studies' },
  { href: '/attendance',  label: 'Attendance' },
  { href: '/search',      label: 'Search' },
  { href: '/about',       label: 'About' },
];

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { currentUser, userProfile, loading, logout } = useAuth();
  const [open, setOpen]       = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  }

  // Avatar initials from display name or email
  const initials = currentUser
    ? (currentUser.displayName ?? currentUser.email ?? 'U')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold group-hover:bg-blue-700 transition-colors">
              M
            </div>
            <span className="font-bold text-slate-900 text-base hidden sm:block">
              MBA Learning Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <NotificationBell />

            {!loading && (
              <>
                {currentUser ? (
                  /* ── Logged-in state ─────────────────────────────── */
                  <div className="flex items-center gap-2">
                    {userProfile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                          pathname === '/admin'
                            ? 'bg-rose-50 text-rose-700'
                            : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        ⚡ Admin Portal
                      </Link>
                    )}
                    {userProfile?.role !== 'admin' && (
                      <Link
                        href="/dashboard"
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                          pathname === '/dashboard'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        Dashboard
                      </Link>
                    )}
                    {/* Avatar + logout */}
                    <div className="flex items-center gap-2 pl-1">
                      <div
                        className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        title={userProfile?.fullName ?? currentUser.displayName ?? currentUser.email ?? ''}
                      >
                        {initials}
                      </div>
                      {userProfile?.role === 'mentor' && (
                        <span className="hidden lg:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          🎓 Mentor
                        </span>
                      )}
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        {loggingOut ? '…' : 'Logout'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Guest state ─────────────────────────────────── */
                  <div className="flex items-center gap-2">
                    <Link
                      href="/request"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        pathname === '/request'
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50'
                      }`}
                    >
                      ✉ Request Subject
                    </Link>
                    <Link
                      href="/login"
                      className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link href="/signup" className="btn-primary text-sm">
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile: bell + search + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <NotificationBell />
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <SearchIcon />
            </Link>
            <button
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 py-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile auth section */}
            {!loading && (
              <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
                {currentUser ? (
                  <>
                    {/* Logged-in mobile */}
                    <div className="px-3 py-2 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-slate-600 font-medium truncate block">
                          {userProfile?.fullName ?? currentUser.displayName ?? currentUser.email}
                        </span>
                        {userProfile?.role && userProfile.role !== 'admin' && (
                          <span className={`text-xs font-semibold ${
                            userProfile.role === 'mentor' ? 'text-purple-600' : 'text-slate-400'
                          }`}>
                            {userProfile.role === 'mentor' ? '🎓 Mentor' : '✦ Student'}
                          </span>
                        )}
                      </div>
                    </div>
                    {userProfile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        ⚡ Admin Portal
                      </Link>
                    )}
                    {userProfile?.role !== 'admin' && (
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {loggingOut ? 'Logging out…' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest mobile */}
                    <Link
                      href="/request"
                      onClick={() => setOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/request'
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                      }`}
                    >
                      ✉ Request a Subject
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Log in
                    </Link>
                    <div className="pt-1">
                      <Link
                        href="/signup"
                        onClick={() => setOpen(false)}
                        className="btn-primary w-full justify-center"
                      >
                        Sign Up Free
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
