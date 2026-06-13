'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { subjects } from '@/lib/subjects';
import { useRecentlyViewed, RecentItem } from '@/hooks/useRecentlyViewed';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MsgForm {
  category: string;
  title: string;
  message: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetType: 'all' | 'specific';
  targetUid?: string | null;
  createdAt?: { seconds: number } | null;
  readBy?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Static data & constants
// ─────────────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon: '📚', label: 'Browse Subjects',  href: '/subjects',     colorBg: 'bg-blue-50',    colorText: 'text-blue-700',   hoverBorder: 'hover:border-blue-200'   },
  { icon: '🧠', label: 'Quiz Zone',        href: '/subjects',     colorBg: 'bg-violet-50',  colorText: 'text-violet-700', hoverBorder: 'hover:border-violet-200' },
  { icon: '📅', label: 'Attendance Tool',  href: '/attendance',   colorBg: 'bg-emerald-50', colorText: 'text-emerald-700',hoverBorder: 'hover:border-emerald-200'},
  { icon: '📊', label: 'Case Studies',     href: '/case-studies', colorBg: 'bg-amber-50',   colorText: 'text-amber-700',  hoverBorder: 'hover:border-amber-200'  },
];

const MESSAGE_CATEGORIES = [
  { value: 'doubt',                label: '🤔 Academic Doubt / Question'  },
  { value: 'lecture-request',      label: '📚 Request a Lecture'          },
  { value: 'case-study-request',   label: '📊 Request a Case Study'       },
  { value: 'feature-suggestion',   label: '💡 Feature Suggestion'         },
  { value: 'bug-report',           label: '🐛 Report an Issue'            },
  { value: 'other',                label: '✉ Other'                       },
];

// Flatten all subjects → lectures with subject info attached
const allLectures = subjects.flatMap((s) =>
  s.lectures.map((lec) => ({ ...lec, subject: s }))
);

const lectureCount       = allLectures.length;
const subjectCount       = subjects.length;
const activeSubjectCount = subjects.filter((s) => s.lectures.length > 0).length;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page — auth guard + data loading
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router                                                    = useRouter();
  const { currentUser, userProfile, loading: authLoading,
          profileLoading }                                        = useAuth();
  const { items: recentItems }                                    = useRecentlyViewed();

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/login');
    }
  }, [authLoading, currentUser, router]);

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.fullName ?? currentUser.displayName ?? 'Student';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Welcome header ─────────────────────────────────────────────── */}
        <WelcomeHeader
          name={displayName}
          semester={userProfile?.semester}
          specialization={userProfile?.specialization}
          role={userProfile?.role}
          loading={profileLoading}
        />

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <StatsRow />

        {/* ── Quick actions ──────────────────────────────────────────────── */}
        <QuickActions />

        {/* ── Main 2-column grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearning recentItems={recentItems} />
            <AvailableLectures />
            <QuizZone />
          </div>

          {/* Right — 1/3 */}
          <div className="space-y-6">
            <NotificationsCard uid={currentUser.uid} />
            <AttendanceCard />
            <SavedContent />
          </div>
        </div>

        {/* ── Message Admin — full width ──────────────────────────────────── */}
        <MessageAdmin
          uid={currentUser.uid}
          studentName={displayName}
          studentEmail={currentUser.email ?? ''}
        />

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section components
// ─────────────────────────────────────────────────────────────────────────────

// ── Role Badge ────────────────────────────────────────────────────────────────
// Reads directly from Firestore role field — no hardcoded values.

