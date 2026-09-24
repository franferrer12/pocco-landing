"use client";

// Section 8 — "EL DÍA ANTES TAMBIÉN ES TUYO.": the day-before setup access
// (2-3h the day before to bring decoration/furniture/drinks in). The
// narrative brief calls this out specifically as a real commercial
// advantage that deserved much more prominence than a buried condition at
// the bottom of the original mockup — given its own full section here
// instead, framed as "SIN PRISAS. SIN IMPROVISAR." rather than fine print.

import { RENTAL_ACCESS_ITEMS } from "@/lib/rental-rooms";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function RentalAccess() {
  return (
    <section style={{ background: "#000", padding: "4vh 6vw 10vh" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 28,
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        <div
          style={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "radial-gradient(circle at 20% 80%, rgba(226,18,18,0.14), transparent 60%)",
          }}
        >
          <h3
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: "0 0 1.2rem",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            SIN PRISAS.
            <br />
            <span style={{ color: "#e21212" }}>SIN IMPROVISAR.</span>
          </h3>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 15,
              lineHeight: 1.7,
              color: "rgba(245,245,245,0.65)",
              margin: 0,
              maxWidth: 360,
            }}
          >
            2 a 3 horas de acceso previo el día anterior a tu evento, para
            que llegues con todo montado, sin prisas ni imprevistos de
            última hora.
          </p>
        </div>

        <div
          style={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.8rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {RENTAL_ACCESS_ITEMS.map((item) => (
            <div key={item.title} style={{ display: "flex", gap: 16 }}>
              <span
                style={{
                  flexShrink: 0,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#e21212",
                  marginTop: 6,
                }}
              />
              <div>
                <p style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: "#f5f5f5", margin: "0 0 0.3rem" }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.6, color: "rgba(245,245,245,0.55)", margin: 0 }}>
                  {item.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
