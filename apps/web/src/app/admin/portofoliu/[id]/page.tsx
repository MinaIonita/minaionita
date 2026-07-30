"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import {
  api,
  CONTENT_STATUSES,
  CONTENT_STATUS_LABELS,
  type PortfolioRow,
} from "@/lib/admin-api";

const input =
  "min-h-11 w-full rounded-md border border-rule-strong bg-cream px-3 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";
const area = `${input} min-h-24 py-2`;

export default function PortfolioEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<PortfolioRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      setP(await api.portfolioItem(id));
    } catch {
      setError("Nu am putut încărca proiectul.");
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const patch = (n: Partial<PortfolioRow>) => setP((s) => (s ? { ...s, ...n } : s));
  const patchBody = (n: Partial<PortfolioRow["body"]>) =>
    setP((s) => (s ? { ...s, body: { ...s.body, ...n } } : s));

  async function save() {
    if (!p) return;
    setSaving(true);
    try {
      await api.updatePortfolio(p.id, {
        client: p.client,
        category: p.category,
        liveUrl: p.liveUrl,
        tech: p.tech,
        featured: p.featured,
        status: p.status,
        body: p.body,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setError("Nu am putut salva.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !p) {
    return (
      <AdminShell>
        <p className="text-sm text-danger">{error}</p>
      </AdminShell>
    );
  }
  if (!p) {
    return (
      <AdminShell>
        <p className="text-sm text-muted">Se încarcă…</p>
      </AdminShell>
    );
  }

  const b = p.body ?? {};
  const techStr = (p.tech ?? []).join(", ");

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/portofoliu" className="text-xs text-muted hover:text-ink">
            ← Portofoliu
          </Link>
          <h1 className="mt-2 font-display text-display text-ink">{p.client}</h1>
          <p className="mt-1 text-sm text-muted">/{p.slug}</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="min-h-11 shrink-0 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? "Se salvează…" : "Salvează"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <F label="Client">
            <input className={input} value={p.client} onChange={(e) => patch({ client: e.target.value })} />
          </F>
          <F label="Categorie">
            <input className={input} value={p.category} onChange={(e) => patch({ category: e.target.value })} />
          </F>
          <F label="An">
            <input
              type="number"
              className={input}
              value={b.year ?? ""}
              onChange={(e) => patchBody({ year: Number(e.target.value) })}
            />
          </F>
          <F label="Status">
            <select
              className={`${input} cursor-pointer`}
              value={p.status}
              onChange={(e) => patch({ status: e.target.value })}
            >
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {CONTENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </F>
        </div>

        <F label="Descriere">
          <textarea className={area} value={b.description ?? ""} onChange={(e) => patchBody({ description: e.target.value })} />
        </F>

        <div className="grid gap-5 sm:grid-cols-2">
          <F label="Link live (URL)">
            <input className={input} value={p.liveUrl ?? ""} onChange={(e) => patch({ liveUrl: e.target.value })} />
          </F>
          <F label="Icon (lucide)">
            <input className={input} value={b.icon ?? ""} onChange={(e) => patchBody({ icon: e.target.value })} />
          </F>
        </div>

        <F label="Tagline (pe copertă)">
          <input className={input} value={b.tagline ?? ""} onChange={(e) => patchBody({ tagline: e.target.value })} />
        </F>

        <F label="Tehnologii (separate prin virgulă)">
          <input
            className={input}
            value={techStr}
            onChange={(e) =>
              patch({ tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
            }
          />
        </F>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={p.featured}
            onChange={(e) => patch({ featured: e.target.checked })}
            className="size-4 accent-gold"
          />
          Afișat pe homepage (proiect selectat)
        </label>
      </div>

      <div className="mt-10 border-t border-rule pt-6">
        <button
          onClick={save}
          disabled={saving}
          className="min-h-11 cursor-pointer rounded-full bg-gold px-8 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? "Se salvează…" : "Salvează"}
        </button>
      </div>

      <SaveToast show={saved} label="Salvat. Modificările sunt live pe site." />
    </AdminShell>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}
