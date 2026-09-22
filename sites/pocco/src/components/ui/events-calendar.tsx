"use client";

// Month-by-month event calendar, fed by our own /api/events route (a thin
// server-side proxy over Fourvenues' Integrations API — see that route for
// why the key can't just be called from here directly). Replaces the old
// embedded Fourvenues <iframe> widget's LISTING with our own layout, dark/red
// POCCO styling, and calendar/past/next-up states the Integrations API alone
// enables. Checkout itself still has to go through Fourvenues (their API is
// read-only — no endpoint creates a real purchase), so EventCheckoutEmbed
// below re-embeds their widget, but scoped to a single event's detail/
// checkout view inside the modal, instead of the old full listing.

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

interface FvEvent {
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
  // on. Use `date`, not `start`, anywhere a day/weekday is shown or an
  // event is placed on the calendar grid, or dates disagree with the
  // widget one scroll below.
  date: number;
  description: string;
  age: number;
  outfit: string;
  location_town: string;
  visible: boolean;
  active: boolean;
}

const MONTH_NAMES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

// Fourvenues stores `outfit` as a free-text dress-code value, not a
// documented enum (checked their API docs — no list of valid values). Only
// "smart" has actually shown up across every event fetched so far, but
// nothing stops the club from using others later, so this translates the
// values known to be in use / likely to come up rather than assuming a
// closed set, and falls back to just capitalizing whatever comes through
// unrecognized instead of hiding or breaking on it.
//
// "smart" → "Arreglado", not the more literal "Elegante" — confirmed live
// against Fourvenues' own embedded checkout widget (loaded a few taps later
// for this exact event): it shows this same dress code as "Arreglado" in
// its own Spanish UI, so matching that keeps our badge and theirs agreeing
// instead of using two different words for the same thing one scroll apart.
const OUTFIT_TRANSLATIONS: Record<string, string> = {
  smart: "Arreglado",
  casual: "Informal",
  "smart casual": "Arreglado informal",
  formal: "Formal",
  "black tie": "Etiqueta",
};

function translateOutfit(outfit: string): string {
  const known = OUTFIT_TRANSLATIONS[outfit.trim().toLowerCase()];
  if (known) return known;
  return outfit.charAt(0).toUpperCase() + outfit.slice(1);
}

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

function monthBounds(year: number, month: number) {
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return { start, end };
}

// Calendar grid always starts on Monday — shift Sunday=0 to the end.
function mondayIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

type EventStatus = "past" | "this-weekend" | "upcoming";

// POCCO runs week to week, so "this weekend" isn't a fixed Fri–Sun date
// range — it's whichever event is happening NEXT (the nearest one that
// hasn't finished yet). That's the one visitors actually care about when
// they land on this section, whether it falls on a Friday, a Tuesday
// "Especial", or three weeks from now because nothing's on sooner. Any
// other event sharing that same soonest date also gets flagged, so a
// Friday+Saturday double bill both light up together.
function getEventStatus(event: { end: number; date: number }, today: Date, nextUpcomingDateKey: number | null): EventStatus {
  const endMs = event.end * 1000;
  if (endMs < today.getTime()) return "past";
  if (nextUpcomingDateKey !== null && eventDateKey(event) === nextUpcomingDateKey) return "this-weekend";
  return "upcoming";
}

// Fourvenues' `start` is the real door-opening timestamp — for a party that
// opens at 01:00, that's technically the next calendar day. `date` is the
// field Fourvenues itself uses to say which NIGHT the event belongs to
// (e.g. still Saturday 00:00 for a Sunday-01:00 start), and it's what their
// own embedded widget displays. Reading `date` here — always in Madrid time
// explicitly, not whatever timezone this code happens to run in (a
// visitor's browser, or the server during SSR) — is what keeps every day
// shown in this calendar (the grid, "this weekend" status, cards, modal)
// agreeing with what the widget shows one scroll below. Confirmed live:
// using `start` here read "domingo 27" where the widget said "sábado 26".
function madridDateParts(unixSeconds: number): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(unixSeconds * 1000));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month") - 1, day: get("day") };
}

// Groups by calendar day (not exact timestamp) so same-day events with
// slightly different start times still count as the same "next" occasion.
function eventDateKey(event: { date: number }): number {
  const { year, month, day } = madridDateParts(event.date);
  return new Date(year, month, day).getTime();
}

