import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import { ContactDock } from "@/components/contact-dock";
import { CookieConsent } from "@/components/cookie-consent";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteProvider } from "@/components/site-provider";
import { CONSENT_COOKIE, consentBootstrap, parseConsent } from "@/lib/consent";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

// latin-ext carries the Romanian diacritics (ă î ș ț) — without it they fall
// back to a mismatched face mid-word.
// Cormorant Garamond is a light, high-contrast face — it needs 500/600 to hold
// weight at display sizes, so the variable font is loaded with those axes.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Async so the title/description reflect what's set in the admin settings.
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const full = `${site.name} — ${site.tagline}`;
  return {
    metadataBase: new URL(site.url),
    // The homepage title leads with the keyword, not the brand: nobody searches
    // "Mina Ioniță" yet, and brand-first spent the first 14 characters — the part
    // Google weighs most — on a name. Social cards keep brand-first (`full`),
    // where recognition matters more than ranking.
    title: { default: `${site.tagline} | ${site.name}`, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "ro_RO",
      url: site.url,
      siteName: site.name,
      title: full,
      description: site.description,
      // 1200x630 per brief §6bis.14
      images: [{ url: "/brand/og-default.jpg", width: 1200, height: 630, alt: full }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: site.description,
      images: ["/brand/og-default.jpg"],
    },
    alternates: {
      canonical: "/",
      languages: { "ro-RO": "/", "en-US": "/en" },
    },
    // Google Search Console ownership. Needed before the sitemap can be
    // submitted and before any indexing or Core Web Vitals data shows up.
    verification: {
      google: "u0ZCZjPFkWMswnwTA18h9j_Zdc0mMbLXQ07RP0iGRKI",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf9f5",
  // No maximum-scale / user-scalable: zoom must never be disabled (a11y).
  width: "device-width",
  initialScale: 1,
  // Draw under the notch/home indicator so the design can use env(safe-area-*).
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, cookieStore, headerList] = await Promise.all([
    getSiteSettings(),
    cookies(),
    headers(),
  ]);

  // Issued per request by proxy.ts; without it the CSP blocks our inline script.
  const nonce = headerList.get("x-nonce") ?? undefined;

  // Deciding this on the server means a visitor who already chose gets no banner
  // markup at all — nothing to hydrate, nothing to flash, no layout shift.
  const consent = parseConsent(cookieStore.get(CONSENT_COOKIE)?.value);

  return (
    <html
      lang="ro"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Consent Mode v2 defaults: inline, synchronous, before any tag or any
            Next.js module. Every ad/analytics signal starts denied, so a tracking
            ID pasted into the admin later cannot fire ahead of a choice. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: consentBootstrap }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <SiteProvider value={site}>
          <a
            href="#main"
            className="sr-only rounded-sm bg-ink px-4 py-2 text-cream focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
          >
            Sari la conținut
          </a>
          <HideOnAdmin>
            <SiteHeader />
          </HideOnAdmin>
          <main id="main" className="flex-1">
            {children}
          </main>
          <HideOnAdmin>
            <SiteFooter site={site} />
          </HideOnAdmin>
          <HideOnAdmin>
            <ContactDock />
          </HideOnAdmin>
          <HideOnAdmin>
            <CookieConsent initialOpen={consent === null} />
          </HideOnAdmin>
          <HideOnAdmin>
            <div className="grain-overlay" aria-hidden />
          </HideOnAdmin>
        </SiteProvider>
      </body>
    </html>
  );
}
