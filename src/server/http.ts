export function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  const h = new Headers(headers);
  h.set('Cache-Control', 'no-store');
  return Response.json(data, { status, headers: h });
}

export function errorJson(error: string, status: number): Response {
  return json({ error }, status);
}

export function redirect(location: string, headers?: HeadersInit): Response {
  const h = new Headers(headers);
  h.set('Location', location);
  return new Response(null, { status: 302, headers: h });
}

export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export function serializeCookie(name: string, value: string, maxAgeSeconds: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

/**
 * Mutating endpoints only accept requests from our own pages. Together with
 * SameSite=Lax session cookies this blocks cross-site request forgery.
 */
export function isSameOrigin(request: Request): boolean {
  return request.headers.get('Origin') === new URL(request.url).origin;
}

export async function readJson(request: Request, maxBytes = 300_000): Promise<unknown> {
  const text = await request.text();
  if (text.length > maxBytes) throw new Error('Request too large');
  return JSON.parse(text);
}

export function today(offsetDays = 0): string {
  return new Date(Date.now() - offsetDays * 86_400_000).toISOString().slice(0, 10);
}
