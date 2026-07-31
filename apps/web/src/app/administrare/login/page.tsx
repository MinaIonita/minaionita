"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError, auth } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needCode, setNeedCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api.login(email, password, needCode ? code : undefined);
      if ("twoFactorRequired" in res) {
        setNeedCode(true);
        setBusy(false);
        return;
      }
      auth.set(res.token);
      router.push("/administrare");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? needCode
            ? "Cod 2FA greșit."
            : "Email sau parolă greșite."
          : err instanceof ApiError && err.status === 429
            ? "Prea multe încercări. Așteaptă un minut."
            : "Nu mă pot conecta la server. Pornește API-ul (node dist/main.js).",
      );
      setBusy(false);
    }
  }

  // focus:ring alongside the border so the focus state is visible for keyboard
  // users, not just a hairline colour change.
  const field =
    "min-h-12 w-full rounded-lg border bg-cream px-4 text-base text-ink transition-all duration-200 placeholder:text-muted/40 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15";

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      {/* Same monogram watermark the public pages use — the admin is behind a
          login, but it is still the same brand, and a bare form on white read
          like a staging environment. */}
      <div
        aria-hidden
        className="hero-mark pointer-events-none absolute -right-24 top-1/2 hidden aspect-[1104/425] w-[46rem] -translate-y-1/2 select-none opacity-[0.05] lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_-10%,rgba(201,162,78,0.10),transparent_70%)]"
      />

      <div className="relative w-full max-w-sm">
        <Image
          src="/brand/logo-mi-gold-light.png"
          alt="Mina Ioniță"
          width={1104}
          height={425}
          priority
          className="h-10 w-auto"
        />

        <div className="mt-9 rounded-xl border border-rule bg-cream p-7 shadow-[0_18px_50px_-30px_rgba(20,20,15,0.4)] sm:p-8">
          <p className="text-eyebrow font-medium uppercase text-gold-deep">
            Administrare
          </p>
          <h1 className="mt-3 font-display text-title text-ink">
            {needCode ? "Verificare în doi pași" : "Bine ai revenit"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {needCode
              ? "Deschide aplicația de autentificare și introdu codul de 6 cifre."
              : "Autentifică-te ca să administrezi conținutul și tichetele."}
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              disabled={needCode}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${field} border-rule-strong disabled:opacity-60`}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Parolă
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={needCode}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${field} border-rule-strong disabled:opacity-60`}
            />
          </div>

          {needCode && (
            <div>
              <label htmlFor="code" className="mb-2 block text-sm font-medium">
                Cod din aplicația de autentificare
              </label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={`${field} tabular border-rule-strong text-center text-lg tracking-[0.4em]`}
                placeholder="000000"
              />
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm leading-relaxed text-danger"
            >
              <span aria-hidden className="mt-0.5 shrink-0">
                <svg viewBox="0 0 16 16" fill="none" className="size-4">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                  <path
                    d="M8 5v3.5M8 11h.01"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light active:bg-gold-deep active:text-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && (
              <span
                aria-hidden
                className="size-3.5 animate-spin rounded-full border-2 border-ink/25 border-t-ink"
              />
            )}
            {busy ? "Se verifică…" : needCode ? "Confirmă codul" : "Intră în administrare"}
          </button>

          {needCode && (
            <button
              type="button"
              onClick={() => {
                setNeedCode(false);
                setCode("");
                setError(null);
              }}
              className="min-h-11 w-full cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-ink"
            >
              Înapoi la email și parolă
            </button>
          )}
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Zonă privată ·{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-ink">
            înapoi la site
          </Link>
        </p>
      </div>
    </div>
  );
}
