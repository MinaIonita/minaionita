import * as Lucide from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { getServices } from "@/lib/data";
import { primaryCta, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Servicii — creare site-uri, magazine online și marketing",
  description:
    "Servicii de creare site-uri de prezentare, magazine online, SEO și campanii Meta și Google. Un singur om care duce proiectul cap-coadă, pentru firme mici și mijlocii.",
  alternates: { canonical: "/servicii" },
};

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Lucide as unknown as Record<string, Lucide.LucideIcon>)[name];
  return C ? <C className={className} strokeWidth={1.25} aria-hidden /> : null;
}

export default async function ServiciiPage() {
  const services = await getServices();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicii — Mina Ioniță",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.summary,
        url: `${site.url}/servicii/${s.slug}`,
        provider: { "@id": `${site.url}/#person` },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Acasă
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              Servicii
            </li>
          </ol>
        </nav>

        <div className="mt-10 max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-gold-deep">
            Servicii
          </p>
          <h1 className="mt-5 font-display text-hero text-balance">
            Tot ce ține de prezența ta online, dus de un singur om
          </h1>
          <p className="mt-7 max-w-2xl text-lead text-muted text-pretty">
            De la site sau magazin online până la campaniile care îl scot în
            față. Fiecare serviciu are pagina lui, cu proces și întrebări
            frecvente — iar prețul îl afli după un audit gratuit, nu aruncat din
            burtă.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            return (
              <li key={service.slug}>
                <Link
                  href={`/servicii/${service.slug}`}
                  className="group flex h-full flex-col bg-cream p-8 transition-colors duration-200 hover:bg-cream-sunk"
                >
                  <span className="flex size-11 items-center justify-center rounded-full border border-rule-strong text-gold-deep transition-colors duration-200 group-hover:border-gold group-hover:bg-cream">
                    <Icon name={service.icon ?? "Circle"} className="size-[18px]" />
                  </span>
                  <h2 className="mt-6 font-display text-title text-ink">
                    {service.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {service.summary}
                  </p>
                  <span
                    aria-hidden
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-deep"
                  >
                    Detalii
                    {(
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      >
                        <path
                          d="M3 8h10m0 0-4-4m4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-14">
          <ButtonLink href={primaryCta.href} className="px-8">
            {primaryCta.label}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
