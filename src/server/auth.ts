import { effectivePlan } from '../lib/plans';
import type { Plan } from '../lib/types';
import type { Env } from './env';
import { getCookie, serializeCookie } from './http';

const SESSION_COOKIE = 'tt_session';
const SESSION_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  plan: Plan;
}

export function randomToken(bytes = 32): string {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Creates a session and returns the Set-Cookie header value. Only the token hash is stored. */
export async function createSession(env: Env, userId: string): Promise<string> {
  const token = randomToken();
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ? AND expires_at < ?').bind(userId, now),
    env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(
      await sha256(token),
      userId,
      now + SESSION_DAYS * 86_400_000,
    ),
  ]);
  return serializeCookie(SESSION_COOKIE, token, SESSION_DAYS * 86_400);
}

export async function getSessionUser(request: Request, env: Env): Promise<SessionUser | null> {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.picture, u.plan, u.plan_expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256(token), Date.now())
    .first<{ id: string; email: string; name: string; picture: string; plan: string; plan_expires_at: number | null }>();
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
    plan: effectivePlan(row.plan, row.plan_expires_at),
  };
}

/** Deletes the current session and returns a Set-Cookie header that clears it. */
export async function destroySession(request: Request, env: Env): Promise<string> {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  }
  return serializeCookie(SESSION_COOKIE, '', 0);
}
