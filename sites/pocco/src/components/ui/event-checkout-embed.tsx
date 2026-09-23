"use client";

// Extracted from events-calendar.tsx's own EventCheckoutEmbed (previously
// defined only there, used only inside EventModal) so it can be reused
// as-is from the standalone /eventos/[slug] page — that page previously
// linked "Conseguir entrada" straight out to fourvenues.com in a new tab,
// which the homepage's own calendar never does; every event there opens
// Fourvenues' checkout embedded in place, inside this same site. This
// component is the exact mechanism that makes that possible, unchanged
// from the version events-calendar.tsx already uses (see its own history
// for why each workaround below exists — Strict Mode double-injection,
// the hash-write race with a modal's scroll-lock cleanup, the
// scrollIntoView hijack, the iframe-load MutationObserver).
//
// Re-embeds Fourvenues' own widget script but scoped to a single event's
// detail/checkout view via their loader's own hash-based deep link
// (`window.location.hash = "events/<code>"`, read before the script is
// injected). Needs Fourvenues' own short code (the last path segment of
// `event.url`, e.g. "6JNJ" from fourvenues.com/pocco-club/6JNJ) — their
// readable `slug` field looks plausible for this but silently fails,
// confirmed live.

import { useEffect, useRef, useState } from "react";

let checkoutScriptCounter = 0;

export function EventCheckoutEmbed({ shortCode }: { shortCode: string }) {
  const [mountId] = useState(() => `fv-checkout-${++checkoutScriptCounter}`);
  // Fourvenues' widget takes several seconds end to end (their own script
  // load + internal init + the event-specific iframe's own load). With
  // nothing shown here in the meantime, that reads as the page being
  // frozen/stuck rather than working — a visible spinner is what actually
  // addresses that complaint even though it doesn't reduce the real wait.
  const [loaded, setLoaded] = useState(false);

  // Writing this hash raced a containing modal's own scroll-lock cleanup
  // in the original usage — not a concern on a standalone page with no
  // such cleanup, but the write itself still needs to happen before the
  // script below is injected, so it stays here rather than in a caller
  // that may or may not be a modal. A `useState` initializer (what the
  // original inline version used) runs during SSR too, where `window`
  // doesn't exist — this component is now also mounted directly in the
  // initial render tree of /eventos/[slug] (a server-rendered page),
  // not only ever inside a client-triggered modal like before, so that
  // crashed render with "window is not defined". A synchronous effect
  // (empty deps, no cleanup) still runs before the injection effect
  // below and is client-only by construction.
  useEffect(() => {
    window.location.hash = `events/${shortCode}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shortCode is
    // effectively static per mount (a new event never swaps in under the
    // same component instance); re-running this if it somehow changed
    // would just rewrite the hash, which is harmless, not incorrect.
  }, []);

  // React 19 Strict Mode (dev only) runs this effect twice (mount →
  // cleanup → mount) before settling. Fourvenues' loader script isn't
  // idempotent — re-running it creates a SECOND real iframe rather than
  // reusing the first, confirmed live: two <iframe> elements both loading
  // the same URL. Gating the effect body on a ref stops the double
  // injection.
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    const container = document.getElementById(mountId);
    if (!container) return;

    const iframeContainer = document.createElement("div");
    iframeContainer.id = "fourvenues-iframe";
    container.appendChild(iframeContainer);

    // Watches for Fourvenues' own real <iframe> landing inside the
    // container their script targets, then waits for THAT iframe's own
    // `load` event — not just the <iframe> element existing, which fires
    // the moment their script inserts a still-blank iframe node, well
    // before its own document has painted anything.
    const revealAfterLoad = () => setTimeout(() => setLoaded(true), 400);
    const loadObserver = new MutationObserver(() => {
      const iframe = iframeContainer.querySelector("iframe");
      if (iframe) {
        loadObserver.disconnect();
        // The iframe's own document can already be done loading by the
        // time this observer callback runs — in that case `load` has
        // already fired and never will again, so checking `readyState`
        // first covers that instead of waiting forever for an event that
        // already happened. `contentDocument` is same-origin here
        // (Fourvenues' iframe, loaded via their own first-party script on
        // this page), so this read doesn't throw.
        if (iframe.contentDocument?.readyState === "complete") {
          revealAfterLoad();
        } else {
          iframe.addEventListener("load", revealAfterLoad, { once: true });
        }
      }
    });
    loadObserver.observe(iframeContainer, { childList: true, subtree: true });

    // Fourvenues' script calls `#fourvenues-iframe-anchor`.scrollIntoView()
    // once its iframe loads, which would yank the page down to this mount
    // point. Restored after a fixed window, matching the original embed.
    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (this: Element, ...args) {
      if (this.id === "fourvenues-iframe-anchor") return;
      return nativeScrollIntoView.apply(this, args as never);
    };
    const restoreScrollIntoViewTimeout = setTimeout(() => {
      Element.prototype.scrollIntoView = nativeScrollIntoView;
    }, 8000);

    const script = document.createElement("script");
    script.src = "https://www.fourvenues.com/assets/iframe/pocco-club/events?theme=dark";
    container.appendChild(script);

    // Deliberately NOT disconnecting loadObserver here — this cleanup also
    // runs after Strict Mode's throwaway first mount, and disconnecting it
    // there permanently kills it before the real, lasting mount ever gets
    // a chance to see the iframe land. It disconnects itself anyway as
    // soon as it finds the iframe, so leaving it running past this cleanup
    // doesn't leak.
    return () => {
      clearTimeout(restoreScrollIntoViewTimeout);
      Element.prototype.scrollIntoView = nativeScrollIntoView;
    };
  }, [shortCode, mountId]);

  return (
    // Fixed min-height at all times, not just while loading — the spinner
    // is overlaid (position:absolute) instead of taking up its own
    // document-flow space, so nothing about this box's size changes when
    // `loaded` flips.
    <div
      style={{
        position: "relative",
        minHeight: 400,
        transition: "min-height 0.25s ease",
      }}
    >
      <div
        aria-hidden={loaded}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.25s ease",
          pointerEvents: loaded ? "none" : "auto",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.15)",
            borderTopColor: "#e21212",
            animation: "fv-checkout-spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "rgba(245,245,245,0.4)",
            margin: 0,
          }}
        >
          Cargando entradas…
        </p>
        <style>{`
          @keyframes fv-checkout-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
      {/* Collapsed to zero height while loading, not just hidden via
          opacity/visibility — those still occupy their real (eventually
          ~1400px) layout space immediately, which would push the spinner
          down past the visible area. */}
      <div id={mountId} style={loaded ? undefined : { height: 0, overflow: "hidden" }} />
    </div>
  );
}
