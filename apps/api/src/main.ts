import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { validateEnv } from "./config/env";

async function bootstrap() {
  // Before anything else: refuse to start on a missing or placeholder secret.
  validateEnv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Admin API lives under /api; the public site calls the same origin.
  app.setGlobalPrefix("api");

  /**
   * The API sits behind a reverse proxy in production (brief §7 puts it on a
   * VPS). Without this, req.ip is the proxy's address — so the login throttle
   * would see every visitor as one client and lock out the world after 8
   * attempts.
   *
   * Exactly one hop is trusted. `true` would honour any X-Forwarded-For a client
   * sends, letting an attacker rotate a fake IP per request and bypass rate
   * limiting altogether.
   */
  app.set("trust proxy", 1);

  /**
   * Security headers. contentSecurityPolicy is disabled here deliberately: this
   * app serves JSON, not documents, and the page-level CSP belongs to Next.js,
   * where the inline consent script's nonce is issued.
   */
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "same-site" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
    }),
  );

  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(","),
    credentials: true,
  });

  // Strip unknown fields and reject malformed bodies at the edge.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 4000;
  // Loopback in production: the proxy should be the only thing that can reach
  // the API. Binding 0.0.0.0 on a VPS publishes it to the internet, admin
  // endpoints included.
  const host =
    process.env.HOST ??
    (process.env.NODE_ENV === "production" ? "127.0.0.1" : "0.0.0.0");

  await app.listen(port, host);
  console.log(`API on http://${host}:${port}/api`);
}
void bootstrap();
