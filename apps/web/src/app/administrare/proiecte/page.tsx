"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  api,
  PROJECT_STAGES,
  type ProjectRow,
  STAGE_LABELS,
} from "@/lib/admin-api";

const daysLeft = (d?: string | null): number | null => {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
};

/** Small amber/red pill when an expiry is within 30 days. */
function ExpiryChip({ label, iso }: { label: string; iso?: string | null }) {
  const n = daysLeft(iso);
  if (n === null || n > 30) return null;
  const tone = n <= 7 ? "bg-danger/10 text-danger" : "bg-gold/20 text-gold-deep";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${tone}`}>
      {label} {n < 0 ? "expirat" : `${n}z`}
    </span>
  );
}

const money = (v: ProjectRow["contractValue"], cur?: string | null) => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (!n || Number.isNaN(n)) return null;
  return `${n.toLocaleString("ro-RO")} ${cur ?? "RON"}`;
};

export default function ProjectsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [stageFilter, setStageFilter] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [savingStage, setSavingStage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await api.projects());
      setError(null);
    } catch {
      setError("Nu am putut încărca proiectele.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function addProject() {
    setCreating(true);
    try {
      const p = await api.createProject({ clientName: "Client nou", stage: "QUOTED" });
      router.push(`/administrare/proiecte/${p.id}`);
    } catch {
      setError("Nu am putut crea proiectul.");
      setCreating(false);
    }
  }

  async function changeStage(id: string, stage: string) {
    setSavingStage(id);
    setItems((list) => list.map((p) => (p.id === id ? { ...p, stage } : p)));
    try {
      await api.updateProject(id, { stage });
    } catch {
      setError("Nu am putut schimba etapa.");
      await load();
    } finally {
      setSavingStage(null);
    }
  }

  const counts = useMemo(() => {
    const by: Record<string, number> = {};
    for (const p of items) by[p.stage] = (by[p.stage] ?? 0) + 1;
    return by;
  }, [items]);

  const activeRevenue = useMemo(() => {
    const total = items
      .filter((p) => p.stage === "LIVE" || p.stage === "MAINTENANCE")
      .reduce((sum, p) => {
        const n = typeof p.contractValue === "string" ? parseFloat(p.contractValue) : p.contractValue;
        return sum + (n && !Number.isNaN(n) ? n : 0);
      }, 0);
    return total > 0 ? total : null;
  }, [items]);

  const visible = useMemo(() => {
    let list = items;
    if (stageFilter !== "all") list = list.filter((p) => p.stage === stageFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.clientName, p.companyName, p.siteUrl, p.domain, p.contactEmail]
          .some((f) => (f ?? "").toLowerCase().includes(q)),
      );
    }
    return list;
  }, [items, stageFilter, query]);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-ink">Clienți & proiecte</h1>
          <p className="mt-1 text-sm text-muted">
            Fișe private: domenii, hosting, expirări și seiful de parole. Doar tu
            le vezi.
          </p>
        </div>
        <button
          onClick={addProject}
          disabled={creating}
          className="min-h-11 cursor-pointer rounded-full bg-gold px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {creating ? "Se creează…" : "+ Client nou"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Stage summary — each chip filters */}
      {!loading && items.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip label="Toți" value={items.length} active={stageFilter === "all"} onClick={() => setStageFilter("all")} />
          {PROJECT_STAGES.map((s) => (
            <FilterChip
              key={s}
              label={STAGE_LABELS[s]}
              value={counts[s] ?? 0}
              active={stageFilter === s}
              onClick={() => setStageFilter(s)}
            />
          ))}
          {activeRevenue && (
            <span className="ml-auto self-center rounded-full bg-cream-sunk px-3 py-1 text-xs text-muted">
              Recurent activ: <span className="font-medium text-ink">{money(activeRevenue)}</span>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Se încarcă…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-rule bg-cream-sunk p-10 text-center">
          <p className="font-display text-title text-ink">Niciun client încă.</p>
          <p className="mt-2 text-sm text-muted">Adaugă primul cu butonul de sus.</p>
        </div>
      ) : (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută după nume, firmă, site sau email…"
            className="mt-5 min-h-10 w-full max-w-sm rounded-full border border-rule-strong bg-cream px-4 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />

          {visible.length === 0 ? (
            <p className="mt-8 text-sm text-muted">Niciun client nu se potrivește.</p>
          ) : (
            <ul className="mt-4 divide-y divide-rule overflow-hidden rounded-lg border border-rule">
              {visible.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-cream p-4">
                  {/* Identity — click opens the file */}
                  <div className="min-w-[12rem] flex-1">
                    <button
                      onClick={() => router.push(`/administrare/proiecte/${p.id}`)}
                      className="block cursor-pointer text-left font-medium text-ink hover:text-gold-deep"
                    >
                      {p.clientName}
                    </button>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {p.companyName || p.contactEmail || "—"}
                      {p.siteUrl && (
                        <>
                          {" · "}
                          <a
                            href={p.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-gold-deep"
                          >
                            {p.siteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Signals */}
                  <div className="flex flex-wrap items-center gap-2">
                    <ExpiryChip label="SSL" iso={p.sslExpiresAt} />
                    <ExpiryChip label="Domeniu" iso={p.domainExpiresAt} />
                    <ExpiryChip label="Hosting" iso={p.hostingExpiresAt} />
                    {!!p._count?.credentials && (
                      <span className="rounded-full bg-cream-sunk px-2 py-0.5 text-xs text-muted">
                        🔑 {p._count.credentials}
                      </span>
                    )}
                    {money(p.contractValue, p.currency) && (
                      <span className="text-xs text-muted tabular">{money(p.contractValue, p.currency)}</span>
                    )}
                  </div>

                  {/* Inline stage editor */}
                  <select
                    value={p.stage}
                    onChange={(e) => changeStage(p.id, e.target.value)}
                    disabled={savingStage === p.id}
                    aria-label={`Etapă ${p.clientName}`}
                    className="min-h-9 cursor-pointer rounded-full border border-rule-strong bg-cream px-3 text-xs text-ink transition-colors duration-200 hover:border-gold focus:border-gold focus:outline-none disabled:opacity-50"
                  >
                    {PROJECT_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {STAGE_LABELS[s]}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => router.push(`/administrare/proiecte/${p.id}`)}
                    aria-label={`Deschide ${p.clientName}`}
                    className="cursor-pointer text-gold transition-transform duration-200 hover:translate-x-0.5"
                  >
                    →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AdminShell>
  );
}

function FilterChip({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ${
        active ? "border-gold bg-cream-sunk text-ink" : "border-rule text-muted hover:border-rule-strong hover:text-ink"
      }`}
    >
      {label}
      <span className={`tabular text-xs ${active ? "text-gold-deep" : "text-muted"}`}>{value}</span>
    </button>
  );
}
