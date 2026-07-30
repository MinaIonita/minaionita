import Link from "next/link";
import type { ReactNode } from "react";

/** Shared shell for legal pages: breadcrumb, title, and a readable prose column. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-ink">
              Acasă
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {title}
          </li>
        </ol>
      </nav>

      <h1 className="mt-10 font-display text-display text-balance">{title}</h1>
      <p className="mt-3 text-sm text-muted">Ultima actualizare: {updated}</p>

      <div className="legal-prose mt-10">{children}</div>
    </section>
  );
}
