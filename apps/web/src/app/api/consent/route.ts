import { NextResponse } from "next/server";

/**
 * Consent log (brief §5ter) — kept as compliance evidence, so it records the
 * choice, not the person: an anonymous visitor id from the banner, never a name
 * or an email.
 *
 * Returns 204 whether or not the API is reachable. The visitor's choice is
 * already applied client-side before this fires; failing the request would only
 * surface an error for something they can't act on.
 */
const API = process.env.API_URL ?? "http://localhost:4000/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new NextResponse(null, { status: 204 });
  }

  const b = body as Record<string, unknown>;
  if (typeof b.visitorId !== "string") {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await fetch(`${API}/consent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The API derives ip/ua from these, same as the leads endpoint.
        "user-agent": request.headers.get("user-agent") ?? "",
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify({
        visitorId: b.visitorId,
        analytics: b.analytics === true,
        marketing: b.marketing === true,
      }),
    });
  } catch (err) {
    console.error("[consent] API unreachable, choice not logged:", err);
  }

  return new NextResponse(null, { status: 204 });
}
