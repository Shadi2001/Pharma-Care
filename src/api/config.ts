// Public backend configuration; override at build time with .env.local.
export const API_BASE_URL = (import.meta.env.VITE_PHARMA_API_BASE_URL || "http://72.62.93.207").replace(/\/+$/, "");
export const API_MODE = import.meta.env.VITE_PHARMA_API_MODE || "auto";
export const PROXY_PREFIX = "/api/pharma";

export function shouldProxyApi(): boolean {
  if (API_MODE === "proxy") return true;
  if (API_MODE === "direct") return false;
  // Browser requests use our server on every origin, including HTTP previews
  // and alternate local ports that the backend may not allow through CORS.
  // Server-side callers need the absolute upstream URL.
  return typeof window !== "undefined";
}

export function apiImageUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, `${API_BASE_URL}/`);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    if (shouldProxyApi() && url.origin === new URL(API_BASE_URL).origin && url.pathname.startsWith('/media/')) {
      return `${PROXY_PREFIX}${url.pathname}${url.search}`;
    }
    return url.href;
  } catch { return undefined; }
}
