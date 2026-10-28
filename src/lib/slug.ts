// Usernames become top-level paths (triptree.../name), so they must never
// shadow a site page or an asset path.
export const RESERVED_SLUGS = new Set([
  'api', 'p', 'login', 'logout', 'signup', 'register', 'dashboard', 'settings', 'account',
  'features', 'integrations', 'pricing', 'resources', 'guide', 'help', 'support', 'docs', 'blog',
  'terms', 'privacy', 'refund', 'contact', 'about', 'admin', 'app', 'www', 'mail', 'static',
  'assets', 'brand', 'icon', 'favicon', 'triptree', 'index', 'home', 'null', 'undefined',
]);

const SLUG_RE = /^[a-z0-9](?:[a-z0-9_-]{1,28})[a-z0-9]$/;

export function normalizeSlug(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Returns an error message, or null when the slug is valid. */
export function validateSlug(slug: string): string | null {
  if (slug.length < 3 || slug.length > 30) return 'Use 3 to 30 characters.';
  if (!SLUG_RE.test(slug)) {
    return 'Use lowercase letters, numbers, "-" or "_", starting and ending with a letter or number.';
  }
  if (RESERVED_SLUGS.has(slug)) return 'That name is reserved.';
  return null;
}
