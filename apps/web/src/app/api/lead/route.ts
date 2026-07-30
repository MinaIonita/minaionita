import { NextResponse } from "next/server";

/**
 * Bridge between the site's contact form and the NestJS admin. Every submission
 * becomes a ticket in MySQL (brief §5ter). If the API is unreachable, we log and
 * still return ok so a lead is never lost to a form error — but flag it, so an
 * outage is visible.
 */
const API = process.env.API_URL ?? "http://localhost:4000/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (!b.name || !b.email) {
    return NextResponse.json({ error: "Nume și email sunt necesare" }, { status: 422 });
  }

  // Map the form fields to the API DTO (strict whitelist), dropping empties and
  // the form's "service" → "serviceSlug".
  const payload = Object.fromEntries(
    Object.entries({
      name: b.name,
      email: b.email,
      phone: b.phone,
      message: b.message,
      budget: b.budget,
      serviceSlug: b.serviceSlug ?? b.service,
      utmSource: b.utmSource,
      utmMedium: b.utmMedium,
      utmCampaign: b.utmCampaign,
      utmTerm: b.utmTerm,
      utmContent: b.utmContent,
      landingPage: b.landingPage,
    }).filter(([, v]) => v != null && v !== ""),
  );

  try {
    const res = await fetch(`${API}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the visitor's context so the admin captures real attribution.
        referer: request.headers.get("referer") ?? "",
        "user-agent": request.headers.get("user-agent") ?? "",
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[lead] API unreachable, lead not persisted:", err);
    // Don't fail the visitor; surface a soft flag for monitoring.
    return NextResponse.json({ ok: true, persisted: false }, { status: 202 });
  }
}
