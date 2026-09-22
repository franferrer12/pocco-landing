"use client";

// "Ubicación" — a real, interactive Google Maps embed (generic "POCCO Club
// Alzira" search query — Google Maps already resolves it to the club's own
// listing, with its address, rating and reviews) shown directly, no click
// needed. First pass gated the map behind a compact "current location"
// card (borrowed from 21st.dev's "Expand Map" component) that expanded on
// click — dropped per request in favor of showing the real map immediately.

import ChromaVideo from "./chroma-video";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=POCCO+Club+Alzira&output=embed";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=POCCO+Club+Alzira";

// Club's real WhatsApp Business short link — same one used in
// vip-section.tsx, kept in sync between both.
const WHATSAPP_URL = "https://wa.me/message/A3BHIH24Q6M4L1";
const INSTAGRAM_URL = "https://www.instagram.com/pocco.club/";

export default function LocationSection() {
  return (
    <section
      id="ubicacion"
      className="location-section"
      style={{
        position: "relative",
        background: "#000",
        padding: "16vh 6vw 1vh",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        {/* Spinning 3D POCCO isotype, same chroma-keyed video used
            elsewhere on the site — sits above the section's own heading.
            Source video is 1920x1080 (16:9), not square — forcing 1:1
            squashed it, so the aspect ratio matches the real file instead. */}
        <div style={{ width: 140, margin: "0 auto 3vh" }}>
          <ChromaVideo
            src="/assets/pocco-logo-3d.mp4"
            style={{ width: "100%", aspectRatio: "16 / 9" }}
          />
        </div>

        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(12px, 1.4vw, 14px)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#e21212",
            margin: "0 0 0.6rem",
          }}
        >
          UBICACIÓN
        </p>

        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(32px, 5.5vw, 56px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          Nos vemos en Alzira.
        </h2>

        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.6,
            color: "rgba(245,245,245,0.6)",
            maxWidth: 480,
            margin: "1.5rem auto 0",
          }}
        >
          Ya sabes dónde empieza la noche.
          <br />
          Toca el mapa y ven a POCCO.
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "5vh auto 0" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            aspectRatio: "16 / 10",
          }}
        >
          <iframe
            src={MAPS_EMBED_SRC}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            // Eager, not lazy: this section sits well below the fold, but
            // the request was specifically for the map to start loading as
            // soon as the page itself loads, not deferred until the user
            // scrolls near it — loading="lazy" was the browser's own
            // IntersectionObserver-based defer doing exactly that.
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de POCCO Club en Alzira"
          />
          <a
            href={MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 999,
              background: "#e21212",
              color: "#f5f5f5",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Cómo llegar
          </a>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: "3vh",
        }}
      >
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 24px",
            borderRadius: 999,
            background: "#f5f5f5",
            color: "#0a0a0a",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          WhatsApp
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 24px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#f5f5f5",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Instagram
        </a>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .location-section {
            padding-top: 8vh !important;
          }
        }
      `}</style>
    </section>
  );
}
