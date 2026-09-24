"use client";

// Shared "which room is selected" state — the narrative brief's "Las
// Salas" section (rental-rooms-section.tsx) and the pricing section
// (rental-pricing.tsx) both need to agree on POCCO vs. Lo Nuestro without
// either page section owning the other's DOM, so a small context is
// simpler than lifting state into page.tsx (which would force the whole
// page to be a client component) or prop-drilling through every section
// in between. Defaults to "pocco" — the main room, and the one with a
// real photo today (Lo Nuestro's is still pending).

import { createContext, useContext, useState, type ReactNode } from "react";
import type { RoomId } from "@/lib/rental-rooms";

interface RentalRoomContextValue {
  selectedRoom: RoomId;
  setSelectedRoom: (id: RoomId) => void;
}

const RentalRoomContext = createContext<RentalRoomContextValue | null>(null);

export function RentalRoomProvider({ children }: { children: ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomId>("pocco");
  return (
    <RentalRoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>
      {children}
    </RentalRoomContext.Provider>
  );
}

export function useRentalRoom(): RentalRoomContextValue {
  const ctx = useContext(RentalRoomContext);
  if (!ctx) {
    throw new Error("useRentalRoom must be used within a RentalRoomProvider");
  }
  return ctx;
}
