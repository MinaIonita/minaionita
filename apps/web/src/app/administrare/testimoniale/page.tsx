"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell, SaveToast } from "@/components/admin/admin-shell";
import { api, type Testimonial } from "@/lib/admin-api";

const input =
  "w-full rounded-md border border-rule-strong bg-cream px-3 py-2 text-sm text-ink transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const load = useCallback(async () => {
    try {
      setItems(await api.testimonials());
      setError(null);
    } catch {
      setError("Nu am putut încărca testimonialele.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function edit(id: string, next: Partial<Testimonial>) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...next } : t)));
  }

  async function add() {
    try {
      const created = await api.createTestimonial({
        quote: "Textul recenziei…",
        author: "Nume client",
        role: "",
        featured: true,
        order: items.length,
      });
      setItems((prev) => [...prev, created]);
    } catch {
      setError("Nu am putut adăuga.");
    }
  }

  async function save(t: Testimonial) {
    try {
      await api.updateTestimonial(t.id, {
        quote: t.quote,
        author: t.author,
        role: t.role,
        featured: t.featured,
        order: t.order,
      });
      flash("Salvat. Live pe site.");
    } catch {
      setError("Nu am putut salva.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Ștergi testimonialul?")) return;
    try {
      await api.deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      flash("Șters.");
    } catch {
      setError("Nu am putut șterge.");
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-ink">Testimoniale</h1>
          <p className="mt-1 text-sm text-muted">
            Recenziile afișate pe homepage. Doar cele bifate &bdquo;vizibil&rdquo; apar.
          </p>
        </div>
        <button
          onClick={add}
          className="min-h-11 cursor-pointer rounded-full border border-rule-strong px-5 text-sm text-ink transition-colors duration-200 hover:border-gold hover:bg-cream-sunk"
        >
          + Adaugă testimonial
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Se încarcă…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-rule bg-cream-sunk p-10 text-center">
          <p className="font-display text-title text-ink">Niciun testimonial.</p>
          <p className="mt-2 text-sm text-muted">Adaugă recenzii reale de la clienți.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-5">
          {items.map((t) => (
            <li key={t.id} className="rounded-lg border border-rule bg-cream-sunk p-5">
              <textarea
                className={`${input} min-h-20`}
                value={t.quote}
                onChange={(e) => edit(t.id, { quote: e.target.value })}
                placeholder="Textul recenziei"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  className={input}
                  value={t.author}
                  onChange={(e) => edit(t.id, { author: e.target.value })}
                  placeholder="Autor (nume client)"
                />
                <input
                  className={input}
                  value={t.role ?? ""}
                  onChange={(e) => edit(t.id, { role: e.target.value })}
                  placeholder="Rol / industrie"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={t.featured}
                    onChange={(e) => edit(t.id, { featured: e.target.checked })}
                    className="size-4 accent-gold"
                  />
                  Vizibil pe site
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => remove(t.id)}
                    className="min-h-9 cursor-pointer rounded-full px-4 text-sm text-muted transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                  >
                    Șterge
                  </button>
                  <button
                    onClick={() => save(t)}
                    className="min-h-9 cursor-pointer rounded-full bg-gold px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-light"
                  >
                    Salvează
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SaveToast show={!!toast} label={toast} />
    </AdminShell>
  );
}
