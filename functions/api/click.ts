import type { Env } from '../../src/server/env';
import { readJson, today } from '../../src/server/http';
import { getPublicProfile } from '../../src/server/profiles';

// Sent with navigator.sendBeacon from public pages: { slug, linkId }.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });

  let body: { slug?: unknown; linkId?: unknown };
  try {
    body = (await readJson(request, 500)) as typeof body;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof body.slug !== 'string' || typeof body.linkId !== 'string') return new Response(null, { status: 400 });

  const page = await getPublicProfile(env, body.slug.toLowerCase());
  if (!page || !page.profile.links.some((l) => l.id === body.linkId)) return new Response(null, { status: 404 });

  await env.DB.prepare(
    `INSERT INTO link_clicks (user_id, link_id, day, count) VALUES (?, ?, ?, 1)
     ON CONFLICT (user_id, link_id, day) DO UPDATE SET count = count + 1`,
  )
    .bind(page.userId, body.linkId, today())
    .run();
  return new Response(null, { status: 204 });
};
