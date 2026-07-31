"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  api,
  auth,
  type Lead,
  STATUS_LABELS,
  TICKET_STATUSES,
} from "@/lib/admin-api";

export default function TicketsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLeads(await api.leads(filter || undefined));
      setError(null);
    } catch {
      if (auth.token) setError("Nu mă pot conecta la API. Pornește-l cu node dist/main.js.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function changeStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await api.setLeadStatus(id, status);
    } catch {
      void load();
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-ink">Tichete</h1>
          <p className="mt-1 text-sm text-muted">
            Fiecare cerere din formularul site-ului ajunge aici.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-h-11 cursor-pointer rounded-md border border-rule-strong bg-cream px-3 text-sm"
        >
          <option value="">Toate statusurile</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Se încarcă…</p>
      ) : leads.length === 0 && !error ? (
        <div className="mt-10 rounded-lg border border-rule bg-cream-sunk p-10 text-center">
          <p className="font-display text-title text-ink">Niciun tichet încă.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Trimite formularul de pe pagina de contact și apare aici, cu tot cu
            sursă și UTM-uri.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-lg border border-rule bg-cream-sunk p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <a href={`/administrare/tichete/${lead.id}`} className="group min-w-0">
                  <p className="font-medium text-ink group-hover:text-gold-deep">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {lead.email}
                    {lead.phone && <span className="tabular"> · {lead.phone}</span>}
                  </p>
                </a>
                <select
                  value={lead.status}
                  onChange={(e) => changeStatus(lead.id, e.target.value)}
                  className="min-h-9 cursor-pointer rounded-full border border-rule-strong bg-cream px-3 text-xs"
                >
                  {TICKET_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              {lead.message && (
                <a href={`/administrare/tichete/${lead.id}`} className="mt-3 block line-clamp-2 text-sm leading-relaxed text-muted hover:text-ink">
                  {lead.message}
                </a>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule pt-3 text-xs text-muted">
                <span>{new Date(lead.createdAt).toLocaleString("ro-RO")}</span>
                {lead.service && <span>{lead.service.title}</span>}
                {lead.utmSource && <span>Sursă: {lead.utmSource}</span>}
                <a href={`/administrare/tichete/${lead.id}`} className="ml-auto text-gold-deep hover:underline">
                  Deschide →
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
