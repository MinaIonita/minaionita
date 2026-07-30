import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/button";
import { projects } from "@/lib/content";
import { getService, getServiceSlugs } from "@/lib/data";
import { businessNode, personNode } from "@/lib/schema";
import { primaryCta, site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Pre-render known services (brief §6bis.17: content in server HTML). Slugs come
// from the API (with static fallback), so admin-added services get pages too.
export async function generateStaticParams() {
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = await getService(slug);
  if (!d) return {};
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: `/servicii/${slug}` },
    openGraph: {
      title: `${d.seoTitle} | ${site.name}`,
      description: d.seoDescription,
      url: `${site.url}/servicii/${slug}`,
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const detail = await getService(slug);
  if (!detail) notFound();
  const service = { title: detail.title };

  const cats = detail.relatedCategories ?? [];
  const related = cats.length
    ? projects.filter((p) => cats.includes(p.category)).slice(0, 3)
    : [];

  // Service + FAQPage + BreadcrumbList (brief §6bis.15).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // The provider nodes travel with the page, so this URL answers "who
      // offers this, where, and on what credentials" without the crawler having
      // to have read the homepage first.
      personNode(),
      businessNode(),
      {
        "@type": "Service",
        "@id": `${site.url}/servicii/${slug}#service`,
        name: detail.seoTitle,
        description: detail.seoDescription,
        serviceType: service.title,
        url: `${site.url}/servicii/${slug}`,
        provider: { "@id": `${site.url}/#business` },
        areaServed: [
          { "@type": "Country", name: "România" },
          { "@type": "Place", name: "Europa" },
        ],
        // What the engagement actually contains — the list the page renders, so
        // an AI answer can say what's included rather than paraphrasing the pitch.
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Ce include ${service.title.toLowerCase()}`,
          itemListElement: detail.includes.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: (detail.faqs ?? []).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Acasă", item: site.url },
          { "@type": "ListItem", position: 2, name: "Servicii", item: `${site.url}/servicii` },
          { "@type": "ListItem", position: 3, name: service.title, item: `${site.url}/servicii/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Acasă
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/servicii" className="hover:text-ink">
                Servicii
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {service.title}
            </li>
          </ol>
        </nav>

        <div className="mt-10 max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-gold-deep">
            {service.title}
          </p>
          <h1 className="mt-5 font-display text-hero text-balance">{detail.h1}</h1>
          <p className="mt-7 text-lead text-muted text-pretty">{detail.lead}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href={primaryCta.href} className="px-8">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/servicii" variant="secondary">
              Toate serviciile
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Problem + what's included ── */}
      <section className="border-t border-rule bg-cream-sunk">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="text-eyebrow font-medium uppercase text-gold-deep">
                Problema
              </p>
              <p className="mt-6 font-display text-title leading-relaxed text-ink text-pretty">
                {detail.problem}
              </p>
            </div>
            <div>
              <p className="text-eyebrow font-medium uppercase text-gold-deep">
                Ce include
              </p>
              <ul className="mt-6 space-y-3.5">
                {(detail.includes ?? []).map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-gold-deep"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="font-display text-display text-balance">Cum lucrăm</h2>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {(detail.process ?? []).map((step, i) => (
            <li key={step.title} className="bg-cream p-7">
              <span className="tabular font-display text-sm text-gold-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-title text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ (schema.org FAQPage) ── */}
      <section
        aria-labelledby="faq"
        className="border-t border-rule bg-cream-sunk"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <h2 id="faq" className="font-display text-display text-balance">
              Întrebări frecvente
            </h2>
            <dl className="max-w-2xl divide-y divide-rule border-t border-rule">
              {(detail.faqs ?? []).map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="font-display text-title text-ink">{f.q}</dt>
                  <dd className="mt-3 leading-relaxed text-muted text-pretty">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Related projects (proof) ── */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-eyebrow font-medium uppercase text-gold-deep">
                Proiecte relevante
              </p>
              <h2 className="mt-4 font-display text-display text-balance">
                Unde am folosit deja asta
              </h2>
            </div>
            <ButtonLink href="/portofoliu" variant="secondary">
              Tot portofoliul
            </ButtonLink>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="font-display text-display text-balance">
              Hai să vedem dacă ți se potrivește.
            </h2>
            <p className="mt-5 text-lead text-muted text-pretty">
              Un audit gratuit de 30 de minute și îți spun exact ce ai de făcut —
              plus o estimare reală de buget, dacă vrei să mergem mai departe.
            </p>
            <div className="mt-9">
              <ButtonLink href={primaryCta.href} className="px-8">
                {primaryCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
