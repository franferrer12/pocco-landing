"use client";

// "Preguntas Frecuentes" — reimplemented from a reference layout (21st.dev's
// "FAQ Chat Accordion" by @anshuman008: a chat-bubble list with a timestamp
// header and a "+" per bubble that expands into an answer bubble underneath)
// in this project's own plain-inline-styles convention. Only the interaction
// pattern and bubble shape are borrowed — copy, colors and typography are
// POCCO's own.

import { useState } from "react";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "¿Hay edad mínima para entrar?",
    a: "Depende de la sesión. La edad mínima aparece siempre indicada en cada evento. Si la sesión es +18, recuerda traer tu DNI físico. Sin él, no hay noche.",
  },
  {
    q: "¿Hay código de vestimenta?",
    a: "No somos de poner demasiadas reglas, pero cuida el look. Evita chándal, ropa deportiva o de playa. Ven bien. El resto lo pones tú.",
  },
  {
    q: "¿Cómo compro entradas o reservo mesa?",
    a: "Las entradas se compran directamente desde la sección Eventos. Si quieres reservado VIP, escríbenos por WhatsApp y te ayudamos a preparar la noche.",
  },
  {
    q: "¿Puedo apuntarme a una lista o guest list?",
    a: "Depende del evento. Cuando haya lista o guest list disponible, aparecerá directamente en la ficha del evento junto con sus condiciones.",
  },
  {
    q: "¿A qué hora abre y cierra POCCO?",
    a: "Cada noche tiene su horario. Lo encontrarás siempre en el cartel y en la información de cada evento. Échale un vistazo antes de venir.",
  },
  {
    q: "¿Dónde está el club y hay parking cerca?",
    a: "Estamos en C/ Guadassuar, 4 · Alzira. En la sección Ubicación puedes abrir el mapa y venir directo. Hay distintas zonas de aparcamiento cerca del club.",
  },
  {
    q: "¿Se puede pagar con tarjeta?",
    a: "Sí. Puedes pagar con tarjeta tanto en taquilla como dentro del club. También aceptamos efectivo.",
  },
  {
    q: "¿Hay guardarropa y cuesta algo?",
    a: "Sí. Tenemos guardarropa dentro del club por un pequeño importe. Deja lo que sobra y entra cómodo.",
  },
];

function FaqBubble({ item, reversed }: { item: FaqItem; reversed: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "relative",
          alignSelf: reversed ? "flex-end" : "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: "min(560px, 88%)",
          textAlign: "left",
          background: "#1c1c1c",
          color: "#f0f0f0",
          border: open ? "1px solid #e21212" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: "12px 16px",
          cursor: "pointer",
          transition: "border-color 0.2s ease",
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(14px, 1.6vw, 16px)",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {item.q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: open ? "#e21212" : "rgba(240,240,240,0.55)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease, color 0.2s ease",
          }}
        >
          +
        </span>
      </button>

      {/* Answer bubble — a second, lighter-weight bubble right underneath the
          question's, like a reply in the same thread, rather than an
          in-place expand of the question bubble itself. Pinned to the
          OPPOSITE edge from its own question bubble (question left →
          answer right, question right → answer left), so each pair reads
          as two sides of a conversation instead of the answer just trailing
          along the same edge as its question. */}
      <div
        style={{
          display: "flex",
          justifyContent: reversed ? "flex-start" : "flex-end",
          maxHeight: open ? 240 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.25s ease",
        }}
      >
        <div
          style={{
            maxWidth: "min(520px, 82%)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: "12px 16px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(13px, 1.4vw, 15px)",
            lineHeight: 1.55,
            color: "rgba(240,240,240,0.7)",
          }}
        >
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="faq-section"
      style={{
        position: "relative",
        background: "#000",
        padding: "12vh 6vw 14vh",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Same red-kicker-over-white-title pattern as Eventos ("PRÓXIMOS
            EVENTOS") and Galería ("GALERÍA") — this section had none of
            POCCO's own #e21212 accent anywhere, which is what made it read
            as a generic imported component instead of part of this site.
            Centered (unlike Eventos/Galería's left-aligned header) since
            this section's own content below is itself a left/right
            alternating chat thread, not a left-aligned block — a centered
            header reads better as a standalone title over that shape. */}
        <div style={{ textAlign: "center" }}>
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
            PREGUNTAS FRECUENTES
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
            ANTES DE SALIR
          </h2>

          <p
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 13,
              color: "rgba(245,245,245,0.4)",
              margin: "1rem 0 2.5rem",
            }}
          >
            Todo lo que necesitas saber antes de tu próxima noche en POCCO
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQS.map((item, i) => (
            <FaqBubble key={i} item={item} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .faq-section {
            padding-bottom: 6vh !important;
          }
        }
      `}</style>
    </section>
  );
}
