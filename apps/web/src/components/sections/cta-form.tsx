"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/content";
import { useSite } from "@/components/site-provider";

type Status = "idle" | "sending" | "sent" | "error";

const fieldBase =
  "min-h-[3.25rem] w-full rounded-lg border bg-cream px-4 text-base text-ink placeholder:text-muted/50 transition-all duration-200 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15";

export function CtaForm() {
  const site = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    if (!String(data.get("name") ?? "").trim()) {
      next.name = "Spune-mi cum să ți se adreseze.";
    }
    const email = String(data.get("email") ?? "").trim();
    if (!email) {
      next.email = "Am nevoie de un email ca să îți răspund.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Emailul nu pare complet. Verifică-l, te rog.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Focus the first invalid field so keyboard/screen-reader users land on it.
      const first = e.currentTarget.elements.namedItem(Object.keys(next)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }

    setStatus("sending");
    try {
      // Attach attribution the admin uses to close the SEO/LP loop (brief §5ter):
      // UTM params from the URL + the landing page the visitor converted on.
      const params = new URLSearchParams(window.location.search);
      const payload = {
        ...Object.fromEntries(data),
        landingPage: window.location.pathname,
        utmSource: params.get("utm_source") ?? undefined,
        utmMedium: params.get("utm_medium") ?? undefined,
        utmCampaign: params.get("utm_campaign") ?? undefined,
        utmTerm: params.get("utm_term") ?? undefined,
        utmContent: params.get("utm_content") ?? undefined,
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-lg border border-gold/40 bg-cream p-10 text-center"
      >
        <h3 className="font-display text-title text-ink">Am primit mesajul.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Îți răspund în maximum 24 de ore lucrătoare. Dacă e urgent, sună-mă
          direct la{" "}
          <a href={`tel:${site.phoneHref}`} className="tabular text-gold-deep underline">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field id="name" label="Nume" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${fieldBase} ${errors.name ? "border-danger" : "border-rule-strong"}`}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${fieldBase} ${errors.email ? "border-danger" : "border-rule-strong"}`}
          />
        </Field>

        <Field id="phone" label="Telefon" optional>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={`${fieldBase} border-rule-strong`}
          />
        </Field>

        <Field id="service" label="Ce te interesează" optional>
          <select
            id="service"
            name="service"
            defaultValue=""
            className={`${fieldBase} cursor-pointer border-rule-strong`}
          >
            <option value="">Alege un serviciu</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id="message"
        label="Mesaj"
        optional
        hint="Câteva rânduri despre proiect mă ajută să îți dau un răspuns concret."
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${fieldBase} resize-y border-rule-strong py-3`}
        />
      </Field>

      {status === "error" && (
        <p role="alert" className="text-sm text-danger">
          Nu am putut trimite mesajul. Încearcă din nou sau scrie-mi direct la{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
          .
        </p>
      )}

      <div className="mt-1 border-t border-rule pt-6">
        <Button
          type="submit"
          disabled={status === "sending"}
          className="w-full sm:w-auto sm:min-w-56"
        >
          {status === "sending" ? "Se trimite…" : "Trimite cererea"}
        </Button>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold-deep">
            <path
              d="M8 1.5 2.5 4v3.8c0 3 2.3 5.3 5.5 6.7 3.2-1.4 5.5-3.7 5.5-6.7V4L8 1.5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          Îți folosesc datele doar ca să îți răspund. Fără liste, fără spam.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
        {label}
        {optional && (
          <span className="rounded-full bg-cream-sunk px-2 py-0.5 text-[0.65rem] font-normal uppercase tracking-wide text-muted">
            opțional
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
