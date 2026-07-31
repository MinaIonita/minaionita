# Deploy pe cPanel/WHM — minaionita.ro

Serverul rulează Apache sau LiteSpeed cu cPanel. Aplicația nu e PHP: sunt două
procese Node care ascultă pe loopback, iar webserverul le pune în față ca proxy.

Verifică întâi ce webserver ai — comenzile diferă:

```bash
/usr/local/lsws/bin/lshttpd -v 2>/dev/null && echo "=> LITESPEED" || echo "=> APACHE"
```

## 1. Utilizator dedicat

Nu rula aplicația ca root. Dacă `minaionita.ro` are deja un cont cPanel,
folosește-l; altfel creează-l din WHM. Restul comenzilor se dau ca acel user:

```bash
su - USERUL_CPANEL
```

## 2. Cod și dependențe

```bash
cd ~
git clone https://github.com/MinaIonita/minaionita.git app
cd app
npm ci --omit=dev --ignore-scripts=false || npm install
```

## 3. Variabile de mediu

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Generează secretele reale — API-ul refuză să pornească cu placeholder-e:

```bash
openssl rand -base64 48   # JWT_SECRET
openssl rand -base64 32   # ENCRYPTION_KEY
```

În `apps/api/.env`:

```
NODE_ENV=production
DATABASE_URL="mysql://user:parola@localhost:3306/numebd"
JWT_SECRET="..."
ENCRYPTION_KEY="..."
CORS_ORIGIN="https://minaionita.ro"
CONTACT_NOTIFY_EMAIL="mina.ionita1@gmail.com"
SMTP_URL="smtps://mina.ionita1%40gmail.com:APP_PASSWORD@smtp.gmail.com:465"
MAIL_FROM="contact@minaionita.ro"
ADMIN_EMAIL="mina.ionita1@gmail.com"
ADMIN_PASSWORD="parola-buna-aici"
PORT=4000
```

În `apps/web/.env.local`:

```
API_URL="http://127.0.0.1:4000/api"
NEXT_PUBLIC_API_URL="https://minaionita.ro/api"
```

`NEXT_PUBLIC_API_URL` ajunge în CSP (`connect-src`, vezi `apps/web/src/proxy.ts`).
Greșită → adminul dă „Failed to fetch" deși `curl` merge.

## 4. Bază de date

Creează baza și userul din cPanel → MySQL Databases, apoi:

```bash
cp apps/api/prisma/schema.mysql.prisma apps/api/prisma/schema.prisma
npm run db:migrate --workspace=api
npm run db:seed --workspace=api
```

Seed-ul creează adminul din `ADMIN_EMAIL`/`ADMIN_PASSWORD` și nu suprascrie un
admin existent — deci nu resetează o parolă schimbată ulterior.

## 5. Build și pornire

```bash
npm run build
mkdir -p logs
npx pm2 start ecosystem.config.js
npx pm2 save
npx pm2 startup    # rulează comanda pe care o afișează, ca root
```

Verifică local, înainte de proxy:

```bash
curl -s -o /dev/null -w "web %{http_code}\n" http://127.0.0.1:3000
curl -s -o /dev/null -w "api %{http_code}\n" http://127.0.0.1:4000/api/settings
```

## 6. Reverse proxy

Ambele porturi ascultă pe loopback, deci fără pasul ăsta site-ul nu e vizibil.

### Apache (cPanel)

Include-urile de vhost editate direct în `httpd.conf` sunt suprascrise la
fiecare rebuild. Calea corectă e `userdata`:

```bash
mkdir -p /etc/apache2/conf.d/userdata/ssl/2_4/USERUL/minaionita.ro
cp ~/app/deploy/apache-minaionita.conf \
   /etc/apache2/conf.d/userdata/ssl/2_4/USERUL/minaionita.ro/proxy.conf
/scripts/ensure_vhost_includes --user=USERUL
/scripts/restartsrv_httpd
```

Modulele `proxy` și `proxy_http` trebuie active (EasyApache 4).

### LiteSpeed

WHM → *LiteSpeed Web Server* → *WebAdmin Console* → *Virtual Hosts* →
`minaionita.ro` → *Context* → adaugă două contexte de tip **Proxy**:

- URI `/api` → adresa `http://127.0.0.1:4000/api`
- URI `/` → adresa `http://127.0.0.1:3000`

Ordinea contează: `/api` trebuie definit înaintea lui `/`.

## 7. SSL și verificare

```bash
curl -sI https://minaionita.ro | head -1
curl -s https://minaionita.ro/api/settings | head -c 80
curl -sI https://minaionita.ro/sitemap.xml | head -1
```

Apoi în Google Search Console adaugă proprietatea și trimite
`https://minaionita.ro/sitemap.xml`.

## Actualizări ulterioare

```bash
cd ~/app && git pull && npm install && npm run build && npx pm2 restart all
```

## Dacă ceva nu merge

```bash
npx pm2 logs --lines 50          # ambele procese
npx pm2 status
tail -50 ~/app/logs/api-error.log
```

API-ul care nu pornește și se oprește imediat înseamnă aproape întotdeauna un
secret lipsă sau placeholder — mesajul din `validateEnv` spune exact care.
