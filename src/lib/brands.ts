import {
  siBehance, siBluesky, siBuymeacoffee, siCalendly, siDiscord, siDribbble, siEtsy, siFacebook,
  siGithub, siGumroad, siInstagram, siKofi, siMedium, siNotion, siPatreon, siPinterest, siReddit,
  siSnapchat, siSoundcloud, siSpotify, siSubstack, siTelegram, siThreads, siTiktok, siTwitch,
  siVimeo, siWhatsapp, siX, siYoutube, siApplemusic,
} from 'simple-icons';

export interface BrandInfo {
  name: string;
  color: string;
  /** 24x24 SVG path; missing for brands without a simple-icons glyph */
  path?: string;
}

interface BrandRule extends BrandInfo {
  hosts: string[];
}

const icon = (si: { title: string; hex: string; path: string }, hosts: string[], name = si.title): BrandRule => ({
  name,
  color: `#${si.hex}`,
  path: si.path,
  hosts,
});

export const BRANDS: BrandRule[] = [
  icon(siInstagram, ['instagram.com', 'instagr.am']),
  icon(siYoutube, ['youtube.com', 'youtu.be']),
  icon(siX, ['x.com', 'twitter.com'], 'X'),
  { name: 'LinkedIn', color: '#0A66C2', hosts: ['linkedin.com', 'lnkd.in'] },
  icon(siTiktok, ['tiktok.com']),
  icon(siFacebook, ['facebook.com', 'fb.com', 'fb.me']),
  icon(siThreads, ['threads.net', 'threads.com']),
  icon(siBluesky, ['bsky.app']),
  icon(siSnapchat, ['snapchat.com']),
  icon(siPinterest, ['pinterest.com', 'pin.it']),
  icon(siReddit, ['reddit.com']),
  icon(siWhatsapp, ['wa.me', 'whatsapp.com']),
  icon(siTelegram, ['t.me', 'telegram.me', 'telegram.org']),
  icon(siDiscord, ['discord.gg', 'discord.com']),
  icon(siTwitch, ['twitch.tv']),
  icon(siSpotify, ['spotify.com']),
  icon(siApplemusic, ['music.apple.com']),
  icon(siSoundcloud, ['soundcloud.com']),
  icon(siVimeo, ['vimeo.com']),
  icon(siGithub, ['github.com']),
  icon(siBehance, ['behance.net']),
  icon(siDribbble, ['dribbble.com']),
  icon(siMedium, ['medium.com']),
  icon(siSubstack, ['substack.com']),
  icon(siNotion, ['notion.so', 'notion.site']),
  icon(siGumroad, ['gumroad.com']),
  icon(siBuymeacoffee, ['buymeacoffee.com'], 'Buy Me a Coffee'),
  icon(siKofi, ['ko-fi.com']),
  icon(siPatreon, ['patreon.com']),
  icon(siEtsy, ['etsy.com']),
  icon(siCalendly, ['calendly.com']),
];

const WEBSITE: BrandInfo = { name: 'Website', color: '#6366F1' };

export function getBrandMeta(url: string): BrandInfo {
  if (url.startsWith('mailto:')) return { name: 'Email', color: '#EA4335' };
  if (url.startsWith('tel:')) return { name: 'Phone', color: '#16A34A' };

  let host: string;
  try {
    host = new URL(url.includes('://') ? url : `https://${url}`).hostname.toLowerCase();
  } catch {
    return WEBSITE;
  }

  // Match the host or any subdomain of it, so "netflix.com" never matches "x.com".
  const brand = BRANDS.find((b) => b.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
  return brand ?? WEBSITE;
}
