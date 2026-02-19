interface Env {
  DB: D1Database;
}

// GET /api/votes/verify/:receiptId
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const receiptId = context.params.receiptId as string;

  const vote = await context.env.DB.prepare(
    'SELECT receipt_id, bill_id, choice, timestamp FROM votes WHERE receipt_id = ?'
  )
    .bind(receiptId)
    .first<{ receipt_id: string; bill_id: string; choice: string; timestamp: string }>();

  if (!vote) {
    return Response.json({ error: 'Vote not found' }, { status: 404 });
  }

  return Response.json({
    receiptId: vote.receipt_id,
    billId: vote.bill_id,
    choice: vote.choice,
    timestamp: vote.timestamp,
  });
};
