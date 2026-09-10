# Pharma Care API integration

## Configuration and language

`src/api/config.ts` is the only application source of the backend URL. Copy
`.env.example` to `.env.local` to override `VITE_PHARMA_API_BASE_URL` before
starting Vite or building. This is public configuration, not a place for secrets.

Every list/detail request explicitly sends `lang=ar` by default. `?lang=en`
selects English and `?lang=ar` selects Arabic. The root route retains language
across internal links. There was no existing language context or switch; URL
state provides both languages without adding a visible control. API content,
connected page headings, and request-state messages support both languages.
Unrelated marketing copy, header, footer, about, careers, and contact content
remain the original Arabic copy.

`VITE_PHARMA_API_MODE` supports:

- `auto` (default): browser requests use the same-origin TanStack Start proxy
  on both HTTP and HTTPS; server-side requests use the backend directly.
- `proxy`: force same-origin requests when an origin is not allowed by CORS.
- `direct`: only appropriate when browser protocol and backend CORS permit it.

The proxy requires the existing TanStack Start server deployment. It supports
only public GET endpoints documented in the YAML and images under the configured
backend's `/media/` path. It does not forward credentials or accept arbitrary
upstream URLs. Backend media uses the same proxy when necessary to avoid HTTP
image requests from an HTTPS page. No authentication was added.

## Connected pages

| Frontend | Backend |
| --- | --- |
| `/` category preview and product total | `/api/categories/`, `/api/products/` |
| `/products` category directory, search, filters, and counts | `/api/categories/`, `/api/products/` |
| `/products/category/{slug}` | `/api/categories/{slug}/`, `/api/products/` |
| `/products/{slug}` | `/api/products/{slug}/` |
| `/science` | `/api/blogs/`, `/api/blog-topics/` |
| `/science/{slug}` | `/api/blogs/{slug}/`, `/api/blog-topics/` |

The homepage retains four preview cards. Category card counts come from all
product pages; the English subtitle comes from the English category response.
Blog topic names/descriptions populate existing badges, with topic icons on
the new blog detail page. Blog list cards retain their original text-only layout;
the provided blog image appears on the detail page.

React Query caches by resource, language, page, and slug; requests are abortable
and have a timeout. Zod validates API responses against the YAML's required,
optional, and nullable fields. Missing/empty slugs do not produce broken detail
links. API strings are rendered as text, not injected as trusted HTML.

The API has no documented search or category/topic filter parameter. Categories
and products are fetched across all `next` pages before local search/filtering
and counting. Category grids and category product grids paginate locally in
groups of six. Blogs use the backend's `page`, `next`, and `previous` directly.
Blog topics are collected across all pages. Repeated page links are rejected.
`?page=N` preserves browser navigation for paginated views.

## Files created

- `.env.example`
- `API_INTEGRATION.md`
- `src/api/config.ts`
- `src/api/types.ts`
- `src/api/client.ts`
- `src/api/queries.ts`
- `src/api/proxy.server.ts`
- `src/lib/language.ts`
- `src/lib/pagination.ts`
- `src/lib/content.ts`
- `src/components/site/ApiImage.tsx`
- `src/components/site/ApiState.tsx`
- `src/components/site/ApiPagination.tsx`
- `src/components/site/DetailContent.tsx`
- `src/routes/api.pharma.$.ts`
- `src/routes/products_.category.$slug.tsx`
- `src/routes/products_.$slug.tsx`
- `src/routes/science_.$slug.tsx`
- `scripts/api-test-module.mjs`
- `scripts/test-api.mjs`
- `scripts/verify-api.mjs`
- `scripts/browser-smoke.mjs`

## Files modified

- `.gitignore`: ignore local verification artifacts.
- `vite.config.ts`: keep Vite cache outside `node_modules`; exclude temporary
  verification files from the dev watcher.
- `src/router.tsx`: register the router for typed navigation.
- `src/routes/__root.tsx`: shared URL language state and document language/direction.
- `src/routes/index.tsx`: API category preview and actual product total.
- `src/routes/products.tsx`: API category directory, search, counts, and pagination.
- `src/routes/science.tsx`: API blogs, topics, detail links, and pagination.
- `src/lib/products.ts`: replace mock category records with the API view adapter.
- `src/routeTree.gen.ts`: regenerated route definitions.

The supplied `Pharma Care API.yaml` was already untracked before this work and
was not modified. No dependencies were installed. Existing CSS, assets, header,
footer, about, careers, and contact files were not modified. Build outputs go to
`.verification/build`, not `dist`; dependency caches go to `.verification`.

## Verification

Commands (from `pharma`):

```powershell
node node_modules/typescript/bin/tsc --noEmit
node scripts/test-api.mjs
node scripts/verify-api.mjs
node node_modules/vite/bin/vite.js build --outDir .verification/build --configLoader runner
```

`test-api.mjs` checks multi-page collection, language propagation, missing/nullable
fields, malformed responses, empty results, 404/network errors, page selection,
image URL handling, and proxy path restrictions. It uses existing build tooling
without writing into `node_modules`.

`verify-api.mjs` checks both languages on all four list endpoints, representative
category/product/blog detail endpoints, and representative media responses.

For the browser test, run the dev server on localhost:5173 with
`--configLoader runner`, then `node scripts/browser-smoke.mjs`. Chrome runs headless
with an isolated profile under `.verification`. `CHROME_PATH` and `SMOKE_BASE_URL`
can override the local browser executable and test site. The live dataset must
contain categories with products and blogs with slugs. Tests cover language
retention through category/product links, blog details, images, 404 handling,
empty search, and mobile overflow. A screenshot is saved under `.verification`.

## API observations and remaining static data

On 2026-09-05 the API returned 5 categories, 12 products, 3 blog topics, and 6 blogs.
All responses checked matched the integration schemas, and public requests
succeeded without credentials. All live lists currently fit in one backend page;
multi-page behavior is additionally exercised with controlled test responses.

CORS allowed `http://localhost:5173` and `http://localhost:3000`. A request using
the test origin `https://pharmacare.example` received no allow-origin header; the
actual production domain was not supplied. HTTPS access to the backend IP timed
out. API image URLs also use HTTP. Browser requests now use the same-origin
proxy by default, including HTTP previews and alternate local ports, so they
do not depend on backend CORS configuration.

The backend currently serves seeded `demo-*` records and demo images, including
article text explicitly describing temporary content. These are live API records,
not retained frontend mocks.

Static frontend content without matching endpoints remains: company marketing,
hero/team imagery, certifications, experience/staff/export statistics, about
content, careers listings/buttons, contact details and form behavior, and
social/YouTube placeholder links. The contact form still only shows a local
confirmation; the YAML documents no submission endpoint. Category mock records
and the static article array were removed from the data flow.

The build reports the existing Google Fonts CSS `@import` ordering warning.
`src/styles.css` was intentionally left unchanged to preserve the existing design.

Final results: TypeScript, production client/server build, API tests, live schema
checks, and browser smoke tests passed. Browser checks passed both with direct
requests on localhost:5173 and with forced proxy mode on localhost:3000. The
TanStack server proxy was also checked directly for real JSON and image responses.
No uncaught browser errors were recorded. ESLint's code checks passed on the
integration files with formatting enforcement disabled.

After changing automatic browser routing to the proxy, TypeScript, API tests,
and the browser smoke suite passed on `http://127.0.0.1:4175` in default mode.
The browser suite verified products, science articles, detail navigation,
images, empty search, missing content, and mobile width.
