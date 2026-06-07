'use client';

import { useState } from 'react';
import type { Lecture } from '@/types';

// ─── DOCX builder ─────────────────────────────────────────────────────────────

async function buildDocx(lecture: Lecture): Promise<Blob> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle,
  } = await import('docx');

  const ACCENT = '1E3A8A';
  const MUTED  = '64748B';

  // ── Helper builders ────────────────────────────────────────────────────────
  const h1 = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 360, after: 140 },
      border: { bottom: { color: ACCENT, size: 6, style: BorderStyle.SINGLE, space: 6 } },
    });

  const h2 = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
    });

  const h3 = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 22, color: ACCENT })],
      spacing: { before: 180, after: 80 },
    });

  const body = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22 })],
      spacing: { before: 80, after: 80 },
    });

  const bullet = (text: string, level = 0) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22 })],
      bullet: { level },
      spacing: { before: 60, after: 60 },
    });

  const spacer = () =>
    new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: 80, after: 80 } });

  const label = (lbl: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${lbl}: `, bold: true, size: 22, color: ACCENT }),
        new TextRun({ text: value, size: 22 }),
      ],
      spacing: { before: 60, after: 60 },
    });

  const divider = () =>
    new Paragraph({
      children: [new TextRun({ text: '' })],
      border: { bottom: { color: 'E2E8F0', size: 2, style: BorderStyle.SINGLE, space: 4 } },
      spacing: { before: 200, after: 200 },
    });

  // ── Document children ──────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // Title block
  children.push(
    new Paragraph({
      children: [new TextRun({ text: lecture.title, bold: true, size: 56, color: ACCENT })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'MBA Learning Hub • Lecture Notes', size: 20, color: MUTED })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
  );

  // Meta row
  const metaParts: string[] = [];
  if (lecture.date)              metaParts.push(`Date: ${new Date(lecture.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`);
  if (lecture.difficulty)        metaParts.push(`Difficulty: ${lecture.difficulty.charAt(0).toUpperCase() + lecture.difficulty.slice(1)}`);
  if (lecture.estimatedReadTime) metaParts.push(`Read time: ${lecture.estimatedReadTime}`);

  if (metaParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: metaParts.join('   •   '), size: 18, color: MUTED, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    );
  }

  children.push(divider());

  // ── Summary ────────────────────────────────────────────────────────────────
  children.push(h1('Lecture Summary'), body(lecture.summary), spacer());

  // ── Quick Revision (if present) ────────────────────────────────────────────
  if (lecture.quickRevision) {
    const qr = lecture.quickRevision;
    children.push(h1('5-Minute Quick Revision'));

    if (qr.summaryPoints?.length) {
      children.push(h2('Key Summary Points'));
      qr.summaryPoints.forEach(p => children.push(bullet(p)));
      children.push(spacer());
    }

    if (qr.importantTerms?.length) {
      children.push(h2('Important Terms'));
      qr.importantTerms.forEach(t => children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${t.term}: `, bold: true, size: 22 }),
            new TextRun({ text: t.definition, size: 22 }),
          ],
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
        }),
      ));
      children.push(spacer());
    }

    if (qr.keyFrameworks?.length) {
      children.push(h2('Key Frameworks'));
      qr.keyFrameworks.forEach(f => children.push(bullet(f)));
      children.push(spacer());
    }

    if (qr.examTips?.length) {
      children.push(h2('Exam Tips'));
      qr.examTips.forEach(t => children.push(bullet(t)));
      children.push(spacer());
    }

    if (qr.formulaRevision?.length) {
      children.push(h2('Formula Revision'));
      qr.formulaRevision.forEach(f => children.push(label(f.label, f.formula)));
      children.push(spacer());
    }

    if (qr.likelyQuestions?.length) {
      children.push(h2('Likely Exam Questions'));
      qr.likelyQuestions.forEach((q, i) => children.push(bullet(`Q${i + 1}. ${q}`)));
      children.push(spacer());
    }

    children.push(divider());
  }

  // ── Key Concepts ───────────────────────────────────────────────────────────
  if (lecture.concepts?.length) {
    children.push(h1('Key Concepts'));
    children.push(
      new Paragraph({
        children: lecture.concepts.map((c, i) => new TextRun({
          text: i < lecture.concepts.length - 1 ? `${c}  •  ` : c,
          size: 22,
        })),
        spacing: { before: 80, after: 160 },
      }),
    );
    children.push(spacer());
  }

  // ── Detailed Notes ─────────────────────────────────────────────────────────
  if (lecture.notes?.length) {
    children.push(h1('Detailed Notes'));
    lecture.notes.forEach((section, i) => {
      children.push(
        h3(`${i + 1}. ${section.heading}`),
        body(section.content),
        spacer(),
      );
    });
    children.push(divider());
  }

  // ── Real-World Example ─────────────────────────────────────────────────────
  if (lecture.example) {
    children.push(h1('Real-World Example'), body(lecture.example), spacer(), divider());
  }

  // ── Case Study ─────────────────────────────────────────────────────────────
  if (lecture.caseStudy) {
    children.push(h1('Case Study'), body(lecture.caseStudy), spacer(), divider());
  }

  // ── Key Takeaways ──────────────────────────────────────────────────────────
  if (lecture.takeaways?.length) {
    children.push(h1('Key Takeaways'));
    lecture.takeaways.forEach((t, i) => children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${i + 1}. `, bold: true, size: 22, color: ACCENT }),
          new TextRun({ text: t, size: 22 }),
        ],
        spacing: { before: 80, after: 80 },
      }),
    ));
    children.push(spacer(), divider());
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  if (lecture.quiz?.length) {
    children.push(h1(`Knowledge Quiz  (${lecture.quiz.length} Questions)`));
    lecture.quiz.forEach((q, i) => {
      const letters = ['a', 'b', 'c', 'd'];
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `Q${i + 1}. ${q.question}`, bold: true, size: 22 })],
          spacing: { before: 200, after: 80 },
        }),
        ...q.options.map((opt, oi) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `   ${letters[oi]}) ${opt}`,
                size: 22,
                bold: oi === q.correct,
                color: oi === q.correct ? '16A34A' : '374151',
              }),
            ],
            spacing: { before: 40, after: 40 },
          }),
        ),
        new Paragraph({
          children: [
            new TextRun({ text: 'Answer: ', bold: true, size: 22, color: '16A34A' }),
            new TextRun({ text: `${letters[q.correct]}) ${q.options[q.correct]}`, size: 22, color: '16A34A' }),
          ],
          spacing: { before: 80, after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Explanation: ', bold: true, size: 22, color: MUTED }),
            new TextRun({ text: q.explanation, size: 22, color: MUTED }),
          ],
          spacing: { before: 40, after: 120 },
        }),
      );
    });
    children.push(divider());
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'MBA Learning Hub • Information Systems Notes', size: 18, color: 'CBD5E1' }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      border: { top: { color: 'E2E8F0', size: 2, style: BorderStyle.SINGLE, space: 8 } },
    }),
  );

  const doc = new Document({ sections: [{ properties: {}, children }] });
  return Packer.toBlob(doc);
}

// ─── Icon components ──────────────────────────────────────────────────────────

function PdfIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 3v6h6M9 13h1.5a1.5 1.5 0 010 3H9v3m6-6v6m-3-3h3" />
    </svg>
  );
}

function DocxIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 3v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

function DownloadArrow() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:translate-y-0.5 transition-transform duration-150" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  lecture: Lecture;
}

export default function LectureDownloadButtons({ lecture }: Props) {
  const [generating, setGenerating] = useState(false);

  async function handleDocxDownload() {
    if (generating) return;
    setGenerating(true);
    try {
      const blob = await buildDocx(lecture);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${lecture.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')}_MBA_Notes.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DOCX generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* PDF — only show when a real path exists */}
      {lecture.pdfPath && (
        <a
          href={lecture.pdfPath}
          download
          aria-label={`Download ${lecture.title} as PDF`}
          className="group inline-flex items-center gap-2.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow"
        >
          <span className="text-rose-500"><PdfIcon /></span>
          <span>Download PDF</span>
          <span className="text-[10px] font-normal text-slate-400 bg-slate-100 group-hover:bg-rose-100 group-hover:text-rose-500 px-1.5 py-0.5 rounded transition-colors">
            ~2 MB
          </span>
          <DownloadArrow />
        </a>
      )}

      {/* DOCX — always available, generated on-the-fly */}
      <button
        onClick={handleDocxDownload}
        disabled={generating}
        aria-label={`Download ${lecture.title} as DOCX`}
        className="group inline-flex items-center gap-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 disabled:opacity-60 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow"
      >
        <span className="text-blue-500">
          {generating ? <Spinner /> : <DocxIcon />}
        </span>
        <span>{generating ? 'Generating…' : 'Download DOCX'}</span>
        {!generating && (
          <span className="text-[10px] font-normal text-slate-400 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-500 px-1.5 py-0.5 rounded transition-colors">
            .docx
          </span>
        )}
        {!generating && <DownloadArrow />}
      </button>
    </div>
  );
}
