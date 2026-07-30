import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { stack } from "@/lib/content";

/**
 * Continuous logo marquee, living inside the hero rather than as its own band —
 * it should read as a quiet footnote to the headline, not a second section.
 *
 * The list is duplicated once and the track travels exactly -50%, so the seam
 * lands on an identical frame and the loop is invisible. The duplicate is
 * aria-hidden — a screen reader should hear each name once, not twice.
 *
 * Marks come from simple-icons, so the shapes are official rather than redrawn.
 * They render monochrome: a strip mixing Meta blue, React cyan and Google's four
 * colours would fight the cream-and-gold palette, and a single-colour tech strip
 * is the convention most brand guidelines allow.
 */
const marks = stack.map((item) => ({
  ...item,
  icon: item.slug
    ? (icons as unknown as Record<string, SimpleIcon>)[item.slug]
    : undefined,
}));

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10"
    >
      {marks.map(({ label, icon }) => (
        <li key={label} className="shrink-0">
          <span className="flex items-center gap-2 text-ink/45">
            {icon && (
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                fill="currentColor"
                className="size-[18px] shrink-0"
              >
                <path d={icon.path} />
              </svg>
            )}
            <span className="whitespace-nowrap text-xs">{label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StackBand() {
  return (
    <div aria-labelledby="stack" role="group" className="overflow-hidden">
      <h2 id="stack" className="sr-only">
        Tehnologii și platforme cu care lucrez
      </h2>

      {/* Fade the edges so marks drift in and out instead of being chopped. */}
      <div className="marquee-mask relative flex">
        <div className="marquee-track flex min-w-full shrink-0 items-center">
          <Track />
          <Track hidden />
        </div>
      </div>
    </div>
  );
}
