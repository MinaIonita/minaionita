import type { Metadata } from "next";

// The admin must never be indexed (brief §6bis). robots.ts also disallows
// /admin/. For production it should live on a separate subdomain (§7).
export const metadata: Metadata = {
  title: "Admin — Mina Ioniță",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
