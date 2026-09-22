"use client";

import ChromaVideo from "./chroma-video";
import EventsCalendar from "./events-calendar";

/**
 * Próximos Eventos — month-by-month calendar fed by our own Fourvenues
 * integration (see events-calendar.tsx and /api/events). Previously embedded
 * Fourvenues' own iframe widget directly; replaced so the section can show a
 * real calendar grid (min age, dress code, per-day event list) instead of
 * just Fourvenues' own list/detail views.
 */
export default function EventsSection() {
  return (
    <section
      id="eventos"
      className="events-section"
      style={{
        position: "relative",
        padding: "1vh 6vw 6vh",
        background: "#000",
      }}
    >
      <style>{`
        /* Top padding is small now that BrandsMarquee (with its own
           padding) sits directly above this section and already clears the
           fixed nav pill — this section no longer needs to reserve that
           space itself. On a narrow phone the title's clamp()-based
           font-size still runs larger relative to the viewport, so it gets
           a little more breathing room than desktop, just not the old
           nav-clearing amount. */
        @media (max-width: 640px) {
          .events-section {
            padding-top: 2vh !important;
          }
          /* Stays anchored at the exact same corner (right:0, bottom:0 of
             the title's own wrapper) as desktop — only the size scales, up
             from the 14vw-of-viewport rule (tiny on a narrow phone) to
             22vw-of-viewport, still capped at the same 120px desktop uses so
             it never overshoots the original design's size, just closes the
             gap on small screens. */
          .events-logo-mark {
            width: min(22vw, 120px) !important;
          }
        }
        @keyframes events-logo-spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto 6vh",
          position: "relative",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#e21212",
            marginBottom: "1.2rem",
          }}
        >
          Próximos Eventos
        </p>
        <h2
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif",
            fontSize: "clamp(40px, 8vw, 96px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          NO TE LO
          <br />
          PIERDAS.
        </h2>

        {/* Same 3D isotype as the hero, spun continuously — anchored to the
            same right edge the ticker's rule lines below end at. */}
        <div
          className="events-logo-mark"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "min(14vw, 120px)",
            aspectRatio: "16 / 9",
            animation: "events-logo-spin 12s linear infinite",
          }}
        >
          <ChromaVideo
            src="/assets/pocco-logo-3d.mp4"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      <EventsTicker />

      <EventsCalendar />
    </section>
  );
}

/**
 * Continuous horizontal ticker, same mechanism as the hero's word ring (a
 * looping row of repeated text, marquee-style via CSS translateX) — gives this
 * section the same perpetual motion the hero has instead of sitting dead
 * still between the title and the grid.
 */
function EventsTicker() {
  const words = [
    "ESTO NO ES UN CLUB MÁS",
    "SAL ESTA NOCHE UN POCCO",
    "LA RESACA VALE LA PENA",
    "AQUÍ NO SE VIENE A DORMIR",
    "ERES JOVEN UNA VEZ",
    "MAMÁ HOY SOLO SALGO UN POCCO",
  ];
  const loopText = [...words, ...words, ...words];

  return (
    <div
      style={{
        overflow: "hidden",
        maxWidth: 1100,
        margin: "0 auto 5vh",
        borderTop: "1px solid rgba(245,245,245,0.1)",
        borderBottom: "1px solid rgba(245,245,245,0.1)",
        padding: "1.4vh 0",
      }}
    >
      <style>{`
        @keyframes events-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "events-ticker-scroll 22s linear infinite",
          willChange: "transform",
        }}
      >
        {loopText.map((w, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.25em",
              color: i % words.length === 0 ? "#e21212" : "rgba(245,245,245,0.5)",
              whiteSpace: "nowrap",
              padding: "0 1.5rem",
            }}
          >
            {w} <span style={{ opacity: 0.35 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
