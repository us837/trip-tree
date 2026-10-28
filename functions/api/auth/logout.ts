import { destroySession } from '../../../src/server/auth';
import type { Env } from '../../../src/server/env';
import { errorJson, isSameOrigin, json } from '../../../src/server/http';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return errorJson('Forbidden', 403);
  return json({ ok: true }, 200, { 'Set-Cookie': await destroySession(request, env) });
};
