import { bills } from '../data/bills';
import BillCard from '../components/BillCard';

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Active Legislation</h1>
        <p className="text-slate-600 text-sm max-w-2xl">
          Review bills currently before Congress that affect voting rights and election procedures.
          Read, comment, vote, and verify your vote independently.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card px-5 py-4">
          <p className="text-2xl font-bold text-civic-700">{bills.length}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Active Bills</p>
        </div>
        <div className="card px-5 py-4">
          <p className="text-2xl font-bold text-emerald-600">Open</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Voting Status</p>
        </div>
        <div className="card px-5 py-4">
          <p className="text-2xl font-bold text-amber-600">POC</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Platform Phase</p>
        </div>
      </div>

      {/* Bill Cards */}
      <div className="space-y-4">
        {bills.map(bill => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 rounded-xl bg-civic-50 border border-civic-200 p-5">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-civic-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-civic-800">Shadow Legislature — Proof of Concept</p>
            <p className="text-sm text-civic-700 mt-1">
              This platform demonstrates direct democratic review of legislation. Your vote is private and verifiable —
              you receive a receipt to confirm your vote, but no one can trace how you voted.
              Global tallies aggregate all votes anonymously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
