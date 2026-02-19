import type { Comment, VoteChoice, VoteReceipt, VoteTally } from '../types';

const STORAGE_PREFIX = 'sl_';

function getStore<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, value: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

function generateId(): string {
  return crypto.randomUUID();
}

function generateReceipt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Auth ─────────────────────────────────────────

interface StoredUser {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
}

const TEST_USERS: StoredUser[] = [
  { id: 'user-1', username: 'alice', displayName: 'Alice Johnson', passwordHash: 'demo123' },
  { id: 'user-2', username: 'bob', displayName: 'Bob Martinez', passwordHash: 'demo123' },
  { id: 'user-3', username: 'carol', displayName: 'Carol Chen', passwordHash: 'demo123' },
  { id: 'user-4', username: 'dave', displayName: 'Dave Wilson', passwordHash: 'demo123' },
  { id: 'user-5', username: 'eve', displayName: 'Eve Taylor', passwordHash: 'demo123' },
];

function initUsers(): void {
  const existing = getStore<StoredUser[]>('users', []);
  if (existing.length === 0) {
    setStore('users', TEST_USERS);
  }
}

initUsers();

export function login(username: string, password: string): { id: string; username: string; displayName: string } | null {
  const users = getStore<StoredUser[]>('users', []);
  const user = users.find(u => u.username === username && u.passwordHash === password);
  if (!user) return null;
  return { id: user.id, username: user.username, displayName: user.displayName };
}

export function register(username: string, password: string, displayName: string): { id: string; username: string; displayName: string } | null {
  const users = getStore<StoredUser[]>('users', []);
  if (users.find(u => u.username === username)) return null;
  const newUser: StoredUser = {
    id: generateId(),
    username,
    displayName,
    passwordHash: password,
  };
  users.push(newUser);
  setStore('users', users);
  return { id: newUser.id, username: newUser.username, displayName: newUser.displayName };
}

// ─── Comments ─────────────────────────────────────

export function getComments(billId: string, sectionId?: string | null): Comment[] {
  const all = getStore<Comment[]>(`comments_${billId}`, []);
  if (sectionId !== undefined && sectionId !== null) {
    return all.filter(c => c.sectionId === sectionId);
  }
  return all;
}

export function addComment(
  billId: string,
  sectionId: string | null,
  userId: string,
  userName: string,
  content: string,
  parentId: string | null = null
): Comment {
  const comments = getStore<Comment[]>(`comments_${billId}`, []);
  const comment: Comment = {
    id: generateId(),
    billId,
    sectionId,
    userId,
    userName,
    parentId,
    content,
    createdAt: new Date().toISOString(),
    reactions: { up: 0, down: 0 },
  };
  comments.push(comment);
  setStore(`comments_${billId}`, comments);
  return comment;
}

export function reactToComment(billId: string, commentId: string, userId: string, value: 1 | -1): Comment | null {
  const comments = getStore<Comment[]>(`comments_${billId}`, []);
  const reactions = getStore<Record<string, Record<string, 1 | -1>>>(`reactions_${billId}`, {});

  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;

  const commentReactions = reactions[commentId] || {};
  const existingValue = commentReactions[userId];

  if (existingValue === value) {
    // Remove reaction
    if (value === 1) comment.reactions.up--;
    else comment.reactions.down--;
    delete commentReactions[userId];
  } else {
    // Remove old reaction if exists
    if (existingValue === 1) comment.reactions.up--;
    else if (existingValue === -1) comment.reactions.down--;
    // Add new reaction
    if (value === 1) comment.reactions.up++;
    else comment.reactions.down++;
    commentReactions[userId] = value;
  }

  reactions[commentId] = commentReactions;
  setStore(`comments_${billId}`, comments);
  setStore(`reactions_${billId}`, reactions);

  return { ...comment, userReaction: commentReactions[userId] ?? null };
}

export function getCommentWithUserReaction(billId: string, commentId: string, userId: string): Comment | null {
  const comments = getStore<Comment[]>(`comments_${billId}`, []);
  const reactions = getStore<Record<string, Record<string, 1 | -1>>>(`reactions_${billId}`, {});
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;
  const commentReactions = reactions[commentId] || {};
  return { ...comment, userReaction: commentReactions[userId] ?? null };
}

export function getCommentsWithReactions(billId: string, userId: string, sectionId?: string | null): Comment[] {
  const comments = getComments(billId, sectionId);
  const reactions = getStore<Record<string, Record<string, 1 | -1>>>(`reactions_${billId}`, {});
  return comments.map(c => ({
    ...c,
    userReaction: reactions[c.id]?.[userId] ?? null,
  }));
}

// ─── Votes (Privacy-preserving) ───────────────────

interface StoredVote {
  receiptId: string;
  billId: string;
  choice: VoteChoice;
  timestamp: string;
}

interface UserVoteLink {
  userId: string;
  billId: string;
  receiptId: string;
}

export function castVote(billId: string, userId: string, choice: VoteChoice): VoteReceipt | null {
  const links = getStore<UserVoteLink[]>('vote_links', []);

  // Check if user already voted on this bill
  if (links.find(l => l.userId === userId && l.billId === billId)) {
    return null; // Already voted
  }

  const receiptId = generateReceipt();
  const timestamp = new Date().toISOString();

  // Store vote anonymously
  const votes = getStore<StoredVote[]>('votes', []);
  votes.push({ receiptId, billId, choice, timestamp });
  setStore('votes', votes);

  // Store link (for preventing double-vote only)
  links.push({ userId, billId, receiptId });
  setStore('vote_links', links);

  return { receiptId, billId, choice, timestamp };
}

