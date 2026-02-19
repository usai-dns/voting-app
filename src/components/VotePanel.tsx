import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { castVote, hasUserVoted, getUserReceipt, verifyVote } from '../services/api';
import type { Bill, VoteChoice, VoteReceipt } from '../types';
import GlobalTally from './GlobalTally';

export default function VotePanel({ bill }: { bill: Bill }) {
  const { user } = useAuth();
  const [voted, setVoted] = useState(false);
  const [receipt, setReceipt] = useState<VoteReceipt | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const alreadyVoted = hasUserVoted(user.id, bill.id);
    setVoted(alreadyVoted);
    if (alreadyVoted) {
      const receiptId = getUserReceipt(user.id, bill.id);
      if (receiptId) {
        const voteData = verifyVote(receiptId);
        if (voteData) setReceipt(voteData);
      }
    }
  }, [user, bill.id]);

  function handleVote() {
    if (!user || !selectedChoice) return;
    const result = castVote(bill.id, user.id, selectedChoice);
    if (result) {
      setReceipt(result);
      setVoted(true);
      setShowReceipt(true);
    }
  }

  function copyReceipt() {
    if (receipt) {
      navigator.clipboard.writeText(receipt.receiptId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const choiceConfig: { value: VoteChoice; label: string; color: string; activeColor: string; icon: string }[] = [
    {
      value: 'yea',
      label: 'Yea — Support',
      color: 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50',
      activeColor: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200',
      icon: 'M4.5 12.75l6 6 9-13.5',
    },
    {
      value: 'nay',
      label: 'Nay — Oppose',
      color: 'border-slate-200 hover:border-rose-300 hover:bg-rose-50',
      activeColor: 'border-rose-500 bg-rose-50 ring-2 ring-rose-200',
      icon: 'M6 18L18 6M6 6l12 12',
    },
    {
      value: 'abstain',
      label: 'Abstain',
      color: 'border-slate-200 hover:border-slate-400 hover:bg-slate-50',
      activeColor: 'border-slate-500 bg-slate-50 ring-2 ring-slate-200',
      icon: 'M15.75 19.5L8.25 12l7.5-7.5',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vote Section */}
      <div className="space-y-6">
        {!voted ? (
          <>
            {/* Cast Vote */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Cast Your Vote</h3>
              <p className="text-sm text-slate-600 mb-6">
                Your vote is anonymous and cannot be traced to your account. You will receive a receipt
                to verify your vote independently.
              </p>

              <div className="space-y-3 mb-6">
                {choiceConfig.map(({ value, label, color, activeColor, icon }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedChoice(value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedChoice === value ? activeColor : color
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedChoice === value
                        ? value === 'yea' ? 'bg-emerald-500 text-white'
                          : value === 'nay' ? 'bg-rose-500 text-white'
                          : 'bg-slate-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleVote}
                disabled={!selectedChoice}
                className="btn-primary w-full py-3 text-base"
              >
                Submit Vote
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="card p-5 bg-slate-50 border-slate-200">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-slate-700">Vote Privacy</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Your vote is stored separately from your identity. A unique receipt links you to your vote
                    for verification, but the system cannot determine how any other user voted. Only global
                    aggregates are visible.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Already Voted */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Vote Recorded</h3>
                  <p className="text-sm text-slate-500">Your vote on this bill has been recorded.</p>
                </div>
              </div>

              {receipt && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Your Vote</span>
                      <span className={`badge ${
                        receipt.choice === 'yea' ? 'badge-green' :
                        receipt.choice === 'nay' ? 'badge-red' : 'badge-slate'
                      }`}>
                        {receipt.choice.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</span>
                      <span className="text-xs text-slate-600 font-mono">
                        {new Date(receipt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReceipt(!showReceipt)}
                    className="btn-secondary w-full"
                  >
                    {showReceipt ? 'Hide Receipt' : 'Show Receipt ID'}
                  </button>

                  {showReceipt && (
                    <div className="bg-civic-50 border border-civic-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-civic-700 mb-2">Your Vote Receipt</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono text-civic-900 bg-white rounded px-3 py-2 border border-civic-200 break-all">
                          {receipt.receiptId}
                        </code>
                        <button onClick={copyReceipt} className="btn-ghost shrink-0" title="Copy receipt">
                          {copied ? (
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-civic-600 mt-2">
                        Save this receipt. You can use it to verify your vote at any time from the Verify Vote page.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tally Section */}
      <div>
        <GlobalTally billId={bill.id} />
      </div>
    </div>
  );
}
