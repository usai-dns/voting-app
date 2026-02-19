import { useState } from 'react';
import type { Bill } from '../types';
import CommentThread from './CommentThread';

export default function BillText({ bill }: { bill: Bill }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    bill.sections[0]?.id ?? null
  );
  const [commentSection, setCommentSection] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="card p-4 mb-4">
        <p className="text-sm text-slate-600">
          Click any section to expand the full text. Use the comment icon to discuss specific sections with other users.
        </p>
      </div>

      {bill.sections.map((section) => {
        const isExpanded = expandedSection === section.id;
        const showComments = commentSection === section.id;

        return (
          <div key={section.id} className="card overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-slate-900 pr-4">{section.title}</h3>
              <svg
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Section Content */}
            {isExpanded && (
              <div className="border-t border-slate-200">
                <div className="p-5">
                  <div className="prose prose-slate prose-sm max-w-none">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => setCommentSection(showComments ? null : section.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      showComments
                        ? 'bg-civic-100 text-civic-700'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    {showComments ? 'Hide Comments' : 'Discuss This Section'}
                  </button>
                </div>

                {/* Comments */}
                {showComments && (
                  <div className="border-t border-slate-200 p-5 bg-slate-50/50">
                    <CommentThread billId={bill.id} sectionId={section.id} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
