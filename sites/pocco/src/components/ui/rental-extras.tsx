"use client";

// Section 7 — "Y SI QUIERES LIARLA MÁS…": DJ/bebidas extras plus the full
// catering offer (3 real menus with their own item lists, from the site
// owner's own dossier). The narrative brief specifically warned against
// dumping all three menus open by default ("evitamos matar el ritmo
// visual") — each menu shows only its price/pitch up front and expands
// its full item list in an accordion on click, same interaction shape as
// faq-section.tsx's own FaqBubble (click to expand, one panel at a time
// per card) but styled for this page instead of reusing that component,
// since the bubble-chat visual doesn't fit a menu list.

import { useState } from "react";
import { RENTAL_EXTRAS, CATERING_MENUS, CATERING_NOTE, type CateringMenu } from "@/lib/rental-rooms";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

function MenuCard({ menu }: { menu: CateringMenu }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "1.6rem",
        background: "#0a0a0a",
      }}
    >
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#e21212",
          margin: "0 0 1.2rem",
        }}
      >
        {menu.id}
      </p>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(32px, 4.4vw, 44px)",
          fontWeight: 900,
          color: "#f5f5f5",
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {menu.price.toString().replace(".", ",")}€
      </p>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,245,245,0.4)",
          margin: "0.3rem 0 1.4rem",
        }}
      >
        Por persona
      </p>

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: DISPLAY,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#f5f5f5",
        }}
      >
        {open ? "Ocultar menú" : "Ver menú"}
        <span style={{ transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s ease" }}>+</span>
      </button>

      {open && (
        <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {menu.groups.map((group) => (
            <div key={group.label}>
              <p style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, color: "#f5f5f5", margin: "0 0 0.3rem" }}>
                {group.label}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                {group.options.map((opt) => (
                  <li
                    key={opt}
                    style={{
                      fontFamily: BODY,
                      fontSize: 12,
                      color: "rgba(245,245,245,0.55)",
                      paddingLeft: 10,
                      borderLeft: "1px solid rgba(226,18,18,0.3)",
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RentalExtras() {
  return (
    <section style={{ background: "#000", padding: "4vh 6vw 10vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 900,
            color: "#f5f5f5",
            textAlign: "center",
            margin: "0 0 5vh",
            letterSpacing: "-0.02em",
          }}
        >
          ¿Y SI QUIERES LIARLA MÁS?
        </p>

        {/* DJ + bebidas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
            marginBottom: "6vh",
          }}
        >
          {RENTAL_EXTRAS.map((extra) => (
            <div
              key={extra.title}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "1.8rem",
                background: "#0a0a0a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 220,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#e21212",
                    margin: "0 0 1.4rem",
                  }}
                >
                  {extra.label}
                </p>
                <p
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: "clamp(20px, 2.6vw, 26px)",
                    fontWeight: 800,
                    color: "#f5f5f5",
                    margin: "0 0 0.6rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {extra.title}
                </p>
                <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.6, color: "rgba(245,245,245,0.55)", margin: 0 }}>
                  {extra.copy}
                </p>
              </div>
              <p
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#e21212",
                  margin: "1.2rem 0 0",
                }}
              >
                Consulta presupuesto
              </p>
            </div>
          ))}
        </div>

        {/* Catering */}
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(22px, 3.4vw, 32px)",
            fontWeight: 900,
            color: "#f5f5f5",
            textAlign: "center",
            margin: "0 0 0.6rem",
            letterSpacing: "-0.02em",
          }}
        >
          CATERING DESDE 15,50€/PERSONA
        </p>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 13,
            color: "rgba(245,245,245,0.5)",
            textAlign: "center",
            margin: "0 0 3vh",
          }}
        >
          Tres menús personalizables. También puedes traer tu propia comida y bebida.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {CATERING_MENUS.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>

        <p
          style={{
            fontFamily: BODY,
            fontSize: 12,
            lineHeight: 1.65,
            color: "rgba(245,245,245,0.45)",
            textAlign: "center",
            maxWidth: 560,
            margin: "2rem auto 0",
          }}
        >
          {CATERING_NOTE}
        </p>
      </div>
    </section>
  );
}
