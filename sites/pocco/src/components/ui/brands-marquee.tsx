"use client";

// Brand logo marquee — sits right above EventsSection, no heading of its
// own (previously a standalone "Nuestras Marcas" section, then briefly
// folded into VipSection; now its own small piece so it can sit right
// under the hero instead). Real logo images (public/assets/brands/), each
// rendered at a fixed height with width: auto so it keeps its own original
// proportion instead of being stretched to match the others — same CSS
// @keyframes approach as Hall of Fame's poster marquee, not framer-motion's
// JS-driven `animate`, since that measurably desyncs under Chrome's
// mobile-emulation CPU throttling (diagnosed earlier this project via
// direct transform-matrix sampling).

const BRANDS = [
  { name: "POCCO", src: "/assets/brands/M.POCCO.png" },
  { name: "TRENDY", src: "/assets/brands/M.TRENDY.png" },
  { name: "BAILALO", src: "/assets/brands/M.BAILALO.png" },
  { name: "LO NUESTRO", src: "/assets/brands/M.NUESTRO.png" },
  { name: "QUESITOS", src: "/assets/brands/M.QUESITOS.png" },
];

export default function BrandsMarquee({ padding = "1.5vh 0" }: { padding?: string }) {
  const track = [...BRANDS, ...BRANDS];

  return (
    <div
      style={{
        position: "relative",
        background: "#000",
        padding,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          overflow: "hidden",
        }}
      >
        <div
          className="brands-marquee-track"
          style={{ display: "flex", alignItems: "center", gap: "2.5rem", width: "max-content" }}
        >
          {track.map((brand, i) => {
            const logoStyle: React.CSSProperties = {
              // Source PNGs are dark wordmarks meant for a light background
              // (near-black pixels) — invert them to white so they read
              // against this section's black background, then dim slightly.
              height: "clamp(56px, 8vw, 96px)",
              width: "auto",
              filter: "invert(1) brightness(1.6)",
              opacity: 0.75,
              flexShrink: 0,
            };
            // eslint-disable-next-line @next/next/no-img-element -- fixed
            // small logo row inside a CSS-animated marquee; next/image's
            // layout/loader overhead isn't worth it here.
            return <img key={i} src={brand.src} alt={brand.name} style={logoStyle} />;
          })}
        </div>
      </div>

      <style>{`
        @keyframes brands-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .brands-marquee-track {
          animation: brands-marquee-scroll 30s linear infinite;
        }
        .brands-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
