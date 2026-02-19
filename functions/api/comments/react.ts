interface Env {
  DB: D1Database;
}

// POST /api/comments/react  body: { billId, commentId, userId, value }
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { billId, commentId, userId, value } = await context.request.json<{
    billId: string;
    commentId: string;
    userId: string;
    value: 1 | -1;
  }>();

  // Get existing reaction
  const existing = await context.env.DB.prepare(
    'SELECT value FROM reactions WHERE comment_id = ? AND user_id = ?'
  )
    .bind(commentId, userId)
    .first<{ value: number }>();

  const batch: D1PreparedStatement[] = [];

  if (existing && existing.value === value) {
    // Toggle off: remove reaction
    batch.push(
      context.env.DB.prepare('DELETE FROM reactions WHERE comment_id = ? AND user_id = ?').bind(commentId, userId)
    );
    if (value === 1) {
      batch.push(
        context.env.DB.prepare('UPDATE comments SET reactions_up = reactions_up - 1 WHERE id = ?').bind(commentId)
      );
    } else {
      batch.push(
        context.env.DB.prepare('UPDATE comments SET reactions_down = reactions_down - 1 WHERE id = ?').bind(commentId)
      );
    }
  } else if (existing) {
    // Switch reaction
    batch.push(
      context.env.DB.prepare('UPDATE reactions SET value = ? WHERE comment_id = ? AND user_id = ?').bind(
        value,
        commentId,
        userId
      )
    );
    if (value === 1) {
      batch.push(
        context.env.DB.prepare(
          'UPDATE comments SET reactions_up = reactions_up + 1, reactions_down = reactions_down - 1 WHERE id = ?'
        ).bind(commentId)
      );
    } else {
      batch.push(
        context.env.DB.prepare(
          'UPDATE comments SET reactions_down = reactions_down + 1, reactions_up = reactions_up - 1 WHERE id = ?'
        ).bind(commentId)
      );
    }
  } else {
    // New reaction
    batch.push(
      context.env.DB.prepare('INSERT INTO reactions (comment_id, user_id, bill_id, value) VALUES (?, ?, ?, ?)').bind(
        commentId,
        userId,
        billId,
        value
      )
    );
    if (value === 1) {
      batch.push(
        context.env.DB.prepare('UPDATE comments SET reactions_up = reactions_up + 1 WHERE id = ?').bind(commentId)
      );
    } else {
      batch.push(
        context.env.DB.prepare('UPDATE comments SET reactions_down = reactions_down + 1 WHERE id = ?').bind(commentId)
      );
    }
  }

  await context.env.DB.batch(batch);

  // Return updated comment
  const comment = await context.env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(commentId).first<any>();

  // Get user's reaction after update
  const userReaction = await context.env.DB.prepare(
    'SELECT value FROM reactions WHERE comment_id = ? AND user_id = ?'
  )
    .bind(commentId, userId)
    .first<{ value: number }>();

  return Response.json({
    id: comment.id,
    billId: comment.bill_id,
    sectionId: comment.section_id,
    userId: comment.user_id,
    userName: comment.user_name,
    parentId: comment.parent_id,
    content: comment.content,
    createdAt: comment.created_at,
    reactions: { up: comment.reactions_up, down: comment.reactions_down },
    userReaction: userReaction?.value ?? null,
  });
};
