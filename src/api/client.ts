import { API_BASE_URL, PROXY_PREFIX, shouldProxyApi } from "./config";
import { paginatedSchema, resourceSchemas, type Language, type Paginated, type Resource, type Resources } from "./types";

export class ApiError extends Error {
  constructor(message: string, public status = 0) { super(message); this.name = 'ApiError'; }
}

async function request(path: string, lang: Language, page?: number, signal?: AbortSignal): Promise<unknown> {
  const query = new URLSearchParams({ lang });
  if (page !== undefined) query.set('page', String(page));
  const base = shouldProxyApi() ? PROXY_PREFIX : API_BASE_URL;
  try {
    const response = await fetch(`${base}/api/${path}/?${query}`, {
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000),
      credentials: 'omit', headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new ApiError(`API request failed (${response.status})`, response.status);
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError || signal?.aborted) throw error;
    throw new ApiError('Unable to load API data.');
  }
}

export async function getPage<K extends Resource>(resource: K, lang: Language, page = 1, signal?: AbortSignal): Promise<Paginated<Resources[K]>> {
  if (!Number.isSafeInteger(page) || page < 1) throw new ApiError('Invalid page number.');
  const parsed = paginatedSchema(resourceSchemas[resource]).safeParse(await request(resource, lang, page, signal));
  if (!parsed.success) throw new ApiError('API response does not match the documented schema.');
  return parsed.data as Paginated<Resources[K]>;
}

export function pageFromLink(link?: string | null): number | undefined {
  if (!link) return undefined;
  const raw = new URL(link, API_BASE_URL).searchParams.get('page');
  const page = raw === null ? 1 : Number(raw);
  if (!Number.isSafeInteger(page) || page < 1) throw new ApiError('Invalid API pagination link.');
  return page;
}

// Search/filter/count endpoints are not documented. Collect every page before
// filtering, so a result on a later backend page is never silently omitted.
export async function getAll<K extends Resource>(resource: K, lang: Language, signal?: AbortSignal): Promise<Resources[K][]> {
  const records = new Map<string, Resources[K]>();
  const visited = new Set<number>();
  let page: number | undefined = 1;
  while (page !== undefined) {
    if (visited.has(page)) throw new ApiError('The API returned a repeated pagination link.');
    visited.add(page);
    const data = await getPage(resource, lang, page, signal);
    data.results.forEach(item => records.set(item.id, item));
    page = pageFromLink(data.next);
  }
  return [...records.values()];
}

export async function getDetail<K extends Exclude<Resource, 'blog-topics'>>(resource: K, slug: string, lang: Language, signal?: AbortSignal): Promise<Resources[K]> {
  if (!/^[-a-zA-Z0-9_]{1,255}$/.test(slug)) throw new ApiError('Not found.', 404);
  const parsed = resourceSchemas[resource].safeParse(await request(`${resource}/${encodeURIComponent(slug)}`, lang, undefined, signal));
  if (!parsed.success) throw new ApiError('API response does not match the documented schema.');
  return parsed.data as Resources[K];
}
