interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { username, password } = await context.request.json<{ username: string; password: string }>();

  const user = await context.env.DB.prepare(
    'SELECT id, username, display_name FROM users WHERE username = ? AND password_hash = ?'
  )
    .bind(username, password)
    .first<{ id: string; username: string; display_name: string }>();

  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return Response.json({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
  });
};
