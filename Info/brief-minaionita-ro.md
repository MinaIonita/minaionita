# Brief tehnic și de conținut — minaionita.ro

**Data:** 10 iulie 2026
**Proiect:** Site personal / agenție pentru Mina Ioniță (PFA, CAEN 6210)
**Referință vizuală și structurală:** minawebcomp.com

---

## 1. Obiectivul site-ului

**Decizie strategică: brand unic.** Mina Ioniță devine singurul brand — minawebcomp.com (MWC) se retrage și se redirecționează 301 către minaionita.ro, transferându-i autoritatea SEO acumulată. Direcția „Kaironis" se abandonează.

Site de prezentare profesională cu dublu rol: brand personal (CV, despre mine) și vitrină de servicii web pentru atragerea clienților SMB din România și Europa. Site-ul trebuie să genereze cereri de ofertă prin formulare de contact și să funcționeze ca dovadă de competență (portofoliu + calitatea execuției site-ului în sine).

### 1.1 Plan de migrare MWC → minaionita.ro
1. Achiziție domenii: **minaionita.ro** (principal) + **minaionita.com** (protecție, redirect spre .ro)
2. Construcție completă minaionita.ro (site gata + LP-uri live) — abia apoi migrarea
3. Redirect **301 permanent, pagină-cu-pagină** de pe minawebcomp.com (nu totul pe homepage)
4. minawebcomp.com se păstrează înregistrat 3–5 ani (dacă expiră, redirectul moare)
5. Search Console: Change of Address; migrare/actualizare email @minawebcomp.com
6. Actualizare peste tot: Google Business Profile, bio Threads/Facebook/Instagram/LinkedIn, URL-uri finale în campaniile Meta & Google Ads, semnătură email, facturi/contracte PFA

---

## 2. Arhitectura site-ului (sitemap)

```
Acasă
├── Servicii (pagină hub)
│   ├── Creare site-uri de prezentare (WordPress)
│   ├── Magazine online (WooCommerce)
│   ├── Optimizare SEO
│   ├── Google Ads (Search, Display, Shopping, PMax)
│   ├── Meta Ads (Facebook & Instagram)
│   ├── Content marketing & copywriting
│   ├── Social media management
│   ├── Mentenanță & administrare site-uri
│   ├── Audit site & audit marketing
│   ├── Aplicații mobile (preluat din oferta MWC)
│   ├── Soluții AI pentru business — chatboți, automatizări (preluat din oferta MWC)
│   └── Identitate vizuală / branding (preluat din oferta MWC)
├── Portofoliu
│   └── Pagină individuală per proiect (studiu de caz)
├── Proiecte personale
│   └── Pagină individuală per proiect (experiment / produs propriu)
├── Despre mine
├── CV
├── Blog (recomandat pentru SEO)
└── Contact
```

Fiecare serviciu are **pagina lui dedicată** cu URL propriu (ex. `/servicii/creare-magazine-online/`) — esențial pentru SEO și pentru campanii Ads cu landing pages relevante.

---

## 3. Structura paginilor

