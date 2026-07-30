import { getTestimonials } from "@/lib/data";

/**
 * Reviews. Content comes from the admin (with static fallback). The seeded
 * quotes are still placeholders — replace them with real client words in the
 * admin before launch (see the warning in content.ts).
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="recenzii"
      className="border-t border-rule bg-cream"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase text-gold-deep">
            Recenzii
          </p>
          <h2 id="recenzii" className="mt-4 font-display text-display text-balance">
            Ce spun oamenii cu care am lucrat
          </h2>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {testimonials.map((t) => (
            <li key={t.author}>
              <figure className="flex h-full flex-col rounded-xl border border-rule bg-cream-sunk p-8 sm:p-10">
                <span
                  aria-hidden
                  className="font-display text-5xl leading-none text-gold/60"
                >
                  &ldquo;
                </span>
                <blockquote className="-mt-3 flex-1 font-display text-[1.15rem] leading-[1.4] text-ink text-pretty sm:text-[1.28rem]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-end justify-between gap-4 border-t border-rule pt-5">
                  <div>
                    <span className="block text-sm font-medium text-ink">
                      {t.author}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{t.role}</span>
                  </div>
                  {t.url && (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex shrink-0 items-center gap-1.5 text-xs text-gold-deep underline-offset-4 hover:underline"
                    >
                      Vezi proiectul
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
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
