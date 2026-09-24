"use client";

// Section 5 — "¿Cuánto cuesta hacer POCCO tuyo?": the price reveal, kept
// for after the desire/rooms/experience sections per the narrative brief
// ("no price until the visitor is already interested"). Reads the same
// useRentalRoom selection as the rooms/experience sections above it, so
// switching rooms there updates the price shown here without a second
// selector duplicating the same control.

import { RENTAL_ROOMS } from "@/lib/rental-rooms";
import { useRentalRoom } from "./rental-room-context";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function RentalPricing() {
  const { selectedRoom } = useRentalRoom();
  const room = RENTAL_ROOMS.find((r) => r.id === selectedRoom)!;

  return (
    <section style={{ background: "#000", padding: "6vh 6vw 10vh", textAlign: "center" }}>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 900,
          color: "#f5f5f5",
          margin: "0 0 0.4rem",
          letterSpacing: "-0.02em",
        }}
      >
        ¿CUÁNTO CUESTA
      </p>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 900,
          color: "#e21212",
          margin: "0 0 5vh",
          letterSpacing: "-0.02em",
        }}
      >
        HACER {room.id === "pocco" ? "POCCO" : "LO NUESTRO"} TUYO?
      </p>

      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,245,245,0.45)",
          margin: "0 0 0.6rem",
        }}
      >
        Desde
      </p>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(72px, 16vw, 180px)",
          fontWeight: 900,
          color: "#f5f5f5",
          margin: 0,
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
        }}
      >
        {room.pricing.dayPrice}€
        <span
          style={{
            fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: 700,
            color: "rgba(245,245,245,0.4)",
          }}
        >
          /hora
        </span>
      </p>

      <div
        style={{
          maxWidth: 480,
          margin: "5vh auto 0",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 1.6rem", background: "#0a0a0a" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontFamily: DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,245,245,0.4)", margin: "0 0 3px" }}>
              Tarifa diurna
            </p>
            <p style={{ fontFamily: BODY, fontSize: 14, fontWeight: 600, color: "#f5f5f5", margin: 0 }}>
              {room.pricing.dayLabel}
            </p>
          </div>
          <p style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: "#f5f5f5", margin: 0 }}>
            {room.pricing.dayPrice}€
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 1.6rem", background: "#0a0a0a" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontFamily: DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,245,245,0.4)", margin: "0 0 3px" }}>
              Plus nocturnidad
            </p>
            <p style={{ fontFamily: BODY, fontSize: 14, fontWeight: 600, color: "#f5f5f5", margin: 0 }}>
              {room.pricing.nightLabel}
            </p>
          </div>
          <p style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: "#e21212", margin: 0 }}>
            {room.pricing.nightPrice}€
          </p>
        </div>
      </div>

      <p
        style={{
          fontFamily: BODY,
          fontSize: 13,
          lineHeight: 1.6,
          color: "rgba(245,245,245,0.5)",
          maxWidth: 440,
          margin: "1.6rem auto 0",
        }}
      >
        {room.pricing.endNote} El precio exacto se calcula por tu horario. Consúltanos.
      </p>
    </section>
  );
}
