import assert from 'node:assert/strict';
import { loadModule } from './api-test-module.mjs';

const client = await loadModule('src/api/client.ts');
const schemas = await loadModule('src/api/types.ts');
const config = await loadModule('src/api/config.ts');
const proxy = await loadModule('src/api/proxy.server.ts');
const pagination = await loadModule('src/lib/pagination.ts');
const realFetch = globalThis.fetch;
const category = { id: '00000000-0000-4000-8000-000000000001', name: 'Category', description: '', slug: '', image: null };
let requests = [];
try {
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), options });
    const page = new URL(url).searchParams.get('page');
    return Response.json({ count: 2, next: page === '1' ? `${config.API_BASE_URL}/api/categories/?page=2` : null, previous: page === '2' ? `${config.API_BASE_URL}/api/categories/` : null, results: [{ ...category, id: page === '1' ? category.id : '00000000-0000-4000-8000-000000000002' }] });
  };
  assert.equal((await client.getAll('categories', 'ar')).length, 2);
  assert.equal(requests.length, 2);
  assert.ok(requests.every(({ url, options }) => new URL(url).searchParams.get('lang') === 'ar' && options.credentials === 'omit'));
  assert.equal(client.pageFromLink(`${config.API_BASE_URL}/api/blogs/`), 1);
  assert.throws(() => client.pageFromLink(`${config.API_BASE_URL}/api/blogs/?page=0`));

  globalThis.fetch = async () => Response.json({ count: 1, results: [category], next: `${config.API_BASE_URL}/api/categories/?page=1` });
  await assert.rejects(client.getAll('categories', 'en'), /repeated pagination/);
  globalThis.fetch = async () => Response.json({ results: [] });
  await assert.rejects(client.getPage('products', 'ar'), /schema/);
  globalThis.fetch = async () => Response.json({ count: 0, next: null, previous: null, results: [] });
  assert.deepEqual(await client.getAll('products', 'ar'), []);
  globalThis.fetch = async () => new Response('', { status: 404 });
  await assert.rejects(client.getDetail('products', 'missing', 'ar'), error => error.status === 404);
  globalThis.fetch = async () => { throw new TypeError('Network unavailable'); };
  await assert.rejects(client.getPage('blogs', 'ar'), /Unable to load/);
  assert.equal(schemas.categorySchema.safeParse(category).success, true);
  assert.equal(schemas.productSchema.safeParse(category).success, false);

  const set = Array.from({ length: 14 }, (_, i) => i);
  assert.deepEqual(pagination.paginate(set, 2).items, [6, 7, 8, 9, 10, 11]);
  assert.equal(pagination.paginate(set, 999).page, 3);
  assert.equal(pagination.pageSearch({ page: -1 }).page, 1);
  assert.equal(config.shouldProxyApi(), false);
  globalThis.window = { location: { protocol: 'http:', origin: 'http://localhost:4173' } };
  assert.equal(config.shouldProxyApi(), true);
  let browserRequest;
  globalThis.fetch = async url => { browserRequest = String(url); return Response.json({ count: 0, results: [] }); };
  await client.getPage('products', 'ar');
  assert.equal(browserRequest, '/api/pharma/api/products/?lang=ar&page=1');
  globalThis.window = { location: { protocol: 'https:' } };
  assert.equal(config.shouldProxyApi(), true);
  assert.equal(config.apiImageUrl(`${config.API_BASE_URL}/media/example.jpg`), '/api/pharma/media/example.jpg');
  assert.equal(config.apiImageUrl('javascript:alert(1)'), undefined);
  delete globalThis.window;

  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(new URL(url).searchParams.get('lang'), 'ar');
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.headers.Cookie, undefined);
    return Response.json({ count: 0, results: [] });
  };
  assert.equal((await proxy.proxyRequest(new Request('https://site.example/api/pharma/api/categories/?lang=ar'), 'api/categories/')).status, 200);
  for (const path of ['https://evil.example', 'api/admin/', 'media/../secret.jpg', 'api/blog-topics/some-slug']) {
    assert.equal((await proxy.proxyRequest(new Request('https://site.example/'), path)).status, 404);
  }
  assert.equal(calls, 1);
  assert.equal((await proxy.proxyRequest(new Request('https://site.example/?lang=xx'), 'api/products/')).status, 400);
  console.log('PASS: pagination, explicit language, public access, schema validation, empty/error states, image URLs, proxy allowlist.');
} finally { globalThis.fetch = realFetch; delete globalThis.window; }
