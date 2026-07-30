"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal primitive (brief: elevate the whole page with a quiet motion
 * layer). Uses IntersectionObserver, animates transform+opacity only (compositor
 * work, no layout/paint), fires once, and short-circuits to visible under
 * prefers-reduced-motion so nothing depends on animation to be readable.
 */
function useReveal<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No animation path: render final state immediately.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, shown]);

  return { ref, shown };
}

type RevealProps = {
  children: React.ReactNode;
  /** Stagger in ms — for sequencing siblings. */
  delay?: number;
  /** Reveal direction. "up" is the default editorial rise. */
  from?: "up" | "none";
  as?: "div" | "li" | "section" | "span";
  className?: string;
};

/** Wrap any block to have it rise + fade in as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const { ref, shown } = useReveal<HTMLElement>();
  const hidden = from === "up" ? "translate-y-5 opacity-0" : "opacity-0";
  return (
    <Tag
      // @ts-expect-error — ref type varies with the polymorphic tag; runtime is correct.
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : hidden
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
