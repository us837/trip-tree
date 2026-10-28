import { randomToken } from '../../../src/server/auth';
import type { Env } from '../../../src/server/env';
import { redirect, serializeCookie } from '../../../src/server/http';

// Starts Google sign-in. The random state is echoed back to /api/auth/callback
// and compared with this cookie to reject forged callbacks.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = new URL(request.url).origin;
  const state = randomToken(16);

  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  auth.searchParams.set('redirect_uri', `${origin}/api/auth/callback`);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('scope', 'openid email profile');
  auth.searchParams.set('state', state);
  auth.searchParams.set('prompt', 'select_account');

  return redirect(auth.toString(), { 'Set-Cookie': serializeCookie('tt_oauth_state', state, 600) });
};
