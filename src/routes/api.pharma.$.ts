import { createFileRoute } from '@tanstack/react-router';
import { proxyRequest } from '@/api/proxy.server';

export const Route = createFileRoute('/api/pharma/$')({
  server: { handlers: { GET: ({ request, params }) => proxyRequest(request, params._splat ?? '') } },
});
