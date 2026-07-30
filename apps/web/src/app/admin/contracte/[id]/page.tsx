"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useSite } from "@/components/site-provider";
import { api, type ContractRow } from "@/lib/admin-api";
import {
  GDPR_ANNEX,
  STANDARD_CLAUSES,
  TEMPLATE_OBJECTS,
} from "@/lib/contract-text";

export default function ContractDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const site = useSite();
  const [c, setC] = useState<ContractRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setC(await api.contract(id));
    } catch {
      setError("Nu am putut încărca contractul.");
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (error) {
    return (
      <AdminShell>
        <p className="text-sm text-danger">{error}</p>
      </AdminShell>
    );
  }
  if (!c) {
    return (
      <AdminShell>
        <p className="text-sm text-muted">Se încarcă…</p>
      </AdminShell>
    );
  }

  const tpl = TEMPLATE_OBJECTS[c.serviceTemplate];
  const today = new Date().toLocaleDateString("ro-RO");

  return (
    <AdminShell>
      {/* Toolbar — hidden when printing */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/admin/contracte" className="text-xs text-muted hover:text-ink">
            ← Contracte
          </Link>
          <h1 className="tabular mt-2 font-display text-display text-ink">{c.number}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="min-h-11 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light"
          >
            Descarcă / printează PDF
          </button>
          <button
            onClick={async () => {
              if (confirm("Ștergi contractul?")) {
                await api.deleteContract(c.id);
                window.location.href = "/admin/contracte";
              }
            }}
            className="min-h-11 cursor-pointer rounded-full px-4 text-sm text-muted hover:text-danger"
          >
            Șterge
          </button>
        </div>
      </div>

      {c.partyFiscallyInactive && (
        <p className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger print:hidden">
          ⚠️ Beneficiarul e marcat INACTIV fiscal la ANAF. Verifică înainte de semnare.
        </p>
      )}

      {/* The document */}
      <article className="mx-auto mt-8 max-w-3xl rounded-lg border border-rule bg-cream p-8 text-ink sm:p-12 print:border-0 print:p-0">
        <header className="text-center">
          <h2 className="font-display text-title">CONTRACT DE PRESTĂRI SERVICII</h2>
          <p className="tabular mt-1 text-sm text-muted">
            Nr. {c.number} · {today}
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Prestator:</strong> {site.legal}, cu sediul în {site.city},{" "}
            {site.country}, email {site.email}, telefon {site.phone}.
          </p>
          <p>
            <strong>Beneficiar:</strong> {c.partyName}
            {c.partyType === "COMPANY" && (
              <>
                {c.partyCui ? `, CUI ${c.partyCui}` : ""}
                {c.partyRegCom ? `, Reg. Com. ${c.partyRegCom}` : ""}
                {c.partyRepresentative ? `, reprezentată de ${c.partyRepresentative}` : ""}
              </>
            )}
            {c.partyAddress ? `, cu sediul/adresa în ${c.partyAddress}` : ""}.
          </p>
        </section>

        <Clause n={1} title="Obiectul contractului">
          {tpl?.object ?? "—"}
        </Clause>

        <Clause n={2} title="Prețul contractului">
          Prețul serviciilor este de {Number(c.amount).toLocaleString("ro-RO")}{" "}
          {c.currency}
          {c.partyVatPayer === false ? " (Beneficiar neplătitor de TVA)" : ""}.
          {c.advancePct ? ` Avans: ${c.advancePct}% la semnare.` : ""}
          {c.paymentTermDays ? ` Termen de plată: ${c.paymentTermDays} zile.` : ""}
          {c.penaltyPct ? ` Penalități de întârziere: ${c.penaltyPct}%/zi.` : ""}
          {c.deliveryTerm ? ` Termen de execuție: ${c.deliveryTerm}.` : ""}
        </Clause>

        {STANDARD_CLAUSES.map((cl, i) => (
          <Clause key={cl.title} n={i + 3} title={cl.title}>
            {cl.body}
          </Clause>
        ))}

        <section className="mt-10 border-t border-rule pt-6">
          <h3 className="font-display text-sm font-semibold">{GDPR_ANNEX.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{GDPR_ANNEX.body}</p>
        </section>

        <div className="mt-12 grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="font-medium">Prestator</p>
            <p className="mt-1 text-muted">{site.legal}</p>
            <div className="mt-10 border-t border-ink/40 pt-1 text-xs text-muted">Semnătură</div>
          </div>
          <div>
            <p className="font-medium">Beneficiar</p>
            <p className="mt-1 text-muted">{c.partyName}</p>
            <div className="mt-10 border-t border-ink/40 pt-1 text-xs text-muted">Semnătură</div>
          </div>
        </div>
      </article>

      <p className="mx-auto mt-6 max-w-3xl text-xs text-muted print:hidden">
        Șablonul e un cadru solid, dar înainte de utilizarea comercială dă-l o
        dată la verificat unui avocat (brief §5bis).
      </p>
    </AdminShell>
  );
}

function Clause({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-ink">
        {n}. {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{children}</p>
    </section>
  );
}
