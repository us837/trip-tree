import { createSession } from '../../../src/server/auth';
import type { Env } from '../../../src/server/env';
import { getCookie, redirect, serializeCookie } from '../../../src/server/http';

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = getCookie(request, 'tt_oauth_state');
  const clearState = serializeCookie('tt_oauth_state', '', 0);

  if (!code || !state || state !== expectedState) {
    return redirect('/login?error=state', { 'Set-Cookie': clearState });
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) return redirect('/login?error=google', { 'Set-Cookie': clearState });
  const { access_token } = await tokenRes.json<{ access_token: string }>();

  const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!infoRes.ok) return redirect('/login?error=google', { 'Set-Cookie': clearState });
  const info = await infoRes.json<GoogleUserInfo>();
  if (!info.sub || !info.email || !info.email_verified) {
    return redirect('/login?error=email', { 'Set-Cookie': clearState });
  }

  const user = await env.DB.prepare(
    `INSERT INTO users (id, google_sub, email, name, picture, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (google_sub) DO UPDATE SET email = excluded.email, name = excluded.name, picture = excluded.picture
     RETURNING id`,
  )
    .bind(crypto.randomUUID(), info.sub, info.email, info.name ?? '', info.picture ?? '', Date.now())
    .first<{ id: string }>();
  if (!user) return redirect('/login?error=server', { 'Set-Cookie': clearState });

  const headers = new Headers();
  headers.append('Set-Cookie', clearState);
  headers.append('Set-Cookie', await createSession(env, user.id));
  return redirect('/dashboard', headers);
};
