import Image from "next/image";
import { personalProjects } from "@/lib/content";

/**
 * Brief §3.4 — own initiative, under the Mina brand.
 *
 * Cream, not ink: it sits directly under the video CTA, and two dark blocks
 * stacked read as one long void. The Parcly mark is ink+teal so it goes straight
 * onto the cream — no white plate. Its own teal stays out of the UI: teal
 * furniture next to our gold fights, and this is Mina's page presenting Parcly,
 * not Parcly's page.
 *
 * The mark's SVG viewBox was trimmed to the artwork — the source was a square
 * canvas roughly 73% empty, which rendered the wordmark thumbnail-sized no
 * matter what height it was given.
 */
export function PersonalProjects() {
  return (
    <section
      aria-labelledby="proiecte-personale"
      className="border-t border-rule bg-cream"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-eyebrow font-medium uppercase text-gold-deep">
              Proiecte personale
            </p>
            <h2
              id="proiecte-personale"
              className="mt-4 font-display text-display text-balance"
            >
              Construiesc și pentru mine, nu doar pentru clienți
            </h2>
          </div>

          <div className="max-w-2xl lg:pt-2">
            <p className="text-lead text-muted text-pretty">
              Produse proprii, sub brandul meu, cu banii și riscul meu. Le duc
              cap-coadă singur, exact ca pe proiectele clienților — doar că aici
              factura pentru fiecare greșeală o plătesc eu. E cel mai sincer test
              al metodei pe care ți-o propun ție.
            </p>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          {personalProjects.map((p) => (
            <article
              key={p.slug}
              className="rounded-xl border border-rule bg-cream-sunk p-8 sm:p-12"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-b border-rule pb-8">
                {p.logo && (
                  // Intrinsic ratio after the viewBox trim is ~2.9:1.
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={376}
                    height={129}
                    className="h-14 w-auto sm:h-[4.5rem]"
                  />
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted">{p.kicker}</span>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-xs text-gold-deep underline-offset-4 hover:underline"
                    >
                      {p.url.replace(/^https?:\/\//, "")}
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        <path
                          d="M5 11 11 5m0 0H6m5 0v5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="sr-only">(se deschide în tab nou)</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-9 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  <p className="font-display text-title text-ink text-pretty">
                    {p.pitch}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-rule-strong px-2.5 py-0.5 text-[0.7rem] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {p.body.map((para, i) => (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed text-muted text-pretty ${i > 0 ? "mt-4" : ""}`}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              <dl className="mt-10 grid gap-8 border-t border-rule pt-8 sm:grid-cols-3">
                {p.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="tabular block font-display text-3xl text-gold-deep">
                        {f.value}
                      </span>
                      <span className="mt-2 block text-xs leading-snug text-muted">
                        {f.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
