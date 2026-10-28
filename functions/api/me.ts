import type { MeResponse } from '../../src/lib/types';
import { getSessionUser } from '../../src/server/auth';
import type { Env } from '../../src/server/env';
import { errorJson, json } from '../../src/server/http';
import { getProfileByUser } from '../../src/server/profiles';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getSessionUser(request, env);
  if (!user) return errorJson('Not signed in', 401);

  const body: MeResponse = {
    user: { email: user.email, name: user.name, picture: user.picture, plan: user.plan },
    profile: await getProfileByUser(env, user.id),
  };
  return json(body);
};
