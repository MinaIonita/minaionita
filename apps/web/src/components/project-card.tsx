import Image from "next/image";
import type { Project } from "@/lib/content";

/**
 * Image-led card: the "Portfolio Grid" pattern is visuals first.
 *
 * The cover is generated art (see scripts that render /public/portfolio/*.webp),
 * 960x600 to match the 16/10 box exactly. Dimensions are declared, so nothing
 * shifts while it loads.
 */
export function ProjectCard({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-cream transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:shadow-[0_18px_40px_-24px_rgba(20,20,15,0.35)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-sunk">
        <Image
          src={`/portfolio/${project.slug}.webp`}
          alt={`${project.client} — ${project.tagline}`}
          width={1440}
          height={900}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          // Anchored top: a site's identity lives above the fold.
          className="size-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />

        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold-deep backdrop-blur-sm">
          {project.category}
        </span>

        {/* "Open" affordance, revealed on hover — the CTA lives on the card. */}
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-ink text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
            <path
              d="M5 11 11 5m0 0H6m5 0v5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-title text-ink">
            {project.client}
            <span className="sr-only"> (se deschide în tab nou)</span>
          </h3>
          <span className="tabular shrink-0 text-xs text-muted">{project.year}</span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-rule-strong px-2.5 py-0.5 text-[0.7rem] text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}
