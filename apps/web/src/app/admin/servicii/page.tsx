"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  api,
  CONTENT_STATUS_LABELS,
  type ServiceRow,
} from "@/lib/admin-api";

export default function ServicesListPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setServices(await api.services());
      setError(null);
    } catch {
      setError("Nu am putut încărca serviciile.");
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
        <h1 className="font-display text-display text-ink">Servicii</h1>
        <p className="mt-1 text-sm text-muted">
          Editează serviciile afișate pe site. Modificările apar imediat pe front.
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
          {services.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/servicii/${s.id}`}
                className="flex items-center justify-between gap-4 bg-cream px-5 py-4 transition-colors duration-200 hover:bg-cream-sunk"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{s.title}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">{s.summary}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      s.status === "PUBLISHED"
                        ? "bg-success/10 text-success"
                        : "bg-cream-sunk text-muted"
                    }`}
                  >
                    {CONTENT_STATUS_LABELS[s.status] ?? s.status}
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
