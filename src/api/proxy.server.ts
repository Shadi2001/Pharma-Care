import { API_BASE_URL } from './config';

// Only public documented GET endpoints and the configured backend's media.
// Never forward cookies/authorization or accept arbitrary upstream URLs.
export async function proxyRequest(request: Request, path: string): Promise<Response> {
  const apiPath = /^api\/(?:categories|products|blogs)(?:\/[-a-zA-Z0-9_]{1,255})?\/?$/.test(path) || /^api\/blog-topics\/?$/.test(path);
  const mediaPath = /^media\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:jpe?g|png|webp|gif|avif|svg|ico)$/i.test(path) && !path.includes('..');
  if (!apiPath && !mediaPath) return new Response('Not found', { status: 404 });
  const incoming = new URL(request.url);
  const upstream = new URL(`${API_BASE_URL}/${path.replace(/\/$/, '')}${apiPath ? '/' : ''}`);
  if (apiPath) {
    const lang = incoming.searchParams.get('lang') ?? 'ar';
    const page = incoming.searchParams.get('page');
    if (!['ar', 'en'].includes(lang) || (page !== null && !/^[1-9]\d*$/.test(page))) return new Response('Invalid query', { status: 400 });
    upstream.searchParams.set('lang', lang);
    if (page !== null) upstream.searchParams.set('page', page);
  }
  try {
    const result = await fetch(upstream, {
      headers: { Accept: apiPath ? 'application/json' : 'image/*' },
      redirect: 'error', signal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]),
    });
    const type = result.headers.get('content-type') ?? '';
    if (!result.ok) {
      await result.body?.cancel();
      return Response.json({ detail: 'Upstream request failed.' }, { status: result.status });
    }
    if (apiPath ? !type.includes('application/json') : !type.startsWith('image/')) {
      await result.body?.cancel();
      return new Response('Unexpected upstream content', { status: 502 });
    }
    return new Response(result.body, {
      status: result.status,
      headers: {
        'Content-Type': type, 'X-Content-Type-Options': 'nosniff',
        'Cache-Control': mediaPath ? 'public, max-age=3600' : 'no-cache',
        ...(mediaPath ? { 'Content-Security-Policy': "default-src 'none'; sandbox" } : {}),
      },
    });
  } catch { return Response.json({ detail: 'Backend unavailable.' }, { status: 502 }); }
}
