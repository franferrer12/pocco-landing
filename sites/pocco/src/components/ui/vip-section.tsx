"use client";

// "Reservados VIP" — reimplemented from a reference layout (a "Hero10"
// component: centered title+description+CTA stacked above a full-width
// fanned 3-image collage) in this project's own plain-inline-styles
// convention. Only the layout shape is borrowed — copy, colors, typography
// and the CTA are POCCO's own. Real gallery photos (already in
// public/assets/gallery/) stand in for the reference's own image props
// rather than new assets, per request. Only one CTA (WhatsApp) is used —
// the reference's secondary button is dropped rather than left pointing
// nowhere.
//
// First pass had this as a 2-column side-by-side grid with a small boxed
// collage — compared against the reference screenshot, that's wrong on
// both axes: the reference stacks everything in one centered column, and
// the collage spans nearly the section's full width with large, barely-
// tilted (5-8°), edge-to-edge overlapping photos, not three small tiles
// floating in their own box.

import Image from "next/image";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

const IMAGES = [
  "/assets/gallery/pocco-02.webp",
  "/assets/gallery/pocco-08.webp",
  "/assets/gallery/pocco-05.webp",
];

// Club's real WhatsApp Business short link — this format (wa.me/message/…)
// is generated from Meta Business and doesn't take a `?text=` query param
// the way a plain wa.me/<number> link does; any prefilled message is
// configured on Meta's side instead.
const WHATSAPP_URL = "https://wa.me/message/A3BHIH24Q6M4L1";

export default function VipSection() {
  return (
    <section
      id="vip"
      style={{
        position: "relative",
        background: "#000",
        padding: "16vh 6vw 4vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(12px, 1.4vw, 14px)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#e21212",
            margin: "0 0 1rem",
          }}
        >
          RESERVADOS VIP
        </p>

        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(26px, 4.4vw, 56px)",
            fontWeight: 800,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}
        >
          Se llenan rápido.
          <br />
          <span style={{ whiteSpace: "nowrap" }}>
            Tú no te quedes <span style={{ color: "#e21212" }}>fuera</span>.
          </span>
        </h2>

        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.6,
            color: "rgba(245,245,245,0.55)",
            maxWidth: 480,
            margin: "1.6rem 0 0",
          }}
        >
          Mesa, botellas y tu gente.
          <br />
          El resto ya lo monta POCCO.
        </p>

        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(245,245,245,0.35)",
            margin: "0.3rem 0 0",
          }}
        >
          Las mejores mesas vuelan.
        </p>
      </div>

      {/* Full-width fanned 3-photo collage — large, edge-to-edge,
          overlapping photos with a subtle tilt, matching the reference's
          own "image fan" composition rather than three small tiles boxed
          into a corner. */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 380,
          margin: "7vh auto 0",
          height: "clamp(240px, 26vw, 300px)",
        }}
      >
        {IMAGES.map((src, i) => {
          const rotation = i === 0 ? -8 : i === 2 ? 8 : 0;
          const offsetX = i === 0 ? "-30%" : i === 2 ? "30%" : "0%";
          return (
            <div
              key={src}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "46%",
                aspectRatio: "3 / 4",
                transform: `translate(-50%, -50%) translateX(${offsetX}) rotate(${rotation}deg)`,
                zIndex: i === 1 ? 2 : 1,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={src}
                alt="Zona VIP en POCCO"
                fill
                quality={90}
                sizes="(max-width: 640px) 45vw, 200px"
                style={{ objectFit: "cover" }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "5vh" }}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 26px",
            borderRadius: 999,
            background: "#e21212",
            color: "#f5f5f5",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.01em",
            textDecoration: "none",
          }}
        >
          Asegurar mi mesa
        </a>
      </div>

      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(13px, 1.6vw, 16px)",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "rgba(245,245,245,0.3)",
          textAlign: "center",
          margin: "2vh 0 0",
        }}
      >
        F*CKING POCCO, C*BRÓN.
        <br />
        THE CLUB.
      </p>
    </section>
  );
}
