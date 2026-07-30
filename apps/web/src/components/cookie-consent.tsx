"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  applyConsentMode,
  type ConsentChoice,
  newVisitorId,
  type StoredConsent,
  writeConsentCookie,
} from "@/lib/consent";

/**
 * Cookie bar + preferences panel (brief §5ter).
 *
 * Performance shape, because a consent bar is the classic CWV own-goal:
 * - `open` is decided on the server from the cookie, so returning visitors get
 *   no bar in the HTML at all and there's nothing to hydrate away.
 * - `position: fixed` keeps it out of flow — it cannot shift the page, so CLS
 *   stays at zero no matter how tall the copy wraps.
 * - No portal, no focus-trap library, no animation library. The whole thing is
 *   ~2KB of component code on top of what the app already ships.
 *
 * The three categories map to Consent Mode v2 signals in `applyConsentMode`.
 */
export function CookieConsent({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Reopening from the footer / cookies page: a plain custom event keeps this
  // component free of context or global state.
  useEffect(() => {
    const onReopen = () => {
      setShowPrefs(true);
      setOpen(true);
    };
    window.addEventListener("mi:consent-open", onReopen);
    return () => window.removeEventListener("mi:consent-open", onReopen);
  }, []);

  // While the bar is up the floating call/WhatsApp dock has to move, or the two
  // overlap in the bottom-right corner. A class on <html> rather than shared
  // state, so the dock stays a dumb component.
  useEffect(() => {
    document.documentElement.classList.toggle("consent-bar-open", open);
    return () => document.documentElement.classList.remove("consent-bar-open");
  }, [open]);

  // Escape closes the preferences detail, not the bar: dismissing a consent
  // request with a keystroke would count as a choice the visitor never made.
  useEffect(() => {
    if (!showPrefs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPrefs(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPrefs]);

  function decide(choice: ConsentChoice) {
    const stored: StoredConsent = { ...choice, visitorId: newVisitorId() };
    writeConsentCookie(stored);
    applyConsentMode(choice);
    setOpen(false);
    setShowPrefs(false);

    // Compliance evidence (brief §5ter). Fire-and-forget with keepalive so it
    // survives the visitor navigating away in the same tick, and never blocks
    // the UI — the choice is already applied above.
    try {
      const body = JSON.stringify(stored);
      if (!navigator.sendBeacon?.(
        "/api/consent",
        new Blob([body], { type: "application/json" }),
      )) {
        void fetch("/api/consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Logging the consent must never break applying it.
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      // Above the header (z-40) and the dock (z-30), below the mobile drawer (z-50).
      className="fixed inset-x-0 bottom-0 z-[45] border-t border-rule bg-cream/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p
              id="consent-title"
              className="text-eyebrow font-medium uppercase text-gold-deep"
            >
              Cookie-uri
            </p>
            <p
              id="consent-desc"
              className="mt-2 text-sm leading-relaxed text-muted text-pretty"
            >
              Folosesc cookie-uri necesare ca site-ul să funcționeze și, doar cu
              acordul tău, cookie-uri de analiză și de marketing. Nu se
              declanșează nimic până alegi.{" "}
              <a
                href="/cookies"
                className="text-gold-deep underline underline-offset-4 hover:no-underline"
              >
                Politica de cookies
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center lg:shrink-0">
            <Button
              variant="secondary"
              onClick={() => setShowPrefs((v) => !v)}
              aria-expanded={showPrefs}
              aria-controls="consent-prefs"
              className="sm:min-w-32"
            >
              Preferințe
            </Button>
            {/* Reject is as easy to reach as accept — required, and the only
                honest way to ask. */}
            <Button
              variant="secondary"
              onClick={() =>
                decide({ necessary: true, analytics: false, marketing: false })
              }
              className="sm:min-w-32"
            >
              Doar necesare
            </Button>
            <Button
              onClick={() =>
                decide({ necessary: true, analytics: true, marketing: true })
              }
              className="sm:min-w-32"
            >
              Accept toate
            </Button>
          </div>
        </div>

        {showPrefs && (
          <div id="consent-prefs" className="mt-6 border-t border-rule pt-6">
            <ul className="grid gap-4 sm:grid-cols-3">
              <Category
                title="Necesare"
                body="Sesiune, securitate și preferințele tale de cookies. Fără ele site-ul nu funcționează."
                checked
                locked
              />
              <Category
                title="De analiză"
                body="Îmi arată ce pagini sunt citite și unde pleacă lumea, ca să le repar."
                checked={analytics}
                onChange={setAnalytics}
              />
              <Category
                title="De marketing"
                body="Măsoară campaniile pe Google și Meta, ca să nu dau bani pe reclame care nu aduc clienți."
                checked={marketing}
                onChange={setMarketing}
              />
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button
                onClick={() => decide({ necessary: true, analytics, marketing })}
                className="sm:min-w-48"
              >
                Salvează preferințele
              </Button>
              <p className="text-xs leading-relaxed text-muted">
                Poți schimba oricând alegerea din linkul &bdquo;Preferințe
                cookies&rdquo;, jos în pagină.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Category({
  title,
  body,
  checked,
  locked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <li className="rounded-lg border border-rule bg-cream-sunk p-4">
      <label
        className={`flex items-start gap-3 ${locked ? "" : "cursor-pointer"}`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={locked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-gold-deep disabled:opacity-60"
        />
        <span>
          <span className="block text-sm font-medium text-ink">
            {title}
            {locked && (
              <span className="ml-2 text-[0.65rem] font-normal uppercase tracking-wide text-muted">
                mereu active
              </span>
            )}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-muted text-pretty">
            {body}
          </span>
        </span>
      </label>
    </li>
  );
}

/** Footer / cookies-page trigger. Renders nothing but a text button. */
export function CookiePreferencesButton({
  className = "",
  children = "Preferințe cookies",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("mi:consent-open"))}
      className={className}
    >
      {children}
    </button>
  );
}
