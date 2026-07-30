/**
 * Seed content mirroring the brief's sitemap (§2) and homepage spec (§3.1).
 * This is the shape the NestJS/Prisma admin will serve later — the components
 * already consume it as data, so swapping the source is a fetch, not a rewrite.
 */

export type Service = {
  slug: string;
  /** lucide-react component name. */
  icon: string;
  title: string;
  summary: string;
};

/**
 * Per-service detail (brief §3.2 repeatable template): problem→solution, what's
 * included, process, FAQ (schema.org FAQPage), related projects by category.
 *
 * No hard prices by design — each page routes to the free audit for a real
 * estimate, which is the brand's whole promise ("nu îți promit cifre înainte
 * să am ce citi"). Keywords: seoTitle/seoDescription front-load the term.
 */
export type ServiceDetail = {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  /** Direct answer under H1 — the AI-citable block (brief §6bis.2). */
  lead: string;
  problem: string;
  includes: string[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  /** Project categories to surface as proof at the bottom. */
  relatedCategories: string[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "creare-site-prezentare": {
    seoTitle: "Creare site de prezentare",
    seoDescription:
      "Creare site de prezentare rapid, optimizat SEO și construit să aducă cereri de ofertă. Pe WordPress sau cod scris de la zero, după cum cere proiectul.",
    h1: "Creare site-uri de prezentare care aduc cereri de ofertă",
    lead: "Construiesc site-uri de prezentare pentru firme mici și mijlocii — rapide, indexabile în Google și gândite să transforme vizitatorii în clienți, nu doar să arate bine.",
    problem:
      "Un site frumos care nu aduce cereri de ofertă e o cheltuială, nu o investiție. Cele mai multe arată bine și se opresc aici: nu spun clar ce oferi, se încarcă greu și nu-i găsește nimeni în Google. Un site care nu îți spune de unde vin clienții e o vitrină scumpă.",
    includes: [
      "Design pe măsura brandului tău, nu un șablon recunoscut de la distanță",
      "Structură gândită pentru conversie — fiecare pagină duce spre o cerere de ofertă",
      "Optimizare SEO tehnică din construcție: viteză, structură și date pentru Google",
      "Texte scrise ca să fie citite și găsite, nu umplutură",
      "Formular de contact cu notificare instant și urmărirea conversiilor",
      "La fel de bun pe telefon ca pe desktop, cu Core Web Vitals verzi",
    ],
    process: [
      { title: "Audit & obiective", body: "Stabilim ce trebuie să facă site-ul și pentru cine, înainte să desenez o linie." },
      { title: "Structură & conținut", body: "Hartă de pagini, texte și imagini — scheletul pe care se construiește totul." },
      { title: "Design & dezvoltare", body: "Construiesc pe etape, cu link de test din prima săptămână. Vezi progresul, nu doar promisiunea." },
      { title: "Lansare & măsurare", body: "Public, cu urmărirea conversiilor instalată, apoi urmăresc ce aduce clienți." },
    ],
    faqs: [
      { q: "Cât durează un site de prezentare?", a: "De obicei 2–4 săptămâni, în funcție de numărul de pagini și de cât de pregătit e conținutul. Îți dau un termen ferm după audit." },
      { q: "Pe ce e construit site-ul?", a: "WordPress unde are sens, sau cod scris de la zero unde ai nevoie de ceva ce un CMS nu poate face. Aleg unealta după proiect, nu invers." },
      { q: "Cât costă un site de prezentare?", a: "Depinde de proiect. Pleci cu o estimare reală după auditul gratuit de 30 de minute, nu cu un preț aruncat din burtă." },
      { q: "Pot să administrez site-ul singur după livrare?", a: "Da. Îți predau un site pe care poți edita textele și imaginile fără să mă suni de fiecare dată." },
    ],
    relatedCategories: ["Website", "Corporate", "Servicii"],
  },
  "creare-magazine-online": {
    seoTitle: "Creare magazin online",
    seoDescription:
      "Creare magazin online pe WooCommerce sau platformă proprie: checkout fără fricțiune, plăți, curieri și feed-uri pentru Google și Meta. Construit să vândă.",
    h1: "Creare magazine online construite să vândă",
    lead: "Construiesc magazine online pe WooCommerce sau pe platformă proprie, cu un checkout fără fricțiune, plăți și curieri integrate și feed-uri corecte pentru Google și Meta — ca produsele să se și vândă, nu doar să se afișeze.",
    problem:
      "Un magazin online nu are nevoie doar de produse frumos aranjate. Are nevoie de un checkout scurt, de feed-uri corecte pentru Google Shopping și Meta, de plăți și curieri care merg fără să sune clientul la tine. Fără ele, coșul se abandonează și campaniile ard bani degeaba.",
    includes: [
      "Magazin pe WooCommerce sau platformă proprie, în funcție de volum",
      "Checkout scurt, optimizat pentru finalizarea comenzii",
      "Plăți online și ramburs, cu integrare de curieri",
      "Feed de produse pentru Google Shopping și catalog Meta",
      "Urmărirea conversiilor și a evenimentelor de e-commerce din prima zi",
      "Structură SEO pentru pagini de produs și de categorie",
    ],
    process: [
      { title: "Audit & obiective", body: "Ce vinzi, cui, cu ce marje — de aici pornește tot, nu de la template." },
      { title: "Structură catalog", body: "Categorii, filtre și pagini de produs gândite pentru cum caută cumpărătorii tăi." },
      { title: "Dezvoltare & integrări", body: "Plăți, curieri, facturare și feed-uri, testate cap-coadă înainte de lansare." },
      { title: "Lansare & măsurare", body: "Public, cu tracking-ul de e-commerce instalat, ca să vezi exact ce aduce vânzări." },
    ],
    faqs: [
      { q: "WooCommerce sau altă platformă?", a: "WooCommerce acoperă majoritatea magazinelor din România. Dacă ai depășit-o ca volum sau ai nevoi speciale, construiesc o platformă proprie." },
      { q: "Se integrează cu curierii și cu facturarea?", a: "Da — curieri, plăți online și ramburs, plus facturare (SmartBill/Oblio) după caz." },
      { q: "Pot importa produsele din magazinul vechi?", a: "De obicei da, cu tot cu poze, prețuri și specificații, ca să nu le urci manual." },
      { q: "Cât costă un magazin online?", a: "Depinde de numărul de produse și de integrări. Primești o estimare reală după auditul gratuit." },
    ],
    relatedCategories: ["E-commerce"],
  },
  "optimizare-seo": {
    seoTitle: "Optimizare SEO",
    seoDescription:
      "Optimizare SEO pentru Google și pentru răspunsurile AI: audit tehnic, cuvinte cheie pe intenție comercială, conținut și structură care aduc clienți, nu trafic gol.",
    h1: "Optimizare SEO pentru Google și pentru răspunsurile AI",
    lead: "Optimizez site-uri ca să apară în Google și să fie citate în AI Overviews și ChatGPT — pe cuvinte care aduc clienți, nu trafic gol. Din 2018 lucrez pe măsurabil: poziții, click-uri și conversii, nu promisiuni.",
    problem:
      "Poți avea cel mai frumos site și tot să nu te găsească nimeni. Iar în 2026 SEO nu mai înseamnă doar poziții în Google: aproape jumătate din căutări afișează un răspuns AI, iar site-urile citate acolo primesc mai multe click-uri decât poziția întâi clasică. Cine optimizează doar pentru Google clasic pierde jumătate din joc.",
    includes: [
      "Audit tehnic — viteză, indexare, structură, ce te ține în urmă",
      "Cuvinte cheie pe intenție comercială, nu pe volum gol",
      "Optimizare on-page: title, meta, structură, linkuri interne",
      "Conținut construit ca să fie citat de AI: răspuns direct, date proprii, FAQ",
      "Structură pentru AI Overviews, ChatGPT și Perplexity",
      "Raportare lunară: poziții, click-uri și impresii în AI",
    ],
    process: [
      { title: "Audit SEO", body: "Găsesc exact ce te ține în urmă — tehnic, de conținut și de autoritate." },
      { title: "Strategie de cuvinte cheie", body: "Aleg termenii care aduc clienți și construiesc harta de conținut în jurul lor." },
      { title: "Implementare", body: "On-page, conținut și tehnic — reparate în ordinea impactului." },
      { title: "Monitorizare", body: "Urmăresc poziții și citări AI lună de lună și ajustez pe date." },
    ],
    faqs: [
      { q: "În cât timp văd rezultate la SEO?", a: "De obicei primele mișcări în 3–6 luni. SEO nu e un buton, e o dobândă compusă — dar când vine, rămâne." },
      { q: "Garantezi poziția întâi în Google?", a: "Nu, și fugi de cine îți garantează. Nimeni nu controlează algoritmul Google. Ce pot garanta e o muncă făcută corect și raportată transparent." },
      { q: "Ce sunt AI Overviews și de ce contează?", a: "Sunt răspunsurile pe care Google le generează cu AI deasupra rezultatelor clasice. Optimizez conținutul ca să fii citat acolo, unde e tot mai mult trafic." },
      { q: "Faceți SEO local?", a: "Da. Pentru firme cu clienți dintr-un oraș, optimizez și Google Business Profile plus paginile locale." },
    ],
    relatedCategories: ["Website", "E-commerce"],
  },
  "google-ads": {
    seoTitle: "Campanii Google Ads",
    seoDescription:
      "Campanii Google Ads — Search, Shopping și Performance Max — cu urmărirea conversiilor corectă și buget optimizat pe ROAS. Clienți, nu doar click-uri.",
    h1: "Campanii Google Ads care aduc clienți, nu doar click-uri",
    lead: "Construiesc și optimizez campanii Google Ads — Search, Shopping și Performance Max — cu urmărirea conversiilor instalată corect și bugetul urmărit până la vânzare. Fără click-uri irosite pe cuvinte care nu cumpără.",
    problem:
      "Google Ads îți poate aduce clienți de mâine — sau îți poate arde bugetul pe click-uri care nu cumpără niciodată. Diferența nu o face bugetul, ci structura contului și urmărirea corectă a conversiilor. Cele mai multe conturi cheltuie orbește, fără să știe care campanie a adus banii.",
    includes: [
      "Campanii Search, Shopping, Display și Performance Max",
      "Structură de cont gândită pe produsele și marjele tale",
      "Urmărirea conversiilor instalată și verificată corect",
      "Optimizare pe ROAS și CPA, nu pe click-uri",
      "Testare continuă de anunțuri și public",
      "Raportare clară: cât ai băgat, cât a ieșit",
    ],
    process: [
      { title: "Audit & obiective", body: "Ce vinzi, cu ce marjă, la ce cost per client îți iese — de aici pleacă bugetul." },
      { title: "Setup & tracking", body: "Cont structurat corect și urmărirea conversiilor verificată înainte de primul leu cheltuit." },
      { title: "Lansare & test", body: "Pornesc cu buget de test și las datele să arate ce merge." },
      { title: "Optimizare", body: "Tai ce arde bani, scalez ce aduce clienți, raportez transparent." },
    ],
    faqs: [
      { q: "Care e bugetul minim pentru Google Ads?", a: "Depinde de industrie și de concurență. Îți spun la audit dacă bugetul tău are sens sau e prea mic ca să conteze — cinstit, nu ca să te bag în campanie." },
      { q: "Bugetul de reclamă e separat de onorariul tău?", a: "Da. Bugetul de Ads merge direct la Google. Eu iau onorariul pentru administrare și optimizare." },
      { q: "În cât timp văd rezultate?", a: "Google Ads aduce trafic imediat, dar primele săptămâni sunt de învățare pentru algoritm. Rezultatele stabile vin după ce se adună date." },
      { q: "Google Ads sau Meta Ads?", a: "Google prinde oameni care caută activ ce vinzi. Meta îi găsește înainte să caute. De multe ori răspunsul e amândouă — îți spun la audit ce ți se potrivește." },
    ],
    relatedCategories: ["E-commerce", "Turism"],
  },
  "meta-ads": {
    seoTitle: "Campanii Meta Ads (Facebook & Instagram)",
    seoDescription:
      "Campanii Meta Ads pe Facebook și Instagram, de la un consultant Meta Certified: public construit din date, creative testate și conversii urmărite corect.",
    h1: "Campanii Meta Ads pe Facebook și Instagram",
    lead: "Construiesc campanii Meta Ads pentru Facebook și Instagram cu public construit din date, creative testate A/B și evenimente de conversie urmărite corect. Sunt Meta Certified Digital Marketing Associate și am lucrat doi ani pe conturi Meta la scară.",
    problem:
      "Boost la postare nu e strategie. Meta Ads aduce clienți când ai public construit din date reale, creative testate și pixelul plus Conversions API instalate corect — nu când dai bani pe reach. Diferența dintre o campanie care vinde și una care arde bugetul e munca dinaintea primului anunț.",
    includes: [
      "Campanii Facebook și Instagram cu obiective clare",
      "Public construit din date, nu din presupuneri",
      "Creative testate A/B, iterate pe rezultate",
      "Pixel și Conversions API instalate și verificate",
      "Optimizare pe ROAS, cu evenimente de conversie corecte",
      "Raportare clară pe fiecare campanie",
    ],
    process: [
      { title: "Audit & obiective", body: "Ce vrei să obții și la ce cost — plus ce ai deja instalat și ce lipsește." },
      { title: "Setup & tracking", body: "Pixel, Conversions API și evenimente verificate înainte să pornim." },
      { title: "Lansare & test", body: "Pornesc cu mai multe unghiuri de creative și public, și las datele să decidă." },
      { title: "Optimizare", body: "Scalez ce funcționează, opresc ce nu, raportez transparent." },
    ],
    faqs: [
      { q: "Ești certificat Meta?", a: "Da — Meta Certified Digital Marketing Associate, plus doi ani de lucru pe conturi Meta ale unora dintre cele mai mari companii din România." },
      { q: "Care e bugetul minim pentru Meta Ads?", a: "Depinde de obiectiv. Îți spun cinstit la audit dacă bugetul tău e suficient ca să adune datele de care are nevoie algoritmul." },
      { q: "Faci și creative-urile?", a: "Lucrez pe creative-urile tale sau coordonez producția lor. Testez mai multe variante — creative-ul e cel mai des factorul care decide." },
      { q: "Bugetul de reclamă e separat?", a: "Da, bugetul merge la Meta. Onorariul meu e pentru strategie, administrare și optimizare." },
    ],
    relatedCategories: ["E-commerce", "Turism"],
  },
  "solutii-ai": {
    seoTitle: "Soluții AI pentru business — chatboți și automatizări",
    seoDescription:
      "Soluții AI pentru business: chatboți pe datele tale și automatizări care preiau munca repetitivă. Fără hype — doar timp câștigat pe ce contează.",
    h1: "Soluții AI pentru business: chatboți și automatizări",
    lead: "Construiesc chatboți pe datele firmei tale și automatizări care preiau munca repetitivă — răspuns la întrebări frecvente, procesare de documente, generare de conținut de rutină. Nu ca să înlocuiesc oameni, ci ca să le rămână timp pentru ce cere un om.",
    problem:
      "AI-ul nu e magie și nu îți conduce firma singur. Dar există o grămadă de muncă repetitivă care îți mănâncă ziua — aceleași întrebări de la clienți, aceleași documente de procesat, aceleași texte de scris. Exact acolo AI-ul câștigă timp real, dacă e pus pe treabă corect.",
    includes: [
      "Chatbot antrenat pe datele și produsele tale, nu unul generic",
      "Automatizări pentru sarcini repetitive (n8n, integrări)",
      "Generare de conținut asistat, cu revizie umană",
      "Integrare cu site-ul, WhatsApp sau uneltele pe care le folosești deja",
      "Ținut sub control: AI-ul face munca de rutină, decizia rămâne a ta",
    ],
    process: [
      { title: "Audit & obiective", body: "Găsim împreună munca repetitivă care merită automatizată — și cea care nu." },
      { title: "Construcție", body: "Construiesc chatbotul sau automatizarea pe datele și fluxurile tale reale." },
      { title: "Integrare & test", body: "Îl leg de uneltele tale și îl testez pe cazuri reale înainte să meargă live." },
      { title: "Ajustare", body: "Urmăresc cum se comportă și îl reglez, ca să nu rămâi cu o jucărie." },
    ],
    faqs: [
      { q: "Chatbotul înțelege datele firmei mele?", a: "Da — îl antrenez pe produsele, serviciile și întrebările tale reale, nu pe un model generic care inventează răspunsuri." },
      { q: "AI-ul îmi înlocuiește angajații?", a: "Nu. Preia munca repetitivă ca oamenii tăi să facă partea care chiar cere un om. E o unealtă, nu un înlocuitor." },
      { q: "Se integrează cu ce am deja?", a: "De obicei da — site, WhatsApp, email, uneltele de lucru. Automatizările leagă ce ai, nu te obligă să schimbi tot." },
      { q: "Cât costă o soluție AI?", a: "Depinde de complexitate. Îți dau o estimare reală după ce vedem la audit ce ai de automatizat." },
    ],
    relatedCategories: [],
  },
};

export const services: Service[] = [
  {
    slug: "creare-site-prezentare",
    icon: "MonitorSmartphone",
    title: "Site-uri de prezentare",
    summary:
      "Rapid, indexabil, construit să transforme vizitatorii în cereri de ofertă. Pe WordPress sau scris de la zero — cum cere proiectul.",
  },
  {
    slug: "creare-magazine-online",
    icon: "ShoppingBag",
    title: "Magazine online",
    summary:
      "WooCommerce configurat pentru vânzare: feed-uri, plăți, curieri și un checkout fără fricțiune. Sau platformă proprie, dacă ai depășit-o.",
  },
  {
    slug: "optimizare-seo",
    icon: "TrendingUp",
    title: "Optimizare SEO",
    summary:
      "Poziții în Google și citări în AI Overviews — pe cuvinte care aduc clienți, nu trafic gol.",
  },
  {
    slug: "google-ads",
    icon: "Megaphone",
    title: "Google Ads",
    summary: "Search, Shopping, Display și PMax, cu buget urmărit până la vânzare.",
  },
  {
    slug: "meta-ads",
    icon: "Share2",
    title: "Meta Ads",
    summary: "Campanii Facebook și Instagram cu creative testate și public construit pe date.",
  },
  {
    slug: "solutii-ai",
    icon: "Bot",
    title: "Soluții AI pentru business",
    summary: "Chatboți și automatizări care preiau munca repetitivă din firma ta.",
  },
];

/**
 * Proof-of-breadth strip — the evidence behind "the tool gets picked for the
 * problem", which is what separates this from every WordPress shop in the market.
 *
 * `slug` maps to a simple-icons export (siReact, siPhp, …), so the marks are the
 * official shapes rather than approximations. Omit `slug` when no official mark
 * is available — Microsoft and OpenAI both had theirs pulled from the set, and
 * redrawing a trademark by hand is worse than showing the name.
 *
 * TODO(mina): confirm this list. It is inferred from the brief and from this
 * site's own stack — remove anything you would not defend in a call. Note the
 * Meta and Google marks are trademarks: showing them implies a relationship,
 * and Google only permits their badge for certified Partners.
 */
export type StackIcon = { slug?: string; label: string };

export const stack: StackIcon[] = [
  // Each of these is backed by a project in `projects` below.
  { slug: "siWordpress", label: "WordPress" },
  { slug: "siWoocommerce", label: "WooCommerce" },
  { slug: "siPhp", label: "PHP" },
  { slug: "siElementor", label: "Elementor" },
  { slug: "siAstro", label: "Astro" },
  { slug: "siTypescript", label: "TypeScript" },
  { slug: "siJavascript", label: "JavaScript" },
  { slug: "siGoogleanalytics", label: "Google Analytics" },
  { slug: "siGoogletagmanager", label: "Tag Manager" },
  { slug: "siGooglesearchconsole", label: "Search Console" },
  { slug: "siGoogleads", label: "Google Ads" },
  { slug: "siMeta", label: "Meta Ads" },
  // TODO(mina): nothing below this line is evidenced by a project yet. Keep
  // only what you can answer "where?" for — a strip claiming React while every
  // project is WordPress reads as a lie, and this site itself is the only
  // Next.js work so far.
  { slug: "siReact", label: "React" },
  { slug: "siNextdotjs", label: "Next.js" },
  { slug: "siNodedotjs", label: "Node.js" },
  { slug: "siMysql", label: "MySQL" },
  { label: "Power BI" },
  { slug: "siN8n", label: "n8n" },
];

/**
 * Brief §3.4 — separate from the client portfolio: what gets built from own
 * initiative, under the Mina brand. Doubles as proof of initiative for clients
 * and employers, and as the shelf for launching own products later.
 */
export type PersonalProject = {
  slug: string;
  name: string;
  logo?: string;
  status: "În lucru" | "Lansat" | "Arhivat";
  kicker: string;
  pitch: string;
  body: string[];
  facts: { value: string; label: string }[];
  tech: string[];
  url?: string;
};

export const personalProjects: PersonalProject[] = [
  {
    slug: "parcly",
    name: "Parcly",
    logo: "/brand/parcly-logo.svg",
    status: "În lucru",
    kicker: "Platformă SaaS · 2026",
    pitch: "Urci o mașină în 60 de secunde; site-ul tău o vinde non-stop, fără taxe per anunț.",
    body: [
      "Parcurile auto din România plătesc lunar sute de euro marketplace-urilor — abonament, plus taxă per anunț, plus promovare care se scumpește cu cât mașina e mai scumpă. Construiesc platforma altcuiva cu banii lor și rămân fără nimic al lor la final.",
      "Parcly e o platformă în abonament, verticalizată strict pe parcuri auto: dealerul își face cont singur, alege un template, își urcă mașinile din panou și e live pe domeniul lui în aceeași zi. Nu e un magazin generic adaptat pe mașini — câmpurile, badge-urile, finanțarea și fluxurile sunt gândite pentru cum vinde de fapt un parc.",
    ],
    facts: [
      { value: "392.000", label: "mașini rulate înmatriculate anual în România" },
      { value: "71,5%", label: "din piață e rulate, în creștere" },
      { value: "49–179 €", label: "pe lună, fără comision din vânzări" },
    ],
    tech: ["Next.js", "NestJS", "MySQL", "Multi-tenant"],
    // Domain is hers (nameservers ns1/ns2.minawebcomp.ro) but the document root
    // is still empty — this 403s until the platform is deployed.
    url: "https://parcly.ro",
  },
];

/** Brief §3.5 — timeline for the About page, editable from admin later. */
export type Milestone = {
  period: string;
  title: string;
  body: string;
};

export const timeline: Milestone[] = [
  {
    period: "Liceu",
    title: "Prima pagină de HTML",
    body: "Nu mi-o ceruse nimeni și nu era pentru școală. Apoi CSS, apoi JavaScript.",
  },
  {
    period: "Facultate",
    title: "Teologie, fără să las codul",
    body: "Am dat la teologie și am terminat teologie. În paralel am făcut cursuri și proiecte pentru mine, ca să ajung bun la programare, nu doar să mă descurc.",
  },
  {
    period: "Prima firmă",
    title: "Cu un prieten, de la zero",
    body: "Am deschis-o și am condus-o împreună. Fiind doar doi, am făcut tot: frontend, backend, design, marketing. Și antreprenoriat, învățat pe pielea mea.",
  },
  {
    period: "2 ani, Polonia",
    title: "Meta, pe marketing",
    body: "Am lucrat cu cele mai mari companii din România, din industrii foarte diferite. Le-am ajutat să crească și am crescut odată cu ele.",
  },
  {
    period: "Azi",
    title: "Mi",
    body: "Mina Web Company a devenit Mi. Duc mai departe ce am învățat lucrând pentru companii mari, la firme mici și mijlocii.",
  },
  {
    period: "În paralel",
    title: "Parcly",
    body: "Îmi construiesc propriul produs, o platformă pentru parcuri auto. Acolo banii și riscul sunt ale mele.",
  },
];

/**
 * CV data, lifted verbatim from "Mina Ionita CV.pdf" (§3.6). Facts only —
 * employer names, real dates, exact certification titles.
 *
 * NOTE(mina): two things the CV settles, both worth a look before launch:
 *  1. The Meta role is "Meta Marketing Pro" at Telus Digital (a Meta project),
 *     Aug 2023 – May 2025 — not direct employment by Meta. The homepage H1 says
 *     "Am lucrat la Meta"; this section shows the real employer, so the two
 *     should read consistently.
 *  2. The CV lists Iași as base; the site says București per your instruction.
 */
export type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
};

export const experience: Job[] = [
  {
    role: "Meta Marketing Pro",
    company: "Telus Digital — proiect Meta",
    location: "Gdańsk, Polonia",
    period: "aug. 2023 – mai 2025",
    points: [
      "Am administrat și crescut un portofoliu de advertiseri, cu planuri de cont pe mai multe trimestre, construite pe factorii reali de creștere ai fiecărui business.",
      "Am depășit constant țintele trimestriale de venit și de creștere, prin consultanță structurată și discuții de buget anual cu proprietarii de firme.",
      "Am construit și optimizat campanii pe platformele Meta — testare A/B continuă, segmentare de public și iterație de creative pentru mai multe conversii și ROAS mai bun.",
      "Am urmărit ROAS, CPA, CTR și rata de conversie ca să fundamentez deciziile și să arăt impactul măsurabil.",
    ],
  },
  {
    role: "Sales Manager",
    company: "Sinergo Data",
    location: "Iași",
    period: "sept. 2020 – iul. 2022",
    points: [
      "Am condus o echipă de 6 oameni și un portofoliu de clienți SMB români, livrând peste 80 de proiecte digitale și de e-commerce la timp și în buget.",
      "Am construit relații de consultant de încredere cu proprietarii, crescând retenția și veniturile recurente din conturile existente.",
      "Am dezvoltat strategii de vânzare pe mai multe trimestre — pipeline, forecasting, gestionarea obiecțiilor — care au dus la creștere semnificativă de venit.",
    ],
  },
  {
    role: "Front End Developer",
    company: "Sinergo Data",
    location: "Iași",
    period: "ian. 2018 – aug. 2020",
    points: [
      "Am construit și optimizat peste 30 de magazine WordPress, WooCommerce și Shopify pentru clienți SMB, cu accent pe rata de conversie și pe vânzări.",
      "Am lucrat direct cu proprietarii pe scope, cerințe și buget — primele conversații de account management și consultanță.",
      "Am implementat interfețe responsive în HTML, CSS și JavaScript și am integrat analytics și tracking pentru decizii pe date.",
    ],
  },
];

export type Credential = { title: string; issuer: string; period: string };

export const certifications: Credential[] = [
  { title: "Meta Certified Digital Marketing Associate", issuer: "Meta", period: "nov. 2024 – nov. 2026" },
  { title: "How to Set Up a Facebook Ads Campaign", issuer: "Coursera", period: "2024" },
  { title: "Design and Develop a Website Using Figma and CSS", issuer: "Coursera", period: "2024" },
  { title: "Web Design Course", issuer: "Swiss WebSchool", period: "2021" },
  { title: "PHP Development Course", issuer: "Wantsome", period: "2019" },
  { title: "DPO — Data Protection Officer", issuer: "Euro Market Solution", period: "2018" },
  { title: "ECDL", issuer: "ECDL", period: "2014" },
];

export const education = {
  degree: "Licență în Teologie",
  school: "Universitatea Alexandru Ioan Cuza, Iași",
  period: "în curs",
};

/** Grouped skills straight off the CV — this is the defensible tech list. */
export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Marketing & vânzări",
    items: [
      "Performance marketing",
      "Meta Ads",
      "Google Ads (Search, PMax)",
      "Optimizare ROAS / CPA / CTR",
      "Account planning",
      "Consultative sales",
      "Storytelling pe date",
    ],
  },
  {
    title: "Web & dezvoltare",
    items: ["HTML", "CSS", "JavaScript", "WordPress", "WooCommerce", "Shopify", "PHP", "Figma"],
  },
  {
    title: "Limbi",
    items: ["Română — nativ", "Engleză — fluent"],
  },
];

