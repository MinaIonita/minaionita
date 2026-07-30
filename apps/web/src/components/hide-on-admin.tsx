"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site chrome (header, footer, contact dock, cookie bar) on
 * routes that own the full viewport.
 *
 * /admin has its own bare layout; without this the public header and footer
 * bleed into every admin page. /test is the cinematic experiment — cream chrome
 * framing a full-bleed dark story breaks the effect on the first frame, and the
 * page provides its own way back to the site.
 *
 * Server-component children (e.g. the footer) render fine when passed through a
 * client wrapper.
 */
const BARE_ROUTES = ["/admin", "/test"];

export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (BARE_ROUTES.some((r) => path?.startsWith(r))) return null;
  return <>{children}</>;
}
