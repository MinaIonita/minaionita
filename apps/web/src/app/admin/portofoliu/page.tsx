"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  api,
  CONTENT_STATUS_LABELS,
  type PortfolioRow,
} from "@/lib/admin-api";

export default function PortfolioListPage() {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await api.portfolio());
      setError(null);
    } catch {
      setError("Nu am putut încărca portofoliul.");
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
      <div>
        <h1 className="font-display text-display text-ink">Portofoliu</h1>
        <p className="mt-1 text-sm text-muted">
          {items.length} proiecte. Modificările apar pe homepage și pe pagina de
          portofoliu.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Se încarcă…</p>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-lg border border-rule">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/portofoliu/${p.id}`}
                className="flex items-center justify-between gap-4 bg-cream px-5 py-4 transition-colors duration-200 hover:bg-cream-sunk"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {p.client}
                    {p.featured && (
                      <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] text-gold-deep">
                        homepage
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {p.category} · {p.body?.year ?? "—"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      p.status === "PUBLISHED"
                        ? "bg-success/10 text-success"
                        : "bg-cream-sunk text-muted"
                    }`}
                  >
                    {CONTENT_STATUS_LABELS[p.status] ?? p.status}
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
