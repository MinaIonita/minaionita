"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { api, ApiError, type ContractRow } from "@/lib/admin-api";

const input =
  "min-h-11 w-full rounded-md border border-rule-strong bg-cream px-3 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export default function NewContractPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<{ key: string; label: string }[]>([]);
  const [f, setF] = useState<Partial<ContractRow>>({
    serviceTemplate: "",
    partyType: "COMPANY",
    partyName: "",
    currency: "RON",
    amount: 0,
  });
  const [cui, setCui] = useState("");
  const [anafRisk, setAnafRisk] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTemplates = useCallback(async () => {
    try {
      const t = await api.contractTemplates();
      setTemplates(t);
      setF((s) => ({ ...s, serviceTemplate: s.serviceTemplate || t[0]?.key }));
    } catch {
      setError("Nu am putut încărca șabloanele.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTemplates();
  }, [loadTemplates]);

  const set = (n: Partial<ContractRow>) => setF((s) => ({ ...s, ...n }));

  async function lookup() {
    if (!cui.trim()) return;
    setLooking(true);
    setError(null);
    setAnafRisk(null);
    try {
      const r = await api.anafLookup(cui);
      set({
        partyName: r.name,
        partyAddress: r.address,
        partyCui: r.cui,
        partyRegCom: r.regCom,
        partyVatPayer: r.vatPayer,
        partyFiscallyInactive: r.inactive,
      });
      setAnafRisk(r.risk);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Eroare la interogarea ANAF.");
    } finally {
      setLooking(false);
    }
  }

  async function save() {
    if (!f.partyName?.trim() || !f.serviceTemplate) {
      setError("Completează cel puțin serviciul și numele beneficiarului.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const created = await api.createContract({
        serviceTemplate: f.serviceTemplate,
        partyType: f.partyType,
        partyName: f.partyName,
        partyCui: f.partyCui,
        partyRegCom: f.partyRegCom,
        partyAddress: f.partyAddress,
        partyRepresentative: f.partyRepresentative,
        partyVatPayer: f.partyVatPayer,
        partyFiscallyInactive: f.partyFiscallyInactive,
        amount: Number(f.amount) || 0,
        currency: f.currency,
        advancePct: f.advancePct != null ? Number(f.advancePct) : undefined,
        paymentTermDays: f.paymentTermDays != null ? Number(f.paymentTermDays) : undefined,
        penaltyPct: f.penaltyPct != null ? Number(f.penaltyPct) : undefined,
        deliveryTerm: f.deliveryTerm,
      });
      router.push(`/admin/contracte/${created.id}`);
    } catch {
      setError("Nu am putut salva contractul.");
    } finally {
      setSaving(false);
    }
  }

  const isCompany = f.partyType === "COMPANY";

  return (
    <AdminShell>
      <Link href="/admin/contracte" className="text-xs text-muted hover:text-ink">
        ← Contracte
      </Link>
      <h1 className="mt-2 font-display text-display text-ink">Contract nou</h1>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-8 space-y-10">
        <Section title="Serviciu">
          <F label="Tip serviciu (șablon)">
            <select
              className={`${input} cursor-pointer`}
              value={f.serviceTemplate}
              onChange={(e) => set({ serviceTemplate: e.target.value })}
            >
              {templates.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </F>
        </Section>

        <Section title="Beneficiar">
          <div className="flex gap-2">
            {(["COMPANY", "INDIVIDUAL"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set({ partyType: t })}
                className={`min-h-10 rounded-full px-4 text-sm transition-colors duration-200 ${
                  f.partyType === t ? "bg-ink text-cream" : "border border-rule-strong text-muted hover:text-ink"
                }`}
              >
                {t === "COMPANY" ? "Persoană juridică" : "Persoană fizică"}
              </button>
            ))}
          </div>

          {isCompany && (
            <div className="mt-5 rounded-lg border border-rule bg-cream-sunk p-4">
              <label className="mb-1.5 block text-sm font-medium text-ink">
                CUI — autocompletare de la ANAF
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  className={`${input} max-w-xs`}
                  placeholder="ex. 2816464"
                  value={cui}
                  onChange={(e) => setCui(e.target.value)}
                />
                <button
                  type="button"
                  onClick={lookup}
                  disabled={looking || !cui.trim()}
                  className="min-h-11 cursor-pointer rounded-full bg-ink px-5 text-sm text-cream transition-colors duration-200 hover:bg-gold hover:text-ink disabled:opacity-50"
                >
                  {looking ? "Caut…" : "Caută la ANAF"}
                </button>
              </div>
              {anafRisk && (
                <p className="mt-3 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                  {anafRisk}
                </p>
              )}
              {f.partyVatPayer != null && !anafRisk && (
                <p className="mt-3 text-xs text-success">
                  ✓ Date completate din ANAF. {f.partyVatPayer ? "Plătitoare de TVA." : ""}
                </p>
              )}
            </div>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <F label={isCompany ? "Denumire firmă" : "Nume complet"}>
              <input className={input} value={f.partyName ?? ""} onChange={(e) => set({ partyName: e.target.value })} />
            </F>
            {isCompany && (
              <>
                <F label="CUI">
                  <input className={input} value={f.partyCui ?? ""} onChange={(e) => set({ partyCui: e.target.value })} />
                </F>
                <F label="Nr. Reg. Comerțului">
                  <input className={input} value={f.partyRegCom ?? ""} onChange={(e) => set({ partyRegCom: e.target.value })} />
                </F>
                <F label="Reprezentant legal">
                  <input className={input} value={f.partyRepresentative ?? ""} onChange={(e) => set({ partyRepresentative: e.target.value })} />
                </F>
              </>
            )}
            <F label={isCompany ? "Sediu" : "Adresă"}>
              <input className={input} value={f.partyAddress ?? ""} onChange={(e) => set({ partyAddress: e.target.value })} />
            </F>
          </div>
        </Section>

        <Section title="Preț și termene">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <F label="Sumă">
              <input type="number" className={input} value={f.amount ?? 0} onChange={(e) => set({ amount: Number(e.target.value) })} />
            </F>
            <F label="Monedă">
              <select className={`${input} cursor-pointer`} value={f.currency} onChange={(e) => set({ currency: e.target.value })}>
                <option>RON</option><option>EUR</option>
              </select>
            </F>
            <F label="Avans (%)">
              <input type="number" className={input} value={f.advancePct ?? ""} onChange={(e) => set({ advancePct: Number(e.target.value) })} />
            </F>
            <F label="Termen de plată (zile)">
              <input type="number" className={input} value={f.paymentTermDays ?? ""} onChange={(e) => set({ paymentTermDays: Number(e.target.value) })} />
            </F>
            <F label="Penalitate întârziere (%/zi)">
              <input type="number" step="0.01" className={input} value={f.penaltyPct ?? ""} onChange={(e) => set({ penaltyPct: Number(e.target.value) })} />
            </F>
            <F label="Termen de execuție">
              <input className={input} placeholder="ex. 30 de zile" value={f.deliveryTerm ?? ""} onChange={(e) => set({ deliveryTerm: e.target.value })} />
            </F>
          </div>
        </Section>
      </div>

      <div className="mt-10 border-t border-rule pt-6">
        <button
          onClick={save}
          disabled={saving}
          className="min-h-11 cursor-pointer rounded-full bg-gold px-8 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? "Se generează…" : "Generează contractul"}
        </button>
      </div>
    </AdminShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-eyebrow font-medium uppercase text-gold-deep">{title}</h2>
      <div className="mt-5">{children}</div>
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
