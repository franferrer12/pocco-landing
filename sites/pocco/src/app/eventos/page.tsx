import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/footer";
import { PillNav } from "@/components/ui/pill-nav";
import { SITE_NAME, SITE_URL } from "@/lib/site-data";
import { fetchEvents, madridDateParts } from "@/lib/events";

// /eventos — SEO discovery layer for the club's event listing, sourced live
// from the same Fourvenues API the homepage calendar (events-calendar.tsx)
// already reads, but rendered server-side so each event gets a real,
// crawlable, indexable URL under /eventos/[slug] — something the homepage's
// client-rendered, modal-based calendar can't provide on its own (no page
// per event, nothing for a crawler or a shared link to land on individually).
// This page itself stays a plain index: cards linking out to each event's
// own page, which is where the actual Event schema and full description
// live. Not a replacement for the homepage calendar (which keeps its own
// richer UX — month grid, "this weekend" highlight, in-page checkout modal)
// — this is the version built for search and for sharing a single event.

export const revalidate = 300; // matches fetchEvents' own cache window

export const metadata: Metadata = {
  title: "Próximos Eventos",
  description:
    "Todos los próximos eventos y fiestas en POCCO Club, Alzira (Valencia). Consulta fechas, dress code y consigue tu entrada.",
  alternates: { canonical: "/eventos" },
};

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

const WEEKDAY_LONG = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_LONG = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatEventDate(unixSeconds: number): string {
  const { year, month, day } = madridDateParts(unixSeconds);
  const weekday = WEEKDAY_LONG[new Date(year, month, day).getDay()];
  return `${weekday} ${day} de ${MONTH_LONG[month]}`;
}

export default async function EventosPage() {
  const now = new Date();
  const oneYearOut = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const events = await fetchEvents(now, oneYearOut);

  // Upcoming only, soonest first — a past event has no reason to rank in a
  // listing page whose whole point is "what's on next".
  const upcoming = events
    .filter((e) => e.end * 1000 >= now.getTime())
    .sort((a, b) => a.date - b.date);

  const eventsListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: upcoming.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/eventos/${event.slug}`,
    })),
  };

  return (
    <main>
      {upcoming.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsListJsonLd) }}
        />
      )}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.4vh 2.6vw",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <PillNav />
        </div>
      </header>

      <section style={{ background: "#000", padding: "18vh 6vw 10vh", minHeight: "60vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(12px, 1.4vw, 14px)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#e21212",
              margin: "0 0 0.8rem",
            }}
          >
            {SITE_NAME.toUpperCase()}
          </p>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(32px, 5.5vw, 56px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Próximos eventos
          </h1>
          <p
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.6,
              color: "rgba(245,245,245,0.6)",
              maxWidth: 480,
              margin: "1.4rem auto 0",
            }}
          >
            Toda la agenda de POCCO Club en Alzira. Elige tu noche.
          </p>
        </div>

        {upcoming.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              marginTop: "8vh",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              color: "rgba(245,245,245,0.5)",
            }}
          >
            No hay eventos publicados por ahora. Vuelve pronto.
          </p>
        ) : (
          <div
            style={{
              maxWidth: 1000,
              margin: "8vh auto 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.6rem",
            }}
          >
            {upcoming.map((event) => (
              <Link
                key={event._id}
                href={`/eventos/${event.slug}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#0a0a0a",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
                  <Image
                    src={event.flyer}
                    alt={event.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "1.2rem 1.4rem" }}>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#e21212",
                      margin: "0 0 0.4rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {formatEventDate(event.date)}
                  </p>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: "clamp(17px, 2vw, 20px)",
                      fontWeight: 800,
                      color: "#f5f5f5",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {event.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
