# API NestJS — build în două etape, ca imaginea finală să nu care compilatorul.
#
# Node 22: o dependință tranzitivă a Prisma 7 cere >=22. Pe 20 instalarea trece
# cu avertisment, dar poate ceda la runtime — adică după lansare.

FROM node:22-slim AS builder
WORKDIR /app

# better-sqlite3 se compilează din sursă (nu există binar precompilat pentru
# toate platformele), deci build-ul are nevoie de toolchain. Doar aici, nu în
# imaginea finală.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Manifestele întâi: layerul de dependențe se reface doar când ele se schimbă,
# nu la fiecare modificare de cod.
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci

COPY apps/api ./apps/api
COPY apps/web/src/lib ./apps/web/src/lib

WORKDIR /app/apps/api

# prisma.config.ts rezolvă DATABASE_URL la încărcare, iar `generate` eșuează
# fără ea — deși nu se conectează la nimic, doar citește schema. Valoarea de
# aici e o umplutură pentru build; cea reală vine din mediu la rulare.
ENV DATABASE_URL="mysql://build:build@localhost:3306/build"
RUN npx prisma generate
RUN npm run build

# ── Runtime ────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
# În container, loopback-ul ar face API-ul invizibil pentru proxy — izolarea o
# asigură rețeaua Docker, nu adresa de bind.
ENV HOST=0.0.0.0
ENV PORT=4000

# npm workspaces ridică dependințele la rădăcină, inclusiv clientul Prisma
# generat în node_modules/.prisma — nu există un apps/api/node_modules separat.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/package.json ./package.json

# Seed-ul citește conținutul direct din sursa site-ului, ca baza să pornească
# identică cu ce randează paginile. Fără fișierele astea în imaginea de runtime,
# `prisma db seed` eșuează cu MODULE_NOT_FOUND și panoul de administrare rămâne
# gol — site-ul arată corect doar pentru că are fallback static.
COPY --from=builder /app/apps/web/src/lib ./apps/web/src/lib

# Rulează ca utilizator neprivilegiat; imaginea node îl are deja creat.
USER node

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:4000/api/settings > /dev/null || exit 1

WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
