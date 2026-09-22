"use client";

// Fonts: the heavy display headline + all UI text use Inter (Google Font, here at
// weights 500/600/900). Load it in your project for an exact match; without it the
// headline falls back to Helvetica Neue / Arial Black and the UI to a system sans.
//
// Everything else is inline — all @keyframes live in the one injected <style>
// block, there are no Tailwind classes, and there are no image files to ship.
//
// The hero originally rendered a procedural 3D jellyfish (react-three-fiber +
// custom GLSL shaders) behind the word ring; it was replaced by the ChromaVideo
// logo mark and the three/@react-three/fiber code removed — that dependency
// alone was ~1MB of the client JS bundle for a component that was never
// actually rendered.

import type { CSSProperties } from "react";
import { useRef } from "react";
import Image from "next/image";
import ChromaVideo from "./chroma-video";

const SANS = "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif";
const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const TICKER_RED = "#f5f5f5";

/* Inline film-grain (feTurbulence) as a data-URI — a faint noise overlay for the
   premium studio-film texture. Self-contained: no asset file. */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/* The giant headline is a single RIGID 3D WORLD that the CAMERA ORBITS. The phrases
   are NOT animated individually — instead they are pinned at fixed positions on a
   vertical ring (a "word carousel") standing around the jellyfish, each facing
   OUTWARD. The jellyfish floats at the hub (the ring's centre). One container — the
   stage — rotates slowly and continuously about the vertical axis (jelly-orbit), which
   reads as the viewpoint circling the creature: as the camera comes round, whichever
   word currently faces us swells to full size at centre, sweeps across with true
   turntable perspective (near edge largest, trapezoidal), then swings off to the side
   and turns away while the next word rounds into view. backface-visibility hides the
   half of the ring that faces away, and each word's own opacity bump (jelly-fade,
   phase-locked to the orbit) keeps just one phrase dominant at a time. */
const PHRASES = ["THIS", "IS", "F*CKING", "POCCO", "C*BRON"];
const RING_N = PHRASES.length;
const WORD_CROSS = 3.2; // seconds for one word's full right-to-left pass
const WORD_STAGGER = WORD_CROSS * 0.5; // seconds between one word's start and the next's (0.5x WORD_CROSS = next word starts as the current one reaches centre)
// Full cycle length: every word, including the last, gets its complete WORD_CROSS
// pass before the loop restarts — so each word's keyframe has the same simple
// shape (parked right, one uninterrupted sweep, parked left) with no case needing
// to wrap its motion across the 100%/0% seam. This leaves a brief pause between
// C*BRON finishing and THIS starting its next lap, but the motion itself is always
// simple and monotonic — no edge cases, no risk of visible backwards motion.
const LOOP = WORD_STAGGER * (RING_N - 1) + WORD_CROSS;

/* A quiet design-statement that surfaces on the right during the calm resolve. */
const MANIFESTO =
  "WELCOME TO POCCO, MATE. THIS ISN'T JUST ANOTHER CLUB. THIS IS POCCO CLUB.";

/* Small technical labels stacked down each side edge — pure decoration that sells
   the "lab instrument" feel of the reference. */
const TICK_LABELS = ["UX", "3D", "FX", "AI"];

function SideRuler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className="jelly-side-ruler"
      style={{
        position: "absolute",
        [side]: "1.4vh",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.1vh",
        height: "56vh",
        justifyContent: "center",
        pointerEvents: "none",
      } as CSSProperties}
    >
      {Array.from({ length: 13 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i % 4 === 0 ? "1.4vh" : "0.7vh",
            height: 1,
            background: "rgba(30,30,40,0.45)",
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          [side]: "-2.4vh",
          writingMode: "vertical-rl",
          transform: side === "left" ? "rotate(180deg)" : "none",
          fontFamily: SANS,
          fontSize: "0.95vh",
          fontWeight: 600,
          letterSpacing: "0.35em",
          color: "rgba(245,245,245,0.5)",
          textTransform: "uppercase",
        } as CSSProperties}
      >
        {TICK_LABELS.join(" · ")}
      </span>
    </div>
  );
}

