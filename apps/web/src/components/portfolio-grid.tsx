"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/content";

/** Filterable grid per brief §3.3. Filtering is client-side: 18 items is far
 *  below the point where a round-trip per filter would earn its cost, and the
 *  full list stays in the server HTML for crawlers. */
export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const [active, setActive] = useState<string | null>(null);
  const shown = active ? projects.filter((p) => p.category === active) : projects;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="flex flex-wrap gap-2 border-y border-rule py-5">
        <FilterChip
          label="Toate"
          count={projects.length}
          active={active === null}
          onClick={() => setActive(null)}
        />
        {categories.map(([cat, count]) => (
          <FilterChip
            key={cat}
            label={cat}
            count={count}
            active={active === cat}
            onClick={() => setActive(cat)}
          />
        ))}
      </div>

      {/* aria-live so filtering announces the new count to screen readers. */}
      <p aria-live="polite" className="sr-only">
        {shown.length} proiecte afișate
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, i) => (
          <li key={project.slug}>
            <ProjectCard project={project} priority={i < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm transition-colors duration-200 ${
        active
          ? "bg-ink text-cream"
          : "border border-rule-strong text-muted hover:border-gold hover:text-ink"
      }`}
    >
      {label}
      <span className={`tabular text-xs ${active ? "text-cream/60" : "text-muted/60"}`}>
        {count}
      </span>
    </button>
  );
}
