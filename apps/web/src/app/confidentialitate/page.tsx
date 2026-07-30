import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum colectez, folosesc și protejez datele tale personale pe minaionita.ro, conform Regulamentului (UE) 679/2016 (GDPR).",
  robots: { index: false, follow: true },
  alternates: { canonical: "/confidentialitate" },
};

// ⚠️ TODO(mina): standard template, corect ca structură dar de trecut o dată pe
// la un jurist / DPO înainte de lansare (brief §5bis). Verifică datele PFA de mai jos.
export default function ConfidentialitatePage() {
  return (
    <LegalPage title="Politica de confidențialitate" updated="iulie 2026">
      <p>
        Această politică explică ce date personale colectez prin site-ul{" "}
        <strong>minaionita.ro</strong>, în ce scop și ce drepturi ai, conform
        Regulamentului (UE) 679/2016 (GDPR).
      </p>

      <h2>Cine sunt (operatorul de date)</h2>
      <p>
        {site.legal}, cu sediul în {site.city}, România. Mă poți contacta oricând
        la <a href={`mailto:${site.email}`}>{site.email}</a> pentru orice
        chestiune legată de datele tale.
      </p>

      <h2>Ce date colectez</h2>
      <ul>
        <li>
          <strong>Date din formularul de contact:</strong> nume, email, telefon
          (opțional), serviciul de interes și mesajul tău.
        </li>
        <li>
          <strong>Date tehnice și de trafic:</strong> adresă IP, tip de
          dispozitiv și browser, pagini vizitate, sursă de proveniență — colectate
          doar cu acordul tău pentru cookie-urile de analiză și marketing.
        </li>
      </ul>

      <h2>În ce scop</h2>
      <ul>
        <li>Ca să răspund la mesajul tău și să îți fac o ofertă (executarea unui contract sau demersuri precontractuale).</li>
        <li>Ca să înțeleg cum e folosit site-ul și să îl îmbunătățesc (interes legitim / consimțământ).</li>
        <li>Ca să măsor performanța campaniilor de marketing (doar cu consimțământ).</li>
      </ul>

      <h2>Cât timp păstrez datele</h2>
      <p>
        Datele din formular le păstrez atât cât e nevoie ca să răspund cererii
        tale și, dacă devenim colaboratori, pe durata contractului plus termenele
        legale de arhivare. Datele de analiză se păstrează conform setărilor
        instrumentelor folosite.
      </p>

      <h2>Cui le divulg</h2>
      <p>
        Nu vând și nu închiriez datele nimănui. Le pot procesa furnizori care mă
        ajută să operez site-ul (găzduire, email, instrumente de analiză), fiecare
        cu propriile garanții de protecție a datelor.
      </p>

      <h2>Drepturile tale</h2>
      <p>
        Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate
        și opoziție, precum și dreptul de a-ți retrage consimțământul oricând.
        Pentru oricare dintre ele, scrie-mi la{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Ai și dreptul de a
        depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării
        Datelor cu Caracter Personal (ANSPDCP).
      </p>

      <h2>Securitate</h2>
      <p>
        Aplic măsuri tehnice și organizatorice rezonabile pentru a-ți proteja
        datele împotriva accesului neautorizat, pierderii sau divulgării.
      </p>
    </LegalPage>
  );
}
