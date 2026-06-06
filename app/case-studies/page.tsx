import type { Metadata } from 'next';
import Link from 'next/link';
import CaseStudySubmitForm from './CaseStudySubmitForm';

export const metadata: Metadata = {
  title: 'Case Study Hub — MBA Learning Hub',
  description:
    'Real classroom-inspired MBA business scenarios and practical management discussions. Explore case study categories and submit your own business case idea.',
};

type CaseStudyEntry = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
};

type Category = {
  id: string;
  icon: string;
  label: string;
  description: string;
  gradient: string;
  border: string;
  accent: string;
  badge: string;
  iconBg: string;
  caseStudies?: CaseStudyEntry[];
};

const categories: Category[] = [
  {
    id: 'financial-management',
    icon: '💰',
    label: 'Financial Management',
    description:
      'Capital structure decisions, investment analysis, working capital management, and corporate finance strategy.',
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    accent: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'managerial-economics',
    icon: '📈',
    label: 'Managerial Economics',
    description:
      'Demand forecasting, pricing strategies, market structure analysis, and cost-benefit decision-making.',
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  {
    id: 'marketing-management',
    icon: '🎯',
    label: 'Marketing Management',
    description:
      'Brand positioning, consumer behaviour, go-to-market strategy, digital marketing, and competitive analysis.',
    gradient: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    accent: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    iconBg: 'bg-rose-100',
  },
  {
    id: 'organizational-behavior',
    icon: '🤝',
    label: 'Organizational Behavior',
    description:
      'Leadership styles, team dynamics, organizational culture, change management, and motivation theories.',
    gradient: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    accent: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    iconBg: 'bg-violet-100',
  },
  {
    id: 'information-systems',
    icon: '💻',
    label: 'Information Systems',
    description:
      'Digital transformation, ERP implementation, IT governance, data management, and technology strategy.',
    gradient: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-200',
    accent: 'text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700',
    iconBg: 'bg-cyan-100',
    caseStudies: [
      {
        slug: 'dominos-pulse-mis',
        title: "Domino's PULSE™ System",
        subtitle: 'How technology transformed Domino\'s into a data-driven digital enterprise',
        tags: ['PoS System', 'CRM', 'VoIP', 'MIS S-01 & S-02'],
      },
    ],
  },
  {
    id: 'data-science',
    icon: '🔬',
    label: 'Data Science',
    description:
      'Predictive analytics, data-driven decision-making, machine learning applications, and business intelligence.',
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    accent: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
    iconBg: 'bg-orange-100',
  },
];

const highlights = [
  { icon: '🏢', label: 'Real Business Contexts', desc: 'Cases drawn from actual companies and markets' },
  { icon: '📚', label: 'Classroom-Inspired', desc: 'Rooted in what is taught in your MBA sessions' },
  { icon: '💡', label: 'Student Submitted', desc: 'Topics curated from student ideas and interests' },
];

export default function CaseStudyHubPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            📖 Case Study Hub
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Case Study Hub
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Real classroom-inspired MBA business scenarios and practical management discussions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#categories"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm"
            >
              Browse Categories →
            </a>
            <a
              href="#submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              📝 Submit an Idea
            </a>
          </div>
        </div>
      </section>

      {/* ── Highlights strip ─────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {h.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{h.label}</p>
                  <p className="text-xs text-slate-500">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ───────────────────────────────────── */}
      <section id="categories" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-indigo-600 tracking-widest uppercase mb-3">
              Browse by Subject
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Six core MBA subjects
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Each category will host curated business case studies once published by the platform team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`group relative bg-gradient-to-br ${cat.gradient} border ${cat.border} rounded-2xl p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
              >
                {/* Icon + count badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${cat.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
                    {cat.icon}
                  </div>
                  {cat.caseStudies && cat.caseStudies.length > 0 && (
                    <span className={`${cat.badge} text-[10px] font-bold px-2 py-1 rounded-full`}>
                      {cat.caseStudies.length} case{cat.caseStudies.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Label + description */}
                <h3 className="font-bold text-slate-900 text-base mb-2">{cat.label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">
                  {cat.description}
                </p>

                {/* Case studies list OR empty state */}
                {cat.caseStudies && cat.caseStudies.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {cat.caseStudies.map((cs) => (
                      <Link
                        key={cs.slug}
                        href={`/case-studies/${cs.slug}`}
                        className="block bg-white/80 hover:bg-white border border-white rounded-xl px-4 py-3 transition-colors group/card"
                      >
                        <p className={`text-xs font-bold ${cat.accent} mb-0.5 group-hover/card:underline`}>{cs.title}</p>
                        <p className="text-[11px] text-slate-500 leading-snug mb-2">{cs.subtitle}</p>
                        <div className="flex flex-wrap gap-1">
                          {cs.tags.map((tag) => (
                            <span key={tag} className={`${cat.badge} text-[9px] font-semibold px-1.5 py-0.5 rounded-md`}>{tag}</span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/70 border border-white rounded-xl px-4 py-3 mb-4">
                    <p className="text-xs text-slate-400 text-center leading-relaxed">
                      No case studies published yet.
                      <br />
                      <span className="text-slate-500 font-medium">New classroom business cases coming soon.</span>
                    </p>
                  </div>
                )}

                {/* CTA button */}
                {cat.caseStudies && cat.caseStudies.length > 0 ? (
                  <Link
                    href={`/case-studies/${cat.caseStudies[0].slug}`}
                    className={`inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border ${cat.border} ${cat.accent} text-xs font-semibold bg-white/80 hover:bg-white transition-colors group-hover:shadow-sm`}
                  >
                    Read Case Study →
                  </Link>
                ) : (
                  <a
                    href="#submit"
                    className={`inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border ${cat.border} ${cat.accent} text-xs font-semibold bg-white/80 hover:bg-white transition-colors group-hover:shadow-sm`}
                  >
                    Suggest a {cat.label} Case →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Case Study Banner ───────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-900 via-cyan-950 to-slate-900 rounded-2xl p-8 sm:p-10">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                💻
              </div>
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">
                  ✨ Now Published — Information Systems
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Domino&apos;s PULSE™ System
                </h2>
                <p className="text-cyan-200 text-sm leading-relaxed mb-4">
                  A complete MBA-ready MIS case study — 11 sections, SWOT, viva prep, and a downloadable Word document.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/case-studies/dominos-pulse-mis"
                    className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Read Case Study →
                  </Link>
                  <a
                    href="#submit"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    📝 Submit Your Idea
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Submit Form ──────────────────────────────────────── */}
      <section id="submit" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              📝 Submit Your Idea
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Want a topic covered?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Submit your business case idea below. Our team will review submissions and publish curated case studies on this hub.
            </p>
          </div>

          {/* What to submit info */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🏢', title: 'Pick a Company', ex: 'Amul, Tesla, Zomato, Infosys…' },
              { icon: '💡', title: 'Describe the Challenge', ex: 'Pricing strategy, expansion plan, OB culture issue…' },
              { icon: '📚', title: 'Tag a Subject', ex: 'Financial Mgmt, Marketing, Data Science…' },
            ].map((tip) => (
              <div key={tip.title} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-2">{tip.icon}</div>
                <p className="font-semibold text-slate-900 text-xs mb-1">{tip.title}</p>
                <p className="text-slate-400 text-[11px] leading-snug">{tip.ex}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">📝</span>
                Submit a Business Case Idea
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                No PDF/DOC uploads needed — just share the subject, topic, company, and problem.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <CaseStudySubmitForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/subjects"
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                📚
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Browse Lecture Notes</p>
                <p className="text-xs text-slate-500 mt-0.5">Explore all subjects and classroom lectures.</p>
              </div>
            </Link>

            <Link
              href="/feedback"
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-violet-200 transition-colors">
                💬
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Share Feedback</p>
                <p className="text-xs text-slate-500 mt-0.5">Help shape what gets built on this platform.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
