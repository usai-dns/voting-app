import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bills } from '../data/bills';
import BillSynopsis from '../components/BillSynopsis';
import BillText from '../components/BillText';
import VotePanel from '../components/VotePanel';
import GlobalTally from '../components/GlobalTally';
import AIChat from '../components/AIChat';

type Tab = 'synopsis' | 'text' | 'vote' | 'chat';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'synopsis', label: 'Synopsis', icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' },
  { id: 'text', label: 'Full Text & Comments', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { id: 'vote', label: 'Vote', icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z' },
  { id: 'chat', label: 'AI Analysis', icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z' },
];

export default function BillDetailPage() {
  const { billId } = useParams<{ billId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('synopsis');

  const bill = bills.find(b => b.id === billId);

  if (!bill) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Bill not found</h2>
        <Link to="/" className="text-civic-600 hover:text-civic-700 text-sm font-medium">
          Back to all bills
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-sm text-slate-500 hover:text-civic-600 transition-colors">
          All Bills
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-sm text-slate-900 font-medium">{bill.shortTitle}</span>
      </nav>

      {/* Bill Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm text-slate-500">{bill.number}</span>
              <span className={`badge ${
                bill.status === 'introduced' ? 'badge-blue' :
                bill.status === 'passed_house' ? 'badge-amber' :
                bill.status === 'enacted' ? 'badge-green' : 'badge-slate'
              }`}>
                {bill.statusLabel}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{bill.title}</h1>
            <p className="text-sm text-slate-500">
              {bill.congress} &middot; Sponsored by {bill.sponsors.join(', ')}
            </p>
          </div>
          <GlobalTally billId={bill.id} compact />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {bill.tags.map(tag => (
            <span key={tag} className="badge-slate">{tag}</span>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-slate-200 p-1.5 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-civic-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'synopsis' && <BillSynopsis bill={bill} />}
        {activeTab === 'text' && <BillText bill={bill} />}
        {activeTab === 'vote' && <VotePanel bill={bill} />}
        {activeTab === 'chat' && <AIChat bill={bill} />}
      </div>
    </div>
  );
}
