import { NextRequest, NextResponse } from "next/server";

// Proxies Fourvenues' Integrations API (docs.fourvenues.com/integrations) so
// FV_API_KEY only ever lives server-side — the client calls this route, this
// route calls Fourvenues with the key attached via the `X-Api-Key` header
// their API actually expects (not `Authorization: Bearer`, confirmed against
// their docs after the header name alone produced 401s with no body).
const FOURVENUES_BASE = "https://api.fourvenues.com/integrations";

export async function GET(request: NextRequest) {
  const apiKey = process.env.FV_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "FV_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!start || !end) {
    return NextResponse.json(
      { success: false, error: "start and end query params are required" },
      { status: 400 }
    );
  }

  const fvUrl = new URL(`${FOURVENUES_BASE}/events/`);
  fvUrl.searchParams.set("start", start);
  fvUrl.searchParams.set("end", end);

  const res = await fetch(fvUrl, {
    headers: { "X-Api-Key": apiKey },
    // Events don't change minute-to-minute; a short cache keeps month
    // navigation snappy without hammering Fourvenues on every click.
    next: { revalidate: 300 },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
