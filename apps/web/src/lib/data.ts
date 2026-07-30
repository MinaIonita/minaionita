import "server-only";
import {
  type Project,
  projects as staticProjects,
  serviceDetails,
  services as staticServices,
  type ServiceDetail,
  testimonials as staticTestimonials,
  type Testimonial,
} from "@/lib/content";
import { type Site, site as staticSite } from "@/lib/site";

/**
 * Server-side content layer. Public pages fetch from the admin API so edits go
 * live, but always fall back to the static content if the API is unreachable —
 * the site must never break because the backend is down. Fetched server-side
 * (SSR), so SEO and the AI-citable HTML are preserved (brief §6bis.17).
 *
 * cache: "no-store" makes edits appear instantly. In production this should move
 * to ISR + on-demand revalidation (revalidatePath on save) for speed.
 */
const API = process.env.API_URL ?? "http://localhost:4000/api";

export type ServiceListItem = {
  slug: string;
  title: string;
  summary: string;
  icon?: string | null;
};

export type ServiceFull = ServiceDetail & {
  slug: string;
  title: string;
  summary: string;
  icon?: string | null;
};

export async function getServices(): Promise<ServiceListItem[]> {
  try {
    const res = await fetch(`${API}/content/services`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as ServiceListItem[];
    if (Array.isArray(rows) && rows.length) return rows;
    throw new Error("empty");
  } catch {
    return staticServices;
  }
}

export async function getService(slug: string): Promise<ServiceFull | null> {
  try {
    const res = await fetch(`${API}/content/services/${slug}`, { cache: "no-store" });
    if (res.ok) return (await res.json()) as ServiceFull;
  } catch {
    // fall through to static
  }
  const s = staticServices.find((x) => x.slug === slug);
  const d = serviceDetails[slug];
  if (!s || !d) return null;
  return { slug, title: s.title, summary: s.summary, icon: s.icon, ...d };
}

export async function getServiceSlugs(): Promise<string[]> {
  const list = await getServices();
  return list.map((s) => s.slug);
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API}/content/portfolio`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as Project[];
    if (Array.isArray(rows) && rows.length) return rows;
    throw new Error("empty");
  } catch {
    return staticProjects;
  }
}

/** Global site settings (contact, identity) merged over static defaults. */
export async function getSiteSettings(): Promise<Site> {
  try {
    const res = await fetch(`${API}/settings`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const all = (await res.json()) as { site?: Partial<Site> };
    if (all?.site) return { ...staticSite, ...all.site, socials: { ...staticSite.socials, ...all.site.socials } };
    throw new Error("no site key");
  } catch {
    return staticSite;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API}/content/testimonials`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as Testimonial[];
    if (Array.isArray(rows)) return rows;
    throw new Error("bad shape");
  } catch {
    return staticTestimonials;
  }
}
