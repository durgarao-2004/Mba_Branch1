'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types';

interface QuizProps {
  questions: QuizQuestion[];
}

type Phase = 'quiz' | 'results';

export default function QuizComponent({ questions }: QuizProps) {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [current, setCurrent] = useState(0);

  // Single source of truth: which option index the user picked for the current question.
  // null  → no answer yet  (Next button disabled)
  // 0-3   → answer picked  (Next button enabled)
  const [picked, setPicked] = useState<number | null>(null);

  // Running list of picked indices — one entry per completed question.
  const [answers, setAnswers] = useState<number[]>([]);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const hasAnswered = picked !== null;

  /* ── Option click ───────────────────────────────────────── */
  function handleOption(idx: number) {
    // JS guard only — no HTML disabled attribute on these buttons,
    // which can silently eat click/touch events on mobile.
    if (hasAnswered) return;
    setPicked(idx);
  }

  /* ── Next / Finish ──────────────────────────────────────── */
  function handleNext() {
    if (!hasAnswered) return; // safety guard

    const updatedAnswers = [...answers, picked as number];

    if (isLast) {
      // Commit final answer then switch to results
      setAnswers(updatedAnswers);
      setPhase('results');
    } else {
      setAnswers(updatedAnswers);
      setCurrent((c) => c + 1);
      setPicked(null); // reset for the next question
    }
  }

  /* ── Restart ────────────────────────────────────────────── */
  function handleRestart() {
    setCurrent(0);
    setPicked(null);
    setAnswers([]);
    setPhase('quiz');
  }

  /* ══════════════════════════════════════════════════════════
     RESULTS SCREEN
  ══════════════════════════════════════════════════════════ */
  if (phase === 'results') {
    const score = answers.filter((a, i) => a === questions[i].correct).length;
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : 'Needs Revision';
    const gradeColor =
      pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : 'text-rose-600';
    const headerBg =
      pct >= 80 ? 'bg-emerald-50' : pct >= 60 ? 'bg-blue-50' : 'bg-rose-50';
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';

    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Score banner */}
        <div className={`px-6 py-8 text-center border-b border-slate-100 ${headerBg}`}>
          <div className="text-5xl mb-3">{emoji}</div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Quiz Complete!</h3>
          <p className={`text-3xl font-bold ${gradeColor}`}>
            {score} / {questions.length}
          </p>
          <p className={`text-sm font-semibold ${gradeColor} mt-1`}>
            {pct}% — {grade}
          </p>
        </div>

        {/* Answer review */}
        <div className="p-5 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Answer Review
          </p>

          {questions.map((qn, i) => {
            const isCorrect = answers[i] === qn.correct;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-rose-200 bg-rose-50'
                }`}
              >
                <div className="flex items-start gap-2.5 mb-2.5">
                  <span className="flex-shrink-0 text-base mt-0.5">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {qn.question}
                  </p>
                </div>

                <div className="pl-7 space-y-1">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-emerald-700">Correct: </span>
                    {qn.options[qn.correct]}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-rose-700">
                      <span className="font-semibold">Your answer: </span>
                      {qn.options[answers[i]]}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 italic pt-0.5">{qn.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Restart */}
        <div className="px-5 pb-6">
          <button
            type="button"
            onClick={handleRestart}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition-colors duration-150 text-sm"
          >
            ↺ Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     QUIZ SCREEN
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

      {/* Progress bar — advances when a question is answered */}
      <div className="h-1.5 w-full bg-slate-100" role="progressbar"
        aria-valuenow={current} aria-valuemax={questions.length}>
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      {/* Use `key={current}` so React re-mounts this div on each new question,
          which triggers the slide-up animation cleanly. */}
      <div key={current} className="p-5 sm:p-6 animate-slide-up">

        {/* Header: counter + dot indicators */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Question {current + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  i < current
                    ? 'w-2 h-2 bg-blue-500'
                    : i === current
                    ? 'w-2.5 h-2.5 bg-blue-400 ring-2 ring-blue-200'
                    : 'w-2 h-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question text */}
        <h3 className="text-base font-semibold text-slate-900 leading-relaxed mb-5">
          {q.question}
        </h3>

        {/* ── Options ──────────────────────────────────────── */}
        {/* pointer-events-none after answering: CSS layer that prevents any
            re-click regardless of browser disabled-attribute behaviour.     */}
        <div className={`space-y-2.5 mb-5 ${hasAnswered ? 'pointer-events-none' : ''}`}>
          {q.options.map((option, idx) => {
            /* Compute option visual state */
            let optionCls =
              'w-full text-left flex items-center gap-3 p-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 select-none ';
            let badgeCls =
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-colors duration-150 ';

            if (!hasAnswered) {
              // ── Before answering ───────────────────────────
              if (picked === idx) {
                // Tapped but not confirmed yet (shouldn't happen with our logic,
                // but keeps styling consistent if state briefly shows a value)
                optionCls += 'border-blue-400 bg-blue-50 text-blue-800 cursor-pointer';
                badgeCls += 'border-blue-500 bg-blue-500 text-white';
              } else {
                optionCls +=
                  'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer';
                badgeCls += 'border-slate-300 text-slate-500';
              }
            } else {
              // ── After answering ────────────────────────────
              if (idx === q.correct) {
                optionCls += 'border-emerald-400 bg-emerald-50 text-emerald-800 cursor-default';
                badgeCls += 'border-emerald-500 bg-emerald-500 text-white';
              } else if (idx === picked) {
                optionCls += 'border-rose-400 bg-rose-50 text-rose-800 cursor-default';
                badgeCls += 'border-rose-500 bg-rose-500 text-white';
              } else {
                optionCls += 'border-slate-100 text-slate-400 cursor-default opacity-50';
                badgeCls += 'border-slate-300 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                /* No HTML `disabled` attribute — it silently blocks touch events
                   on some mobile browsers. The JS guard in handleOption() is enough. */
                onClick={() => handleOption(idx)}
                className={optionCls}
              >
                <span className={badgeCls}>
                  {String.fromCharCode(65 + idx)}
                </span>

                <span className="flex-1 text-left leading-snug">{option}</span>

                {/* Result tick / cross appears after answering */}
                {hasAnswered && idx === q.correct && (
                  <span className="ml-auto text-emerald-600 font-bold text-base leading-none">
                    ✓
                  </span>
                )}
                {hasAnswered && idx === picked && idx !== q.correct && (
                  <span className="ml-auto text-rose-600 font-bold text-base leading-none">
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation — appears immediately after an option is picked */}
        {hasAnswered && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mb-1.5">
              Explanation
            </p>
            <p className="text-sm text-blue-900 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* ── Next / Finish button ──────────────────────────── */}
        {/*
          No HTML `disabled` attribute — Chrome (and iOS Safari) suppress click
          events on disabled buttons BEFORE they reach React, making the button
          unresponsive even after state updates.

          Instead: CSS pointer-events:none blocks interaction visually/physically
          while React's onClick + the `if (!hasAnswered) return` guard handle
          logic. This is reliable across all browsers and rendering environments.
        */}
        <button
          type="button"
          onClick={handleNext}
          aria-disabled={!hasAnswered}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            hasAnswered
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          {isLast ? 'Finish & See Results →' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}
