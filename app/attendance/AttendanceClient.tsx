'use client';

import { useState, useEffect } from 'react';

const MIN_ATT = 75;
const RADIUS = 70;
const CIRC = 2 * Math.PI * RADIUS;

interface Stats {
  pct: number;
  canSkip: number;
  needAttend: number;
  zone: 'safe' | 'warning' | 'danger';
}

function calcStats(total: number, attended: number): Stats | null {
  if (total <= 0 || attended < 0 || attended > total) return null;
  const pct = (attended / total) * 100;
  const canSkip = pct >= MIN_ATT ? Math.max(0, Math.floor((attended - 0.75 * total) / 0.75)) : 0;
  const needAttend = pct < MIN_ATT ? Math.ceil((0.75 * total - attended) / 0.25) : 0;
  const zone: Stats['zone'] = pct < MIN_ATT ? 'danger' : canSkip > 0 ? 'safe' : 'warning';
  return { pct, canSkip, needAttend, zone };
}

const ZONE_CFG = {
  safe: {
    stroke: '#22c55e',
    track: '#dcfce7',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    card: 'bg-emerald-50/80 border-emerald-200',
    highlight: 'text-emerald-700',
    shadow: '0 8px 40px rgba(34,197,94,0.12)',
    label: 'Safe Zone',
    emoji: '✅',
  },
  warning: {
    stroke: '#f59e0b',
    track: '#fef3c7',
    badge: 'bg-amber-100 text-amber-800 border border-amber-200',
    card: 'bg-amber-50/80 border-amber-200',
    highlight: 'text-amber-700',
    shadow: '0 8px 40px rgba(245,158,11,0.12)',
    label: 'Warning Zone',
    emoji: '⚠️',
  },
  danger: {
    stroke: '#ef4444',
    track: '#fee2e2',
    badge: 'bg-red-100 text-red-800 border border-red-200',
    card: 'bg-red-50/80 border-red-200',
    highlight: 'text-red-700',
    shadow: '0 8px 40px rgba(239,68,68,0.12)',
    label: 'Danger Zone',
    emoji: '🚨',
  },
};

