import { PLAN_LIMITS } from './plans';
import { THEME_IDS } from './themes';
import type { LinkItem, Plan, ProfileInput, ThemeId } from './types';

export const LIMITS = {
  name: 60,
  bio: 160,
  linkTitle: 80,
  url: 2048,
  /** Uploaded avatars are resized to 256px in the browser; this is a safety cap. */
  avatarDataUri: 200_000,
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Accepts http(s), mailto and tel links. Bare domains get https:// added.
 * Everything else (javascript:, data:, etc.) is rejected.
 */
export function normalizeUrl(raw: string): string | null {
  let s = raw.trim();
  if (!s || s.length > LIMITS.url) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol === 'mailto:' || u.protocol === 'tel:') return u.toString();
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (!u.hostname.includes('.')) return null;
  return u.toString();
}

function validateAvatar(raw: string): string | null {
  if (raw === '') return '';
  if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(raw)) {
    return raw.length <= LIMITS.avatarDataUri ? raw : null;
  }
  const url = normalizeUrl(raw);
  return url && url.startsWith('https://') ? url : null;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

export function validateProfile(input: unknown, plan: Plan): Result<ProfileInput> {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Invalid request.' };
  const body = input as Record<string, unknown>;
  const limits = PLAN_LIMITS[plan];

  const name = str(body.name).trim();
  const bio = str(body.bio).trim();
  if (name.length > LIMITS.name) return { ok: false, error: `Name must be ${LIMITS.name} characters or less.` };
  if (bio.length > LIMITS.bio) return { ok: false, error: `Bio must be ${LIMITS.bio} characters or less.` };

  const avatar = validateAvatar(str(body.avatar).trim());
  if (avatar === null) return { ok: false, error: 'Avatar must be an https:// image URL or an uploaded image.' };

  const theme = str(body.theme) as ThemeId;
  if (!THEME_IDS.includes(theme)) return { ok: false, error: 'Unknown theme.' };
  if (!limits.themes.includes(theme)) return { ok: false, error: 'That theme is part of TripTree Pro.' };

  if (!Array.isArray(body.links)) return { ok: false, error: 'Invalid links.' };
  if (body.links.length > limits.maxLinks) {
    return {
      ok: false,
      error: plan === 'free'
        ? `The Free plan allows up to ${limits.maxLinks} links. Upgrade to Pro for more.`
        : `You can add up to ${limits.maxLinks} links.`,
    };
  }

  const links: LinkItem[] = [];
  const seen = new Set<string>();
  for (const [i, raw] of body.links.entries()) {
    const link = (raw ?? {}) as Record<string, unknown>;
    const id = str(link.id);
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(id) || seen.has(id)) return { ok: false, error: 'Invalid link id.' };
    seen.add(id);

    const title = str(link.title).trim();
    if (!title) return { ok: false, error: `Link ${i + 1} needs a title.` };
    if (title.length > LIMITS.linkTitle) {
      return { ok: false, error: `Link titles must be ${LIMITS.linkTitle} characters or less.` };
    }
    const url = normalizeUrl(str(link.url));
    if (!url) return { ok: false, error: `"${title}" has an invalid URL.` };

    links.push({ id, title, url, enabled: link.enabled !== false });
  }

  return { ok: true, value: { name, bio, avatar, theme, links } };
}
