'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

import UserManagementTab from './UserManagementTab';
import AuditLogTab       from './AuditLogTab';
import AnnouncementsTab  from './AnnouncementsTab';

import { AdminUser, AdminMessage, fmtDate, fmtDatetime } from './types';

// ── Tab config ────────────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'messages' | 'users' | 'announcements' | 'audit';

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'overview',       label: 'Overview',       icon: '📊' },
  { id: 'messages',       label: 'Messages',        icon: '✉'  },
  { id: 'users',          label: 'User Management', icon: '👥' },
  { id: 'announcements',  label: 'Announcements',   icon: '📢' },
  { id: 'audit',          label: 'Audit Log',       icon: '📋' },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, userProfile, loading, profileLoading } = useAuth();

  const [activeTab,    setActiveTab]    = useState<AdminTab>('overview');
  const [users,        setUsers]        = useState<AdminUser[]>([]);
  const [messages,     setMessages]     = useState<AdminMessage[]>([]);
  const [dataLoading,  setDataLoading]  = useState(true);

  // Messages tab
  const [expandedMsg,  setExpandedMsg]  = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (loading || profileLoading) return;
    if (!currentUser)                      { router.replace('/login');     return; }
    if (userProfile?.role !== 'admin')     { router.replace('/dashboard'); return; }
  }, [loading, profileLoading, currentUser, userProfile, router]);

  // ── Load data ───────────────────────────────────────────────────────────────

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
      } catch { /* show empty state */ }
      finally { setDataLoading(false); }
    }
    load();
  }, [userProfile?.role]);

  // ── Toast helper ────────────────────────────────────────────────────────────

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Optimistic user state callbacks ─────────────────────────────────────────

  function handleUserUpdate(updated: AdminUser) {
    setUsers((prev) => prev.map((u) => u.uid === updated.uid ? updated : u));
  }

  function handleUserRemove(uid: string) {
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  }

  // ── Mark message read ───────────────────────────────────────────────────────

  async function markMsgRead(msgId: string) {
    try {
      await updateDoc(doc(db, 'messages', msgId), { status: 'read' });
      setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, status: 'read' } : m));
    } catch { /* ignore */ }
  }

  // ── Derived stats ────────────────────────────────────────────────────────────

  const activeUsers    = users.filter((u) => !u.isDeleted);
  const totalStudents  = activeUsers.filter((u) => u.role === 'student').length;
  const totalAdmins    = activeUsers.filter((u) => u.role === 'admin').length;
  const totalMentors   = activeUsers.filter((u) => u.role === 'mentor').length;
  const totalBlocked   = activeUsers.filter((u) => u.isBlocked).length;
  const unreadMessages = messages.filter((m) => m.status !== 'read').length;
  const recentSignups  = activeUsers.slice(0, 6);

  const ROLE_BADGE: Record<string, string> = {
    admin:   'bg-rose-100 text-rose-700 border-rose-200',
    mentor:  'bg-purple-100 text-purple-700 border-purple-200',
    student: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  // ── Loading / guard ──────────────────────────────────────────────────────────

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

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                ⚡ Admin Portal
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Signed in as <span className="font-medium text-slate-700">{userProfile?.fullName}</span>
            </p>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 text-sm text-slate-600 hover:text-slate-900 font-medium border border-slate-200 px-4 py-2 rounded-xl hover:bg-white transition-colors"
          >
            ← Back to Site
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const badge    = tab.id === 'messages' && unreadMessages > 0 ? unreadMessages : null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

        {/* Loading */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Fetching data…</span>
            </div>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users',      value: activeUsers.length,  icon: '👥', ring: 'ring-blue-100',    num: 'text-blue-700'    },
                    { label: 'Students',          value: totalStudents,        icon: '🎓', ring: 'ring-emerald-100', num: 'text-emerald-700' },
                    { label: 'Admins & Mentors',  value: totalAdmins + totalMentors, icon: '⚡', ring: 'ring-rose-100', num: 'text-rose-700' },
                    { label: 'Unread Messages',   value: unreadMessages,       icon: '✉',  ring: 'ring-amber-100',  num: 'text-amber-700'   },
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Messages', value: messages.length },
                    { label: 'Mentors',         value: totalMentors    },
                    { label: 'Blocked Users',   value: totalBlocked    },
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
                    <div className="text-center py-6 text-slate-400 text-sm">No users yet.</div>
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
                            <span className="text-xs text-slate-400 hidden sm:block">{fmtDate(u.createdAt?.seconds)}</span>
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
                            <div className="flex-shrink-0 w-2">
                              {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                              {senderName[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className={`text-sm font-medium ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>{senderName}</span>
                                <span className="text-xs text-slate-400">{senderEmail}</span>
                                {msg.category && (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{msg.category}</span>
                                )}
                              </div>
                              <p className={`text-sm truncate ${isUnread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>{subject}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-400 hidden sm:block">{fmtDate(msg.createdAt?.seconds)}</span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isUnread ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                {isUnread ? 'Unread' : 'Read'}
                              </span>
                              <span className="text-slate-300 text-xs">{isExpanded ? '▲' : '▼'}</span>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="px-5 pb-5 border-t border-slate-100 bg-white">
                              <div className="mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                              <p className="text-xs text-slate-400 mt-2">Received: {fmtDatetime(msg.createdAt?.seconds)}</p>
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

            {/* ── USER MANAGEMENT ───────────────────────────────────────────── */}
            {activeTab === 'users' && (
              <UserManagementTab
                users={users}
                currentUid={currentUser.uid}
                currentName={userProfile?.fullName ?? currentUser.email ?? 'Admin'}
                onUserUpdate={handleUserUpdate}
                onUserRemove={handleUserRemove}
                onToast={showToast}
              />
            )}

            {/* ── ANNOUNCEMENTS ─────────────────────────────────────────────── */}
            {activeTab === 'announcements' && (
              <AnnouncementsTab
                users={users}
                currentUid={currentUser.uid}
                currentName={userProfile?.fullName ?? currentUser.email ?? 'Admin'}
                onToast={showToast}
              />
            )}

            {/* ── AUDIT LOG ─────────────────────────────────────────────────── */}
            {activeTab === 'audit' && <AuditLogTab />}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
          toast.ok ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          <span>{toast.ok ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
