import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/data";
import { site } from "@/lib/site";

/**
 * Only indexable, real pages. Legal pages are noindex, so they stay out;
 * admin/api/oferta are excluded in robots.ts.
 *
 * Services come from the same source the pages render from, rather than a
 * hardcoded list — the static `serviceDetails` keys used before would silently
 * drift the moment a service was added or renamed in the admin, publishing a
 * sitemap that pointed at 404s and omitted the new page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);

  // The portfolio has no per-project route yet (cards link to the live client
  // sites), so its freshness is what moves the index page.
  const newestProjectYear = projects.reduce(
    (max, p) => (typeof p.year === "number" && p.year > max ? p.year : max),
    0,
  );

  const routes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    // Contact and services carry the transactional intent — the pages a search
    // engine should reach for on "creare site" or "cere ofertă".
    { path: "/servicii", priority: 0.9, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
    { path: "/portofoliu", priority: 0.8, changeFrequency: "monthly" },
    { path: "/despre", priority: 0.7, changeFrequency: "yearly" },
    // A destination, not an entry point — indexable, but it should never
    // outrank the pages that carry the commercial intent.
    { path: "/poveste", priority: 0.5, changeFrequency: "yearly" },
    { path: "/proiecte-personale", priority: 0.6, changeFrequency: "monthly" },
    ...services.map((s) => ({
      path: `/servicii/${s.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];

  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(r.path === "/portofoliu" && newestProjectYear
      ? { lastModified: new Date(newestProjectYear, 11, 31) }
      : {}),
  }));
}
