# minaionita.ro

Monorepo: site public (Next.js) + admin/API (NestJS + Prisma).

```
apps/web    Next.js 16 — site public, panou de administrare, rute API de punte
apps/api    NestJS 11 — API REST sub /api, Prisma, autentificare JWT + 2FA
```

## Rulare locală

```bash
npm install
npm run dev:api    # API pe :4000
npm run dev        # site pe :3000
```

Site: http://localhost:3000 · Admin: http://localhost:3000/administrare/login

## Configurare

Copiază `apps/api/.env.example` în `apps/api/.env` și `apps/web/.env.example` în
`apps/web/.env.local`, apoi completează. **API-ul refuză să pornească** dacă
lipsesc `JWT_SECRET`, `ENCRYPTION_KEY` sau `DATABASE_URL`, sau dacă au rămas
valori placeholder — un deploy nesigur trebuie să se vadă, nu să treacă.

⚠️ `NEXT_PUBLIC_API_URL` trebuie să fie originea reală a API-ului. Panoul de
administrare rulează în browser și o apelează direct, iar `proxy.ts` o injectează
în `connect-src` din CSP. Dacă e greșită, login-ul eșuează cu „Failed to fetch"
în timp ce `curl` pe aceeași adresă funcționează — o combinație care trimite
căutarea în direcția greșită.

```bash
openssl rand -base64 48   # JWT_SECRET
openssl rand -base64 32   # ENCRYPTION_KEY (trebuie să decodeze la 32 bytes)
```

Emailurile din formularul de contact ajung la `CONTACT_NOTIFY_EMAIL`. Fără
`SMTP_URL` nu se trimite nimic: lead-ul se salvează în continuare, iar API-ul
loghează un avertisment. Pentru Gmail e nevoie de un App Password, nu de parola
contului:

```
SMTP_URL="smtps://user%40gmail.com:APP_PASSWORD@smtp.gmail.com:465"
```

## Pregătire pentru server

1. **Bază de date.** Local se folosește SQLite (`file:./dev.db`). Pentru producție
   treci pe MySQL — schema există în `apps/api/prisma/schema.mysql.prisma` — și
   pune `DATABASE_URL` pe conexiunea reală.
2. **Migrări și seed:**
   ```bash
   npm run db:migrate --workspace=api
   npm run db:seed --workspace=api     # creează adminul din ADMIN_EMAIL/ADMIN_PASSWORD
   ```
   Seed-ul nu suprascrie un admin existent, deci nu resetează o parolă rotită.
3. **Build:**
   ```bash
   npm run build      # web + api
   ```
4. **Pornire:** `node apps/api/dist/main` și `npm run start --workspace=web`.
   Cu `NODE_ENV=production` API-ul ascultă pe `127.0.0.1` — expune-l doar prin
   reverse proxy. Setează `HOST` doar dacă chiar ai nevoie de altceva.
5. **Reverse proxy.** API-ul are `trust proxy = 1`, deci proxy-ul trebuie să
   seteze `X-Forwarded-For`. Fără asta rate limiting-ul pe login vede toți
   vizitatorii ca un singur client.
6. **CORS.** `CORS_ORIGIN` e obligatoriu în producție (listă separată prin virgulă).

## Securitate

- Secrete validate la boot (`apps/api/src/config/env.ts`) — fără fallback-uri.
- Helmet pe API; CSP cu nonce per cerere în `apps/web/src/proxy.ts`; headere
  statice în `next.config.ts`.
- Rate limiting: 8 login-uri/min, 5 formulare/10 min, 15 consimțăminte/min per IP.
- `GET /api/settings` întoarce doar cheile publice; tabelul complet e la
  `GET /api/settings/all`, în spatele autentificării.
- 2FA TOTP pentru admin, secrete criptate AES-256-GCM.

## GDPR

Bannerul de cookies implementează Google Consent Mode v2: până la alegere, toate
semnalele de analiză și publicitate sunt `denied`, deci nicio etichetă nu poate
trimite date. Alegerile se scriu în `ConsentLog` ca dovadă de conformitate.

⚠️ Textele legale (`/confidentialitate`, `/cookies`, șabloanele de contract) sunt
un cadru de lucru, nu consultanță juridică — de trecut pe la un jurist înainte de
lansare.
