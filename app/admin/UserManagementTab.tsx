'use client';

import { useState, FormEvent } from 'react';
import {
  collection, doc, updateDoc, addDoc,
  serverTimestamp, deleteField, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ConfirmModal from '@/components/ConfirmModal';
import {
  AdminUser, getUserStatus, UserStatus, fmtDate, fmtDatetime,
} from './types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  users: AdminUser[];
  currentUid: string;
  currentName: string;
  onUserUpdate: (user: AdminUser) => void;
  onUserRemove: (uid: string) => void;
  onToast: (msg: string, ok?: boolean) => void;
}

type SuspendDuration = '1h' | '6h' | '1d' | '3d' | '7d' | '30d';

const SUSPEND_DURATIONS: { label: string; value: SuspendDuration; ms: number }[] = [
  { label: '1 hour',   value: '1h',  ms: 3_600_000 },
  { label: '6 hours',  value: '6h',  ms: 21_600_000 },
  { label: '1 day',    value: '1d',  ms: 86_400_000 },
  { label: '3 days',   value: '3d',  ms: 259_200_000 },
  { label: '7 days',   value: '7d',  ms: 604_800_000 },
  { label: '30 days',  value: '30d', ms: 2_592_000_000 },
];

const ROLE_OPTIONS = ['student', 'mentor', 'admin'];

const ROLE_BADGE: Record<string, string> = {
  admin:   'bg-rose-100 text-rose-700 border-rose-200',
  mentor:  'bg-purple-100 text-purple-700 border-purple-200',
  student: 'bg-blue-100 text-blue-700 border-blue-200',
};