// Fourvenues' own checkout script only starts downloading once a visitor
// taps an event (see EventCheckoutEmbed) — that puts real network latency
// on the critical path of "I tapped, why is this blank for a second".
// Opening the connection (DNS + TLS) as soon as the calendar mounts, well
// before any tap, shaves that part off without touching the script itself.
//
// A `<link rel="preload" as="script">` for the script itself was tried
// first and reverted: it fetches without credentials by default, and
// Fourvenues' script apparently keys some of its own internal session state
// off of how IT was first requested — with the preload in place, ticket
// pricing inside the embedded checkout broke (CORS failures on their own
// pricing-info endpoint, then a crash in their calculatePrice trying to
// read the missing response). A plain `fetch()` into cache (see the effect
// below) doesn't have that failure mode — it's just an ordinary HTTP
// request for the same URL a `<script src>` tag makes on tap, so there's no
// separate preload-vs-consume credentials mismatch for Fourvenues' script
// to get confused by. Module-level guard so this only runs once per page
// load, not once per EventsCalendar mount.
let checkoutConnectionWarmed = false;

export default function EventsCalendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useState<FvEvent[] | null>(null);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<FvEvent | null>(null);
  // Past events default to collapsed — a week-to-week club's visitors care
  // about what's coming, not what already happened, and a full list of
  // past cards was outweighing the "next up"/"upcoming" sections both in
  // count and in visual space on months with few future events booked yet.
  const [showPast, setShowPast] = useState(false);
  // "PRÓXIMOS EVENTOS" (below the calendar) starts capped at a short
  // preview — same reasoning as past events being collapsed, just inverted:
  // this list can run to many entries once the club is fully booked out
  // months ahead, and showing all of them by default would be its own kind
  // of visual clutter the other direction.
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const UPCOMING_PREVIEW_COUNT = 4;

  useEffect(() => {
    if (checkoutConnectionWarmed) return;
    checkoutConnectionWarmed = true;

    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://www.fourvenues.com";
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);

    // Beyond just warming the connection: fetch the checkout widget's own
    // script right away, well before any tap, so that when
    // EventCheckoutEmbed later injects its own <script src="..."> element
    // (unchanged, on tap, exactly as before) most of the round-trip has
    // already happened. Fourvenues serves this with `cache-control:
    // max-age=0` (checked directly against their response headers), so the
    // browser can't skip the network entirely on the later request — but it
    // CAN send a conditional revalidation (If-Modified-Since/ETag) and get
    // back a cheap 304 instead of a full download if nothing changed, and
    // the request itself no longer pays DNS/TLS/TTFB cold (their edge is
    // behind Cloudflare, confirmed cf-cache-status: HIT on this fetch, so
    // that leg is fast once it's not also the very first contact). A plain
    // `fetch()` (not `<link rel="preload">`, the approach tried previously)
    // doesn't affect how the resource is later requested by a real <script>
    // tag — it's just an ordinary HTTP request for the same URL, no
    // separate "preload not consumed" warning and no distinct credentials
    // mode to mismatch — so this can't reproduce the pricing/CORS breakage
    // preload caused when that was tried instead.
    fetch("https://www.fourvenues.com/assets/iframe/pocco-club/events?theme=dark", {
      mode: "cors",
      credentials: "omit",
    }).catch(() => {
      // Best-effort only — EventCheckoutEmbed's own script tag still works
      // exactly as before if this fails or never resolves.
    });
  }, []);

  // The "next up" event drives the featured-card treatment and must stay
  // fixed regardless of which month the calendar grid is currently showing
  // — otherwise flipping to a future month with no events yet would make
  // the highlight disappear, and flipping back would make it reappear on a
  // now-stale event. Fetched once, from a wide forward-looking window, and
  // never refetched on month navigation.
  //
  // The same fetch also backs the "PRÓXIMOS EVENTOS" list below — near the
  // end of a month, the calendar's own month-scoped list (see the other
  // effect) can be down to a single event, even though the club already has
  // several more booked into next month. Without this, that read as "barely
  // anything to buy right now" even when there wasn't. This list isn't
  // scoped to `cursor` at all — it always shows what's actually coming up
  // next in real time, independent of which month the grid happens to be
  // showing.
  const [nextUpcomingDateKey, setNextUpcomingDateKey] = useState<number | null>(null);
  const [upcomingAcrossMonths, setUpcomingAcrossMonths] = useState<FvEvent[] | null>(null);

  useEffect(() => {
    const start = today;
    const end = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    const params = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });

    fetch(`/api/events?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error ?? "unknown error");
        const upcoming = (json.data as FvEvent[])
          .filter((e) => e.visible && e.active && e.end * 1000 >= today.getTime())
          .sort((a, b) => a.start - b.start);
        if (upcoming.length > 0) setNextUpcomingDateKey(eventDateKey(upcoming[0]));
        setUpcomingAcrossMonths(upcoming);
      })
      .catch(() => {
        // Silent — this only powers the featured-card highlight and the
        // cross-month upcoming list, and the month grid below has its own
        // independent error state already.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scoped to exactly the visible month via `monthBounds(cursor...)` below
  // — `events` (and everything derived from it: the day grid, the
  // upcoming/past lists, the "Ver N eventos pasados" count) only ever holds
  // events whose date falls inside the currently open month. This is what
  // keeps "past events" collapsed under that toggle from ever including a
  // stray event from a different month, now or once the club has years of
  // history piled up — there's no cross-month accumulation to guard against
  // because a different month's events are never fetched into this list in
  // the first place, they only exist in the calendar as long as `cursor`
  // points at their month.
  useEffect(() => {
    let cancelled = false;
    setEvents(null);
    setError(false);

    const { start, end } = monthBounds(cursor.year, cursor.month);
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    fetch(`/api/events?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.success) throw new Error(json.error ?? "unknown error");
        setEvents((json.data as FvEvent[]).filter((e) => e.visible && e.active));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, FvEvent[]>();
    for (const ev of events ?? []) {
      // `date`, not `start` — see madridDateParts for why: a 01:00 door
      // time's raw `start` timestamp falls on the next calendar day, but
      // `date` is the night the event actually belongs to, matching what
      // visitors (and Fourvenues' own widget) think of it as happening on.
      const { day } = madridDateParts(ev.date);
      const list = map.get(day) ?? [];
      list.push(ev);
      map.set(day, list);
    }
    return map;
  }, [events]);

  const { start: monthStart } = monthBounds(cursor.year, cursor.month);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(monthStart.getDay());

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToMonth = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setShowPast(false);
  };

  const isPastMonth =
    cursor.year < today.getFullYear() ||
    (cursor.year === today.getFullYear() && cursor.month < today.getMonth());

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          marginBottom: "4vh",
        }}
      >
        <button
          onClick={() => goToMonth(-1)}
          aria-label="Mes anterior"
          style={navButtonStyle}
        >
          ←
        </button>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(18px, 2.4vw, 26px)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "#f5f5f5",
            margin: 0,
            minWidth: 220,
            textAlign: "center",
          }}
        >
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </p>
        <button
          onClick={() => goToMonth(1)}
          aria-label="Mes siguiente"
          style={navButtonStyle}
        >
          →
        </button>
      </div>

      {error && (
        <p style={{ textAlign: "center", color: "rgba(245,245,245,0.4)", fontFamily: "'Inter', sans-serif" }}>
          No se pudo cargar el calendario. Inténtalo de nuevo más tarde.
        </p>
      )}

      {!error && (
        <>
          {/* Weekday header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
            {WEEKDAY_LABELS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontFamily: DISPLAY,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(245,245,245,0.35)",
                  padding: "4px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid — status of the day's FIRST event (there's rarely more
              than one per day) drives the styling: past days fade out, the
              next upcoming date gets a solid fill instead of just a border
              so it reads as "the one that matters right now" against both
              the greyed-out past and the plain-outlined rest of the future. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {cells.map((day, i) => {
              if (day === null) return <div key={`b${i}`} />;
              const dayEvents = eventsByDay.get(day) ?? [];
              const status = dayEvents[0] ? getEventStatus(dayEvents[0], today, nextUpcomingDateKey) : null;
              const isToday =
                day === today.getDate() &&
                cursor.month === today.getMonth() &&
                cursor.year === today.getFullYear();

              return (
                <button
                  key={day}
                  disabled={dayEvents.length === 0}
                  onClick={() => dayEvents[0] && setSelected(dayEvents[0])}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    borderRadius: 10,
                    border:
                      status === "this-weekend"
                        ? "1px solid #e21212"
                        : isToday
                          ? "1px solid rgba(226,18,18,0.6)"
                          : "1px solid rgba(255,255,255,0.06)",
                    background:
                      status === "this-weekend"
                        ? "#e21212"
                        : status === "upcoming"
                          ? "rgba(226,18,18,0.12)"
                          : status === "past"
                            ? "rgba(255,255,255,0.03)"
                            : "transparent",
                    opacity: status === "past" ? 0.5 : 1,
                    cursor: dayEvents.length > 0 ? "pointer" : "default",
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(11px, 1.6vw, 14px)",
                      color:
                        status === "this-weekend"
                          ? "#f5f5f5"
                          : dayEvents.length > 0
                            ? "#f5f5f5"
                            : "rgba(245,245,245,0.3)",
                      fontWeight: dayEvents.length > 0 ? 700 : 400,
                    }}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && status !== "this-weekend" && (
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: status === "past" ? "rgba(245,245,245,0.3)" : "#e21212",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {events === null && !error && (
            <p style={{ textAlign: "center", color: "rgba(245,245,245,0.35)", fontFamily: "'Inter', sans-serif", marginTop: "3vh" }}>
              Cargando eventos…
            </p>
          )}

          {/* Empty state */}
          {events !== null && events.length === 0 && (
            <p style={{ textAlign: "center", color: "rgba(245,245,245,0.35)", fontFamily: "'Inter', sans-serif", marginTop: "3vh" }}>
              {isPastMonth ? "Sin eventos en este mes." : "Aún no hay eventos anunciados para este mes."}
            </p>
          )}

          {/* List of this month's events, split by status: the soonest
              upcoming event (possibly more than one, if same-day) gets its
              own featured card up top — the one date that matters most for
              a week-to-week club — then the rest of upcoming, then past —
              faded and pushed last, kept visible rather than hidden so the
              month still reads as complete. */}
          {events !== null && events.length > 0 && (() => {
            const sorted = [...events].sort((a, b) => a.start - b.start);
            const weekendEvents = sorted.filter((ev) => getEventStatus(ev, today, nextUpcomingDateKey) === "this-weekend");
            const upcomingEvents = sorted.filter((ev) => getEventStatus(ev, today, nextUpcomingDateKey) === "upcoming");
            const pastEvents = sorted.filter((ev) => getEventStatus(ev, today, nextUpcomingDateKey) === "past");

            return (
              <div style={{ marginTop: "4vh" }}>
                {weekendEvents.length > 0 && (
                  <div style={{ marginBottom: upcomingEvents.length || pastEvents.length ? "4vh" : 0 }}>
                    <p style={sectionLabelStyle}>PRÓXIMO EVENTO</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {weekendEvents.map((ev) => (
                        <FeaturedEventCard key={ev._id} event={ev} onSelect={() => setSelected(ev)} />
                      ))}
                    </div>
                  </div>
                )}

                {upcomingEvents.length > 0 && (
                  <div style={{ marginBottom: pastEvents.length ? "4vh" : 0 }}>
                    {weekendEvents.length > 0 && <p style={sectionLabelStyle}>PRÓXIMAMENTE</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {upcomingEvents.map((ev) => (
                        <EventRow key={ev._id} event={ev} status="upcoming" onSelect={() => setSelected(ev)} />
                      ))}
                    </div>
                  </div>
                )}

                {pastEvents.length > 0 && (
                  <div>
                    {showPast ? (
                      <>
                        <p style={sectionLabelStyle}>YA PASADOS</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {pastEvents.map((ev) => (
                            <EventRow key={ev._id} event={ev} status="past" onSelect={() => setSelected(ev)} />
                          ))}
                        </div>
                      </>
                    ) : (
                      // Collapsed by default — past events don't need the
                      // same visual weight as what's coming, especially on
                      // a month where only one or two future events are
                      // booked so far and the past list would otherwise
                      // dominate the section.
                      <button
                        onClick={() => setShowPast(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          width: "100%",
                          padding: "10px",
                          borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "transparent",
                          color: "rgba(245,245,245,0.4)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Ver {pastEvents.length} {pastEvents.length === 1 ? "evento pasado" : "eventos pasados"} →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </>
      )}

      {/* Independent of the month grid above — always shows what's
          genuinely coming up next across the next 3 months, not just
          within whatever month `cursor` happens to be pointed at. Matters
          most late in a month: the grid's own list can be down to one
          event while several more are already booked for next month, which
          otherwise read as "barely anything to buy" when that wasn't true. */}
      {upcomingAcrossMonths !== null && upcomingAcrossMonths.length > 0 && (() => {
        const visible = showAllUpcoming
          ? upcomingAcrossMonths
          : upcomingAcrossMonths.slice(0, UPCOMING_PREVIEW_COUNT);
        const remaining = upcomingAcrossMonths.length - visible.length;

        return (
          <div style={{ marginTop: "6vh" }}>
            <p style={sectionLabelStyle}>PRÓXIMOS EVENTOS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {visible.map((ev) => (
                <EventRow key={ev._id} event={ev} status="upcoming" onSelect={() => setSelected(ev)} />
              ))}
            </div>
            {remaining > 0 && (
              <button
                onClick={() => setShowAllUpcoming(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  marginTop: 10,
                  padding: "10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent",
                  color: "rgba(245,245,245,0.6)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Ver todos ({upcomingAcrossMonths.length}) →
              </button>
            )}
          </div>
        );
      })()}

      {selected && (
        <EventModal
          event={selected}
          isPast={getEventStatus(selected, today, nextUpcomingDateKey) === "past"}
          onClose={() => {
            // Fourvenues' embedded widget (see EventCheckoutEmbed) drives its
            // own in-iframe navigation by writing to window.location.hash as
            // soon as the modal opens — strip it here, on the real
            // user-initiated close, so a reload right after closing doesn't
            // trigger the browser's native anchor-scroll-on-load behavior.
            // Deliberately NOT done from EventModal's own effect cleanup —
            // see EventCheckoutEmbed's hash-write comment for why that raced
            // Strict Mode's internal remount cycle and broke the deep link.
            if (window.location.hash) {
              history.replaceState(null, "", window.location.pathname + window.location.search);
            }
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

const navButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "transparent",
  color: "#f5f5f5",
  fontSize: 16,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.16em",
  color: "rgba(245,245,245,0.35)",
  margin: "0 0 10px",
};

// Big flyer-forward card, reserved for whatever's happening NEXT — the one
// thing a week-to-week club's visitors actually need to notice first when
// they land on this section.
function FeaturedEventCard({ event, onSelect }: { event: FvEvent; onSelect: () => void }) {
  // `date`, not `start` — see madridDateParts's comment: `date` is the
  // night Fourvenues itself displays this event as belonging to.
  const d = new Date(event.date * 1000);
  const dayLabel = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Madrid" });

  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        textAlign: "left",
        background: "linear-gradient(135deg, rgba(226,18,18,0.18), #111)",
        border: "1px solid #e21212",
        borderRadius: 18,
        padding: "16px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 88,
          height: 88,
          borderRadius: 12,
          overflow: "hidden",
          flexShrink: 0,
          background: "#1a1a1a",
        }}
      >
        {event.flyer && (
          <Image src={event.flyer} alt="" fill sizes="88px" style={{ objectFit: "cover" }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: DISPLAY,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "#e21212",
            marginBottom: 6,
          }}
        >
          PRÓXIMO EVENTO
        </span>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(16px, 2vw, 19px)",
            fontWeight: 800,
            color: "#f5f5f5",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.name}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: "rgba(245,245,245,0.55)",
            margin: "4px 0 0",
          }}
        >
          <span style={{ textTransform: "capitalize" }}>{dayLabel}</span> · +{event.age} · {translateOutfit(event.outfit)}
        </p>
      </div>
      <span style={{ color: "#e21212", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>Ver →</span>
    </button>
  );
}

function EventRow({
  event,
  status,
  onSelect,
}: {
  event: FvEvent;
  status: "upcoming" | "past";
  onSelect: () => void;
}) {
  // `date`, not `start` — see madridDateParts's comment.
  const d = new Date(event.date * 1000);
  const dayLabel = d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", timeZone: "Europe/Madrid" }).replace(".", "");
  const isPast = status === "past";

  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        textAlign: "left",
        background: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "12px 16px",
        cursor: "pointer",
        opacity: isPast ? 0.45 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 52,
          height: 52,
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
          background: "#1a1a1a",
          filter: isPast ? "grayscale(1)" : "none",
        }}
      >
        {event.flyer && (
          <Image src={event.flyer} alt="" fill sizes="52px" style={{ objectFit: "cover" }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: 15,
            fontWeight: 700,
            color: "#f5f5f5",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.name}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: "rgba(245,245,245,0.45)",
            margin: "2px 0 0",
          }}
        >
          <span style={{ textTransform: "capitalize" }}>{dayLabel}</span> · +{event.age} · {translateOutfit(event.outfit)}
        </p>
      </div>
      {!isPast && (
        <span style={{ color: "#e21212", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>Ver →</span>
      )}
    </button>
  );
}

function EventModal({ event, isPast, onClose }: { event: FvEvent; isPast: boolean; onClose: () => void }) {
  // `date`, not `start` — see madridDateParts's comment: Fourvenues' own
  // widget (loaded below for the checkout) shows this event on the night
  // its `date` field points to (e.g. "sábado 26"), not the calendar day its
  // raw `start` door-opening timestamp falls on (Sunday, for a 01:00 door
  // time). Using the wrong field here made this modal disagree with the
  // widget one scroll below on which day the event even is.
  const d = new Date(event.date * 1000);
  const fullDate = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Madrid" });

  // Locks background scroll while the modal is open — without this, a
  // description long enough to need its own scroll (see the panel's
  // overflowY below) let touch-drag/wheel scroll BOTH the modal's content
  // and the page behind it at once, which is disorienting and can also
  // scroll the modal itself out from under a finger mid-swipe.
  //
  // `overflow: hidden` on <html>/<body> alone does NOT reliably stop this —
  // confirmed live: the background kept scrolling on wheel input even with
  // both set to hidden, because overflow:hidden only removes the
  // scrollbar/clamps scrollable range, it doesn't unconditionally swallow
  // wheel/touch input on every engine. Pinning the body in place with
  // position:fixed (and restoring the exact scroll offset on close) is the
  // approach that actually blocks it everywhere, at the cost of needing to
  // re-apply that saved offset manually afterward since fixed positioning
  // itself resets scrollY to 0 while active.
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vh 6vw",
        // The overlay itself scrolls (not just the panel) so a panel taller
        // than the viewport — common on a short phone screen once the
        // square flyer + full description stack up — can still be reached
        // in full by scrolling the overlay, with the panel free to sit
        // below the fold instead of ever being clipped by `padding` above.
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          width: "100%",
          maxHeight: "90vh",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          overflowY: "auto",
          // iOS Safari needs this explicitly for momentum scrolling inside
          // a nested scroll container — without it, drags inside the panel
          // feel like they stop dead instead of coasting.
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Always present regardless of isPast — a past event used to skip
            straight into its flyer with no header, which left tapping the
            (undiscoverable) backdrop as the only way to close that modal
            state. One shared bar keeps a close button available no matter
            which branch below renders, including when a past event has no
            flyer to float a button over. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 15,
              fontWeight: 700,
              color: "#f5f5f5",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.name}
          </p>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "#f5f5f5",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
            }}
          >
            ✕
          </button>
        </div>

        {isPast ? (
          <>
            {event.flyer && (
              <div style={{ position: "relative", width: "100%", aspectRatio: "1" }}>
                <Image src={event.flyer} alt={event.name} fill sizes="420px" style={{ objectFit: "cover" }} />
              </div>
            )}
            <div style={{ padding: "20px 22px 24px" }}>
              <p style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 800, color: "#f5f5f5", margin: "0 0 6px", textTransform: "capitalize" }}>
                {event.name}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(245,245,245,0.5)", margin: "0 0 14px", textTransform: "capitalize" }}>
                {fullDate} · {event.location_town}
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <span style={pillTagStyle}>+{event.age}</span>
                <span style={pillTagStyle}>{translateOutfit(event.outfit)}</span>
              </div>
              {event.description && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.6, color: "rgba(245,245,245,0.6)", margin: "0 0 20px", whiteSpace: "pre-line" }}>
                  {event.description}
                </p>
              )}
              <p
                style={{
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(245,245,245,0.4)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Este evento ya ha pasado
              </p>
            </div>
          </>
        ) : null /* No flyer/title/description here for a not-yet-past event —
             Fourvenues' own embedded checkout (below) already opens on that
             exact event's detail view with its own flyer, title, date and
             description right at the top (see EventCheckoutEmbed's hash deep
             link). Showing our own copy of the same info above it just
             duplicated everything the visitor was about to see again one
             scroll down, adding length without adding anything — the shared
             header bar above is enough context to know which event this is. */}
        {!isPast && (
          <div style={{ padding: "16px 22px 24px" }}>
            <EventCheckoutEmbed url={event.url} />
          </div>
        )}
      </div>
    </div>
  );
}

// Re-embeds Fourvenues' own widget script (same one the old full-page
// listing used — see the module comment up top) but scoped to a single
// event's detail/checkout view via their loader's own hash-based deep link
// (`window.location.hash = "events/<code>"`, read before the script is
// injected). The first attempt at this used `event.slug` (the readable
// slug, e.g. "all-eyes-on-pocco-26-09-2026") and it silently failed — the
// iframe built the expected-looking URL but never rendered anything. The
// fix: Fourvenues' own short code (the last path segment of `event.url`,
// e.g. "6JNJ" from fourvenues.com/pocco-club/6JNJ) is what the router
// actually resolves — confirmed live, swapping slug for that code is what
// makes the deep link work at all.
function eventShortCode(url: string): string {
  return url.split("/").filter(Boolean).pop() ?? "";
}

let checkoutScriptCounter = 0;

function EventCheckoutEmbed({ url }: { url: string }) {
  const [mountId] = useState(() => `fv-checkout-${++checkoutScriptCounter}`);

  // Writing this hash used to raced EventModal's own scroll-lock cleanup,
  // which also stripped window.location.hash on every effect cleanup —
  // including Strict Mode's throwaway cleanup between its two passes, not
  // just the real one on close. Confirmed live with timestamped logs: the
  // script got injected with the correct hash in place (t=9387ms), then
  // EventModal's cleanup wiped it 4.5ms later (t=9392ms) — well before the
  // remote script's async load could read it, so the iframe fell back to
  // the full listing instead of deep-linking to the event. Fixed by moving
  // that hash-strip out of the shared effect entirely and into onClose
  // (see the calendar's own `onClose={() => setSelected(null)}` and
  // EventModal's usage below) — that only fires on a real user-initiated
  // close, never on Strict Mode's internal remount cycle, so there's no
  // window left for it to race this write.
  useState(() => {
    window.location.hash = `events/${eventShortCode(url)}`;
  });

  // React 19 Strict Mode (dev only) runs this effect twice (mount → cleanup
  // → mount) before settling. Fourvenues' loader script isn't idempotent —
  // re-running it creates a SECOND real iframe rather than reusing the
  // first, confirmed live: two <iframe> elements both loading the same
  // URL. Gating the effect body on a ref stops the double injection.
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    const container = document.getElementById(mountId);
    if (!container) return;

    const iframeContainer = document.createElement("div");
    iframeContainer.id = "fourvenues-iframe";
    container.appendChild(iframeContainer);

    // Same scrollIntoView hijack workaround as the old full-listing embed
    // (see git history / events-section.tsx): Fourvenues' script calls
    // `#fourvenues-iframe-anchor`.scrollIntoView() once its iframe loads,
    // which would yank the whole page down to this modal's mount point —
    // jarring here since the modal is already open and in view. Restored
    // after a fixed window rather than on this component's own unmount,
    // matching the original embed's approach — the override only needs to
    // outlive the iframe's initial load.
    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (this: Element, ...args) {
      if (this.id === "fourvenues-iframe-anchor") return;
      return nativeScrollIntoView.apply(this, args as never);
    };
    const restoreScrollIntoViewTimeout = setTimeout(() => {
      Element.prototype.scrollIntoView = nativeScrollIntoView;
    }, 8000);

    const script = document.createElement("script");
    script.src = "https://www.fourvenues.com/assets/iframe/pocco-club/events?theme=dark";
    container.appendChild(script);

    return () => {
      clearTimeout(restoreScrollIntoViewTimeout);
      Element.prototype.scrollIntoView = nativeScrollIntoView;
    };
  }, [url, mountId]);

  return <div id={mountId} style={{ minHeight: 400 }} />;
}

const pillTagStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#f5f5f5",
  background: "rgba(255,255,255,0.08)",
  padding: "4px 12px",
  borderRadius: 999,
};
