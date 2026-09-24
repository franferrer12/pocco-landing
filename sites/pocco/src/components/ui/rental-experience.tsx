"use client";

// Section 4 of the rental-page narrative — the selected room's own
// "experience" block: its real description, capacity and tagline, reading
// from the same useRentalRoom selection as rental-rooms-section.tsx above
// it. The narrative brief describes this as an immersive sticky-scroll
// photo/label sequence (PISTA. → CABINA. → SONIDO. → ...) — deliberately
// not built that way yet: there's no real per-area photography (pista vs.
// cabina vs. sound rig) to drive it, only the one full-room shot POCCO
// has and no photo at all for Lo Nuestro, so a literal sticky-scroll
// sequence would either fake distinct areas from one photo or sit empty
// for Lo Nuestro. Built instead as a single large statement block with
// the room's own real copy, structurally ready to become the fuller
// sticky-scroll sequence once per-area photos exist for both rooms.

import Image from "next/image";
import { RENTAL_ROOMS } from "@/lib/rental-rooms";
import { useRentalRoom } from "./rental-room-context";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function RentalExperience() {
  const { selectedRoom } = useRentalRoom();
  const room = RENTAL_ROOMS.find((r) => r.id === selectedRoom)!;

  return (
    <section style={{ background: "#000", padding: "4vh 6vw 10vh" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          minHeight: 460,
          display: "flex",
          alignItems: "flex-end",
          background: room.photo ? undefined : "#0a0a0a",
          border: room.photo ? undefined : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {room.photo && (
          <>
            <Image
              src={room.photo.src}
              alt={room.photo.alt}
              fill
              sizes="(max-width: 1100px) 100vw, 1100px"
              style={{ objectFit: "cover" }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.4) 45%, rgba(5,5,5,0.1) 100%)",
              }}
            />
          </>
        )}

        {!room.photo && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(20px, 3vw, 32px)",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(245,245,245,0.15)",
                margin: 0,
              }}
            >
              Fotos próximamente
            </p>
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1, padding: "3rem", maxWidth: 620 }}>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#e21212",
              margin: "0 0 0.8rem",
            }}
          >
            {room.name}
          </p>
          <h3
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(28px, 4.4vw, 48px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: 0,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            {room.tagline}
          </h3>
          <p
            style={{
              fontFamily: BODY,
              fontSize: "clamp(14px, 1.6vw, 16px)",
              lineHeight: 1.65,
              color: "rgba(245,245,245,0.7)",
              margin: "1.2rem 0 0",
            }}
          >
            {room.description}
          </p>
        </div>
      </div>
    </section>
  );
}
