"use client";

// Site footer — minimal centered pattern: a one-line tagline, a muted
// copyright block, then the legal links on their own line separated by "·"
// dividers. No CTAs or big display type beyond the tagline here — those
// already live elsewhere (vip-section.tsx, location-section.tsx). The
// brand logo marquee (brands-marquee.tsx) sits outside this component, in
// page.tsx — once above EventsSection, once again right under
// LocationSection's WhatsApp/Instagram CTAs, just before this footer. The
// three legal links still open in a popup modal instead of navigating
// away, same pattern EventModal (events-calendar.tsx) uses for the
// Fourvenues checkout: an overlay that locks background scroll, a panel
// with its own header bar (title + close button) and internally scrollable
// content — modal titles keep the full names ("Política de Privacidad")
// even though the footer's own link labels are shortened, so the popup
// still matches /privacidad, /aviso-legal and /cookies page titles.

import { useState, useEffect, type ReactNode } from "react";
import PrivacyPolicyContent from "./privacy-policy-content";
import LegalNoticeContent from "./legal-notice-content";
import CookiesPolicyContent from "./cookies-policy-content";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

type LegalDoc = "privacy" | "legal-notice" | "cookies" | null;

export default function Footer() {
  const [openDoc, setOpenDoc] = useState<LegalDoc>(null);

  return (
    <footer
      style={{
        position: "relative",
        background: "#000",
        padding: "12vh 6vw 8vh",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(20px, 2.4vw, 26px)",
          fontWeight: 800,
          letterSpacing: "0.04em",
          color: "#f5f5f5",
          margin: 0,
        }}
      >
        SEE YOU INSIDE.
      </p>

      <p
        style={{
          fontFamily: BODY,
          fontSize: 13,
          color: "rgba(245,245,245,0.4)",
          margin: "1.4rem 0 0",
          lineHeight: 1.5,
        }}
      >
        © {new Date().getFullYear()} POCCOCLUB, S.L.
        <br />
        Todos los derechos reservados.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.6rem",
          marginTop: "1rem",
        }}
      >
        <button onClick={() => setOpenDoc("legal-notice")} style={footerLinkStyle}>
          Aviso Legal
        </button>
        <span style={dividerStyle}>·</span>
        <button onClick={() => setOpenDoc("privacy")} style={footerLinkStyle}>
          Privacidad
        </button>
        <span style={dividerStyle}>·</span>
        <button onClick={() => setOpenDoc("cookies")} style={footerLinkStyle}>
          Cookies
        </button>
      </div>

      {openDoc === "privacy" && (
        <LegalModal title="Política de Privacidad" onClose={() => setOpenDoc(null)}>
          <PrivacyPolicyContent heading={false} />
        </LegalModal>
      )}
      {openDoc === "legal-notice" && (
        <LegalModal title="Aviso Legal" onClose={() => setOpenDoc(null)}>
          <LegalNoticeContent heading={false} />
        </LegalModal>
      )}
      {openDoc === "cookies" && (
        <LegalModal title="Política de Cookies" onClose={() => setOpenDoc(null)}>
          <CookiesPolicyContent heading={false} />
        </LegalModal>
      )}
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(245,245,245,0.55)",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
};

const dividerStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(245,245,245,0.2)",
};

function LegalModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  // Same scroll-lock as EventModal (events-calendar.tsx) — pins the body in
  // place with position:fixed (restoring the exact scroll offset on close)
  // rather than relying on overflow:hidden alone, which doesn't reliably
  // block wheel/touch scroll on every engine (confirmed there already).
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vh 6vw",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 640,
          width: "100%",
          maxHeight: "90vh",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px",
            background: "#111",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 15,
              fontWeight: 700,
              color: "#f5f5f5",
              margin: 0,
            }}
          >
            {title}
          </p>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "#f5f5f5",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "20px 22px 24px", textAlign: "left" }}>{children}</div>
      </div>
    </div>
  );
}
