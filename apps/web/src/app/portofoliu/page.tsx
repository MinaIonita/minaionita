import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portofoliu",
  description:
    "Site-uri și magazine online livrate pentru clienți din România și Europa. Toate sunt live — intră și uită-te.",
  alternates: { canonical: "/portofoliu" },
};

export default async function PortofoliuPage() {
  const projects = await getProjects();
  // ItemList rather than per-project CreativeWork pages: there are no detail
  // pages to point a canonical at.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Portofoliu — Mina Ioniță",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.client,
        description: p.description,
        url: p.url,
        dateCreated: String(p.year),
        creator: { "@id": `${site.url}/#person` },
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
              Portofoliu
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 max-w-3xl font-display text-hero text-balance">
          {projects.length} site-uri livrate. Toate sunt live.
        </h1>
        <p className="mt-6 max-w-2xl text-lead text-muted text-pretty">
          Construcții navale, blană naturală, executori judecătorești, turism
          medical, un DJ din Italia. Nu am o nișă — am o metodă. Apasă pe
          oricare și vezi singur ce a ieșit.
        </p>
      </section>

      <PortfolioGrid projects={projects} />
    </>
  );
}
