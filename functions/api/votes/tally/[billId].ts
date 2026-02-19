interface Env {
  DB: D1Database;
}

// GET /api/votes/tally/:billId
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const billId = context.params.billId as string;

  const { results } = await context.env.DB.prepare(
    "SELECT choice, COUNT(*) as count FROM votes WHERE bill_id = ? GROUP BY choice"
  )
    .bind(billId)
    .all<{ choice: string; count: number }>();

  const tally = { billId, yea: 0, nay: 0, abstain: 0, total: 0 };
  for (const row of results) {
    if (row.choice === 'yea') tally.yea = row.count;
    else if (row.choice === 'nay') tally.nay = row.count;
    else if (row.choice === 'abstain') tally.abstain = row.count;
  }
  tally.total = tally.yea + tally.nay + tally.abstain;

  return Response.json(tally);
};
