"use client";

// Section 2 of the rental-page narrative — "TÚ PONES EL MOTIVO." Replaces
// the original three feature cards (comuniones/cumpleaños/empresa) with
// the brief's own oversized-type statement + a looping word ticker, same
// mechanism the homepage's EventsSection already uses for its own ticker
// (events-section.tsx's EventsTicker) — reused as a pattern, not a shared
// component, since the two tickers have unrelated word lists and this one
// needs its own reversed-motion variant. Sits at #salas (the Hero's own
// "Ver las salas ↓" anchor moves here from the old EVENT_TYPES section).

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

const MOTIVES = [
  "CUMPLEAÑOS",
  "COMUNIONES",
  "BAUTIZOS",
  "EMPRESA",
  "FIESTA PRIVADA",
  "DESPEDIDAS",
  "PORQUE SÍ",
];

function MotiveTicker({ reverse }: { reverse?: boolean }) {
  const words = [...MOTIVES, ...MOTIVES, ...MOTIVES];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `${reverse ? "rental-statement-ticker-reverse" : "rental-statement-ticker"} 26s linear infinite`,
          willChange: "transform",
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: "clamp(32px, 7vw, 84px)",
              letterSpacing: "-0.02em",
              color: i % MOTIVES.length === 0 ? "#e21212" : "rgba(245,245,245,0.15)",
              whiteSpace: "nowrap",
              padding: "0 1.2rem",
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RentalStatement() {
  return (
    <section id="salas" style={{ background: "#000", padding: "14vh 0 14vh", overflow: "hidden" }}>
      <style>{`
        @keyframes rental-statement-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes rental-statement-ticker-reverse {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 6vw", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(38px, 7vw, 84px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          TÚ PONES
          <br />
          EL MOTIVO.
        </h2>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(20px, 3.4vw, 40px)",
            fontWeight: 800,
            color: "#e21212",
            margin: "0.6rem 0 0",
            letterSpacing: "-0.02em",
          }}
        >
          Nosotros, el resto.
        </p>
      </div>

      <div style={{ marginTop: "6vh", display: "flex", flexDirection: "column", gap: "1.6vh" }}>
        <MotiveTicker />
        <MotiveTicker reverse />
      </div>
    </section>
  );
}
