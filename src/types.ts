export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface BillSection {
  id: string;
  title: string;
  content: string;
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  status: 'introduced' | 'passed_house' | 'passed_senate' | 'enacted' | 'failed';
  statusLabel: string;
  congress: string;
  sponsors: string[];
  synopsis: string;
  keyProvisions: string[];
  sections: BillSection[];
  tags: string[];
}

export interface Comment {
  id: string;
  billId: string;
  sectionId: string | null;
  userId: string;
  userName: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  reactions: { up: number; down: number };
  userReaction?: 1 | -1 | null;
}

export type VoteChoice = 'yea' | 'nay' | 'abstain';

export interface VoteReceipt {
  receiptId: string;
  billId: string;
  choice: VoteChoice;
  timestamp: string;
}

export interface VoteTally {
  billId: string;
  yea: number;
  nay: number;
  abstain: number;
  total: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
