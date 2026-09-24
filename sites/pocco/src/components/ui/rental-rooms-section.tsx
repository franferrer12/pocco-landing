"use client";

// Section 3 of the rental-page narrative — "Las Salas": the moment a
// visitor picks between POCCO (400p., the main room) and Lo Nuestro
// (150p., more intimate). Two big panels rather than SaaS-style cards —
// each shows only name, tagline, capacity and a "DESCUBRIR SALA" pick
// control here; full description/experience/pricing live in later
// sections, gated by this same selection via useRentalRoom.
//
// Lo Nuestro has no real room photo yet (confirmed — its own mockup used
// a "PRÓXIMAMENTE..." placeholder here too), so its panel shows its real
// logo (lo-nuestro-logo.png) over a dark warm-toned gradient instead of a
// photo, rather than reusing a POCCO photo that would misrepresent it.

import Image from "next/image";
import { RENTAL_ROOMS } from "@/lib/rental-rooms";
import { useRentalRoom } from "./rental-room-context";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function RentalRoomsSection() {
  const { selectedRoom, setSelectedRoom } = useRentalRoom();

  return (
    <section style={{ background: "#000", padding: "4vh 6vw 10vh" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {RENTAL_ROOMS.map((room, i) => {
          const isSelected = selectedRoom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              style={{
                position: "relative",
                textAlign: "left",
                minHeight: 440,
                borderRadius: 24,
                overflow: "hidden",
                border: isSelected ? "1px solid #e21212" : "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                padding: 0,
                background:
                  room.id === "pocco"
                    ? "linear-gradient(135deg, rgba(210,20,20,0.5), transparent 45%), linear-gradient(160deg, #6a0606, #150202)"
                    : "linear-gradient(135deg, rgba(238,115,60,0.35), transparent 45%), linear-gradient(160deg, #3a1a08, #111111)",
              }}
            >
              {room.photo && (
                <Image
                  src={room.photo.src}
                  alt={room.photo.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, 540px"
                  style={{ objectFit: "cover", opacity: 0.55 }}
                />
              )}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.2) 55%, rgba(5,5,5,0.35) 100%)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  height: "100%",
                  minHeight: 440,
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(245,245,245,0.6)",
                    margin: 0,
                  }}
                >
                  0{i + 1} — {room.id === "pocco" ? "POCCO" : "LO NUESTRO"}
                </p>

                <div>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: "clamp(56px, 8vw, 96px)",
                      fontWeight: 900,
                      color: "#f5f5f5",
                      margin: 0,
                      lineHeight: 0.85,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {room.capacity}
                  </p>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(245,245,245,0.55)",
                      margin: "0.3rem 0 1rem",
                    }}
                  >
                    Personas · aforo máximo
                  </p>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: "clamp(20px, 2.6vw, 26px)",
                      fontWeight: 800,
                      color: "#f5f5f5",
                      margin: "0 0 0.4rem",
                    }}
                  >
                    {room.tagline}
                  </p>

                  <p
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: "1rem",
                      fontFamily: DISPLAY,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: isSelected ? "#e21212" : "rgba(245,245,245,0.7)",
                    }}
                  >
                    {isSelected ? "Sala seleccionada ✓" : "Descubrir sala →"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p
        style={{
          fontFamily: BODY,
          fontSize: 13,
          color: "rgba(245,245,245,0.4)",
          textAlign: "center",
          maxWidth: 480,
          margin: "2.4rem auto 0",
        }}
      >
        Elige una sala para ver su experiencia, precio y condiciones más abajo.
      </p>
    </section>
  );
}
