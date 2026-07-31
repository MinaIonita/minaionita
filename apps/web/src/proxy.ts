import { type NextRequest, NextResponse } from "next/server";

/**
 * Content-Security-Policy with a per-request nonce (brief §7).
 *
 * In this version of Next.js the file is `proxy.ts`, not `middleware.ts`. Next
 * parses the CSP header it receives and attaches the nonce to its own framework
 * and page scripts automatically, so only our own inline script needs the
 * `nonce` prop passed explicitly.
 */
/**
 * The admin panel is a client component that calls the API directly, so the
 * API's origin has to be allowed in connect-src.
 *
 * `'self'` alone silently broke every admin login: the browser refused the
 * cross-origin request to :4000 with "Failed to fetch" while curl to the same
 * URL succeeded. In production this bites whenever the API is on a subdomain
 * rather than proxied under the same host — so the origin is derived from the
 * same env var the client uses, instead of being hardcoded.
 */
function apiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const api = apiOrigin();

  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' lets a nonce'd script load further scripts — which is how
    // a GTM container will work once one is configured, without reopening the
    // policy to arbitrary inline code.
    // React uses eval in development to rebuild server stacks; production does not.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // 'unsafe-inline' here is deliberate and is about style *attributes*: the
    // design sets them all over (animation delays, safe-area padding, display
    // weights) and CSP3 governs those with style-src-attr, which falls back to
    // style-src. Locking this down would blank out the layout, and an inline
    // style cannot execute code — the risk it carries is not the risk CSP is for.
    "style-src 'self' 'unsafe-inline'",
    // next/font self-hosts Cormorant and Inter at build time, so no Google origin.
    "font-src 'self'",
    "img-src 'self' blob: data:",
    "media-src 'self'",
    `connect-src 'self'${api && api !== request.nextUrl.origin ? ` ${api}` : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Static assets and image optimisation don't need a document policy, and
      // prefetches would burn a nonce on a response that is never rendered.
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
