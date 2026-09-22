"use client";

import { useEffect, useRef } from "react";

export interface ChromaVideoProps {
  src: string;
  /** Pixels at or below this luminance (0-255) become fully transparent. */
  threshold?: number;
  /** Luminance band above `threshold` over which alpha ramps in, avoiding a hard edge. */
  feather?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Plays a video whose source has a solid black background and renders it onto a
 * canvas with that black keyed out to real per-pixel transparency (by luminance,
 * frame by frame via requestVideoFrameCallback / rAF). Exists because
 * `mix-blend-mode` is not reliably applied to <video> elements across browsers —
 * many compose video in its own GPU layer, so CSS blend modes on the element are
 * silently ignored and its background shows as an opaque box instead of blending.
 */
export default function ChromaVideo({
  src,
  threshold = 24,
  feather = 20,
  className,
  style,
}: ChromaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let rafId = 0;
    // A ref-local flag rather than relying on the effect cleanup alone: React 19's
    // Strict Mode (dev only) mounts every effect twice in a mount→cleanup→mount
    // sequence. If the very first requestAnimationFrame callback from mount #1
    // fires AFTER cleanup #1 has already set `cancelled`, that's fine — but the
    // cancelAnimationFrame in cleanup #1 must actually have cancelled it, or a
    // stray frame from the first (discarded) effect instance can still schedule
    // more frames of its own via its own closure, running two draw loops at once.
    // Using a fresh `cancelled` var scoped to THIS effect call (not shared) and
    // cancelling synchronously in cleanup is sufficient — the real bug was
    // elsewhere: `video.play()` returns a Promise that can resolve after
    // cleanup, and resize() only ran from inside draw(), which never got its
    // first frame if playback hadn't actually started yet for any reason. Both
    // are addressed below by resizing as soon as metadata is available
    // (independent of playback state) and re-asserting play() defensively.
    let cancelled = false;

    function resize() {
      if (!video || !canvas) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    // Resize as soon as dimensions are known, independent of the draw loop —
    // so the canvas has the right pixel size even before the video starts
    // producing decoded frames.
    if (video.readyState >= 1) resize();
    video.addEventListener("loadedmetadata", resize);

    // iOS Safari's autoplay policy is stricter than desktop/Android Chrome
    // about a <video> that's effectively invisible — and this one always is,
    // by design (1x1px, opacity:0, only ever used as a decode source for the
    // canvas below). `muted` + `playsInline` are already set (required, but
    // NOT sufficient on iOS Safari specifically) — a bare video.play() call
    // right after mount silently no-ops there instead of throwing, so the
    // .catch(() => {}) above hid the failure rather than fixing it: the
    // canvas stayed static on its very first (black, pre-chroma-key) frame
    // forever, which is exactly the "logo doesn't rotate on iPhone" bug.
    // Retrying play() from several different points in the video element's
    // own lifecycle — not just once at mount — covers the different reasons
    // that initial call can lose the race (metadata not loaded yet, decoder
    // not ready, autoplay gate not yet lifted) without needing to detect
    // iOS specifically; it's a no-op on browsers where the first call
    // already succeeded, since play() on an already-playing video is safe.
    const tryPlay = () => {
      const p = video.play();
      if (p) p.catch(() => {});
    };
    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    // Last-resort fallback: iOS Safari can also require the play() call to
    // happen inside a real user-gesture handler the first time, with no
    // earlier programmatic call ever succeeding — a one-time listener on the
    // page's first touch/click retries once more from directly inside that
    // gesture, then removes itself either way.
    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
    };
    window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("pointerdown", onFirstInteraction, { once: true });

    function draw() {
      if (cancelled || !video || !canvas || !ctx) return;
      // `video.seeking` guards the loop restart: when a looping <video>
      // wraps back to time 0, the browser briefly reports readyState>=2
      // again before the seek to the start has actually settled — drawing
      // during that window can capture a stale/blank decoder frame, which
      // (having no video content) reads as fully opaque white once fed
      // through the same chroma-key loop below (luma high everywhere,
      // alpha untouched), showing up as a hard white rectangle right at the
      // loop seam. Skipping the draw for that one frame and reusing
      // whatever's already on the canvas is invisible at 60fps.
      if (video.readyState >= 2 && !video.seeking) {
        resize();
        if (canvas.width && canvas.height) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;
          for (let i = 0; i < data.length; i += 4) {
            const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            if (luma <= threshold) {
              data[i + 3] = 0;
            } else if (luma < threshold + feather) {
              data[i + 3] = Math.round(((luma - threshold) / feather) * 255);
            }
          }
          ctx.putImageData(frame, 0, 0);
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", resize);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
      cancelAnimationFrame(rafId);
    };
  }, [threshold, feather]);

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
