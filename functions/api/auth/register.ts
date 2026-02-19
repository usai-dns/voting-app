interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { username, password, displayName } = await context.request.json<{
    username: string;
    password: string;
    displayName: string;
  }>();

  // Check if username is taken
  const existing = await context.env.DB.prepare(
    'SELECT id FROM users WHERE username = ?'
  )
    .bind(username)
    .first();

  if (existing) {
    return Response.json({ error: 'Username already taken' }, { status: 409 });
  }

  const id = crypto.randomUUID();

  await context.env.DB.prepare(
    'INSERT INTO users (id, username, display_name, password_hash) VALUES (?, ?, ?, ?)'
  )
    .bind(id, username, displayName, password)
    .run();

  return Response.json({ id, username, displayName });
};
