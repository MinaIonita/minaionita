export type Site = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  city: string;
  country: string;
  legal: string;
  socials: { linkedin: string; github: string };
};

export const site = {
  name: "Mina Ioniță",
  // The <title> carries the keyword up front (brief §6bis.7); the story lives
  // in the H1 and the description.
  tagline: "Creare site-uri de prezentare și magazine online",
  // ~150 chars, keyword front-loaded, benefit-led (brief §6bis.7).
  description:
    "Creare site-uri de prezentare, magazine online și campanii pe Meta și Google care aduc clienți, nu doar vizite. Peste 80 de proiecte livrate din 2018.",
  url: "https://minaionita.ro",
  email: "contact@minaionita.ro",
  phone: "+40 749 561 519",
  phoneHref: "+40749561519",
  whatsapp: "40749561519",
  city: "București",
  country: "România",
  legal: "Ioniță Mina PFA · CAEN 6210",
  socials: {
    linkedin: "https://www.linkedin.com/in/minaionita",
    github: "https://github.com/minaionita",
  },
} as const satisfies Site;

/** Entry offer / primary CTA — carried over from minawebcomp.com (brief 3.1.1). */
export const primaryCta = {
  label: "Cere audit gratuit",
  sub: "30 de minute, fără obligații",
  href: "/contact",
} as const;
