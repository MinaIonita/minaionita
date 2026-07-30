import Link from "next/link";
import { CookiePreferencesButton } from "@/components/cookie-consent";
import { Logo } from "@/components/logo";
import { services } from "@/lib/content";
import type { Site } from "@/lib/site";

const columns = [
  {
    title: "Servicii",
    links: services.map((s) => ({ href: `/servicii/${s.slug}`, label: s.title })),
  },
  {
    title: "Studio",
    links: [
      { href: "/portofoliu", label: "Portofoliu" },
      { href: "/proiecte-personale", label: "Proiecte personale" },
      { href: "/despre", label: "Despre mine" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter({ site }: { site: Site }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="dark" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Construiesc site-uri și magazine online care aduc clienți, nu doar vizite.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-eyebrow font-medium uppercase text-gold-light">
                {col.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-eyebrow font-medium uppercase text-gold-light">
              Contact
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-200 hover:text-cream"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="tabular transition-colors duration-200 hover:text-cream"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  className="transition-colors duration-200 hover:text-cream"
                >
                  WhatsApp
                </a>
              </li>
              <li className="pt-2">
                {site.city}, {site.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legal}
          </p>
          <div className="flex gap-6">
            <Link href="/confidentialitate" className="hover:text-cream">
              Confidențialitate
            </Link>
            <Link href="/cookies" className="hover:text-cream">
              Cookies
            </Link>
            {/* GDPR: withdrawing consent has to be as easy as giving it, so the
                banner is reachable from every page, not just at first visit. */}
            <CookiePreferencesButton className="cursor-pointer hover:text-cream">
              Preferințe cookies
            </CookiePreferencesButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
