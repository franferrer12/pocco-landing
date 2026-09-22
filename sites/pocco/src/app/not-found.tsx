import Link from "next/link";

// Branded 404 — same fixed-header "← POCCO CLUB" pattern the legal pages
// use (aviso-legal/page.tsx, privacidad/page.tsx, cookies/page.tsx), so a
// broken/mistyped link still reads as part of the site instead of falling
// through to Next's bare, unbranded default 404.

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

export default function NotFound() {
  return (
    <main
      style={{
        background: "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "2.4vh 6vw",
          background: "linear-gradient(to bottom, #000 40%, transparent)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: DISPLAY,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#f5f5f5",
            textDecoration: "none",
          }}
        >
          ← POCCO CLUB
        </Link>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6vh 6vw",
        }}
      >
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
          404
        </p>
        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          Esta noche no está.
        </h1>
        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            color: "rgba(245,245,245,0.55)",
            maxWidth: 420,
            margin: "1.2rem 0 2.4rem",
          }}
        >
          La página que buscas no existe o se ha movido.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: 999,
            background: "#e21212",
            color: "#f5f5f5",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
