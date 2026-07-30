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
import Image from "next/image";
import { personalProjects, services } from "@/lib/content";
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
  { n: "05", label: "Parcly" },
  { n: "06", label: "Acum" },
];

export default async function TestPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 8);
  const parcly = personalProjects.find((p) => p.slug === "parcly");

  return (
    <div className="cine relative">
      <RevealProvider />
      <CursorGlow />

      {/* Fills with the document — where the reader is in the story. */}
      <div className="cine-progress-rail" aria-hidden>
        <span className="cine-progress-rail__fill" />
      </div>

      {/* ─── Overture: the signature writes itself ─────────────────────── */}
      <section className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 py-10 sm:px-8">
        <div className="cine-grain" aria-hidden />

        <p className="cine-reveal text-eyebrow font-medium uppercase tracking-[0.3em] text-gold-light/70">
          Mina Ioniță
        </p>

        <div className="relative mx-auto w-full max-w-4xl">
          {/* The monogram, drawn rather than displayed. */}
          <div
            className="cine-signature cine-push mx-auto w-[min(78vw,44rem)]"
            aria-hidden
          >
            <div className="cine-signature__ink" />
          </div>
          <h1 className="sr-only">
            Mina Ioniță — versiune cinematică a poveștii
          </h1>

          <p className="cine-reveal mx-auto mt-12 max-w-md text-center text-lead leading-relaxed text-cream/60 text-pretty">
            O poveste în șase acte, despre cum ajunge cineva să construiască
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
        heading="N-a vrut un job. A vrut să construiască ceva al lui."
      >
        <p className="cine-reveal text-lead leading-relaxed text-cream/70 text-pretty">
          A început cu cod, pentru că acolo rezultatul se vedea cel mai repede:
          scria ceva seara și a doua zi exista pe internet, iar oricine îl putea
          deschide.
        </p>
        <p className="cine-reveal mt-6 leading-relaxed text-cream/50 text-pretty">
          Dar nu s-a oprit la cât îi trebuia ca să se descurce. A făcut cursuri,
          a citit, a construit proiecte doar pentru el — seară de seară, ani la
          rând, fără să i-o ceară nimeni. Voia să fie bun, nu să se descurce.
          Întâi HTML și CSS, apoi JavaScript, apoi PHP și WordPress, apoi cod
          scris de la zero acolo unde un CMS nu mai ajungea.
        </p>
        <p className="cine-reveal mt-6 leading-relaxed text-cream/50 text-pretty">
          Apoi a înțeles că un site care arată bine și nu vinde e tot un site
          prost. Așa au venit designul, marketingul și analiza de business — nu
          ca meserii separate, ci ca aceeași meserie privită de la celălalt
          capăt: ce anume îl face pe un client să cumpere.
        </p>
      </Act>

      {/* ─── Act 02 — the turn ─────────────────────────────────────────── */}
      <section className="cine-scene">
        <div className="cine-scene__inner border-t border-cream/10">
          <div className="cine-grain" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
            <ActMark n="02" label="Meta" />

            {/* The mark recurring as texture behind the line it belongs to. */}
            <div
              className="cine-watermark cine-turn -right-32 top-0 w-[42rem]"
              aria-hidden
            />

            <blockquote className="cine-par cine-par--slow relative mt-14 max-w-4xl font-display text-[clamp(1.9rem,5vw,4rem)] leading-[1.08] text-cream text-balance">
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
          <h2 className="cine-focus mt-8 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
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
            <h2 className="cine-focus mt-8 max-w-3xl font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
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

      {/* ─── Act 05 — Parcly, the method tested on his own money ───────── */}
      {parcly && (
        <section className="cine-scene border-t border-cream/10">
          <div className="cine-scene__inner">
            <div className="cine-grain" aria-hidden />
            <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
              <ActMark n="05" label="Parcly" />

              <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
                <div className="cine-par cine-par--slow">
                  {parcly.logo && (
                    // Both Parcly marks are ink + teal — they were drawn for the
                    // cream surface on the homepage and disappear on ink. A light
                    // plate is the brand-safe fix; recolouring the mark or
                    // filter-inverting it would break its teal.
                    <span className="cine-reveal inline-flex rounded-lg bg-cream px-5 py-3">
                      <Image
                        src="/brand/parcly-logo.svg"
                        alt={parcly.name}
                        width={376}
                        height={129}
                        className="h-9 w-auto sm:h-11"
                      />
                    </span>
                  )}

                  <h2 className="mt-9 font-display text-[clamp(1.7rem,3.2vw,2.7rem)] leading-tight text-cream text-balance">
                    <span className="cine-line">
                      <span>Își testează metoda</span>
                    </span>
                    <span className="cine-line text-gold-light">
                      <span>pe banii lui.</span>
                    </span>
                  </h2>

                  <p className="cine-reveal mt-8 max-w-md text-lead leading-relaxed text-cream/60 text-pretty">
                    {parcly.pitch}
                  </p>

                  <ul className="cine-stagger mt-8 flex flex-wrap gap-2">
                    {parcly.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/50"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="cine-par cine-par--mid lg:pt-6">
                  {parcly.body.map((para, i) => (
                    <p
                      key={i}
                      className={`cine-reveal leading-relaxed text-cream/50 text-pretty ${i > 0 ? "mt-5" : ""}`}
                    >
                      {para}
                    </p>
                  ))}

                  <dl className="cine-stagger mt-12 grid gap-8 border-t border-cream/10 pt-8 sm:grid-cols-3">
                    {parcly.facts.map((f) => (
                      <div key={f.label}>
                        <dt className="sr-only">{f.label}</dt>
                        <dd>
                          <span className="tabular block font-display text-2xl leading-none text-gold-light">
                            {f.value}
                          </span>
                          <span className="mt-2 block text-xs leading-snug text-cream/40">
                            {f.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {parcly.url && (
                    <p className="cine-reveal mt-10 text-xs text-cream/35">
                      {parcly.status} · {parcly.kicker}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Act 06 — close ────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh items-center overflow-hidden border-t border-cream/10">
        <div className="cine-grain" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(900px_520px_at_70%_20%,rgba(201,162,78,0.22),transparent_65%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
          <ActMark n="06" label="Acum" />

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
          {/* Two depths plus opposing lateral drift: the columns separate as
              they travel, which is what reads as space rather than as a slide. */}
          <div className="cine-drift cine-drift--left">
            <ActMark n={n} label={label} />
            <h2 className="cine-focus mt-8 font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
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
