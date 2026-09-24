"use client";

// Section 6 — "YA VIENE CON TODO ESTO.": what's included in every rental
// (same for both rooms — limpieza/vasos/hielo, per the site owner's own
// dossier). Big typography rather than the white icon-cards the original
// mockup used, per the narrative brief's own note that POCCO "needs more
// typography than icons."

import { RENTAL_INCLUDES } from "@/lib/rental-rooms";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function RentalIncludes() {
  return (
    <section style={{ background: "#000", padding: "4vh 6vw 12vh" }}>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          color: "#f5f5f5",
          textAlign: "center",
          margin: "0 0 6vh",
          letterSpacing: "-0.02em",
        }}
      >
        YA VIENE CON TODO ESTO.
      </p>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {RENTAL_INCLUDES.map((item, i) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "0.6rem 1.6rem",
              padding: "2rem 0",
              borderTop: i === 0 ? "1px solid rgba(255,255,255,0.1)" : undefined,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 900,
                color: "#e21212",
                margin: 0,
                letterSpacing: "-0.02em",
                flexShrink: 0,
              }}
            >
              {item.title.toUpperCase()}.
            </p>
            <p
              style={{
                fontFamily: BODY,
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(245,245,245,0.55)",
                margin: 0,
                maxWidth: 380,
              }}
            >
              {item.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
