import { faq } from "@/lib/content";

/**
 * Întrebări frecvente pe pagina principală (brief §6bis).
 *
 * Perechile explicite întrebare–răspuns sunt unitatea pe care motoarele AI o
 * extrag cel mai des: nu rezumă pagina, ci ridică răspunsul care se susține
 * singur. Fiecare răspuns e scris ca să poată fi citat rupt din context — fără
 * „cum spuneam mai sus", fără trimiteri la restul paginii.
 *
 * Întrebările sunt formulate exact cum le-ar tasta cineva într-un chat, nu cum
 * ar arăta un titlu de secțiune: „Cât costă un site de prezentare?", nu
 * „Prețuri".
 */
export function Faq() {
  return (
    <section
      aria-labelledby="intrebari-frecvente"
      className="border-t border-rule bg-cream-sunk"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-eyebrow font-medium uppercase text-gold-deep">
          Întrebări frecvente
        </p>
        <h2
          id="intrebari-frecvente"
          className="mt-4 max-w-2xl font-display text-display text-balance"
        >
          Ce mă întreabă lumea cel mai des
        </h2>

        <dl className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {faq.map((f) => (
            <div key={f.q} className="border-t border-rule pt-6">
              <dt className="font-display text-title text-ink text-balance">
                {f.q}
              </dt>
              <dd className="mt-3 leading-relaxed text-muted text-pretty">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
