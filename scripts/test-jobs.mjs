import assert from 'node:assert/strict';
import { loadModule } from './api-test-module.mjs';

const client = await loadModule('src/api/client.ts');
const { jobSchema } = await loadModule('src/api/types.ts');
const { proxyRequest } = await loadModule('src/api/proxy.server.ts');
const department = { id: '00000000-0000-4000-8000-000000000001', slug: 'quality', name: 'Quality' };
const job = {
  id: '00000000-0000-4000-8000-000000000002', slug: 'quality-officer', reference_code: 'QA-01',
  department, title: 'Quality officer', description: 'Job description', requirements: 'Requirements',
  location: { code: 'adra', name: 'Adra' }, employment_type: { code: 'full_time', name: 'Full time' },
  workplace_type: { code: 'onsite', name: 'On site' }, meta_title: '', meta_description: '',
};
const realFetch = globalThis.fetch;
try {
  let pages = 0;
  globalThis.fetch = async url => {
    const request = new URL(url);
    assert.equal(request.searchParams.get('lang'), 'en');
    pages++;
    const second = request.searchParams.get('page') === '2';
    return Response.json({ count: 2, next: second ? null : 'https://example.org/api/jobs/?page=2', results: [{ ...job, id: second ? department.id : job.id }] });
  };
  assert.equal((await client.getAll('jobs', 'en')).length, 2);
  assert.equal(pages, 2);
  globalThis.fetch = async () => Response.json(job);
  assert.equal((await client.getDetail('jobs', job.slug, 'ar')).reference_code, 'QA-01');
  assert.equal(jobSchema.safeParse({ ...job, location: 'Adra' }).success, false);
  globalThis.fetch = async () => Response.json({ count: 0, results: [] });
  assert.deepEqual(await client.getAll('jobs', 'ar'), []);
  globalThis.fetch = async () => new Response(null, { status: 404 });
  await assert.rejects(client.getDetail('jobs', 'missing', 'ar'), error => error.status === 404);
  globalThis.fetch = async () => Response.json({ count: 1, results: [department] });
  assert.equal((await client.getAll('job-departments', 'ar'))[0].name, 'Quality');
  for (const path of ['api/jobs/', 'api/jobs/quality-officer/', 'api/job-departments/']) {
    assert.equal((await proxyRequest(new Request(`https://site.example/${path}`), path)).status, 200);
  }
  for (const path of ['api/job-departments/quality/', 'api/jobs/quality/apply/', 'api/jobs/../admin']) {
    assert.equal((await proxyRequest(new Request('https://site.example/'), path)).status, 404);
  }
  console.log('PASS: jobs pagination, languages, detail, departments, invalid payload, empty/404 states, proxy routes.');
} finally { globalThis.fetch = realFetch; }
