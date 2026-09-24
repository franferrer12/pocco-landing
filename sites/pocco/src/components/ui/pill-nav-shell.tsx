"use client";

// Shared visual/interaction shell for a floating white pill nav — the
// container, the sliding highlight, and the icon+label expand/collapse
// mechanism, extracted out of pill-nav.tsx (the homepage's own nav) so a
// page-specific nav (e.g. rental-pill-nav.tsx for /alquiler-sala) can reuse
// the exact same look and feel with its own different set of items,
// instead of either forcing PillNav's own homepage-specific NAV_ITEMS to
// somehow also make sense on every other page, or copy-pasting this whole
// mechanism a second time. See pill-nav.tsx's own history for why a fully
// shared item list didn't work: different pages need different actions
// (scroll-to-home-section vs. scroll-to-this-page's-own-section vs. a
// WhatsApp CTA), and forcing one shared list to cover all of them made
// half its items no-ops depending on which page rendered it.
//
// All the same implementation notes from the original PillNav apply here
// unchanged (kept close to verbatim from there — see that file's own
// history for the debugging story behind each one):
// - Plain CSS transition on padding, not Framer Motion's `animate`, for
//   the button shape itself (Motion's animate prop didn't reliably update
//   the DOM here, root cause never identified).
// - Framer Motion IS used for the label's width/opacity (`max-width: 0 →
//   auto` doesn't interpolate as a plain CSS transition).
// - No `initial={false}` on the label's motion.span — that one prop was
//   the actual root cause of clicks never updating anything after the
//   very first render in the original component.

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface PillNavShellItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  href?: string;
}

export function PillNavShell({
  items,
  activeId,
  trailing,
}: {
  items: PillNavShellItem[];
  activeId: string;
  trailing?: React.ReactNode;
}) {
  return (
    <nav
      className="relative rounded-full"
      style={{
        background: "#ffffff",
        boxShadow: `
          0 3px 6px rgba(0,0,0,0.10),
          0 8px 16px rgba(0,0,0,0.08),
          0 16px 32px rgba(0,0,0,0.06),
          inset 0 1px 1px rgba(255,255,255,0.8),
          inset 0 -1px 2px rgba(0,0,0,0.04)
        `,
        padding: "6px",
        display: "flex",
        alignItems: "center",
        gap: "2px",
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const Icon = item.icon;

        const sharedStyle: React.CSSProperties = {
          position: "relative",
          height: "44px",
          gap: "8px",
          border: "none",
          outline: "none",
          paddingLeft: isActive ? 16 : 10,
          paddingRight: isActive ? 18 : 10,
          background: "transparent",
          transition: "padding 0.25s cubic-bezier(0.4,0,0.2,1)",
        };

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className="relative flex items-center rounded-full cursor-pointer"
            style={sharedStyle}
          >
            {isActive && (
              <motion.div
                layoutId="pill-nav-highlight"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 9999,
                  background: "#f0f0f2",
                  zIndex: 0,
                }}
              />
            )}
            <Icon
              size={18}
              style={{
                position: "relative",
                zIndex: 1,
                color: isActive ? "#1a1a1a" : "#8a8a8a",
                flexShrink: 0,
              }}
            />
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0,
                maxWidth: isActive ? 140 : 0,
              }}
              transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
              style={{
                maxWidth: isActive ? 140 : 0,
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "SF Pro", sans-serif',
                fontSize: "14.5px",
                fontWeight: 600,
                color: "#1a1a1a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                letterSpacing: "0.3px",
                display: "inline-block",
                position: "relative",
                zIndex: 1,
              }}
            >
              {item.label}
            </motion.span>
          </button>
        );
      })}
      {trailing}
    </nav>
  );
}
