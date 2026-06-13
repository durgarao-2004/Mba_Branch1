import Link from 'next/link';

const platformLinks = [
  { href: '/', label: 'Home' },
  { href: '/subjects', label: 'All Subjects' },
  { href: '/case-studies', label: 'Case Study Hub' },
  { href: '/attendance', label: 'Attendance Tool' },
  { href: '/search', label: 'Search Lectures' },
  { href: '/request', label: 'Request a Subject' },
  { href: '/about', label: 'About' },
];

const feedbackLinks = [
  { href: '/feedback', label: 'Feedback' },
  { href: '/case-studies#submit', label: 'Submit Case Idea' },
  { href: '/request', label: 'Request Subject' },
  { href: '/feedback#report', label: 'Report Issue' },
  { href: '/contact', label: 'Contact & Support' },
];

const subjectLinks = [
  { href: '/subjects/financial-management', label: 'Financial Management' },
  { href: '/subjects/managerial-economics', label: 'Managerial Economics' },
  { href: '/subjects/organizational-behavior', label: 'Organizational Behavior' },
  { href: '/subjects/marketing-management', label: 'Marketing Management' },
  { href: '/subjects/data-science', label: 'Data Science' },
  { href: '/subjects/information-systems', label: 'Information Systems' },
];

const legalLinks = [
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/community-guidelines', label: 'Community Guidelines' },
  { href: '/academic-integrity', label: 'Academic Integrity' },
  { href: '/contact', label: 'Contact & Grievance' },
];

const coreLinks = legalLinks.slice(0, 4);

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                M
              </div>
              <span className="font-bold text-white text-base">MBA Learning Hub</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              A student-driven educational platform focused on classroom lecture notes,
              revision material, and organized MBA study resources.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              ✉ Request a Subject →
            </Link>

            {/* Social placeholders */}
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href="#linkedin"
                aria-label="LinkedIn — coming soon"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm font-bold"
              >
                in
              </a>
              <a
                href="#instagram"
                aria-label="Instagram — coming soon"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs font-bold"
              >
                ig
              </a>
              <span className="text-[10px] text-slate-600 leading-tight">Socials<br />coming soon</span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Subjects</h3>
            <ul className="space-y-2.5">
              {subjectLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Community</h3>
            <ul className="space-y-2.5">
              {feedbackLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Help us improve — your feedback shapes the platform.
              </p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MBA Learning Hub — Free Academic Learning Platform
          </p>
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1">
            {coreLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
