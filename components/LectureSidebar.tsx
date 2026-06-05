'use client';

import { useState, useEffect } from 'react';

export interface SidebarSection {
  id: string;
  label: string;
  icon: string;
}

interface LectureSidebarProps {
  sections: SidebarSection[];
  lectureTitle: string;
}

export default function LectureSidebar({ sections, lectureTitle }: LectureSidebarProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const headings = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-10% 0% -60% 0%', threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Page navigation">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
        On this page
      </p>
      <ul className="space-y-0.5">
        {sections.map(({ id, label, icon }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(id);
                }}
                className={`flex items-center gap-2 text-sm py-1.5 px-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="text-base leading-none">{icon}</span>
                <span className="leading-snug">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <a
          href="#quiz"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId('quiz');
          }}
          className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors duration-150"
        >
          <span>🧠</span>
          Take the Quiz
        </a>
      </div>
    </nav>
  );
}
