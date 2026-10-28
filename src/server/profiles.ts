import { effectivePlan } from '../lib/plans';
import type { LinkItem, Plan, Profile, ThemeId } from '../lib/types';
import type { Env } from './env';

interface ProfileRow {
  slug: string;
  name: string;
  bio: string;
  avatar: string;
  theme: string;
  links: string;
}

const PROFILE_COLUMNS = 'p.slug, p.name, p.bio, p.avatar, p.theme, p.links';

function toProfile(row: ProfileRow): Profile {
  let links: LinkItem[] = [];
  try {
    links = JSON.parse(row.links);
  } catch {
    // A corrupt row should not take the page down; show it without links.
  }
  return {
    slug: row.slug,
    name: row.name,
    bio: row.bio,
    avatar: row.avatar,
    theme: row.theme as ThemeId,
    links,
  };
}

export async function getProfileByUser(env: Env, userId: string): Promise<Profile | null> {
  const row = await env.DB.prepare(`SELECT ${PROFILE_COLUMNS} FROM profiles p WHERE p.user_id = ?`)
    .bind(userId)
    .first<ProfileRow>();
  return row ? toProfile(row) : null;
}

export async function getPublicProfile(
  env: Env,
  slug: string,
): Promise<{ userId: string; plan: Plan; profile: Profile } | null> {
  const row = await env.DB.prepare(
    `SELECT ${PROFILE_COLUMNS}, p.user_id, u.plan, u.plan_expires_at
     FROM profiles p JOIN users u ON u.id = p.user_id
     WHERE p.slug = ?`,
  )
    .bind(slug)
    .first<ProfileRow & { user_id: string; plan: string; plan_expires_at: number | null }>();
  if (!row) return null;
  return { userId: row.user_id, plan: effectivePlan(row.plan, row.plan_expires_at), profile: toProfile(row) };
}
