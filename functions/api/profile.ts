import { validateProfile } from '../../src/lib/validate';
import { getSessionUser } from '../../src/server/auth';
import type { Env } from '../../src/server/env';
import { errorJson, isSameOrigin, json, readJson } from '../../src/server/http';
import { getProfileByUser } from '../../src/server/profiles';

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return errorJson('Forbidden', 403);
  const user = await getSessionUser(request, env);
  if (!user) return errorJson('Not signed in', 401);

  let body: unknown;
  try {
    body = await readJson(request);
  } catch {
    return errorJson('Invalid request.', 400);
  }

  const result = validateProfile(body, user.plan);
  if (!result.ok) return errorJson(result.error, 400);
  const p = result.value;

  const { meta } = await env.DB.prepare(
    `UPDATE profiles SET name = ?, bio = ?, avatar = ?, theme = ?, links = ?, updated_at = ?
     WHERE user_id = ?`,
  )
    .bind(p.name, p.bio, p.avatar, p.theme, JSON.stringify(p.links), Date.now(), user.id)
    .run();
  if (meta.changes === 0) return errorJson('Claim a username first.', 409);

  return json({ profile: await getProfileByUser(env, user.id) });
};
