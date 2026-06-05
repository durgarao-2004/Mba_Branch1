const features = [
  {
    icon: '📝',
    title: 'Daily Lecture Notes',
    description:
      'Comprehensive, structured notes for every classroom session — organized by subject and date so every concept is easy to find and review.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: '📋',
    title: 'Lecture Summaries',
    description:
      'Each lecture is distilled into a clean, concise summary with key concepts, real-world examples, and case studies for fast revision.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: '🧠',
    title: 'Interactive Quizzes',
    description:
      'Test your understanding with MCQ quizzes after every lecture. Instant feedback, answer explanations, and score tracking included.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: '📚',
    title: 'Subject-wise Learning',
    description:
      'Six core MBA subjects neatly organized — Financial Management, Economics, Marketing, Organizational Behavior, Data Science, and IS.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: '⬇️',
    title: 'Revision Downloads',
    description:
      'Export lecture notes as PDF or DOCX for offline study, exam revision, printing, or sharing with your study group.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: '📱',
    title: 'Mobile-First Design',
    description:
      'Access all study materials from any device — phone, tablet, or desktop — with a clean, distraction-free responsive interface.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">
            Platform Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to excel
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Designed for MBA students who want structured, efficient learning without the clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                {f.icon}
              </div>
              <h3 className={`font-semibold ${f.color} mb-2 text-base`}>{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
