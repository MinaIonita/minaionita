import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <Reveal className="max-w-2xl">
        <p className="flex items-center gap-3 text-eyebrow font-medium uppercase text-gold-deep">
          <span aria-hidden className="h-px w-8 bg-gold" />
          {eyebrow}
        </p>
        <h2 className="mt-5 font-display text-display text-balance">{title}</h2>
        {lead && <p className="mt-4 text-lead text-muted text-pretty">{lead}</p>}
      </Reveal>
      {action && (
        <Reveal delay={120} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
