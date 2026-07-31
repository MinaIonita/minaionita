#!/usr/bin/env bash
#
# Provisioning pentru minaionita.ro pe Ubuntu 24.04 LTS curat (fără panou).
# Se rulează O SINGURĂ DATĂ, ca root, pe un server proaspăt:
#
#   curl -fsSL https://raw.githubusercontent.com/MinaIonita/minaionita/main/deploy/provision-ubuntu.sh -o provision.sh
#   bash provision.sh
#
# Instalează Node 22, MySQL, nginx, PM2 și certbot, creează userul aplicației și
# deschide în firewall exact ce trebuie.
#
# Nu atinge codul aplicației — deploy-ul propriu-zis vine după, ca user.

set -euo pipefail

APP_USER="minaionita"
DOMAIN="minaionita.ro"
NODE_MAJOR="22"

export DEBIAN_FRONTEND=noninteractive
log() { printf "\n\033[1;33m▸ %s\033[0m\n" "$1"; }

if [[ $EUID -ne 0 ]]; then
  echo "Rulează ca root." >&2
  exit 1
fi

log "Actualizare sistem"
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl git ca-certificates gnupg ufw

log "Node ${NODE_MAJOR}"
# Node 22, nu 20: o dependință tranzitivă a Prisma 7 cere >=22. Pe 20
# instalarea trece cu avertisment, dar poate ceda la runtime — exact genul de
# problemă care apare abia după lansare.
curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
apt-get install -y -qq nodejs
node -v && npm -v

log "Unelte de compilare (better-sqlite3 se compilează din sursă)"
apt-get install -y -qq build-essential python3

log "MySQL"
apt-get install -y -qq mysql-server
systemctl enable --now mysql

log "nginx"
apt-get install -y -qq nginx
systemctl enable --now nginx

log "PM2"
npm install -g pm2

log "Utilizator aplicație: ${APP_USER}"
if ! id "${APP_USER}" &>/dev/null; then
  adduser --disabled-password --gecos "" "${APP_USER}"
  echo "  Creat. Setează-i o parolă cu: passwd ${APP_USER}"
fi

# Ubuntu curat nu are limitele absurde ale cPanel-ului, dar le fixăm explicit:
# build-ul de Next.js pornește ~11 workere și deschide mii de fișiere. Pe
# serverul anterior, 35 de procese și 100 de fișiere blocau chiar și `su`.
cat > /etc/security/limits.d/99-${APP_USER}.conf <<EOF
${APP_USER} soft nproc 4096
${APP_USER} hard nproc 8192
${APP_USER} soft nofile 65535
${APP_USER} hard nofile 65535
EOF

log "Firewall: doar SSH, 80 și 443"
ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable
ufw status

log "certbot pentru SSL"
apt-get install -y -qq certbot python3-certbot-nginx

log "Swap 2G (build-ul de Next.js e lacom la RAM)"
# Fără swap, pe un server de 4 GB build-ul poate fi omorât de OOM killer exact
# la pasul final, fără mesaj clar.
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
  echo "  Swap de 2G activat."
else
  echo "  Swap există deja."
fi

# Configul implicit de nginx servește pagina "Welcome" pe orice host și ar
# umbri site-ul nostru dacă rămâne activ.
rm -f /etc/nginx/sites-enabled/default

cat <<EOF

────────────────────────────────────────────────────────────
Serverul e pregătit. Urmează, în ordine:

 1. Securizează MySQL și creează baza:
      mysql_secure_installation
      mysql -u root -p
        CREATE DATABASE minaionita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        CREATE USER 'minaionita'@'localhost' IDENTIFIED BY 'PAROLA_TARE';
        GRANT ALL PRIVILEGES ON minaionita.* TO 'minaionita'@'localhost';
        FLUSH PRIVILEGES;
        EXIT;

 2. Aplicația, ca ${APP_USER}:
      su - ${APP_USER}
      git clone https://github.com/MinaIonita/minaionita.git app
      cd app && npm install
      cp apps/api/.env.example apps/api/.env
      cp apps/web/.env.example apps/web/.env.local
      cp apps/api/prisma/schema.mysql.prisma apps/api/prisma/schema.prisma
      openssl rand -base64 48   # JWT_SECRET
      openssl rand -base64 32   # ENCRYPTION_KEY
      nano apps/api/.env        # completează tot
      npm run db:migrate --workspace=api
      npm run db:seed --workspace=api
      npm run build
      mkdir -p logs && pm2 start ecosystem.config.js && pm2 save
      curl -s -o /dev/null -w "web %{http_code}\n" http://127.0.0.1:3000
      curl -s -o /dev/null -w "api %{http_code}\n" http://127.0.0.1:4000/api/settings

 3. nginx și SSL, ca root (doar după ce cele două curl dau 200):
      cp /home/${APP_USER}/app/deploy/nginx-minaionita.conf /etc/nginx/sites-available/${DOMAIN}
      ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}
      nginx -t && systemctl reload nginx
      certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}

 4. Pornire automată la reboot:
      pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER}
      (rulează comanda pe care o afișează)

 Nu uita: DNS-ul pentru ${DOMAIN} trebuie să arate spre IP-ul acestui server
 ÎNAINTE de pasul 3, altfel certbot nu poate valida domeniul.
────────────────────────────────────────────────────────────
EOF
