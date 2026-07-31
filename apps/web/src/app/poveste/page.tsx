import { ArrowDown, ArrowUpRight } from "lucide-react";
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
import { businessNode, personNode } from "@/lib/schema";
import { primaryCta, site } from "@/lib/site";
import "./cinematic.css";

/**
 * The story, told by scrolling (/poveste).
 *
 * A destination, not an entry point. The homepage stays the door people arrive
 * at from search — it carries the structured data, the citable definition in the
 * first 150 words and the contact form. This page is where someone who already
 * knows who Mina is gets the long version: linked from the homepage, from
 * /despre, from a proposal or a LinkedIn post.
 *
 * It is indexable but deliberately positioned away from the commercial keywords:
 * /despre remains the canonical entity page (personNode still points its
 * mainEntityOfPage there), and this is a WebPage *about* that entity. Titling it
 * "dezvoltator web" too would put two of the site's own pages in the same
 * auction.
 */
export const metadata: Metadata = {
  title: "Povestea mea, în șase acte",
  description:
    "De la prima pagină de HTML scrisă în liceu, la doi ani în Meta și la propriul produs. Povestea din spatele site-urilor pe care le construiesc, spusă pe scroll.",
  alternates: { canonical: "/poveste" },
};

const acts = [
  { n: "01", label: "Începutul" },
  { n: "02", label: "Meta" },
  { n: "03", label: "Munca" },
  { n: "04", label: "Metoda" },
  { n: "05", label: "Parcly" },
  { n: "06", label: "Acum" },
];

/** Every public page, so the story doesn't end in a dead end. */
const siteIndex = [
  { href: "/", label: "Acasă", note: "Serviciile, portofoliul, modul de lucru" },
  { href: "/servicii", label: "Servicii", note: "Proces, prețuri orientative, exemple" },
  { href: "/portofoliu", label: "Portofoliu", note: "Toate proiectele, live și verificabile" },
  { href: "/proiecte-personale", label: "Proiecte personale", note: "Parcly și ce mai construiesc" },
  { href: "/despre", label: "Despre mine", note: "Parcurs, certificări, CV" },
  { href: "/contact", label: "Contact", note: "Audit gratuit de 30 de minute" },
];

