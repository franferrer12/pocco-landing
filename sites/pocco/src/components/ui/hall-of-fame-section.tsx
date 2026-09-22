"use client";

// "Hall of Fame": a title + description sitting above an infinite
// horizontal marquee of tilted event posters — reimplemented from a
// reference layout (a generic shadcn/Tailwind "AnimatedMarqueeHero"
// component briefed by the user) from scratch in this project's own
// plain-inline-styles convention, since this codebase has no
// Tailwind/shadcn/cn() utility. The tagline pill and CTA button from that
// original reference were dropped — this section doesn't need either.
// Description copy is still placeholder text.

import ChromaVideo from "./chroma-video";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

/* Real Hall of Fame pieces only — Alonso Chover's, Juanki's, Mitch Van
   Staveren's, Miguel Roma's, and Jaime Bermejo's event posters, used as-is
   (full poster design, not cropped portraits; same 1122×1402 template every
   time). The Galería placeholder photos that used to fill out the rest of
   the marquee are removed now that there are enough real posters — add
   more artist posters here as they come in rather than reintroducing
   generic club photos as filler. */
const IMAGES = [
  "/assets/hall-of-fame/alonso-chover.png",
  "/assets/hall-of-fame/juanki.png",
  "/assets/hall-of-fame/mitch-van-staveren.png",
  "/assets/hall-of-fame/miguel-roma.png",
  "/assets/hall-of-fame/jaime-bermejo.png",
];

export default function HallOfFameSection() {
  // Duplicated once so the marquee can loop from -50% to 0% seamlessly —
  // the visible track is always some window of [originals, originals],
  // so the seam between the two copies is never visibly different from any
  // other point in the loop.
  const track = [...IMAGES, ...IMAGES];

  return (
    <section
      id="hall-of-fame"
      style={{
        position: "relative",
        background: "#000",
        padding: "3vh 6vw 10vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(40px, 6.5vw, 80px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          HALL OF FAME
        </h2>

        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.5,
            color: "rgba(245,245,245,0.6)",
            maxWidth: 560,
            margin: "1.5rem 0 0",
          }}
        >
          No todas las noches se recuerdan.
          <br />
          No todos los nombres se olvidan.
          <br />
          Bienvenidos al Hall of Fame de POCCO.
        </p>
      </div>

      {/* Infinite horizontal marquee, tilted-card "scattered polaroids"
          treatment — top/bottom edges feathered via mask so cards fade in
          and out of the section rather than clipping hard.
          Reported bug: in a desktop browser's mobile emulation mode, the
          marquee visibly jumped back near the start of the loop instead of
          reaching the later posters — plain desktop mode didn't show it. A
          first fix attempt assumed a mobile-GPU compositing issue (forcing
          a compositor layer via isolation+willChange) and did NOT fix it.
          Measuring the track's actual transform over time in that same
          emulation mode showed the real cause: framer-motion's `animate`
          prop drives `x` from JS on every animation frame (it's not a CSS
          animation), and Chrome's device-emulation mode commonly enables
          CPU throttling alongside the viewport resize to approximate real
          phone hardware. Under that throttling, the measured speed came
          out ~10x slower than the configured 40s/track-width should give,
          AND a later measurement caught the transform value jumping
          backward between two samples — consistent with framer-motion's
          JS-driven timer producing an inconsistent elapsed-time reading
          when frames are being dropped that heavily, especially combined
          with repeat:Infinity's wrap logic. Switching to a plain CSS
          @keyframes animation moves the actual per-frame math onto the
          browser's own compositor thread, which keeps running independently
          of JS main-thread throttling — immune to this class of bug
          entirely, not just less likely to hit it. */}
      <div
        style={{
          marginTop: "8vh",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)",
          overflow: "hidden",
        }}
      >
        <div
          className="hof-marquee-track"
          style={{ display: "flex", gap: "1.2rem", width: "max-content" }}
        >
          {track.map((src, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                flexShrink: 0,
                width: 190,
                // 4:5 matches the real posters/photos (the Alonso Chover
                // poster is 1122×1402 ≈ 0.80) closer than the previous 3:4
                // (0.75), so less of the poster's own edges — the ticket
                // link, the signature — get cropped by backgroundSize:cover.
                aspectRatio: "4 / 5",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                transform: `rotate(${i % 2 === 0 ? -3 : 4}deg)`,
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>
      </div>

      {/* Looping 3D club-map animation, sitting directly above the
          signature — moved here from Galería (where it used to float over
          the photo grid) per request. Same ChromaVideo treatment: the
          source clip's own background is solid near-black, which reads as
          an obvious opaque rectangle once placed over anything but flat
          #000, so it's keyed to real transparency rather than left as a
          plain <video>. threshold/feather are tight (4/4, not the
          default 24/20) because sampling this clip found its own dark
          walls/shadows down to luminance ~2 — the default ramp would have
          keyed those out too, washing the map out instead of only losing
          its actual background. */}
      <div style={{ maxWidth: 640, margin: "9vh auto 0" }}>
        <ChromaVideo
          src="/assets/hall-of-fame/mapa-pocco.mp4"
          threshold={4}
          feather={4}
          style={{ width: "100%", aspectRatio: "1138 / 640" }}
        />
      </div>

      <style>{`
        @keyframes hof-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hof-marquee-track {
          animation: hof-marquee-scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
