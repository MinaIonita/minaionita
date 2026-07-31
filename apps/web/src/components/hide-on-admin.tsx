"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site chrome (header, footer, contact dock, cookie bar) on
 * routes that own the full viewport.
 *
 * /administrare has its own bare layout; without this the public header and footer
 * bleed into every admin page. /poveste is the scroll-told story — cream chrome
 * framing a full-bleed dark narrative breaks the effect on the first frame, and
 * the page carries its own index of every other page at the end.
 *
 * Server-component children (e.g. the footer) render fine when passed through a
 * client wrapper.
 */
const BARE_ROUTES = ["/administrare", "/poveste"];

export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (BARE_ROUTES.some((r) => path?.startsWith(r))) return null;
  return <>{children}</>;
}
