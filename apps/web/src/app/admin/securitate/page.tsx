"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import { api, ApiError } from "@/lib/admin-api";

const input =
  "min-h-11 w-40 rounded-md border border-rule-strong bg-cream px-3 text-center text-lg tracking-[0.3em] text-ink tabular focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export default function SecurityPage() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    try {
      const me = await api.me();
      setEnabled(me.twoFactorEnabled);
    } catch {
      setError("Nu am putut încărca starea contului.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function start() {
    setError(null);
    try {
      const { qr } = await api.start2fa();
      setQr(qr);
    } catch {
      setError("Nu am putut porni configurarea.");
    }
  }

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      await api.confirm2fa(code);
      setEnabled(true);
      setQr(null);
      setCode("");
      flash("2FA activat. Contul e protejat.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cod greșit.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setError(null);
    try {
      await api.disable2fa(code);
      setEnabled(false);
      setCode("");
      flash("2FA dezactivat.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cod greșit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-display text-ink">Securitate</h1>
        <p className="mt-1 text-sm text-muted">
          Autentificare în doi pași (2FA) cu o aplicație precum Google
          Authenticator sau 1Password.
        </p>
      </div>

      <div className="mt-8 max-w-xl rounded-lg border border-rule bg-cream-sunk p-6 sm:p-8">
        {enabled === null ? (
          <p className="text-sm text-muted">Se încarcă…</p>
        ) : enabled ? (
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-success">
              <span aria-hidden className="size-2 rounded-full bg-success" />
              2FA este activat
            </p>
            <p className="mt-4 text-sm text-muted">
              Ca să dezactivezi, introdu un cod curent din aplicație:
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={input}
                placeholder="000000"
              />
              <button
                onClick={disable}
                disabled={busy || code.length !== 6}
                className="min-h-11 cursor-pointer rounded-full border border-rule-strong px-5 text-sm text-ink transition-colors duration-200 hover:border-danger hover:text-danger disabled:opacity-50"
              >
                Dezactivează 2FA
              </button>
            </div>
          </div>
        ) : qr ? (
          <div>
            <p className="text-sm text-muted">
              1. Scanează codul cu aplicația ta de autentificare:
            </p>
            <img
              src={qr}
              alt="Cod QR pentru 2FA"
              width={180}
              height={180}
              className="mt-4 rounded-lg border border-rule bg-cream p-2"
            />
            <p className="mt-5 text-sm text-muted">
              2. Introdu codul de 6 cifre afișat în aplicație:
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={input}
                placeholder="000000"
              />
              <button
                onClick={confirm}
                disabled={busy || code.length !== 6}
                className="min-h-11 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
              >
                Activează
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted">
              2FA nu este activat. Recomandat înainte ca adminul să conțină date
              sensibile (parole clienți, contracte).
            </p>
            <button
              onClick={start}
              className="mt-5 min-h-11 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light"
            >
              Activează 2FA
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      </div>

      <SaveToast show={!!toast} label={toast} />
    </AdminShell>
  );
}
