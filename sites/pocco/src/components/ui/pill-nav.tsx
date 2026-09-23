"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Home, Calendar, MapPin, type LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  id: string;
  icon: LucideIcon;
  /** If set, this item is a real link (e.g. Home) instead of an in-page tab toggle. */
  href?: string;
  /**
   * If set, this item is an in-page anchor (e.g. "#eventos") that scrolls to
   * that section instead of only toggling the active tab's own highlight —
   * unlike a plain tab toggle, clicking it actually takes you there.
   */
  anchor?: string;
}

// Matches the 21st.dev reference component's own icon set (lucide-react — thin,
// rounded-cap stroke icons), not the filled Line Awesome set used before, which
// read visually inconsistent with the reference.
//
// Eventos is a real link to /eventos (its own indexable page, see
// src/app/eventos) rather than an in-page anchor — previously it only
// scrolled to the homepage's own #eventos calendar section, with no way to
// land directly on a crawlable events listing. Ubicación stays an in-page
// anchor since there's no standalone location page.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", id: "home", icon: Home, href: "/" },
  { label: "Eventos", id: "eventos", icon: Calendar, href: "/eventos" },
  { label: "Ubicación", id: "ubicacion", icon: MapPin, anchor: "#ubicacion" },
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
 * Home is a real link (next/link, navigates to href) rather than an in-page
 * scroll-to like Eventos/Ubicación, but shares the same activeId state —
 * clicking it sets it active and keeps it expanded (rather than only
 * expanding on hover, which collapsed again the instant the cursor left,
 * before the click had a chance to register as "staying" selected) in
 * addition to navigating.
 */
export const PillNav: React.FC = () => {
  // Whichever nav item's `href` matches the actual current route starts
  // active (e.g. loading/refreshing on "/" shows Home highlighted, "/eventos"
  // shows Eventos highlighted) — falls back to "eventos" only on a route with
  // no matching nav item at all (e.g. a legal page), same default as before.
  const pathname = usePathname();
  const initialId = NAV_ITEMS.find((item) => item.href === pathname)?.id ?? "eventos";
  const [activeId, setActiveId] = useState<string>(initialId);

  // On mount, re-derive which tab should read as active from wherever the
  // page's scroll position actually ended up (layout.tsx's beforeInteractive
  // script already restored it from sessionStorage before this component
  // hydrates) rather than always defaulting to whatever `initialId` above
  // computed — otherwise a reload that correctly returns you to Ubicación
  // still shows Home highlighted, which reads as wrong once the scroll
  // position itself is being remembered. Deliberately NOT read from
  // sessionStorage directly (e.g. a separately-saved "activeId" key) — that
  // would need to run before hydration to avoid a flash, same as the scroll
  // restore, and duplicating state two ways (scroll position AND a separate
  // activeId) risks them disagreeing; deriving from the one thing already
  // being restored keeps them in sync by construction.
  //
  // No `initialId`-based early return here — every nav item (Home,
  // Eventos, Ubicación) resolves to the SAME route ("/"), since Eventos and
  // Ubicación are in-page anchors, not distinct pages. `initialId` always
  // comes out "home" on this site, so gating on it (as an earlier version
  // of this effect did) skipped the whole measurement unconditionally and
  // the tab never updated after a restore into Eventos or Ubicación.
  React.useEffect(() => {
    // Deferred a frame past mount — layout.tsx's beforeInteractive script
    // calls scrollTo synchronously before hydration, but the browser doesn't
    // necessarily reflect that new scroll position in time for code running
    // in this component's very first effect tick (observed directly:
    // window.scrollY read here during the initial effect run intermittently
    // still showed 0 despite the restore having already been issued).
    // Waiting a rAF lets the browser actually paint at the restored
    // position first, so the measurement below reads real numbers.
    const raf = requestAnimationFrame(() => {
      const anchoredItems = NAV_ITEMS.filter((item) => item.anchor);
      let closest: { id: string; top: number } | null = null;
      for (const item of anchoredItems) {
        const el = document.getElementById(item.anchor!.slice(1));
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        // Section whose top has already been scrolled past (or is about to
        // be, within a small margin) and is the closest such section — same
        // idea as a scrollspy, evaluated once instead of on every scroll
        // event since this only needs to run right after the restore.
        if (top - 120 <= window.scrollY && (!closest || top > closest.top)) {
          closest = { id: item.id, top };
        }
      }
      if (closest) setActiveId(closest.id);
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on
    // mount, after layout.tsx's script has already restored scroll position.
  }, []);

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
                // re-navigating to a page you're already on. Since that also
                // means no page reload happens to put the viewport back at
                // the top, scroll there explicitly instead — otherwise
                // clicking Home while scrolled down the page does nothing.
                if (window.location.pathname === item.href) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
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

        if (item.anchor) {
          return (
            <button
              key={item.id}
              onClick={() => {
                // Scrolls directly via scrollIntoView rather than a real
                // <a href="#eventos"> anchor — an anchor would leave a "#…"
                // hash sitting in the URL after the click, and layout.tsx
                // already has to actively strip a stale "#" left over from
                // the Fourvenues widget on load; adding a second source of
                // hash-in-the-URL here would just create more of exactly
                // that problem instead of avoiding it.
                document
                  .getElementById(item.anchor!.slice(1))
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(item.id);
              }}
              className="relative flex items-center rounded-full cursor-pointer"
              style={sharedStyle}
            >
              {content}
            </button>
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

      {/* Static POCCO isotype mark — sits as a fourth, non-interactive item
          alongside Home/Eventos/Contacto, so it reads as part of the nav's
          own icon set rather than a separate decoration bolted on beside
          it. No highlight/label/click handling since it isn't a real tab.
          Plain image, no spin/animation and no ChromaVideo — the asset is
          already solid black on white (matching this pill's own
          background), no motion, per request. */}
      <div
        className="pill-nav-mark"
        style={{
          width: 22,
          height: 22,
          flexShrink: 0,
          // No manual margins here on desktop — the nav's own `gap` (between
          // this and the Contacto button) already matches the gap between
          // every other pair of items, and the nav's own right `padding`
          // already matches its left padding (before Home). See the
          // mobile-only media query below for why this one side still
          // needed extra room on a narrow phone.
          position: "relative",
        }}
      >
        <Image
          src="/assets/nav/pocco-mark.png"
          alt="POCCO"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <style>{`
        /* The nav's own 6px padding is an equal, symmetric gap to the
           pill's curved edge on both sides in absolute terms — but the
           mark is a square-cornered image, not a round glyph/icon like the
           others, so its own corner sits closer to where the pill's curve
           has already started falling away, reading as "pressed into the
           corner" despite the padding being identical to the left side.
           Extra right-side breathing room on this one item (mobile only —
           desktop already reads fine, this is specifically about how much
           of the pill's own curve is visible relative to its size on a
           smaller/narrower pill) fixes that without touching the pill's
           own symmetric padding for every other item. */
        @media (max-width: 640px) {
          .pill-nav-mark {
            margin-right: 6px;
          }
        }
      `}</style>
    </nav>
  );
};
