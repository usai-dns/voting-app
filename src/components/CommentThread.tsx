import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { getCommentsWithReactions, addComment, reactToComment } from '../services/api';
import type { Comment } from '../types';

interface CommentThreadProps {
  billId: string;
  sectionId: string | null;
}

export default function CommentThread({ billId, sectionId }: CommentThreadProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadComments = useCallback(async () => {
    if (!user) return;
    const data = await getCommentsWithReactions(billId, user.id, sectionId);
    setComments(data);
  }, [billId, sectionId, user]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    await addComment(billId, sectionId, user.id, user.displayName, newComment.trim());
    setNewComment('');
    await loadComments();
  }

  async function handleReply(parentId: string) {
    if (!user || !replyText.trim()) return;
    await addComment(billId, sectionId, user.id, user.displayName, replyText.trim(), parentId);
    setReplyText('');
    setReplyTo(null);
    await loadComments();
  }

  async function handleReaction(commentId: string, value: 1 | -1) {
    if (!user) return;
    await reactToComment(billId, commentId, user.id, value);
    await loadComments();
  }

  // Build tree
  const topLevel = comments.filter(c => !c.parentId);
  const replies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
    const score = comment.reactions.up - comment.reactions.down;

    return (
      <div className={depth > 0 ? 'ml-6 border-l-2 border-slate-200 pl-4' : ''}>
        <div className="py-3">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-civic-100 text-civic-700 flex items-center justify-center text-xs font-bold">
              {comment.userName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-900">{comment.userName}</span>
            <span className="text-xs text-slate-400">{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-700 leading-relaxed mb-2">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Reactions */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-full">
              <button
                onClick={() => handleReaction(comment.id, 1)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  comment.userReaction === 1
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                {comment.reactions.up}
              </button>
              <span className={`text-xs font-bold px-1 ${
                score > 0 ? 'text-emerald-600' : score < 0 ? 'text-rose-600' : 'text-slate-400'
              }`}>
                {score > 0 ? `+${score}` : score}
              </span>
              <button
                onClick={() => handleReaction(comment.id, -1)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  comment.userReaction === -1
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                {comment.reactions.down}
              </button>
            </div>

            {/* Reply button */}
            {depth < 2 && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-xs text-slate-500 hover:text-civic-600 font-medium"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                className="input-field text-sm py-2"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply(comment.id);
                  }
                }}
              />
              <button
                onClick={() => handleReply(comment.id)}
                disabled={!replyText.trim()}
                className="btn-primary py-2 px-3 text-xs"
              >
                Reply
              </button>
            </div>
          )}
        </div>

        {/* Nested replies */}
        {replies(comment.id).map(reply => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-civic-100 text-civic-700 flex items-center justify-center text-xs font-bold shrink-0">
          {user?.displayName?.charAt(0)}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="input-field text-sm"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment on this section..."
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="btn-primary shrink-0"
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments list */}
      {topLevel.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">
          No comments yet. Start the discussion.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {topLevel
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
      )}
    </div>
  );
}
