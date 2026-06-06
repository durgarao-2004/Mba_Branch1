'use client';

import { useState } from 'react';
import { QuickRevision as QuickRevisionData } from '@/types';

interface Props {
  data: QuickRevisionData;
  subjectColor: string;
  subjectBg: string;
  subjectBorder: string;
}

interface PanelProps {
  id: string;
  icon: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Panel({ icon, title, badge, badgeColor = 'bg-slate-100 text-slate-600', defaultOpen = false, children }: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base leading-none flex-shrink-0">{icon}</span>
          <span className="font-semibold text-slate-800 text-sm leading-snug">{title}</span>
          {badge && (
            <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}

export default function QuickRevision({ data, subjectColor, subjectBg, subjectBorder }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section id="quick-revision" className="mb-8 scroll-mt-24">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 mb-4 cursor-pointer select-none"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
        </div>
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-white text-base sm:text-lg leading-none">
                  5-Minute Revision
                </h2>
                <span className="inline-flex items-center gap-1 bg-white/25 border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ⏱ 5 min
                </span>
              </div>
              <p className="text-amber-100 text-xs mt-0.5">
                Quick-read everything before your exam, quiz, or viva
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0">
            {collapsed ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="hidden sm:inline">Expand</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="hidden sm:inline">Collapse</span>
              </>
            )}
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-2.5">

          {/* One-Line Recap */}
          {data.summaryPoints.length > 0 && (
            <Panel id="rev-summary" icon="📍" title="One-Line Recap" badge={`${data.summaryPoints.length} points`} badgeColor="bg-amber-100 text-amber-700" defaultOpen>
              <ul className="space-y-2 mt-1">
                {data.summaryPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-slate-700 leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Key Frameworks */}
          {data.keyFrameworks.length > 0 && (
            <Panel id="rev-frameworks" icon="🔧" title="Key Frameworks to Know" badge={`${data.keyFrameworks.length} frameworks`} badgeColor="bg-indigo-100 text-indigo-700">
              <ul className="space-y-2 mt-1">
                {data.keyFrameworks.map((fw, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                    <span className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{fw}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Important Terms */}
          {data.importantTerms.length > 0 && (
            <Panel id="rev-terms" icon="📖" title="Important Definitions" badge={`${data.importantTerms.length} terms`} badgeColor={`${subjectBg} ${subjectColor}`}>
              <div className="grid gap-2 mt-1">
                {data.importantTerms.map((item, i) => (
                  <div key={i} className={`rounded-lg border ${subjectBorder} ${subjectBg} px-3 py-2`}>
                    <span className={`font-bold text-xs ${subjectColor}`}>{item.term}</span>
                    <span className="text-slate-500 text-xs"> — </span>
                    <span className="text-slate-700 text-xs leading-relaxed">{item.definition}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Exam Tips */}
          {data.examTips.length > 0 && (
            <Panel id="rev-exam" icon="🎯" title="Exam Focus Points" badge="High priority" badgeColor="bg-rose-100 text-rose-700">
              <ul className="space-y-2 mt-1">
                {data.examTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5">
                    <span className="text-rose-500 flex-shrink-0 mt-0.5 text-sm">⚠</span>
                    <span className="text-sm text-slate-700 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Formula Revision */}
          {data.formulaRevision.length > 0 && (
            <Panel id="rev-formulas" icon="📐" title="Formula & Rule Revision" badge={`${data.formulaRevision.length} formulas`} badgeColor="bg-emerald-100 text-emerald-700">
              <div className="grid gap-2 mt-1">
                {data.formulaRevision.map((f, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg px-4 py-3">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-emerald-400 font-mono text-sm font-semibold leading-snug">{f.formula}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Likely Questions */}
          {data.likelyQuestions.length > 0 && (
            <Panel id="rev-questions" icon="❓" title="Likely Exam Questions" badge={`${data.likelyQuestions.length} questions`} badgeColor="bg-violet-100 text-violet-700">
              <ol className="space-y-2 mt-1">
                {data.likelyQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{q}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          )}

        </div>
      )}
    </section>
  );
}
