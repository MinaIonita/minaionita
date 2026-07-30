"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
// Official mark rather than a hand-drawn approximation of a trademark.
import { siWhatsapp } from "simple-icons";
import { useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { ButtonLink } from "@/components/ui/button";
import { useSite } from "@/components/site-provider";
import { primaryCta } from "@/lib/site";

const nav = [
  { href: "/servicii", label: "Servicii" },
  { href: "/portofoliu", label: "Portofoliu" },
  { href: "/proiecte-personale", label: "Proiecte personale" },
  { href: "/despre", label: "Despre mine" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    // The drawer must live outside <header>: the header's backdrop-blur creates
    // a containing block for fixed descendants, which pinned the drawer to the
    // header's 60px box instead of the viewport.
    <>
      <header className="sticky top-0 z-40 border-b border-rule/70 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
          <Logo />

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 text-sm text-muted transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-200 hover:text-ink hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Click-to-call and click-to-chat (brief §3.8). Icon-only buttons
              need real labels, and the 44px box is the touch target even though
              the glyph is small. */}
          <div className="hidden items-center gap-1 lg:flex">
            <a
              href={`tel:${site.phoneHref}`}
              aria-label={`Sună la ${site.phone}`}
              title={site.phone}
              className="flex size-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-cream-sunk hover:text-ink"
            >
              <Phone className="size-[18px]" strokeWidth={1.5} aria-hidden />
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Scrie-mi pe WhatsApp (se deschide în tab nou)"
              title="WhatsApp"
              className="flex size-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-cream-sunk hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[18px]">
                <path d={siWhatsapp.path} />
              </svg>
            </a>

            <span aria-hidden className="mx-2 h-5 w-px bg-rule" />

            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label="Deschide meniul"
            className="-mr-2 flex size-11 cursor-pointer items-center justify-center lg:hidden"
          >
            <span aria-hidden className="relative block h-3.5 w-6">
              <span className="absolute left-0 top-0 block h-px w-6 bg-ink" />
              <span className="absolute left-0 top-1/2 block h-px w-6 bg-ink" />
              <span className="absolute left-0 top-full block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={nav}
        returnFocusRef={toggleRef}
      />
    </>
  );
}