export default async function TestPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 8);
  const parcly = personalProjects.find((p) => p.slug === "parcly");

  // WebPage rather than AboutPage: /despre already owns that role, and the
  // identity nodes travel along so this URL resolves the entity on its own.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      businessNode(),
      {
        "@type": "WebPage",
        "@id": `${site.url}/poveste#page`,
        url: `${site.url}/poveste`,
        name: "Povestea mea, în șase acte",
        description:
          "Parcursul lui Mina Ioniță, de la primele pagini de HTML la doi ani în Meta și la propriul produs.",
        about: { "@id": `${site.url}/#person` },
        isPartOf: { "@id": `${site.url}/#business` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Acasă", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Povestea mea",
            item: `${site.url}/poveste`,
          },
        ],
      },
    ],
  };

  return (
    <div className="cine relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          {/* A real H1 now that the page is indexable — the mark above is
              decorative and carries no text for a crawler. */}
          <h1 className="cine-reveal mx-auto mt-12 max-w-2xl text-center font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-cream text-balance">
            Povestea mea, în șase acte
          </h1>

          <p className="cine-reveal mx-auto mt-5 max-w-md text-center text-lead leading-relaxed text-cream/60 text-pretty">
            De la prima pagină de HTML scrisă în liceu, la doi ani în Meta și la
            propriul produs — cum am ajuns să construiesc site-uri care aduc
            clienți.
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
        heading="N-am vrut un job. Am vrut să construiesc ceva al meu."
      >
        <p className="cine-reveal text-lead leading-relaxed text-cream/70 text-pretty">
          Am început cu cod, pentru că acolo rezultatul se vedea cel mai repede:
          scriam ceva seara și a doua zi exista pe internet, iar oricine îl putea
          deschide.
        </p>
        <p className="cine-reveal mt-6 leading-relaxed text-cream/50 text-pretty">
          Dar nu m-am oprit la cât îmi trebuia ca să mă descurc. Am făcut
          cursuri, am citit, am construit proiecte doar pentru mine — seară de
          seară, ani la rând, fără să mi-o ceară nimeni. Voiam să fiu bun, nu să
          mă descurc. Întâi HTML și CSS, apoi JavaScript, apoi PHP și WordPress,
          apoi cod scris de la zero acolo unde un CMS nu mai ajungea.
        </p>
        <p className="cine-reveal mt-6 leading-relaxed text-cream/50 text-pretty">
          Apoi am înțeles că un site care arată bine și nu vinde e tot un site
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
              România, din industrii care nu semănau deloc între ele. Le-am
              ajutat să crească, iar eu am crescut odată cu ele.
            </p>

            <dl className="cine-stagger mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-cream/10 pt-10 lg:grid-cols-4">
              <Figure value={<CountUp to={80} suffix="+" />} label="proiecte livrate din 2018" />
              <Figure value={<CountUp to={25} suffix="+" />} label="site-uri live acum" />
              <Figure value={<CountUp to={2} />} label="ani în Meta" />
              <Figure value={<CountUp to={6} suffix="+" />} label="ani în web și marketing" />
            </dl>

            <div className="cine-reveal mt-12">
              <ActLink href="/despre">Povestea completă și CV-ul</ActLink>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Act 03 — the work, travelling sideways ────────────────────── */}
      <section className="relative border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
          <ActMark n="03" label="Munca" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="cine-focus mt-8 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-cream text-balance">
              La fiecare, eu am fost tot proiectul
            </h2>
            <ActLink href="/portofoliu">
              Toate cele {projects.length} proiecte
            </ActLink>
          </div>
        </div>

        <HorizontalRail>
          {featured.map((p, i) => (
            <a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-cream/10 bg-ink-soft">
                <Image
                  src={`/portfolio/${p.slug}.webp`}
                  alt={`${p.client} — ${p.tagline}`}
                  width={1440}
                  height={900}
                  // The first two are in the opening frame of the act; the rest
                  // only exist after the rail has travelled, so they can wait.
                  priority={i < 2}
                  loading={i < 2 ? undefined : "lazy"}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw"
                  className="size-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />

                {/* The generated cover already carries the client wordmark and
                    tagline, so nothing is overlaid on it — an earlier version
                    repeated the name in a caption sitting directly on top of the
                    artwork's own type. Only the category pill and the open
                    affordance live on the image. */}
                <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-gold-light backdrop-blur-sm">
                  {p.category}
                </span>

                <span
                  aria-hidden
                  className="absolute right-4 top-4 flex size-9 translate-y-1 items-center justify-center rounded-full bg-cream text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </span>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl text-cream transition-colors duration-300 group-hover:text-gold-light">
                  {p.client}
                  <span className="sr-only"> (se deschide în tab nou)</span>
                </h3>
                <span className="tabular shrink-0 text-xs text-cream/35">
                  {p.year}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/45 text-pretty">
                {p.description}
              </p>
            </a>
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
              Aleg unealta după problemă, nu invers
            </h2>

            {/* Each row goes to its own service page — the act is the index. */}
            <ol className="cine-stagger mt-14 border-t border-cream/10">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/servicii/${s.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b border-cream/10 py-6 transition-colors duration-300 hover:bg-cream/[0.03] sm:gap-x-10"
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
                  </Link>
                </li>
              ))}
            </ol>

            <div className="cine-reveal mt-10">
              <ActLink href="/servicii">Vezi toate serviciile</ActLink>
            </div>
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
                      <span>Îmi testez metoda</span>
                    </span>
                    <span className="cine-line text-gold-light">
                      <span>pe banii mei.</span>
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

                  <div className="cine-reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <ActLink href="/proiecte-personale">
                      Despre proiectele mele
                    </ActLink>
                    <span className="text-xs text-cream/35">
                      {parcly.status} · {parcly.kicker}
                    </span>
                  </div>
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
              <span>Acum lucrez</span>
            </span>
            <span className="cine-line text-gold-light">
              <span>pentru firma ta.</span>
            </span>
          </h2>

          <p className="cine-reveal mt-10 max-w-xl text-lead leading-relaxed text-cream/60 text-pretty">
            Primul pas e un audit gratuit de 30 de minute. Îți spun exact unde
            pierzi clienți și ce aș repara întâi — lista rămâne a ta, indiferent
            dacă lucrăm împreună.
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
              href="/portofoliu"
              className="text-sm text-cream/50 underline-offset-4 transition-colors duration-200 hover:text-cream hover:underline"
            >
              Vezi portofoliul
            </Link>
          </div>

          {/* Full index. A story this linear has to end somewhere other than a
              dead end — every page of the site is one click from here. */}
          <nav
            aria-label="Restul site-ului"
            className="cine-stagger mt-20 grid gap-x-10 gap-y-5 border-t border-cream/10 pt-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {siteIndex.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-4 border-b border-cream/10 pb-4 transition-colors duration-300 hover:border-gold-light/40"
              >
                <span>
                  <span className="block font-display text-lg text-cream transition-colors duration-300 group-hover:text-gold-light">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-cream/40">
                    {item.note}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-gold-light/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-light"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          <p className="mt-12 text-xs text-cream/30">
            {acts.length} acte · {site.legal}
          </p>
        </div>
      </section>
    </div>
  );
}

/** Quiet inline CTA out of an act — a rule that fills gold on hover. */
function ActLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 text-sm text-cream/70 transition-colors duration-300 hover:text-gold-light"
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-light transition-transform duration-300 group-hover:scale-x-100"
        />
      </span>
      <ArrowUpRight
        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.5}
        aria-hidden
      />
    </Link>
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