function ProgressCircle({ pct, zone }: { pct: number; zone: Stats['zone'] }) {
  const cfg = ZONE_CFG[zone];
  const offset = CIRC * (1 - Math.min(pct, 100) / 100);
  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={RADIUS} fill="none" stroke={cfg.track} strokeWidth="16" />
        <circle
          cx="90" cy="90" r={RADIUS} fill="none"
          stroke={cfg.stroke} strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: cfg.stroke }}>
          {pct.toFixed(1)}%
        </span>
        <span className="text-[11px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
          attendance
        </span>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [total, setTotal] = useState('');
  const [attended, setAttended] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mba-attendance');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.total > 0) setTotal(String(d.total));
        if (d.attended >= 0) setAttended(String(d.attended));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const T = Math.max(0, parseInt(total) || 0);
  const A = Math.max(0, parseInt(attended) || 0);
  const inputError = A > T && T > 0;
  const stats = T > 0 && A >= 0 && A <= T ? calcStats(T, A) : null;

  function persist(t: string, a: string) {
    try {
      localStorage.setItem('mba-attendance', JSON.stringify({
        total: parseInt(t) || 0,
        attended: parseInt(a) || 0,
      }));
    } catch {
      // ignore localStorage errors
    }
  }

  function onTotal(v: string) { setTotal(v); persist(v, attended); }
  function onAttended(v: string) { setAttended(v); persist(total, v); }

  function attendedToday() {
    const nA = String(A + 1), nT = String(T + 1);
    setAttended(nA); setTotal(nT); persist(nT, nA);
  }
  function missedToday() {
    const nT = String(T + 1);
    setTotal(nT); persist(nT, attended);
  }

  const cfg = stats ? ZONE_CFG[stats.zone] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">

      {/* Hero header */}
      <div className="py-12 sm:py-16 text-center px-4">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-blue-200">
            📊 Attendance Survival Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Safe to Skip?
          </h1>
          <p className="text-slate-500 text-base sm:text-lg">
            MBA attendance survival calculator.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-20 space-y-4">

        {/* Input card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            Enter Your Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Total Classes
              </label>
              <input
                type="number"
                min="0"
                value={total}
                onChange={e => onTotal(e.target.value)}
                placeholder="e.g. 80"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-bold text-xl transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1.5">Classes conducted</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Classes Attended
              </label>
              <input
                type="number"
                min="0"
                value={attended}
                onChange={e => onAttended(e.target.value)}
                placeholder="e.g. 62"
                className={`w-full px-4 py-3.5 rounded-xl border ${
                  inputError
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-blue-100'
                } focus:ring-2 outline-none text-slate-900 font-bold text-xl transition-all`}
              />
              <p className="text-[10px] text-slate-400 mt-1.5">Classes you attended</p>
            </div>
          </div>
          {inputError && (
            <p className="mt-3 flex items-center gap-1.5 text-red-600 text-xs font-medium">
              <span>⚠️</span> Attended can&apos;t exceed total classes.
            </p>
          )}
        </div>

        {/* Quick action buttons */}
        {T > 0 && !inputError && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={attendedToday}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all duration-150 text-sm shadow-sm"
            >
              ✅ Attended Today
            </button>
            <button
              onClick={missedToday}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all duration-150 text-sm shadow-sm"
            >
              ❌ Missed Today
            </button>
          </div>
        )}

        {/* Results card */}
        {stats && cfg && (
          <div
            className={`rounded-2xl border p-6 backdrop-blur-sm ${cfg.card} animate-slide-up`}
            style={{ boxShadow: cfg.shadow }}
          >
            <ProgressCircle pct={stats.pct} zone={stats.zone} />

            {/* Zone badge */}
            <div className="mt-5 flex justify-center">
              <span className={`inline-flex items-center gap-2 font-bold px-5 py-2 rounded-full text-sm ${cfg.badge}`}>
                {cfg.emoji} {cfg.label}
              </span>
            </div>

            {/* Main message */}
            <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/80">
              {stats.zone === 'danger' ? (
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  Attend next{' '}
                  <span className={`font-bold text-2xl ${cfg.highlight}`}>{stats.needAttend}</span>{' '}
                  class{stats.needAttend !== 1 ? 'es' : ''} continuously to remain eligible.
                </p>
              ) : stats.canSkip > 0 ? (
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  You can skip{' '}
                  <span className={`font-bold text-2xl ${cfg.highlight}`}>{stats.canSkip}</span>{' '}
                  more class{stats.canSkip !== 1 ? 'es' : ''} safely.
                </p>
              ) : (
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  You&apos;re at the minimum threshold.{' '}
                  <span className={`font-semibold ${cfg.highlight}`}>
                    Don&apos;t miss any more classes.
                  </span>
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { label: 'Total', value: T },
                { label: 'Attended', value: A },
                { label: 'Missed', value: T - A },
              ].map(item => (
                <div key={item.label} className="bg-white/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone legend */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Attendance Zones
          </p>
          <div className="space-y-3">
            {[
              {
                dot: 'bg-emerald-500',
                label: 'Safe Zone',
                desc: 'Can skip classes — comfortable buffer above 75%',
              },
              {
                dot: 'bg-amber-400',
                label: 'Warning Zone',
                desc: 'At the minimum — no buffer remaining',
              },
              {
                dot: 'bg-red-500',
                label: 'Danger Zone',
                desc: 'Below 75% — need to recover attendance',
              },
            ].map(z => (
              <div key={z.label} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${z.dot} mt-1 flex-shrink-0`} />
                <div>
                  <span className="text-sm font-semibold text-slate-800">{z.label}</span>
                  <span className="text-xs text-slate-500 ml-2">{z.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 pt-3 border-t border-slate-100">
            Minimum required attendance:{' '}
            <strong className="text-slate-600">75%</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
