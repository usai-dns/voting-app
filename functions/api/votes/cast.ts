interface Env {
  DB: D1Database;
}

function generateReceipt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// POST /api/votes/cast  body: { billId, userId, choice }
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { billId, userId, choice } = await context.request.json<{
    billId: string;
    userId: string;
    choice: 'yea' | 'nay' | 'abstain';
  }>();

  // Check if already voted
  const existing = await context.env.DB.prepare(
    'SELECT receipt_id FROM vote_links WHERE user_id = ? AND bill_id = ?'
  )
    .bind(userId, billId)
    .first();

  if (existing) {
    return Response.json({ error: 'Already voted on this bill' }, { status: 409 });
  }

  const receiptId = generateReceipt();
  const timestamp = new Date().toISOString();

  await context.env.DB.batch([
    context.env.DB.prepare('INSERT INTO votes (receipt_id, bill_id, choice, timestamp) VALUES (?, ?, ?, ?)').bind(
      receiptId,
      billId,
      choice,
      timestamp
    ),
    context.env.DB.prepare('INSERT INTO vote_links (user_id, bill_id, receipt_id) VALUES (?, ?, ?)').bind(
      userId,
      billId,
      receiptId
    ),
  ]);

  return Response.json({ receiptId, billId, choice, timestamp });
};
