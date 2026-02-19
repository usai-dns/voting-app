import { useState } from 'react';
import type { Bill, ChatMessage } from '../types';

const BILL_KNOWLEDGE: Record<string, string[]> = {
  'freedom-to-vote': [
    'The Freedom to Vote Act (S.1/H.R.11) is comprehensive voting legislation addressing access, security, redistricting, and campaign finance.',
    'Key provisions include automatic voter registration, 2 weeks of early voting, Election Day as a holiday, and banning partisan gerrymandering.',
    'The bill has been blocked by Senate filibuster multiple times. It failed on 50-50 party-line votes in both 2021 and 2022.',
    'The 6:1 small-dollar matching provision would fundamentally change campaign finance by incentivizing grassroots fundraising over large donors.',
    'CBO estimates suggest implementation would cost approximately $1.4 billion over 10 years, primarily for the small-dollar matching program.',
    'The Gilens & Page Princeton study (2014) found that average citizens have "near-zero" impact on policy, which this bill aims to address by reducing barriers to participation.',
    '29 states already have some form of automatic voter registration. This bill would standardize it nationally.',
    'The redistricting provisions are modeled on successful independent commission systems in states like California and Arizona.',
  ],
  'john-lewis-vra': [
    'The John Lewis VRA (H.R.14) restores Voting Rights Act protections gutted by Shelby County v. Holder (2013).',
    'After Shelby County, at least 29 states enacted new voting restrictions, with the highest concentration in formerly covered jurisdictions.',
    'The preclearance formula uses a 25-year lookback based on recent violations, replacing the outdated 1965 formula struck down by the Supreme Court.',
    'Practice-based preclearance is an innovation — it covers specific discriminatory changes nationwide, not just in historically covered states.',
    'The bill was named for John Lewis, a civil rights leader who was beaten on the Edmund Pettus Bridge during the 1965 Selma marches.',
    'The original VRA preclearance blocked over 1,000 discriminatory voting changes between 1982 and 2006.',
    'Section 2 strengthening responds to Brnovich v. DNC (2021), where the Supreme Court made it harder to challenge discriminatory voting practices.',
    'DOJ enforcement was historically the primary tool for fighting voting discrimination — this bill restores that capacity.',
  ],
  'save-act': [
    'The SAVE Act (H.R.22) requires documentary proof of U.S. citizenship to register to vote in federal elections.',
    'The Heritage Foundation\'s database found approximately 1,300 proven cases of voter fraud out of billions of votes cast over decades.',
    'An estimated 21 million eligible U.S. citizens lack any form of government-issued photo ID, according to the Brennan Center.',
    'Approximately 69 million women have a last name that doesn\'t match their birth certificate due to marriage, which could complicate compliance.',
    'The bill exempts states not covered by the NVRA: Idaho, Minnesota, New Hampshire, North Dakota, Wisconsin, and Wyoming.',
    'Standard driver\'s licenses in most states do not indicate citizenship, meaning they would not suffice under this bill.',
    'The 5-year criminal penalty for election workers is among the most severe penalties proposed for election administration violations.',
    'Implementation gives states no transition period — the law takes effect immediately upon enactment.',
    'The bill passed the House in February 2026 as part of a broader package including photo ID requirements for voting.',
  ],
};

function generateResponse(bill: Bill, question: string): string {
  const knowledge = BILL_KNOWLEDGE[bill.id] || [];
  const q = question.toLowerCase();

  // Find relevant knowledge
  const relevant = knowledge.filter(k => {
    const kLower = k.toLowerCase();
    const words = q.split(/\s+/).filter(w => w.length > 3);
    return words.some(w => kLower.includes(w));
  });

  if (relevant.length > 0) {
    return relevant.join('\n\n') + '\n\n*This response is generated from a curated knowledge base. In production, this will connect to AI with access to government data sources, CBO analyses, and legislative review databases.*';
  }

  // Generic responses based on question patterns
  if (q.includes('support') || q.includes('favor') || q.includes('pro')) {
    return `Supporters of the ${bill.shortTitle} argue it addresses critical issues in the electoral system. Key arguments in favor include: ${bill.keyProvisions.slice(0, 3).join('; ')}.\n\n*For a comprehensive analysis, the production version will analyze arguments from legislative testimony, think tank reports, and academic research.*`;
  }

  if (q.includes('oppos') || q.includes('against') || q.includes('critic')) {
    return `Critics of the ${bill.shortTitle} raise concerns about implementation costs, federal overreach, and unintended consequences. The bill has faced opposition primarily along partisan lines.\n\n*The production version will pull specific opposition arguments from congressional testimony and policy analysis organizations.*`;
  }

  if (q.includes('cost') || q.includes('budget') || q.includes('cbo')) {
    return `Detailed CBO scoring for the ${bill.shortTitle} would provide cost estimates and economic impact projections. The Shadow Legislature's goal is to build a track record of predictions that beats CBO accuracy.\n\n*Production version will integrate CBO data and independent cost analyses.*`;
  }

  return `Based on the ${bill.shortTitle} (${bill.number}):\n\n${bill.synopsis.split('\n\n')[0]}\n\nThe bill contains ${bill.sections.length} major sections covering: ${bill.sections.map(s => s.title.replace(/^(Title|Section)\s+\w+\s*[—–-]\s*/, '')).join(', ')}.\n\n*This is a prototype AI analysis. The production version will connect to real-time government data sources, CRS reports, CBO analyses, and legislative review databases for comprehensive bill analysis.*`;
}

export default function AIChat({ bill }: { bill: Bill }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I can help you understand the **${bill.shortTitle}** (${bill.number}). Ask me about:\n\n- Key provisions and what they mean\n- Arguments for and against\n- Cost estimates and impact projections\n- How this compares to existing law\n- Historical context and legislative history\n\n*Note: This is a POC. In production, I'll have access to CRS reports, CBO scores, legislative databases, and academic analysis.*`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(bill, userMessage.content);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  }

  const quickQuestions = [
    'What are the key provisions?',
    'What do critics say?',
    'What is the cost estimate?',
    'How does this affect voters?',
  ];

  return (
    <div className="card flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-civic-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-civic-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Legislative AI Analyst</p>
            <p className="text-xs text-slate-500">POC — Knowledge base mode</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-civic-700 text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}
            >
              {msg.content.split('\n\n').map((para, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {para.split(/(\*[^*]+\*)/).map((part, j) => {
                    if (part.startsWith('*') && part.endsWith('*')) {
                      return <em key={j} className="opacity-70 text-xs">{part.slice(1, -1)}</em>;
                    }
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickQuestions.map(q => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about this bill..."
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-primary shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
