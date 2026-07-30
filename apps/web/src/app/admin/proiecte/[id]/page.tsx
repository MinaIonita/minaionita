"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import {
  api,
  type MaskedCredential,
  PROJECT_STAGES,
  type ProjectFull,
  STAGE_LABELS,
} from "@/lib/admin-api";

const input =
  "min-h-11 w-full rounded-md border border-rule-strong bg-cream px-3 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

const toDateInput = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");
const fromDateInput = (v: string) =>
  v ? new Date(`${v}T00:00:00.000Z`).toISOString() : null;

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<ProjectFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const load = useCallback(async () => {
    try {
      setP(await api.project(id));
    } catch {
      setError("Nu am putut încărca proiectul.");
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const set = (n: Partial<ProjectFull>) => setP((s) => (s ? { ...s, ...n } : s));

  async function save() {
    if (!p) return;
    setSaving(true);
    try {
      await api.updateProject(p.id, {
        clientName: p.clientName,
        companyName: p.companyName,
        contactEmail: p.contactEmail,
        contactPhone: p.contactPhone,
        domain: p.domain,
        registrar: p.registrar,
        domainExpiresAt: p.domainExpiresAt,
        hostingProvider: p.hostingProvider,
        hostingPlan: p.hostingPlan,
        hostingExpiresAt: p.hostingExpiresAt,
        sslExpiresAt: p.sslExpiresAt,
        siteUrl: p.siteUrl,
        adminUrl: p.adminUrl,
        stage: p.stage,
        notes: p.notes,
      });
      flash("Salvat.");
    } catch {
      setError("Nu am putut salva.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProject() {
    if (!p || !confirm(`Ștergi definitiv clientul „${p.clientName}” și parolele lui?`)) return;
    try {
      await api.deleteProject(p.id);
      router.push("/admin/proiecte");
    } catch {
      setError("Nu am putut șterge.");
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

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/proiecte" className="text-xs text-muted hover:text-ink">
            ← Clienți
          </Link>
          <h1 className="mt-2 font-display text-display text-ink">{p.clientName}</h1>
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
        <Section title="Client">
          <Grid>
            <F label="Nume client">
              <input className={input} value={p.clientName} onChange={(e) => set({ clientName: e.target.value })} />
            </F>
            <F label="Firmă">
              <input className={input} value={p.companyName ?? ""} onChange={(e) => set({ companyName: e.target.value })} />
            </F>
            <F label="Email contact">
              <input className={input} value={p.contactEmail ?? ""} onChange={(e) => set({ contactEmail: e.target.value })} />
            </F>
            <F label="Telefon contact">
              <input className={input} value={p.contactPhone ?? ""} onChange={(e) => set({ contactPhone: e.target.value })} />
            </F>
            <F label="Status proiect">
              <select className={`${input} cursor-pointer`} value={p.stage} onChange={(e) => set({ stage: e.target.value })}>
                {PROJECT_STAGES.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </F>
          </Grid>
        </Section>

        <Section title="Domeniu & hosting">
          <Grid>
            <F label="Domeniu">
              <input className={input} value={p.domain ?? ""} onChange={(e) => set({ domain: e.target.value })} />
            </F>
            <F label="Registrar">
              <input className={input} value={p.registrar ?? ""} onChange={(e) => set({ registrar: e.target.value })} />
            </F>
            <F label="Expirare domeniu">
              <input type="date" className={input} value={toDateInput(p.domainExpiresAt)} onChange={(e) => set({ domainExpiresAt: fromDateInput(e.target.value) })} />
            </F>
            <F label="Furnizor hosting">
              <input className={input} value={p.hostingProvider ?? ""} onChange={(e) => set({ hostingProvider: e.target.value })} />
            </F>
            <F label="Plan hosting">
              <input className={input} value={p.hostingPlan ?? ""} onChange={(e) => set({ hostingPlan: e.target.value })} />
            </F>
            <F label="Expirare hosting">
              <input type="date" className={input} value={toDateInput(p.hostingExpiresAt)} onChange={(e) => set({ hostingExpiresAt: fromDateInput(e.target.value) })} />
            </F>
            <F label="Expirare SSL">
              <input type="date" className={input} value={toDateInput(p.sslExpiresAt)} onChange={(e) => set({ sslExpiresAt: fromDateInput(e.target.value) })} />
            </F>
          </Grid>
          <Grid>
            <F label="URL site">
              <input className={input} value={p.siteUrl ?? ""} onChange={(e) => set({ siteUrl: e.target.value })} />
            </F>
            <F label="URL admin">
              <input className={input} value={p.adminUrl ?? ""} onChange={(e) => set({ adminUrl: e.target.value })} />
            </F>
          </Grid>
        </Section>

        <Section title="Note">
          <textarea className={`${input} min-h-28 py-2`} value={p.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
        </Section>

        {/* Credential vault */}
        <Vault
          projectId={p.id}
          credentials={p.credentials}
          onChange={load}
          onError={setError}
        />
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-rule pt-6">
        <button
          onClick={save}
          disabled={saving}
          className="min-h-11 cursor-pointer rounded-full bg-gold px-8 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? "Se salvează…" : "Salvează"}
        </button>
        <button
          onClick={removeProject}
          className="min-h-11 cursor-pointer rounded-full px-5 text-sm text-muted transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
        >
          Șterge clientul
        </button>
      </div>

      <SaveToast show={!!toast} label={toast} />
    </AdminShell>
  );
}

// ── Vault ─────────────────────────────────────────────────────────────────
function Vault({
  projectId,
  credentials,
  onChange,
  onError,
}: {
  projectId: string;
  credentials: MaskedCredential[];
  onChange: () => void;
  onError: (m: string) => void;
}) {
  const [adding, setAdding] = useState({ label: "", username: "", password: "", loginUrl: "", note: "" });
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!adding.label.trim()) return;
    setBusy(true);
    try {
      await api.addCredential(projectId, adding);
      setAdding({ label: "", username: "", password: "", loginUrl: "", note: "" });
      onChange();
    } catch {
      onError("Nu am putut adăuga credențiala.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="text-eyebrow font-medium uppercase text-gold-deep">
        Seif de parole
      </h2>
      <p className="mt-2 text-xs text-muted">
        Parolele sunt criptate în bază. Se afișează mascat; fiecare afișare e
        înregistrată.
      </p>

      <ul className="mt-5 space-y-3">
        {credentials.map((c) => (
          <CredentialRow key={c.id} cred={c} onChange={onChange} onError={onError} />
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-dashed border-rule-strong p-4">
        <p className="mb-3 text-sm font-medium text-ink">Adaugă o credențială</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={input} placeholder="Etichetă (ex. wp-admin)" value={adding.label} onChange={(e) => setAdding({ ...adding, label: e.target.value })} />
          <input className={input} placeholder="Utilizator" value={adding.username} onChange={(e) => setAdding({ ...adding, username: e.target.value })} />
          <input className={input} placeholder="Parolă" value={adding.password} onChange={(e) => setAdding({ ...adding, password: e.target.value })} />
          <input className={input} placeholder="URL login" value={adding.loginUrl} onChange={(e) => setAdding({ ...adding, loginUrl: e.target.value })} />
        </div>
        <button
          onClick={add}
          disabled={busy || !adding.label.trim()}
          className="mt-3 min-h-9 cursor-pointer rounded-full bg-ink px-4 text-sm text-cream transition-colors duration-200 hover:bg-gold hover:text-ink disabled:opacity-50"
        >
          Adaugă
        </button>
      </div>
    </section>
  );
}

function CredentialRow({
  cred,
  onChange,
  onError,
}: {
  cred: MaskedCredential;
  onChange: () => void;
  onError: (m: string) => void;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [busy, setBusy] = useState(false);

  async function reveal() {
    if (revealed !== null) {
      setRevealed(null);
      return;
    }
    try {
      const { password } = await api.revealCredential(cred.id);
      setRevealed(password);
    } catch {
      onError("Nu am putut dezvălui parola.");
    }
  }

  async function copy() {
    try {
      const value: string =
        revealed ?? (await api.revealCredential(cred.id)).password;
      await navigator.clipboard.writeText(value);
    } catch {
      onError("Nu am putut copia parola.");
    }
  }

  async function saveNewPass() {
    setBusy(true);
    try {
      await api.updateCredential(cred.id, { label: cred.label, password: newPass });
      setNewPass("");
      setRevealed(null);
      onError("");
    } catch {
      onError("Nu am putut schimba parola.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Ștergi credențiala „${cred.label}”?`)) return;
    try {
      await api.deleteCredential(cred.id);
      onChange();
    } catch {
      onError("Nu am putut șterge.");
    }
  }

  return (
    <li className="rounded-lg border border-rule bg-cream-sunk p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{cred.label}</p>
          <p className="mt-0.5 text-sm text-muted">
            {cred.username ?? "—"}
            {cred.loginUrl && (
              <>
                {" · "}
                <a href={cred.loginUrl} target="_blank" rel="noopener noreferrer" className="text-gold-deep hover:underline">
                  login
                </a>
              </>
            )}
          </p>
        </div>
        <button
          onClick={remove}
          className="text-xs text-muted transition-colors duration-200 hover:text-danger"
        >
          Șterge
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="tabular rounded-md bg-cream px-3 py-1.5 text-sm text-ink">
          {revealed ?? "••••••••••"}
        </code>
        <button onClick={reveal} className="min-h-9 cursor-pointer rounded-full border border-rule-strong px-3 text-xs text-muted hover:border-gold hover:text-ink">
          {revealed !== null ? "Ascunde" : "Arată"}
        </button>
        <button onClick={copy} className="min-h-9 cursor-pointer rounded-full border border-rule-strong px-3 text-xs text-muted hover:border-gold hover:text-ink">
          Copiază
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className={`${input} max-w-xs`}
          placeholder="Schimbă parola…"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        {newPass && (
          <button
            onClick={saveNewPass}
            disabled={busy}
            className="min-h-9 cursor-pointer rounded-full bg-gold px-4 text-xs font-medium text-ink hover:bg-gold-light disabled:opacity-50"
          >
            Salvează parola
          </button>
        )}
      </div>
    </li>
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
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}
