"use client";

// Cookie consent banner — gates Google Analytics (GA4) and Microsoft
// Clarity behind an explicit Accept/Reject choice, since both are
// third-party analytics cookies requiring prior consent under RGPD/LSSI,
// not something that can just load unconditionally on page view. Matches
// what the published Política de Cookies (cookies-policy-content.tsx)
// promises: "cuando se instalen herramientas de análisis... se habilitará
// un mecanismo de consentimiento previo a su instalación" — this IS that
// mechanism, added at the same time analytics itself was (re)introduced
// after the WordPress→Next.js migration, so the two ship together instead
// of analytics going live ahead of the consent gate it depends on.
//
// The choice is stored in localStorage (not a cookie itself — no need for
// the consent-storage mechanism to itself require consent) and read once
// on mount; a per-viewer preference, not something that needs to sync
// across devices or be readable server-side.

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "pocco-cookie-consent";
// Real values confirmed from the pre-migration WordPress site's own
// installed scripts (backups/pre-nextjs-migration/index.html) — same
// GA4 property (475752389) and Clarity project, kept rather than creating
// new ones, so historical data continues under the same IDs instead of
// starting a second, disconnected property.
const GA_MEASUREMENT_ID = "G-REG9BSZ0G1";
const CLARITY_PROJECT_ID = "vgg76zsg27";

type Consent = "accepted" | "rejected" | null;

function readStoredConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  // Starts null (banner hidden) rather than reading localStorage
  // synchronously — localStorage isn't available during SSR, and guessing
  // "no consent yet" for one frame before this effect corrects it avoids a
  // hydration mismatch between server and client markup.
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent());
    setHydrated(true);
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // If storage is unavailable (private browsing, quota, etc.), the
      // choice still applies for this page view via component state — it
      // just won't persist to the next visit, same as any other
      // localStorage-backed preference on this site (see
      // scroll-position-memory.tsx for the same fallback).
    }
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          {/* Google tag (gtag.js) */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
          {/* Microsoft Clarity */}
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
          </Script>
        </>
      )}

      {hydrated && consent === null && (
        <div
          role="dialog"
          aria-label="Consentimiento de cookies"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 300,
            padding: "16px 6vw",
            background: "#111",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <p
            style={{
              flex: "1 1 320px",
              margin: 0,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 13,
              lineHeight: 1.5,
              color: "rgba(245,245,245,0.7)",
            }}
          >
            Usamos cookies de análisis para entender cómo se usa esta web.
            Puedes aceptarlas o rechazarlas — consulta la{" "}
            <span style={{ textDecoration: "underline" }}>Política de Cookies</span>{" "}
            en el pie de página para más info.
          </p>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => choose("rejected")}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
                color: "#f5f5f5",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Rechazar
            </button>
            <button
              onClick={() => choose("accepted")}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                background: "#e21212",
                color: "#f5f5f5",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
