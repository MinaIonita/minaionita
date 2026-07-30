import type { NextConfig } from "next";

/**
 * Static security headers (brief §7). The CSP is not here — it carries a
 * per-request nonce and lives in proxy.ts.
 */
const securityHeaders = [
  // Stops MIME sniffing from turning a served file into an executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // CSP frame-ancestors covers modern browsers; this is the legacy equivalent.
  { key: "X-Frame-Options", value: "DENY" },
  // Origin only cross-site, full URL same-site: referrer attribution keeps
  // working without leaking admin paths or query strings to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs these APIs; denying them shrinks what an injected script
  // could reach for.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Two years, subdomains included, preload-eligible. Ignored over plain http,
  // so it is harmless in local development.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework and version to anyone scanning for exploits.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
