"use client";

import { useEffect, useRef, useState } from "react";
import { BentoGrid, type BentoItem } from "./bento-grid";
import ChromaVideo from "./chroma-video";

/**
 * Próximos Eventos — embeds Fourvenues' own event-list widget (the ticketing
 * provider POCCO is migrating to; Fourvenues also offers a separate calendar
 * widget, not used here) rather than a hand-built event list: the widget owns
 * the event data, availability and checkout, so this section is just the
 * dark/red-branded frame around it.
 *
 * The <script> is inserted manually into this exact DOM position via a ref,
 * NOT via next/script — Next.js's Script component relocates scripts to
 * the end of <body> regardless of where it sits in JSX, and third-party
 * widgets like this one commonly use `document.currentScript` to find their
 * own <script> tag and mount right there (the same trick document.write()
 * relies on). Moving the tag breaks that.
 *
 * Fourvenues' widget appears to validate the embedding origin and refuses to
 * mount on localhost (confirmed: the script loads with no console error, but
 * never populates the container) — it will only render for real once this is
 * live on pocco.club. To keep working on the section's design locally without
 * that dependency, a placeholder card layout renders as a fallback whenever
 * the real widget hasn't populated the container after a short grace period.
 */
export default function EventsSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [widgetMounted, setWidgetMounted] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const script = document.createElement("script");
    script.src = "https://www.fourvenues.com/assets/iframe/pocco-club/events";
    mount.appendChild(script);

    // Fourvenues' widget injects real content (an iframe, typically) into this
    // container once it mounts — if nothing shows up beyond our own <script>
    // tag within a few seconds, assume it was rejected (e.g. localhost origin)
    // and fall back to the placeholder instead of leaving an empty section.
    const checkInterval = setInterval(() => {
      if (mount.children.length > 1) {
        setWidgetMounted(true);
        clearInterval(checkInterval);
      }
    }, 300);
    const fallbackTimeout = setTimeout(() => {
      if (mount.children.length <= 1) setShowFallback(true);
      clearInterval(checkInterval);
    }, 3000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(fallbackTimeout);
      mount.innerHTML = "";
    };
  }, []);

  return (
    <section
      id="eventos"
      style={{
        position: "relative",
        padding: "18vh 6vw 12vh",
        background: "#000",
      }}
    >
      <style>{`
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
            color: "#c73a3f",
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

      {/* Fourvenues mounts its widget directly into whichever element holds
          its own <script> tag, so the ref-inserted script must live inside
          this same container rather than as a sibling. Hidden (not removed)
          once the fallback shows, so the widget can still take over the
          moment it actually mounts (e.g. after a later origin check). */}
      <div
        ref={mountRef}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: showFallback && !widgetMounted ? "none" : "block",
        }}
      />

      {showFallback && !widgetMounted && <EventsPlaceholder />}
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
              color: i % words.length === 0 ? "#c73a3f" : "rgba(245,245,245,0.5)",
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

/**
 * Local-dev-only stand-in for the Fourvenues widget (see above) — a bento-style
 * grid (2 cards on top, 3 below, matching the layout the user referenced from
 * 21st.dev's "Bento" component) in the same dark/red visual language as the
 * rest of the hero, purely so the section's layout/spacing can be designed and
 * reviewed without a live pocco.club deployment. Swapped out automatically by
 * the real widget wherever it can actually mount.
 */
function EventsPlaceholder() {
  const placeholderEvents: BentoItem[] = [
    {
      tag: "Viernes",
      title: "Noche Pocco",
      description: "La previa se queda corta. Aquí empieza lo bueno.",
      image: "/assets/hero-main.jpg",
      imagePosition: "20% 30%",
    },
    {
      tag: "Sábado",
      title: "Fin de semana sin frenos",
      description: "DJ en cabina, gente que sí sabe salir. Sin excusas.",
      image: "/assets/hero-main.jpg",
      imagePosition: "80% 60%",
    },
    {
      tag: "Especial",
      title: "Guest DJ",
      description: "Line-up sorpresa, solo para los que llegan pronto.",
      image: "/assets/hero-main.jpg",
      imagePosition: "50% 10%",
    },
    {
      tag: "Reservas",
      title: "Mesas VIP",
      description: "Tu grupo, tu espacio, tu noche.",
      image: "/assets/hero-main.jpg",
      imagePosition: "10% 80%",
    },
    {
      tag: "Todas las noches",
      title: "La resaca vale la pena",
      description: "Aquí no se viene a dormir.",
      image: "/assets/hero-main.jpg",
      imagePosition: "90% 40%",
    },
  ];

  return (
    <div>
      <p
        style={{
          textAlign: "center",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          color: "rgba(245,245,245,0.35)",
          marginBottom: "3vh",
        }}
      >
        VISTA PREVIA LOCAL — el listado real de Fourvenues se carga en pocco.club
      </p>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <BentoGrid items={placeholderEvents} />
      </div>
    </div>
  );
}