const ROLE_CONFIG: Record<string, { label: string; cls: string }> = {
  admin:   { label: '⚡ Admin',   cls: 'bg-rose-400/25 text-rose-200 border-rose-400/40' },
  mentor:  { label: '🎓 Mentor',  cls: 'bg-purple-400/25 text-purple-200 border-purple-400/40' },
  student: { label: '✦ Student', cls: 'bg-amber-400/20 text-amber-200 border-amber-400/30' },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? {
    label: `✦ ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    cls:   'bg-white/10 text-blue-100 border-white/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ── Welcome Header ────────────────────────────────────────────────────────────

function WelcomeHeader({
  name, semester, specialization, role, loading,
}: {
  name: string;
  semester?: string;
  specialization?: string;
  role?: string;
  loading: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
      {/* Subtle decorative ring */}
      <div className="absolute -top-10 -right-10 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />
      <div className="absolute -top-4 -right-4 w-32 h-32 border border-white/10 rounded-full pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-blue-200 text-sm font-medium mb-1">{getGreeting()} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{name}</h1>

          {!loading && (
            <div className="flex flex-wrap gap-2">
              {semester && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 text-blue-100 px-3 py-1 rounded-full border border-white/10">
                  📅 {semester}
                </span>
              )}
              {specialization && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 text-blue-100 px-3 py-1 rounded-full border border-white/10">
                  🎯 {specialization}
                </span>
              )}
              <RoleBadge role={role ?? 'student'} />
            </div>
          )}
          {loading && (
            <div className="flex gap-2 mt-2">
              <div className="h-6 w-28 bg-white/10 rounded-full animate-pulse" />
              <div className="h-6 w-36 bg-white/10 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        <div className="hidden sm:flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center text-3xl flex-shrink-0 border border-white/20">
          🎓
        </div>
      </div>
    </div>
  );
}

// ── Stats Row ─────────────────────────────────────────────────────────────────

function StatsRow() {
  const stats = [
    {
      icon: '📚', label: 'Total Subjects',      value: subjectCount,
      sub: `${activeSubjectCount} with lectures`,
      iconBg: 'bg-blue-50',    iconText: 'text-blue-700',
    },
    {
      icon: '📝', label: 'Lectures Available',  value: lectureCount,
      sub: 'Ready to study now',
      iconBg: 'bg-emerald-50', iconText: 'text-emerald-700',
    },
    {
      icon: '🧠', label: 'Quizzes Available',   value: lectureCount,
      sub: 'MCQ per lecture',
      iconBg: 'bg-violet-50',  iconText: 'text-violet-700',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <span className={`inline-flex w-8 h-8 rounded-lg ${s.iconBg} ${s.iconText} items-center justify-center text-base mb-2`}>
            {s.icon}
          </span>
          <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          <p className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</p>
          <p className="text-xs text-slate-400">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Quick Actions ─────────────────────────────────────────────────────────────

function QuickActions() {
  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={`flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border border-slate-200 ${a.hoverBorder} hover:shadow-sm transition-all duration-150`}
          >
            <span className={`w-11 h-11 ${a.colorBg} ${a.colorText} rounded-xl flex items-center justify-center text-xl`}>
              {a.icon}
            </span>
            <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{a.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Continue Learning ─────────────────────────────────────────────────────────

function ContinueLearning({ recentItems }: { recentItems: RecentItem[] }) {
  const hasRecent = recentItems.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center text-sm">▶</span>
          <h2 className="font-semibold text-slate-900">Continue Learning</h2>
        </div>
        <Link href="/subjects" className="text-xs text-blue-600 hover:underline font-medium">
          All subjects →
        </Link>
      </div>

      {hasRecent ? (
        <div className="space-y-2">
          {recentItems.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
            >
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                {item.subjectIcon ?? '📝'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                  {item.title}
                </p>
                {item.subjectName && (
                  <p className="text-xs text-slate-500 truncate">{item.subjectName}</p>
                )}
              </div>
              <span className="text-slate-300 group-hover:text-blue-400 transition-colors text-sm flex-shrink-0">→</span>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">
            Suggested for you — visit any lecture to track your progress here.
          </p>
          <div className="space-y-2">
            {allLectures.slice(0, 3).map(({ subject, ...lecture }) => (
              <Link
                key={lecture.slug}
                href={`/subjects/${subject.slug}/${lecture.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
              >
                <div className={`w-9 h-9 ${subject.bgClass} rounded-lg flex items-center justify-center text-base flex-shrink-0 border ${subject.borderClass}`}>
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                    {lecture.title}
                  </p>
                  <p className={`text-xs ${subject.colorClass} truncate`}>{subject.name}</p>
                </div>
                <span className="text-xs text-amber-500 font-semibold flex-shrink-0">Start →</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Available Lectures ────────────────────────────────────────────────────────

function AvailableLectures() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-sm">📚</span>
          <h2 className="font-semibold text-slate-900">Available Lectures</h2>
        </div>
        <Link href="/subjects" className="text-xs text-blue-600 hover:underline font-medium">
          Browse all →
        </Link>
      </div>

      <div className="space-y-2.5">
        {allLectures.map(({ subject, ...lecture }) => (
          <Link
            key={lecture.slug}
            href={`/subjects/${subject.slug}/${lecture.slug}`}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
          >
            <div className={`w-10 h-10 ${subject.bgClass} rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${subject.borderClass}`}>
              {subject.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${subject.colorClass} mb-0.5`}>{subject.name}</p>
              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                {lecture.title}
              </p>
              <p className="text-xs text-slate-400 truncate">{lecture.description}</p>
            </div>
            <span className="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Quiz Zone ─────────────────────────────────────────────────────────────────

function QuizZone() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 bg-violet-50 border border-violet-200 rounded-lg flex items-center justify-center text-sm">🧠</span>
        <h2 className="font-semibold text-slate-900">Quiz Zone</h2>
        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium ml-1">
          {lectureCount} available
        </span>
      </div>

      <div className="space-y-2.5">
        {allLectures.map(({ subject, ...lecture }) => (
          <Link
            key={lecture.slug}
            href={`/subjects/${subject.slug}/${lecture.slug}#quiz`}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/40 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl flex-shrink-0">{subject.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                  {lecture.title}
                </p>
                <p className="text-xs text-slate-500">{subject.name} · MCQ Quiz</p>
              </div>
            </div>
            <span className="flex-shrink-0 ml-3 text-xs font-semibold bg-violet-100 text-violet-700 group-hover:bg-violet-200 px-3 py-1 rounded-full transition-colors whitespace-nowrap">
              Take Quiz →
            </span>
          </Link>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
        More quizzes will be added as new lectures are uploaded.
      </p>
    </div>
  );
}

// ── Notifications Card ────────────────────────────────────────────────────────

function NotificationsCard({ uid }: { uid: string }) {
  const [items, setItems]       = useState<NotificationItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        // Two separate queries to avoid composite index requirement
        const [allSnap, specificSnap] = await Promise.all([
          getDocs(query(collection(db, 'notifications'), where('targetType', '==', 'all'))),
          getDocs(query(collection(db, 'notifications'), where('targetUid', '==', uid))),
        ]);

        const combined: NotificationItem[] = [
          ...allSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as NotificationItem),
          ...specificSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as NotificationItem),
        ];

        // De-duplicate by id and sort newest first
        const seen = new Set<string>();
        const unique = combined
          .filter((n) => { if (seen.has(n.id)) return false; seen.add(n.id); return true; })
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
          .slice(0, 8);

        setItems(unique);
      } catch {
        // show empty state on error
      } finally {
        setFetching(false);
      }
    }

    fetchNotifications();
  }, [uid]);

  async function markRead(notifId: string) {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { readBy: arrayUnion(uid) });
      setItems((prev) =>
        prev.map((n) =>
          n.id === notifId ? { ...n, readBy: [...(n.readBy ?? []), uid] } : n
        )
      );
    } catch { /* ignore */ }
  }

  async function markAllRead() {
    const unreadItems = items.filter((n) => !n.readBy?.includes(uid));
    await Promise.all(unreadItems.map((n) => markRead(n.id)));
  }

  const unreadCount = items.filter((n) => !n.readBy?.includes(uid)).length;

  function fmtAge(seconds?: number | null): string {
    if (!seconds) return '';
    const diff = Math.floor((Date.now() / 1000) - seconds);
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-sm">🔔</span>
          <h2 className="font-semibold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-2xl mb-2">🔔</div>
          <p className="text-xs text-slate-400">No notifications yet.</p>
          <p className="text-xs text-slate-400 mt-0.5">Check back when the admin posts updates.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((n) => {
            const isRead = n.readBy?.includes(uid) ?? false;
            return (
              <div
                key={n.id}
                onClick={() => !isRead && markRead(n.id)}
                className={`flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isRead ? 'opacity-60 hover:opacity-80 hover:bg-slate-50' : 'hover:bg-blue-50'
                }`}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <span className="text-base">🔔</span>
                  {!isRead && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${isRead ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                    {n.title}
                  </p>
                  {n.message && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug truncate">{n.message}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">{fmtAge(n.createdAt?.seconds)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Attendance Card ───────────────────────────────────────────────────────────

function AttendanceCard() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📅</span>
            <h2 className="font-semibold text-slate-900">Attendance</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Track your class attendance. Know how many lectures you can skip while staying above the 75% requirement.
          </p>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Open Calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Saved Content (placeholder) ───────────────────────────────────────────────

function SavedContent() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center text-sm">🔖</span>
        <h2 className="font-semibold text-slate-900">Saved Content</h2>
      </div>

      <div className="text-center py-4">
        <div className="text-3xl mb-2">🔖</div>
        <p className="text-sm font-medium text-slate-700 mb-1">Nothing saved yet</p>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Save lectures and case studies for quick access from your dashboard.
        </p>
        <Link
          href="/subjects"
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Browse Subjects →
        </Link>
      </div>

      {/* Placeholder skeleton for when content exists */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">Bookmarks feature — coming soon</p>
      </div>
    </div>
  );
}

// ── Message Admin ─────────────────────────────────────────────────────────────

function MessageAdmin({
  uid, studentName, studentEmail,
}: {
  uid: string;
  studentName: string;
  studentEmail: string;
}) {
  const [form, setForm]     = useState<MsgForm>({ category: '', title: '', message: '' });
  const [errors, setErrors] = useState<Partial<MsgForm>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  }

  function validate(): boolean {
    const e: Partial<MsgForm> = {};
    if (!form.category)                              e.category = 'Please select a category.';
    if (!form.title.trim())                          e.title    = 'Please enter a subject / title.';
    if (form.message.trim().length < 10)             e.message  = 'Message must be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');

    try {
      await addDoc(collection(db, 'messages'), {
        senderUid:   uid,
        senderName:  studentName,
        senderEmail: studentEmail,
        category:    form.category,
        subject:     form.title.trim(),
        message:     form.message.trim(),
        status:      'unread',
        createdAt:   serverTimestamp(),
      });
      setSent(true);
    } catch {
      setSubmitError('Failed to send. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm({ category: '', title: '', message: '' });
    setErrors({});
    setSubmitError('');
    setSent(false);
  }

  const inpCls = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors placeholder-slate-400 ${
      err
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center text-white text-base flex-shrink-0">
          ✉
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Message Admin</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Request lectures, ask questions, or send suggestions directly to the platform team.
          </p>
        </div>
      </div>

      {sent ? (
        /* ── Success state ─────────────────────────────────────────────── */
        <div className="text-center py-8 max-w-sm mx-auto">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Message Sent!</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Your message has been delivered to the admin team. We&apos;ll review it and respond to your registered email.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        /* ── Form ──────────────────────────────────────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">

          {submitError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <span>⚠</span> {submitError}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inpCls(errors.category)}
            >
              <option value="">Select a category…</option>
              {MESSAGE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Subject / Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Request: Capital Budgeting lecture notes"
              className={inpCls(errors.title)}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              placeholder="Describe your request, doubt, or suggestion in detail…"
              className={`${inpCls(errors.message)} resize-none`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.message
                ? <p className="text-xs text-red-600">{errors.message}</p>
                : <span />
              }
              <p className="text-xs text-slate-400 ml-auto">{form.message.length}/1000</p>
            </div>
          </div>

          {/* From row */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            <span>👤</span>
            <span>Sending as <strong className="text-slate-700">{studentName}</strong> · {studentEmail}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
