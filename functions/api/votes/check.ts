interface Env {
  DB: D1Database;
}

// GET /api/votes/check?userId=...&billId=...
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get('userId')!;
  const billId = url.searchParams.get('billId')!;

  const link = await context.env.DB.prepare(
    'SELECT receipt_id FROM vote_links WHERE user_id = ? AND bill_id = ?'
  )
    .bind(userId, billId)
    .first<{ receipt_id: string }>();

  return Response.json({
    hasVoted: !!link,
    receiptId: link?.receipt_id ?? null,
  });
};
