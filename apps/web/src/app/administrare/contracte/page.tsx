"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { api, type ContractRow } from "@/lib/admin-api";

export default function ContractsListPage() {
  const [items, setItems] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await api.contracts());
      setError(null);
    } catch {
      setError("Nu am putut încărca contractele.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-ink">Contracte</h1>
          <p className="mt-1 text-sm text-muted">
            Generator cu autocompletare ANAF după CUI și numerotare automată.
          </p>
        </div>
        <Link
          href="/administrare/contracte/nou"
          className="min-h-11 cursor-pointer rounded-full bg-gold px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light inline-flex items-center"
        >
          + Contract nou
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Se încarcă…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-rule bg-cream-sunk p-10 text-center">
          <p className="font-display text-title text-ink">Niciun contract încă.</p>
          <p className="mt-2 text-sm text-muted">Generează primul cu butonul de sus.</p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-lg border border-rule">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                href={`/administrare/contracte/${c.id}`}
                className="flex items-center justify-between gap-4 bg-cream px-5 py-4 transition-colors duration-200 hover:bg-cream-sunk"
              >
                <div className="min-w-0">
                  <p className="tabular font-medium text-ink">{c.number}</p>
                  <p className="mt-0.5 text-sm text-muted">{c.partyName}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm text-muted">
                  <span className="tabular">
                    {Number(c.amount).toLocaleString("ro-RO")} {c.currency}
                  </span>
                  <span aria-hidden className="text-gold">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
