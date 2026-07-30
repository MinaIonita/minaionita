import { StackBand } from "@/components/sections/stack-band";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/lib/site";

/** Small helper so each staggered element just declares its order. */
const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

// Proof bar (positioning: the credential + the portfolio wall, before any
// narrative). Numbers before adjectives.
//
// Each figure is scoped so they can't read as contradicting each other: the
// earlier version put "25+ site-uri live" here while the meta description
// claimed 80+ projects, which looks like two different stories about the same
// work. Projects since 2018 vs sites live right now are both true and now say so.
// Kept short enough to hold one row on desktop; the Meta detail lives in the
// lead paragraph directly above, so repeating it here only cost a line break.
const proof = [
  "80+ proiecte din 2018",
  "25+ site-uri live acum",
  "2 ani la Meta",
  "Cod scris de la zero",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Oversized monogram watermark: decorative, so aria-hidden. Rides off the
          right edge as texture; the foil sheen travels along the strokes. */}
      <div
        aria-hidden
        className="hero-mark pointer-events-none absolute -right-28 top-6 aspect-[1104/425] w-[26rem] max-w-none select-none opacity-[0.07] sm:-right-20 sm:top-24 sm:w-[42rem] lg:-right-16 lg:top-24 lg:w-[54rem]"
      />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="max-w-4xl">
          {/* Eyebrow with a short gold rule — the editorial kicker. */}
          <p
            className="intro-item flex items-center gap-3 text-eyebrow font-medium uppercase text-gold-deep"
            style={step(0)}
          >
            <span aria-hidden className="h-px w-8 bg-gold" />
            Site-uri de prezentare · Magazine online · Campanii
          </p>

          {/* The hook stays, but the second line now carries the commercial
              keyword: an H1 of pure narrative ranked for nothing, while the
              title tag was left doing the work alone. */}
          <h1 className="mt-7 font-display text-hero text-ink" style={{ fontWeight: 500 }}>
            <span className="line-mask" style={step(0)}>
              <span>Am lucrat la Meta.</span>
            </span>
            <span className="line-mask text-gold-deep" style={step(1)}>
              <span>Acum construiesc site-uri care aduc clienți.</span>
            </span>
          </h1>

          {/* The citable definition, in the first 150 words: entity, role, city,
              services, proof. This is the unit AI retrieval lifts when someone
              asks who builds websites in Bucharest — the old version opened with
              biography and never said what the work is. */}
          <p
            className="intro-item mt-8 max-w-xl text-lead text-muted text-pretty"
            style={step(3)}
          >
            Sunt Mina Ioniță, dezvoltator web și consultant de marketing din
            București. Construiesc site-uri de prezentare și magazine online
            pentru firme mici și mijlocii, apoi le aduc clienți cu campanii pe
            Meta și Google. Doi ani am lucrat chiar la Meta, pe cifrele celor mai
            mari companii din România — acum le pun la treabă pentru firma ta.
          </p>

          <div
            className="intro-item mt-11 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={step(4)}
          >
            <ButtonLink href={primaryCta.href} className="px-8">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/portofoliu" variant="secondary">
              Vezi portofoliul
            </ButtonLink>
          </div>

          {/* Proof bar — the credential + the wall of live work, up front.
              2×2 grid on mobile so the points line up cleanly; an inline row on
              desktop. */}
          <ul
            className="intro-item mt-12 grid grid-cols-2 gap-x-6 gap-y-3.5 border-t border-rule pt-6 text-sm text-muted-strong sm:flex sm:flex-wrap sm:items-center sm:gap-x-7"
            style={step(5)}
          >
            {proof.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full-bleed marquee drifts across the whole viewport. */}
      <div className="pb-5 sm:pb-6">
        <StackBand />
      </div>
    </section>
  );
}
