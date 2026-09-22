"use client";

// Big letter-by-letter reveal: springs in one letter at a time, and hovering
// any letter pans one of the club's own photos across it (bg-clip-text
// style) instead of showing plain white. The looping club-ambience video
// (the laser/smoke footage also used briefly as Galería's background) plays
// continuously "inside" every letter using the same background-clip:text
// trick already used for the hover photos — CSS can't background-clip:text
// a <video> element directly, so a hidden <video> is decoded frame-by-frame
// onto an offscreen <canvas>, and each letter's own background-image is set
// to that canvas's current frame (as a data URL) on a rAF loop. This is
// heavier than a plain CSS background, but it's the only reliable way to
// get "video content clipped to arbitrary text glyphs" across browsers —
// mix-blend-mode can't produce a hard clip to glyph shapes, and an SVG
// mask-image would need to keep an inline SVG's <text> in exact sync with
// the real DOM text's font/size/wrapping at every breakpoint, which is
// fragile compared to reusing the box each letter <span> already has.
// Reimplemented from a reference component (a generic shadcn/Tailwind
// "RevealText" briefed by the user, which used a solid red sweep-highlight
// instead of any of this) from scratch in this project's own
// plain-inline-styles + framer-motion convention — this codebase has no
// Tailwind/shadcn/cn() utility. Extracted as its own component (rather than
// a full <section>) so it can be embedded inline within another section
// (see HallOfFameSection, where it sits right above the spinning logo) as
// well as used standalone.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

/* Cycled per letter (index % length) for the hover reveal — same club
   photos used elsewhere on the site, not stock imagery. */
const LETTER_IMAGES = [
  "/assets/gallery/pocco-01.webp",
  "/assets/gallery/pocco-02.webp",
  "/assets/gallery/pocco-03.webp",
  "/assets/gallery/pocco-05.webp",
  "/assets/gallery/pocco-08.webp",
  "/assets/gallery/pocco-10.webp",
];

const LETTER_DELAY = 0.06;

export function RevealText({ text }: { text: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let cancelled = false;

    function draw() {
      if (cancelled || !video || !canvas || !ctx) return;
      if (video.readyState >= 2 && video.videoWidth) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0);
        // toDataURL every frame is what makes this technique costly, but
        // background-image is the only way to feed a bitmap into
        // background-clip:text — there's no way to point it at a raw
        // canvas element the way an <img> could reference an object URL
        // for a static image, since this needs to keep updating live.
        setFrameUrl(canvas.toDataURL("image/jpeg", 0.6));
      }
      rafId = requestAnimationFrame(draw);
    }

    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => {});
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Hidden source video — never shown directly, only sampled onto the
          canvas above. display:none would stop it decoding in some
          browsers, so it's shrunk to 1px and visually hidden instead. */}
      <video
        ref={videoRef}
        src="/assets/hall-of-fame/club-ambience.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div
        className="reveal-text-row"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {text.split("").map((letter, index) => {
          const isSpace = letter === " ";
          return (
            <motion.span
              key={index}
              onMouseEnter={() => !isSpace && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="reveal-text-letter"
              style={{
                position: "relative",
                display: "inline-block",
                overflow: "hidden",
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: "clamp(28px, 8vw, 110px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                cursor: isSpace ? "default" : "pointer",
                width: isSpace ? "0.4em" : undefined,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * LETTER_DELAY,
                type: "spring",
                damping: 8,
                stiffness: 200,
                mass: 0.8,
              }}
            >
              {/* Base layer: the looping club-ambience video, live, clipped
                  to this letter's own glyph via background-clip:text — the
                  section's default look now, not just a hover state. */}
              {!isSpace && frameUrl && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    color: "transparent",
                    backgroundImage: `url(${frameUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  {letter}
                </span>
              )}
              {/* Fallback plain white glyph — shown for spaces (no video
                  fill needed) and for an instant before the first video
                  frame has decoded, so there's never a blank letter. */}
              {(isSpace || !frameUrl) && (
                <span style={{ position: "absolute", inset: 0, color: "#f5f5f5" }}>
                  {letter}
                </span>
              )}

              {/* Photo-filled text layer, panning in on hover — takes over
                  from the video fill while hovered. */}
              {!isSpace && (
                <motion.span
                  style={{
                    position: "relative",
                    color: "transparent",
                    backgroundImage: `url(${LETTER_IMAGES[index % LETTER_IMAGES.length]})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    backgroundPosition: hoveredIndex === index ? "70% center" : "50% center",
                  }}
                  transition={{
                    opacity: { duration: 0.1 },
                    backgroundPosition: { duration: 3, ease: "easeInOut" },
                  }}
                >
                  {letter}
                </motion.span>
              )}
            </motion.span>
          );
        })}
      </div>

      <style>{`
        /* On a narrow phone, 8vw of a small viewport keeps each letter's
           own font-size (and therefore its natural width) small relative to
           its height, reading as a cramped, thin word rather than a bold
           display headline. Widening the letters via letter-spacing (not
           font-size, which is left alone here) makes the word occupy more
           of the screen width without changing how tall/heavy each glyph
           itself looks. */
        @media (max-width: 640px) {
          .reveal-text-letter {
            letter-spacing: 0.02em !important;
          }
          /* Stretches every letter taller (not wider - scaleY only) so the
             word fills more of the screen vertically on a narrow phone.
             Applied to the row wrapping all the letters, not to each
             .reveal-text-letter motion.span individually - those already
             have their own framer-motion-driven transform:scale(...) from
             the spring-in animation, and a second static transform on the
             same element would fight that instead of composing with it.
             transform-origin:center bottom keeps the row's own baseline
             anchored in place as it grows, rather than the stretch pushing
             the whole line upward. */
          .reveal-text-row {
            transform: scaleY(1.35);
            transform-origin: center bottom;
          }
        }
      `}</style>
    </div>
  );
}
