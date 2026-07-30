import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getProjects } from "@/lib/data";

/** Six on the homepage — two clean rows of three. The rest live on /portofoliu. */
export async function SelectedWork() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="border-t border-rule bg-cream-sunk">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Portofoliu"
          title="La fiecare site, eu am fost tot proiectul"
          lead="Constructori navali la Mangalia, blană naturală, avocați în Luxemburg, un resort în Neamț, un DJ în Italia. Site-uri de prezentare, magazine online și campaniile care le umplu. Pe fiecare l-am dus singur: discuția cu clientul, codul, textele, campaniile, cifrele de după. Nu ai pe cine da vina în afară de mine — și toate sunt live, deci poți verifica acum."
          action={
            <ButtonLink href="/portofoliu" variant="secondary">
              Toate cele {projects.length}
            </ButtonLink>
          }
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            // Stagger by column position so each row cascades in left-to-right.
            <Reveal as="li" key={project.slug} delay={(i % 3) * 90}>
              {/* First row is above the fold on desktop — don't lazy-load it. */}
              <ProjectCard project={project} priority={i < 3} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
