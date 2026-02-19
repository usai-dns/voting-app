-- Shadow Legislature D1 Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL,
  section_id TEXT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  parent_id TEXT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  reactions_up INTEGER DEFAULT 0,
  reactions_down INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_comments_bill ON comments(bill_id);
CREATE INDEX IF NOT EXISTS idx_comments_bill_section ON comments(bill_id, section_id);

CREATE TABLE IF NOT EXISTS reactions (
  comment_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  bill_id TEXT NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS votes (
  receipt_id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL,
  choice TEXT NOT NULL CHECK(choice IN ('yea', 'nay', 'abstain')),
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_votes_bill ON votes(bill_id);

CREATE TABLE IF NOT EXISTS vote_links (
  user_id TEXT NOT NULL,
  bill_id TEXT NOT NULL,
  receipt_id TEXT NOT NULL,
  PRIMARY KEY (user_id, bill_id)
);

-- Seed test users
INSERT OR IGNORE INTO users (id, username, display_name, password_hash) VALUES
  ('user-1', 'alice', 'Alice Johnson', 'demo123'),
  ('user-2', 'bob', 'Bob Martinez', 'demo123'),
  ('user-3', 'carol', 'Carol Chen', 'demo123'),
  ('user-4', 'dave', 'Dave Wilson', 'demo123'),
  ('user-5', 'eve', 'Eve Taylor', 'demo123');
