import assert from 'node:assert/strict';
import { loadModule } from './api-test-module.mjs';

const { resourceSchemas, paginatedSchema } = await loadModule('src/api/types.ts');
const { API_BASE_URL } = await loadModule('src/api/config.ts', process.env);
for (const lang of ['ar', 'en']) {
  for (const resource of Object.keys(resourceSchemas)) {
    const response = await fetch(`${API_BASE_URL}/api/${resource}/?lang=${lang}`, { headers: { Origin: 'http://localhost:5173' }, signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200);
    const data = paginatedSchema(resourceSchemas[resource]).parse(await response.json());
    console.log(`${resource} (${lang}): schema OK; count=${data.count}; next=${data.next}; CORS=${response.headers.get('access-control-allow-origin')}`);
    const first = data.results.find(item => item.slug);
    if (first && resource !== 'blog-topics') {
      const detail = await fetch(`${API_BASE_URL}/api/${resource}/${first.slug}/?lang=${lang}`, { signal: AbortSignal.timeout(20000) });
      assert.equal(detail.status, 200);
      assert.equal(resourceSchemas[resource].parse(await detail.json()).id, first.id);
      console.log(`  detail by slug: OK`);
    }
    const image = first?.image ?? first?.icon;
    if (image) {
      const asset = await fetch(image, { signal: AbortSignal.timeout(20000) });
      assert.equal(asset.status, 200);
      assert.ok(asset.headers.get('content-type')?.startsWith('image/'));
      await asset.body?.cancel();
      console.log('  representative image: OK');
    }
  }
}
