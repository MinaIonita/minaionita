"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { useSite } from "@/components/site-provider";
import { primaryCta } from "@/lib/site";

/**
 * Full-bleed closing CTA over a looping city plate.
 *
 * Designed to stand on its own with no video present: the gold-on-ink wash is
 * the real background, and the clip is an enhancement layered on top. Drop
 * /public/video/city.{webm,mp4} + city-poster.webp in and it lights up — until
 * then nothing looks broken.
 *
 * The video is decorative, so it never blocks: preload="none" keeps it out of
 * the initial load (brief §6bis.16 wants green CWV on mobile), it only starts
 * once it can actually play through, and prefers-reduced-motion stops it from
 * ever starting.
 */
export function ClosingCta() {
  const site = useSite();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    // Only pull the bytes after the page is interactive.
    v.preload = "auto";
    const onReady = () => {
      setReady(true);
      // Autoplay can still be refused (low power mode); the poster stays.
      v.play().catch(() => setReady(false));
    };
    v.addEventListener("canplaythrough", onReady, { once: true });
    v.load();
    return () => v.removeEventListener("canplaythrough", onReady);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/video/city-poster.webp"
        aria-hidden
        tabIndex={-1}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/video/city.webm" type="video/webm" />
        <source src="/video/city.mp4" type="video/mp4" />
      </video>

      {/* Carries the section on its own when there is no clip. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(900px_520px_at_78%_0%,rgba(201,162,78,0.30),transparent_62%),radial-gradient(700px_460px_at_0%_100%,rgba(168,130,60,0.16),transparent_66%)]"
      />
      {/* Directional scrim rather than a flat wash: heavy under the copy on the
          left, near-clear over the skyline on the right. The city stays vivid
          and the type still clears AA. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30"
      />

      {/* Signature across the skyline. It runs at full strength, so it has to
          stay clear of the copy — over the text at this opacity the cream mark
          simply erases the cream type. Hidden on small screens, where there is
          no column free of text. */}
      <div
        aria-hidden
        className="hero-mark hero-mark--dark pointer-events-none absolute -right-14 top-1/2 hidden aspect-[1104/425] w-[36rem] -translate-y-1/2 select-none opacity-50 md:block lg:-right-10 lg:w-[48rem]"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase text-gold-light">
            Audit gratuit
          </p>

          <h2 className="mt-5 font-display text-display text-cream text-balance">
            Încă nu te-ai decis dacă să lucrezi cu mine?
          </h2>

          <p className="mt-6 max-w-xl text-lead text-cream/75 text-pretty">
            Bine. Nici eu nu m-aș decide după o pagină de site. Dă-mi 30 de
            minute și accesul la cifrele tale: mă uit la site și la campanii, îți
            arăt unde pierzi clienți și ce aș repara întâi, în ordinea în care aș
            face-o eu. Lista rămâne a ta — dacă pleci cu ea la altcineva,
            înseamnă tot că am avut dreptate.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href={primaryCta.href} className="px-8">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={`https://wa.me/${site.whatsapp}`}
              variant="secondaryOnDark"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scrie-mi pe WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
