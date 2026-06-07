'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, BookOpen, Users, Heart, TrendingUp } from 'lucide-react';

type NotifType = 'activity' | 'content' | 'community' | 'engagement';

interface Notification {
  id: string;
  type: NotifType;
  message: string;
  timeLabel: string;
  read: boolean;
  isNew?: boolean;
}

const ICON_MAP: Record<NotifType, React.ComponentType<{ className?: string }>> = {
  activity: Users,
  content: BookOpen,
  community: Heart,
  engagement: TrendingUp,
};

const COLOR_MAP: Record<NotifType, { bg: string; icon: string }> = {
  activity:   { bg: 'bg-blue-100',    icon: 'text-blue-600'    },
  content:    { bg: 'bg-violet-100',  icon: 'text-violet-600'  },
  community:  { bg: 'bg-rose-100',    icon: 'text-rose-500'    },
  engagement: { bg: 'bg-emerald-100', icon: 'text-emerald-600' },
};

const POOL: Array<{ type: NotifType; message: string }> = [
  { type: 'activity',   message: 'A student submitted a new case study request' },
  { type: 'content',    message: 'Marketing Management case study published' },
  { type: 'engagement', message: '50+ students used Attendance Survival Tool today' },
  { type: 'content',    message: 'New MIS case study added' },
  { type: 'community',  message: 'Thanks for supporting MBA Learning Hub ❤️' },
  { type: 'activity',   message: 'Students from 3 sections visited today' },
  { type: 'content',    message: 'New classroom discussion notes uploaded' },
  { type: 'engagement', message: '120+ students accessed revision materials this week' },
  { type: 'activity',   message: 'A student completed the Finance quiz' },
  { type: 'content',    message: 'Economics lecture notes updated' },
  { type: 'activity',   message: '15 students requested new subjects today' },
  { type: 'community',  message: 'Welcome to MBA Learning Hub! 🎓' },
  { type: 'engagement', message: 'Quick Revision tool used by 30 students today' },
  { type: 'content',    message: 'New HRM lecture summary available' },
  { type: 'activity',   message: 'Case study discussion trending in the community' },
  { type: 'engagement', message: 'Search tool accessed 200+ times this week' },
];

const INITIAL_LABELS = ['2 min ago', '8 min ago', '20 min ago', '45 min ago', '1 hr ago', '2 hrs ago'];
const INITIAL_COUNT  = 6;

const STABLE_INITIAL: Notification[] = POOL.slice(0, INITIAL_COUNT).map((n, i) => ({
  id:        `s${i}`,
  type:      n.type,
  message:   n.message,
  timeLabel: INITIAL_LABELS[i],
  read:      false,
}));

const LS_KEY = 'mba_hub_notif_read_v1';

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify([...ids])); } catch {}
}

export default function NotificationBell() {
  const [open,          setOpen]          = useState(false);
  const [mounted,       setMounted]       = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(STABLE_INITIAL);

  const dropdownRef  = useRef<HTMLDivElement>(null);
  const bellRef      = useRef<HTMLButtonElement>(null);
  const poolIndexRef = useRef(INITIAL_COUNT);

  // Hydration-safe mount: apply localStorage read state only on client
  useEffect(() => {
    setMounted(true);
    const readIds = getReadIds();
    if (readIds.size > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, read: readIds.has(n.id) })));
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        bellRef.current     && !bellRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Live activity rotation every 45 s
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = poolIndexRef.current % POOL.length;
      poolIndexRef.current += 1;
      const src = POOL[idx];
      const id  = `live_${Date.now()}`;
      const next: Notification = {
        id, type: src.type, message: src.message, timeLabel: 'just now', read: false, isNew: true,
      };
      setNotifications(prev => [next, ...prev].slice(0, 15));
      setTimeout(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isNew: false } : n));
      }, 700);
    }, 45_000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (mounted) {
      const ids = getReadIds();
      ids.add(id);
      saveReadIds(ids);
    }
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    saveReadIds(new Set(notifications.map(n => n.id)));
  }

  // Static shell during SSR — no badge to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Notifications"
        className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      {/* ── Bell button ─────────────────────────────────────────── */}
      <button
        ref={bellRef}
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className={`relative p-2 rounded-lg transition-colors duration-150 ${
          open
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ────────────────────────────────────────────── */}
      {open && (
        <div
          ref={dropdownRef}
          role="dialog"
          aria-label="Notifications panel"
          className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1rem)] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-300/40 z-50 animate-slide-up overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full leading-none">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No new notifications right now.</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map(notif => {
                  const Icon   = ICON_MAP[notif.type];
                  const colors = COLOR_MAP[notif.type];
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-50 ${
                        notif.isNew ? 'animate-slide-up' : ''
                      } ${!notif.read ? 'bg-blue-50/30' : ''}`}
                    >
                      {/* Icon bubble */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center mt-0.5`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${notif.read ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{notif.timeLabel}</p>
                      </div>

                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
            <p className="text-xs text-slate-400 text-center">
              Live activity from the MBA Learning Hub community
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
