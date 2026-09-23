"use client";

// Embeds Fourvenues' own full events-listing widget as-is — no deep link
// hash, so it shows their own listing view (their own cards, their own
// checkout flow when a visitor taps one), not a single event. Used only on
// /eventos (the index page), deliberately kept separate from that page's
// own API-sourced content elsewhere on the site: /eventos/[slug] and the
// homepage's own EventsCalendar (events-calendar.tsx) both render our own
// layout from live Fourvenues API data, each event getting its own
// crawlable URL and JSON-LD — this widget is the opposite of that, a
// direct embed of Fourvenues' UI, used here specifically to look and
// behave differently from the rest of the site's own event surfaces.
//
// Same loading mechanics as EventCheckoutEmbed (event-checkout-embed.tsx)
// — spinner until the iframe actually paints, Strict Mode double-injection
// guard, the scrollIntoView hijack Fourvenues' own script otherwise
// triggers on load — deliberately not shared as one component with that
// one: this always shows the listing (no hash write, no per-event
// short code), and forcing both call shapes through one API would need a
// branch for "hash or not" that's more confusing than two small,
// purpose-specific components.

import { useEffect, useRef, useState } from "react";

export function FourvenuesEventsWidget() {
  const [loaded, setLoaded] = useState(false);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    const container = document.getElementById("fv-events-widget-mount");
    if (!container) return;

    const iframeContainer = document.createElement("div");
    iframeContainer.id = "fourvenues-iframe";
    container.appendChild(iframeContainer);

    const revealAfterLoad = () => setTimeout(() => setLoaded(true), 400);
    const loadObserver = new MutationObserver(() => {
      const iframe = iframeContainer.querySelector("iframe");
      if (iframe) {
        loadObserver.disconnect();
        if (iframe.contentDocument?.readyState === "complete") {
          revealAfterLoad();
        } else {
          iframe.addEventListener("load", revealAfterLoad, { once: true });
        }
      }
    });
    loadObserver.observe(iframeContainer, { childList: true, subtree: true });

    // Fourvenues' script calls `#fourvenues-iframe-anchor`.scrollIntoView()
    // once its iframe loads — on this page that anchor sits well below the
    // fold (the section already has its own heading above it), so letting
    // that through would yank the page down past content that's meant to
    // be seen first.
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

    return () => {
      clearTimeout(restoreScrollIntoViewTimeout);
      Element.prototype.scrollIntoView = nativeScrollIntoView;
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: 400, transition: "min-height 0.25s ease" }}>
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
            animation: "fv-widget-spin 0.8s linear infinite",
          }}
        />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Cargando eventos…
        </p>
        <style>{`
          @keyframes fv-widget-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
      <div id="fv-events-widget-mount" style={loaded ? undefined : { height: 0, overflow: "hidden" }} />
    </div>
  );
}