### 3.1 Acasă
- Hero: propunere de valoare + CTA („Cere ofertă")
- Grid servicii (carduri cu link spre paginile dedicate)
- 3–4 proiecte selectate din portofoliu
- Cifre cheie (ani experiență, proiecte livrate, clienți)
- Testimoniale (administrabile din admin)
- CTA final + formular scurt

### 3.1.1 Elemente preluate de pe minawebcomp.com
- **Servicii și date servicii:** site-uri de prezentare, magazine online, aplicații mobile, SEO, soluții AI, branding — descrierile și pozițiile din oferta MWC se adaptează la persoana I singular pentru brandul personal
- **Dovezi sociale:** 80+ proiecte livrate, +38% creștere medie a conversiei — de reutilizat în hero și în secțiunea de cifre
- **Mecanism de lead:** audit gratuit de 30 de minute ca ofertă de intrare (CTA principal)
- **Portofoliu:** proiectele existente pe minawebcomp.com se migrează integral pe minaionita.ro (site-ul MWC e SPA, deci lista de proiecte + materialele se furnizează manual: nume client, imagini, rezultate). Proiecte cunoscute de inclus: Miral Fashion (WooCommerce + Meta Ads), Ikabane.ro (social media + conținut)
- **Direcție vizuală: identitate proprie, derivată din logo-ul MWC.** Monograma geometrică M se păstrează (funcționează pentru „Mina Ioniță"), iar gradientul teal → crem din logo devine paleta de brand a noului site — aplicată însă pe fundal luminos, nu pe dark-ul MWC (#070B14). Necesare: variantă de logo pentru fundal deschis, wordmark nou („Mina Ioniță" în loc de „web company"), versiune mono-culoare pentru favicon, e-mail și antetul contractelor generate din admin

### 3.2 Pagină serviciu (template repetabil)
- Titlu + descriere problemă/soluție
- Ce include serviciul (listă administrabilă)
- Procesul de lucru în pași
- Prețuri orientative sau „de la X €" (opțional, activabil per serviciu)
- FAQ per serviciu (schema.org FAQ pentru SEO)
- Proiecte relevante din portofoliu (relaționate automat)
- CTA + formular

### 3.3 Portofoliu
- Grid filtrabil pe categorii (site prezentare / eCommerce / SEO / Ads)
- Pagina proiectului: client, industrie, provocare, soluție, rezultate (cifre), galerie imagini, tehnologii, link live

### 3.4 Proiecte personale
Separată de portofoliul de client — aici arăți ce construiești din inițiativă proprie: experimente, produse digitale, unelte, side-projects (ex. dashboard-uri Power BI, produse hardware/IoT explorate, ebook-uri, mini-aplicații). Structura per proiect: idee, ce ai învățat/tehnologii, status (în lucru / lansat / arhivat), link demo dacă există. Rol dublu: dovadă de curiozitate și inițiativă pentru clienți și angajatori (pagina lucrează împreună cu CV-ul) + spațiu unde poți lansa produse proprii mai târziu. CPT separat „Proiecte personale" în admin, cu aceleași facilități de administrare ca portofoliul.

### 3.5 Despre mine
- Poveste profesională, valori, mod de lucru
- Foto profesională
- Timeline experiență (administrabil)

### 3.6 CV
- Versiune web a CV-ului: experiență, educație (inclusiv teologie UAIC dacă dorești), competențe, certificări
- Buton descărcare PDF (fișierul PDF încărcabil din admin)

### 3.7 Blog
- Articole SEO pe subiectele serviciilor (atrage trafic organic)

### 3.8 Contact
- Formular (nume, email, telefon, serviciu dorit, buget estimativ, mesaj)
- Date PFA, email, telefon, WhatsApp click-to-chat
- Notificare email + salvare lead în admin

---

## 4. Administrare completă (CMS custom)

**Stack decis: fără WordPress.**
- **Frontend: React + Next.js** — randare pe server (SSR/SSG), obligatorie pentru strategia SEO/LP (un SPA clasic nu se indexează corect — exact problema minawebcomp.com)
- **Backend/Admin API: NestJS** (Node.js, arhitectură tip Angular: module, decoratori, DI)
- **Bază de date: MySQL** — toate datele aplicației trăiesc în baza de date: conținut pagini, servicii, portofoliu, lead-uri, tichete, proiecte, parole (criptate), contracte generate, jurnale de consimțământ și de acces. Nimic critic doar în fișiere; backup zilnic criptat al întregii baze
- **Admin UI:** panou React custom pe NestJS + MySQL (prin Prisma/TypeORM). Notă: Payload CMS are suport principal pentru Postgres/SQLite — cu MySQL cerință fermă, varianta sigură e adminul custom NestJS; verificăm la kickoff statusul adaptorului MySQL din Payload și decidem
- **Autentificare admin: cu email** — login email + parolă, 2FA obligatoriu, opțiune de magic link pe email; sesiunile și jurnalul autentificărilor stocate în MySQL

Tot conținutul editabil din admin, fără cod:
- Pagini și secțiuni: blocuri de conținut modulare
- Servicii/LP-uri: colecție „Servicii" (adaugi/ștergi/reordonezi, câmpuri SEO per pagină)
- Portofoliu + Proiecte personale: colecții separate cu categorii
- Testimoniale: colecție dedicată
- CV: câmpuri structurate (experiență repeater, upload PDF)
- Meniuri, footer, date de contact: setări globale
- Blog cu editor rich-text și câmpuri SEO
- Traduceri RO/EN gestionate per document (i18n nativ în Payload / next-intl pe front)

---

## 5. Modul „Date proiecte" (secțiune privată în admin)

Custom Post Type **vizibil doar în admin** (fără pagini publice), accesibil doar rolului Administrator.

**Câmpuri per proiect:**
- Nume client + firmă, date de contact
- Domeniu + registrar, expirare domeniu
- Hosting (furnizor, plan, expirare)
- URL site, URL admin
- Status proiect (ofertat / în lucru / live / mentenanță / închis)
- Data început, data livrare, valoare contract
- Note libere / istoric

**Parole „în lanț" (repeater nelimitat):**
Fiecare rând = o credențială separată pe care o adaugi oricând:
- Etichetă (ex. „wp-admin", „cPanel", „FTP", „Meta Business", „Google Ads")
- Utilizator
- Parolă
- URL de login
- Notă

**⚠️ Securitate obligatorie pentru parole:**
- Parolele se stochează **criptat în baza de date** (AES-256 prin libsodium/OpenSSL, cheie în `wp-config.php`, nu în DB)
- Afișare mascată cu buton „arată/copiază"
- Acces restricționat prin capability custom, doar admin
- 2FA obligatoriu pe contul de admin
- Alternativă mai sigură de discutat: integrare Bitwarden/Vaultwarden și în admin doar link-uri spre intrări — dar varianta criptată în WP acoperă cerința ta.

---

## 5bis. Modul „Generator de contracte" (secțiune privată în admin)

Extensie a modulului Date proiecte: generezi contracte de prestări servicii direct din admin, completezi părțile și prețul, descarci PDF-ul.

### Funcționare
1. Alegi **tipul de serviciu** → se încarcă șablonul potrivit (creare site, magazin online, SEO, Ads, mentenanță, aplicație mobilă, AI)
2. Completezi **datele beneficiarului** — comutator Persoană fizică (nume, CNP opțional, CI, adresă) / Persoană juridică (denumire, CUI, Reg. Com., sediu, reprezentant legal, funcție)
   - **Autocompletare după CUI (ANAF):** la PJ introduci doar CUI-ul → sistemul interoghează API-ul oficial ANAF v9 (webservicesp.anaf.ro) — același endpoint folosit de SmartBill, Saga și FGO — și populează automat: denumirea oficială, adresa sediului, nr. Registrul Comerțului, cod CAEN, status TVA și status activ/inactiv. API-ul e gratuit, fără cheie, cu limită de 1 cerere/secundă
   - **Verificare de risc inclusă:** dacă firma e marcată inactivă fiscal — semnal major de risc — sau neplătitoare de TVA, adminul afișează un avertisment vizibil înainte de generarea contractului
   - Câmpurile rămân editabile după autocompletare (reprezentantul legal se completează manual — ANAF nu îl returnează); fallback pe introducere manuală dacă API-ul ANAF e indisponibil
   - Pentru clienți din UE (fără CUI românesc): validare cod TVA intracomunitar prin VIES
   - Datele aduse se salvează pe fișa clientului din Date proiecte, deci la al doilea contract pentru același client totul e precompletat
3. Completezi **prețul** (sumă, monedă, avans %, termen de plată, penalități întârziere) și **termenul de execuție**
4. Datele prestatorului (PFA-ul tău) se preiau automat din setările globale
5. **Generare PDF** cu numerotare automată (ex. CTR-2026-014), salvat criptat și atașat proiectului din Date proiecte
6. **Anexe opționale per contract** (repeater): Anexa 1 — specificații tehnice / caiet de sarcini, Anexa 2 — GDPR (activă implicit), Anexa 3 — grafic de plăți, anexe libere. Fiecare anexă e parte integrantă a contractului și apare în cuprinsul PDF-ului. Modificările ulterioare (preț, termen) se fac prin act adițional, nu prin editarea contractului semnat — modulul va putea genera și acte adiționale.

### Structura șablonului de contract (cadru legal RO)
Contractul de prestări servicii nu are formă tipizată impusă de lege — e guvernat de libertatea contractuală din Codul Civil, deci îl putem adapta per serviciu. Clauzele incluse în șablon:
1. Părțile (prestator PFA / beneficiar PF sau PJ)
2. Obiectul contractului (descrierea serviciului — variabilă per șablon)
3. Durata și termenele de execuție + etape de livrare
4. Prețul și modalitatea de plată — cu atenție la Legea 72/2013: în B2B termenul maxim de plată e 60 de zile, iar dobânda legală penalizatoare se aplică automat dacă nu e specificat altfel
5. Obligațiile prestatorului (livrabile, standarde, comunicare) și ale beneficiarului (materiale, informații, accese, plăți la termen)
6. **Clauza de recepție** — critică: termenul în care beneficiarul verifică livrabilul, iar dacă nu răspunde în termen, livrabilul se consideră acceptat tacit
7. **Proprietate intelectuală** — esențială la servicii creative: se clarifică cesiunea vs. licența asupra codului/designului/textelor, condiționată de plata integrală
8. Confidențialitate
9. Răspundere și limitarea răspunderii
10. Încetare/reziliere cu termene de notificare
11. Forță majoră, legea aplicabilă, soluționarea litigiilor
12. **Protecția datelor (GDPR)** — clauză în corpul contractului + Anexa GDPR detaliată

### Anexa GDPR (inclusă implicit la fiecare contract)
Model consacrat de „clauză standard privind protecția datelor" ca anexă la contract, conform Regulamentului (UE) 679/2016, acoperind: temeiul prelucrării = executarea contractului, orice prelucrare în alt scop cere acord separat; stocarea limitată la durata realizării obiectului contractului; interdicția accesului terților neautorizați + măsuri tehnice și organizatorice; respectarea drepturilor persoanelor vizate (ștergere, corectare, transfer) și notificarea breșelor de securitate în max. 72 de ore. Pentru serviciile unde tu prelucrezi datele clienților finali în numele beneficiarului (ex. administrezi WooCommerce cu clienții lui, campanii cu liste de emailuri), șablonul include și varianta de **acord de prelucrare operator–împuternicit (DPA)**, obligatoriu ori de câte ori o parte prelucrează date personale în numele celeilalte.

**⚠️ Important:** șabloanele generate sunt un cadru solid, dar înainte de utilizarea comercială se dau o singură dată la verificat unui avocat (cost mic, o revizie acoperă toate șabloanele). Recomandarea consacrată e ca acordurile GDPR să fie verificate de un specialist în protecția datelor.

---

## 5ter. Modul „Tracking & Analytics" (în admin)

Gestionezi toate scripturile și pixelii de marketing din admin, fără deploy de cod.

### Gestionare tag-uri și pixeli
- Câmpuri dedicate în setări: **Google Tag Manager** (container ID), **GA4**, **Meta Pixel**, **TikTok Pixel**, **Google Ads** (conversion ID + labels), LinkedIn Insight — activabile individual, on/off per mediu (staging/producție)
- Injectare automată în frontend prin componenta Script din Next.js, cu strategie de încărcare care nu afectează Core Web Vitals
- Câmp liber pentru scripturi custom (head/body)

### Consimțământ GDPR (legat obligatoriu de tracking)
- Banner cookies cu **Google Consent Mode v2** — niciun pixel nu se declanșează înainte de consimțământ
- Categorii (necesare / analiză / marketing) administrabile din admin
- Jurnal al consimțămintelor stocat ca dovadă de conformitate

### Evenimente de conversie
- Predefinite pe obiectivele site-ului: trimitere formular, cerere audit gratuit, click WhatsApp, click telefon, descărcare CV — trimise în GA4 + Meta + Google Ads, activabile per eveniment din admin

### Tichete din formulare (inbox în admin)
- **Fiecare trimitere de formular de pe site devine automat un tichet în admin** — cu toate datele: nume, email, telefon, serviciul dorit, mesaj + sursa completă (UTM-uri, pagina de intrare, LP-ul care a convertit, referrer)
- **Răspunzi direct din admin:** scrii răspunsul în tichet → se trimite pe emailul clientului (SMTP/Resend/SES, expeditor contact@minaionita.ro). Răspunsul clientului pe email intră automat înapoi în același tichet (inbound email prin webhook sau IMAP), deci toată conversația rămâne în admin, în firul tichetului
- Statusuri: nou / în lucru / răspuns trimis / ofertat / câștigat / pierdut / închis; notificare pe email + badge în admin la tichet nou
- Șabloane de răspuns rapide (ofertă, programare call, refuz politicos) editabile din admin
- Un tichet câștigat devine client + proiect în Date proiecte cu un click, cu tot istoricul conversației atașat
- Totul stocat în MySQL: tichete, mesaje, atașamente, istoric statusuri

### Dashboard
- Lead-uri/tichete pe lună, pe sursă, pe LP — vezi exact ce landing page și ce canal aduce clienți (închide bucla cu strategia SEO/LP)

---

## 5quater. Module de productivitate în admin

### 1. Lanțul Ofertă → Contract → Factură
- **Generator de oferte:** alegi serviciile din catalog, prețurile se calculează (cu discount opțional), oferta pleacă pe email ca link public cu buton „Accept oferta"
- Oferta acceptată → devine **contract precompletat** cu un click (modulul Generator de contracte preia serviciile, prețul, datele clientului)
- Contract semnat → generează automat **factura de avans** prin integrare SmartBill/Oblio sau direct e-Factura ANAF (SPV); factura finală la statusul „recepționat"
- Statusuri ofertă: trimisă / văzută / acceptată / expirată (valabilitate setabilă, ex. 15 zile)

### 2. Monitor site-uri clienți
- Pentru fiecare proiect din Date proiecte: verificare automată **uptime** (ping la 5 min), **expirare domeniu** (WHOIS), **expirare SSL**, **expirare hosting** (data introdusă manual)
- Alerte email + badge în admin la 30/7/1 zile înainte de orice expirare; alertă imediată la downtime
- Istoricul incidentelor per client — argument concret la vânzarea mentenanței

### 3. Validator SEO la publicare
- Checklist-ul de 18 puncte (secțiunea 6bis) implementat ca verificare automată în editor: scor per pagină + lista lipsurilor (title, meta, H1 unic, alt-uri, schema, răspuns direct sub H1, FAQ, linkuri interne)
- **Blocare publicare** sub scorul minim setat (cu override manual justificat)
- **Avertizare anti-canibalizare:** alertă dacă două pagini țintesc același cuvânt cheie principal
- Avertizare anti-scaled-content: alertă la similaritate mare de conținut între pagini (protecție pentru LP-urile locale/industrii)

### 4. Rapoarte lunare automate pentru clienți
- Raport PDF per client generat automat lunar: trafic și poziții (GA4 + Search Console API), performanță campanii (Meta + Google Ads API), lucrări de mentenanță efectuate
- Trimitere automată pe email la data setată, cu branding propriu; istoric rapoarte per client în admin

### 5. Follow-up automat pe tichete
- Tichet/ofertă fără răspuns de la client după X zile (setabil, default 3) → reminder automat din șablon, max. 2 reminders
- Vizibil în firul tichetului; se oprește automat la orice răspuns al clientului

### 6. Calendar de conținut
- Planificare LP-uri și articole pe luni, vizual (kanban/calendar), cu statusuri: idee / draft / în lucru / programat / publicat
- **Ritmul anti-penalizare impus vizual:** avertizare când programezi peste 2–3 pagini locale sau 1–2 pagini de industrie pe lună
- Publicare programată automată la data setată

**Prioritizare implementare:** v1.0 = modulele 1, 2, 3 (impact maxim pe timp și bani) · v1.1 = modulele 4, 5, 6

---

## 6. Limbi

**Recomandarea mea: 2 limbi — Română + Engleză.**

- **Română** = limba principală (piața de bază, clienți SMB locali)
- **Engleză** = deschide piața europeană (ai deja clienți în Europa) și e suficientă ca lingua franca pentru B2B

De ce nu mai multe de la început: fiecare limbă în plus înseamnă traducere, întreținere dublă a conținutului și blog paralel — costul depășește beneficiul până nu ai cerere dovedită dintr-o piață anume (ex. dacă apar clienți germani, adaugi DE ulterior).

**Implementare:** rutare i18n în Next.js (next-intl) cu structură `/en/` și hreflang corect; conținutul tradus per document în admin (Payload are localizare nativă); comutator de limbă în header. Blogul poate rămâne doar în română la început.

---

## 6bis. SEO 2026 — reguli obligatorii pentru fiecare pagină

### Contextul (research iulie 2026)
Căutarea s-a schimbat structural: AI Overviews apar pe ~48% din căutările Google (în creștere de la 34,5% în dec. 2025), iar ~68% din căutările din SUA se termină fără click către vreun site. Când apare un AI Overview, rezultatul organic #1 pierde ~18% din clickuri — dar site-urile citate ÎN AI Overview primesc cu ~35% mai multe clickuri decât o poziție #1 clasică. Metrica nouă = rata de citare, nu doar poziția. Suprapunerea între top 10 clasic și sursele citate de AI Mode a scăzut la 14–17%, deci optimizăm pentru ambele. Poziția Google oficială: optimizarea pentru AI Overviews/AI Mode este tot SEO — aceleași fundamente (calitate, expertiză, accesibilitate tehnică); nu e nevoie de llms.txt. Important pentru noi: AI Overviews apar doar în ~7% din căutările locale — deci pe „creare site Iași" jocul rămâne clasic (GBP + LP local), avantajul nostru se păstrează.

### Politica de conținut AI + spam (critice în 2026)
- Google NU penalizează conținutul asistat de AI — penalizează **scaled content abuse**: pagini multe, subțiri, fără valoare adăugată, indiferent cine le-a scris. Core update-ul din martie 2026 a lovit exact site-urile cu sute de pagini AI fără revizie editorială (căderi de 50–80%), inclusiv paginile locale template cu doar orașul schimbat
- Din mai 2026, politicile de spam acoperă explicit și manipularea AI Overviews/AI Mode — tacticile „GEO agresive" pot aduce demotare sau eliminare din index
- **Regula noastră:** fiecare pagină publicată = revizuită uman, cu experiență reală (proiecte, cifre proprii), niciodată LP-uri locale generate în masă. Dacă facem LP-uri pe alte orașe, fiecare are conținut substanțial diferit (studii de caz locale, context real), nu template cu orașul schimbat

### Checklist obligatoriu PER PAGINĂ (se verifică la publicare, câmpuri în admin)
**Conținut & intenție**
1. Un singur cuvânt cheie principal per pagină (fără canibalizare) + variații naturale
2. **Răspuns direct în primele 2–3 propoziții** sub H1 (blocul citabil de AI) — pagina răspunde complet la O întrebare specifică, nu superficial la zece
3. Secțiune TL;DR / „Pe scurt" la paginile lungi; date concrete, cifre proprii, exemple din proiecte reale (originalitate = criteriu de citare AI)
4. FAQ la finalul paginii (3–6 întrebări conversaționale, formulate cum caută oamenii)
5. Semnale E-E-A-T: autor vizibil (Mina Ioniță + link la Despre/CV), data publicării ȘI a ultimei actualizări, surse pentru afirmații externe
6. Conținut RO și EN de calitate egală (nu traducere automată nerevizuită)

**On-page tehnic**
7. Title unic (50–60 caractere, keyword la început) + meta description unică (140–155 car., cu beneficiu/CTA)
8. Un singur H1; ierarhie H2/H3 logică — subtitlurile formulate ca întrebări unde e natural
9. URL scurt, descriptiv, cu keyword: `/servicii/creare-magazin-online/`
10. Canonical corect; hreflang RO↔EN pe fiecare pereche de pagini
11. Breadcrumbs vizibile + schema BreadcrumbList
12. Minim 2–3 linkuri interne relevante spre pagină și dinspre pagină (LP ↔ articole satelit)
13. Imagini: WebP/AVIF, alt descriptiv, lazy-load, dimensiuni declarate (fără CLS)
14. Open Graph + Twitter Card complete (titlu, descriere, imagine 1200×630)

**Date structurate (per tip de pagină)**
15. Global: Person + ProfessionalService (cu adresa Iași, arie de servire) · LP servicii: Service + FAQPage + BreadcrumbList · Blog: Article cu author și dateModified · Portofoliu: CreativeWork · Despre/CV: Person extins (sameAs către LinkedIn, GitHub)

**Performanță & crawlabilitate**
16. Core Web Vitals verzi pe mobil (LCP < 2,5s, CLS < 0,1, INP < 200ms) — buget de performanță per pagină
17. Conținutul critic randat server-side (SSR/SSG Next.js) — niciodată ascuns după JavaScript client-side; asta ne asigură și citirea de către crawlerele AI
18. Robots: permitem crawlerele de retrieval AI (Google-Extended decizie separată de discutat); sitemap.xml automat; 404/301 gestionate din admin

### Strategia SEO local România (anti-penalizare)
**Interzis prin design:** pagini serviciu × oraș × județ generate în masă din template. Tiparul „sute de pagini aproape identice, diferind doar prin numele orașului" e încadrat de Google la scaled content abuse și a fost lovit cu -30–60% trafic la core update-ul din martie 2026; penalizarea afectează încrederea în întregul domeniu, nu doar paginile respective. Viteza de publicare nerealistă (zeci de pagini simultan) e ea însăși semnal de automatizare.

**Ce facem în loc — creștere locală chirurgicală:**
- **Nivelul 1 — Iași (baza):** LP locală completă + Google Business Profile optimizat + citări locale. Avantaj real: AI Overviews apar doar în ~7% din căutările locale, deci aici jocul rămâne clasic și câștigabil
- **Nivelul 2 — 6–8 orașe mari** (București, Cluj-Napoca, Timișoara, Brașov, Constanța, Sibiu, Oradea) × doar 2–3 servicii cheie (creare site, magazin online, opțional Ads). Fiecare pagină construită individual, cu conținut substanțial diferit: studiu de caz sau client real din zonă (unde există), context concret de piață locală, testimonial, FAQ propriu — nu template cu orașul schimbat
- **Ritm de publicare: 2–3 pagini locale pe lună**, nu toate odată
- **Fără pagini de județ** — comportamentul de căutare local e pe oraș, nu pe județ
- **Extindere trasă de date:** la 3 luni după lansare, Search Console arată orașele din care vin impresii fără pagină dedicată — următoarele LP-uri locale se construiesc acolo, pe cerere dovedită

**Țintă:** ~15–25 de pagini locale puternice, nu 400 subțiri. Fiecare pagină locală respectă integral checklist-ul per pagină (răspuns direct, E-E-A-T, schema LocalBusiness/Service cu areaServed, hreflang)

### Strategia LP-uri pe industrii
Pagini de tip „site pentru [industrie]" — intenție comercială mai puternică decât termenii generici și diferențiere de conținut naturală (fiecare industrie are probleme, funcționalități și exemple proprii — risc de template zero, dacă respectăm regula de mai jos).

- **Regula de aur: nicio pagină de industrie fără dovadă reală** — studiu de caz, client sau cunoaștere demonstrabilă a nișei. Nu se scriu LP-uri de industrie „în orb"
- **Start (dovezi existente):** fashion / e-commerce premium (studiu de caz Miral Fashion) și turism & pensiuni / HoReCa (Ikabane) — primele două LP-uri de industrie
- **Extindere an 1 (5–7 industrii):** restaurante, cabinete medicale/stomatologice, beauty & saloane, construcții/imobiliare — adăugate pe măsură ce apar clienți sau expertiză reală în nișă
- **Structura fiecărei pagini:** problema specifică industriei → funcționalitățile relevante (rezervări, programări, meniu, catalog, prezentare portofoliu) → studiu de caz cu cifre → FAQ propriu al nișei → prețuri orientative → CTA audit gratuit
- **Interzis:** combinația industrie × oraș („site pentru restaurante Cluj") — reface combinatorica de tip scaled content; alegem o singură axă per pagină
- Ritm gradual (max. 1–2 pagini de industrie/lună), fiecare trecută prin checklist-ul de 18 puncte

### Monitorizare (în modulul Tracking din admin)
- Search Console cu noile rapoarte separate pentru impresii în AI Overviews/AI Mode — urmărite ca metrici distincte de traficul clasic
- Semnătura de diagnostic: impresii stabile + clickuri în scădere pe interogări informaționale = canibalizare AI Overview, nu penalizare — se tratează diferit
- Verificare manuală lunară: apărem în AI Overviews pe primele 10 cuvinte cheie țintă?
- Review la 6 luni pe paginile importante: actualizare date, exemple, schema (dateModified real)

### Indexare: Google, Bing, sitemap-uri și crawlere AI

**Motoare clasice**
- **Google Search Console:** proprietate verificată din ziua 1, sitemap trimis, monitorizare acoperire indexare + noile rapoarte AI Overviews/AI Mode; la migrare: Change of Address de pe minawebcomp.com
- **Bing Webmaster Tools:** obligatoriu, nu opțional — Bing alimentează și ChatGPT search/Copilot, deci indexarea în Bing = vizibilitate în ecosistemul OpenAI. Import setări direct din Search Console (feature nativ Bing)
- **IndexNow:** implementat în API — la fiecare publicare/actualizare de pagină, ping automat către Bing (și motoarele partenere) pentru indexare aproape instantă; pentru Google rămâne sitemap + crawl natural

**Sitemap-uri (generate automat de Next.js/API)**
- `sitemap.xml` index cu sitemap-uri separate: pagini, servicii/LP-uri, portofoliu, blog — cu `lastmod` real din DB (nu data build-ului)
- Perechi hreflang RO/EN declarate în sitemap; imagini importante incluse (image sitemap)
- Regenerare automată la publicare + ping

**Crawlere AI (politica robots.txt — administrabilă din admin)**
- **Permise implicit (retrieval — aduc vizibilitate și citări):** Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, ClaudeBot/Claude-User, PerplexityBot — acestea citesc paginile ca să răspundă utilizatorilor și pot cita site-ul; blocarea lor elimină site-ul din răspunsurile AI
- **Decizie separată (training — folosesc conținutul la antrenarea modelelor):** GPTBot, Google-Extended, CCBot, Applebot-Extended — comutator individual în admin; recomandare: permise (site de servicii = vrem prezență maximă în modele), dar decizia rămâne a ta și e reversibilă
- Notă: distincția retrieval vs. training e critică — multe configurații default le blochează pe amândouă și taie direct vizibilitatea AI
- llms.txt: nefolosit de Google (confirmat oficial), dar generat automat oricum — cost zero, standard emergent citit de alte sisteme

**Verificări de indexabilitate (în validatorul SEO)**
- Fiecare pagină publicată: index/noindex corect, canonical, prezentă în sitemap, fără blocare în robots.txt, conținut complet în HTML-ul server-side (test automat: fetch fără JavaScript conține H1 + primele paragrafe)
- Paginile de admin, tichete, oferte publice cu link: noindex + excluse din sitemap

---

## 7. Cerințe tehnice

- **Frontend:** Next.js (React), SSG/SSR pentru toate paginile publice, imagini optimizate (next/image, WebP/AVIF), Core Web Vitals verzi
- **Backend:** NestJS + MySQL (Prisma/TypeORM); API REST/GraphQL pentru conținut; criptare libsodium/AES-256 pentru datele sensibile (parole proiecte, contracte), cheia în variabile de mediu, nu în DB; toate entitățile aplicației persistate în MySQL
- **Securitate:** 2FA pe admin, rate limiting pe login și API, backup zilnic criptat, jurnalizare accese la datele sensibile, admin pe subdomeniu separat
- **GDPR:** banner cookies cu Consent Mode v2 (vezi modulul Tracking), politică de confidențialitate, procesare formulare conformă
- **Schema.org:** Person, ProfessionalService, FAQPage, Article
- **Hosting recomandat:** frontend pe Vercel sau VPS cu Node; DB și backend pe VPS propriu (control complet asupra datelor clienților — important pentru GDPR și pentru seiful de parole)

---

## 8. Etape de lucru propuse

1. Wireframe + design (Acasă, template serviciu/LP, portofoliu) — 1 săpt.
2. Setup Next.js + NestJS/Payload + colecții de conținut — 1 săpt.
3. Dezvoltare frontend + module admin (Date proiecte, Contracte, Tracking) — 3 săpt.
4. Conținut RO (LP-uri Valul 1, CV, despre) — în paralel
5. Traducere EN + SEO on-page + migrare 301 de pe minawebcomp.com — 1 săpt.
6. Testare, GDPR, lansare — 3–4 zile

**Total estimat: 6–7 săptămâni.**
