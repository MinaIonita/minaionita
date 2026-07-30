import { SectionHeading } from "@/components/section-heading";
import { process } from "@/lib/content";

export function Process() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="Cum lucrăm"
        title="Patru pași, fără surprize"
        lead="Începem cu un audit gratuit de 30 de minute. Pleci cu o listă de priorități, chiar dacă nu lucrăm împreună."
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-lg bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {process.map((step, i) => (
          <li key={step.title} className="bg-cream p-7">
            <span className="tabular font-display text-sm text-gold-deep">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-title text-ink">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