export default function JellyfishDrift() {
  return (
    <section
      className="jelly-loop"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
        fontFamily: SANS,
      }}
    >
      <style>{JELLY_CSS}</style>

      {/* ── Backdrop photo — its own layer, blurred, so the blur doesn't also hit
            the text/logo/grain sitting above it (a filter on the section itself
            would blur everything, not just this background). Scaled up (transform,
            not background-size, so the blur's own edge softening happens on pixels
            already beyond the frame) and anchored toward the right of the source
            photo. A dark wash sits above it to keep the red ticker text, white logo
            mark and grain overlay at the same contrast they had against black. ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-5%",
            filter: "blur(8px)",
            transform: "scale(1.06)",
          }}
        >
          {/* next/image instead of a plain background-image url() — the source
              file is 2400×1600 (748KB) but only ever shown blurred behind the
              hero at viewport width, so it never needs to be served at full
              resolution/JPEG. next/image's built-in optimizer resizes and
              re-encodes it (AVIF/WebP with JPEG fallback) per requesting
              device, which a raw CSS url() bypasses entirely. fill +
              object-fit/object-position reproduce the same 170%
              zoom/85%-center crop the background-size/-position pair gave. */}
          <Image
            src="/assets/hero-main.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "85% center",
              transform: "scale(1.7)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(125% 120% at 50% 28%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 46%, rgba(0,0,0,0.9) 74%, rgba(0,0,0,0.97) 100%)",
          }}
        />
        {/* The radial wash above is centred high (28%) so it never actually
            reaches full opacity at the very bottom edge — leaving the photo
            visibly lighter right where this section meets the next one, a
            hard seam. This explicit linear fade guarantees pure black at the
            bottom regardless of the radial's falloff. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "18vh",
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%)",
          }}
        />
      </div>

      {/* ── Giant headline — a horizontal TICKER. Each word starts off-screen right,
            slides straight across through the centre (passing behind the jellyfish,
            via zIndex) to off-screen left, then holds off-screen while the next word
            takes its turn — so they read in order (THIS, IS, F*CKING, …) as each one
            crosses right-to-left. Sits BEHIND the jellyfish so the crossing word is
            cropped by it. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {PHRASES.map((p, i) => (
          <span
            key={p}
            className="jelly-phrase"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              // Shifts the text up from the section's true 50% grid-centre to match
              // the logo's own 45% vertical anchor — see that element for why (the
              // fixed nav and audio/play controls eat into the visible frame). Can't
              // be a plain `transform: translateY(...)` here because the ticker
              // keyframes below already drive `transform` for the horizontal sweep,
              // and a static transform on the element gets entirely overridden by
              // the animation rather than composing with it — so the vertical shift
              // is baked into each keyframe's own translateX(...) translateY(...)
              // pair instead (see jelly-ticker-${i} generation).
              fontFamily: DISPLAY,
              fontWeight: 900,
              // 28vh alone assumed a wide desktop viewport — on a narrow tall
              // phone (small vw, large vh) it blew up to single letters
              // wider than the screen. clamp() caps it by vw too, so it
              // scales down on narrow viewports instead of only tracking
              // height. 46vw (was 38vw, 24vw, 20vw) makes the mobile-sized
              // text much bigger/bolder behind the logo, while
              // whiteSpace:"nowrap" still guarantees it never wraps — a word
              // just runs off both edges further before crossing, same as
              // before. Desktop is unaffected since 28vh stays the winning
              // (smaller) value on wide-short viewports.
              fontSize: "clamp(3.5rem, 46vw, 28vh)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              whiteSpace: "nowrap",
              color: TICKER_RED,
              // Each word gets its OWN keyframe (jelly-ticker-0, -1, -2…) with its
              // right-to-left crossing baked in at its exact absolute slot within the
              // shared LOOP timeline, and sits off-screen left for the rest of the
              // loop. All five run the same LOOP-second duration with zero delay, so
              // they are perfectly in sync from t=0 with no risk of two words landing
              // on the same position (the failure mode of the previous
              // shared-keyframe + per-word-delay approach, where a delay larger than
              // WORD_CROSS skipped straight into every word's "parked" position).
              animation: `jelly-ticker-${i} ${LOOP}s linear infinite`,
              willChange: "transform",
            }}
          >
            {/* Inner scaleX fakes an ultra-condensed, poster-tall cut without
                shipping a condensed font. */}
            <span
              style={{
                display: "inline-block",
                transform: "scaleX(0.82)",
                transformOrigin: "center",
              }}
            >
              {p}
            </span>
          </span>
        ))}
      </div>

      {/* ── The POCCO 3D logo mark — replaces the jellyfish as the hero's central
            element. Same footage as the nav mark, played large. Rendered via
            ChromaVideo (canvas-based luminance keying) rather than CSS
            mix-blend-mode: many browsers composite <video> in its own GPU layer and
            silently ignore blend modes on the element, leaving its solid black
            background visible as an opaque box instead of blending away. ─────── */}
      <div
        className="jelly-logo-mark"
        style={{
          position: "absolute",
          left: "50%",
          // Matches the ticker text's own vertical anchor below. Both sit at 45%
          // rather than the section's true mathematical centre (50%) because the
          // fixed nav above and the audio/play controls below eat into the visual
          // frame — centring on the raw viewport height leaves the logo+ticker
          // looking low relative to that visible space.
          top: "45%",
          // Height follows the source footage's own 16:9 ratio, so it's sized up
          // by width alone — ChromaVideo's canvas has no independent aspect control
          // of its own, so the container must already be the right shape or the
          // logo stretches to fill it.
          //
          // 108vw was tuned for landscape-ish desktop viewports (108% of a WIDE
          // viewport is still smaller than 120vh there, so vh wins and the logo
          // stays huge relative to the frame). On a narrow tall phone the same
          // 108vw is much less generous relative to the ticker text behind it
          // (which scales more by vw too — see the ticker's own clamp()), so the
          // logo visibly lost its former dominance over the word ring. A mobile
          // override raises the vw multiplier so vh keeps winning down to
          // narrower screens too, preserving the same "logo as the dominant
          // shape, text sweeping behind it" balance desktop has.
          marginLeft: "calc(min(120vh, 108vw) / -2)",
          marginTop: "calc(min(120vh, 108vw) * 9 / 16 / -2)",
          width: "min(120vh, 108vw)",
          aspectRatio: "16 / 9",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <ChromaVideo
          src="/assets/pocco-logo-3d.mp4"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── Manifesto — the calm resolve. Surfaces on the RIGHT once the big type
            has cleared the frame at the loop seam, then recedes again just as the
            sequence restarts. Nearly static (a whisper of slide) so it reads as a
            quiet editorial statement against the kinetic headline. ───────────── */}
      <div
        className="jelly-manifesto-block"
        style={{
          position: "absolute",
          right: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 38,
          width: "min(22vw, 30vh)",
          textAlign: "right",
          pointerEvents: "none",
          animation: `jelly-manifesto ${LOOP}s ease-in-out 0s infinite`,
          willChange: "opacity, transform",
        }}
      >
        <p
          style={{
            margin: "1.2vh 0 0",
            fontFamily: SANS,
            fontSize: "1.35vh",
            fontWeight: 600,
            letterSpacing: "0.1em",
            lineHeight: 1.7,
            color: "rgba(245,245,245,0.82)",
            textTransform: "uppercase",
          }}
        >
          {MANIFESTO}
        </p>
      </div>

      {/* ── Side rulers ────────────────────────────────────────────────────── */}
      <SideRuler side="left" />
      <SideRuler side="right" />

      {/* ── Rotating bottom caption ────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "6vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          // 60vw measured the same ~8-9px font size on both a wide desktop
          // and a narrow phone viewport (this hero's vh is similar on both,
          // so nothing here was actually scaling with the device) — legible
          // enough on a full monitor, but under 10px is too small to read
          // comfortably on an actual phone screen held at arm's length.
          // min(60vw, 520px) keeps it from stretching edge-to-edge on a
          // narrow phone (which would force the sentence onto many cramped
          // lines instead of the intended 1-2).
          width: "min(60vw, 520px)",
          textAlign: "center",
          height: "3.4vh",
        }}
      >
        {[
          "ERES JOVEN UNA VEZ, SAL ESTA NOCHE UN POCCO",
          "LA RESACA VALE LA PENA",
          "AQUÍ NO SE VIENE A DORMIR",
        ].map((c, i) => (
          <p
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              margin: 0,
              // 1.15vh alone measured ~9px on both a wide desktop and a
              // narrow phone viewport — comfortable on a monitor, too small
              // to read on an actual phone. 11px floor keeps it readable
              // without changing the desktop size (1.15vh already clears
              // 11px there).
              fontSize: "clamp(11px, 1.15vh, 20px)",
              fontWeight: 700,
              letterSpacing: "0.16em",
              lineHeight: 1.5,
              color: "rgba(245,245,245,0.78)",
              opacity: 0,
              animation: `jelly-caption 18s ease-in-out ${i * 6}s infinite`,
              willChange: "opacity",
            }}
          >
            {c}
          </p>
        ))}
      </div>

      {/* ── Scroll cue — a quiet nudge that there's more below, sitting just
            under the rotating caption. Bounces in place (translateY) rather
            than scrolling itself, so it reads as a pointer, not more content. ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "1vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6vh",
          animation: "jelly-scroll-cue 2.2s ease-in-out infinite",
          willChange: "transform",
        }}
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" style={{ opacity: 0.6 }}>
          <path
            d="M1 1L7 7L13 1"
            stroke="#f5f5f5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Film grain overlay (above everything, never interactive). "multiply"
            (the original blend for a light background) turns invisible over black —
            multiplying by black stays black — so on this dark background "overlay"
            is used instead, which lifts and darkens around a mid grey and reads as
            texture on both light and dark content. ────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "140px 140px",
          opacity: 0.16,
          mixBlendMode: "overlay",
        }}
      />
    </section>
  );
}

/* All keyframes live here so the component is fully self-contained. */
/* One dedicated keyframe per word, each baking in its own absolute slot on the
   shared LOOP timeline: parked off-screen right until its turn, a straight
   right-to-left crossing over WORD_CROSS seconds, then parked off-screen left for
   the remainder. Consecutive words start WORD_CROSS*WORD_OVERLAP seconds apart
   (less than the full WORD_CROSS), so the next word is already entering from the
   right while the current one is still finishing its crossing on the left half —
   by the time a word reaches screen centre, the next one is coming in behind it.
   All five share the same LOOP duration and zero delay, so they read in order
   (THIS, IS, F*CKING, POCCO, C*BRON) from the very first frame — no per-word
   animation-delay is involved, which is what let two words land on the same
   "parked" position when a delay skipped past a word's crossing window. */
const JELLY_TICKER_KEYFRAMES = PHRASES.map((_, i) => {
  // Every word — including the last — gets the exact same simple keyframe shape:
  // parked off-screen right until its slot starts, one uninterrupted right-to-left
  // sweep, then parked off-screen left for the rest of the loop. Because LOOP gives
  // the last word room to finish its own sweep before the loop restarts, no word's
  // slot ever needs to cross the 100%/0% seam, so there is no special case and no
  // risk of the "two keyframes at the same %" trick behaving unexpectedly.
  const slotStart = ((WORD_STAGGER * i) / LOOP) * 100;
  const slotEnd = (slotStart + (WORD_CROSS / LOOP) * 100).toFixed(3);
  // -5vh shifts the text up from the section's true 50% grid-centre (from
  // placeItems:"center" on the parent) to match the logo's own 45% anchor. Baked
  // into every keyframe stop alongside translateX because this animation is the
  // only thing driving `transform` on the element — a separate static
  // translateY here would be replaced outright by the animation, not composed
  // with it.
  return `
@keyframes jelly-ticker-${i}{
  0%{transform:translateX(110vw) translateY(-5vh)}
  ${slotStart.toFixed(3)}%{transform:translateX(110vw) translateY(-5vh)}
  ${slotEnd}%{transform:translateX(-110vw) translateY(-5vh)}
  100%{transform:translateX(-110vw) translateY(-5vh)}
}
/* On a narrow phone the font-size clamp is driven by vw (46vw), so a word like
   "F*CKING" renders many vw units wide in nowrap — far wider than the 110vw
   travel above, which was sized for the vh-driven desktop font-size. With that
   short a travel the word's visible glyphs never fully clear the viewport
   before reversing course, reading as "stuck" mid-cross instead of sweeping
   through. Widening the travel to 320vw only under this breakpoint gives the
   much wider mobile text room to actually enter and exit. */
@media (max-width: 640px){
  @keyframes jelly-ticker-${i}{
    0%{transform:translateX(320vw) translateY(-5vh)}
    ${slotStart.toFixed(3)}%{transform:translateX(320vw) translateY(-5vh)}
    ${slotEnd}%{transform:translateX(-320vw) translateY(-5vh)}
    100%{transform:translateX(-320vw) translateY(-5vh)}
  }
}`;
}).join("\n");
const JELLY_CSS = `
${JELLY_TICKER_KEYFRAMES}

/* The manifesto rises during the calm seam (after the last phrase clears) and
   recedes as the sequence restarts — a near-static editorial whisper. */
@keyframes jelly-manifesto{
  0%,74%{opacity:0;transform:translateY(-50%) translateX(2vw)}
  81%{opacity:1;transform:translateY(-50%) translateX(0)}
  92%{opacity:1;transform:translateY(-50%) translateX(0)}
  98%,100%{opacity:0;transform:translateY(-50%) translateX(2vw)}
}

/* Three captions crossfade in sequence on an 18s cycle (6s each) */
@keyframes jelly-caption{
  0%{opacity:0}
  4%,28%{opacity:1}
  33%,100%{opacity:0}
}

@keyframes jelly-scroll-cue{
  0%,100%{ transform: translateX(-50%) translateY(0); }
  50%{ transform: translateX(-50%) translateY(5px); }
}

/* Both of these were sized as a percentage of viewport WIDTH (22vw for the
   manifesto's own box, 1.4vh of edge padding for the rulers) — fine on a wide
   desktop viewport, but on a narrow phone (large vh, small vw) the manifesto's
   box shrinks to a sliver that wraps its sentence into a dozen cramped lines
   sitting directly on top of the now much-larger ticker type (also fixed
   separately, but the two were still visually competing for the same
   limited width), and the side rulers' short vertical tick marks end up
   overlapping the ticker's letters instead of framing them. Both are purely
   decorative "lab instrument" flourishes, not load-bearing content, so the
   simplest fix that doesn't fight the vh/vw-based layout further is to hide
   them below the viewport width where they'd otherwise collide.  */
@media (max-width: 640px){
  /* !important is required here: both elements set display inline via
     React's style={} prop (the ruler uses display:"flex"), and an inline
     style always wins over a plain class rule regardless of selector
     specificity or source order — without it this rule was silently losing
     and the rulers stayed visible below 640px. */
  .jelly-manifesto-block, .jelly-side-ruler{
    display: none !important;
  }
  /* Raises the vw side of the min(120vh, Xvw) pair so vh keeps winning on
     narrow screens too — restores the logo's dominant size relative to the
     ticker text behind it, matching the desktop balance instead of shrinking
     to a fraction of the frame the word ring now fills. */
  .jelly-logo-mark{
    width: min(120vh, 220vw) !important;
    margin-left: calc(min(120vh, 220vw) / -2) !important;
    margin-top: calc(min(120vh, 220vw) * 9 / 16 / -2) !important;
  }
}

/* The fix above still isn't enough on a SHORT viewport (landscape phone, or
   just a squat browser window). Measured directly: raising the vw side
   (220vw → 320vw) did nothing there, because on a short viewport 120vh is
   the SMALLER of the two and is what min() picks either way — the vw side
   was never the constraint in that case, so pushing it further was a no-op.
   The lever that actually matters when vh is small is vh's own multiplier.
   min-aspect-ratio catches "wide relative to its own height" viewports
   (landscape phones included) regardless of raw width. */
@media (max-height: 500px) and (min-aspect-ratio: 3/2){
  .jelly-logo-mark{
    width: min(220vh, 108vw) !important;
    margin-left: calc(min(220vh, 108vw) / -2) !important;
    margin-top: calc(min(220vh, 108vw) * 9 / 16 / -2) !important;
  }
}

/* Accessibility: hold a calm, near-static frame for reduced-motion users. Freeze the
   ticker so only the FIRST phrase rests dead-centre, and hide the rest, leaving a
   single readable composition with the jellyfish. */
@media (prefers-reduced-motion: reduce){
  .jelly-loop *{
    animation-duration:.001ms !important;
    animation-iteration-count:1 !important;
  }
  .jelly-loop .jelly-phrase{
    animation:none !important;
    transform:translateX(-110vw) translateY(-5vh) !important;
  }
  .jelly-loop .jelly-phrase:first-of-type{
    transform:translateX(0) translateY(-5vh) !important;
  }
}
`;
