"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { api, type SiteStatus } from "@/lib/admin-api";

type Filter = "all" | "down" | "expiring" | "online";

/** Accept "example.com" or a full URL; return a normalized https URL or null. */
function normalizeUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(withProto);
    return u.hostname.includes(".") ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Sort priority: problems first (down → expired/expiring SSL → slow → healthy). */
function urgency(s: SiteStatus): number {
  if (s.up === false) return 0;
  if (s.sslDaysLeft !== null && s.sslDaysLeft <= 7) return 1;
  const soon = [s.sslDaysLeft, s.domainDaysLeft, s.hostingDaysLeft].some(
    (n) => n !== null && n <= 30,
  );
  if (soon) return 2;
  if (s.responseMs !== null && s.responseMs > 1500) return 3;
  return 4;
}

/** A date-based expiry (SSL/domain/hosting) within 30 days. */
const isExpiring = (s: SiteStatus) =>
  [s.sslDaysLeft, s.domainDaysLeft, s.hostingDaysLeft].some((n) => n !== null && n <= 30);

/** Anything that warrants action: currently down or expiring soon. */
const needsAttention = (s: SiteStatus) => s.up === false || isExpiring(s);

/** Countdown badge: green >30d, amber 8–30d, red ≤7d (brief §5quater.2). */
function Days({ n, label }: { n: number | null; label: string }) {
  if (n === null) return <span className="text-xs text-muted/60">{label}: —</span>;
  const tone =
    n <= 7 ? "bg-danger/10 text-danger" : n <= 30 ? "bg-gold/20 text-gold-deep" : "bg-success/10 text-success";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${tone}`}>
      {label}: {n < 0 ? "expirat" : `${n} zile`}
    </span>
  );
}

/** Clickable summary stat that doubles as a filter. */
function Stat({
  label,
  value,
  active,
  tone,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[6.5rem] flex-1 cursor-pointer flex-col items-start rounded-lg border px-4 py-3 text-left transition-colors duration-200 ${
        active ? "border-gold bg-cream-sunk" : "border-rule hover:border-rule-strong"
      }`}
    >
      <span className={`font-display text-title tabular ${tone}`}>{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </button>
  );
}

