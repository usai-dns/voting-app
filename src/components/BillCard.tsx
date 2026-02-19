import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Bill, VoteTally } from '../types';
import { getTally } from '../services/api';

function statusBadgeClass(status: Bill['status']): string {
  switch (status) {
    case 'introduced': return 'badge-blue';
    case 'passed_house': return 'badge-amber';
    case 'passed_senate': return 'badge-green';
    case 'enacted': return 'badge-green';
    case 'failed': return 'badge-red';
    default: return 'badge-slate';
  }
}

export default function BillCard({ bill }: { bill: Bill }) {
  const [tally, setTally] = useState<VoteTally>({ billId: bill.id, yea: 0, nay: 0, abstain: 0, total: 0 });

  useEffect(() => {
    getTally(bill.id).then(setTally);
  }, [bill.id]);

  const totalVotes = tally.total;
  const yeaPct = totalVotes > 0 ? Math.round((tally.yea / totalVotes) * 100) : 0;
  const nayPct = totalVotes > 0 ? Math.round((tally.nay / totalVotes) * 100) : 0;

  return (
    <Link
      to={`/bill/${bill.id}`}
      className="card block p-6 hover:border-civic-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Bill Number and Status */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-medium text-slate-500">{bill.number}</span>
            <span className={statusBadgeClass(bill.status)}>{bill.statusLabel}</span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-slate-900 group-hover:text-civic-700 transition-colors mb-2">
            {bill.title}
          </h2>

          {/* Synopsis excerpt */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {bill.synopsis.split('\n')[0]}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {bill.tags.map(tag => (
              <span key={tag} className="badge-slate">{tag}</span>
            ))}
          </div>
        </div>

        {/* Vote Summary */}
        <div className="shrink-0 w-44">
          <div className="text-right mb-3">
            <p className="text-sm font-medium text-slate-900">{totalVotes} votes</p>
          </div>

          {/* Vote bar */}
          {totalVotes > 0 && (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="bg-emerald-500 rounded-l-full transition-all"
                  style={{ width: `${yeaPct}%` }}
                />
                <div
                  className="bg-rose-500 rounded-r-full transition-all"
                  style={{ width: `${nayPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-700 font-medium">{yeaPct}% Yea</span>
                <span className="text-rose-700 font-medium">{nayPct}% Nay</span>
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-end mt-3">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-civic-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
