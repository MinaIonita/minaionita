import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "secondaryOnDark" | "ghost";

// Ink-on-gold measures 5.21:1; cream-on-gold would be 3.37:1 and fail AA.
const styles: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-light active:bg-gold-deep active:text-cream shadow-[0_1px_0_rgba(20,20,15,0.08)]",
  secondary:
    "border border-rule-strong bg-transparent text-ink hover:border-gold hover:bg-cream-sunk",
  // A real variant, not `secondary` + a text-cream override: Tailwind orders
  // utilities by their position in the stylesheet, so text-ink would win the
  // cascade regardless of className order and the label would vanish on dark.
  secondaryOnDark:
    "border border-cream/30 bg-cream/5 text-cream backdrop-blur-sm hover:border-gold-light hover:bg-cream/10",
  ghost: "text-gold-deep underline-offset-4 hover:underline",
};

const base =
  // min-h-11 = 44px touch target
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant } & ComponentProps<"button">) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  href,
  ...props
}: { variant?: Variant; href: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href"
>) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
