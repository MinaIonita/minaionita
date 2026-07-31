"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import { api } from "@/lib/admin-api";

const input =
  "w-full rounded-md border border-rule-strong bg-cream px-3 py-2 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

type Site = {
  name?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  phoneHref?: string;
  whatsapp?: string;
  city?: string;
  country?: string;
  legal?: string;
  socials?: { linkedin?: string; github?: string };
};
type Cta = { label?: string; sub?: string; href?: string };

export default function SettingsAdminPage() {
  const [site, setSite] = useState<Site>({});
  const [cta, setCta] = useState<Cta>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const load = useCallback(async () => {
    try {
      const s = await api.settings();
      setSite((s.site as Site) ?? {});
      setCta((s.cta as Cta) ?? {});
      setError(null);
    } catch {
      setError("Nu am putut încărca setările.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function save() {
    setSaving(true);
    try {
      await api.setSetting("site", site);
      await api.setSetting("cta", cta);
      flash("Salvat. Live pe site.");
    } catch {
      setError("Nu am putut salva.");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof Site, v: string) => setSite((s) => ({ ...s, [k]: v }));
  const setSocial = (k: "linkedin" | "github", v: string) =>
    setSite((s) => ({ ...s, socials: { ...s.socials, [k]: v } }));

  if (loading) {
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
          <h1 className="font-display text-display text-ink">Setări</h1>
          <p className="mt-1 text-sm text-muted">
            Date de contact și butonul principal — folosite în tot site-ul.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="min-h-11 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? "Se salvează…" : "Salvează"}
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      <div className="mt-8 space-y-10">
        <Section title="Identitate">
          <F label="Nume">
            <input className={input} value={site.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          </F>
          <F label="Tagline (titlu SEO)">
            <input className={input} value={site.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
          </F>
          <F label="Descriere (meta description)">
            <textarea className={`${input} min-h-20`} value={site.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </F>
          <F label="Date firmă (footer)">
            <input className={input} value={site.legal ?? ""} onChange={(e) => set("legal", e.target.value)} />
          </F>
        </Section>

        <Section title="Contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="Email">
              <input className={input} value={site.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </F>
            <F label="Telefon (afișat)">
              <input className={input} value={site.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </F>
            <F label="Telefon (pentru apel, ex. +40749…)">
              <input className={input} value={site.phoneHref ?? ""} onChange={(e) => set("phoneHref", e.target.value)} />
            </F>
            <F label="WhatsApp (număr, ex. 40749…)">
              <input className={input} value={site.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
            </F>
            <F label="Oraș">
              <input className={input} value={site.city ?? ""} onChange={(e) => set("city", e.target.value)} />
            </F>
            <F label="Țară">
              <input className={input} value={site.country ?? ""} onChange={(e) => set("country", e.target.value)} />
            </F>
          </div>
        </Section>

        <Section title="Rețele">
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="LinkedIn">
              <input className={input} value={site.socials?.linkedin ?? ""} onChange={(e) => setSocial("linkedin", e.target.value)} />
            </F>
            <F label="GitHub">
              <input className={input} value={site.socials?.github ?? ""} onChange={(e) => setSocial("github", e.target.value)} />
            </F>
          </div>
        </Section>

        <Section title="Buton principal (CTA)">
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="Text">
              <input className={input} value={cta.label ?? ""} onChange={(e) => setCta((c) => ({ ...c, label: e.target.value }))} />
            </F>
            <F label="Link">
              <input className={input} value={cta.href ?? ""} onChange={(e) => setCta((c) => ({ ...c, href: e.target.value }))} />
            </F>
          </div>
          <F label="Subtitlu">
            <input className={input} value={cta.sub ?? ""} onChange={(e) => setCta((c) => ({ ...c, sub: e.target.value }))} />
          </F>
        </Section>
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

      <SaveToast show={!!toast} label={toast} />
    </AdminShell>
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

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}
