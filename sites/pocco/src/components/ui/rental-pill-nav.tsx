"use client";

// Page-specific nav for /alquiler-sala, built on the shared PillNavShell
// (pill-nav.tsx's own visual/interaction mechanism, extracted there) —
// same floating white pill look as the homepage's PillNav, but with items
// that actually make sense on this page: the homepage's own PillNav
// (Home/Eventos/Ubicación) scrolls to sections that don't exist here, so
// clicking any of its items on this page was a no-op (see pill-nav.tsx's
// own comment on why that page-specific nav plan was deferred until now).
//
// Items, per the site owner's own answer: in-page anchors to this page's
// own sections (Las Salas, Precio, Catering) rather than links out to
// other pages, plus a direct WhatsApp/contact CTA — scrolls to the
// closing section's own form (rental-closing.tsx's #contacto) rather than
// opening wa.me directly with no context, so a visitor who clicks it still
// lands on the structured lead form instead of a blank WhatsApp chat.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, Euro, UtensilsCrossed, MessageCircle } from "lucide-react";
import { PillNavShell, type PillNavShellItem } from "./pill-nav-shell";

interface NavSection {
  id: string;
  label: string;
  icon: PillNavShellItem["icon"];
}

const SECTIONS: NavSection[] = [
  { id: "salas", label: "Las Salas", icon: Building2 },
  { id: "precio", label: "Precio", icon: Euro },
  { id: "catering", label: "Catering", icon: UtensilsCrossed },
];

const CONTACT_ID = "contacto";

export function RentalPillNav() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  // Scrollspy: highlights whichever section the visitor has scrolled past
  // most recently, same approach pill-nav.tsx's own mount-time measurement
  // uses, but running continuously on scroll here (not just once on
  // mount+restore) since this page has no saved-scroll-position feature to
  // coordinate with.
  useEffect(() => {
    const allIds = [...SECTIONS.map((s) => s.id), CONTACT_ID];
    function handleScroll() {
      let closest: { id: string; top: number } | null = null;
      for (const id of allIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top - 160 <= window.scrollY && (!closest || top > closest.top)) {
          closest = { id, top };
        }
      }
      // No section has been scrolled to yet (above "Las Salas", the first
      // one) — falls back to the first item instead of leaving whatever
      // activeId happened to be set last, which otherwise stuck on
      // "Contacto" after a scroll-position restore landed near the bottom
      // and this ran once at mount before any real scroll event fired.
      setActiveId(closest ? closest.id : SECTIONS[0].id);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items: PillNavShellItem[] = SECTIONS.map((section) => ({
    id: section.id,
    label: section.label,
    icon: section.icon,
    onClick: () => {
      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(section.id);
    },
  }));

  items.push({
    id: CONTACT_ID,
    label: "Contacto",
    icon: MessageCircle,
    onClick: () => {
      document.getElementById(CONTACT_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(CONTACT_ID);
    },
  });

  return (
    <PillNavShell
      items={items}
      activeId={activeId}
      trailing={
        // "Volver a POCCO Club" — a real link back to the homepage, kept as
        // a plain small icon-only button (not a full PillNavShell item,
        // which would need its own label/active state for a page this
        // nav's own scrollspy never targets) so it doesn't compete with
        // the in-page section items for the active-tab highlight.
        <button
          onClick={() => router.push("/")}
          aria-label="Volver a POCCO Club"
          title="Volver a POCCO Club"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            marginLeft: 2,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <Image src="/assets/nav/pocco-mark.png" alt="" fill style={{ objectFit: "contain", padding: 6 }} />
        </button>
      }
    />
  );
}
