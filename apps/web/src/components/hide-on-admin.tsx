"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site chrome (header, footer, contact dock) on /admin routes.
 * The admin has its own bare layout; without this the public header/footer bleed
 * into every admin page. Server-component children (e.g. the footer) render fine
 * when passed through a client wrapper.
 */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return <>{children}</>;
}