export type Stat = { value: string; label: string; note?: string };

/** Social proof carried over from minawebcomp.com (brief 3.1.1). */
export const stats: Stat[] = [
  { value: "80+", label: "proiecte livrate", note: "din 2018 până azi" },
  { value: "+38%", label: "creștere medie a conversiei", note: "măsurată pe proiectele urmărite" },
  { value: "7", label: "ani de experiență" },
  { value: "2", label: "piețe deservite", note: "România și Europa" },
];

/**
 * The real portfolio, lifted from minawebcomp.com/projects (an SPA — this had
 * to be rendered to be read, exactly the indexing problem the brief flags).
 * There are no per-project case-study pages: cards link to the live sites.
 *
 * NOTE(mina): 17 of these 18 are WordPress/Elementor. Miral Fashion and
 * Ikabane, named in the brief, are not on the MWC list at all. Neither is any
 * conversion metric — so the "+38%" claim has no evidence here.
 */
export type Project = {
  slug: string;
  /** lucide-static icon name, used by the generated cover art. */
  icon: string;
  /** One line on the cover, under the wordmark. */
  tagline: string;
  client: string;
  category: string;
  year: number;
  description: string;
  tech: string[];
  url: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "marman-comtrans",
    icon: "ship",
    tagline: "Construcții navale · structuri metalice",
    client: "Marman Comtrans",
    category: "Industrial",
    year: 2026,
    description:
      "Site pentru un constructor naval din Mangalia cu peste 30 de ani de activitate: construcții navale, structuri metalice și confecții personalizate, hale de 4.000 m² și cheu propriu la Marea Neagră. Construit de la zero, fără CMS.",
    tech: ["Cod scris de la zero", "JavaScript"],
    url: "https://marman.ro",
    featured: true,
  },
  {
    slug: "marian-deejay",
    icon: "music",
    tagline: "DJ evenimente · Italia & România",
    client: "Marian Deejay",
    category: "Website",
    year: 2026,
    description:
      "Site pentru un DJ profesionist activ în Italia, România și internațional — nunți, petreceri și evenimente corporate. Construit pe Astro, bilingv română–italiană, cu galerie, recenzii și rezervare directă.",
    tech: ["Astro", "TypeScript", "i18n"],
    url: "https://www.mariangheorghe.it",
    featured: true,
  },
  {
    slug: "ikabane",
    icon: "hotel",
    tagline: "Resort boutique 5 margarete · Neamț",
    client: "Ikabane Resort",
    category: "Turism",
    year: 2026,
    description:
      "Resort boutique de 5 margarete în Văratec, Neamț: patru unități de cazare, restaurant signature, piscină interioară cu apă sărată, jacuzzi și saună. Site construit în jurul rezervărilor directe, ca să nu plătească comision platformelor.",
    tech: ["WordPress", "Meta Ads", "Google Ads", "Site Kit"],
    url: "https://ikabane.ro",
    featured: true,
  },
  {
    slug: "miral-fashion",
    icon: "shirt",
    tagline: "Blană naturală & piele",
    client: "Miral Fashion",
    category: "E-commerce",
    year: 2024,
    description:
      "Magazin de modă cu blană naturală și piele — jachete, cojoace, căciuli de nurcă și vulpe, accesorii. WooCommerce cu catalog pe categorii adânci și promoții, dublat de campanii Meta.",
    tech: ["WordPress", "WooCommerce", "Elementor", "Meta Ads"],
    url: "https://miral-fashion.ro",
    featured: true,
  },
  {
    slug: "piacor",
    icon: "bus",
    tagline: "Transport persoane · Roman–Iași",
    client: "Piacor",
    category: "Transport",
    year: 2025,
    description:
      "Site pentru o firmă de transport persoane pe ruta Roman–Iași și retur, zilnic. Orar la vedere, închiriere de autocare, excursii școlare și tematice, plus blog pentru trafic organic pe căutări de curse.",
    tech: ["WordPress", "Elementor"],
    url: "https://piacor.ro",
  },
  {
    slug: "charlie-events",
    icon: "sparkles",
    tagline: "Agenție de evenimente · Iași",
    client: "Charlie Events",
    category: "Servicii",
    year: 2025,
    description:
      "Site pentru o agenție de evenimente din Iași, construit în jurul evenimentelor produse: fiecare are pagina lui, cu galerie și dată, iar prezentarea se face prin ce a livrat, nu prin ce promite.",
    tech: ["WordPress", "Elementor", "LayerSlider"],
    url: "https://charlieevents.ro",
  },
  {
    slug: "diana-ferrari",
    icon: "plane",
    tagline: "Program de călătorii & dezvoltare",
    client: "Diana Ferrari",
    category: "Servicii",
    year: 2025,
    description:
      "Site de prezentare și înscriere pentru un program de călătorii și dezvoltare personală, cu public în Italia și România. Structură de landing page, cu pâlnie clară către înscriere.",
    tech: ["WordPress", "WooCommerce", "Elementor"],
    url: "https://dianaferrari.it",
  },
  {
    slug: "daga-fashion",
    icon: "sparkles",
    tagline: "Couture la comandă",
    client: "Daga Fashion",
    category: "E-commerce",
    year: 2024,
    description:
      "Boutique de couture la comandă — rochii de seară, mireasă și botez. Magazin WooCommerce cu ghid de măsurători pentru croiala pe corp și un flux de comandă gândit pentru haine personalizate.",
    tech: ["WordPress", "WooCommerce", "PHP"],
    url: "https://dagafashion.ro",
  },
  {
    slug: "trabucuri-online",
    icon: "cigarette",
    tagline: "500+ trabucuri & accesorii",
    client: "Trabucuri Online",
    category: "E-commerce",
    year: 2024,
    description:
      "Magazin de nișă cu peste 500 de produse: trabucuri cubaneze, dominicane și nicaraguane, plus accesorii. Arbore de categorii pe mai multe niveluri, prag de transport gratuit și wishlist pentru clienți care revin.",
    tech: ["WordPress", "WooCommerce", "PHP"],
    url: "https://trabucuri-online.ro",
  },
  {
    slug: "addachic",
    icon: "dog",
    tagline: "Accesorii premium pentru animale",
    client: "Addachic",
    category: "E-commerce",
    year: 2025,
    description:
      "Magazin de accesorii premium pentru animale de companie. WooCommerce cu wishlist, reduceri procentuale, prag de transport gratuit și blog educativ despre rase și comportament.",
    tech: ["WordPress", "WooCommerce", "PHP"],
    url: "https://addachic.ro",
  },
  {
    slug: "dailani",
    icon: "leaf",
    tagline: "Cosmetice 100% naturale · BIO",
    client: "Dailani",
    category: "E-commerce",
    year: 2025,
    description:
      "Magazin pentru un producător român de cosmetice 100% naturale, cu ingrediente certificate BIO. Vânzare directă către consumator, catalog complet și analytics cu Facebook Pixel și Hotjar.",
    tech: ["Gomag", "JS", "GA4", "Hotjar"],
    url: "https://dailani.ro",
  },
  {
    slug: "cab-service",
    icon: "car",
    tagline: "Service clima auto autorizat R.A.R.",
    client: "CAB Service",
    category: "Website",
    year: 2024,
    description:
      "Site pentru un service auto de climatizare autorizat R.A.R. din București. Programare online, chat WhatsApp integrat, galerie de lucrări, carusel de recenzii și blog pentru trafic organic.",
    tech: ["WordPress", "Elementor", "PHP"],
    url: "https://cabservice.ro",
  },
  {
    slug: "dh-invest",
    icon: "building-2",
    tagline: "Antrepriză generală · 30+ lucrări",
    client: "DH Invest",
    category: "Website",
    year: 2024,
    description:
      "Site corporate pentru un antreprenor general din Iași — construcții rezidențiale, nerezidențiale și reabilitări. Galerie cu peste 30 de lucrări livrate și formulare de lead calibrate pentru clienți B2B.",
    tech: ["WordPress", "Elementor", "PHP"],
    url: "https://dhinvest.ro",
  },
  {
    slug: "albo-construct",
    icon: "building-2",
    tagline: "Construcții civile & industriale",
    client: "Albo Construct",
    category: "Website",
    year: 2025,
    description:
      "Site pentru o firmă de construcții din Suceava: antrepriză generală, construcții rezidențiale și industriale, proiectare și structuri metalice. Portofoliu filtrabil și formular instant legat de WhatsApp și Messenger.",
    tech: ["WordPress", "Elementor", "PHP"],
    url: "https://alboconstruct.ro",
  },
  {
    slug: "3d-case",
    icon: "home",
    tagline: "Arhitectură & proiectare rezidențială",
    client: "3D Case",
    category: "Website",
    year: 2024,
    description:
      "Site pentru un birou de arhitectură specializat în locuințe unifamiliale. Portofoliu cu specificații tehnice, pagini pentru proiectare, avize, urbanism și interioare, plus formular de consultanță.",
    tech: ["WordPress", "PHP"],
    url: "https://3dcase.ro",
  },
  {
    slug: "adminis",
    icon: "newspaper",
    tagline: "Știri locale & administrație publică",
    client: "Adminis",
    category: "Media",
    year: 2025,
    description:
      "Portal de știri și administrație publică pentru Moldova. Flux pe categorii, calendar de evenimente locale, secțiuni dedicate primăriilor și consiliului județean, newsletter și integrare completă cu rețelele sociale.",
    tech: ["WordPress", "Elementor", "PHP"],
    url: "https://adminis.ro",
  },
  {
    slug: "executorul-de-iasi",
    icon: "gavel",
    tagline: "Executor judecătoresc · Iași & Vaslui",
    client: "Executor judecătoresc",
    category: "Juridic",
    year: 2025,
    description:
      "Site public pentru un birou de executor judecătoresc din Iași și Vaslui. Servicii clar delimitate — executare directă și indirectă, notificări judiciare — cu formular pentru preluare rapidă.",
    tech: ["WordPress", "Elementor", "Yoast SEO", "LiteSpeed"],
    url: "https://executoruldeiasi.ro",
    featured: true,
  },
  {
    slug: "pragma-law",
    icon: "scale",
    tagline: "Casă de avocatură · Luxemburg",
    client: "Pragma Law",
    category: "Juridic",
    year: 2025,
    description:
      "Site de brand pentru o casă de avocatură boutique din Luxemburg, specializată în tehnologie, proprietate intelectuală, GDPR, media și drept comercial.",
    tech: ["WordPress", "Elementor", "WP Rocket"],
    url: "https://pragmalaw.lu",
    featured: true,
  },
  {
    slug: "expertum",
    icon: "briefcase",
    tagline: "Consultanță fonduri europene",
    client: "Expertum",
    category: "Corporate",
    year: 2025,
    description:
      "Site pentru o firmă de consultanță în accesarea și implementarea fondurilor europene nerambursabile. Structură pe servicii, captare de lead-uri și arhitectură de conținut construită SEO-first.",
    tech: ["WordPress", "Elementor", "Yoast SEO Premium"],
    url: "https://expertum.ro",
  },
  {
    slug: "reparatii-aeroterme",
    icon: "car",
    tagline: "Aeroterme & radiatoare auto",
    client: "Reparații aeroterme auto",
    category: "Local",
    year: 2025,
    description:
      "Landing local pentru un service auto din București, specializat pe radiatoare de căldură și aeroterme. Conversie pe telefon, semnale clare de preț și copy construit în jurul garanției.",
    tech: ["WordPress", "Elementor", "Site Kit"],
    url: "https://reparatiiaerotermeauto.ro",
  },
  {
    slug: "solutia-ta",
    icon: "home",
    tagline: "Case la cheie · design interior",
    client: "Soluția Ta",
    category: "Construcții",
    year: 2025,
    description:
      "Site de brand pentru un antreprenor general din București și Ilfov: case la cheie, design interior și exterior. Construit în jurul portofoliului, cu flux clar către consultanță.",
    tech: ["WordPress", "Elementor", "Yoast SEO Premium"],
    url: "https://solutia-ta.ro",
  },
  {
    slug: "atelier-image",
    icon: "sparkles",
    tagline: "Agenție de evenimente corporate",
    client: "Atelier Image",
    category: "Servicii",
    year: 2025,
    description:
      "Site pentru o agenție de evenimente din București care produce conferințe, gale și petreceri corporate din 2006. Studii de caz vizuale și pâlnie directă pentru brief-uri.",
    tech: ["WordPress", "Elementor"],
    url: "https://atelierimage.ro",
  },
  {
    slug: "audit-intern",
    icon: "briefcase",
    tagline: "Platformă audit administrație publică",
    client: "Audit Intern",
    category: "Aplicație web",
    year: 2025,
    description:
      "Site și vitrină pentru o aplicație de audit intern construită pentru administrația publică locală. Arhitectură pe servicii, captare de lead-uri și SEO țintit pe cumpărători din administrație.",
    tech: ["WordPress", "Elementor"],
    url: "https://auditintern1.ro",
  },
  {
    slug: "meditravel",
    icon: "stethoscope",
    tagline: "Turism medical · 6 țări",
    client: "MediTravel",
    category: "Medical",
    year: 2025,
    description:
      "Site de brand pentru o agenție de turism medical care conectează pacienți cu spitale și specialiști din Turcia, Austria, Israel, Italia, Spania și Germania. Coordonare de tratament și a doua opinie medicală.",
    tech: ["WordPress", "Revolution Slider"],
    url: "https://meditravel.ro",
  },
  {
    slug: "curatare-hale",
    icon: "spray-can",
    tagline: "Curățenie industrială · ~115.000 m²",
    client: "Curățare hale",
    category: "Servicii",
    year: 2025,
    description:
      "Landing local pentru curățenie industrială de hale și depozite, la nivel național. Accent pe garanție, agenți biodegradabili și metri pătrați livrați — aproximativ 115.000 până acum.",
    tech: ["WordPress", "Elementor"],
    url: "https://curatare-hale.ro",
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  /** Live project the client is referring to — makes the review verifiable. */
  url?: string;
  /** e.g. "Recenzie Google". Renders a Review schema only when set + real. */
  source?: string;
};

