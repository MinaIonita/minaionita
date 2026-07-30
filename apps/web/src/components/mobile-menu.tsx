"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta, site } from "@/lib/site";

type NavItem = { href: string; label: string };

export function MobileMenu({
  open,
  onClose,
  items,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes; every modal needs an escape route (a11y).
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock the page behind the drawer, otherwise the body scrolls under it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus in on open, and hand it back to the toggle on close.
  useEffect(() => {
    if (open) closeRef.current?.focus();
    else returnFocusRef.current?.focus();
    // returnFocusRef is stable; only react to open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep tab focus inside the panel while it's open.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    // The closed panel is parked off-screen via translate-x-full, which still
    // widens the document and produced 343px of horizontal scroll. This clipping
    // layer contains it; pointer-events are handed back when closed so the page
    // underneath stays clickable.
    <div
      className={`fixed inset-0 z-40 overflow-hidden lg:hidden ${
        open ? "" : "pointer-events-none"
      }`}
    >
      {/* Scrim: strong enough to isolate the panel, and it dismisses on tap. */}
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Meniu"
        // inert keeps the closed panel out of the tab order while staying
        // mounted, so it can animate out instead of vanishing.
        inert={!open}
        className={`absolute right-0 top-0 z-50 flex h-dvh w-[min(88vw,26rem)] flex-col overflow-y-auto bg-cream shadow-[-24px_0_60px_-20px_rgba(20,20,15,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative monogram bleeding off the panel's corner. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-6 w-72 select-none opacity-[0.06]"
        >
          <Image
            src="/brand/logo-mi-ink.png"
            alt=""
            width={1104}
            height={425}
            className="h-auto w-full"
          />
        </div>

        <div className="flex items-center justify-end px-5 py-3">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Închide meniul"
            className="-mr-2 flex size-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-cream-sunk"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav aria-label="Principal mobil" className="px-7 pt-4">
          <ul>
            {items.map((item, i) => (
              <li
                key={item.href}
                // Staggered entrance, ~45ms apart; motion tokens live in CSS but
                // per-item delay has to be inline.
                style={{
                  transitionDelay: open ? `${120 + i * 45}ms` : "0ms",
                }}
                className={`border-b border-rule/70 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex min-h-14 items-center justify-between font-display text-3xl text-ink"
                >
                  {item.label}
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    className="size-4 text-gold opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    <path
                      d="M3 8h10m0 0-4-4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={{ transitionDelay: open ? `${120 + items.length * 45}ms` : "0ms" }}
          className={`mt-auto px-7 pb-9 pt-10 transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <ButtonLink href={primaryCta.href} onClick={onClose} className="w-full">
            {primaryCta.label}
          </ButtonLink>

          <div className="mt-7 space-y-2 text-sm">
            <a
              href={`mailto:${site.email}`}
              className="block text-gold-deep hover:underline"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phoneHref}`}
              className="tabular block text-gold-deep hover:underline"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
