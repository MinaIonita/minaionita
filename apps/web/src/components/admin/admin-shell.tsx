"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/admin-api";

const nav = [
  { href: "/admin", label: "Tichete", icon: "📥" },
  { href: "/admin/servicii", label: "Servicii", icon: "▤" },
  { href: "/admin/portofoliu", label: "Portofoliu", icon: "▦" },
  { href: "/admin/proiecte", label: "Clienți", icon: "◍" },
  { href: "/admin/contracte", label: "Contracte", icon: "§" },
  { href: "/admin/monitor", label: "Monitor", icon: "◉" },
  { href: "/admin/testimoniale", label: "Testimoniale", icon: "❝" },
  { href: "/admin/setari", label: "Setări", icon: "⚙" },
  { href: "/admin/securitate", label: "Securitate", icon: "🔒" },
];

/** Shared admin chrome: auth gate + left sidebar navigation. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth.token) router.replace("/admin/login");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/tichete") : pathname.startsWith(href);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Sidebar — becomes a top bar on mobile; hidden when printing */}
      <aside className="sticky top-0 z-10 flex h-auto flex-col border-b border-rule bg-cream/95 backdrop-blur-md lg:h-dvh lg:border-b-0 lg:border-r print:hidden">
        <div className="flex items-center justify-between px-5 py-4 lg:px-6">
          <Link href="/admin" aria-label="Admin — acasă" className="inline-flex">
            <Image
              src="/brand/logo-mi-gold-light.png"
              alt="Mina Ioniță"
              width={1104}
              height={425}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-gold-deep">
              Vezi site-ul ↗
            </Link>
            <button
              onClick={() => {
                auth.clear();
                router.replace("/admin/login");
              }}
              className="text-xs text-muted"
            >
              Ieși
            </button>
          </div>
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-x-auto px-3 pb-3 lg:overflow-y-auto lg:px-4">
          <ul className="flex gap-1 lg:flex-col">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                      active
                        ? "bg-ink text-cream"
                        : "text-muted hover:bg-cream-sunk hover:text-ink"
                    }`}
                  >
                    <span aria-hidden className="text-[0.85em] opacity-70">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden gap-2 border-t border-rule p-4 lg:flex lg:flex-col">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 items-center justify-center gap-2 rounded-full bg-gold px-4 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light"
          >
            Vezi site-ul
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
              <path d="M5 11 11 5m0 0H6m5 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            onClick={() => {
              auth.clear();
              router.replace("/admin/login");
            }}
            className="min-h-10 cursor-pointer rounded-full text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Ieși
          </button>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}

/** Small toast for save feedback. */
export function SaveToast({ show, label }: { show: boolean; label: string }) {
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-cream shadow-lg transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {label}
    </div>
  );
}
