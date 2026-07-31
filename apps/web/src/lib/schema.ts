import { faq, services } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * The identity nodes, exported so every page can carry them.
 *
 * They used to live only inside homeJsonLd(), while service pages referenced
 * `provider: { "@id": ".../#person" }` — a pointer to a node that appeared in no
 * graph on that page. A crawler or AI engine reading a single service URL got a
 * provider it could not resolve, which is exactly the page where "who does this
 * and can I recommend them" has to be answerable.
 */
export function personNode() {
  return {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    jobTitle: "Dezvoltator web și consultant marketing",
    description:
      "Dezvoltator web și consultant marketing Meta Certified, cu peste 80 de proiecte livrate din 2018.",
    url: site.url,
    mainEntityOfPage: `${site.url}/despre`,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "RO",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "Meta Certified Digital Marketing Associate",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Meta" },
    },
    sameAs: [site.socials.linkedin, site.socials.github],
    knowsAbout: services.map((s) => s.title),
  };
}

export function businessNode() {
  return {
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    founder: { "@id": `${site.url}/#person` },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "RO",
    },
    areaServed: [
      { "@type": "Country", name: "România" },
      { "@type": "Place", name: "Europa" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicii",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
          url: `${site.url}/servicii/${s.slug}`,
        },
      })),
    },
  };
}

/**
 * Homepage graph.
 *
 * FAQPage e inclus aici, nu doar pe paginile de serviciu: pagina principală e
 * cea mai des accesată de crawlere, iar perechile întrebare–răspuns sunt
 * unitatea pe care motoarele AI o extrag cel mai des. Fără ele, întrebările
 * directe („cât costă un site") nu găsesc pe pagină nimic de citat.
 */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      businessNode(),
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
