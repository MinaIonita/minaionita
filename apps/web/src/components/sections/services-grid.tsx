import * as Lucide from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getServices } from "@/lib/data";

/**
 * Deliberately NOT the portfolio's card grid. The portfolio is image-led, so
 * services take the opposite register: a numbered editorial index — rows,
 * hairlines, serif numerals. Same brand, different instrument.
 *
 * Content comes from the admin (with static fallback).
 */

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Lucide as unknown as Record<string, Lucide.LucideIcon>)[name];
  return C ? <C className={className} strokeWidth={1.25} aria-hidden /> : null;
}

export async function ServicesGrid() {
  const services = await getServices();

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="Servicii"
        title="Site-uri, magazine online și campaniile care le pun la treabă"
        lead="Fiecare serviciu are pagina lui, cu procesul de lucru, prețuri orientative și proiectele unde l-am folosit deja. Nimic ascuns până la ofertă."
      />

      <ol className="mt-14 border-t border-rule">
        {services.map((service, i) => (
          <Reveal as="li" key={service.slug} delay={Math.min(i, 4) * 70}>
            <Link
              href={`/servicii/${service.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b border-rule py-7 transition-colors duration-200 hover:bg-cream-sunk sm:gap-x-8 sm:py-8"
            >
              <span
                aria-hidden
                className="tabular hidden w-8 font-display text-lg text-gold-deep/70 sm:block"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="col-start-2 flex items-start gap-4 sm:items-center sm:gap-6">
                <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full border border-rule-strong text-gold-deep transition-colors duration-200 group-hover:border-gold group-hover:bg-cream sm:mt-0">
                  <Icon name={service.icon ?? "Circle"} className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-title text-ink">{service.title}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                    {service.summary}
                  </p>
                </div>
              </div>

              <span
                aria-hidden
                className="col-start-3 text-gold transition-transform duration-200 group-hover:translate-x-1"
              >
                <Lucide.ArrowRight className="size-5" strokeWidth={1.5} />
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
