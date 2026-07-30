import { Check, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { siWhatsapp } from "simple-icons";
import { CtaForm } from "@/components/sections/cta-form";
import { getSiteSettings } from "@/lib/data";
import { site as staticSite } from "@/lib/site";

// The contact page's SEO job is transactional intent ("contact Mina Ioniță",
// "cere ofertă site") plus the citable answers about how to reach me and how
// fast I reply — not commercial ranking (that's the service pages).
export const metadata: Metadata = {
  title: "Contact — cere un audit gratuit",
  description:
    "Scrie-mi pentru un audit gratuit de 30 de minute: email, telefon sau WhatsApp. Îți răspund în maximum 24 de ore lucrătoare, fără prezentare de vânzări.",
  alternates: { canonical: "/contact" },
};

// What the 30 minutes actually produce — concrete deliverables reduce the
// "what's the catch" friction on a free offer.
const deliverables = [
  "Unde pierzi vizitatori pe site și de ce pleacă",
  "Ce campanie îți arde bugetul fără să aducă clienți",
  "Primele trei lucruri de reparat, în ordinea în care le-aș face eu",
  "O estimare de buget reală, dacă vrei să mergem mai departe",
];

// Sets expectations before the form, so nobody wonders what happens after send.
const nextSteps = [
  {
    title: "Îți răspund în 24 de ore",
    body: "Zile lucrătoare. Dacă e urgent, sună sau scrie pe WhatsApp — acolo răspund cel mai repede.",
  },
  {
    title: "Stabilim o discuție de 30 de minute",
    body: "Online, la ora care îți convine. Mă uit în avans la site și la campaniile tale ca să nu pierdem timpul cu prezentări.",
  },
  {
    title: "Pleci cu lista de reparat",
    body: "Ți-o las scrisă, indiferent dacă lucrăm împreună. Dacă mergem mai departe, primești o ofertă cu preț și termene fixe.",
  },
];

// Answers to what people actually ask before scriind — also the FAQPage
// structured data below, so AI retrieval can lift them (brief §6bis).
const faq = [
  {
    q: "Cât costă discuția inițială?",
    a: "Nimic. Auditul de 30 de minute este gratuit și fără obligații, iar lista de recomandări rămâne a ta chiar dacă nu lucrăm împreună.",
  },
  {
    q: "În cât timp primesc răspuns?",
    a: "În maximum 24 de ore lucrătoare la formular și email. Pe telefon și WhatsApp răspund de obicei în aceeași zi.",
  },
  {
    q: "Lucrezi și la distanță?",
    a: "Da. Sunt în București, dar lucrez la distanță cu clienți din toată România și din Europa. Majoritatea proiectelor se desfășoară integral online.",
  },
  {
    q: "Ce informații te ajută să îmi dai un răspuns concret?",
    a: "Adresa site-ului actual (dacă există), ce vrei să obții și un interval de buget. Cu astea trei îți pot spune la prima discuție dacă are sens și cam cât costă.",
  },
];

export default async function ContactPage() {
  // Contact data comes from the admin settings so an edit goes live everywhere.
  const site = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${staticSite.url}/contact#page`,
        url: `${staticSite.url}/contact`,
        name: "Contact — Mina Ioniță",
        description:
          "Cere un audit gratuit de 30 de minute: formular, email, telefon sau WhatsApp.",
        mainEntity: { "@id": `${staticSite.url}/#business` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Acasă",
            item: staticSite.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: `${staticSite.url}/contact`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const channels = [
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      note: "Răspuns în 24 de ore lucrătoare",
      icon: <Mail className="size-4 text-gold-deep" strokeWidth={1.5} aria-hidden />,
    },
    {
      label: "Telefon",
      value: site.phone,
      href: `tel:${site.phoneHref}`,
      note: "Luni–vineri, 09:00–18:00",
      icon: <Phone className="size-4 text-gold-deep" strokeWidth={1.5} aria-hidden />,
      tabular: true,
    },
    {
      label: "WhatsApp",
      value: "Scrie-mi pe WhatsApp",
      href: `https://wa.me/${site.whatsapp}`,
      note: "Cel mai rapid, inclusiv pentru mesaje scurte",
      external: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4 text-gold-deep">
          <path d={siWhatsapp.path} />
        </svg>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero: intent + the three ways to reach me ── */}
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
                Contact
              </li>
            </ol>
          </nav>

          <div className="mt-12 max-w-4xl">
            <p className="text-eyebrow font-medium uppercase text-gold-deep">
              Contact
            </p>
            <h1 className="mt-5 font-display text-hero text-balance">
              Hai să vorbim despre proiectul tău
            </h1>

            {/* The self-contained answer for "cum îl contactez pe Mina Ioniță". */}
            <p className="mt-8 max-w-2xl text-lead text-muted text-pretty">
              Scrie-mi prin formular, pe email, la telefon sau pe WhatsApp. Primul
              pas e un audit gratuit de 30 de minute în care îți spun exact unde
              pierzi clienți și ce aș repara întâi. Îți răspund în maximum 24 de
              ore lucrătoare.
            </p>
          </div>

          <ul className="mt-14 grid gap-4 border-t border-rule pt-10 sm:grid-cols-3">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex h-full flex-col rounded-xl border border-rule bg-cream p-5 transition-colors duration-200 hover:border-gold hover:bg-cream-sunk"
                >
                  <span className="flex items-center gap-2 text-eyebrow font-medium uppercase text-gold-deep">
                    {c.icon}
                    {c.label}
                  </span>
                  <span
                    className={`mt-3 text-sm font-medium text-ink ${c.tabular ? "tabular" : ""}`}
                  >
                    {c.value}
                    {c.external && <span className="sr-only"> (se deschide în tab nou)</span>}
                  </span>
                  <span className="mt-1.5 text-xs leading-snug text-muted">
                    {c.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The form, with the offer spelled out next to it ── */}
      <section
        aria-labelledby="formular"
        className="border-y border-rule bg-cream-sunk"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <p className="text-eyebrow font-medium uppercase text-gold-deep">
                Audit gratuit · 30 de minute
              </p>
              <h2
                id="formular"
                className="mt-4 font-display text-display text-balance"
              >
                Îți arăt unde pierzi clienți. Apoi decizi tu.
              </h2>
              <p className="mt-5 text-lead text-muted text-pretty">
                Mă uit la site-ul, la campaniile și la cifrele tale, live,
                împreună cu tine. Fără prezentare de vânzări și fără să te sun
                apoi săptămâni la rând.
              </p>

              <div className="mt-9">
                <p className="text-sm font-medium text-ink">Pleci cu:</p>
                <ul className="mt-4 space-y-3">
                  {deliverables.map((d) => (
                    <li key={d} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-gold-deep"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="text-pretty">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="mt-10 space-y-4 border-t border-rule pt-8 text-sm">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">Zonă</dt>
                  <dd className="text-ink">
                    {site.city} — și la distanță, în toată Europa
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">Firmă</dt>
                  <dd className="text-ink">{site.legal}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-rule bg-cream p-7 shadow-[0_18px_50px_-30px_rgba(20,20,15,0.4)] sm:p-10">
              <CtaForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── What happens after you send ── */}
      <section
        aria-labelledby="ce-urmeaza"
        className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24"
      >
        <p className="text-eyebrow font-medium uppercase text-gold-deep">
          Ce urmează
        </p>
        <h2
          id="ce-urmeaza"
          className="mt-4 max-w-2xl font-display text-display text-balance"
        >
          După ce trimiți mesajul
        </h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {nextSteps.map((step, i) => (
            <li key={step.title} className="border-t border-rule pt-6">
              <span className="tabular block font-display text-display leading-none text-gold-deep">
                0{i + 1}
              </span>
              <h3 className="mt-5 font-display text-title text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ — mirrors the FAQPage schema above ── */}
      <section
        aria-labelledby="intrebari"
        className="border-t border-rule bg-cream-sunk"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <p className="text-eyebrow font-medium uppercase text-gold-deep">
            Întrebări frecvente
          </p>
          <h2
            id="intrebari"
            className="mt-4 max-w-2xl font-display text-display text-balance"
          >
            Ce mă întreabă lumea înainte să scrie
          </h2>

          <dl className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {faq.map((f) => (
              <div key={f.q} className="border-t border-rule pt-6">
                <dt className="font-display text-title text-ink text-balance">
                  {f.q}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted text-pretty">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
