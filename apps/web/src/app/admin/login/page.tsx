"use client";

import Image from "next/image";
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
      router.push("/admin");
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

  const field =
    "min-h-12 w-full rounded-md border border-rule-strong bg-cream px-4 text-base text-ink transition-colors duration-200 focus:border-gold";

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Image
          src="/brand/logo-mi-gold-light.png"
          alt="Mina Ioniță"
          width={1104}
          height={425}
          className="h-10 w-auto"
        />
        <h1 className="mt-8 font-display text-display text-ink">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Autentifică-te ca să administrezi conținutul și tichetele.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
              className={`${field} disabled:opacity-60`}
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
              className={`${field} disabled:opacity-60`}
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
                className={`${field} tabular tracking-[0.3em]`}
                placeholder="000000"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="min-h-11 w-full cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
          >
            {busy ? "Se verifică…" : needCode ? "Confirmă codul" : "Intră în admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
