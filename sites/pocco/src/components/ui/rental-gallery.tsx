"use client";

// Section 9 — "IMAGÍNATE AQUÍ.": a horizontal-scroll photo strip rather
// than a classic grid, per the narrative brief. Uses the same real club
// photos already alt-texted in gallery-section.tsx (no dedicated private-
// event photography exists yet — the site owner confirmed reusing what's
// already there rather than blocking on new photos) plus the rental
// hero's own full-room shot, so the strip isn't just a repeat of three
// tiles.

import Image from "next/image";

const PHOTOS = [
  { src: "/assets/alquiler/pocco-sala-llena.jpg", alt: "Interior de POCCO Club lleno de gente y luces rojas" },
  { src: "/assets/gallery/pocco-03.webp", alt: "Cabina de DJ y equipo de sonido de POCCO Club" },
  { src: "/assets/gallery/pocco-01.webp", alt: "Pista y zona principal de POCCO Club" },
  { src: "/assets/gallery/pocco-08.webp", alt: "Público disfrutando de la noche en POCCO Club" },
  { src: "/assets/gallery/pocco-05.webp", alt: "Entrada de POCCO Club en Alzira" },
];

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

export default function RentalGallery() {
  return (
    <section style={{ background: "#000", padding: "4vh 0 10vh" }}>
      <p
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          color: "#f5f5f5",
          textAlign: "center",
          margin: "0 0 4vh",
          letterSpacing: "-0.02em",
        }}
      >
        IMAGÍNATE AQUÍ.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          padding: "0 6vw 1rem",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            style={{
              position: "relative",
              flexShrink: 0,
              width: "min(78vw, 340px)",
              aspectRatio: "4 / 5",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              scrollSnapAlign: "start",
              // Alternates a slight vertical offset between tiles so the
              // strip reads as a loose collage rather than a rigid row.
              marginTop: i % 2 === 1 ? "2.4vh" : 0,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 78vw, 340px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
