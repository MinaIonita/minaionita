import { ArrowDown, ArrowUpRight } from "lucide-react";
import * as Lucide from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CountUp,
  CursorGlow,
  HorizontalRail,
  Magnetic,
  RevealProvider,
} from "@/components/cinematic/motion";
import { services } from "@/lib/content";
import { getProjects } from "@/lib/data";
import { primaryCta } from "@/lib/site";
import "./cinematic.css";

/**
 * Cinematic test page (/test).
 *
 * A scroll-told version of the same story the homepage carries in prose. It is
 * an experiment sitting next to the live page, not a replacement — the homepage
 * keeps its structure and its SEO.
 *
 * noindex is load-bearing here: two pages telling one entity's story with the
 * same claims would compete in search, and this one has none of the structured
 * data that makes the real homepage citable.
 */
export const metadata: Metadata = {
  title: "Test — versiune cinematică",
  robots: { index: false, follow: false },
};

const acts = [
  { n: "01", label: "Începutul" },
  { n: "02", label: "Meta" },
  { n: "03", label: "Munca" },
  { n: "04", label: "Metoda" },
  { n: "05", label: "Acum" },
];

export default async function TestPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="cine relative">
      <RevealProvider />
      <CursorGlow />

      {/* ─── Overture: the signature writes itself ─────────────────────── */}
      <section className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 py-10 sm:px-8">
        <div className="cine-grain" aria-hidden />

        <p className="cine-reveal text-eyebrow font-medium uppercase tracking-[0.3em] text-gold-light/70">
          Mina Ioniță
        </p>

        <div className="relative mx-auto w-full max-w-4xl">
          {/* The monogram, drawn rather than displayed. */}
          <div className="cine-signature mx-auto w-[min(78vw,44rem)]" aria-hidden>
            <div className="cine-signature__ink" />
          </div>
          <h1 className="sr-only">
            Mina Ioniță — versiune cinematică a poveștii
          </h1>

          <p className="cine-reveal mx-auto mt-12 max-w-md text-center text-lead leading-relaxed text-cream/60 text-pretty">
            O poveste în cinci acte, despre cum ajunge cineva să construiască
            site-uri care aduc clienți.
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span className="text-xs uppercase tracking-[0.25em] text-cream/40">
            Derulează
          </span>
          <ArrowDown
            className="cine-cue size-5 text-gold-light"
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      </section>

      {/* ─── Act 01 — the beginning ────────────────────────────────────── */}
      <Act
        n="01"
        label="Începutul"
        heading="A scris prima pagină de HTML în liceu"
      >
        <p className="cine-reveal text-lead leading-relaxed text-cream/70 text-pretty">
          Nu i-o ceruse nimeni și nu era pentru școală. Îi plăcea că scria ceva
          seara și a doua zi exista pe internet, iar oricine îl putea deschide.
        </p>
        <p className="cine-reveal mt-6 leading-relaxed text-cream/50 text-pretty">
          Apoi a venit CSS. Apoi JavaScript. Apoi treizeci de magazine
          WordPress și WooCommerce pentru firme mici din România, discutate
          direct cu proprietarii — scope, buget, ce vor de la site.
        </p>
        <p className="cine-reveal mt-6 leading-relaxed text-cream/50 text-pretty">
          Acolo a descoperit că partea grea nu e codul.
        </p>
      </Act>

      {/* ─── Act 02 — the turn ─────────────────────────────────────────── */}
      <section className="cine-scene">
        <div className="cine-scene__inner border-t border-cream/10">
          <div className="cine-grain" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
            <ActMark n="02" label="Meta" />

            <blockquote className="cine-par cine-par--slow mt-14 max-w-4xl font-display text-[clamp(1.9rem,5vw,4rem)] leading-[1.08] text-cream text-balance">
              <span className="cine-line">
                <span>Nimeni nu întreba</span>
              </span>
              <span className="cine-line text-gold-light">
                <span>dacă îți place.</span>
              </span>
              <span className="cine-line">
                <span>Toată lumea întreba ce arată cifrele.</span>
              </span>
            </blockquote>

            <p className="cine-reveal mt-10 max-w-xl leading-relaxed text-cream/50 text-pretty">
              Doi ani în Gdańsk, pe conturile celor mai mari companii din
              România, din industrii care nu semănau deloc între ele.
            </p>

            <dl className="cine-stagger mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-cream/10 pt-10 lg:grid-cols-4">
              <Figure value={<CountUp to={80} suffix="+" />} label="proiecte livrate din 2018" />
              <Figure value={<CountUp to={25} suffix="+" />} label="site-uri live acum" />
              <Figure value={<CountUp to={2} />} label="ani în Meta" />
              <Figure value={<CountUp to={6} suffix="+" />} label="ani în web și marketing" />
            </dl>
          </div>
        </div>
      </section>

      {/* ─── Act 03 — the work, travelling sideways ────────────────────── */}
      <section className="relative border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
          <ActMark n="03" label="Munca" />
          <h2 className="cine-reveal mt-8 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
            La fiecare, a fost tot proiectul
          </h2>
        </div>

        <HorizontalRail>
          {featured.map((p) => (
            <article
              key={p.slug}
              className="w-[78vw] shrink-0 sm:w-[42vw] lg:w-[28vw]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-cream/10 bg-ink-soft">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-gold/25 via-transparent to-transparent"
                />
                <ProjectGlyph name={p.icon} />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-light/80">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-cream">
                    {p.client}
                  </h3>
                  <p className="mt-1 text-xs text-cream/50">{p.tagline}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-cream/45 text-pretty">
                {p.description}
              </p>
            </article>
          ))}
        </HorizontalRail>
      </section>

      {/* ─── Act 04 — the method ───────────────────────────────────────── */}
      <section className="cine-scene border-t border-cream/10">
        <div className="cine-scene__inner">
          <div className="cine-grain" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
            <ActMark n="04" label="Metoda" />
            <h2 className="cine-reveal mt-8 max-w-3xl font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
              Alege unealta după problemă, nu invers
            </h2>

            <ol className="cine-stagger mt-14 border-t border-cream/10">
              {services.map((s, i) => (
                <li
                  key={s.slug}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b border-cream/10 py-6 sm:gap-x-10"
                >
                  <span className="tabular font-display text-lg text-gold-light/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl text-cream sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-1 hidden max-w-xl text-sm leading-relaxed text-cream/40 sm:block">
                      {s.summary}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-5 text-gold-light/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-light"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─── Act 05 — close ────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh items-center overflow-hidden border-t border-cream/10">
        <div className="cine-grain" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(900px_520px_at_70%_20%,rgba(201,162,78,0.22),transparent_65%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
          <ActMark n="05" label="Acum" />

          <h2 className="mt-10 max-w-4xl font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] text-cream text-balance">
            <span className="cine-line">
              <span>Acum lucrează</span>
            </span>
            <span className="cine-line text-gold-light">
              <span>pentru firma ta.</span>
            </span>
          </h2>

          <p className="cine-reveal mt-10 max-w-xl text-lead leading-relaxed text-cream/60 text-pretty">
            Primul pas e un audit gratuit de 30 de minute. Îți spune exact unde
            pierzi clienți și ce ar repara întâi — lista rămâne a ta, indiferent
            dacă lucrați împreună.
          </p>

          <div className="cine-reveal mt-12 flex flex-wrap items-center gap-6">
            <Magnetic>
              <Link
                href={primaryCta.href}
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-gold px-8 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light"
              >
                {primaryCta.label}
                <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
              </Link>
            </Magnetic>

            <Link
              href="/"
              className="text-sm text-cream/50 underline-offset-4 transition-colors duration-200 hover:text-cream hover:underline"
            >
              Vezi versiunea live a site-ului
            </Link>
          </div>

          <p className="mt-20 border-t border-cream/10 pt-6 text-xs text-cream/30">
            Pagină de test — {acts.length} acte. Versiunea publică a site-ului
            rămâne pe{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-cream/60">
              pagina principală
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

/** A standard act: pinned scene, numeral, heading, body. */
function Act({
  n,
  label,
  heading,
  children,
}: {
  n: string;
  label: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cine-scene border-t border-cream/10">
      <div className="cine-scene__inner">
        <div className="cine-grain" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="cine-par cine-par--slow">
            <ActMark n={n} label={label} />
            <h2 className="mt-8 font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
              {heading}
            </h2>
          </div>
          <div className="cine-par cine-par--mid max-w-2xl lg:pt-16">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Act numeral with a rule that fills as the act is read. */
function ActMark({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-5">
      <span className="tabular font-display text-sm text-gold-light">{n}</span>
      <span
        className="cine-progress relative h-px w-16 bg-cream/15 after:absolute after:inset-0 after:origin-left after:bg-gold-light after:content-['']"
        aria-hidden
      />
      <span className="text-eyebrow uppercase tracking-[0.25em] text-cream/40">
        {label}
      </span>
    </div>
  );
}

/**
 * The project's own lucide glyph, watermarked into the card.
 *
 * Project icons are stored kebab-case ("building-2") because they were written
 * for lucide-static, while lucide-react exports PascalCase — hence the
 * conversion. An unknown name renders nothing rather than crashing the rail.
 */
function ProjectGlyph({ name }: { name: string }) {
  const pascal = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const Glyph = (Lucide as unknown as Record<string, Lucide.LucideIcon>)[pascal];
  if (!Glyph) return null;

  return (
    <Glyph
      className="absolute right-5 top-5 size-8 text-gold-light/25"
      strokeWidth={1}
      aria-hidden
    />
  );
}

function Figure({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-[clamp(2rem,4vw,3.2rem)] leading-none text-gold-light">
          {value}
        </span>
        <span className="mt-3 block text-xs leading-snug text-cream/40">
          {label}
        </span>
      </dd>
    </div>
  );
}
