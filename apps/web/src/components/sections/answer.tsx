import { ButtonLink } from "@/components/ui/button";

/**
 * The "Pe scurt" block (brief §6bis.3). Deliberately self-contained: it answers
 * "cine e Mina Ioniță și ce face" without needing the rest of the page, which
 * is the unit AI retrieval actually lifts. Story first, keywords carried inside
 * it — not agency boilerplate with keywords bolted on.
 */
export function Answer() {
  return (
    <section
      aria-labelledby="pe-scurt"
      className="border-y border-rule bg-cream-sunk"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-eyebrow font-medium uppercase text-gold-deep">
              Despre mine
            </p>
            <h2
              id="pe-scurt"
              className="mt-4 font-display text-display text-balance"
            >
              Cine sunt și cum lucrez
            </h2>
          </div>

          <div className="max-w-2xl">
            {/* Opens with the definition rather than the anecdote: the block is
                meant to answer "cine e Mina Ioniță și ce face" on its own, and a
                retrieval engine that lifts only the first paragraph used to get
                a lesson about metrics with no mention of the work. */}
            <p className="text-lead text-ink text-pretty">
              Sunt Mina Ioniță, dezvoltator web și consultant de marketing.
              Construiesc site-uri de prezentare și magazine online pentru firme
              mici și mijlocii din România și din Europa, apoi le aduc clienți cu
              campanii pe Meta și Google și cu optimizare SEO. Lucrez singur, de
              la prima discuție până la cifrele de după lansare.
            </p>
            <p className="mt-5 leading-relaxed text-muted text-pretty">
              La Meta am învățat un singur lucru, dar care le schimbă pe toate:
              nimeni nu se uită la cifre căutând confirmare. Le citește ca să
              afle ce nu merge — mai ales atunci când răspunsul nu-i convine.
            </p>
            <p className="mt-5 leading-relaxed text-muted text-pretty">
              Am adus obiceiul cu mine. De asta fiecare proiect pleacă de la
              mine cu urmărirea conversiilor instalată din prima zi și nu îți
              promit cifre înainte să am ce citi. Prefer să îți spun ce văd, nu
              ce vrei să auzi.
            </p>
            <p className="mt-5 leading-relaxed text-muted text-pretty">
              Și de asta nu vând site-uri la bucată. Aleg unealta după problemă:
              WordPress și WooCommerce unde sunt alegerea corectă, cod scris de la
              zero unde nu sunt. Sunt un singur om, dar pun AI-ul pe tot ce e
              repetitiv, așa că primești viteza unei echipe — fără cont manager
              între noi și fără adaos de agenție.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
              <ButtonLink href="/despre" variant="ghost">
                Citește povestea completă
              </ButtonLink>
              {/* The scroll-told version. Offered here rather than in the nav:
                  it's a destination for someone already interested, not a door
                  competing with the services for a first-time visitor. */}
              <ButtonLink href="/poveste" variant="ghost">
                Sau parcurge-o pe scroll
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
