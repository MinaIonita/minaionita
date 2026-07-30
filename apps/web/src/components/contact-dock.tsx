"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { useSite } from "@/components/site-provider";

/**
 * Floating call/chat dock, bottom-right.
 *
 * Appears only after the hero has scrolled past: at the top of the page the
 * header already carries both actions, so showing them twice is noise. Icon-only
 * buttons carry real aria-labels, and the 48px circle is the touch target.
 */
export function ContactDock() {
  const site = useSite();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      // Sits above page content but below the mobile drawer (z-40/50).
      // `contact-dock` is the hook globals.css uses to lift it clear of the
      // cookie bar; without it the two stack in the same corner.
      className={`contact-dock fixed bottom-5 right-5 z-30 flex flex-col gap-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-7 sm:right-7 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scrie-mi pe WhatsApp (se deschide în tab nou)"
        title="WhatsApp"
        className="flex size-12 items-center justify-center rounded-full bg-ink text-cream shadow-[0_10px_28px_-8px_rgba(20,20,15,0.45)] transition-colors duration-200 hover:bg-gold hover:text-ink"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
          <path d={siWhatsapp.path} />
        </svg>
      </a>

      <a
        href={`tel:${site.phoneHref}`}
        aria-label={`Sună la ${site.phone}`}
        title={site.phone}
        className="flex size-12 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_28px_-8px_rgba(20,20,15,0.45)] transition-colors duration-200 hover:bg-gold-light"
      >
        <Phone className="size-5" strokeWidth={1.5} aria-hidden />
      </a>
    </div>
  );
}
