# Site Next.js — build în trei etape.
#
# Imaginea finală conține doar output-ul „standalone": serverul trasat de Next
# plus fișierele de care are nevoie. Fără el ar trebui copiat tot node_modules
# al monorepo-ului — sute de megaocteți folosiți exclusiv la build.

FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
# Toate workspace-urile, nu doar `web`. Cu --workspace=web, dependințele
# imbricate ale lui sharp lipsesc, iar tracing-ul pentru output standalone se
# oprește încercând să copieze fișiere care nu există. Diferența de timp e mică;
# oricum nimic din node_modules nu ajunge în imaginea finală.
RUN npm ci

# ── Build ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app
# Workspaces npm ridică totul la rădăcină; nu există apps/web/node_modules.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/web ./apps/web
COPY apps/api/package.json ./apps/api/

# NEXT_PUBLIC_* sunt inlocuite în bundle la build, nu citite la rulare — deci
# trebuie cunoscute aici. Greșit setat, panoul de administrare apelează API-ul
# la adresa greșită și CSP-ul îl blochează.
ARG NEXT_PUBLIC_API_URL="https://minaionita.ro/api"
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/apps/web
RUN npm run build

# ── Runtime ────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone nu include public/ și .next/static — se copiază explicit.
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Optimizatorul de imagini scrie versiunile redimensionate în .next/cache la
# prima cerere. Fișierele copiate mai sus aparțin lui root, iar procesul rulează
# ca `node` — fără directorul ăsta preexistent și deținut corect, fiecare
# imagine loga „EACCES: permission denied, mkdir" și se re-optimiza la fiecare
# cerere, în loc să fie servită din cache.
RUN mkdir -p /app/apps/web/.next/cache \
    && chown -R node:node /app/apps/web/.next

USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["node", "apps/web/server.js"]
