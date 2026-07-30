/**
 * Fail-fast environment validation (brief §7).
 *
 * The secrets below had `?? "dev-only-secret-change-me"` fallbacks at their use
 * sites. That is the worst possible failure mode: a deploy that forgets
 * JWT_SECRET starts up perfectly and signs admin tokens with a value published
 * in this repository's history, so anyone can mint one. Refusing to boot is the
 * only safe behaviour — a container that won't start gets noticed, a silently
 * insecure one does not.
 */

const MIN_SECRET_LENGTH = 32;

function fail(messages: string[]): never {
  throw new Error(
    `Configurare invalidă — API-ul nu pornește:\n  - ${messages.join("\n  - ")}\n` +
      `Vezi apps/api/.env.example.`,
  );
}

/** Called once at boot, before the Nest app is created. */
export function validateEnv() {
  const problems: string[] = [];

  const jwt = process.env.JWT_SECRET;
  if (!jwt) {
    problems.push("JWT_SECRET lipsește (generează: openssl rand -base64 48)");
  } else if (jwt.length < MIN_SECRET_LENGTH) {
    problems.push(
      `JWT_SECRET e prea scurt (${jwt.length} caractere, minim ${MIN_SECRET_LENGTH})`,
    );
  } else if (/dev-only|change-me|schimba-ma|secret123/i.test(jwt)) {
    problems.push("JWT_SECRET e o valoare placeholder — înlocuiește-o");
  }

  // Shape is validated in crypto.util on first use; presence is checked here so
  // the failure lands at boot instead of the first 2FA setup.
  const encKey = process.env.ENCRYPTION_KEY;
  if (!encKey) {
    problems.push(
      "ENCRYPTION_KEY lipsește (generează: openssl rand -base64 32)",
    );
  } else if (Buffer.from(encKey, "base64").length !== 32) {
    problems.push("ENCRYPTION_KEY trebuie să decodeze la exact 32 de bytes");
  }

  if (!process.env.DATABASE_URL) {
    problems.push("DATABASE_URL lipsește");
  }

  if (process.env.NODE_ENV === "production") {
    if (!process.env.CORS_ORIGIN) {
      problems.push(
        "CORS_ORIGIN lipsește — în producție originea trebuie declarată explicit",
      );
    }
    const adminPass = process.env.ADMIN_PASSWORD;
    if (adminPass && /schimba-ma|change-me|admin123/i.test(adminPass)) {
      problems.push("ADMIN_PASSWORD e încă valoarea din exemplu");
    }
  }

  if (problems.length > 0) fail(problems);
}

/** Validated accessor — safe to call after validateEnv(). */
export function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}
