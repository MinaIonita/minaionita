import type { Metadata } from "next";

// The admin must never be indexed (brief §6bis). robots.ts also disallows
// /administrare/. For production it should live on a separate subdomain (§7).
//
// No redirect is left behind at /admin: moving off the guessable path is a small
// hardening win, and a redirect would hand it straight back to a scanner.
export const metadata: Metadata = {
  // Bare string, not "Administrare — Mina Ioniță": the root layout's template
  // already appends the site name, and the branded form rendered it twice.
  title: "Administrare",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
