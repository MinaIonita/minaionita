import type { ServiceRow } from "@/lib/admin-api";

/**
 * Publish-time SEO validator (brief §5quater.3 + §6bis checklist). Pure and
 * client-side — scores a service against the on-page rules and returns what's
 * missing, so the editor can block a weak publish.
 */
export type Check = {
  key: string;
  label: string;
  ok: boolean;
  hint: string;
};

export type SeoReport = {
  checks: Check[];
  passed: number;
  total: number;
  score: number; // 0–100
};

const words = (s?: string) => (s?.trim() ? s.trim().split(/\s+/).length : 0);
const len = (s?: string) => (s ?? "").trim().length;

export function validateService(svc: ServiceRow): SeoReport {
  const b = svc.body ?? {};
  const checks: Check[] = [
    {
      key: "seoTitle-len",
      label: "Title SEO între 50 și 60 de caractere",
      ok: len(b.seoTitle) >= 40 && len(b.seoTitle) <= 62,
      hint: `Acum: ${len(b.seoTitle)} caractere. Ideal 50–60, cu cuvântul cheie la început.`,
    },
    {
      key: "meta-len",
      label: "Meta description între 140 și 160 de caractere",
      ok: len(b.seoDescription) >= 120 && len(b.seoDescription) <= 165,
      hint: `Acum: ${len(b.seoDescription)} caractere. Ideal 140–155, cu un beneficiu.`,
    },
    {
      key: "h1",
      label: "H1 prezent și concis",
      ok: len(b.h1) > 0 && len(b.h1) <= 75,
      hint: len(b.h1) === 0 ? "Lipsește H1-ul." : "H1 prea lung — scurtează-l sub 75 de caractere.",
    },
    {
      key: "lead",
      label: "Răspuns direct sub H1 (blocul citabil de AI)",
      ok: words(b.lead) >= 20 && words(b.lead) <= 70,
      hint: `Acum: ${words(b.lead)} cuvinte. Ideal 2–3 propoziții care răspund complet la o întrebare.`,
    },
    {
      key: "problem",
      label: "Secțiune „Problema” prezentă",
      ok: words(b.problem) >= 15,
      hint: "Descrie concret durerea clientului, cu exemple.",
    },
    {
      key: "includes",
      label: "Minim 4 puncte în „Ce include”",
      ok: (b.includes ?? []).filter((x) => x.trim()).length >= 4,
      hint: `Acum: ${(b.includes ?? []).filter((x) => x.trim()).length}. Enumeră livrabilele concrete.`,
    },
    {
      key: "process",
      label: "Proces în minim 3 pași",
      ok: (b.process ?? []).filter((p) => p.title?.trim()).length >= 3,
      hint: `Acum: ${(b.process ?? []).length} pași.`,
    },
    {
      key: "faq",
      label: "FAQ cu minim 3 întrebări (schema FAQPage)",
      ok: (b.faqs ?? []).filter((f) => f.q?.trim() && f.a?.trim()).length >= 3,
      hint: `Acum: ${(b.faqs ?? []).filter((f) => f.q?.trim()).length} întrebări. Formulează-le cum caută oamenii.`,
    },
    {
      key: "slug",
      label: "URL scurt, descriptiv, cu cratime",
      ok: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(svc.slug) && svc.slug.length <= 60,
      hint: "Doar litere mici, cifre și cratime; scurt și cu cuvântul cheie.",
    },
    {
      key: "summary",
      label: "Sumar prezent (cardul de servicii)",
      ok: words(svc.summary) >= 8,
      hint: "Un rând care spune clar ce oferă serviciul.",
    },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  return { checks, passed, total, score: Math.round((passed / total) * 100) };
}

/** Below this, publishing is discouraged (soft-blocked with an override). */
export const MIN_PUBLISH_SCORE = 80;