export function verifyVote(receiptId: string): VoteReceipt | null {
  const votes = getStore<StoredVote[]>('votes', []);
  const vote = votes.find(v => v.receiptId === receiptId);
  if (!vote) return null;
  return vote;
}

export function getUserReceipt(userId: string, billId: string): string | null {
  const links = getStore<UserVoteLink[]>('vote_links', []);
  const link = links.find(l => l.userId === userId && l.billId === billId);
  return link?.receiptId ?? null;
}

export function hasUserVoted(userId: string, billId: string): boolean {
  const links = getStore<UserVoteLink[]>('vote_links', []);
  return links.some(l => l.userId === userId && l.billId === billId);
}

export function getTally(billId: string): VoteTally {
  const votes = getStore<StoredVote[]>('votes', []);
  const billVotes = votes.filter(v => v.billId === billId);
  return {
    billId,
    yea: billVotes.filter(v => v.choice === 'yea').length,
    nay: billVotes.filter(v => v.choice === 'nay').length,
    abstain: billVotes.filter(v => v.choice === 'abstain').length,
    total: billVotes.length,
  };
}

// ─── Seed demo data ───────────────────────────────

export function seedDemoData(): void {
  // Only seed if no votes exist yet
  const existingVotes = getStore<StoredVote[]>('votes', []);
  if (existingVotes.length > 0) return;

  const bills = ['freedom-to-vote', 'john-lewis-vra', 'save-act'];
  const demoVoters = Array.from({ length: 20 }, (_, i) => `demo-voter-${i}`);

  const votes: StoredVote[] = [];
  const links: UserVoteLink[] = [];

  for (const billId of bills) {
    for (const voterId of demoVoters) {
      const receiptId = generateReceipt();
      const rand = Math.random();
      let choice: VoteChoice;

      if (billId === 'freedom-to-vote') {
        choice = rand < 0.6 ? 'yea' : rand < 0.85 ? 'nay' : 'abstain';
      } else if (billId === 'john-lewis-vra') {
        choice = rand < 0.55 ? 'yea' : rand < 0.8 ? 'nay' : 'abstain';
      } else {
        choice = rand < 0.4 ? 'yea' : rand < 0.75 ? 'nay' : 'abstain';
      }

      votes.push({
        receiptId,
        billId,
        choice,
        timestamp: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      });
      links.push({ userId: voterId, billId, receiptId });
    }
  }

  setStore('votes', votes);
  setStore('vote_links', links);

  // Seed some comments
  const sampleComments: { billId: string; sectionId: string; content: string; user: string; name: string }[] = [
    { billId: 'freedom-to-vote', sectionId: 'ftv-s1', content: 'Automatic voter registration would dramatically simplify the process. 29 states already have some form of AVR — this standardizes it nationally.', user: 'user-2', name: 'Bob Martinez' },
    { billId: 'freedom-to-vote', sectionId: 'ftv-s4', content: 'The gerrymandering ban is the most impactful provision in this bill. Partisan maps undermine representation at its core.', user: 'user-3', name: 'Carol Chen' },
    { billId: 'freedom-to-vote', sectionId: 'ftv-s5', content: '6:1 small dollar matching would fundamentally change how campaigns are funded. This deserves more attention.', user: 'user-1', name: 'Alice Johnson' },
    { billId: 'john-lewis-vra', sectionId: 'jl-s2', content: 'The 25-year lookback period for the coverage formula seems well-calibrated — long enough to capture patterns but responsive to change.', user: 'user-4', name: 'Dave Wilson' },
    { billId: 'john-lewis-vra', sectionId: 'jl-s3', content: 'Practice-based preclearance is the innovation here. Geographic coverage missed too many discriminatory actions in non-covered states.', user: 'user-1', name: 'Alice Johnson' },
    { billId: 'save-act', sectionId: 'sa-s1', content: 'The document requirement is a solution in search of a problem. Heritage Foundation found only 1,300 proven cases of voter fraud out of billions of votes cast.', user: 'user-3', name: 'Carol Chen' },
    { billId: 'save-act', sectionId: 'sa-s4', content: '5 years imprisonment for election workers is extreme. This will make it harder to recruit poll workers in an already understaffed system.', user: 'user-5', name: 'Eve Taylor' },
    { billId: 'save-act', sectionId: 'sa-s1', content: 'Every other democracy requires ID to vote. This is a reasonable baseline requirement to ensure election integrity.', user: 'user-4', name: 'Dave Wilson' },
  ];

  for (const sc of sampleComments) {
    const comments = getStore<Comment[]>(`comments_${sc.billId}`, []);
    comments.push({
      id: generateId(),
      billId: sc.billId,
      sectionId: sc.sectionId,
      userId: sc.user,
      userName: sc.name,
      parentId: null,
      content: sc.content,
      createdAt: new Date(Date.now() - Math.random() * 3 * 86400000).toISOString(),
      reactions: { up: Math.floor(Math.random() * 8) + 1, down: Math.floor(Math.random() * 3) },
    });
    setStore(`comments_${sc.billId}`, comments);
  }
}
