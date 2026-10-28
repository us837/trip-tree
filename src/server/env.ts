export interface Env {
  DB: D1Database;
  /** Static assets of the Pages deployment (the Next.js export in out/) */
  ASSETS: Fetcher;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}
