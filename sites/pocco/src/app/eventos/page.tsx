import type { Metadata } from "next";
import Footer from "@/components/ui/footer";
import { PillNav } from "@/components/ui/pill-nav";
import { FourvenuesEventsWidget } from "@/components/ui/fourvenues-events-widget";
import { SITE_NAME, SITE_URL } from "@/lib/site-data";
import { fetchEvents } from "@/lib/events";

// /eventos — deliberately embeds Fourvenues' own full events-listing widget
// (FourvenuesEventsWidget) instead of a listing built from our own API data
// — a conscious choice to keep this page visually/behaviorally distinct
// from /eventos/[slug] (which DOES render its own layout from live API
// data, with its own JSON-LD per event) and from the homepage's own
// EventsCalendar. The ItemList JSON-LD below still points at our own
// /eventos/[slug] URLs, not Fourvenues' — those are the real, indexable,
// crawlable per-event pages; this page's own body is just Fourvenues' UI,
// used here as the on-page browsing/checkout experience.

export const revalidate = 300; // matches fetchEvents' own cache window

export const metadata: Metadata = {
  title: "Próximos Eventos",
  description:
    "Todos los próximos eventos y fiestas en POCCO Club, Alzira (Valencia). Consulta fechas, dress code y consigue tu entrada.",
  alternates: { canonical: "/eventos" },
};

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

export default async function EventosPage() {
  const now = new Date();
  const oneYearOut = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const events = await fetchEvents(now, oneYearOut);

  // Upcoming only, soonest first — used only to build the ItemList JSON-LD
  // below, not rendered as our own cards on this page anymore.
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

        <div style={{ maxWidth: 720, margin: "8vh auto 0" }}>
          <FourvenuesEventsWidget />
        </div>
      </section>

      <Footer />
    </main>
  );
}
