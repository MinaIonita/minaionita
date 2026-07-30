"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import {
  api,
  type Lead,
  REPLY_TEMPLATES,
  STATUS_LABELS,
  TICKET_STATUSES,
} from "@/lib/admin-api";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(async () => {
    try {
      setLead(await api.lead(id));
    } catch {
      setError("Nu am putut încărca tichetul.");
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function send() {
    if (!reply.trim()) return;
    setBusy(true);
    try {
      const { sent } = await api.replyLead(id, reply);
      setReply("");
      await load();
      flash(sent ? "Răspuns trimis pe email." : "Răspuns salvat (SMTP neconfigurat — nu s-a trimis email).");
    } catch {
      setError("Nu am putut trimite răspunsul.");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(status: string) {
    if (!lead) return;
    setLead({ ...lead, status });
    await api.setLeadStatus(id, status);
  }

  async function convert() {
    if (!confirm("Transformi tichetul în client + proiect?")) return;
    try {
      const { projectId } = await api.convertLead(id);
      router.push(`/admin/proiecte/${projectId}`);
    } catch {
      setError("Nu am putut converti tichetul.");
    }
  }

  if (error && !lead) {
    return (
      <AdminShell>
        <p className="text-sm text-danger">{error}</p>
      </AdminShell>
    );
  }
  if (!lead) {
    return (
      <AdminShell>
        <p className="text-sm text-muted">Se încarcă…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin" className="text-xs text-muted hover:text-ink">
            ← Tichete
          </Link>
          <h1 className="mt-2 font-display text-display text-ink">{lead.name}</h1>
          <p className="mt-1 text-sm text-muted">
            <a href={`mailto:${lead.email}`} className="text-gold-deep hover:underline">
              {lead.email}
            </a>
            {lead.phone && <span className="tabular"> · {lead.phone}</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={lead.status}
            onChange={(e) => changeStatus(e.target.value)}
            className="min-h-10 cursor-pointer rounded-full border border-rule-strong bg-cream px-3 text-sm"
          >
            {TICKET_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          {lead.clientProjectId ? (
            <Link
              href={`/admin/proiecte/${lead.clientProjectId}`}
              className="min-h-10 inline-flex items-center rounded-full border border-rule-strong px-4 text-sm text-ink hover:border-gold"
            >
              Vezi clientul
            </Link>
          ) : (
            <button
              onClick={convert}
              className="min-h-10 cursor-pointer rounded-full bg-ink px-4 text-sm text-cream transition-colors duration-200 hover:bg-gold hover:text-ink"
            >
              Câștigat → creează client
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {/* Attribution */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 rounded-lg border border-rule bg-cream-sunk p-4 text-xs text-muted">
        <span>{new Date(lead.createdAt).toLocaleString("ro-RO")}</span>
        {lead.service && <span>Serviciu: <span className="text-ink">{lead.service.title}</span></span>}
        {lead.landingPage && <span>LP: {lead.landingPage}</span>}
        {lead.utmSource && <span>Sursă: {lead.utmSource}</span>}
        {lead.referrer && <span className="truncate">Referrer: {lead.referrer}</span>}
      </div>

      {/* Conversation thread */}
      <div className="mt-8 space-y-4">
        <Bubble direction="INBOUND" body={lead.message ?? "(fără mesaj)"} at={lead.createdAt} name={lead.name} />
        {(lead.messages ?? []).map((m, i) => (
          <Bubble key={i} direction={m.direction} body={m.body} at={m.createdAt} name={m.direction === "OUTBOUND" ? "Tu" : lead.name} />
        ))}
      </div>

      {/* Reply box */}
      <div className="mt-8 rounded-lg border border-rule bg-cream-sunk p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {REPLY_TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => setReply(t.body)}
              className="min-h-8 cursor-pointer rounded-full border border-rule-strong px-3 text-xs text-muted transition-colors duration-200 hover:border-gold hover:text-ink"
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={5}
          placeholder="Scrie răspunsul… (se trimite pe emailul clientului)"
          className="w-full rounded-md border border-rule-strong bg-cream px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        <button
          onClick={send}
          disabled={busy || !reply.trim()}
          className="mt-3 min-h-11 cursor-pointer rounded-full bg-gold px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
        >
          {busy ? "Se trimite…" : "Trimite răspunsul"}
        </button>
      </div>

      <SaveToast show={!!toast} label={toast} />
    </AdminShell>
  );
}

function Bubble({ direction, body, at, name }: { direction: string; body: string; at: string; name: string }) {
  const out = direction === "OUTBOUND";
  return (
    <div className={out ? "flex justify-end" : ""}>
      <div className={`max-w-[80%] rounded-xl p-4 ${out ? "bg-ink text-cream" : "border border-rule bg-cream"}`}>
        <p className={`text-xs ${out ? "text-cream/60" : "text-muted"}`}>
          {name} · {new Date(at).toLocaleString("ro-RO")}
        </p>
        <p className={`mt-1.5 whitespace-pre-wrap text-sm leading-relaxed ${out ? "text-cream" : "text-ink"}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
