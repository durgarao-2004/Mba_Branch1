'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { subjects } from '@/lib/subjects';
import { SearchResult } from '@/types';

// Build a flat search index at module level (evaluated once)
const INDEX: SearchResult[] = subjects.flatMap((s) => [
  {
    type: 'subject',
    title: s.name,
    subtitle: `${s.lectures.length} lectures`,
    description: s.description,
    href: `/subjects/${s.slug}`,
    icon: s.icon,
    colorClass: s.colorClass,
    bgClass: s.bgClass,
    borderClass: s.borderClass,
  },
  ...s.lectures.map((l) => ({
    type: 'lecture' as const,
    title: l.title,
    subtitle: s.name,
    description: l.description,
    href: `/subjects/${s.slug}/${l.slug}`,
    icon: s.icon,
    colorClass: s.colorClass,
    bgClass: s.bgClass,
    borderClass: s.borderClass,
  })),
]);

function match(item: SearchResult, q: string): boolean {
  const lq = q.toLowerCase();
  return (
    item.title.toLowerCase().includes(lq) ||
    item.description.toLowerCase().includes(lq) ||
    item.subtitle.toLowerCase().includes(lq)
  );
}

function highlight(text: string, query: string): string {
  // Return plain text (highlighting done via CSS mark)
  return text;
}

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const results = trimmed.length >= 2 ? INDEX.filter((item) => match(item, trimmed)) : [];
  const subjects_results = results.filter((r) => r.type === 'subject');
  const lecture_results = results.filter((r) => r.type === 'lecture');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Search</h1>
        <p className="text-slate-500 text-sm">
          Search across {subjects.length} subjects and {INDEX.filter(i => i.type === 'lecture').length} lectures.
        </p>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lectures, subjects, concepts…"
          className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-base outline-none transition-all duration-150 bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Empty state */}
      {!trimmed && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Browse all subjects
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {subjects.map((s) => (
              <Link
                key={s.slug}
                href={`/subjects/${s.slug}`}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${s.borderClass} ${s.bgClass} hover:shadow-sm transition-shadow group`}
              >
                <span className="text-2xl">{s.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${s.colorClass}`}>{s.name}</p>
                  <p className="text-xs text-slate-500">{s.lectures.length} lectures</p>
                </div>
                <svg className={`w-4 h-4 ml-auto flex-shrink-0 ${s.colorClass} opacity-0 group-hover:opacity-100 transition-opacity`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Short query hint */}
      {trimmed.length === 1 && (
        <p className="text-slate-400 text-sm text-center py-10">
          Type at least 2 characters to search…
        </p>
      )}

      {/* Results */}
      {trimmed.length >= 2 && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔍</p>
              <p className="font-semibold text-slate-700 mb-1">No results for &ldquo;{trimmed}&rdquo;</p>
              <p className="text-sm text-slate-400">Try a different keyword or browse all subjects.</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{trimmed}&rdquo;
              </p>

              {/* Subjects results */}
              {subjects_results.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 mb-2.5">Subjects</p>
                  <div className="space-y-2">
                    {subjects_results.map((item) => (
                      <ResultCard key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Lecture results */}
              {lecture_results.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2.5">Lectures</p>
                  <div className="space-y-2">
                    {lecture_results.map((item) => (
                      <ResultCard key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({ item }: { item: SearchResult }) {
  return (
    <Link
      href={item.href}
      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-150 group"
    >
      <div className={`w-10 h-10 ${item.bgClass} rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${item.borderClass}`}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm font-semibold ${item.colorClass} group-hover:underline`}>
            {item.title}
          </p>
          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
            {item.type === 'subject' ? 'Subject' : 'Lecture'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-1">{item.subtitle}</p>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
      </div>
      <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
