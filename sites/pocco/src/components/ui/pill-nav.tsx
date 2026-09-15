"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Calendar, Mail, type LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  id: string;
  icon: LucideIcon;
  /** If set, this item is a real link (e.g. Home) instead of an in-page tab toggle. */
  href?: string;
}

// Matches the 21st.dev reference component's own icon set (lucide-react — thin,
// rounded-cap stroke icons), not the filled Line Awesome set used before, which
// read visually inconsistent with the reference.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", id: "home", icon: Home, href: "/" },
  { label: "Eventos", id: "eventos", icon: Calendar },
  { label: "Contacto", id: "contacto", icon: Mail },
];

/**
 * Light pill nav bar (white pill, dark icons/text), icons always visible, the
 * active tab expands with its label on a soft grey highlight. Behavior modeled
 * on 21st.dev's "Bottom Nav Bar" (checked live in a real browser — its source
 * is paywalled, so this is a from-scratch reimplementation of the observed
 * interaction, not a copy of its code).
 *
 * Plain CSS transitions drive the button's padding/background (Framer Motion's
 * `animate` prop on the button proved unreliable here — even isolated to just
 * backgroundColor/padding with no `layout` or nested motion children, clicks
 * changed React state correctly but the DOM never reflected new animate target
 * values, root cause not identified; CSS transition on a plain <button> sidesteps
 * the issue entirely). Framer Motion is kept only for the label's width/opacity,
 * where a plain CSS transition on `max-width: 0 → auto` doesn't interpolate.
 *
 * Home is a real link (next/link, navigates to href) rather than an in-page tab
 * toggle like Eventos/Contacto, but shares the same activeId state — clicking
 * it sets it active and keeps it expanded (rather than only expanding on
 * hover, which collapsed again the instant the cursor left, before the click
 * had a chance to register as "staying" selected) in addition to navigating.
 */
export const PillNav: React.FC = () => {
  // Whichever nav item's `href` matches the actual current route starts active
  // (e.g. loading/refreshing on "/" shows Home highlighted, not a hardcoded
  // default) — falls back to "eventos" only when the current route isn't one
  // of the href-based items (Eventos/Contacto have no route of their own,
  // they're in-page toggles).
  const pathname = usePathname();
  const initialId = NAV_ITEMS.find((item) => item.href === pathname)?.id ?? "eventos";
  const [activeId, setActiveId] = useState<string>(initialId);

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
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activeId;
        const Icon = item.icon;

        const content = (
          <>
            {/* A single highlight element with a shared layoutId, rather than
                each button animating its own background — Framer Motion tracks
                its position/size across which button currently renders it and
                glides it smoothly from one tab to the next (a spring, not a
                fade), matching the reference's fluid transition instead of the
                highlight fading out in place and a new one fading in elsewhere. */}
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
                // `initial={false}` was here (to skip an entrance animation on
                // first mount) but it was the actual root cause of clicks never
                // updating anything after the very first render — isolated by
                // rebuilding this component from scratch in a test page, adding
                // pieces back one at a time, until removing exactly this prop
                // was what made setState-driven re-clicks start working again.
                // Framer Motion reads the element's own computed style as the
                // animation's starting point when a property isn't otherwise
                // set — and an inline-block span with no maxWidth computes to
                // "none", which Motion can't tween from/to a number (logged a
                // "not an animatable value" warning and silently skipped the
                // animation every render). Seeding a real starting number fixes it.
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
          </>
        );

        // Matches the reference layout: inactive tabs sit close together as bare
        // icons with tight padding, while the active tab gets generous breathing
        // room around its icon+label.
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

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                // The hero this nav lives in already IS the "/" page, so clicking
                // Home navigates to the same route Next.js is already showing.
                // That still-same-route navigation was triggering an HMR/dev-mode
                // remount of this component (observed directly: activeId flipped
                // to "home", then briefly back to "eventos", then to "home" again,
                // across several renders in the same click) which made the active
                // state flash and settle back to whatever it was, rather than
                // staying on Home. Skipping the navigation when already on this
                // exact path sidesteps that remount entirely — the tab still
                // highlights and stays highlighted, it's just not literally
                // re-navigating to a page you're already on.
                if (window.location.pathname === item.href) {
                  e.preventDefault();
                }
                setActiveId(item.id);
              }}
              className="relative flex items-center rounded-full cursor-pointer no-underline"
              style={sharedStyle}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className="relative flex items-center rounded-full cursor-pointer"
            style={sharedStyle}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
};
