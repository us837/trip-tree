import { normalizeSlug, validateSlug } from '../../src/lib/slug';
import { getSessionUser } from '../../src/server/auth';
import type { Env } from '../../src/server/env';
import { errorJson, isSameOrigin, json, readJson } from '../../src/server/http';
import { getProfileByUser } from '../../src/server/profiles';

// GET /api/username?slug=name -> { available, error? }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const slug = normalizeSlug(new URL(request.url).searchParams.get('slug') ?? '');
  const error = validateSlug(slug);
  if (error) return json({ available: false, error });

  const user = await getSessionUser(request, env);
  const owner = await env.DB.prepare('SELECT user_id FROM profiles WHERE slug = ?')
    .bind(slug)
    .first<{ user_id: string }>();
  const available = !owner || owner.user_id === user?.id;
  return json(available ? { available } : { available, error: 'That name is taken.' });
};

// POST /api/username { slug } -> claims a username, or changes the current one
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return errorJson('Forbidden', 403);
  const user = await getSessionUser(request, env);
  if (!user) return errorJson('Not signed in', 401);

  let body: { slug?: unknown };
  try {
    body = (await readJson(request, 1_000)) as { slug?: unknown };
  } catch {
    return errorJson('Invalid request.', 400);
  }
  const slug = normalizeSlug(typeof body.slug === 'string' ? body.slug : '');
  const error = validateSlug(slug);
  if (error) return errorJson(error, 400);

  const now = Date.now();
  try {
    // The UNIQUE constraint on profiles.slug is what guarantees one owner per name.
    await env.DB.prepare(
      `INSERT INTO profiles (user_id, slug, name, avatar, updated_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET slug = excluded.slug, updated_at = excluded.updated_at`,
    )
      .bind(user.id, slug, user.name, user.picture, now)
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) return errorJson('That name is taken.', 409);
    throw err;
  }

  return json({ profile: await getProfileByUser(env, user.id) });
};
