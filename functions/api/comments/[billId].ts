interface Env {
  DB: D1Database;
}

// GET /api/comments/:billId?sectionId=...&userId=...
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const billId = context.params.billId as string;
  const url = new URL(context.request.url);
  const sectionId = url.searchParams.get('sectionId');
  const userId = url.searchParams.get('userId');

  let query: string;
  const params: string[] = [billId];

  if (sectionId) {
    query = 'SELECT * FROM comments WHERE bill_id = ? AND section_id = ? ORDER BY created_at ASC';
    params.push(sectionId);
  } else {
    query = 'SELECT * FROM comments WHERE bill_id = ? ORDER BY created_at ASC';
  }

  const { results: comments } = await context.env.DB.prepare(query).bind(...params).all();

  // If userId provided, attach user reactions
  if (userId && comments.length > 0) {
    const commentIds = comments.map((c: any) => c.id);
    const placeholders = commentIds.map(() => '?').join(',');
    const { results: reactions } = await context.env.DB.prepare(
      `SELECT comment_id, value FROM reactions WHERE user_id = ? AND comment_id IN (${placeholders})`
    )
      .bind(userId, ...commentIds)
      .all();

    const reactionMap = new Map<string, number>();
    for (const r of reactions as any[]) {
      reactionMap.set(r.comment_id, r.value);
    }

    return Response.json(
      comments.map((c: any) => ({
        id: c.id,
        billId: c.bill_id,
        sectionId: c.section_id,
        userId: c.user_id,
        userName: c.user_name,
        parentId: c.parent_id,
        content: c.content,
        createdAt: c.created_at,
        reactions: { up: c.reactions_up, down: c.reactions_down },
        userReaction: reactionMap.get(c.id) ?? null,
      }))
    );
  }

  return Response.json(
    comments.map((c: any) => ({
      id: c.id,
      billId: c.bill_id,
      sectionId: c.section_id,
      userId: c.user_id,
      userName: c.user_name,
      parentId: c.parent_id,
      content: c.content,
      createdAt: c.created_at,
      reactions: { up: c.reactions_up, down: c.reactions_down },
    }))
  );
};

// POST /api/comments/:billId
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const billId = context.params.billId as string;
  const { sectionId, userId, userName, content, parentId } = await context.request.json<{
    sectionId: string | null;
    userId: string;
    userName: string;
    content: string;
    parentId: string | null;
  }>();

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await context.env.DB.prepare(
    'INSERT INTO comments (id, bill_id, section_id, user_id, user_name, parent_id, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, billId, sectionId, userId, userName, parentId, content, createdAt)
    .run();

  return Response.json({
    id,
    billId,
    sectionId,
    userId,
    userName,
    parentId,
    content,
    createdAt,
    reactions: { up: 0, down: 0 },
  });
};