export default function MonitorPage() {
  const [items, setItems] = useState<SiteStatus[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [bulkSsl, setBulkSsl] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.monitoringStatus());
      setError(null);
    } catch {
      setError("Nu am putut încărca statusul.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function refreshSsl(id: string) {
    setRefreshing(id);
    try {
      await api.refreshSsl(id);
      await load();
    } finally {
      setRefreshing(null);
    }
  }

  async function refreshAllSsl() {
    if (!items) return;
    setBulkSsl(true);
    try {
      await Promise.all(items.map((s) => api.refreshSsl(s.projectId).catch(() => {})));
      await load();
    } finally {
      setBulkSsl(false);
    }
  }

  async function addSite(e: React.FormEvent) {
    e.preventDefault();
    const siteUrl = normalizeUrl(url);
    if (!siteUrl) {
      setError("Introdu un URL valid, ex. exemplu.ro");
      return;
    }
    setAdding(true);
    setError(null);
    try {
      const created = await api.createProject({
        clientName: name.trim() || new URL(siteUrl).hostname,
        siteUrl,
      });
      await api.refreshSsl(created.id).catch(() => {});
      setName("");
      setUrl("");
      await load();
    } catch {
      setError("Nu am putut adăuga site-ul. Verifică conexiunea la API.");
    } finally {
      setAdding(false);
    }
  }

  async function removeSite(s: SiteStatus) {
    if (!confirm(`Elimini „${s.clientName}" din monitorizare? Se șterge și fișa de client.`)) return;
    try {
      await api.deleteProject(s.projectId);
      await load();
    } catch {
      setError("Nu am putut elimina site-ul.");
    }
  }

  const counts = useMemo(() => {
    const list = items ?? [];
    return {
      total: list.length,
      online: list.filter((s) => s.up === true).length,
      down: list.filter((s) => s.up === false).length,
      expiring: list.filter(isExpiring).length,
      attention: list.filter(needsAttention).length,
    };
  }, [items]);

  const visible = useMemo(() => {
    let list = [...(items ?? [])];
    if (filter === "down") list = list.filter((s) => s.up === false);
    else if (filter === "online") list = list.filter((s) => s.up === true);
    else if (filter === "expiring") list = list.filter(isExpiring);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.clientName.toLowerCase().includes(q) || (s.siteUrl ?? "").toLowerCase().includes(q),
      );
    }
    return list.sort(
      (a, b) =>
        urgency(a) - urgency(b) ||
        (a.sslDaysLeft ?? 9999) - (b.sslDaysLeft ?? 9999) ||
        a.clientName.localeCompare(b.clientName, "ro"),
    );
  }, [items, filter, query]);

  const attention = counts.attention;

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-ink">Monitor site-uri</h1>
          <p className="mt-1 text-sm text-muted">
            Uptime în timp real și expirări (domeniu, hosting, SSL). Verificare
            automată în fundal.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshAllSsl}
            disabled={bulkSsl || !items?.length}
            className="min-h-11 cursor-pointer rounded-full border border-rule-strong px-5 text-sm text-ink transition-colors duration-200 hover:border-gold hover:bg-cream-sunk disabled:opacity-50"
          >
            {bulkSsl ? "Verific SSL…" : "Reverifică SSL"}
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="min-h-11 cursor-pointer rounded-full bg-ink px-5 text-sm text-cream transition-colors duration-200 hover:bg-ink/90 disabled:opacity-50"
          >
            {loading ? "Verific…" : "Verifică acum"}
          </button>
        </div>
      </div>

      {/* Health summary — each stat filters the list */}
      {items && items.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Stat label="Total" value={counts.total} tone="text-ink" active={filter === "all"} onClick={() => setFilter("all")} />
          <Stat label="Online" value={counts.online} tone="text-success" active={filter === "online"} onClick={() => setFilter("online")} />
          <Stat label="Indisponibile" value={counts.down} tone={counts.down ? "text-danger" : "text-muted"} active={filter === "down"} onClick={() => setFilter("down")} />
          <Stat label="Expiră ≤30 zile" value={counts.expiring} tone={counts.expiring ? "text-gold-deep" : "text-muted"} active={filter === "expiring"} onClick={() => setFilter("expiring")} />
        </div>
      )}

      <form onSubmit={addSite} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-rule bg-cream-sunk p-4">
        <div className="min-w-[10rem] flex-1">
          <label htmlFor="mon-url" className="mb-1.5 block text-sm font-medium text-ink">
            Adaugă un site de monitorizat
          </label>
          <input
            id="mon-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="exemplu.ro"
            className="min-h-11 w-full rounded-md border border-rule-strong bg-cream px-3 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div className="min-w-[9rem] flex-1">
          <label htmlFor="mon-name" className="mb-1.5 block text-sm font-medium text-ink">
            Nume (opțional)
          </label>
          <input
            id="mon-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Ikabane"
            className="min-h-11 w-full rounded-md border border-rule-strong bg-cream px-3 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="min-h-11 shrink-0 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {adding ? "Se adaugă…" : "Adaugă"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      {items === null ? (
        <p className="mt-10 text-sm text-muted">Se verifică…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-rule bg-cream-sunk p-10 text-center">
          <p className="font-display text-title text-ink">Niciun site de monitorizat.</p>
          <p className="mt-2 text-sm text-muted">
            Adaugă un site în câmpul de sus, sau completează datele de domeniu și
            hosting pentru clienți în secțiunea{" "}
            <Link href="/admin/proiecte" className="text-gold-deep hover:underline">Clienți</Link>.
          </p>
        </div>
      ) : (
        <>
          {/* Search + attention hint */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută după nume sau URL…"
              className="min-h-10 w-full max-w-xs rounded-full border border-rule-strong bg-cream px-4 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            <span className="text-xs text-muted">
              {attention > 0
                ? `${attention} ${attention === 1 ? "site necesită" : "site-uri necesită"} atenție`
                : "Toate site-urile sunt sănătoase"}
            </span>
          </div>

          {visible.length === 0 ? (
            <p className="mt-8 text-sm text-muted">Niciun site nu se potrivește filtrului.</p>
          ) : (
            <ul className="mt-4 divide-y divide-rule overflow-hidden rounded-lg border border-rule">
              {visible.map((s) => {
                const down = s.up === false;
                const slow = s.responseMs !== null && s.responseMs > 1500;
                return (
                  <li
                    key={s.projectId}
                    className={`flex flex-wrap items-center gap-x-4 gap-y-3 p-4 ${down ? "bg-danger/[0.04]" : "bg-cream"}`}
                  >
                    {/* Identity */}
                    <div className="flex min-w-[12rem] flex-1 items-center gap-3">
                      <span
                        aria-hidden
                        className={`size-2.5 shrink-0 rounded-full ${
                          s.up === true ? "bg-success" : down ? "bg-danger" : "bg-muted/40"
                        }`}
                      />
                      <div className="min-w-0">
                        <Link href={`/admin/proiecte/${s.projectId}`} className="block truncate font-medium text-ink hover:text-gold-deep">
                          {s.clientName}
                        </Link>
                        {s.siteUrl && (
                          <a
                            href={s.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-xs text-muted hover:text-gold-deep"
                          >
                            {s.siteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Uptime + latency */}
                    <div className="w-24 shrink-0 text-xs">
                      {s.up === true ? (
                        <span className="text-success">Online</span>
                      ) : down ? (
                        <span className="font-medium text-danger">Indisponibil</span>
                      ) : (
                        <span className="text-muted">Fără URL</span>
                      )}
                      {s.responseMs != null && s.up && (
                        <span className={`tabular ${slow ? "text-gold-deep" : "text-muted"}`}> · {s.responseMs} ms</span>
                      )}
                    </div>

                    {/* Expiry badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Days n={s.sslDaysLeft} label="SSL" />
                      <Days n={s.domainDaysLeft} label="Domeniu" />
                      {s.openIncidents > 0 && (
                        <span className="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs text-danger">
                          {s.openIncidents} incident(e)
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-auto flex shrink-0 items-center gap-1">
                      {s.siteUrl && (
                        <button
                          onClick={() => refreshSsl(s.projectId)}
                          disabled={refreshing === s.projectId}
                          className="min-h-8 cursor-pointer rounded-full border border-rule-strong px-3 text-xs text-muted transition-colors duration-200 hover:border-gold hover:text-ink disabled:opacity-50"
                        >
                          {refreshing === s.projectId ? "SSL…" : "Verifică SSL"}
                        </button>
                      )}
                      <button
                        onClick={() => removeSite(s)}
                        aria-label={`Elimină ${s.clientName}`}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </AdminShell>
  );
}
