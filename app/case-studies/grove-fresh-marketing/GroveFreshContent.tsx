'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── DOCX generation ─────────────────────────────────────────────────────────

async function downloadDocx() {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, TableCell, TableRow, Table,
    WidthType, ShadingType,
  } = await import('docx');

  const ACCENT = '7F1D1D';

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
        new Paragraph({
          children: [new TextRun({ text: 'Case Study: Grove Fresh Ltd — Marketing Organic Juices', bold: true, size: 48, color: ACCENT })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Marketing Management — MBA Programme', size: 22, color: '64748B' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'UK Organic Juice Market Strategic Analysis — STP, PLC, BCG, Ansoff, Porter\'s Generic Strategies', italics: true, size: 22, color: '94A3B8' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        heading('1. Case Overview'),
        bold('Company', 'Grove Fresh Ltd (GFL)'),
        bold('Industry', 'Organic Beverages — Chilled Juice'),
        bold('Geography', 'United Kingdom and Continental Europe'),
        bold('Analysis Period', '1994–2006, with focal year 2006'),
        bold('Level', 'Intermediate'),
        bold('Frameworks', 'STP, PLC, BCG Matrix, Ansoff Grid, Buyer Decision Process, Porter\'s Generic Strategies'),
        body(''),
        body('Grove Fresh Ltd pioneered the UK chilled organic juice market in 1996, building a dominant position before the category existed as a mainstream consumer choice. By 2006, GFL held over 60% of the UK organic juice market. Yet the same year marked a structural inflection point: category growth had decelerated sharply, competing supply chains were failing, and supermarket private-label organics were compressing the price premium that sustained GFL\'s business model.'),

        heading('2. Company Background'),
        body('GFL\'s origin traces to an entrepreneur who, after a successful exit from the UK food industry, observed an untapped opportunity: bringing certified pure organic fruit juice to British consumers at a time when the category did not exist. He spent two years developing organic supply relationships with Florida growers before establishing a distribution pipeline to the UK. In 1996, GFL became the first mover in UK organic juice — not entering an existing market, but creating one.'),
        body('Growth through acquisition followed: a German juice operation in 1998 and a Dutch company in 2000 broadened GFL into European non-organic markets. The parent holding group recorded 185% sales growth by 2001, reaching £18M in total revenues. GFL\'s UK organic juice operation surpassed £5M in sales by 2004–05.'),
        body('Core product philosophy: every product is not-from-concentrate (NFC), containing only juice pressed from fruits or vegetables — no added water, sugars, preservatives, colourings, or additives. Soil Association certification — the UK\'s most rigorous organic standard — anchors the brand\'s credibility claim.'),

        heading('3. Core Marketing Challenge'),
        body('GFL\'s challenge is not primarily a brand problem — the brand is strong. It is a structural market transition: the UK organic juice category has moved from the Growth phase to the Maturity phase of the Product Life Cycle in under a decade. Volume growth fell from 224% in 1999 to just 5% by 2003–04. A strategy built for a growth market is now misaligned with a maturity market.'),
        subheading('Three Compounding Pressures'),
        bullet('Demand compression — the population of convertible consumers has largely been captured. Remaining non-adopters are structurally resistant or price-sensitive, not simply uninformed.'),
        bullet('Supply vulnerability — organic citrus, approximately 40% of GFL revenues, faces chronic global undersupply. The core product is partially hostage to agricultural cycles outside management\'s control.'),
        bullet('Competitive commoditisation — supermarket private-label organic lines at 98–99p per litre are systematically compressing the 2.5× price premium.'),

        heading('4. Marketing Concepts Applied'),
        subheading('Product Life Cycle'),
        body('Market volume growth collapsed from 224% (1999) to 5% (2003–04), confirming transition from Growth to Maturity. The strategic response must shift from category expansion and trial conversion — the right priorities in growth — to retention, loyalty deepening, and differentiation reinforcement — the right priorities in maturity.'),
        subheading('Marketing Orientation vs. Production Orientation'),
        body('GFL\'s founding logic was genuinely market-oriented: it identified an unmet consumer need before designing the supply chain around it. By 2006, the risk is that non-organic European acquisitions and competitive pressure push the organisation toward a production-first mindset that loses contact with evolving customer needs — the hallmark of orientation drift in maturing businesses.'),
        subheading('Customer Value and Price Tolerance'),
        body('Premium pricing is sustainable only when perceived value clearly and consistently exceeds price in the buyer\'s judgment. GFL\'s value equation — purity, health identity, taste superiority, pioneer credibility — is strong but not immovable. Every gain in own-label organic credibility incrementally erodes GFL\'s perceived value advantage.'),

        heading('5. STP Analysis'),
        subheading('Segmentation'),
        body('GFL\'s most commercially relevant segmentation combines psychographic and life-stage variables, rather than relying on demographics alone:'),
        bullet('Psychographic: health-consciousness, food safety concern, environmental values, and organic purchasing as a signal of personal identity and conscious living'),
        bullet('Life-stage: adults 35+ whose children have left home, with recovering disposable income and renewed attention to personal wellbeing'),
        bullet('Behavioural: purchase frequency (regular committed buyers vs. occasional experimenters), channel loyalty, and depth of organic category involvement'),
        bullet('Critical gap: no visible distinction between trial users and loyal repeat buyers — a significant strategic error in a maturing market'),
        subheading('Targeting'),
        body('GFL deploys a concentrated targeting strategy, focusing on the committed premium organic buyer and deliberately declining to compete for the price-sensitive occasional organic consumer — correctly recognising that chasing the 99p segment would destroy brand equity faster than it would generate volume.'),
        subheading('Positioning'),
        body('Constructed positioning statement: "For health-conscious adults who will not compromise on what they consume, Grove Fresh is the UK\'s definitive organic juice — because we are defined by what we leave out, not what we add."'),
        body('Three structural pillars: (1) Product purity — NFC, certified, zero-additive; (2) Expertise signalling — unusual, technically demanding ingredient combinations; (3) Pioneer authority — the original UK organic juice brand.'),

        heading('6. Consumer Behavior Insights'),
        subheading('Loss Aversion Applied'),
        body('GFL\'s poster campaign correctly identified a fundamental asymmetry in human judgment: people respond more strongly to the prospect of losing something than to the equivalent prospect of gaining it. The poster\'s pesticide message activated this psychological mechanism — framing conventional juice as a loss rather than organic juice as a gain. The behavioral insight was accurate; the execution exceeded regulatory tolerance.'),
        subheading('Identity-Driven Purchasing'),
        body('For GFL\'s core segment, organic juice is not a rational health-optimisation decision — it is a statement about who they are. This positions the purchase at the self-esteem and self-actualisation level of Maslow\'s needs hierarchy — making price sensitivity structurally low among committed buyers.'),
        subheading('Trial-to-Loyalty Conversion'),
        body('Consumers who experience the flavour difference of NFC organic juice rarely revert to conventional alternatives. This structural lock-in reframes the free-sampling programme as a customer acquisition investment with long-term compounding returns, not an awareness spend.'),

        heading('7. SWOT Analysis'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                swotCell('STRENGTHS', [
                  '60%+ UK market share — entrenched first-mover position',
                  'Soil Association certification — highest credibility standard',
                  'Pure NFC product — genuine, legally defensible differentiation',
                  'Multi-channel reach: supermarket + specialist e-retail',
                  'V Juice sub-brand: 65% growth at specialist health stores',
                  'Pioneer brand narrative — impossible to replicate',
                ], '16A34A'),
                swotCell('WEAKNESSES', [
                  '~40% revenue in organic citrus — structural supply dependency',
                  'Non-organic European acquisitions dilute core brand identity',
                  'No direct-to-consumer digital channel',
                  '2.5× price gap vs. own-label — vulnerable in economic downturns',
                  'Investment model optimised for acquisition, not loyalty',
                ], 'DC2626'),
              ],
            }),
            new TableRow({
              children: [
                swotCell('OPPORTUNITIES', [
                  'Food service channel entirely untapped (cafes, health clubs, corporate)',
                  'V Juice scale-up: new SKUs, expanded channels',
                  'Supply security via orchard partnerships or long-term contracts',
                  'DTC subscription model for loyal regular buyers',
                  'Premium organic segments in high-income international markets',
                ], '2563EB'),
                swotCell('THREATS', [
                  'Category growth at 5% p.a. — maturity economics tightening',
                  'Own-label organic at 98–99p compressing the price premium',
                  'Organic citrus supply shortage deepening',
                  'Organic certification credibility under media scrutiny',
                  'Large beverage brands may enter premium organic segment',
                ], 'D97706'),
              ],
            }),
          ],
        }),

        heading('8. Competitive Analysis'),
        subheading('Three-Tier Landscape'),
        body('Craft Premium (Luscombe Devon, Duchy Originals, £2.60–3.80): GFL\'s advantage is distribution breadth and variety depth. Risk: being perceived as "almost premium" rather than genuinely artisan.'),
        body('GFL\'s Position (£2.29–2.59): market leader with widest product range and strongest certification credentials, but structurally squeezed from both directions.'),
        body('Own-Label Organic (98–99p): the primary growth-stage threat. GFL\'s countermeasure is brand authenticity and product purity that private-label cannot structurally replicate.'),
        subheading('The Non-Obvious Threat'),
        body('The most dangerous competitive force is the gradual erosion of organic certification credibility itself. If media narratives undermine the premium meaning of "organic" in consumer minds, the 2.5× price premium becomes indefensible regardless of marketing investment.'),

        heading('9. Branding & Positioning Analysis'),
        subheading('Brand Architecture'),
        bullet('Master brand: Grove Fresh — heritage, purity, the pioneer trust mark that anchors all credibility claims'),
        bullet('Product trademark: The Organic Juice Co. — on-pack categorical identifier that signals expert knowledge'),
        bullet('Sub-brand: V Juice — vegetable juice, specialist health store channel, correctly separated from the master brand'),
        subheading('Brand Equity Management Gap'),
        body('GFL monitors sales and market share but shows no evidence of tracking brand preference scores, brand association strength, or customer lifetime value. Managing a premium brand without equity measurement is viable in stable conditions — and dangerous when competitive dynamics shift.'),

        heading('10. Strategic Recommendations'),
        bullet('1. Shift from Trial Acquisition to Loyalty Economics (Immediate): Ansoff: Market Penetration. Redirect a portion of the £1M consumer show budget to retention mechanisms — subscription models, loyalty rewards, CRM-driven content, and health community engagement.'),
        bullet('2. Open the Food Service Channel (Near-Term): Ansoff: Market Development. Premium cafés, yoga studios, corporate wellness programmes represent brand-consistent, untapped channels.'),
        bullet('3. Accelerate V Juice as a Strategic Growth Engine (Near-Term): Ansoff: Product Development. V Juice growing at 65% year-on-year at health stores — increase SKU count, dedicated marketing investment, and expand channels before competitors enter.'),
        bullet('4. Secure Supply Through Backward Integration (Strategic): Pursue long-term supply agreements or equity co-investments with organic orchards to structurally de-risk the 40% citrus revenue dependency.'),
        bullet('5. Reframe Communication Around Positive Purity Identity (Strategic): Replace fear-based comparative messaging with positive purity storytelling: "We are defined by what we leave out" or "The only thing we add is time." Same psychology, legally defensible.'),

        heading('11. Classroom Discussion Questions'),
        bullet('GFL holds 60%+ market share and is growing faster than the market. So what exactly is the problem — is this even a company in difficulty?'),
        bullet('How would you segment the UK organic juice market beyond GFL\'s current approach? What segmentation bases are being underutilised?'),
        bullet('GFL\'s posters were ordered withdrawn by the advertising regulator. Was that poor marketing strategy, or bold marketing that got unlucky? Would you have approved the campaign?'),
        bullet('GFL prices at £2.29–2.59 while supermarket organic lines sell for 99p. How long is that gap sustainable — and what would you change in the marketing mix to defend it?'),
        bullet('Should GFL launch a direct-to-consumer e-commerce channel? What would happen to its supermarket relationships?'),
        bullet('V Juice is growing at 65% at specialist health stores. Should GFL redirect its entire marketing budget behind V Juice?'),
        bullet('If a major beverage brand launched an organic juice range tomorrow, what happens to GFL\'s competitive position over the following 12 months?'),
        bullet('GFL\'s supply problem is structural. Is this a marketing challenge, a supply chain challenge, or both — and does the distinction change how you respond?'),

        heading('12. Viva Preparation Questions'),
        bullet('Q: At what PLC stage is the UK organic juice market in 2006? A: Maturity. Evidence: volume growth collapsed from 224% (1999) to 5% (2003–04). Strategic shift required from acquisition to retention and differentiation.'),
        bullet('Q: Which management orientation describes GFL? A: Marketing orientation at founding. Risk of drift toward production orientation by 2006 due to non-organic acquisitions and competitive pressure.'),
        bullet('Q: Apply Porter\'s Generic Strategies to GFL. A: Differentiation Focus — premium product, certified, targeted at committed organic buyers. Risk: "stuck in the middle" if own-label erodes the perceived differentiation.'),
        bullet('Q: Classify GFL\'s business units using the BCG Matrix. A: UK organic juice = Cash Cow (60% share, 5% growth). V Juice = Star/Question Mark (65% growth, small share). European non-organic Frische = Question Mark.'),
        bullet('Q: At which stage of the buyer decision process does free sampling intervene? A: Evaluation of Alternatives — sampling collapses the decision to trial, leveraging the taste superiority that converts triers to loyal buyers.'),
        bullet('Q: What is loss aversion and how did GFL apply it? A: Loss aversion is the psychological tendency to weigh potential losses more heavily than equivalent gains. GFL\'s poster framed conventional juice consumption as a loss (health risk from pesticides) rather than organic as a gain.'),
        bullet('Q: Apply the Ansoff Matrix to GFL\'s 2006 strategic options. A: Market Penetration (retain existing customers), Market Development (food service channel), Product Development (V Juice expansion), Diversification (international premium markets — highest risk).'),
        bullet('Q: Why does GFL\'s advertising controversy signal positioning stress? A: When communication investment works to widen the gap between a category and its alternatives rather than deepen the brand\'s own unique value, it signals internal differentiation has weakened.'),

        heading('13. Key Takeaways'),
        bullet('First-mover advantage is a temporary asset, not a permanent one. In maturity, sustaining dominance requires active differentiation investment — not momentum from the original launch.'),
        bullet('Price is a positioning signal, not merely a margin decision. GFL\'s £2.29–2.59 price point communicates premium, purity, and exclusivity. Any discount would be brand-destroying, not market-expanding.'),
        bullet('In authenticity-based brands, supply integrity is a marketing responsibility. When the brand promise is "pure organic", a supply shortage is simultaneously a brand promise crisis.'),
        bullet('Sub-brand architecture enables growth without diluting core brand equity. V Juice is the structurally correct decision — it preserves the master brand\'s associations while opening a new consumer segment.'),
        bullet('In maturing markets, retention economics dominate acquisition economics. GFL\'s investment model is calibrated for a growth market that no longer exists — a strategic misalignment that compounds over time.'),
        bullet('Behavioural insights require regulatory stress-testing before deployment. The principle of loss aversion in consumer communication is sound. The failure was applying it without testing legal and regulatory boundaries first.'),

        new Paragraph({
          children: [new TextRun({ text: 'MBA Learning Hub • Academic Case Study Notes', size: 18, color: '94A3B8' })],
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
  link.download = 'Grove_Fresh_Marketing_Case_Study_MBA.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Sidebar sections ─────────────────────────────────────────────────────────

const sections = [
  { id: 'overview',        label: 'Case Overview' },
  { id: 'background',      label: 'Company Background' },
  { id: 'challenge',       label: 'Core Marketing Challenge' },
  { id: 'concepts',        label: 'Marketing Concepts' },
  { id: 'stp',             label: 'STP Analysis' },
  { id: 'consumer',        label: 'Consumer Behavior' },
  { id: 'swot',            label: 'SWOT Analysis' },
  { id: 'competitive',     label: 'Competitive Analysis' },
  { id: 'branding',        label: 'Branding & Positioning' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'discussion',      label: 'Discussion Questions' },
  { id: 'viva',            label: 'Viva Preparation' },
  { id: 'takeaways',       label: 'Key Takeaways' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <h3 className="text-sm font-bold text-rose-700 mb-2 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-rose-500 inline-block" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items, color = 'bg-rose-400' }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
          <span className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0 mt-1.5`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DiscussionCard({ num, question }: { num: number; question: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
      <span className="w-7 h-7 bg-rose-600 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{num}</span>
      <p className="text-sm text-rose-900 leading-relaxed">{question}</p>
    </div>
  );
}

function VivaCard({ question, hint, category }: { question: string; hint: string; category?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 hover:bg-rose-50 transition-colors text-left"
      >
        <div className="flex-1 pr-4">
          {category && (
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-0.5">{category}</span>
          )}
          <span className="text-sm font-medium text-slate-800">{question}</span>
        </div>
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

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      {items.map(({ label, value }) => (
        <div key={label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-slate-800">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GroveFreshCaseStudy() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadDocx(); } finally { setDownloading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-rose-400">Grove Fresh Ltd</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  🎯 Marketing Management
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  📖 Case Study
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  Intermediate Level
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                Grove Fresh Ltd
              </h1>
              <p className="text-rose-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                How a UK organic juice pioneer navigated a market maturity crisis — applying STP, PLC, BCG Matrix, Ansoff, and Porter&apos;s frameworks to a real premium brand at an inflection point.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 disabled:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              {downloading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : '⬇'}
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

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Industry',    value: 'Organic Beverages — UK' },
              { label: 'Subject',     value: 'Marketing Management' },
              { label: 'Frameworks', value: 'STP, PLC, BCG, Ansoff, Porter' },
              { label: 'Sections',   value: '13 Study Sections' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-10 flex gap-8">

        {/* ── Sticky TOC ─────────────────────────────────────────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-5 border-t border-slate-200">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-xs"
              >
                {downloading ? '…' : '⬇'} Download
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* 1. Case Overview */}
          <SectionCard id="overview" title="1. Case Overview" icon="📋">
            <InfoGrid items={[
              { label: 'Company',         value: 'Grove Fresh Ltd (GFL)' },
              { label: 'Industry',        value: 'Organic Beverages — Chilled Juice' },
              { label: 'Geography',       value: 'UK & Continental Europe' },
              { label: 'Analysis Period', value: '1994–2006 (focal year 2006)' },
              { label: 'Level',           value: 'Intermediate' },
              { label: 'UK Market Share', value: '60%+ organic juice market' },
            ]} />
            <div className="mt-5 space-y-3">
              <Prose>
                Grove Fresh Ltd pioneered the UK chilled organic juice market in 1996, building a dominant position
                before the category existed as a mainstream consumer choice. By 2006 it held over{' '}
                <strong className="text-slate-800">60% of the UK organic juice market</strong>.
                Yet the same year marked a structural inflection point: category growth had decelerated sharply,
                competing supply chains were failing, and supermarket private-label organics were compressing
                the price premium that sustained GFL&apos;s business model.
              </Prose>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { icon: '🌱', title: 'First Mover', desc: 'Created the UK organic juice category in 1996 — no market existed before GFL' },
                  { icon: '⚠️', title: 'Maturity Trap', desc: 'Category growth collapsed from 224% (1999) to just 5% (2003–04)' },
                  { icon: '🏷️', title: 'Price Squeeze', desc: 'Own-label organics at 98–99p vs GFL\'s 2.5× premium at £2.29–2.59' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                    <div className="text-xl mb-2">{icon}</div>
                    <p className="text-xs font-bold text-rose-800 mb-1">{title}</p>
                    <p className="text-xs text-rose-700 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 2. Company Background */}
          <SectionCard id="background" title="2. Company Background" icon="🏢">
            <div className="space-y-3">
              <Prose>
                GFL&apos;s origin traces to an entrepreneur who, after a successful exit from the UK food
                industry, observed an untapped opportunity: bringing certified pure organic fruit juice
                to British consumers at a time when the category did not exist. He spent two years
                developing organic supply relationships with Florida growers before establishing
                a distribution pipeline to the UK. In 1996, GFL became the{' '}
                <strong className="text-slate-800">first mover in UK organic juice</strong> — not
                entering an existing market, but creating one.
              </Prose>
              <Prose>
                Growth through acquisition followed: a German juice operation in 1998 and a Dutch company
                in 2000 broadened GFL into European non-organic markets. The parent holding group recorded
                185% sales growth by 2001, reaching £18M in total revenues. GFL&apos;s UK organic juice
                operation surpassed £5M in sales by 2004–05.
              </Prose>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-bold text-amber-800 mb-2">Core Product Philosophy</p>
                <Prose>
                  Every product is not-from-concentrate (NFC) — only juice pressed from fruits or vegetables,
                  with no added water, sugars, preservatives, colourings, or additives.{' '}
                  <strong className="text-slate-800">Soil Association certification</strong> — the UK&apos;s most
                  rigorous organic standard — anchors the brand&apos;s credibility claim. Unusual ingredient
                  combinations (carrot–red pepper, beetroot–onion) signal craft mastery beyond basic compliance.
                </Prose>
              </div>
            </div>
          </SectionCard>

          {/* 3. Core Marketing Challenge */}
          <SectionCard id="challenge" title="3. Core Marketing Challenge" icon="⚠️">
            <Prose>
              GFL&apos;s challenge is not primarily a brand problem — the brand is strong. It is a{' '}
              <strong className="text-slate-800">structural market transition</strong>: the UK organic juice
              category has moved from the Growth phase to the Maturity phase of the Product Life Cycle
              in under a decade. A strategy built for a growth market is now misaligned with a maturity market.
            </Prose>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Demand Compression',
                  desc: 'The population of convertible consumers has largely been captured. Remaining non-adopters are structurally resistant or price-sensitive, not simply uninformed — they will not respond to awareness campaigns.',
                },
                {
                  title: 'Supply Vulnerability',
                  desc: 'Organic citrus, approximately 40% of GFL revenues, faces chronic global undersupply. The core product is partially hostage to agricultural cycles outside management\'s control — a marketing risk disguised as an operations problem.',
                },
                {
                  title: 'Competitive Commoditisation',
                  desc: 'Supermarket private-label organic lines at 98–99p per litre are systematically compressing the 2.5× price premium, re-educating a segment of consumers to anchor organic juice pricing at commodity levels.',
                },
                {
                  title: 'Positioning Stress Signal',
                  desc: 'GFL\'s advertising controversy — posters attacking conventional farming rather than deepening Grove Fresh\'s own distinctiveness — is a symptom of positioning stress. When brand communication widens the category gap rather than deepening the brand\'s unique value, internal differentiation has weakened.',
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

          {/* 4. Marketing Concepts Applied */}
          <SectionCard id="concepts" title="4. Marketing Concepts Applied" icon="💡">
            <SubSection title="Product Life Cycle (PLC)">
              <Prose>
                Market volume growth collapsed from 224% (1999) to 5% (2003–04), confirming transition
                from Growth to Maturity. In a growth market, the priority is trial conversion and
                category expansion. In a maturity market, the priority shifts to{' '}
                <strong className="text-slate-800">retention, loyalty deepening, and differentiation reinforcement</strong>.
                GFL&apos;s marketing investment model has not made this shift.
              </Prose>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Growth Phase Strategy (Past)</p>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    {['Category expansion', 'Trial conversion', 'Awareness campaigns', 'Distribution growth'].map(i => (
                      <li key={i} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-xs font-bold text-rose-700 mb-1">Maturity Phase Strategy (Needed)</p>
                  <ul className="text-xs text-rose-700 space-y-1">
                    {['Customer retention', 'Loyalty programmes', 'Differentiation reinforcement', 'New channel development'].map(i => (
                      <li key={i} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SubSection>

            <SubSection title="Marketing Orientation vs. Production Orientation">
              <Prose>
                GFL&apos;s founding logic was genuinely market-oriented: it identified an unmet consumer
                need before designing the supply chain around it. By 2006, the risk is that non-organic
                European acquisitions and competitive pressure push the organisation toward a
                production-first mindset — the hallmark of orientation drift in maturing businesses
                that lose contact with evolving customer needs.
              </Prose>
            </SubSection>

            <SubSection title="The Myopia Risk in Mature Categories">
              <Prose>
                Brands that define themselves too narrowly by their physical product — &quot;we make
                organic juice&quot; — underinvest in the broader value they provide. GFL&apos;s launch of a
                vegetable juice sub-brand is an early signal of a broader frame emerging:
                <strong className="text-slate-800"> premium health-conscious beverage experience</strong>.
                That frame needs to be made explicit and invested in more aggressively.
              </Prose>
            </SubSection>

            <SubSection title="Customer Value and Price Tolerance">
              <Prose>
                Premium pricing is sustainable only when perceived value clearly and consistently exceeds
                price in the buyer&apos;s judgment. GFL&apos;s value equation — purity, health identity,
                taste superiority, pioneer credibility — is strong but not immovable. Every gain
                in own-label organic credibility incrementally erodes GFL&apos;s perceived value advantage.
              </Prose>
            </SubSection>
          </SectionCard>

          {/* 5. STP Analysis */}
          <SectionCard id="stp" title="5. STP Analysis" icon="🎯">
            <SubSection title="Segmentation">
              <Prose>
                GFL&apos;s most commercially relevant segmentation combines psychographic and life-stage
                variables, rather than relying on demographics alone:
              </Prose>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Psychographic', detail: 'Health-consciousness, food safety concern, environmental values, and organic purchasing as a signal of personal identity and conscious living' },
                  { label: 'Life-Stage', detail: 'Adults 35+ whose children have left home (\'empty nesters\'), with recovering disposable income and renewed attention to personal wellbeing' },
                  { label: 'Behavioural', detail: 'Purchase frequency (regular committed buyers vs. occasional experimenters), channel loyalty, and depth of organic category involvement' },
                  { label: '⚠ Critical Gap', detail: 'No visible distinction between trial users and loyal repeat buyers — a significant strategic error in a maturing market where retention economics consistently outperform acquisition economics' },
                ].map(({ label, detail }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${label.startsWith('⚠') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{label}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Targeting">
              <Prose>
                GFL deploys a <strong className="text-slate-800">concentrated targeting strategy</strong>: it focuses on the committed
                premium organic buyer and deliberately declines to compete for the price-sensitive
                occasional organic consumer — correctly recognising that chasing the 99p segment
                would destroy brand equity faster than it would generate volume.
              </Prose>
            </SubSection>

            <SubSection title="Positioning">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mt-2">
                <p className="text-xs font-bold text-rose-700 mb-2">Constructed Positioning Statement</p>
                <p className="text-sm text-rose-900 italic leading-relaxed">
                  &quot;For health-conscious adults who will not compromise on what they consume, Grove Fresh is
                  the UK&apos;s definitive organic juice — because we are defined by what we leave out, not what we add.&quot;
                </p>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { pillar: 'Product Purity', detail: 'NFC, certified, zero-additive — the product specification IS the positioning claim' },
                  { pillar: 'Expertise Signalling', detail: 'Unusual ingredient combinations demonstrate mastery beyond compliance (carrot–red pepper, beetroot–onion)' },
                  { pillar: 'Pioneer Authority', detail: 'The original UK organic juice brand — first-mover credibility that cannot be acquired by later entrants' },
                ].map(({ pillar, detail }) => (
                  <div key={pillar} className="p-3 bg-white border border-rose-200 rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-rose-700 mb-1">{pillar}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </SectionCard>

          {/* 6. Consumer Behavior */}
          <SectionCard id="consumer" title="6. Consumer Behavior Insights" icon="🧠">
            <SubSection title="Stimulus → Buyer Black Box → Response">
              <Prose>
                Marketing stimuli (premium packaging, purity claims, certification mark, free-sampling)
                combine with environmental factors (the broader UK organic food movement,
                post-food-safety-crisis consumer awareness) to enter the buyer&apos;s internal processing.
                The output is a regular, premium, brand-loyal purchase pattern — driven by values
                and identity, not rational calculation.
              </Prose>
            </SubSection>

            <SubSection title="Loss Aversion Applied">
              <Prose>
                GFL&apos;s poster campaign correctly identified a fundamental asymmetry in human judgment:
                people respond more strongly to the prospect of <em>losing something</em> than to the
                equivalent prospect of <em>gaining something</em>. The pesticide message activated this
                mechanism — framing conventional juice as a loss rather than organic juice as a gain.
                <strong className="text-slate-800"> The behavioral insight was accurate; the execution exceeded regulatory tolerance.</strong>
                The lesson: separate the principle from the implementation.
              </Prose>
            </SubSection>

            <SubSection title="Trial-to-Loyalty Conversion Mechanics">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mt-2">
                <p className="text-xs font-bold text-emerald-700 mb-1.5">Key Strategic Insight</p>
                <Prose>
                  Consumers who experience the flavour difference of NFC organic juice rarely revert to
                  conventional alternatives. This structural lock-in reframes the £1M free-sampling
                  programme as a <strong className="text-slate-800">customer acquisition investment with long-term
                  compounding returns</strong>, not an awareness spend with a short measurement window.
                </Prose>
              </div>
            </SubSection>

            <SubSection title="Identity-Driven Purchasing & Maslow">
              <Prose>
                For GFL&apos;s core segment, organic juice is not a rational health-optimisation decision —
                it is a statement about who they are. &quot;I make conscious, quality choices&quot; is the internal
                framing. This positions the purchase at the{' '}
                <strong className="text-slate-800">self-esteem and self-actualisation</strong> level of Maslow&apos;s
                hierarchy — making price sensitivity structurally low among committed buyers, even as the economy fluctuates.
              </Prose>
            </SubSection>

            <SubSection title="The Certification Paradox">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mt-2">
                <p className="text-xs font-bold text-amber-700 mb-1.5">Strategic Vulnerability</p>
                <Prose>
                  Soil Association certification is simultaneously the most powerful element of GFL&apos;s
                  credibility architecture and its most fragile dependency. If &quot;organic&quot; loses its
                  premium meaning in consumer minds — through media scrutiny of supply chain integrity —
                  the 2.5× price gap collapses regardless of any brand investment.
                </Prose>
              </div>
            </SubSection>
          </SectionCard>

          {/* 7. SWOT */}
          <SectionCard id="swot" title="7. SWOT Analysis" icon="🔲">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: 'Strengths', icon: '💪',
                  color: 'bg-emerald-50 border-emerald-200', headerColor: 'text-emerald-700', dotColor: 'bg-emerald-500',
                  points: [
                    '60%+ UK market share — entrenched first-mover position',
                    'Soil Association certification — highest credibility standard',
                    'Pure NFC product — genuine, legally defensible differentiation',
                    'Multi-channel reach: supermarket + specialist e-retail',
                    'V Juice sub-brand: 65% growth at specialist health stores',
                    'Pioneer brand narrative — impossible to replicate',
                  ],
                },
                {
                  label: 'Weaknesses', icon: '⚠️',
                  color: 'bg-red-50 border-red-200', headerColor: 'text-red-700', dotColor: 'bg-red-400',
                  points: [
                    '~40% revenue in organic citrus — structural supply dependency',
                    'Non-organic European acquisitions dilute core brand identity',
                    'No direct-to-consumer digital channel',
                    '2.5× price gap vs. own-label — vulnerable in economic downturns',
                    'Investment model optimised for acquisition, not loyalty',
                    'No formal brand equity measurement visible',
                  ],
                },
                {
                  label: 'Opportunities', icon: '🌱',
                  color: 'bg-blue-50 border-blue-200', headerColor: 'text-blue-700', dotColor: 'bg-blue-500',
                  points: [
                    'Food service channel entirely untapped (cafes, health clubs, corporate)',
                    'V Juice scale-up: new SKUs, expanded specialist channels',
                    'Supply security via orchard partnerships or long-term contracts',
                    'DTC subscription model for loyal regular buyers',
                    'Societal marketing: sustainability and environmental narrative',
                    'Premium organic segments in high-income international markets',
                  ],
                },
                {
                  label: 'Threats', icon: '⚡',
                  color: 'bg-amber-50 border-amber-200', headerColor: 'text-amber-700', dotColor: 'bg-amber-500',
                  points: [
                    'Category growth at 5% p.a. — maturity economics tightening',
                    'Own-label organic at 98–99p compressing the price premium',
                    'Organic citrus supply shortage deepening',
                    'Organic certification credibility under media scrutiny',
                    'Large beverage brands may enter premium organic segment',
                    'Regulatory constraints on comparative advertising',
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

          {/* 8. Competitive Analysis */}
          <SectionCard id="competitive" title="8. Competitive Analysis" icon="⚔️">
            <SubSection title="Three-Tier Competitive Landscape">
              <div className="mt-2 space-y-2">
                {[
                  {
                    tier: 'Craft Premium', price: '£2.60–3.80', players: 'Luscombe Devon, Duchy Originals',
                    color: 'bg-violet-50 border-violet-200 text-violet-800',
                    insight: 'GFL\'s advantage is distribution breadth and variety depth. The risk: being perceived as "almost premium" rather than genuinely artisan — squeezed from above by heritage craft brands.',
                  },
                  {
                    tier: 'GFL\'s Position', price: '£2.29–2.59', players: 'Grove Fresh Ltd',
                    color: 'bg-rose-50 border-rose-200 text-rose-800',
                    insight: 'Market leader with widest product range and strongest certification credentials, but structurally squeezed from both directions — from craft premium above and own-label below.',
                  },
                  {
                    tier: 'Own-Label Organic', price: '98–99p', players: 'Supermarket private labels',
                    color: 'bg-amber-50 border-amber-200 text-amber-800',
                    insight: 'Primary growth-stage threat. GFL\'s countermeasure is brand authenticity and product purity that private-label cannot structurally replicate — but this advantage erodes as consumer education weakens.',
                  },
                ].map(({ tier, price, players, color, insight }) => (
                  <div key={tier} className={`p-4 rounded-xl border ${color}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs font-bold">{tier}</p>
                        <p className="text-[10px] opacity-70">{players}</p>
                      </div>
                      <span className="text-xs font-bold bg-white/60 px-2 py-1 rounded-lg flex-shrink-0">{price}</span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="The Non-Obvious Threat">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl mt-2">
                <p className="text-xs font-bold text-red-700 mb-1.5">Strategic Warning</p>
                <Prose>
                  The most dangerous competitive force is not a named brand — it is the{' '}
                  <strong className="text-slate-800">gradual erosion of organic certification credibility itself</strong>.
                  If media narratives and analyst commentary successfully undermine the premium meaning
                  of &quot;organic&quot; in consumer minds, the 2.5× price premium that sustains GFL&apos;s entire
                  business model becomes indefensible, regardless of any individual marketing investment.
                </Prose>
              </div>
            </SubSection>
          </SectionCard>

          {/* 9. Branding & Positioning */}
          <SectionCard id="branding" title="9. Branding & Positioning Analysis" icon="🏷️">
            <SubSection title="Brand Architecture">
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { level: 'Master Brand', name: 'Grove Fresh', role: 'Heritage, purity, the pioneer trust mark that anchors all credibility claims', color: 'bg-rose-50 border-rose-200' },
                  { level: 'Product Trademark', name: 'The Organic Juice Co.', role: 'On-pack categorical identifier that signals expert knowledge to the shelf buyer', color: 'bg-slate-50 border-slate-200' },
                  { level: 'Sub-Brand', name: 'V Juice', role: 'Vegetable juice, specialist health store channel — correctly separated from the master brand', color: 'bg-emerald-50 border-emerald-200' },
                ].map(({ level, name, role, color }) => (
                  <div key={level} className={`p-3 rounded-xl border ${color}`}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{level}</p>
                    <p className="text-sm font-bold text-slate-800 mb-1">{name}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{role}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-700 leading-relaxed">
                  <strong>Why V Juice is strategically correct:</strong> It preserves the fruit-juice associations
                  that make Grove Fresh valuable, while allowing the sub-brand to establish independent positioning
                  in a new channel and category — without diluting the parent brand&apos;s equity.
                </p>
              </div>
            </SubSection>

            <SubSection title="Brand Equity Management Gap">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mt-2">
                <p className="text-xs font-bold text-amber-700 mb-1.5">Critical Strategic Gap</p>
                <Prose>
                  GFL monitors sales and market share but shows no evidence of tracking{' '}
                  <strong className="text-slate-800">brand preference scores, brand association strength,
                  or customer lifetime value</strong>. Managing a premium brand without equity measurement
                  is viable in stable conditions — and dangerous when competitive dynamics shift.
                  Brand equity can deteriorate significantly before it shows up in sales figures.
                </Prose>
              </div>
            </SubSection>

            <SubSection title="Perception as Value Creation">
              <Prose>
                Context and presentation create perceived value independently of physical product quality.
                GFL&apos;s premium retail placement, distinctive packaging architecture, and visible
                certification mark collectively signal premium worth — making the product feel worth
                2.5× more than a private-label alternative.{' '}
                <strong className="text-slate-800">This is precisely what brand equity is designed to accomplish.
                It must be actively maintained, not assumed.</strong>
              </Prose>
            </SubSection>
          </SectionCard>

          {/* 10. Strategic Recommendations */}
          <SectionCard id="recommendations" title="10. Strategic Recommendations" icon="🎯">
            <div className="space-y-3">
              {[
                {
                  num: '1', icon: '🔄', framework: 'Ansoff: Market Penetration',
                  title: 'Shift from Trial Acquisition to Loyalty Economics',
                  timing: 'Immediate',
                  desc: 'In a 5% growth category, the financial return on retaining an existing customer radically outperforms the return on acquiring a new one. Redirect a portion of the £1M consumer show budget to retention mechanisms: subscription models, loyalty rewards, CRM-driven content, and health community engagement for regular buyers.',
                },
                {
                  num: '2', icon: '🍽️', framework: 'Ansoff: Market Development',
                  title: 'Open the Food Service Channel',
                  timing: 'Near-Term',
                  desc: 'Premium cafés, yoga studios, corporate wellness programmes, and health club refreshment points represent brand-consistent, high-volume channels where GFL currently has zero visible presence. This channel also generates trial that converts to retail purchase — a force-multiplier on both acquisition and retention.',
                },
                {
                  num: '3', icon: '🥤', framework: 'Ansoff: Product Development',
                  title: 'Accelerate V Juice as a Strategic Growth Engine',
                  timing: 'Near-Term',
                  desc: 'V Juice is growing at 65% year-on-year at health stores — the clearest signal in the portfolio of where consumer demand and competitive whitespace align. Significantly increase SKU count, dedicated marketing investment, and expand into additional specialist channels before larger competitors enter.',
                },
                {
                  num: '4', icon: '🌾', framework: 'Vertical Integration',
                  title: 'Secure Supply Through Backward Integration',
                  timing: 'Strategic',
                  desc: 'When the core value proposition is "pure organic", supply integrity is the marketing function, not merely an operations concern. Pursue long-term supply agreements or equity co-investments with organic orchards to structurally de-risk the 40% citrus revenue dependency. Supply failure is simultaneously a brand promise failure.',
                },
                {
                  num: '5', icon: '📢', framework: 'Positive Identity Framing',
                  title: 'Reframe Communication Around Positive Purity Identity',
                  timing: 'Strategic',
                  desc: 'Following regulatory challenge, fear-based comparative messaging carries increasing legal and reputational risk. The more defensible and equally powerful alternative is positive purity storytelling: "We are defined by what we leave out" or "The only thing we add is time." Same underlying consumer psychology, legally defensible frame.',
                },
              ].map(({ num, icon, framework, title, timing, desc }) => (
                <div key={num} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-rose-200 transition-colors">
                  <span className="w-8 h-8 bg-rose-600 text-white rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0">{num}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-base">{icon}</span>
                      <span className="text-sm font-bold text-slate-800">{title}</span>
                      <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">{timing}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{framework}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 11. Discussion Questions */}
          <SectionCard id="discussion" title="11. Classroom Discussion Questions" icon="💬">
            <Prose>
              These are faculty-style discussion questions you are likely to encounter in class. Prepare structured answers using the frameworks covered.
            </Prose>
            <div className="mt-4 space-y-3">
              {[
                'GFL holds 60%+ market share and is growing faster than the market. So what exactly is the problem — is this even a company in difficulty?',
                'How would you segment the UK organic juice market beyond GFL\'s current approach? What segmentation bases are being underutilised?',
                'GFL\'s posters were ordered withdrawn by the advertising regulator. Was that poor marketing strategy, or bold marketing that got unlucky? Would you have approved the campaign?',
                'GFL prices at £2.29–2.59 while supermarket organic lines sell for 99p. How long is that gap sustainable — and what would you change in the marketing mix to defend it?',
                'Should GFL launch a direct-to-consumer e-commerce channel? What would happen to its supermarket relationships if it did?',
                'V Juice is growing at 65% at specialist health stores. Should GFL redirect its entire marketing budget behind V Juice and allow Grove Fresh to mature on its own?',
                'If a major beverage brand with full retail distribution launched an organic juice range tomorrow, what happens to GFL\'s competitive position over the following 12 months?',
                'GFL\'s supply problem is structural. Is this a marketing challenge, a supply chain challenge, or both — and does that distinction change how you respond?',
              ].map((q, i) => (
                <DiscussionCard key={i} num={i + 1} question={q} />
              ))}
            </div>
          </SectionCard>

          {/* 12. Viva Preparation */}
          <SectionCard id="viva" title="12. Viva Preparation Questions" icon="🎓">
            <Prose>
              Click each question to reveal a structured answer hint. Prepare all three categories — Conceptual Precision, Framework Application, and Strategic Judgment.
            </Prose>
            <div className="mt-4 space-y-2">
              {[
                {
                  category: 'Conceptual Precision',
                  q: 'At what stage of the Product Life Cycle is the UK organic juice market in 2006?',
                  a: 'Maturity. Data evidence: volume growth collapsed from 224% (1999) to just 5% (2003–04). Strategic implication: shift from trial conversion (growth strategy) to retention, loyalty deepening, and differentiation reinforcement (maturity strategy).',
                },
                {
                  category: 'Conceptual Precision',
                  q: 'Which management orientation — marketing, selling, or production — best describes GFL in 2006?',
                  a: 'GFL was founded with a genuine marketing orientation — it identified an unmet need before designing the supply chain. By 2006, the risk is drift toward a production orientation due to non-organic European acquisitions and competitive pressure. Evidence: declining focus on consumer insight in mature market conditions.',
                },
                {
                  category: 'Conceptual Precision',
                  q: 'Define GFL\'s value proposition precisely. Is it benefit-based or attribute-based?',
                  a: 'GFL\'s value proposition is attribute-based: certified, NFC, zero-additive purity. The risk in maturity is that attribute-based positioning becomes commoditised as competitors match specifications. Benefit-based framing — what the purity does for the consumer\'s identity and health — is more defensible and harder to copy.',
                },
                {
                  category: 'Framework Application',
                  q: 'Apply Porter\'s Generic Competitive Strategies to GFL.',
                  a: 'GFL pursues a Differentiation Focus strategy — premium product targeted at committed organic buyers. The key risk is the "stuck in the middle" trap: if own-label organic credibility grows, GFL\'s differentiation erodes without a clear path to cost leadership. Defence requires deepening the differentiation, not diluting it.',
                },
                {
                  category: 'Framework Application',
                  q: 'Classify GFL\'s three business units using the BCG Growth-Share Matrix.',
                  a: '(a) UK organic juice: Cash Cow — 60%+ market share, only 5% growth. Generates cash but needs investment to avoid becoming a Dog. (b) V Juice: Star/Question Mark — 65% growth, currently small share. Invest aggressively. (c) European non-organic Frische: Question Mark — lower growth, unclear competitive position, potential brand dilution risk.',
                },
                {
                  category: 'Framework Application',
                  q: 'Apply Ansoff\'s four-quadrant expansion framework to GFL\'s growth options.',
                  a: 'Market Penetration (existing product, existing market) — retain loyal buyers, reduce churn: lowest risk. Market Development (existing product, new channel) — food service, corporate wellness: moderate risk. Product Development (V Juice expansion): moderate risk. Diversification (international premium markets): highest risk. Recommendation: prioritise Market Penetration and Market Development in 2006 given the maturity context.',
                },
                {
                  category: 'Strategic Judgment',
                  q: 'GFL grew 30% against a market that expanded 9.5% — three times the category rate. Does this confirm the strategy is working?',
                  a: 'No — strong relative growth in a maturing market can conceal a concerning dynamic: GFL may be taking share from smaller organic competitors rather than genuinely growing the total value pool. As own-label organic grows and category volume stabilises, outperforming a slowing market is not sufficient evidence that the strategy is sustainable. Profitability and brand equity metrics matter more than volume share at this stage.',
                },
                {
                  category: 'Strategic Judgment',
                  q: 'As GFL\'s head of marketing with a £1M budget, which single change to the marketing mix would you make in 2006?',
                  a: 'Redirect budget from mass consumer show sampling (acquisition-oriented) to a loyalty programme for repeat buyers — identifying GFL\'s top 20% of customers by purchase frequency and building a direct relationship via subscription, early product access, and community. Measurable outcome: increase in repeat purchase frequency and reduction in trial-to-lapse rate within 12 months. Rationale: in a 5% growth category, retention economics consistently outperform acquisition economics.',
                },
              ].map(({ category, q, a }) => (
                <VivaCard key={q} question={q} hint={a} category={category} />
              ))}
            </div>
          </SectionCard>

          {/* 13. Key Takeaways */}
          <SectionCard id="takeaways" title="13. Key Takeaways" icon="⚡">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Revision Before Class</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'First-mover advantage is a temporary asset, not a permanent one. GFL\'s market dominance was earned by creating a category. In maturity, sustaining that dominance requires active differentiation investment — not momentum from the original launch.',
                'Price is a positioning signal, not merely a margin decision. GFL\'s £2.29–2.59 price point communicates premium, purity, and exclusivity. Any discount would be brand-destroying, not market-expanding.',
                'In authenticity-based brands, supply integrity is a marketing responsibility. When the brand promise is "pure organic", a supply shortage is simultaneously a brand promise crisis. The two functions cannot be treated as separate.',
                'Sub-brand architecture enables growth without diluting core brand equity. V Juice is the structurally correct decision — it preserves the master brand\'s fruit-juice associations while opening a new consumer segment.',
                'In maturing markets, retention economics dominate acquisition economics. GFL\'s investment model is calibrated for a growth market that no longer exists — a strategic misalignment that compounds over time.',
                'Behavioral insights require regulatory stress-testing before deployment. The principle of loss aversion in consumer communication is sound and well-evidenced. The failure was applying it without testing legal and regulatory boundaries first.',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                  <span className="w-5 h-5 bg-rose-600 text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-br from-slate-800 to-rose-950 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-xs font-semibold text-rose-300 uppercase tracking-widest mb-2">Ready to Study?</p>
            <h3 className="text-white font-bold text-lg mb-2">Download the complete case study</h3>
            <p className="text-slate-300 text-sm mb-5 max-w-md mx-auto">
              Get the formatted Word document with all 13 sections, SWOT, viva preparation, and strategic frameworks — ready for offline study.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
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
                href="/subjects/marketing-management"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View Marketing Lectures →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
