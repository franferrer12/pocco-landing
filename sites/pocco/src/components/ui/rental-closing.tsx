"use client";

// Section 10 — "¿QUÉ CELEBRAMOS?": the closing conversion moment, back to
// POCCO red like the narrative brief asks ("volvemos al rojo POCCO, casi
// como el cierre de la home"). Wraps the same RentalRequestForm built
// earlier (nombre/tipo de evento/fecha/invitados/teléfono/notas → composes
// and opens a WhatsApp message) rather than a new 3-field form — the brief
// suggested a shorter fecha/personas/sala form, but the existing one
// already captures a real structured lead and rebuilding a second, thinner
// form here would just mean two different lead-capture flows on the same
// page. Visual treatment is what changes here, not the mechanism.

import RentalRequestForm from "./rental-request-form";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function RentalClosing() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "10vh 6vw 12vh",
        background:
          "radial-gradient(circle at 20% 18%, rgba(210,20,20,0.5), transparent 26%), linear-gradient(118deg, #C81A0E 0%, #9A0C08 28%, #6A0606 55%, #3A0404 78%, #150202 100%)",
      }}
    >
      <p
        aria-hidden
        style={{
          position: "absolute",
          right: "-4%",
          bottom: "-10%",
          fontFamily: DISPLAY,
          fontSize: "min(34vw, 480px)",
          fontWeight: 900,
          letterSpacing: "-0.08em",
          lineHeight: 0.8,
          color: "rgba(255,255,255,0.04)",
          margin: 0,
          pointerEvents: "none",
        }}
      >
        POCCO
      </p>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(245,245,245,0.75)",
            margin: "0 0 1.2rem",
          }}
        >
          POCCO Club Alzira
        </p>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(44px, 8vw, 96px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
          }}
        >
          ¿QUÉ
          <br />
          CELEBRAMOS?
        </h2>
        <p
          style={{
            fontFamily: BODY,
            fontSize: "clamp(15px, 1.7vw, 18px)",
            lineHeight: 1.65,
            color: "rgba(245,245,245,0.85)",
            maxWidth: 460,
            margin: "1.6rem auto 4vh",
          }}
        >
          Cuéntanos la fecha, el horario y el número de personas. Te
          preparamos el presupuesto en menos de 24 horas, sin compromiso.
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.28)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 28,
            padding: "2.2rem",
          }}
        >
          <RentalRequestForm />
        </div>
      </div>
    </section>
  );
}
