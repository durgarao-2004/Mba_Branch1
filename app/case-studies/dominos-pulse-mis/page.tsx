'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── DOCX generation ────────────────────────────────────────────────────────

async function downloadDocx() {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, TableCell, TableRow, Table,
    WidthType, ShadingType,
  } = await import('docx');

  const ACCENT = '1E3A5F';
  const heading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 160 },
      border: { bottom: { color: ACCENT, size: 4, style: BorderStyle.SINGLE, space: 4 } },
    });

  const subheading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 100 },
    });

  const body = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22 })],
      spacing: { before: 80, after: 80 },
    });

  const bullet = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22 })],
      bullet: { level: 0 },
      spacing: { before: 60, after: 60 },
    });

  const bold = (label: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 22 }),
        new TextRun({ text: value, size: 22 }),
      ],
      spacing: { before: 60, after: 60 },
    });

  const swotCell = (label: string, points: string[], color: string) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: label, bold: true, size: 22, color })],
          spacing: { after: 80 },
        }),
        ...points.map(bullet),
      ],
      shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
    });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [new TextRun({ text: 'Case Study: Domino\'s PULSE™ System', bold: true, size: 48, color: ACCENT })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Management Information Systems — MBA Programme', size: 22, color: '64748B' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'How Technology Transformed Domino\'s Into a Digital Enterprise', italics: true, size: 22, color: '94A3B8' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        heading('1. Case Overview'),
        body('This case examines how Domino\'s Pizza — the globally recognised quick-service restaurant chain — leveraged a proprietary Management Information System called PULSE™ to radically overhaul its order management, inventory control, customer relationship management, and business reporting. The case illustrates the practical application of strategic IS objectives discussed in the MIS framework and demonstrates how technology can become the backbone of operational excellence in a high-volume service industry.'),
        body('At its core, the Domino\'s PULSE™ case answers a fundamental MIS question: How can a geographically dispersed organisation with thousands of outlets maintain consistent service delivery, real-time visibility, and data-driven decision-making? For MBA students, this case bridges theory and practice — connecting information systems concepts directly to business outcomes.'),

        heading('2. Company Background'),
        bold('Founded', '1960, Ann Arbour, Michigan, USA'),
        bold('Presence', 'Over 10,000 corporate and franchise stores across 70+ countries'),
        bold('India Operations', 'Since 1996; sells 4 lakh pizzas daily; 12 crore pizzas annually'),
        bold('Scale in India', 'Sells nearly twice the number of burgers McDonald\'s sells in India'),
        bold('Revenue Split', 'More than 50% of revenues from international operations'),
        bold('Digital Orders', 'Over one-third of all store orders originate from online sources'),
        body(''),
        body('Domino\'s began its digital transformation journey out of operational necessity. Managing 10,000+ stores with consistent quality, delivery speed, and customer satisfaction was impossible without a robust information system. The company\'s aggressive international expansion — particularly in India — placed enormous strain on its legacy systems, making a technology overhaul both urgent and strategically essential.'),
        body('Domino\'s business model revolves around speed and consistency. The "30-minute delivery" brand promise is not just a marketing tagline — it is an operational commitment backed by technology. Every order placed, every pizza made, and every delivery executed must be tracked, measured, and optimised in real time. This operational DNA drove the development of the PULSE™ system.'),

        heading('3. Core MIS Problem / Challenge'),
        body('Domino\'s faced a classic scaling problem that MIS is designed to solve. As the organisation expanded into multiple geographies with hundreds of independent and franchise outlets, four critical operational challenges emerged:'),
        subheading('Information Flow Fragmentation'),
        body('Order data, inventory levels, sales reports, and customer histories were siloed at individual store levels. There was no centralised real-time visibility for management. A manager wanting to understand India-wide sales trends had no reliable, instant data source.'),
        subheading('Customer Recognition & Repeat Business'),
        body('Without a unified customer database, each store treated repeat customers as new callers. Personalisation — a proven CRM technique — was impossible. The system could not leverage order history to suggest relevant menu items or identify at-risk customers who had stopped ordering.'),
        subheading('Peak Load Management'),
        body('During weekends and public holidays, call volumes at individual stores exceeded capacity. Overflow calls were lost, resulting in missed revenue and customer dissatisfaction. There was no dynamic routing mechanism to handle demand spikes intelligently.'),
        subheading('Communication & Coordination Across Network'),
        body('Internal communication between branches, regional managers, and headquarters was inefficient. Performance data had to be manually compiled and shared, introducing delays and errors in decision-making at every management level.'),

        heading('4. MIS Concepts Applied'),
        subheading('4.1 Components of Information Systems'),
        body('The PULSE™ system exemplifies all five IS components covered in the MIS lecture:'),
        bullet('Hardware: Touchscreen terminals at each store, backup servers, mobile devices'),
        bullet('Software: PULSE™ PoS application with GUI, eConnect sub-system, mobile app for iOS/Android'),
        bullet('Database: Centralised customer order history, inventory records, sales data'),
        bullet('Network: VoIP infrastructure, internet-based order transmission, real-time data sync'),
        bullet('People: Store employees, managers, virtual call-centre agents, senior management'),
        subheading('4.2 Six Strategic Business Objectives of IS'),
        body('As covered in Laudon & Laudon\'s MIS framework, Domino\'s PULSE™ achieves all six strategic objectives:'),
        bullet('Operational Excellence: Automated order processing, real-time inventory tracking, and wastage analysis reduce costs and improve throughput'),
        bullet('New Business Models: Online ordering, mobile app, virtual call centres represent entirely new order acquisition channels'),
        bullet('Customer & Supplier Intimacy: PULSE™ CRM identifies loyal and at-risk customers; personalised offers strengthen relationships'),
        bullet('Improved Decision Making: Push/pull reporting at every management level provides real-time, accurate data for decisions'),
        bullet('Competitive Advantage: 30-minute delivery backed by technology — a promise competitors cannot easily replicate'),
        bullet('Survival: VoIP and digital infrastructure reduce operational costs, making the business model sustainable at scale'),
        subheading('4.3 Levels of Management and Information'),
        body('The PULSE™ system serves all three management levels — perfectly aligning with the management hierarchy discussed in the MIS framework:'),
        bullet('Operational Level: Store representatives use touchscreen terminals for daily order entry, customer identification, and refund processing. Information is detailed, real-time, and structured.'),
        bullet('Tactical Level: Branch managers use PULSE™ to generate monthly performance reports (net sales, growth rates, order volumes), compare performance across periods, and make resource allocation decisions about targeted marketing pamphlets.'),
        bullet('Strategic Level: Senior management receives consolidated push reports across the entire network, enabling market trend analysis, expansion decisions, and long-range planning.'),
        subheading('4.4 Impact of IT: Efficiency, Effectiveness, Transformation'),
        body('Domino\'s PULSE™ demonstrates IT impact at all three levels from the lecture framework:'),
        bullet('Efficiency (Task Mechanization): Order entry is automated; VoIP routes calls without human intervention; inventory worksheets are generated automatically'),
        bullet('Effectiveness (Work Improvement): Managers can generate exception reports, track anomalies, and direct targeted marketing based on accurate data'),
        bullet('Transformation (Role Expansion): Area colour-coding (Yellow/Green/Red) fundamentally reimagines how a pizza chain manages market penetration and marketing resource allocation'),

        heading('5. Strategic Analysis'),
        subheading('Technology as Competitive Moat'),
        body('Domino\'s PULSE™ system functions as a strategic asset, not merely an operational tool. By integrating ordering, CRM, inventory, communications, and reporting into a single platform, Domino\'s built a capability that is difficult and expensive for competitors to replicate quickly. This aligns with Porter\'s concept of IT-driven competitive advantage — using information systems to create barriers to imitation.'),
        subheading('Data-Driven Market Penetration'),
        body('The colour-coded locality analysis (Yellow/Green/Red zones) is a sophisticated application of data-driven decision-making. Rather than distributing marketing materials uniformly, Domino\'s allocates promotional resources based on measured order frequency — a practice that maximises marketing ROI and is entirely enabled by the PULSE™ data infrastructure. Yellow zones (5-10% orders) receive basic menu pamphlets to build habit; Green zones (10-30%) receive mid-range promotions; Red zones (60%) receive premium-item promotion to maximise revenue per loyal customer.'),
        subheading('Digital Firm Characteristics'),
        body('Domino\'s increasingly resembles the "digital firm" concept from the MIS framework — where significant business relationships are digitally enabled, core processes are accomplished through digital networks, and corporate assets are managed digitally. The mobile app, online ordering, VoIP network, and centralised reporting system collectively define Domino\'s as an emerging digital enterprise in the quick-service restaurant sector.'),

        heading('6. Operational Analysis'),
        body('The PULSE™ system orchestrates Domino\'s entire operational flow from the moment a customer contacts the store:'),
        bullet('Customer Contact: VoIP detects caller location, routes to nearest store; order history instantly retrieved'),
        bullet('Order Processing: Representative selects items via touchscreen; order auto-transferred to central server'),
        bullet('Production Coordination: Order reaches kitchen immediately; 30-minute SLA clock begins'),
        bullet('Peak Load Management: Overflow calls routed to virtual call centres; orders transmitted digitally to nearest outlet'),
        bullet('Inventory Management: Raw material usage tracked against ideal usage; variance analysis conducted; wastage reports collated at HQ'),
        bullet('Performance Reporting: Monthly consolidated reports generated via PULSE™; push-delivered to senior management'),
        body(''),
        body('The mobile application adds another operational dimension. It allows customers to customise pizzas, access promotional coupons, track orders, and pay digitally — reducing order errors, increasing average transaction value, and lowering the inbound call volume that strains store resources.'),

        heading('7. SWOT Analysis'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                swotCell('STRENGTHS', [
                  'PULSE™ provides real-time visibility across 10,000+ stores',
                  'CRM-driven personalisation improves customer retention',
                  'VoIP reduces telecom costs significantly',
                  'Data-driven locality marketing maximises ROI',
                  'Mobile app creates direct customer channel',
                ], '16A34A'),
                swotCell('WEAKNESSES', [
                  'High IT infrastructure investment and maintenance cost',
                  'System downtime risk at store level impacts operations directly',
                  'Technology literacy dependency among franchise operators',
                  'Over-reliance on single proprietary platform creates lock-in',
                ], 'DC2626'),
              ],
            }),
            new TableRow({
              children: [
                swotCell('OPPORTUNITIES', [
                  'AI/ML integration for predictive ordering and demand forecasting',
                  'Big data analytics for deeper consumer behaviour insights',
                  'Expansion of cloud-based architecture for global scalability',
                  'IoT integration for kitchen equipment monitoring and predictive maintenance',
                ], '2563EB'),
                swotCell('THREATS', [
                  'Cybersecurity risks — customer data breach potential',
                  'Rising IT costs as system complexity increases',
                  'Competitors adopting similar PoS and digital ordering infrastructure',
                  'Regulatory compliance requirements (GDPR, India PDPB) on customer data',
                ], 'D97706'),
              ],
            }),
          ],
        }),

        heading('8. Recommendations'),
        bullet('AI-Powered Demand Forecasting: Integrate machine learning models to predict demand by locality, time of day, and season — enabling smarter inventory procurement and staffing decisions.'),
        bullet('Cloud Migration: Move from distributed backup servers to a cloud-first architecture to reduce hardware costs, improve uptime, and enable real-time cross-store data synchronisation at lower total cost.'),
        bullet('CRM Enhancement: Implement loyalty programme tiers within PULSE™, using customer lifetime value (CLV) analysis to identify high-value customers and design personalised retention strategies.'),
        bullet('Cybersecurity Investment: As digital order volumes grow, invest in end-to-end encryption for customer payment and personal data. Conduct quarterly security audits and implement PDPB compliance frameworks in India.'),
        bullet('Dashboard Intelligence: Develop an executive dashboard that aggregates PULSE™ data with external market intelligence (competitor activity, social media sentiment) to support strategic decision-making at the top management level.'),

        heading('9. Classroom Discussion Questions'),
        body('The following questions are likely to be raised in classroom sessions on this case study:'),
        bullet('How does the PULSE™ system align with the six strategic business objectives of information systems identified by Laudon & Laudon? Which objective does it serve most effectively, and why?'),
        bullet('Domino\'s uses a colour-coded locality analysis to direct marketing resources. Is this an application of CRM, business intelligence, or decision support systems? Justify your categorisation.'),
        bullet('Compare Domino\'s use of VoIP with traditional telephony from a cost-benefit perspective. What other IS components could be disrupted by emerging technologies?'),
        bullet('The PULSE™ system serves all three management levels — operational, tactical, and strategic. Using specific examples from the case, explain what type of information each level receives and how it differs in form, frequency, and function.'),
        bullet('What are the risks of Domino\'s heavy dependence on a single proprietary IS platform? How should they manage system failure scenarios?'),
        bullet('If Domino\'s were to expand into a new country with limited IT infrastructure, how would you redesign the PULSE™ system to accommodate low-bandwidth conditions while maintaining core functionality?'),

        heading('10. Viva Preparation Questions'),
        bullet('Q: What is the PULSE™ system and what does it do? A: It is a graphical user-interface, touchscreen-based Point-of-Sale (PoS) system that manages ordering, inventory, and reporting across Domino\'s stores. It integrates CRM, communication, and data analytics in one platform.'),
        bullet('Q: Which IS component does VoIP represent? A: VoIP is part of the Network component of information systems — it enables telecommunications by transmitting voice over internet infrastructure, routing calls to nearest stores automatically.'),
        bullet('Q: How does the PULSE™ system support improved decision-making? A: Through push/pull reporting, managers receive real-time sales data, exception reports, and locality-wise order analysis, enabling them to make evidence-based decisions rather than relying on intuition or delayed data.'),
        bullet('Q: What is eConnect and how does it function? A: eConnect is a sub-system within PULSE™ that enables internal communication between branches and headquarters. It facilitates coordination across the franchise network.'),
        bullet('Q: How does Domino\'s PULSE™ demonstrate the "Transformation" level of IT impact? A: The colour-coded area classification (Yellow/Green/Red) transforms the marketing function by redefining how the organisation allocates promotional resources based on real data, not assumptions.'),
        bullet('Q: What is the relationship between operational efficiency and IS investment? A: Information systems reduce transaction costs, improve process speed, and enable data-driven management — all of which increase output while reducing waste, directly improving profitability.'),

        heading('11. Key Takeaways'),
        body('For rapid revision before class, remember these core points:'),
        bullet('PULSE™ is Domino\'s proprietary PoS and IS platform — it manages ordering, CRM, inventory, reporting, and communications.'),
        bullet('The system achieves all six strategic IS objectives: Operational Excellence, New Business Models, Customer Intimacy, Improved Decision Making, Competitive Advantage, and Survival.'),
        bullet('It serves three management levels: store operations (operational), branch managers (tactical), and senior management (strategic), each receiving appropriately formatted information.'),
        bullet('VoIP, mobile app, virtual call centres, and eConnect are the key technology sub-components that extend PULSE™ beyond basic PoS functionality.'),
        bullet('Locality colour-coding (Yellow/Green/Red) demonstrates sophisticated data-driven marketing resource allocation — a real-world application of IS-enabled decision-making.'),
        bullet('Key IS concepts applied: CRM, PoS, ERP-like integration, Decision Support Systems, real-time data processing, and tactical/strategic reporting.'),
        bullet('SWOT: Strong IT core, but risks include cybersecurity exposure, franchise technology dependency, and rising infrastructure costs.'),
        bullet('Future path: AI/ML integration, cloud migration, enhanced CRM with CLV analysis, and executive dashboards.'),

        new Paragraph({
          children: [
            new TextRun({ text: 'MBA Learning Hub — Management Information Systems', size: 18, color: '94A3B8' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          border: { top: { color: 'E2E8F0', size: 2, style: BorderStyle.SINGLE, space: 4 } },
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Dominos_PULSE_MIS_Case_Study_MBA.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Static content data ─────────────────────────────────────────────────────

const sections = [
  { id: 'overview', label: 'Case Overview' },
  { id: 'background', label: 'Company Background' },
  { id: 'problem', label: 'Core MIS Problem' },
  { id: 'concepts', label: 'MIS Concepts Applied' },
  { id: 'strategy', label: 'Strategic Analysis' },
  { id: 'operations', label: 'Operational Analysis' },
  { id: 'swot', label: 'SWOT Analysis' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'discussion', label: 'Discussion Questions' },
  { id: 'viva', label: 'Viva Preparation' },
  { id: 'takeaways', label: 'Key Takeaways' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </section>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 text-sm leading-relaxed">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {items.map(({ label, value }) => (
        <div key={label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-slate-800">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <h3 className="text-sm font-bold text-cyan-700 mb-2 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-cyan-500 inline-block" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function ObjectiveBadge({ num, label, desc }: { num: string; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-xl border border-cyan-100">
      <span className="w-7 h-7 bg-cyan-600 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{num}</span>
      <div>
        <p className="text-xs font-bold text-cyan-800">{label}</p>
        <p className="text-xs text-cyan-700 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function DiscussionCard({ num, question }: { num: number; question: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{num}</span>
      <p className="text-sm text-indigo-900 leading-relaxed">{question}</p>
    </div>
  );
}

function VivaCard({ question, hint }: { question: string; hint: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-slate-800 pr-4">{question}</span>
        <span className="text-slate-400 flex-shrink-0 text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">{hint}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DominosMISCaseStudy() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadDocx();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-cyan-400">Domino&apos;s PULSE™</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  💻 Information Systems
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  📖 Case Study
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  MIS S-01 & S-02
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                Domino&apos;s PULSE™ System
              </h1>
              <p className="text-cyan-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                How a touchscreen Point-of-Sale system transformed Domino&apos;s into a data-driven digital enterprise — and what it teaches us about the strategic power of information systems.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              {downloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '⬇'
              )}
              {downloading ? 'Generating…' : 'Download .docx'}
            </button>
            <a
              href="#overview"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Start Reading →
            </a>
          </div>
        </div>
      </div>

      {/* ── Quick stats bar ──────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Industry', value: 'Quick Service Restaurant' },
              { label: 'Subject', value: 'Management Information Systems' },
              { label: 'Focus System', value: 'PULSE™ Point-of-Sale' },
              { label: 'Sections', value: '11 Study Sections' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: TOC + Content ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-10 flex gap-8">

        {/* ── Sticky TOC (desktop only) ──────────────────────────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-5 border-t border-slate-200">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-xs"
              >
                {downloading ? '…' : '⬇'} Download
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* 1. Case Overview */}
          <SectionCard id="overview" title="1. Case Overview" icon="📋">
            <Prose>
              This case examines how Domino&apos;s Pizza — the globally recognised quick-service restaurant chain —
              leveraged a proprietary Management Information System called PULSE™ to radically overhaul its
              order management, inventory control, customer relationship management, and business reporting.
            </Prose>
            <Prose>
              At its core, the case answers a fundamental MIS question: <strong className="text-slate-800">How can a geographically dispersed
              organisation with thousands of outlets maintain consistent service delivery, real-time visibility,
              and data-driven decision-making?</strong> For MBA students, this case bridges theory and practice —
              connecting IS components, strategic business objectives, and management levels to tangible business outcomes.
            </Prose>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '🏪', title: 'Operational Scale', desc: '10,000+ stores, 70 countries, millions of daily transactions' },
                { icon: '💻', title: 'IS at the Core', desc: 'PULSE™ integrates ordering, CRM, inventory, and reporting' },
                { icon: '📊', title: 'Why It Matters', desc: 'Textbook example of all six strategic IS objectives in action' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
                  <div className="text-xl mb-2">{icon}</div>
                  <p className="text-xs font-bold text-cyan-800 mb-1">{title}</p>
                  <p className="text-xs text-cyan-700 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 2. Company Background */}
          <SectionCard id="background" title="2. Company Background" icon="🏢">
            <InfoGrid items={[
              { label: 'Founded', value: '1960, Ann Arbour, Michigan, USA' },
              { label: 'Global Presence', value: '10,000+ stores in 70+ countries' },
              { label: 'India Entry', value: '1996 — now largest international market' },
              { label: 'India Daily Orders', value: '4 lakh pizzas/day, 12 crore/year' },
              { label: 'Digital Orders', value: '1/3+ orders from online sources' },
              { label: 'Revenue Mix', value: '50%+ revenues from international ops' },
            ]} />
            <div className="mt-5 space-y-3">
              <Prose>
                Domino&apos;s business model revolves around <strong className="text-slate-800">speed and consistency</strong>.
                The &quot;30-minute delivery&quot; brand promise is not merely a marketing tagline — it is an
                operational commitment backed entirely by technology. Every order placed, every pizza made,
                and every delivery executed must be tracked, measured, and optimised in real time.
              </Prose>
              <Prose>
                The company&apos;s aggressive international expansion — particularly into India where it sells
                nearly twice the number of burgers that McDonald&apos;s sells — placed enormous strain on
                legacy systems. Domino&apos;s had to build technology infrastructure that could scale globally
                while remaining operationally responsive at the individual store level.
              </Prose>
            </div>
          </SectionCard>

          {/* 3. Core MIS Problem */}
          <SectionCard id="problem" title="3. Core MIS Problem / Challenge" icon="⚠️">
            <Prose>
              Domino&apos;s faced a classic scaling problem that MIS is designed to solve. As the organisation
              expanded into multiple geographies with hundreds of independent and franchise outlets, four critical
              operational challenges emerged:
            </Prose>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Information Flow Fragmentation',
                  desc: 'Order data, inventory levels, sales reports, and customer histories were siloed at individual store levels. No centralised real-time visibility existed for management. A manager wanting India-wide sales trends had no reliable, instant data source.',
                  color: 'red',
                },
                {
                  title: 'Customer Recognition & CRM Gap',
                  desc: 'Without a unified customer database, stores treated repeat customers as new callers. Personalisation was impossible — the system could not leverage order history to suggest items or identify at-risk customers who had stopped ordering.',
                  color: 'orange',
                },
                {
                  title: 'Peak Load Management',
                  desc: 'During weekends and holidays, call volumes exceeded individual store capacity. Overflow calls were lost, resulting in missed revenue and customer dissatisfaction. No dynamic routing mechanism existed to handle demand spikes intelligently.',
                  color: 'amber',
                },
                {
                  title: 'Network Communication & Coordination',
                  desc: 'Internal communication between branches, regional managers, and HQ was inefficient. Performance data had to be manually compiled, introducing delays and errors in decision-making at every management level.',
                  color: 'rose',
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800 mb-1">{title}</p>
                    <p className="text-xs text-red-700 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 4. MIS Concepts Applied */}
          <SectionCard id="concepts" title="4. MIS Concepts Applied" icon="💡">

            <SubSection title="4.1 Five Components of Information Systems (from S-02 PPT)">
              <Prose>The PULSE™ system exemplifies all five IS components covered in lecture:</Prose>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { comp: 'Hardware', detail: 'Touchscreen terminals, backup servers, mobile devices at each outlet' },
                  { comp: 'Software', detail: 'PULSE™ PoS application, eConnect sub-system, iOS/Android mobile app' },
                  { comp: 'Database', detail: 'Centralised customer order history, inventory records, sales analytics' },
                  { comp: 'Network', detail: 'VoIP infrastructure, internet-based order transmission, real-time sync' },
                  { comp: 'People', detail: 'Store employees, managers, virtual call-centre agents, senior leadership' },
                ].map(({ comp, detail }) => (
                  <div key={comp} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{comp[0]}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{comp}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="4.2 Six Strategic Business Objectives of IS (from S-02 PPT)">
              <Prose>As covered in the Laudon &amp; Laudon MIS framework, PULSE™ achieves all six objectives:</Prose>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ObjectiveBadge num="1" label="Operational Excellence" desc="Automated ordering, real-time inventory tracking, and wastage analysis reduce costs while improving throughput" />
                <ObjectiveBadge num="2" label="New Business Models" desc="Online ordering, mobile app, and virtual call centres are entirely new order acquisition channels" />
                <ObjectiveBadge num="3" label="Customer & Supplier Intimacy" desc="PULSE™ CRM identifies loyal and at-risk customers; managers personally call inactive customers with targeted offers" />
                <ObjectiveBadge num="4" label="Improved Decision Making" desc="Push/pull reporting at every management level provides real-time, accurate data for both daily and strategic decisions" />
                <ObjectiveBadge num="5" label="Competitive Advantage" desc="Technology-backed 30-minute delivery — a service promise competitors cannot easily replicate without the same IS infrastructure" />
                <ObjectiveBadge num="6" label="Survival" desc="VoIP reduces telecom expenses; digital infrastructure keeps the franchise model economically viable at scale" />
              </div>
            </SubSection>

            <SubSection title="4.3 Management Levels and Information (from S-01 PPT)">
              <Prose>The PULSE™ system serves all three management levels from the lecture pyramid:</Prose>
              <div className="mt-3 space-y-2">
                {[
                  { level: 'Operational', color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', desc: 'Store representatives use touchscreen terminals for daily order entry, customer identification, and refund processing. Information is detailed, real-time, and internally structured.' },
                  { level: 'Tactical (Middle)', color: 'bg-blue-50 border-blue-200', text: 'text-blue-800', desc: 'Branch managers generate monthly performance reports (net sales, growth rates, order volumes), compare performance across periods, and direct targeted marketing using area colour-coding.' },
                  { level: 'Strategic (Top)', color: 'bg-violet-50 border-violet-200', text: 'text-violet-800', desc: 'Senior management receives consolidated push reports across the entire network, enabling market trend analysis, expansion decisions, and long-range planning. Data is summary-form and predictive.' },
                ].map(({ level, color, text, desc }) => (
                  <div key={level} className={`p-3 rounded-xl border ${color}`}>
                    <p className={`text-xs font-bold ${text} mb-1`}>{level} Management</p>
                    <p className={`text-xs ${text} opacity-80 leading-relaxed`}>{desc}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="4.4 Impact of IT: Efficiency → Effectiveness → Transformation">
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">Level</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">Mechanism</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">Domino&apos;s Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { level: 'Efficiency', mech: 'Task Mechanization / Process Automation', app: 'Automated order routing via VoIP; touchscreen order entry; inventory worksheets auto-generated' },
                      { level: 'Effectiveness', mech: 'Work Improvement / Functional Enhancement', app: 'Exception reports flag order delays; managers can target marketing pamphlets based on locality data' },
                      { level: 'Transformation', mech: 'Role Expansion / Product Innovation', app: 'Colour-coded area segmentation (Yellow/Green/Red) redefines how marketing resources are allocated across geographies' },
                    ].map(({ level, mech, app }) => (
                      <tr key={level} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 border border-slate-200 font-semibold text-cyan-700">{level}</td>
                        <td className="px-3 py-2.5 border border-slate-200 text-slate-600">{mech}</td>
                        <td className="px-3 py-2.5 border border-slate-200 text-slate-600">{app}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>
          </SectionCard>

          {/* 5. Strategic Analysis */}
          <SectionCard id="strategy" title="5. Strategic Analysis" icon="♟️">
            <div className="space-y-5">
              <SubSection title="Technology as Competitive Moat">
                <Prose>
                  Domino&apos;s PULSE™ functions as a <strong className="text-slate-800">strategic asset, not merely an operational tool</strong>.
                  By integrating ordering, CRM, inventory, communications, and reporting into a single platform,
                  Domino&apos;s built a capability that is difficult and expensive for competitors to replicate quickly.
                  This aligns with Porter&apos;s concept of IT-driven competitive advantage — using IS to create barriers to imitation.
                </Prose>
              </SubSection>

              <SubSection title="Data-Driven Market Penetration">
                <Prose>
                  The colour-coded locality analysis (Yellow/Green/Red) is a sophisticated application of
                  data-driven decision-making. Rather than distributing marketing materials uniformly,
                  Domino&apos;s allocates promotional resources based on measured order frequency — a practice
                  that maximises marketing ROI and is entirely enabled by PULSE™ data infrastructure.
                </Prose>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { color: 'bg-yellow-400', label: 'Yellow Zone', range: '5–10% orders', action: 'Basic menu pamphlets to build ordering habit' },
                    { color: 'bg-green-500', label: 'Green Zone', range: '10–30% orders', action: 'Mid-range promotions to grow frequency' },
                    { color: 'bg-red-500', label: 'Red Zone', range: '60% orders', action: 'Premium & specialised items — max revenue from loyal base' },
                  ].map(({ color, label, range, action }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <div className={`w-5 h-5 ${color} rounded-full mx-auto mb-2`} />
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{range}</p>
                      <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">{action}</p>
                    </div>
                  ))}
                </div>
              </SubSection>

              <SubSection title="The Emerging Digital Firm (from S-02 PPT)">
                <Prose>
                  Domino&apos;s increasingly resembles the <strong className="text-slate-800">&quot;digital firm&quot;</strong> concept —
                  where significant business relationships are digitally enabled, core processes are accomplished
                  through digital networks, and key corporate assets are managed digitally.
                  The mobile app, online ordering, VoIP network, and centralised reporting collectively define
                  Domino&apos;s as an emerging digital enterprise in the QSR sector.
                </Prose>
              </SubSection>
            </div>
          </SectionCard>

          {/* 6. Operational Analysis */}
          <SectionCard id="operations" title="6. Operational Analysis" icon="⚙️">
            <Prose>
              The PULSE™ system orchestrates Domino&apos;s entire operational flow from customer contact to post-delivery reporting:
            </Prose>
            <div className="mt-4 space-y-2">
              {[
                { step: '01', title: 'Customer Contact', desc: 'VoIP detects caller location, routes call to nearest store. Customer number flashes on screen; order history retrieved instantly.' },
                { step: '02', title: 'Order Processing', desc: 'Representative selects items via touchscreen; personalised suggestions based on order history. Order auto-transferred to central server.' },
                { step: '03', title: 'Production & Delivery', desc: 'Order reaches kitchen immediately. 30-minute SLA clock begins. Delivery tracking active.' },
                { step: '04', title: 'Peak Load Handling', desc: 'Overflow calls routed to virtual call-centre agents. Orders transmitted digitally to nearest outlet for fulfilment.' },
                { step: '05', title: 'Inventory Management', desc: 'Raw material usage tracked against ideal usage. Variance calculated to identify waste. Branch-level reports collated at HQ.' },
                { step: '06', title: 'Performance Reporting', desc: 'Monthly consolidated reports via PULSE™. Push-delivered to senior management. Comparative analysis across time periods and stores.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-cyan-300 transition-colors">
                  <span className="w-8 h-8 bg-cyan-600 text-white rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0">{step}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
              <p className="text-xs font-bold text-cyan-800 mb-1.5">Mobile App — The Extended IS</p>
              <Prose>
                The Android/iOS app allows customers to customise pizzas, access promotional coupons, and pay digitally
                — reducing order errors, increasing average transaction value, and lowering inbound call volume at stores.
                SMS/Email marketing integration enables offer redemption directly through the app, creating a closed-loop
                digital marketing and ordering system.
              </Prose>
            </div>
          </SectionCard>

          {/* 7. SWOT */}
          <SectionCard id="swot" title="7. SWOT Analysis" icon="🔲">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: 'Strengths', icon: '💪', color: 'bg-emerald-50 border-emerald-200',
                  headerColor: 'text-emerald-700', dotColor: 'bg-emerald-500',
                  points: [
                    'PULSE™ provides real-time visibility across 10,000+ stores',
                    'CRM-driven personalisation improves customer retention',
                    'VoIP reduces telecom costs significantly',
                    'Data-driven locality marketing maximises promotional ROI',
                    'Mobile app creates a direct, low-cost customer channel',
                  ],
                },
                {
                  label: 'Weaknesses', icon: '⚠️', color: 'bg-red-50 border-red-200',
                  headerColor: 'text-red-700', dotColor: 'bg-red-400',
                  points: [
                    'High IT infrastructure investment and ongoing maintenance cost',
                    'System downtime risk directly impacts revenue',
                    'Technology literacy dependency among franchise operators',
                    'Single proprietary platform creates technology lock-in risk',
                  ],
                },
                {
                  label: 'Opportunities', icon: '🌱', color: 'bg-blue-50 border-blue-200',
                  headerColor: 'text-blue-700', dotColor: 'bg-blue-500',
                  points: [
                    'AI/ML integration for predictive demand forecasting',
                    'Big data analytics for deeper consumer behaviour insights',
                    'Cloud-based architecture for global scalability at lower cost',
                    'IoT for kitchen equipment monitoring and predictive maintenance',
                  ],
                },
                {
                  label: 'Threats', icon: '⚡', color: 'bg-amber-50 border-amber-200',
                  headerColor: 'text-amber-700', dotColor: 'bg-amber-500',
                  points: [
                    'Cybersecurity risks — customer data breach potential',
                    'Competitors adopting similar PoS and digital ordering systems',
                    'Regulatory compliance (India PDPB, GDPR for international ops)',
                    'Rising IT infrastructure and cloud hosting costs',
                  ],
                },
              ].map(({ label, icon, color, headerColor, dotColor, points }) => (
                <div key={label} className={`border rounded-xl p-4 ${color}`}>
                  <p className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${headerColor}`}>
                    <span>{icon}</span> {label}
                  </p>
                  <ul className="space-y-1.5">
                    {points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0 mt-1`} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 8. Recommendations */}
          <SectionCard id="recommendations" title="8. Recommendations" icon="🎯">
            <Prose>
              Based on the MIS analysis, the following strategic recommendations would strengthen Domino&apos;s
              information systems architecture:
            </Prose>
            <div className="mt-4 space-y-3">
              {[
                { icon: '🤖', title: 'AI-Powered Demand Forecasting', desc: 'Integrate machine learning models to predict demand by locality, time of day, and season. This would enable smarter inventory procurement, staffing decisions, and targeted promotional timing, reducing both waste and lost sales.' },
                { icon: '☁️', title: 'Cloud Migration', desc: 'Move from distributed backup servers to a cloud-first architecture to reduce hardware costs, improve uptime SLAs, and enable real-time cross-store data synchronisation globally at lower total cost of ownership.' },
                { icon: '🤝', title: 'CRM Enhancement with CLV Analysis', desc: 'Implement loyalty programme tiers within PULSE™ using customer lifetime value (CLV) segmentation. High-CLV customers receive personalised retention strategies; low-CLV customers receive engagement-building offers.' },
                { icon: '🔒', title: 'Cybersecurity Investment', desc: 'As digital order volumes grow, invest in end-to-end encryption for payment and personal data. Implement quarterly security audits and ensure compliance with India\'s PDPB and international GDPR requirements for cross-border data flows.' },
                { icon: '📊', title: 'Executive Intelligence Dashboard', desc: 'Develop a unified dashboard aggregating PULSE™ data with external intelligence (competitor activity, social media sentiment, market trends) to support strategic decision-making at the top management level.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 9. Discussion Questions */}
          <SectionCard id="discussion" title="9. Classroom Discussion Questions" icon="💬">
            <Prose>
              These are faculty-style discussion questions you are likely to encounter in class. Prepare structured answers for each.
            </Prose>
            <div className="mt-4 space-y-3">
              {[
                'How does the PULSE™ system align with the six strategic business objectives of information systems identified by Laudon & Laudon? Which objective does it serve most effectively, and why?',
                'Domino\'s uses colour-coded locality analysis to direct marketing resources. Is this an application of CRM, business intelligence, or a decision support system? Justify your categorisation using the IS framework.',
                'Compare Domino\'s deployment of VoIP with traditional telephony from a cost-benefit perspective. What network component of IS does VoIP primarily represent?',
                'The PULSE™ system serves all three management levels. Using specific examples from the case, explain what type of information each level receives and how it differs in form, frequency, source, and function.',
                'What are the risks of Domino\'s heavy dependence on a single proprietary IS platform? How should the organisation manage system failure scenarios to protect its service delivery commitment?',
                'If Domino\'s were to expand into a new market with limited IT infrastructure, how would you redesign the PULSE™ system to accommodate constraints while maintaining core functionality?',
              ].map((q, i) => (
                <DiscussionCard key={i} num={i + 1} question={q} />
              ))}
            </div>
          </SectionCard>

          {/* 10. Viva Preparation */}
          <SectionCard id="viva" title="10. Viva Preparation Questions" icon="🎓">
            <Prose>
              Click each question to reveal a concise answer hint. Study these before your viva or class session.
            </Prose>
            <div className="mt-4 space-y-2">
              {[
                { q: 'What is the PULSE™ system and what does it do?', a: 'PULSE™ is a graphical user-interface, touchscreen-based Point-of-Sale system that manages ordering, inventory, and reporting across Domino\'s stores. It integrates CRM, communications (VoIP, eConnect), and data analytics into one unified information system.' },
                { q: 'Which IS component does VoIP primarily represent?', a: 'VoIP is part of the Network component of information systems. It enables telecommunications by transmitting voice over internet infrastructure, and automatically routes calls to the nearest store based on caller location.' },
                { q: 'How does PULSE™ support improved decision-making at the tactical level?', a: 'Through push/pull reporting, managers receive monthly net sales, growth rates, comparative data, and exception reports. Colour-coded locality analysis enables evidence-based marketing resource allocation — classic tactical management information.' },
                { q: 'What is eConnect and what problem does it solve?', a: 'eConnect is a sub-system within PULSE™ that enables internal communication between branches and headquarters. It solves the network communication and coordination challenge in a geographically dispersed franchise organisation.' },
                { q: 'How does Domino\'s demonstrate the "Transformation" level of IT impact?', a: 'The colour-coded area classification (Yellow/Green/Red) transforms the marketing function — redefining how promotional resources are allocated based on data rather than intuition. This represents functional redefinition at the organisational level.' },
                { q: 'Name the three types of IS framework and which level each serves in Domino\'s context.', a: 'Operational Systems serve store representatives (daily order processing, refunds). Tactical Systems serve branch managers (monthly reports, exception analysis). Strategic Planning Systems serve senior leadership (consolidated network reports, expansion decisions).' },
                { q: 'What is the relationship between IS investment and operational efficiency?', a: 'IS reduces transaction costs, improves process speed, eliminates manual errors, and enables data-driven management. In Domino\'s case, automation of order entry, VoIP routing, and inventory tracking directly reduces waste and improves profit margins.' },
                { q: 'Why is PULSE™ considered a source of competitive advantage?', a: 'It enables the 30-minute delivery promise at scale, creates personalised customer relationships through CRM, enables data-driven marketing, and supports consistent quality across 10,000+ stores — capabilities difficult to replicate without the same IS infrastructure.' },
              ].map(({ q, a }) => (
                <VivaCard key={q} question={q} hint={a} />
              ))}
            </div>
          </SectionCard>

          {/* 11. Key Takeaways */}
          <SectionCard id="takeaways" title="11. Key Takeaways" icon="⚡">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Revision Before Class</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { point: 'PULSE™ is a PoS + IS platform managing ordering, CRM, inventory, reporting, and communications.' },
                { point: 'Achieves all 6 strategic IS objectives: Operational Excellence, New Models, Customer Intimacy, Decision Making, Competitive Advantage, Survival.' },
                { point: 'Serves 3 management levels: Operational (store), Tactical (branch managers), Strategic (senior leadership).' },
                { point: 'VoIP, mobile app, virtual call centres, and eConnect are the key IS sub-components.' },
                { point: 'Colour-coding (Yellow/Green/Red) = data-driven marketing resource allocation — a real-world transformation-level IT application.' },
                { point: 'Key IS concepts: CRM, PoS, Decision Support, Real-time processing, Tactical & Strategic reporting.' },
                { point: 'SWOT: Strong IT core; risks include cybersecurity exposure and franchise technology dependency.' },
                { point: 'Future: AI/ML forecasting, cloud migration, CLV-based CRM, executive dashboards.' },
              ].map(({ point }, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                  <span className="w-5 h-5 bg-cyan-600 text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-br from-slate-800 to-cyan-950 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-2">Ready to Study?</p>
            <h3 className="text-white font-bold text-lg mb-2">Download the complete case study</h3>
            <p className="text-slate-300 text-sm mb-5 max-w-md mx-auto">
              Get the formatted Word document with all sections, discussion questions, and viva preparation — ready for offline study.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                {downloading ? 'Generating…' : '⬇ Download .docx'}
              </button>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                ← Back to Case Studies
              </Link>
              <Link
                href="/subjects/information-systems"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View MIS Lectures →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
