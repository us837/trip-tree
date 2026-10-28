# TripTree

A link-in-bio app. Users sign in with Google, claim a username and get a page at
`triptree.ujwalsharma.space/<username>` with themes, a QR code and click analytics.

Runs entirely on Cloudflare's free tier:

| Part | What | Where |
| --- | --- | --- |
| Site, login, dashboard | Next.js static export (`out/`) | `app/`, `components/` |
| API + public pages | Cloudflare Pages Functions | `functions/`, `src/server/` |
| Database | Cloudflare D1 (SQLite) | `migrations/` |

`functions/[slug].ts` server-renders public profiles with the same `ProfileView`
component the dashboard preview uses. `public/_routes.json` keeps static pages and
`/_next/*` assets from invoking Functions, so they don't count against the free
request quota.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars        # then fill in Google OAuth credentials
npm run db:migrate:local
npm run preview                        # builds, then serves site + API on http://localhost:8788
```

`npm run dev` still works for UI-only work on the marketing pages, but `/api/*`,
login and public profiles need `npm run preview`.

Checks: `npm run lint`, `npx tsc --noEmit`, `npm run typecheck:functions`.

## One-time production setup

1. **D1 database**
   ```bash
   npx wrangler login
   npx wrangler d1 create triptree      # copy the database_id into wrangler.toml
   npm run db:migrate:remote
   ```
2. **Google OAuth**: in Google Cloud Console → APIs & Services → Credentials, create an
   *OAuth client ID* (Web application) with these authorised redirect URIs:
   - `https://triptree.ujwalsharma.space/api/auth/callback`
   - `http://localhost:8788/api/auth/callback`
3. **Pages project**: in Cloudflare → Workers & Pages → your project → Settings:
   - Build command `npm run build`, output directory `out`.
   - Variables and Secrets: add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (as secrets).
   - `name` in `wrangler.toml` must match the Pages project name.
4. **Domain**: Custom domains → add `triptree.ujwalsharma.space`, then create the CNAME
   it shows you at Hostinger DNS (pointing to `<project>.pages.dev`).

## Plans

Limits live in `src/lib/plans.ts`. Payments are not wired up yet
(`PAYMENTS_ENABLED = false`). To give someone Pro by hand:

```bash
npx wrangler d1 execute triptree --remote \
  --command "UPDATE users SET plan='pro', plan_expires_at=NULL WHERE email='someone@example.com'"
```
