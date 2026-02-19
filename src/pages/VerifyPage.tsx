import { useState } from 'react';
import { verifyVote } from '../services/api';
import { bills } from '../data/bills';
import type { VoteReceipt } from '../types';

export default function VerifyPage() {
  const [receiptInput, setReceiptInput] = useState('');
  const [result, setResult] = useState<VoteReceipt | null>(null);
  const [searched, setSearched] = useState(false);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = receiptInput.trim();
    if (!trimmed) return;
    const vote = verifyVote(trimmed);
    setResult(vote);
    setSearched(true);
  }

  const bill = result ? bills.find(b => b.id === result.billId) : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Vote</h1>
        <p className="text-slate-600 text-sm">
          Enter your vote receipt ID to verify that your vote was recorded correctly.
          Only you have your receipt — the system cannot trace votes to accounts.
        </p>
      </div>

      {/* Search */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Receipt ID</label>
            <input
              type="text"
              className="input-field font-mono text-sm"
              value={receiptInput}
              onChange={e => setReceiptInput(e.target.value)}
              placeholder="Paste your vote receipt ID here..."
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={!receiptInput.trim()}>
            Verify Vote
          </button>
        </form>
      </div>

      {/* Result */}
      {searched && (
        result ? (
          <div className="card overflow-hidden">
            {/* Success Header */}
            <div className="bg-emerald-50 border-b border-emerald-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">Vote Verified</h3>
                  <p className="text-sm text-emerald-700">This vote receipt is valid and matches a recorded vote.</p>
                </div>
              </div>
            </div>

            {/* Vote Details */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Bill</p>
                  <p className="text-sm font-medium text-slate-900">{bill?.shortTitle ?? result.billId}</p>
                  <p className="text-xs text-slate-500">{bill?.number}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Vote</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    result.choice === 'yea' ? 'text-emerald-700' :
                    result.choice === 'nay' ? 'text-rose-700' : 'text-slate-600'
                  }`}>
                    {result.choice === 'yea' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {result.choice === 'nay' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {result.choice.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Timestamp</p>
                <p className="text-sm text-slate-700 font-mono">{new Date(result.timestamp).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Receipt ID</p>
                <p className="text-xs text-slate-700 font-mono break-all bg-slate-50 rounded-lg p-3">{result.receiptId}</p>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-slate-50 border-t border-slate-200 p-4">
              <p className="text-xs text-slate-500 text-center">
                This verification confirms your vote exists in the system. No account information is
                associated with this receipt in the vote record.
              </p>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">No Vote Found</h3>
                <p className="text-sm text-slate-500">
                  No vote matches this receipt ID. Please check the receipt and try again.
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* How It Works */}
      <div className="mt-8 card p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">How Vote Verification Works</h3>
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'You receive a receipt',
              desc: 'When you cast your vote, the system generates a unique receipt ID that only you see.',
            },
            {
              step: '2',
              title: 'Vote stored anonymously',
              desc: 'Your vote is recorded with the receipt ID but not linked to your account in the vote record.',
            },
            {
              step: '3',
              title: 'Verify independently',
              desc: 'Enter your receipt ID here to confirm your vote was recorded correctly, at any time.',
            },
            {
              step: '4',
              title: 'Privacy preserved',
              desc: 'No one — not even the system — can determine which account cast which vote using the anonymous vote record.',
            },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-civic-100 text-civic-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
