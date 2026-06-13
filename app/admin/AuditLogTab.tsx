'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AuditLogEntry, fmtDatetime } from './types';

const ACTION_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  role_change:    { label: 'Role Change',    cls: 'bg-blue-100 text-blue-700 border-blue-200',     icon: '🔁' },
  block_user:     { label: 'Blocked',        cls: 'bg-red-100 text-red-700 border-red-200',         icon: '🚫' },
  unblock_user:   { label: 'Unblocked',      cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '✓' },
  suspend_user:   { label: 'Suspended',      cls: 'bg-amber-100 text-amber-700 border-amber-200',   icon: '⏸' },
  unsuspend_user: { label: 'Unsuspended',    cls: 'bg-teal-100 text-teal-700 border-teal-200',      icon: '▶' },
  delete_user:    { label: 'Deleted',        cls: 'bg-slate-100 text-slate-600 border-slate-200',   icon: '🗑' },
  restore_user:   { label: 'Restored',       cls: 'bg-violet-100 text-violet-700 border-violet-200', icon: '♻' },
  send_announcement: { label: 'Announcement', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '📢' },
};

function getActionCfg(action: string) {
  return ACTION_CONFIG[action] ?? { label: action, cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: '⬡' };
}

export default function AuditLogTab() {
  const [logs,    setLogs]    = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, 'adminLogs'), orderBy('timestamp', 'desc'), limit(200))
        );
        setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AuditLogEntry));
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = filter
    ? logs.filter((l) => l.action === filter)
    : logs;

  const actionTypes = [...new Set(logs.map((l) => l.action))].sort();

  return (
    <div className="space-y-4">

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white min-w-[180px]"
        >
          <option value="">All Actions</option>
          {actionTypes.map((a) => (
            <option key={a} value={a}>{getActionCfg(a).label}</option>
          ))}
        </select>
        <span className="text-sm text-slate-500">
          {filtered.length} {filter ? 'matching' : 'total'} entries
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Admin Audit Log</h2>
          <span className="text-xs text-slate-400">Last 200 entries</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm text-slate-400">
              {filter ? 'No entries for this action type.' : 'No audit entries yet.'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Admin actions (role changes, blocks, deletes) appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((log) => {
              const cfg  = getActionCfg(log.action);
              const meta = log.metadata as Record<string, unknown>;

              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${cfg.cls}`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {log.targetName}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:block">{log.targetEmail}</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      By <span className="font-medium text-slate-700">{log.performedByName}</span>
                      {log.action === 'role_change' && !!meta.from && !!meta.to && (
                        <> — changed from <strong>{String(meta.from)}</strong> to <strong>{String(meta.to)}</strong></>
                      )}
                      {log.action === 'suspend_user' && !!meta.duration && (
                        <> — suspended for <strong>{String(meta.duration)}</strong></>
                      )}
                      {!!meta.reason && (
                        <> — &quot;{String(meta.reason)}&quot;</>
                      )}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-slate-400 whitespace-nowrap">
                      {fmtDatetime(log.timestamp?.seconds)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
