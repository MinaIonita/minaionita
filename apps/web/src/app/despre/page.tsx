import { Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import {
  certifications,
  education,
  experience,
  skillGroups,
} from "@/lib/content";
import { primaryCta, site } from "@/lib/site";

// Primary keyword: "dezvoltator web și consultant marketing", anchored to the
// Mina Ioniță entity; "Meta Certified" as the verifiable trust signal. The About
// page's SEO job is entity authority + the citable "cine este" answer, not
// commercial ranking (that's the service pages).
export const metadata: Metadata = {
  title: "Dezvoltator web și consultant marketing",
  description:
    "Sunt Mina Ioniță, dezvoltator web și consultant marketing Meta Certified. Din 2018 construiesc site-uri, magazine online și campanii pentru firme mici și mijlocii.",
  alternates: { canonical: "/despre" },
};

// Credibility figures — every one is backed by the CV.
const proof = [
  { value: "Meta", label: "Certified Digital Marketing Associate" },
  { value: "80+", label: "proiecte digitale livrate" },
  { value: "6+", label: "ani în web și marketing" },
  { value: "RO · CEE", label: "România și Europa Centrală" },
];

export default function DesprePage() {
  // Person extended with the CV's structured signals (brief §6bis.15).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    jobTitle: "Dezvoltator web și consultant marketing",
    description:
      "Dezvoltator web și consultant marketing Meta Certified, cu peste 80 de proiecte livrate din 2018.",
    url: `${site.url}/despre`,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "RO",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.school,
    },
    knowsAbout: skillGroups.flatMap((g) => g.items),
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      credentialCategory: "certificate",
    })),
    sameAs: [site.socials.linkedin, site.socials.github],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero: name + role + citable definition + proof row ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="hero-mark pointer-events-none absolute -right-24 top-10 aspect-[1104/425] w-[26rem] max-w-none select-none opacity-[0.07] sm:-right-16 sm:w-[40rem] lg:-right-8 lg:w-[52rem]"
        />

        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-20">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex gap-2">
              <li>
                <Link href="/" className="hover:text-ink">
                  Acasă
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">
                Despre mine
              </li>
            </ol>
          </nav>

          <div className="mt-12 max-w-4xl">
            <p className="text-eyebrow font-medium uppercase text-gold-deep">
              Despre mine
            </p>
            <h1 className="mt-5 font-display text-hero text-balance">
              Mina Ioniță
            </h1>
            <p className="mt-4 font-display text-title text-gold-deep">
              Dezvoltator web · Consultant marketing · Meta Certified
            </p>

            {/* Definition block — the self-contained answer AI retrieval lifts
                for "cine este Mina Ioniță" (brief §6bis.2). */}
            <p className="mt-8 max-w-2xl text-lead text-muted text-pretty">
              Construiesc site-uri de prezentare și magazine online pentru firme
              mici și mijlocii, apoi le scot în față cu campanii pe Meta și
              Google. Din 2018 am livrat peste 80 de proiecte — întâi ca
              programator, apoi doi ani pe partea de marketing, lucrând cu cele
              mai mari companii din România.
            </p>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-10 lg:grid-cols-4">
            {proof.map((p) => (
              <div key={p.label}>
                <dt className="sr-only">{p.label}</dt>
                <dd>
                  <span className="tabular block font-display text-display leading-none text-gold-deep">
                    {p.value}
                  </span>
                  <span className="mt-3 block text-xs leading-snug text-muted">
                    {p.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Story: the journey, with a pull-quote as the turn ── */}
      <section
        aria-labelledby="poveste"
        className="border-y border-rule bg-cream-sunk"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 id="poveste" className="sr-only">
            Povestea mea
          </h2>

          <div className="mx-auto max-w-2xl">
            <p className="text-lead text-ink text-pretty">
              Am scris prima pagină de HTML în liceu. Nu mi-o ceruse nimeni și nu
              era pentru școală. Îmi plăcea că scriam ceva seara și a doua zi
              exista pe internet, iar oricine îl putea deschide. Apoi a venit
              CSS, apoi JavaScript.
            </p>

            <p className="mt-6 leading-relaxed text-muted text-pretty">
              După liceu am dat la teologie. Toată lumea mă întreabă cum se leagă
              cu programarea. Sincer? Nu prea se leagă. Dar nu am lăsat codul
              nicio clipă: am făcut cursuri, am citit, am construit proiecte doar
              pentru mine. Voiam să fiu bun, nu să mă descurc.
            </p>

            <p className="mt-6 leading-relaxed text-muted text-pretty">
              Prima slujbă adevărată a fost tot în web: am construit peste 30 de
              magazine WordPress, WooCommerce și Shopify pentru firme mici din
              România. Discutam direct cu proprietarii — scope, buget, ce vor de
              la site. Așa am descoperit că partea grea nu e codul, ci să
              transformi un site într-un canal care chiar aduce clienți.
            </p>
          </div>

          {/* The line everything else on the site turns on. */}
          <figure className="mx-auto my-16 max-w-3xl border-l-2 border-gold pl-6 sm:pl-10">
            <blockquote className="font-display text-display text-ink text-balance">
              Nimeni nu întreba dacă îți place. Toată lumea întreba ce arată
              cifrele.
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted">
              Ce am învățat la Meta, în cei doi ani din Polonia.
            </figcaption>
          </figure>

          <div className="mx-auto max-w-2xl">
            <p className="leading-relaxed text-muted text-pretty">
              Am trecut apoi de la construit la vândut: am condus o echipă de
              șase oameni și un portofoliu de clienți, cu peste 80 de proiecte
              livrate. Iar de acolo a început adevărata cursă — un rol pe
              marketing la Meta, din Gdańsk, doi ani, cu cele mai mari companii
              din România, din industrii care nu semănau deloc între ele. Le-am
              ajutat să crească, iar eu am crescut odată cu ele.
            </p>

            <p className="mt-6 leading-relaxed text-muted text-pretty">
              Brandul Mi s-a născut din Mina Web Company, ca să duc mai departe
              exact asta. O companie mare are o echipă întreagă care îi spune ce
              să repare. O firmă mică are un singur om, care trebuie să le știe
              pe toate și pe care nu-l sfătuiește nimeni. Eu îi dau ce am învățat
              lucrând pentru cei mari — și îmi testez metoda pe propriul produs,
              Parcly, unde banii și riscul sunt ale mele.
            </p>
          </div>
        </div>
      </section>

      {/* ── Experience (proof) ── */}
      <section
        aria-labelledby="experienta"
        className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow font-medium uppercase text-gold-deep">
              Experiență
            </p>
            <h2
              id="experienta"
              className="mt-4 font-display text-display text-balance"
            >
              Unde am lucrat și ce am dus
            </h2>
          </div>
          <a
            href="/mina-ionita-cv.pdf"
            download
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-rule-strong px-5 text-sm text-ink transition-colors duration-200 hover:border-gold hover:bg-cream-sunk sm:self-auto"
          >
            <Download className="size-4 text-gold-deep" strokeWidth={1.5} aria-hidden />
            Descarcă CV-ul (PDF)
          </a>
        </div>

        <div className="mt-14 space-y-12">
          {experience.map((job) => (
            <article
              key={`${job.company}-${job.period}`}
              className="grid gap-x-10 gap-y-4 border-t border-rule pt-8 sm:grid-cols-[13rem_1fr]"
            >
              <div>
                <p className="tabular text-eyebrow font-medium uppercase text-gold-deep">
                  {job.period}
                </p>
                <p className="mt-2 text-xs text-muted">{job.location}</p>
              </div>
              <div>
                <h3 className="font-display text-title text-ink">{job.role}</h3>
                <p className="mt-1 text-sm text-muted">{job.company}</p>
                <ul className="mt-5 space-y-2.5">
                  {job.points.map((pt, i) => (
                    <li
                      key={i}
                      className="relative pl-5 text-sm leading-relaxed text-muted text-pretty before:absolute before:left-0 before:top-[0.55rem] before:size-1.5 before:rounded-full before:bg-gold/60"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Skills · certifications · education (proof) ── */}
      <section
        aria-labelledby="competente"
        className="border-t border-rule bg-cream-sunk"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 id="competente" className="sr-only">
            Competențe, certificări și educație
          </h2>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h3 className="text-eyebrow font-medium uppercase text-gold-deep">
                Competențe
              </h3>
              <dl className="mt-6 space-y-6">
                {skillGroups.map((g) => (
                  <div key={g.title}>
                    <dt className="text-sm font-medium text-ink">{g.title}</dt>
                    <dd className="mt-2.5">
                      <ul className="flex flex-wrap gap-1.5">
                        {g.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-rule-strong bg-cream px-2.5 py-0.5 text-xs text-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="text-eyebrow font-medium uppercase text-gold-deep">
                Certificări & educație
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="border-l-2 border-gold pl-4">
                  <p className="text-sm font-medium text-ink">{education.degree}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {education.school} · {education.period}
                  </p>
                </li>
                {certifications.map((c) => (
                  <li key={c.title} className="border-l-2 border-rule-strong pl-4">
                    <p className="text-sm text-ink">{c.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {c.issuer} · <span className="tabular">{c.period}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-display text-balance">
            Ai un proiect? Hai să vedem ce se poate face.
          </h2>
          <p className="mt-5 text-lead text-muted text-pretty">
            Primul pas e un audit gratuit de 30 de minute. Îți spun exact unde
            pierzi clienți și ce aș repara întâi — lista rămâne a ta, indiferent
            dacă lucrăm împreună.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href={primaryCta.href} className="px-8">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/poveste" variant="secondary">
              Parcurge povestea pe scroll
            </ButtonLink>
            <ButtonLink href="/portofoliu" variant="secondary">
              Vezi portofoliul
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
