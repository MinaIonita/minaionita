/**
 * Contract templates per service type (brief §5bis). The framework clauses are
 * shared (Romanian Civil Code — freedom of contract); only the object differs.
 *
 * ⚠️ TODO(mina): these are a solid draft, but per the brief they must be checked
 * once by a lawyer before commercial use.
 */
export type ContractTemplate = {
  key: string;
  label: string;
  object: string;
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    key: "site-prezentare",
    label: "Creare site de prezentare",
    object:
      "Prestatorul se obligă să proiecteze, dezvolte și livreze un site de prezentare conform specificațiilor din Anexa 1, optimizat tehnic pentru viteză și indexare.",
  },
  {
    key: "magazin-online",
    label: "Creare magazin online",
    object:
      "Prestatorul se obligă să dezvolte și să livreze un magazin online funcțional, cu configurarea plăților, a livrării și a fluxului de comandă, conform Anexei 1.",
  },
  {
    key: "seo",
    label: "Optimizare SEO",
    object:
      "Prestatorul se obligă să presteze servicii de optimizare pentru motoarele de căutare, incluzând audit tehnic, optimizare on-page și raportare periodică, conform Anexei 1.",
  },
  {
    key: "ads",
    label: "Administrare campanii (Google / Meta Ads)",
    object:
      "Prestatorul se obligă să configureze, administreze și optimizeze campanii de publicitate online, cu raportare periodică a rezultatelor, conform Anexei 1. Bugetul de reclamă este suportat separat de Beneficiar.",
  },
  {
    key: "mentenanta",
    label: "Mentenanță și administrare site",
    object:
      "Prestatorul se obligă să asigure mentenanța tehnică a site-ului Beneficiarului — actualizări, backup, monitorizare și securitate — conform Anexei 1.",
  },
  {
    key: "ai",
    label: "Soluții AI (chatboți, automatizări)",
    object:
      "Prestatorul se obligă să dezvolte și să implementeze soluții bazate pe inteligență artificială (chatbot și/sau automatizări) conform specificațiilor din Anexa 1.",
  },
];

/** Standard clauses rendered in every contract (brief §5bis framework). */
export const STANDARD_CLAUSES: { title: string; body: string }[] = [
  {
    title: "Durata și termenele de execuție",
    body: "Contractul intră în vigoare la data semnării. Livrarea se face conform termenului de execuție convenit, pe etapele stabilite în Anexa 1.",
  },
  {
    title: "Prețul și modalitatea de plată",
    body: "Beneficiarul achită prețul convenit în modalitatea și la termenele stabilite. În raporturile B2B, termenul de plată nu depășește 60 de zile (Legea 72/2013); pentru întârziere se aplică penalitățile convenite, iar în lipsa unei prevederi, dobânda legală penalizatoare.",
  },
  {
    title: "Obligațiile părților",
    body: "Prestatorul livrează serviciile la standardele convenite și comunică transparent stadiul lucrării. Beneficiarul pune la dispoziție materialele, informațiile și accesele necesare și efectuează plățile la termen.",
  },
  {
    title: "Recepția livrabilelor",
    body: "Beneficiarul verifică livrabilul în termenul convenit. Dacă nu transmite obiecții în acest termen, livrabilul se consideră acceptat tacit.",
  },
  {
    title: "Proprietate intelectuală",
    body: "Drepturile asupra codului, designului și textelor livrate se transferă Beneficiarului la data plății integrale. Până la achitarea integrală, Prestatorul păstrează drepturile asupra livrabilelor.",
  },
  {
    title: "Confidențialitate",
    body: "Părțile păstrează confidențialitatea informațiilor la care au acces în executarea contractului și nu le divulgă terților fără acordul celeilalte părți.",
  },
  {
    title: "Răspundere",
    body: "Fiecare parte răspunde pentru neexecutarea obligațiilor asumate. Răspunderea Prestatorului este limitată la valoarea contractului, cu excepția cazurilor de culpă gravă.",
  },
  {
    title: "Încetare și reziliere",
    body: "Contractul poate înceta prin acordul părților sau prin reziliere, cu notificare prealabilă în termenul convenit, în caz de neexecutare culpabilă.",
  },
  {
    title: "Forță majoră și legea aplicabilă",
    body: "Niciuna dintre părți nu răspunde pentru neexecutarea cauzată de forță majoră. Contractul este guvernat de legea română, iar litigiile se soluționează pe cale amiabilă sau, în caz contrar, de instanțele competente.",
  },
  {
    title: "Protecția datelor (GDPR)",
    body: "Părțile prelucrează datele cu caracter personal conform Regulamentului (UE) 679/2016, detaliat în Anexa GDPR, parte integrantă a contractului.",
  },
];

export const GDPR_ANNEX = {
  title: "Anexa GDPR — clauză privind protecția datelor",
  body: "Temeiul prelucrării este executarea prezentului contract; orice prelucrare în alt scop necesită acord separat. Datele se stochează limitat la durata realizării obiectului contractului. Se interzice accesul terților neautorizați și se aplică măsuri tehnice și organizatorice adecvate. Se respectă drepturile persoanelor vizate (acces, rectificare, ștergere, portabilitate) și se notifică breșele de securitate în maximum 72 de ore. Pentru serviciile în care Prestatorul prelucrează date ale clienților finali în numele Beneficiarului se aplică și un acord de prelucrare operator–împuternicit.",
};
