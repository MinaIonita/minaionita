import type { Metadata } from "next";
import { CookiePreferencesButton } from "@/components/cookie-consent";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description:
    "Ce cookie-uri folosește minaionita.ro, în ce scop și cum îți poți gestiona preferințele.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cookies" },
};

// ⚠️ TODO(mina): de trecut pe la un jurist înainte de lansare. Bannerul de
// consimțământ (Consent Mode v2, brief §5ter) e implementat și descris mai jos.
export default function CookiesPage() {
  return (
    <LegalPage title="Politica de cookies" updated="iulie 2026">
      <p>
        Site-ul <strong>minaionita.ro</strong> folosește cookie-uri și tehnologii
        similare ca să funcționeze corect, să măsoare performanța și, cu acordul
        tău, pentru marketing.
      </p>

      <h2>Ce sunt cookie-urile</h2>
      <p>
        Cookie-urile sunt fișiere mici stocate în browserul tău. Unele sunt
        necesare pentru funcționarea site-ului, altele ne ajută să înțelegem cum
        e folosit sau să măsurăm campaniile.
      </p>

      <h2>Ce tipuri folosim</h2>
      <ul>
        <li>
          <strong>Necesare:</strong> fac site-ul să funcționeze (nu se pot dezactiva).
        </li>
        <li>
          <strong>De analiză:</strong> ne arată cum e folosit site-ul, ca să îl
          îmbunătățim. Se activează doar cu acordul tău.
        </li>
        <li>
          <strong>De marketing:</strong> măsoară și optimizează campaniile pe
          Google și Meta. Se activează doar cu acordul tău.
        </li>
      </ul>

      <h2>Cum îți gestionezi preferințele</h2>
      <p>
        La prima vizită îți alegi categoriile din bannerul de consimțământ.
        Alegerea se ține șase luni, iar până o faci nu se încarcă nimic în afară
        de cookie-urile necesare. O poți schimba oricând de aici:
      </p>
      <p>
        <CookiePreferencesButton className="cursor-pointer font-medium text-gold-deep underline underline-offset-4 hover:no-underline">
          Deschide preferințele de cookies
        </CookiePreferencesButton>
      </p>
      <p>
        Poți și să îți ștergi cookie-urile din setările browserului. Blocarea
        celor necesare poate afecta funcționarea site-ului.
      </p>

      <h2>Consimțământ și tehnologii Google</h2>
      <p>
        Bannerul funcționează cu <strong>Google Consent Mode v2</strong>: până
        când accepți, semnalele de analiză și de publicitate sunt setate pe{" "}
        <em>denied</em>, deci nicio etichetă Google sau Meta nu poate trimite
        date. Păstrez și un jurnal al consimțămintelor — un identificator anonim,
        categoriile alese și momentul — ca dovadă de conformitate. Nu conține
        numele sau emailul tău.
      </p>

      <h2>Întrebări</h2>
      <p>
        Pentru orice nelămurire despre cookie-uri sau despre datele tale,
        scrie-mi la <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
