import Image from "next/image";
import Link from "next/link";

type Props = {
  /** "light" = deep gold for cream surfaces; "dark" = bright gold for ink surfaces. */
  variant?: "light" | "dark";
  className?: string;
};

export function Logo({ variant = "light", className = "" }: Props) {
  const src =
    variant === "dark"
      ? "/brand/logo-mi-gold-dark.png"
      : "/brand/logo-mi-gold-light.png";

  return (
    <Link
      href="/"
      aria-label="Mina Ioniță — acasă"
      className={`group inline-flex ${className}`}
    >
      {/* Intrinsic 1104x425. The name is carried by aria-label, not visible text. */}
      <Image
        src={src}
        alt=""
        width={1104}
        height={425}
        priority
        className="h-10 w-auto transition-opacity duration-200 group-hover:opacity-80 sm:h-11"
      />
    </Link>
  );
}
