// Shared Fourvenues event types/helpers — used by both the client-side
// calendar (events-calendar.tsx, which still owns month-navigation state,
// the modal, and the embedded checkout widget) and the server-rendered
// /eventos and /eventos/[slug] pages (which need the same event shape and
// date-handling logic to build real Event schema and static content,
// without needing any client-side state at all). Extracted here rather
// than left duplicated across both, or imported from the client component
// (which would drag "use client" into pages that should stay server
// components for their metadata/JSON-LD to work).

export interface FvEvent {
  _id: string;
  name: string;
  slug: string;
  url: string;
  start: number; // unix seconds — actual door-opening time (often past midnight)
  end: number;
  flyer: string;
  // The "night" this event belongs to, as Fourvenues itself displays it —
  // e.g. a party whose doors open at 01:00 Sunday still has `date` set to
  // Saturday 00:00, because that's the night people are actually going out
  // on. Confirmed against Fourvenues' own embedded widget: it shows this
  // event as "sábado 26", not the Sunday its raw `start` timestamp falls
  // on. Use `date`, not `start`, anywhere a day/weekday is shown, or dates
  // disagree with the widget.
  date: number;
  description: string;
  age: number;
  outfit: string;
  location_town: string;
  visible: boolean;
  active: boolean;
}

// Fourvenues stores `outfit` as a free-text dress-code value, not a
// documented enum. "smart" → "Arreglado" (not the more literal "Elegante")
// confirmed live against Fourvenues' own embedded checkout widget, which
// shows this same dress code as "Arreglado" in its own Spanish UI.
export const OUTFIT_TRANSLATIONS: Record<string, string> = {
  smart: "Arreglado",
  casual: "Informal",
  "smart casual": "Arreglado informal",
  formal: "Formal",
  "black tie": "Etiqueta",
};

export function translateOutfit(outfit: string): string {
  const known = OUTFIT_TRANSLATIONS[outfit.trim().toLowerCase()];
  if (known) return known;
  return outfit.charAt(0).toUpperCase() + outfit.slice(1);
}

// Fourvenues' `start` is the real door-opening timestamp — for a party that
// opens at 01:00, that's technically the next calendar day. `date` is the
// field Fourvenues itself uses to say which NIGHT the event belongs to.
// Reading `date` here — always in Madrid time explicitly, not whatever
// timezone this code happens to run in (a visitor's browser, or the server
// during SSR/build) — is what keeps every day shown across the site
// agreeing with what Fourvenues' own widget shows.
export function madridDateParts(unixSeconds: number): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(unixSeconds * 1000));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month") - 1, day: get("day") };
}

export function eventDateKey(event: { date: number }): number {
  const { year, month, day } = madridDateParts(event.date);
  return new Date(year, month, day).getTime();
}

// Fourvenues' own short code (the last path segment of `event.url`, e.g.
// "6JNJ" from fourvenues.com/pocco-club/6JNJ) — what their checkout
// widget's own router actually resolves against, confirmed live (their
// readable `slug` field looks plausible for this but silently fails).
// `slug` itself (e.g. "all-eyes-on-pocco-26-09-2026") is what THIS site
// uses for its own /eventos/[slug] URLs — the two serve different
// purposes and shouldn't be confused for each other.
export function eventShortCode(url: string): string {
  return url.split("/").filter(Boolean).pop() ?? "";
}

// Server-side fetch of the events list, for use in generateStaticParams,
// generateMetadata and the page bodies of /eventos and /eventos/[slug] —
// calls Fourvenues' API directly (not through /api/events, which exists so
// the FV_API_KEY never reaches the browser; a server component already
// runs server-side, so it can read the key directly without needing to
// hop through that route itself).
const FOURVENUES_BASE = "https://api.fourvenues.com/integrations";

export async function fetchEvents(start: Date, end: Date): Promise<FvEvent[]> {
  const apiKey = process.env.FV_API_KEY;
  if (!apiKey) return [];

  const url = new URL(`${FOURVENUES_BASE}/events/`);
  url.searchParams.set("start", start.toISOString());
  url.searchParams.set("end", end.toISOString());

  const res = await fetch(url, {
    headers: { "X-Api-Key": apiKey },
    // Matches /api/events' own revalidation window — event listings don't
    // change minute to minute, and this keeps build/ISR requests from
    // hammering Fourvenues.
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.success) return [];
  return (data.data as FvEvent[]).filter((e) => e.visible && e.active);
}

export async function fetchEventBySlug(slug: string): Promise<FvEvent | null> {
  // Fourvenues' API is date-range scoped, not slug-scoped — there's no
  // single-event-by-slug endpoint, so this fetches a wide window (covers
  // anything from a year back — for events that already happened but
  // should still resolve, e.g. from an old shared link — to a year ahead)
  // and finds the match client-side (here, server-side in our own code).
  // A year is comfortably past what this club schedules that far out in
  // either direction, without being an unbounded/expensive range.
  const now = new Date();
  const start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const events = await fetchEvents(start, end);
  return events.find((e) => e.slug === slug) ?? null;
}
