"use client";

// Continuously saves the current scroll position to sessionStorage (keyed
// by pathname) so layout.tsx's inline beforeInteractive script can restore
// it on the next load of this same path — e.g. reloading mid-page keeps you
// where you were instead of snapping back to the top.
//
// Saved on every scroll (rAF-throttled, not on every event) rather than
// only on unload/beforeunload/pagehide — those aren't reliable triggers for
// this on mobile Safari, where backgrounding or switching tabs doesn't
// reliably fire them, and a page reopened from the background can go
// straight to a fresh load without ever running an unload handler. A
// continuously-updated value is always "good enough" regardless of how the
// tab actually goes away.
//
// Renders nothing — this is a behavior-only component, mounted once near
// the root (root layout) so it's alive for the whole session regardless of
// which page is showing.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollPositionMemory() {
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const save = () => {
      ticking = false;
      try {
        sessionStorage.setItem(`scrollY:${pathname}`, String(window.scrollY));
      } catch {
        // Storage can throw in private-browsing/quota-exceeded edge cases —
        // losing the saved position just means the next load starts at the
        // top, same as before this feature existed, so it's safe to ignore.
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(save);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
