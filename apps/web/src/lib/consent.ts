/**
 * Cookie consent + Google Consent Mode v2 (brief §5ter).
 *
 * The rule the brief sets is absolute: no pixel fires before consent. That is
 * enforced by `consentBootstrap` below, an inline script that sets every ad and
 * analytics signal to `denied` in the initial HTML — before any tag, before any
 * Next.js module. Tags added later (GTM, GA4, Meta) queue behind it on their own,
 * so wiring a container ID in the admin can't accidentally leak a hit.
 */

export type ConsentChoice = {
  /** Always true — the site can't work without these. */
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentChoice & { visitorId: string };

export const CONSENT_COOKIE = "mi_consent";

/** Bump when the categories change: an older version re-asks instead of being
 *  silently treated as consent to something the visitor never saw. */
export const CONSENT_VERSION = 1;

/** Six months. Long enough not to nag, short enough that consent stays current. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

/** Wire format, kept short because it travels on every request. */
type CookiePayload = { v: number; a: 0 | 1; m: 0 | 1; id: string };

export function serializeConsent(c: StoredConsent): string {
  const payload: CookiePayload = {
    v: CONSENT_VERSION,
    a: c.analytics ? 1 : 0,
    m: c.marketing ? 1 : 0,
    id: c.visitorId,
  };
  return encodeURIComponent(JSON.stringify(payload));
}

/** Returns null for missing, malformed or outdated cookies — all of which mean
 *  "ask again" rather than "assume denied and stay silent". */
export function parseConsent(raw: string | undefined): StoredConsent | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(decodeURIComponent(raw)) as CookiePayload;
    if (p.v !== CONSENT_VERSION || typeof p.id !== "string") return null;
    return {
      necessary: true,
      analytics: p.a === 1,
      marketing: p.m === 1,
      visitorId: p.id,
    };
  } catch {
    return null;
  }
}

/**
 * Inline, synchronous, ~600 bytes. Runs before anything else on the page.
 *
 * It also replays an existing choice with `consent update` right here, rather
 * than waiting for React to hydrate — otherwise a returning visitor who granted
 * analytics would have their first pageview dropped by tags that fired during
 * the `wait_for_update` window.
 */
export const consentBootstrap = `
(function(){
  window.dataLayer=window.dataLayer||[];
  function g(){window.dataLayer.push(arguments)}
  if(!window.gtag)window.gtag=g;
  g('consent','default',{
    ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
    analytics_storage:'denied',personalization_storage:'denied',
    functionality_storage:'granted',security_storage:'granted',
    wait_for_update:500
  });
  try{
    var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
    if(!m)return;
    var c=JSON.parse(decodeURIComponent(m[1]));
    if(c.v!==${CONSENT_VERSION})return;
    var a=c.a?'granted':'denied',ad=c.m?'granted':'denied';
    g('consent','update',{
      ad_storage:ad,ad_user_data:ad,ad_personalization:ad,
      analytics_storage:a,personalization_storage:ad
    });
  }catch(e){}
})();
`
  // Minify the whitespace we added for readability — it ships on every request.
  .replace(/\s*\n\s*/g, "");

type ConsentWindow = {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Push a decision to Consent Mode. Safe before any tag exists: the command sits
 * in dataLayer and GTM applies it when it loads.
 *
 * Goes through `window.gtag` (defined by the bootstrap) rather than pushing to
 * dataLayer directly — gtag pushes the `arguments` object, and an array is not
 * quite the same shape.
 */
export function applyConsentMode(c: ConsentChoice) {
  const w = window as unknown as ConsentWindow;
  const a = c.analytics ? "granted" : "denied";
  const ad = c.marketing ? "granted" : "denied";
  const signals = {
    ad_storage: ad,
    ad_user_data: ad,
    ad_personalization: ad,
    analytics_storage: a,
    personalization_storage: ad,
  };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", signals);
    return;
  }
  // Bootstrap blocked (CSP, extension) — keep the decision recorded anyway.
  (w.dataLayer ??= []).push({ event: "consent_update", ...signals });
}

export function newVisitorId(): string {
  // randomUUID needs a secure context; http on a LAN IP during testing isn't one.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `v-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function writeConsentCookie(c: StoredConsent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(c)}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
}
