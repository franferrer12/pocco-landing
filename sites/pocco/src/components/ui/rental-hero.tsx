"use client";

// Hero for /alquiler-sala — section 1 of the rental-page redesign ("POCCO.
// PERO TUYO."), following the narrative brief the site owner approved:
// sell desire first (no room names, no capacity, no price yet — that all
// comes later, in dedicated sections), in POCCO's own black+red/oversized-
// type language rather than a generic "corporate venue rental" look.
//
// Background is a real photo of the club full and lit red (pocco-sala-
// llena.jpg — pulled from a rental-page mockup the owner shared, itself
// sourced from the club's own event photography), not one of the six
// gallery-section.tsx photos already used elsewhere on the site — the
// owner confirmed this higher-quality shot specifically for this hero.
// A heavy dark gradient overlay keeps the oversized headline legible over
// it, same technique the reference mockup's own hero used (a red gradient
// backdrop there; a real photo here, since we have one).

import Image from "next/image";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* Same inline film-grain technique as the homepage hero (jelly-fish.tsx's
   own GRAIN constant) — a faint noise overlay for texture over the photo,
   consistent with the rest of the site's own look instead of a flat
   gradient alone. */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function RentalHero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        padding: "18vh 6vw 8vh",
      }}
    >
      <Image
        src="/assets/alquiler/pocco-sala-llena.jpg"
        alt="Interior de POCCO Club lleno de gente, con el cartel de neón POCCO Club"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 40%" }}
      />

      {/* Heavy bottom-weighted gradient — darkest where the headline sits,
          fading up toward the top of the frame so the photo still reads
          as a real, recognizable room rather than being crushed flat. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.75) 32%, rgba(5,5,5,0.25) 62%, rgba(5,5,5,0.15) 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${GRAIN}")`,
          opacity: 0.05,
          mixBlendMode: "soft-light",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(11px, 1.3vw, 13px)",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#e21212",
            margin: "0 0 1.4rem",
          }}
        >
          POCCO Club · Alquiler de sala
        </p>

        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(52px, 11vw, 128px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
          }}
        >
          POCCO.
          <br />
          PERO TUYO.
        </h1>

        <p
          style={{
            fontFamily: BODY,
            fontSize: "clamp(15px, 1.7vw, 19px)",
            lineHeight: 1.6,
            color: "rgba(245,245,245,0.75)",
            maxWidth: 480,
            margin: "1.8rem 0 0",
          }}
        >
          Cumpleaños. Fiestas privadas. Empresa. O porque sí.
        </p>

        <a
          href="#salas"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: "3rem",
            fontFamily: DISPLAY,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#f5f5f5",
            textDecoration: "none",
            borderBottom: "1px solid rgba(245,245,245,0.4)",
            paddingBottom: 4,
          }}
        >
          Ver las salas ↓
        </a>
      </div>
    </section>
  );
}
