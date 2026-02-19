import { useState, useEffect, useCallback } from 'react';
import { getTally } from '../services/api';
import type { VoteTally } from '../types';

interface GlobalTallyProps {
  billId: string;
  compact?: boolean;
}

export default function GlobalTally({ billId, compact = false }: GlobalTallyProps) {
  const [tally, setTally] = useState<VoteTally>({ billId, yea: 0, nay: 0, abstain: 0, total: 0 });

  const refresh = useCallback(() => {
    setTally(getTally(billId));
  }, [billId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  const yeaPct = tally.total > 0 ? Math.round((tally.yea / tally.total) * 100) : 0;
  const nayPct = tally.total > 0 ? Math.round((tally.nay / tally.total) * 100) : 0;
  const abstainPct = tally.total > 0 ? Math.round((tally.abstain / tally.total) * 100) : 0;

  if (compact) {
    return (
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-900 mb-1">{tally.total} votes</p>
        {tally.total > 0 && (
          <div className="flex gap-2 text-xs">
            <span className="text-emerald-600 font-medium">{yeaPct}% Y</span>
            <span className="text-rose-600 font-medium">{nayPct}% N</span>
            <span className="text-slate-400 font-medium">{abstainPct}% A</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Global Vote Tally</h3>
        <span className="text-sm text-slate-500">{tally.total} total votes</span>
      </div>

      {tally.total === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No votes cast yet. Be the first.</p>
      ) : (
        <div className="space-y-4">
          {/* Bar chart */}
          <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex">
            {tally.yea > 0 && (
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${yeaPct}%` }}
              />
            )}
            {tally.abstain > 0 && (
              <div
                className="bg-slate-300 transition-all duration-500"
                style={{ width: `${abstainPct}%` }}
              />
            )}
            {tally.nay > 0 && (
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${nayPct}%` }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-900">Yea</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{tally.yea}</p>
              <p className="text-xs text-slate-500">{yeaPct}%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-sm font-medium text-slate-900">Abstain</span>
              </div>
              <p className="text-2xl font-bold text-slate-500">{tally.abstain}</p>
              <p className="text-xs text-slate-500">{abstainPct}%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-sm font-medium text-slate-900">Nay</span>
              </div>
              <p className="text-2xl font-bold text-rose-600">{tally.nay}</p>
              <p className="text-xs text-slate-500">{nayPct}%</p>
            </div>
          </div>

          {/* Transparency note */}
          <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
            All votes are anonymous. Individual votes cannot be traced to accounts.
          </p>
        </div>
      )}
    </div>
  );
}
