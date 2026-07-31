/**
 * PM2 — două procese: API-ul NestJS și site-ul Next.js.
 *
 * Nu folosim „Setup Node.js App" din cPanel (Passenger): are nevoie de un
 * singur punct de intrare per aplicație, iar aici sunt două procese distincte
 * care trebuie să pornească în ordine și să se repornească independent.
 *
 * Ambele ascultă doar pe loopback. Singurul lucru expus către internet e
 * Apache/LiteSpeed, care face proxy — vezi deploy/README-deploy.md.
 */
module.exports = {
  apps: [
    {
      name: "mina-api",
      cwd: "./apps/api",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        // main.ts leagă pe 127.0.0.1 când NODE_ENV=production.
        PORT: 4000,
      },
      max_memory_restart: "400M",
      // Dacă procesul moare la boot din cauza unui secret lipsă, validateEnv
      // aruncă imediat — nu vrem PM2 să reîncerce la infinit și să umple logul.
      min_uptime: "10s",
      max_restarts: 5,
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      time: true,
    },
    {
      name: "mina-web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000 --hostname 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "600M",
      min_uptime: "10s",
      max_restarts: 5,
      error_file: "./logs/web-error.log",
      out_file: "./logs/web-out.log",
      time: true,
    },
  ],
};