const STATUS_CONFIG: Record<UserStatus, { label: string; cls: string }> = {
  active:    { label: 'Active',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  blocked:   { label: 'Blocked',   cls: 'bg-red-100 text-red-700 border-red-200'            },
  suspended: { label: 'Suspended', cls: 'bg-amber-100 text-amber-700 border-amber-200'      },
  deleted:   { label: 'Deleted',   cls: 'bg-slate-100 text-slate-500 border-slate-200'      },
};

const ITEMS_PER_PAGE = 20;

// ── Audit log helper ──────────────────────────────────────────────────────────

async function writeAuditLog(
  performedBy: string,
  performedByName: string,
  action: string,
  target: AdminUser,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await addDoc(collection(db, 'adminLogs'), {
      action,
      targetUid:        target.uid,
      targetName:       target.fullName || target.email,
      targetEmail:      target.email,
      performedBy,
      performedByName,
      timestamp:        serverTimestamp(),
      metadata,
    });
  } catch { /* non-critical */ }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UserManagementTab({
  users, currentUid, currentName, onUserUpdate, onUserRemove, onToast,
}: Props) {

  // Filters
  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleted,  setShowDeleted]  = useState(false);
  const [page,         setPage]         = useState(1);

  // Loading states per-user (uid → true)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [updatingRole,  setUpdatingRole]  = useState<string | null>(null);

  // Suspend modal
  const [suspendTarget,   setSuspendTarget]   = useState<AdminUser | null>(null);
  const [suspendDuration, setSuspendDuration] = useState<SuspendDuration>('1d');
  const [suspendReason,   setSuspendReason]   = useState('');
  const [suspendLoading,  setSuspendLoading]  = useState(false);

  // Delete confirm modal
  const [deleteTarget,  setDeleteTarget]  = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const adminCount = users.filter((u) => u.role === 'admin' && !u.isDeleted).length;

  function setLoading(uid: string, on: boolean) {
    setActionLoading((prev) => ({ ...prev, [uid]: on }));
  }

  // ── Filtered / paginated list ───────────────────────────────────────────────

  const filtered = users.filter((u) => {
    const status = getUserStatus(u);
    if (!showDeleted && status === 'deleted') return false;
    const q = search.toLowerCase();
    const matchSearch = !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole   = !roleFilter   || u.role === roleFilter;
    const matchStatus = !statusFilter || status  === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages     = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage       = Math.min(page, totalPages);
  const paginated      = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const semesters      = [...new Set(users.map((u) => u.semester).filter(Boolean) as string[])].sort();
  const specializations = [...new Set(users.map((u) => u.specialization).filter(Boolean) as string[])].sort();

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function handleRoleChange(user: AdminUser, newRole: string) {
    if (user.uid === currentUid) { onToast('Cannot change your own role.', false); return; }
    if (user.role === 'admin' && newRole !== 'admin' && adminCount <= 1) {
      onToast('Cannot demote the only remaining admin.', false); return;
    }
    setUpdatingRole(user.uid);
    try {
      await updateDoc(doc(db, 'users', user.uid), { role: newRole });
      await writeAuditLog(currentUid, currentName, 'role_change', user, { from: user.role, to: newRole });
      onUserUpdate({ ...user, role: newRole });
      onToast(`Role updated to ${newRole}.`);
    } catch {
      onToast('Failed to update role.', false);
    } finally {
      setUpdatingRole(null);
    }
  }

  async function handleBlock(user: AdminUser) {
    if (user.uid === currentUid) { onToast('Cannot block your own account.', false); return; }
    setLoading(user.uid, true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isBlocked:    true,
        blockedBy:    currentUid,
        blockedAt:    serverTimestamp(),
      });
      await writeAuditLog(currentUid, currentName, 'block_user', user);
      onUserUpdate({ ...user, isBlocked: true, blockedBy: currentUid });
      onToast(`${user.fullName} has been blocked.`);
    } catch {
      onToast('Failed to block user.', false);
    } finally {
      setLoading(user.uid, false);
    }
  }

  async function handleUnblock(user: AdminUser) {
    setLoading(user.uid, true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isBlocked:    false,
        blockedReason: deleteField(),
        blockedBy:    deleteField(),
        blockedAt:    deleteField(),
      });
      await writeAuditLog(currentUid, currentName, 'unblock_user', user);
      onUserUpdate({ ...user, isBlocked: false, blockedReason: undefined, blockedBy: undefined, blockedAt: undefined });
      onToast(`${user.fullName} has been unblocked.`);
    } catch {
      onToast('Failed to unblock user.', false);
    } finally {
      setLoading(user.uid, false);
    }
  }

  async function handleSuspend(e: FormEvent) {
    e.preventDefault();
    if (!suspendTarget) return;
    const dur = SUSPEND_DURATIONS.find((d) => d.value === suspendDuration)!;
    const endsAt = Timestamp.fromDate(new Date(Date.now() + dur.ms));
    setSuspendLoading(true);
    try {
      await updateDoc(doc(db, 'users', suspendTarget.uid), {
        suspensionEndsAt: endsAt,
        suspendedBy:      currentUid,
        suspendedReason:  suspendReason.trim() || deleteField(),
      });
      await writeAuditLog(currentUid, currentName, 'suspend_user', suspendTarget, {
        duration: dur.label, reason: suspendReason.trim(), endsAt: endsAt.seconds,
      });
      onUserUpdate({
        ...suspendTarget,
        suspensionEndsAt: { seconds: endsAt.seconds },
        suspendedBy: currentUid,
        suspendedReason: suspendReason.trim() || undefined,
      });
      onToast(`${suspendTarget.fullName} suspended for ${dur.label}.`);
      setSuspendTarget(null);
      setSuspendReason('');
    } catch {
      onToast('Failed to suspend user.', false);
    } finally {
      setSuspendLoading(false);
    }
  }

  async function handleEndSuspension(user: AdminUser) {
    setLoading(user.uid, true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        suspensionEndsAt: deleteField(),
        suspendedBy:      deleteField(),
        suspendedReason:  deleteField(),
      });
      await writeAuditLog(currentUid, currentName, 'unsuspend_user', user);
      onUserUpdate({ ...user, suspensionEndsAt: undefined, suspendedBy: undefined, suspendedReason: undefined });
      onToast(`Suspension lifted for ${user.fullName}.`);
    } catch {
      onToast('Failed to end suspension.', false);
    } finally {
      setLoading(user.uid, false);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (user.uid === currentUid) { onToast('Cannot delete your own account.', false); return; }
    if (user.role === 'admin' && adminCount <= 1) {
      onToast('Cannot delete the only remaining admin.', false); return;
    }
    setDeleteLoading(true);
    try {
      // Soft-delete: block + flag, preserves Firestore data for audit trail
      await updateDoc(doc(db, 'users', user.uid), {
        isDeleted:  true,
        isBlocked:  true,
        deletedBy:  currentUid,
        deletedAt:  serverTimestamp(),
      });
      await writeAuditLog(currentUid, currentName, 'delete_user', user);
      onUserRemove(user.uid);
      onToast(`${user.fullName}'s account has been deleted.`);
    } catch {
      onToast('Failed to delete user.', false);
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white min-w-[130px]"
        >
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white min-w-[130px]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filtered.length}</strong> of {users.length} users
          </span>
          {(search || roleFilter || statusFilter) && (
            <button
              onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); setPage(1); }}
              className="text-blue-600 hover:underline text-xs"
            >
              Clear filters
            </button>
          )}
        </div>
        <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="accent-blue-700 w-3.5 h-3.5"
          />
          Show deleted
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                    No users match the current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((u) => {
                  const isSelf   = u.uid === currentUid;
                  const status   = getUserStatus(u);
                  const sCfg     = STATUS_CONFIG[status];
                  const isLoading = actionLoading[u.uid] ?? false;
                  const isDeleted = status === 'deleted';

                  return (
                    <tr key={u.uid} className={`transition-colors ${isDeleted ? 'opacity-50 bg-slate-50' : 'hover:bg-slate-50'}`}>

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.fullName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate">
                              {u.fullName}
                              {isSelf && <span className="ml-1.5 text-xs text-slate-400 font-normal">(you)</span>}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-slate-500">{u.semester ?? '—'}</p>
                        <p className="text-xs text-slate-400">{u.specialization ?? '—'}</p>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        {isSelf || isDeleted ? (
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ROLE_BADGE[u.role] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {u.role}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={u.role}
                              disabled={updatingRole === u.uid || isLoading}
                              onChange={(e) => handleRoleChange(u, e.target.value)}
                              className={`text-xs border rounded-lg px-2 py-1 outline-none focus:border-blue-500 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
                                ROLE_BADGE[u.role] ?? 'border-slate-200 text-slate-700'
                              }`}
                            >
                              {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {updatingRole === u.uid && (
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${sCfg.cls}`}>
                            {sCfg.label}
                          </span>
                          {status === 'suspended' && u.suspensionEndsAt?.seconds && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              Until {fmtDate(u.suspensionEndsAt.seconds)}
                            </p>
                          )}
                          {status === 'blocked' && u.blockedReason && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[100px]" title={u.blockedReason}>
                              {u.blockedReason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">
                        {fmtDate(u.createdAt?.seconds)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {isSelf ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : isDeleted ? (
                          /* Restore action for deleted users */
                          <button
                            disabled={isLoading}
                            onClick={async () => {
                              setLoading(u.uid, true);
                              try {
                                await updateDoc(doc(db, 'users', u.uid), {
                                  isDeleted: false, isBlocked: false,
                                  deletedBy: deleteField(), deletedAt: deleteField(),
                                });
                                await writeAuditLog(currentUid, currentName, 'restore_user', u);
                                onUserUpdate({ ...u, isDeleted: false, isBlocked: false });
                                onToast(`${u.fullName} restored.`);
                              } catch {
                                onToast('Failed to restore.', false);
                              } finally { setLoading(u.uid, false); }
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            Restore
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Block / Unblock */}
                            {status === 'blocked' ? (
                              <button
                                disabled={isLoading}
                                onClick={() => handleUnblock(u)}
                                className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                disabled={isLoading}
                                onClick={() => handleBlock(u)}
                                className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                Block
                              </button>
                            )}

                            {/* Suspend / End suspension */}
                            {status === 'suspended' ? (
                              <button
                                disabled={isLoading}
                                onClick={() => handleEndSuspension(u)}
                                className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                              >
                                Unsuspend
                              </button>
                            ) : (
                              <button
                                disabled={isLoading || status === 'blocked'}
                                onClick={() => { setSuspendTarget(u); setSuspendDuration('1d'); setSuspendReason(''); }}
                                className="px-2.5 py-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
                              >
                                Suspend
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              disabled={isLoading}
                              onClick={() => setDeleteTarget(u)}
                              className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              Delete
                            </button>

                            {isLoading && (
                              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Suspend Modal ───────────────────────────────────────────────────── */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !suspendLoading && setSuspendTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Suspend User</h2>
            <p className="text-sm text-slate-500 mb-5">
              Suspending <strong>{suspendTarget.fullName}</strong>. They won&apos;t be able to access the platform until the suspension ends.
            </p>
            <form onSubmit={handleSuspend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {SUSPEND_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSuspendDuration(d.value)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        suspendDuration === d.value
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Reason <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  rows={2}
                  placeholder="Reason visible to the user…"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setSuspendTarget(null)}
                  disabled={suspendLoading}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={suspendLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {suspendLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {suspendLoading ? 'Suspending…' : 'Suspend User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ────────────────────────────────────────────── */}
      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.fullName ?? 'this user'}?`}
        description={`This will permanently disable ${deleteTarget?.email ?? 'this account'} and block all access. The action is logged and can be reviewed in the audit log.`}
        confirmLabel="Delete Account"
        variant="danger"
        loading={deleteLoading}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
      />
    </div>
  );
}
