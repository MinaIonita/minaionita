import type { Metadata } from "next";
import Link from "next/link";
import { PersonalProjects } from "@/components/sections/personal-projects";

export const metadata: Metadata = {
  title: "Proiecte personale",
  description:
    "Produse pe care le construiesc sub brandul meu, cu banii și riscul meu — printre care Parcly, o platformă SaaS pentru parcuri auto. Metoda mea, testată fără plasă.",
  alternates: { canonical: "/proiecte-personale" },
};

export default function ProiectePersonalePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-20">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Acasă
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              Proiecte personale
            </li>
          </ol>
        </nav>
      </section>

      {/* The homepage section is self-contained; reused verbatim as the page body
          so there is one source of truth for the personal-projects content. */}
      <PersonalProjects />
    </>
  );
}
