import type { Bill } from '../types';

export default function BillSynopsis({ bill }: { bill: Bill }) {
  return (
    <div className="space-y-6">
      {/* Synopsis */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Synopsis</h2>
        <div className="prose prose-slate prose-sm max-w-none">
          {bill.synopsis.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-slate-700 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Key Provisions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Provisions</h2>
        <ul className="space-y-3">
          {bill.keyProvisions.map((provision, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-civic-100 text-civic-700 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed">{provision}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Sections</h2>
        <div className="space-y-2">
          {bill.sections.map((section, i) => (
            <div
              key={section.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs font-mono text-slate-400 w-8">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm text-slate-700 font-medium">{section.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
