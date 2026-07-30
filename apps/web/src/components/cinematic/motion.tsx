"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The JS half of the cinematic layer — deliberately small.
 *
 * Everything that CSS can do (parallax, reveals, scene departures) is done in
 * cinematic.css on scroll-driven timelines, off the main thread. What's left
 * here is only what CSS genuinely cannot express: measuring content to drive the
 * horizontal rail, pointer position, and a reveal fallback for browsers without
 * `animation-timeline`.
 *
 * Every effect below checks prefers-reduced-motion and does nothing when it's
 * set. Parallax and scroll-driven motion are precisely what that setting exists
 * to switch off.
 */

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reveal driver.
 *
 * Runs in every browser, not just those without scroll-driven CSS. Gating it on
 * `supportsScrollTimeline()` left `.cine-line` and `.cine-stagger` — which have
 * no scroll-driven equivalent — stuck at opacity 0 in Chrome, hiding the Act 02
 * pull-quote, the services list and the closing headline entirely.
 *
 * There is no conflict with the stylesheet: `.cine-reveal` is animation-driven
 * where supported, and a CSS animation beats the transition this class toggles.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const targets = document.querySelectorAll<HTMLElement>(
      ".cine-reveal, .cine-stagger, .cine-line",
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          // One-shot: re-animating on every pass is the "everything moves all
          // the time" failure mode, and it makes long pages exhausting.
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Ambient gold glow that trails the pointer. Coalesced into one rAF write. */
export function CursorGlow() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // A glow chasing a finger is meaningless; touch also fires no mousemove.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let pending = false;

    const write = () => {
      pending = false;
      document.documentElement.style.setProperty("--cine-mx", `${x}px`);
      document.documentElement.style.setProperty("--cine-my", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // Many pointer events per frame collapse into a single style write.
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(write);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cine-glow" aria-hidden />;
}

/**
 * Horizontal rail: vertical scroll travels the track sideways.
 *
 * The scroll handler writes one custom property per frame and never reads
 * layout — widths are measured once on mount and on resize, so the loop can't
 * trigger forced reflow.
 */
export function HorizontalRail({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (prefersReducedMotion()) return;

    let distance = 0;
    let raf = 0;
    let pending = false;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      // The section is made as tall as the horizontal distance, so one screen of
      // vertical scroll moves one screen of rail — the mapping feels 1:1.
      section.style.height = `${window.innerHeight + distance}px`;
    };

    const update = () => {
      pending = false;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      track.style.setProperty("--cine-rail-x", String(progress * distance));
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden">
        <div ref={trackRef} className="cine-rail__track px-5 sm:px-8">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Button that leans toward the cursor. Pure transform, released on leave. */
export function Magnetic({
  children,
  className = "",
  strength = 0.28,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--cine-magnet-x", `${dx * strength}px`);
      el.style.setProperty("--cine-magnet-y", `${dy * strength}px`);
    };

    const reset = () => {
      el.style.setProperty("--cine-magnet-x", "0px");
      el.style.setProperty("--cine-magnet-y", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [strength]);

  return (
    <span ref={ref} className={`cine-magnet inline-flex ${className}`}>
      {children}
    </span>
  );
}

/**
 * Number that counts up once, when it comes into view.
 *
 * The final value is in the DOM from the first render and the animation only
 * replaces the visible text, so a screen reader — and anyone with reduced
 * motion — reads the real figure rather than a spinning placeholder.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // The count starts here rather than in the effect body: resetting to 0
        // synchronously on mount would cascade a render, and the first frame
        // below lands on 0 anyway.
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // Ease-out: fast rise, long settle — the same curve as the reveals.
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(eased * to));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular">
      {display}
      {suffix}
    </span>
  );
}

/** Arms the reveal fallback. Renders nothing. */
export function RevealProvider() {
  useScrollReveal();
  return null;
}
