interface DownloadButtonsProps {
  pdfPath: string;
  docxPath: string;
  title: string;
}

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

export default function DownloadButtons({ pdfPath, docxPath, title }: DownloadButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={pdfPath}
        download
        aria-label={`Download ${title} as PDF`}
        className="group inline-flex items-center gap-2.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow"
      >
        <span className="text-rose-500"><PdfIcon /></span>
        <span>Download PDF</span>
        <span className="text-[10px] font-normal text-slate-400 bg-slate-100 group-hover:bg-rose-100 group-hover:text-rose-500 px-1.5 py-0.5 rounded transition-colors">
          ~2 MB
        </span>
        <DownloadArrow />
      </a>

      <a
        href={docxPath}
        download
        aria-label={`Download ${title} as DOCX`}
        className="group inline-flex items-center gap-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow"
      >
        <span className="text-blue-500"><DocxIcon /></span>
        <span>Download DOCX</span>
        <span className="text-[10px] font-normal text-slate-400 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-500 px-1.5 py-0.5 rounded transition-colors">
          ~1 MB
        </span>
        <DownloadArrow />
      </a>
    </div>
  );
}
