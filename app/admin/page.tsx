'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type AdminUser = {
  uid: string;
  fullName: string;
  email: string;
  semester?: string;
  specialization?: string;
  role: string;
  createdAt?: { seconds: number };
};

type AdminMessage = {
  id: string;
  senderName?: string;
  senderEmail?: string;
  senderUid?: string;
  studentName?: string;   // legacy field
  studentEmail?: string;  // legacy field
  subject?: string;
  title?: string;         // legacy field
  category?: string;
  message: string;
  status: string;
  createdAt?: { seconds: number };
};

type NotifForm = {
  title: string;
  message: string;
  targetType: 'all' | 'specific';
  targetUid: string;
};

type AdminTab = 'overview' | 'messages' | 'students' | 'notifications';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = ['student', 'mentor', 'admin'];

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'overview',      label: 'Overview',         icon: '📊' },
  { id: 'messages',      label: 'Messages',          icon: '✉'  },
  { id: 'students',      label: 'Students',          icon: '👥' },
  { id: 'notifications', label: 'Send Notification', icon: '🔔' },
];

const ROLE_BADGE: Record<string, string> = {
  admin:   'bg-rose-100 text-rose-700 border-rose-200',
  mentor:  'bg-purple-100 text-purple-700 border-purple-200',
  student: 'bg-blue-100 text-blue-700 border-blue-200',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtDate(seconds?: number): string {
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function fmtDatetime(seconds?: number): string {
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main admin page
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, userProfile, loading, profileLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [messages, setMessages]   = useState<AdminMessage[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Students tab filters
  const [search, setSearch]       = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  // Messages tab
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

  // Notification form
  const [notifForm, setNotifForm] = useState<NotifForm>({
    title: '', message: '', targetType: 'all', targetUid: '',
  });
  const [notifSending, setNotifSending] = useState(false);
  const [notifSent, setNotifSent]       = useState(false);
  const [notifError, setNotifError]     = useState('');
  const [notifErrors, setNotifErrors]   = useState<Partial<NotifForm>>({});

  // ── Auth guard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (loading || profileLoading) return;
    if (!currentUser) { router.replace('/login'); return; }
    if (userProfile?.role !== 'admin') router.replace('/dashboard');
  }, [loading, profileLoading, currentUser, userProfile, router]);

  // ── Load all data once ──────────────────────────────────────────────────────

  useEffect(() => {
    if (userProfile?.role !== 'admin') return;

    async function load() {
      setDataLoading(true);
      try {
        const [usersSnap, msgsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'messages')),
        ]);

        setUsers(
          usersSnap.docs
            .map((d) => ({ uid: d.id, ...d.data() }) as AdminUser)
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        );
        setMessages(
          msgsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }) as AdminMessage)
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        );
      } catch {
        // show empty state on error
      } finally {
        setDataLoading(false);
      }
    }

    load();
  }, [userProfile?.role]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleRoleChange(uid: string, newRole: string) {
    if (uid === currentUser?.uid) return;
    setUpdatingRole(uid);
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role: newRole } : u));
    } catch {
      // silently fail — role change will revert on next load
    } finally {
      setUpdatingRole(null);
    }
  }

  async function markMsgRead(msgId: string) {
    try {
      await updateDoc(doc(db, 'messages', msgId), { status: 'read' });
      setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, status: 'read' } : m));
    } catch { /* ignore */ }
  }

  function validateNotif(): boolean {
    const e: Partial<NotifForm> = {};
    if (!notifForm.title.trim())   e.title   = 'Title is required.';
    if (!notifForm.message.trim()) e.message = 'Message is required.';
    if (notifForm.targetType === 'specific' && !notifForm.targetUid)
      e.targetUid = 'Please select a recipient.';
    setNotifErrors(e);
    return Object.keys(e).length === 0;
  }

  async function sendNotification(e: FormEvent) {
    e.preventDefault();
    if (!validateNotif()) return;
    setNotifSending(true);
    setNotifError('');
    try {
      await addDoc(collection(db, 'notifications'), {
        title:      notifForm.title.trim(),
        message:    notifForm.message.trim(),
        targetType: notifForm.targetType,
        targetUid:  notifForm.targetType === 'specific' ? notifForm.targetUid : null,
        sentBy:     currentUser?.uid,
        createdAt:  serverTimestamp(),
        readBy:     [],
      });
      setNotifSent(true);
    } catch {
      setNotifError('Failed to send. Please try again.');
    } finally {
      setNotifSending(false);
    }
  }

  // ── Derived values ──────────────────────────────────────────────────────────

  const totalStudents  = users.filter((u) => u.role === 'student').length;
  const totalAdmins    = users.filter((u) => u.role === 'admin').length;
  const totalMentors   = users.filter((u) => u.role === 'mentor').length;
  const unreadMessages = messages.filter((m) => m.status !== 'read').length;
  const recentSignups  = users.slice(0, 6);

  const semesters       = [...new Set(users.map((u) => u.semester).filter(Boolean) as string[])].sort();
  const specializations = [...new Set(users.map((u) => u.specialization).filter(Boolean) as string[])].sort();

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (!q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
      (!semFilter  || u.semester       === semFilter)  &&
      (!specFilter || u.specialization === specFilter)
    );
  });

  // ── Loading / access guard ──────────────────────────────────────────────────

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading admin panel…</span>
        </div>
      </div>
    );
  }

  if (!currentUser || userProfile?.role !== 'admin') return null;

  // ── Shared input class helper ───────────────────────────────────────────────

  const inpCls = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors placeholder-slate-400 ${
      err
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                ⚡ Admin Portal
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage students, messages, and notifications — logged in as{' '}
              <span className="font-medium text-slate-700">{userProfile?.fullName}</span>
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex-shrink-0 text-sm text-slate-600 hover:text-slate-900 font-medium border border-slate-200 px-4 py-2 rounded-xl hover:bg-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const badge = tab.id === 'messages' && unreadMessages > 0 ? unreadMessages : null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                {tab.label}
                {badge && (
                  <span className={`ml-0.5 min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-bold flex items-center justify-center ${
                    isActive ? 'bg-white text-blue-900' : 'bg-red-500 text-white'
                  }`}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Fetching data from Firestore…</span>
            </div>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users',     value: users.length,     icon: '👥', ring: 'ring-blue-100',    num: 'text-blue-700'    },
                    { label: 'Students',         value: totalStudents,    icon: '🎓', ring: 'ring-emerald-100', num: 'text-emerald-700' },
                    { label: 'Admins & Mentors', value: totalAdmins + totalMentors, icon: '⚡', ring: 'ring-rose-100', num: 'text-rose-700' },
                    { label: 'Unread Messages',  value: unreadMessages,   icon: '✉',  ring: 'ring-amber-100',  num: 'text-amber-700'   },
                  ].map((s) => (
                    <div key={s.label} className={`bg-white rounded-xl border border-slate-200 p-5 ring-2 ${s.ring}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-xs text-slate-500 font-medium leading-tight">{s.label}</span>
                      </div>
                      <p className={`text-3xl font-bold ${s.num}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Messages', value: messages.length },
                    { label: 'Mentors',         value: totalMentors    },
                    { label: 'Admins',          value: totalAdmins     },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center justify-between">
                      <span className="text-sm text-slate-500">{s.label}</span>
                      <span className="text-2xl font-bold text-slate-900">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Recent signups */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h2 className="font-semibold text-slate-900 mb-4">Recent Signups</h2>
                  {recentSignups.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-3xl mb-2">👥</div>
                      <p className="text-sm text-slate-400">No users yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentSignups.map((u) => (
                        <div key={u.uid} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.fullName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{u.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${ROLE_BADGE[u.role] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {u.role}
                            </span>
                            <span className="text-xs text-slate-400 hidden sm:block">
                              {fmtDate(u.createdAt?.seconds)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── MESSAGES ──────────────────────────────────────────────────── */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900">Message Inbox</h2>
                  <div className="flex items-center gap-2">
                    {unreadMessages > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold">
                        {unreadMessages} unread
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{messages.length} total</span>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-sm font-medium">No messages yet.</p>
                    <p className="text-xs mt-1">Student messages will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {messages.map((msg) => {
                      const senderName  = msg.senderName  ?? msg.studentName ?? 'Unknown';
                      const senderEmail = msg.senderEmail ?? msg.studentEmail ?? 'N/A';
                      const subject     = msg.subject ?? msg.title ?? '(No subject)';
                      const isUnread    = msg.status !== 'read';
                      const isExpanded  = expandedMsg === msg.id;

                      return (
                        <div key={msg.id} className={isUnread ? 'bg-blue-50/30' : ''}>
                          <div
                            className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setExpandedMsg(isExpanded ? null : msg.id)}
                          >
                            {/* Unread indicator dot */}
                            <div className="flex-shrink-0 w-2">
                              {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            </div>

                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                              {senderName[0]?.toUpperCase() ?? '?'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className={`text-sm font-medium ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                                  {senderName}
                                </span>
                                <span className="text-xs text-slate-400">{senderEmail}</span>
                                {msg.category && (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                    {msg.category}
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm truncate ${isUnread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                                {subject}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-400 hidden sm:block">
                                {fmtDate(msg.createdAt?.seconds)}
                              </span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                isUnread
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {isUnread ? 'Unread' : 'Read'}
                              </span>
                              <span className="text-slate-300 text-xs">{isExpanded ? '▲' : '▼'}</span>
                            </div>
                          </div>

                          {/* Expanded view */}
                          {isExpanded && (
                            <div className="px-5 pb-5 border-t border-slate-100 bg-white">
                              <div className="mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                              </div>
                              <p className="text-xs text-slate-400 mt-2">
                                Received: {fmtDatetime(msg.createdAt?.seconds)}
                              </p>
                              {isUnread && (
                                <button
                                  onClick={() => markMsgRead(msg.id)}
                                  className="mt-3 px-4 py-2 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-colors"
                                >
                                  Mark as Read
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── STUDENTS ──────────────────────────────────────────────────── */}
            {activeTab === 'students' && (
              <div className="space-y-4">

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  />
                  <select
                    value={semFilter}
                    onChange={(e) => setSemFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white min-w-[140px]"
                  >
                    <option value="">All Semesters</option>
                    {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={specFilter}
                    onChange={(e) => setSpecFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white min-w-[180px]"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Result count + clear */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>
                    Showing <strong className="text-slate-900">{filteredUsers.length}</strong> of {users.length} users
                  </span>
                  {(search || semFilter || specFilter) && (
                    <button
                      onClick={() => { setSearch(''); setSemFilter(''); setSpecFilter(''); }}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Semester</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Specialization</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                              No users match the current filters.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => {
                            const isSelf = u.uid === currentUser?.uid;
                            return (
                              <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                      {u.fullName?.[0]?.toUpperCase() ?? '?'}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900 text-sm">
                                        {u.fullName}
                                        {isSelf && <span className="ml-1.5 text-xs text-slate-400 font-normal">(you)</span>}
                                      </p>
                                      <p className="text-xs text-slate-400 sm:hidden">{u.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">{u.email}</td>
                                <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">{u.semester ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-500 hidden lg:table-cell text-xs">{u.specialization ?? '—'}</td>
                                <td className="px-4 py-3">
                                  {isSelf ? (
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ROLE_BADGE[u.role] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                      {u.role}
                                    </span>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={u.role}
                                        disabled={updatingRole === u.uid}
                                        onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                                        className={`text-xs border rounded-lg px-2 py-1 outline-none focus:border-blue-500 bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
                                          ROLE_BADGE[u.role] ?? 'border-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {ROLE_OPTIONS.map((r) => (
                                          <option key={r} value={r}>{r}</option>
                                        ))}
                                      </select>
                                      {updatingRole === u.uid && (
                                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-slate-400 hidden md:table-cell text-xs">
                                  {fmtDate(u.createdAt?.seconds)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── SEND NOTIFICATION ─────────────────────────────────────────── */}
            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
                      🔔
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900">Send Notification</h2>
                      <p className="text-xs text-slate-500">Broadcast to all students or target a specific user</p>
                    </div>
                  </div>

                  {notifSent ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        ✓
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Notification Sent!</h3>
                      <p className="text-sm text-slate-500 mb-6">
                        Delivered to{' '}
                        <strong>
                          {notifForm.targetType === 'all'
                            ? 'all users'
                            : users.find((u) => u.uid === notifForm.targetUid)?.fullName ?? 'selected user'}
                        </strong>
                        .
                      </p>
                      <button
                        onClick={() => {
                          setNotifForm({ title: '', message: '', targetType: 'all', targetUid: '' });
                          setNotifSent(false);
                          setNotifErrors({});
                          setNotifError('');
                        }}
                        className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={sendNotification} className="space-y-5">

                      {notifError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                          {notifError}
                        </div>
                      )}

                      {/* Target type */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Send To</label>
                        <div className="flex gap-4">
                          {(['all', 'specific'] as const).map((t) => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="targetType"
                                value={t}
                                checked={notifForm.targetType === t}
                                onChange={() => setNotifForm((prev) => ({ ...prev, targetType: t, targetUid: '' }))}
                                className="accent-blue-700 w-4 h-4"
                              />
                              <span className="text-sm text-slate-700">
                                {t === 'all' ? '📢 All Users' : '👤 Specific User'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Specific user dropdown */}
                      {notifForm.targetType === 'specific' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Select User</label>
                          <select
                            value={notifForm.targetUid}
                            onChange={(e) => {
                              setNotifForm((prev) => ({ ...prev, targetUid: e.target.value }));
                              setNotifErrors((prev) => ({ ...prev, targetUid: '' }));
                            }}
                            className={inpCls(notifErrors.targetUid)}
                          >
                            <option value="">Choose a user…</option>
                            {users.map((u) => (
                              <option key={u.uid} value={u.uid}>
                                {u.fullName} — {u.email} ({u.role})
                              </option>
                            ))}
                          </select>
                          {notifErrors.targetUid && (
                            <p className="mt-1 text-xs text-red-600">{notifErrors.targetUid}</p>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={notifForm.title}
                          onChange={(e) => {
                            setNotifForm((prev) => ({ ...prev, title: e.target.value }));
                            setNotifErrors((prev) => ({ ...prev, title: '' }));
                          }}
                          placeholder="e.g. New lecture uploaded — Financial Management"
                          className={inpCls(notifErrors.title)}
                        />
                        {notifErrors.title && (
                          <p className="mt-1 text-xs text-red-600">{notifErrors.title}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={notifForm.message}
                          onChange={(e) => {
                            setNotifForm((prev) => ({ ...prev, message: e.target.value }));
                            setNotifErrors((prev) => ({ ...prev, message: '' }));
                          }}
                          rows={3}
                          placeholder="Brief description of the notification…"
                          className={`${inpCls(notifErrors.message)} resize-none`}
                        />
                        {notifErrors.message && (
                          <p className="mt-1 text-xs text-red-600">{notifErrors.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={notifSending}
                        className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
                      >
                        {notifSending ? 'Sending…' : 'Send Notification'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
