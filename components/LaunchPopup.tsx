'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COOLDOWN_MS  = 24 * 60 * 60 * 1000; // 24 hours
const LS_KEY       = 'mba_hub_popup_last_shown';

const CONTENT = {
  en: {
    badge:    'Big Features Launching Soon',
    headline: 'MBA Learning Hub — Exciting Features Coming!',
    subline:  'We are launching company onboarding, referrals, certifications, AI revision, and placement features soon. Register now to get early access.',
    features: [
      'Company onboarding & partnerships',
      'Referral rewards program',
      'AI-powered revision engine',
      'Certifications & skill badges',
      'Placement preparation tools',
      'Smart quiz & attendance system',
    ],
    cta1:   'Start Learning',
    cta2:   'Explore Subjects',
    cta3:   'Maybe Later',
    toggle: 'हिंदी में पढ़ें',
  },
  hi: {
    badge:    'नई Features — जल्द आ रही हैं',
    headline: 'MBA Learning Hub पर बड़े बदलाव आने वाले हैं!',
    subline:  'अगले 4 महीनों में नई features launch होने वाली हैं। अभी register करें और early access पाएँ।',
    features: [
      'Company onboarding & placements',
      'Referral rewards program',
      'AI-powered revision system',
      'Certifications और skill badges',
      'Placement preparation tools',
      'Smart quiz & attendance tracker',
    ],
    cta1:   'Start Learning',
    cta2:   'Subjects देखें',
    cta3:   'बाद में',
    toggle: 'Read in English',
  },
} as const;

type Lang = keyof typeof CONTENT;

export default function LaunchPopup() {
  const [visible,  setVisible]  = useState(false);
  const [animIn,   setAnimIn]   = useState(false);
  const [lang,     setLang]     = useState<Lang>('en');

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // Cooldown guard
      try {
        const last = localStorage.getItem(LS_KEY);
        if (last && Date.now() - Number(last) < COOLDOWN_MS) return;
      } catch {
        return;
      }

      // Firestore config guard
      try {
        const snap = await getDoc(doc(db, 'config', 'launchPopup'));
        if (!snap.exists() || snap.data()?.enabled !== true) return;
      } catch {
        // Firestore inaccessible (unauthenticated / offline) — skip popup
        return;
      }

      if (cancelled) return;

      // Small delay so page content loads first
      setTimeout(() => {
        if (!cancelled) {
          setVisible(true);
          requestAnimationFrame(() => setAnimIn(true));
        }
      }, 1400);
    }

    check();
    return () => { cancelled = true; };
  }, []);

  function dismiss() {
    try { localStorage.setItem(LS_KEY, String(Date.now())); } catch { /* storage blocked */ }
    setAnimIn(false);
    setTimeout(() => setVisible(false), 280);
  }

  if (!visible) return null;

  const c = CONTENT[lang];

  return (
    <>
      <style>{`
        @keyframes mbaOverlayIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mbaModalIn    { from { opacity: 0; transform: scale(.93) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes mbaOverlayOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes mbaModalOut   { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(.93) translateY(10px); } }
        .mba-overlay-in  { animation: mbaOverlayIn  .25s ease both; }
        .mba-overlay-out { animation: mbaOverlayOut .28s ease both; }
        .mba-modal-in    { animation: mbaModalIn    .28s cubic-bezier(.34,1.56,.64,1) both; }
        .mba-modal-out   { animation: mbaModalOut   .22s ease both; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-slate-900/65 backdrop-blur-sm ${animIn ? 'mba-overlay-in' : 'mba-overlay-out'}`}
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-popup-title"
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none`}
      >
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden ${animIn ? 'mba-modal-in' : 'mba-modal-out'}`}>

          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close popup"
            className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10 text-sm"
          >
            ✕
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-7 pt-7 pb-6">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/30 border border-blue-400/30 text-blue-100 text-[11px] font-semibold px-3 py-1 rounded-full mb-4">
              🚀 {c.badge}
            </span>
            <h2 id="launch-popup-title" className="text-xl font-bold text-white leading-tight mb-2">
              {c.headline}
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">{c.subline}</p>
          </div>

          {/* Feature list */}
          <div className="px-7 pt-5 pb-1">
            <ul className="space-y-2">
              {c.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="text-emerald-500 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="px-7 py-5 space-y-2.5">
            <Link
              href="/signup"
              onClick={dismiss}
              className="block w-full text-center py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
            >
              {c.cta1}
            </Link>
            <Link
              href="/subjects"
              onClick={dismiss}
              className="block w-full text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
            >
              {c.cta2}
            </Link>
            <button
              onClick={dismiss}
              className="block w-full text-center py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              {c.cta3}
            </button>
          </div>

          {/* Footer — language toggle */}
          <div className="border-t border-slate-100 px-7 py-3 flex items-center justify-between">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              🌐 {c.toggle}
            </button>
            <div className="text-[10px] text-slate-400">
              mbalearninghub.in
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
