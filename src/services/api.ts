import type { Comment, VoteChoice, VoteReceipt, VoteTally } from '../types';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────

export async function login(
  username: string,
  password: string
): Promise<{ id: string; username: string; displayName: string } | null> {
  try {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return null;
  }
}

export async function register(
  username: string,
  password: string,
  displayName: string
): Promise<{ id: string; username: string; displayName: string } | null> {
  try {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, displayName }),
    });
  } catch {
    return null;
  }
}

// ─── Comments ─────────────────────────────────────

export async function getComments(billId: string, sectionId?: string | null): Promise<Comment[]> {
  const params = new URLSearchParams();
  if (sectionId) params.set('sectionId', sectionId);
  const qs = params.toString();
  return request(`/comments/${billId}${qs ? `?${qs}` : ''}`);
}

export async function addComment(
  billId: string,
  sectionId: string | null,
  userId: string,
  userName: string,
  content: string,
  parentId: string | null = null
): Promise<Comment> {
  return request(`/comments/${billId}`, {
    method: 'POST',
    body: JSON.stringify({ sectionId, userId, userName, content, parentId }),
  });
}

export async function reactToComment(
  billId: string,
  commentId: string,
  userId: string,
  value: 1 | -1
): Promise<Comment | null> {
  try {
    return await request('/comments/react', {
      method: 'POST',
      body: JSON.stringify({ billId, commentId, userId, value }),
    });
  } catch {
    return null;
  }
}

export async function getCommentsWithReactions(
  billId: string,
  userId: string,
  sectionId?: string | null
): Promise<Comment[]> {
  const params = new URLSearchParams();
  if (sectionId) params.set('sectionId', sectionId);
  params.set('userId', userId);
  return request(`/comments/${billId}?${params.toString()}`);
}

// ─── Votes (Privacy-preserving) ───────────────────

export async function castVote(
  billId: string,
  userId: string,
  choice: VoteChoice
): Promise<VoteReceipt | null> {
  try {
    return await request('/votes/cast', {
      method: 'POST',
      body: JSON.stringify({ billId, userId, choice }),
    });
  } catch {
    return null;
  }
}

export async function verifyVote(receiptId: string): Promise<VoteReceipt | null> {
  try {
    return await request(`/votes/verify/${receiptId}`);
  } catch {
    return null;
  }
}

export async function getUserReceipt(userId: string, billId: string): Promise<string | null> {
  const data = await request<{ hasVoted: boolean; receiptId: string | null }>(
    `/votes/check?userId=${encodeURIComponent(userId)}&billId=${encodeURIComponent(billId)}`
  );
  return data.receiptId;
}

export async function hasUserVoted(userId: string, billId: string): Promise<boolean> {
  const data = await request<{ hasVoted: boolean; receiptId: string | null }>(
    `/votes/check?userId=${encodeURIComponent(userId)}&billId=${encodeURIComponent(billId)}`
  );
  return data.hasVoted;
}

export async function getTally(billId: string): Promise<VoteTally> {
  return request(`/votes/tally/${billId}`);
}

// ─── Seed demo data ───────────────────────────────

export async function seedDemoData(): Promise<void> {
  try {
    await request('/seed', { method: 'POST' });
  } catch {
    // Already seeded or error — either way, continue
  }
}
