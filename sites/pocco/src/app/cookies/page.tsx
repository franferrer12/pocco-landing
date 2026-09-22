import Link from "next/link";
import type { Metadata } from "next";
import CookiesPolicyContent from "@/components/ui/cookies-policy-content";

// Same wrapper pattern as /privacidad and /aviso-legal — the actual legal
// text lives in CookiesPolicyContent, shared with the footer's popup modal
// (see footer.tsx), this page just adds full-page chrome for direct links,
// SEO and sharing.

export const metadata: Metadata = {
  // Root layout's title template appends " — POCCO Club" automatically.
  title: "Política de Cookies",
  description: "Política de cookies de POCCO CLUB (pocco.club).",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

export default function CookiesPage() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
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

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "14vh 6vw 10vh" }}>
        <CookiesPolicyContent />
      </div>
    </main>
  );
}
