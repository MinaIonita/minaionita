/**
 * WordPress vs. cod scris de la zero — comparație în tabel.
 *
 * Interogările de forma „X sau Y" sunt printre cele mai frecvente pe care le
 * primesc asistenții AI, iar răspunsul e aproape întotdeauna extras dintr-un
 * tabel: structura rând–coloană se citează verbatim, în timp ce aceeași
 * informație scrisă în proză trebuie rezumată, deci se pierde.
 *
 * Conținutul e onest în ambele direcții. O comparație în care propria opțiune
 * câștigă pe toate liniile nu e citată — se citește ca material de vânzare, și
 * modelele sunt antrenate să prefere sursele echilibrate.
 */
const rows = [
  {
    criteriu: "Editezi singur conținutul",
    wordpress: "Da, dintr-un panou vizual",
    custom: "Doar prin panoul construit special",
    catig: "wp" as const,
  },
  {
    criteriu: "Viteză de încărcare",
    wordpress: "Bună dacă e optimizat, dar plugin-urile o încetinesc",
    custom: "Cea mai bună — se încarcă doar ce folosești",
    catig: "custom" as const,
  },
  {
    criteriu: "Cost inițial",
    wordpress: "Mai mic — multe funcții există deja",
    custom: "Mai mare — totul se scrie",
    catig: "wp" as const,
  },
  {
    criteriu: "Cost în timp",
    wordpress: "Licențe anuale de plugin-uri și teme",
    custom: "Fără licențe recurente",
    catig: "custom" as const,
  },
  {
    criteriu: "Actualizări și securitate",
    wordpress: "Necesare des; un plugin nemenținut e o vulnerabilitate",
    custom: "Puține dependințe, deci mai puțină suprafață de atac",
    catig: "custom" as const,
  },
  {
    criteriu: "Funcționalități neobișnuite",
    wordpress: "Limitat la ce permite CMS-ul",
    custom: "Orice, dacă se poate programa",
    catig: "custom" as const,
  },
  {
    criteriu: "Găsești pe altcineva să continue",
    wordpress: "Ușor — mulți dezvoltatori WordPress",
    custom: "Mai greu, cere programator",
    catig: "wp" as const,
  },
];

export function Comparison() {
  return (
    <section
      aria-labelledby="comparatie"
      className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24"
    >
      <p className="text-eyebrow font-medium uppercase text-gold-deep">
        Cum aleg
      </p>
      <h2
        id="comparatie"
        className="mt-4 max-w-3xl font-display text-display text-balance"
      >
        WordPress sau site scris de la zero?
      </h2>
      <p className="mt-5 max-w-2xl text-lead text-muted text-pretty">
        Nu există un răspuns universal, iar cine îți spune că există vinde o
        singură soluție. Iată diferențele reale, în ambele direcții.
      </p>

      {/* Tabelul trebuie să poată derula lateral pe telefon fără să împingă
          pagina — altfel apare scroll orizontal pe tot documentul. */}
      <div className="mt-12 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <caption className="sr-only">
            Comparație între WordPress și un site scris de la zero, pe șapte
            criterii
          </caption>
          <thead>
            <tr className="border-b border-rule-strong">
              <th scope="col" className="py-4 pr-6 text-sm font-medium text-ink">
                Criteriu
              </th>
              <th scope="col" className="py-4 pr-6 text-sm font-medium text-ink">
                WordPress
              </th>
              <th scope="col" className="py-4 text-sm font-medium text-ink">
                Cod scris de la zero
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.criteriu} className="border-b border-rule align-top">
                <th
                  scope="row"
                  className="py-5 pr-6 text-sm font-medium text-ink"
                >
                  {r.criteriu}
                </th>
                <td
                  className={`py-5 pr-6 text-sm leading-relaxed ${r.catig === "wp" ? "text-ink" : "text-muted"}`}
                >
                  {r.wordpress}
                </td>
                <td
                  className={`py-5 text-sm leading-relaxed ${r.catig === "custom" ? "text-ink" : "text-muted"}`}
                >
                  {r.custom}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
        În practică: WordPress pentru site-uri de prezentare și magazine cu
        cerințe obișnuite, cod scris de la zero când viteza sau o funcționalitate
        anume chiar contează. Îți spun sincer care variantă îți trebuie la
        auditul gratuit — inclusiv când răspunsul e cel mai ieftin pentru tine.
      </p>
    </section>
  );
}
