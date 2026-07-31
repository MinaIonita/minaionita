"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import {
  api,
  CONTENT_STATUSES,
  CONTENT_STATUS_LABELS,
  type ServiceRow,
} from "@/lib/admin-api";
import { MIN_PUBLISH_SCORE, validateService } from "@/lib/seo-validator";

const input =
  "min-h-11 w-full rounded-md border border-rule-strong bg-cream px-3 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";
const area = `${input} min-h-24 py-2`;

export default function ServiceEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [svc, setSvc] = useState<ServiceRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      setSvc(await api.service(id));
    } catch {
      setError("Nu am putut încărca serviciul.");
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function patch(next: Partial<ServiceRow>) {
    setSvc((s) => (s ? { ...s, ...next } : s));
  }
  function patchBody(next: Partial<ServiceRow["body"]>) {
    setSvc((s) => (s ? { ...s, body: { ...s.body, ...next } } : s));
  }

  async function save() {
    if (!svc) return;
    // Publish-time SEO gate (brief §5quater.3): discourage a weak publish.
    const report = validateService(svc);
    if (
      svc.status === "PUBLISHED" &&
      report.score < MIN_PUBLISH_SCORE &&
      !confirm(
        `Scor SEO ${report.score}/100 (sub ${MIN_PUBLISH_SCORE}). ${report.total - report.passed} verificări nereușite. Publici oricum?`,
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      await api.updateService(svc.id, {
        title: svc.title,
        summary: svc.summary,
        featured: svc.featured,
        order: svc.order,
        status: svc.status,
        body: svc.body,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setError("Nu am putut salva. Verifică conexiunea la API.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !svc) {
    return (
      <AdminShell>
        <p className="text-sm text-danger">{error}</p>
      </AdminShell>
    );
  }
  if (!svc) {
    return (
      <AdminShell>
        <p className="text-sm text-muted">Se încarcă…</p>
      </AdminShell>
    );
  }

  const b = svc.body ?? {};

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/administrare/servicii" className="text-xs text-muted hover:text-ink">
            ← Servicii
          </Link>
          <h1 className="mt-2 font-display text-display text-ink">{svc.title}</h1>
          <p className="mt-1 text-sm text-muted">/servicii/{svc.slug}</p>
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

      <div className="mt-8 space-y-10">
        <Section title="Bază">
          <Row>
            <Field label="Titlu">
              <input className={input} value={svc.title} onChange={(e) => patch({ title: e.target.value })} />
            </Field>
            <Field label="Status">
              <select
                className={`${input} cursor-pointer`}
                value={svc.status}
                onChange={(e) => patch({ status: e.target.value })}
              >
                {CONTENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {CONTENT_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
          </Row>
          <Field label="Sumar (cardul de servicii)">
            <textarea className={area} value={svc.summary} onChange={(e) => patch({ summary: e.target.value })} />
          </Field>
          <Row>
            <Field label="Icon (lucide)">
              <input className={input} value={b.icon ?? ""} onChange={(e) => patchBody({ icon: e.target.value })} />
            </Field>
            <Field label="Ordine">
              <input
                type="number"
                className={input}
                value={svc.order}
                onChange={(e) => patch({ order: Number(e.target.value) })}
              />
            </Field>
          </Row>
        </Section>

        <Section title="SEO & hero">
          <Field label="Title SEO">
            <input className={input} value={b.seoTitle ?? ""} onChange={(e) => patchBody({ seoTitle: e.target.value })} />
          </Field>
          <Field label="Meta description">
            <textarea className={area} value={b.seoDescription ?? ""} onChange={(e) => patchBody({ seoDescription: e.target.value })} />
          </Field>
          <Field label="H1">
            <input className={input} value={b.h1 ?? ""} onChange={(e) => patchBody({ h1: e.target.value })} />
          </Field>
          <Field label="Lead (răspunsul direct sub H1)">
            <textarea className={area} value={b.lead ?? ""} onChange={(e) => patchBody({ lead: e.target.value })} />
          </Field>
        </Section>

        <Section title="Conținut">
          <Field label="Problema">
            <textarea className={area} value={b.problem ?? ""} onChange={(e) => patchBody({ problem: e.target.value })} />
          </Field>

          <ListEditor
            label="Ce include (o linie per punct)"
            items={b.includes ?? []}
            onChange={(includes) => patchBody({ includes })}
          />

          <RepeaterEditor
            label="Proces"
            items={b.process ?? []}
            fields={[
              { key: "title", placeholder: "Titlu pas" },
              { key: "body", placeholder: "Descriere", area: true },
            ]}
            empty={{ title: "", body: "" }}
            onChange={(process) => patchBody({ process })}
          />

          <RepeaterEditor
            label="Întrebări frecvente"
            items={b.faqs ?? []}
            fields={[
              { key: "q", placeholder: "Întrebare" },
              { key: "a", placeholder: "Răspuns", area: true },
            ]}
            empty={{ q: "", a: "" }}
            onChange={(faqs) => patchBody({ faqs })}
          />
        </Section>

        <SeoPanel svc={svc} />
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

/** Live SEO checklist (brief §5quater.3). */
function SeoPanel({ svc }: { svc: ServiceRow }) {
  const report = validateService(svc);
  const tone =
    report.score >= MIN_PUBLISH_SCORE
      ? "text-success"
      : report.score >= 50
        ? "text-gold-deep"
        : "text-danger";

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-eyebrow font-medium uppercase text-gold-deep">
          Validator SEO
        </h2>
        <span className={`tabular font-display text-title ${tone}`}>
          {report.score}/100
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">
        {report.passed}/{report.total} verificări.{" "}
        {report.score < MIN_PUBLISH_SCORE
          ? `Sub ${MIN_PUBLISH_SCORE} — publicarea cere confirmare.`
          : "Bun de publicat."}
      </p>

      <ul className="mt-5 space-y-2">
        {report.checks.map((c) => (
          <li key={c.key} className="flex gap-3 rounded-md bg-cream-sunk p-3">
            <span aria-hidden className={c.ok ? "text-success" : "text-danger"}>
              {c.ok ? "✓" : "✕"}
            </span>
            <div>
              <p className="text-sm text-ink">{c.label}</p>
              {!c.ok && <p className="mt-0.5 text-xs text-muted">{c.hint}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-eyebrow font-medium uppercase text-gold-deep">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}

/** String[] repeater — one input per item, add/remove. */
function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={input}
              value={item}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
        ))}
        <AddBtn onClick={() => onChange([...items, ""])} />
      </div>
    </Field>
  );
}

/** Object[] repeater for {title,body} / {q,a}. */
function RepeaterEditor<T extends Record<string, string>>({
  label,
  items,
  fields,
  empty,
  onChange,
}: {
  label: string;
  items: T[];
  fields: { key: keyof T; placeholder: string; area?: boolean }[];
  empty: T;
  onChange: (v: T[]) => void;
}) {
  return (
    <Field label={label}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-rule bg-cream-sunk p-3">
            <div className="space-y-2">
              {fields.map((f) => {
                const val = item[f.key] ?? "";
                const set = (v: string) =>
                  onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: v } : x)));
                return f.area ? (
                  <textarea
                    key={String(f.key)}
                    className={area}
                    placeholder={f.placeholder}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                  />
                ) : (
                  <input
                    key={String(f.key)}
                    className={input}
                    placeholder={f.placeholder}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-end">
              <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => onChange([...items, { ...empty }])} />
      </div>
    </Field>
  );
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full border border-rule-strong px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-gold hover:text-ink"
    >
      + Adaugă
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Șterge"
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
    >
      ✕
    </button>
  );
}
