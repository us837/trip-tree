import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ProfileView } from '../components/ProfileView';
import { PLAN_LIMITS } from '../src/lib/plans';
import { normalizeSlug, validateSlug } from '../src/lib/slug';
import type { Env } from '../src/server/env';
import { today } from '../src/server/http';
import { getPublicProfile } from '../src/server/profiles';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

interface Shell {
  htmlClass: string;
  bodyClass: string;
  /** Stylesheet, font preload and icon <link> tags from the Next.js build */
  links: string;
  html: string;
}

// The exported /p page carries the hashed CSS/font URLs of the current build.
// Parsed once per isolate; a new deploy starts fresh isolates.
let shellCache: Shell | null = null;

async function getShell(env: Env, requestUrl: string): Promise<Shell> {
  if (shellCache) return shellCache;
  const html = await (await env.ASSETS.fetch(new URL('/p', requestUrl))).text();
  const links = (html.match(/<link [^>]*>/g) ?? [])
    .filter((tag) => /rel="(stylesheet|icon|apple-touch-icon)"|as="font"/.test(tag))
    .join('');
  shellCache = {
    htmlClass: /<html[^>]*class="([^"]*)"/.exec(html)?.[1] ?? '',
    bodyClass: /<body[^>]*class="([^"]*)"/.exec(html)?.[1] ?? '',
    links,
    html,
  };
  return shellCache;
}

// Counts link taps without delaying navigation. Covers normal and middle clicks.
const clickScript = (slug: string) =>
  `(function(){function t(e){var a=e.target.closest&&e.target.closest('a[data-link-id]');` +
  `if(a&&navigator.sendBeacon)navigator.sendBeacon('/api/click',new Blob([JSON.stringify({slug:${JSON.stringify(slug)},linkId:a.getAttribute('data-link-id')})],{type:'application/json'}))}` +
  `document.addEventListener('click',t);document.addEventListener('auxclick',t)})();`;

// Serves triptree.../<username> as fully server-rendered HTML.
export const onRequestGet: PagesFunction<Env, 'slug'> = async (ctx) => {
  const { env, request, params } = ctx;
  const slug = normalizeSlug(String(params.slug));
  if (validateSlug(slug)) return ctx.next();

  const [page, shell] = await Promise.all([getPublicProfile(env, slug), getShell(env, request.url)]);

  // A valid but unclaimed name: show the "claim it" page with a 404 status.
  if (!page) {
    return new Response(shell.html, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  ctx.waitUntil(
    env.DB.prepare(
      `INSERT INTO page_views (user_id, day, count) VALUES (?, ?, 1)
       ON CONFLICT (user_id, day) DO UPDATE SET count = count + 1`,
    )
      .bind(page.userId, today())
      .run(),
  );

  const { name, bio } = page.profile;
  const title = escapeHtml(`${name || `@${slug}`} | TripTree`);
  const description = escapeHtml(bio || `Links from ${name || slug}`);
  const body = renderToString(
    createElement(ProfileView, { profile: page.profile, showBranding: PLAN_LIMITS[page.plan].branding }),
  );

  const html =
    `<!DOCTYPE html><html lang="en" class="${shell.htmlClass}"><head>` +
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${title}</title>` +
    `<meta name="description" content="${description}">` +
    `<meta property="og:title" content="${title}">` +
    `<meta property="og:description" content="${description}">` +
    `<meta property="og:type" content="profile">` +
    `<meta property="og:url" content="${escapeHtml(new URL(`/${slug}`, request.url).toString())}">` +
    shell.links +
    `</head><body class="${shell.bodyClass}"><main>${body}</main>` +
    `<script>${clickScript(slug)}</script></body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
