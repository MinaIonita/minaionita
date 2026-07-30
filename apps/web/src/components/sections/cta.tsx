import { Check } from "lucide-react";
import { CtaForm } from "@/components/sections/cta-form";
import { getSiteSettings } from "@/lib/data";

// What the 30 minutes actually produce — concrete deliverables reduce the
// "what's the catch" friction on a free offer.
const deliverables = [
  "Unde pierzi vizitatori pe site și de ce pleacă",
  "Ce campanie îți arde bugetul fără să aducă clienți",
  "Primele trei lucruri de reparat, în ordinea în care le-aș face eu",
  "O estimare de buget reală, dacă vrei să mergem mai departe",
];

export async function Cta() {
  const site = await getSiteSettings();

  return (
    <section id="contact" className="border-t border-rule bg-cream-sunk">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <p className="text-eyebrow font-medium uppercase text-gold-deep">
              Audit gratuit · 30 de minute
            </p>
            <h2 className="mt-4 font-display text-display text-balance">
              Îți arăt unde pierzi clienți. Apoi decizi tu.
            </h2>
            <p className="mt-5 text-lead text-muted text-pretty">
              Mă uit la site-ul, la campaniile și la cifrele tale, live, împreună
              cu tine. Fără prezentare de vânzări și fără să te sun apoi
              săptămâni la rând.
            </p>

            <div className="mt-9">
              <p className="text-sm font-medium text-ink">Pleci cu:</p>
              <ul className="mt-4 space-y-3">
                {deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-gold-deep"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="text-pretty">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-10 space-y-4 border-t border-rule pt-8 text-sm">
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="text-gold-deep hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-muted">Telefon</dt>
                <dd>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="tabular text-gold-deep hover:underline"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-muted">Zonă</dt>
                <dd className="text-ink">
                  {site.city} — și la distanță, în toată Europa
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-rule bg-cream p-7 shadow-[0_18px_50px_-30px_rgba(20,20,15,0.4)] sm:p-10">
            <CtaForm />
          </div>
        </div>
      </div>
    </section>
  );
}
