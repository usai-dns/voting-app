interface Env {
  DB: D1Database;
}

function generateReceipt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// POST /api/seed — seeds demo votes and comments (idempotent)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Check if already seeded
  const existing = await context.env.DB.prepare('SELECT COUNT(*) as count FROM votes').first<{ count: number }>();
  if (existing && existing.count > 0) {
    return Response.json({ message: 'Already seeded', votes: existing.count });
  }

  const bills = ['freedom-to-vote', 'john-lewis-vra', 'save-act'];
  const batch: D1PreparedStatement[] = [];

  // Generate demo votes
  for (const billId of bills) {
    for (let i = 0; i < 20; i++) {
      const voterId = `demo-voter-${i}`;
      const receiptId = generateReceipt();
      const rand = Math.random();
      let choice: string;

      if (billId === 'freedom-to-vote') {
        choice = rand < 0.6 ? 'yea' : rand < 0.85 ? 'nay' : 'abstain';
      } else if (billId === 'john-lewis-vra') {
        choice = rand < 0.55 ? 'yea' : rand < 0.8 ? 'nay' : 'abstain';
      } else {
        choice = rand < 0.4 ? 'yea' : rand < 0.75 ? 'nay' : 'abstain';
      }

      const timestamp = new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();

      batch.push(
        context.env.DB.prepare('INSERT INTO votes (receipt_id, bill_id, choice, timestamp) VALUES (?, ?, ?, ?)').bind(
          receiptId,
          billId,
          choice,
          timestamp
        )
      );
      batch.push(
        context.env.DB.prepare('INSERT INTO vote_links (user_id, bill_id, receipt_id) VALUES (?, ?, ?)').bind(
          voterId,
          billId,
          receiptId
        )
      );
    }
  }

  // Seed comments
  const sampleComments = [
    {
      billId: 'freedom-to-vote',
      sectionId: 'ftv-s1',
      content:
        'Automatic voter registration would dramatically simplify the process. 29 states already have some form of AVR — this standardizes it nationally.',
      userId: 'user-2',
      userName: 'Bob Martinez',
    },
    {
      billId: 'freedom-to-vote',
      sectionId: 'ftv-s4',
      content:
        'The gerrymandering ban is the most impactful provision in this bill. Partisan maps undermine representation at its core.',
      userId: 'user-3',
      userName: 'Carol Chen',
    },
    {
      billId: 'freedom-to-vote',
      sectionId: 'ftv-s5',
      content:
        '6:1 small dollar matching would fundamentally change how campaigns are funded. This deserves more attention.',
      userId: 'user-1',
      userName: 'Alice Johnson',
    },
    {
      billId: 'john-lewis-vra',
      sectionId: 'jl-s2',
      content:
        'The 25-year lookback period for the coverage formula seems well-calibrated — long enough to capture patterns but responsive to change.',
      userId: 'user-4',
      userName: 'Dave Wilson',
    },
    {
      billId: 'john-lewis-vra',
      sectionId: 'jl-s3',
      content:
        'Practice-based preclearance is the innovation here. Geographic coverage missed too many discriminatory actions in non-covered states.',
      userId: 'user-1',
      userName: 'Alice Johnson',
    },
    {
      billId: 'save-act',
      sectionId: 'sa-s1',
      content:
        'The document requirement is a solution in search of a problem. Heritage Foundation found only 1,300 proven cases of voter fraud out of billions of votes cast.',
      userId: 'user-3',
      userName: 'Carol Chen',
    },
    {
      billId: 'save-act',
      sectionId: 'sa-s4',
      content:
        '5 years imprisonment for election workers is extreme. This will make it harder to recruit poll workers in an already understaffed system.',
      userId: 'user-5',
      userName: 'Eve Taylor',
    },
    {
      billId: 'save-act',
      sectionId: 'sa-s1',
      content:
        'Every other democracy requires ID to vote. This is a reasonable baseline requirement to ensure election integrity.',
      userId: 'user-4',
      userName: 'Dave Wilson',
    },
  ];

  for (const sc of sampleComments) {
    const id = crypto.randomUUID();
    const createdAt = new Date(Date.now() - Math.random() * 3 * 86400000).toISOString();
    const reactionsUp = Math.floor(Math.random() * 8) + 1;
    const reactionsDown = Math.floor(Math.random() * 3);

    batch.push(
      context.env.DB.prepare(
        'INSERT INTO comments (id, bill_id, section_id, user_id, user_name, parent_id, content, created_at, reactions_up, reactions_down) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(id, sc.billId, sc.sectionId, sc.userId, sc.userName, null, sc.content, createdAt, reactionsUp, reactionsDown)
    );
  }

  // D1 batch limit is 100 statements, we have ~128. Split into chunks.
  const chunkSize = 90;
  for (let i = 0; i < batch.length; i += chunkSize) {
    await context.env.DB.batch(batch.slice(i, i + chunkSize));
  }

  return Response.json({ message: 'Seeded successfully', votes: 60, comments: sampleComments.length });
};