/**
 * ⚠️ TODO(mina): PLACEHOLDER — these two quotes are invented. Do NOT launch with
 * them. Fabricated reviews attributed to named real clients (Miral Fashion,
 * Ikabane) are false endorsement — a legal risk and Google spam, not just an
 * optimistic claim. Replace with real client words (a Google review link, a
 * screenshot, an email you have permission to quote); once they're real, add
 * `source` + `url` and the section renders Review structured data.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Am primit un magazin care chiar vinde, nu doar unul care arată bine. Diferența s-a văzut în prima lună.",
    author: "Client Miral Fashion",
    role: "Fashion & e-commerce",
    url: "https://miral-fashion.ro",
  },
  {
    quote:
      "Lucrează cu cifrele pe masă. Știi mereu ce s-a făcut, ce a costat și ce a ieșit.",
    author: "Client Ikabane Resort",
    role: "Turism & HoReCa",
    url: "https://ikabane.ro",
  },
];

export type Step = { title: string; body: string };

export const process: Step[] = [
  {
    title: "Audit gratuit",
    body: "30 de minute în care mă uit la site, la campanii și la cifre. Pleci cu o listă de priorități, chiar dacă nu lucrăm împreună.",
  },
  {
    title: "Plan și ofertă",
    body: "Primești obiective, termene și un preț fix. Fără surprize la final.",
  },
  {
    title: "Construcție",
    body: "Livrez pe etape, cu link de test din prima săptămână. Vezi progresul, nu doar promisiunea.",
  },
  {
    title: "Măsurare",
    body: "Instalez urmărirea conversiilor și raportez ce aduce clienți — și ce nu.",
  },
];
