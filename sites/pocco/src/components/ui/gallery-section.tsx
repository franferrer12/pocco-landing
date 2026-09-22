"use client";

// Scroll-driven parallax gallery: three columns of photos drift vertically at
// different speeds as the visitor scrolls through a tall (300vh) section,
// while the columns themselves stay pinned mid-viewport (position: sticky)
// for the whole scroll range — reads as the wall of photos gliding past
// rather than the page just scrolling over a static grid. Inspired by the
// "Animated Gallery" pattern on 21st.dev (ContainerScroll / GalleryCol /
// GalleryContainer); that component's source is its own set of building
// blocks we don't have, so this is a from-scratch reimplementation of the
// observed scroll-parallax behavior in POCCO's own dark/red visual language,
// not a copy of its code.
//
// Real event photos live in public/assets/gallery/ — shot on location at the
// club (laser/smoke, the neon "POCCO Club" sign, the DJ booth). The pool
// below only lists files that actually exist there; it's shorter than the
// grid's own tile count (currently 7 photos for ~10-12 visible tiles), so
// tiles are filled by cycling through the pool in order and wrapping back to
// the start once exhausted (see distributeToColumns) — every photo gets used
// once before any repeats, rather than some fixed per-column list going
// stale the moment a file is added or removed from the folder.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

type Tile = { src: string; position?: string };

/* Keep in sync with the actual contents of public/assets/gallery/. Order
   matters only in that it's the cycling order tiles get filled in. */
const PHOTOS: Tile[] = [
  { src: "/assets/gallery/pocco-01.webp", position: "center 35%" },
  { src: "/assets/gallery/pocco-02.webp" },
  { src: "/assets/gallery/pocco-03.webp" },
  { src: "/assets/gallery/pocco-05.webp", position: "center 30%" },
  { src: "/assets/gallery/pocco-08.webp" },
  { src: "/assets/gallery/pocco-10.webp" },
];

/* Fills `columnSizes` (one entry per column, its tile count) by cycling
   through `photos` row-by-row ACROSS columns (col0-row0, col1-row0,
   col2-row0, col0-row1, ...) rather than filling one whole column before
   moving to the next — so a repeat, once the pool is smaller than the tile
   count, lands in a different column than its first appearance rather than
   stacking multiple copies into one already-filled column. Columns scroll
   past each other at different parallax speeds, so at any moment the
   visible tiles are a mix of rows from all three columns; interleaving by
   row keeps same-row tiles always distinct and spreads repeats as far apart
   as the pool allows instead of clustering them.
   On top of that, each column individually refuses to place a photo it
   already contains — with a pool smaller than a column's own height (e.g. 6
   photos into a 4-tall column), the naive cycle would wrap and repeat
   within that same column while other columns still have unused photos
   available; skipping to the next not-yet-used-in-this-column photo avoids
   that near-guaranteed on-screen duplicate. */
function distributeToColumns(photos: Tile[], columnSizes: number[]): Tile[][] {
  const columns: Tile[][] = columnSizes.map(() => []);
  const maxRows = Math.max(...columnSizes);
  let cursor = 0;
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < columnSizes.length; col++) {
      if (row >= columnSizes[col]) continue;
      let candidate = photos[cursor % photos.length];
      let lookahead = 0;
      while (columns[col].includes(candidate) && lookahead < photos.length) {
        lookahead++;
        candidate = photos[(cursor + lookahead) % photos.length];
      }
      columns[col].push(candidate);
      cursor++;
    }
  }
  return columns;
}

const [COL_1, COL_2, COL_3] = distributeToColumns(PHOTOS, [3, 3, 4]);

function GalleryTile({ tile }: { tile: Tile }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "4 / 5",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "#0a0a0a",
      }}
    >
      <Image
        src={tile.src}
        alt=""
        fill
        quality={90}
        // Every tile needs to load eagerly, not lazily: this section's
        // photos don't reveal themselves via normal document scroll — they
        // live inside a position:sticky box and are shifted around purely
        // by a transform (the parallax columns), so their actual DOM
        // position never moves into the viewport the way lazy-loading's
        // IntersectionObserver expects. With default lazy loading, tiles
        // whose untransformed layout position started off-screen (most of
        // them, since the columns are offset by up to ±220px on load) never
        // got their real `src` assigned, showing up as empty dark boxes
        // that were never going to load no matter how the parallax moved
        // them — because the layout box itself doesn't move, only its
        // painted position does. `priority` (not just loading="eager") is
        // what actually disables next/image's own IntersectionObserver-based
        // lazy mount — eager alone still left it gating the real `src`.
        priority
        // Tiles sit in a 3-column grid capped at max-width:1100, so a tile's
        // real CSS width tops out around 352px. `sizes` is what Next uses to
        // pick a srcset candidate — the browser is supposed to multiply this
        // by its own devicePixelRatio when choosing, but that only helps if
        // Next's candidate list actually reaches that far, and relying on
        // DPR detection at all means a screen that under-reports it (some
        // headless/embedded browser contexts do) silently gets served a
        // soft, under-resolved image with no visible warning. Deliberately
        // declaring ~2x the true CSS width sidesteps that: it forces Next to
        // pick a meaningfully higher-resolution candidate unconditionally,
        // which costs some extra bytes but guarantees these photos (the
        // whole point of the section) read as sharp on any display.
        sizes="(max-width: 640px) 66vw, 720px"
        style={{ objectFit: "cover", objectPosition: tile.position ?? "center" }}
      />
    </div>
  );
}

function GalleryColumn({
  tiles,
  progress,
  range,
  offsetClass,
}: {
  tiles: Tile[];
  progress: MotionValue<number>;
  range: [number, number];
  offsetClass?: string;
}) {
  const y = useTransform(progress, [0, 1], range);
  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.4vh",
        y,
      }}
      className={offsetClass}
    >
      {tiles.map((tile, i) => (
        <GalleryTile key={i} tile={tile} />
      ))}
    </motion.div>
  );
}

// Extra scroll distance (px) added on top of the grid's own rendered height,
// purely so the sticky box has room to stay pinned while the parallax
// columns run their crossing before releasing — see the effect below for
// why this can't just be a vh value applied directly to the driver.
const EXTRA_SCROLL_PX = 90;

export default function GallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  // position:sticky only has room to pin while its parent is TALLER than
  // the sticky element itself — that margin is what the browser lets it
  // stay fixed for. Both were previously sized independently in vh, which
  // worked by coincidence when the grid happened to be taller than a 100vh
  // parent, but broke (sticky never pinned at all, just scrolled normally)
  // once the grid's real height came in shorter than the driver's own vh
  // value: the driver would then shrink to fit its sticky child (since
  // neither had a hard height), leaving virtually no parent-vs-child gap
  // for sticky to use. Measuring the grid's actual rendered height and
  // setting the driver to exactly (that + EXTRA_SCROLL_PX) guarantees a
  // real, correctly-sized margin on every viewport, independent of how
  // tall the grid itself turns out to be.
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new ResizeObserver((entries) => {
      setGridHeight(entries[0].contentRect.height);
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // window isn't available during SSR, so this starts null and is filled in
  // after mount — the sticky's maxHeight falls back to a plain "100vh"
  // string (below) until then, which is a fine first-paint value anyway.
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  useEffect(() => {
    const updateViewportHeight = () => setViewportHeight(window.innerHeight);
    updateViewportHeight();
    // Debounced rather than reacting to every resize event directly: mobile
    // Safari's address bar collapsing/expanding while the user scrolls
    // fires resize repeatedly mid-gesture, and each one was re-rendering
    // this whole section (including the parallax columns' transforms) right
    // in the middle of the touch — part of what read as the columns
    // stuttering/jumping ahead of the finger. A real device rotation or
    // window resize still lands well within 150ms of settling, so this
    // doesn't lose any genuine resize.
    let timeoutId: number | undefined;
    const onResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateViewportHeight, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      id="galeria"
      style={{ position: "relative", background: "#000", padding: "0 6vw" }}
    >
      <div
        className="gallery-header"
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "11vh 0 9vh",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#e21212",
            marginBottom: "1.2rem",
          }}
        >
          Galería
        </p>
        <h2
          style={{
            fontFamily: DISPLAY,
            // 52px floor (was 40px) — on a narrow phone 8vw alone shrinks
            // the title well below Eventos' own H2 next to it, reading as
            // proportionally smaller/less confident despite sharing the
            // same clamp() formula; the higher floor keeps it decisive
            // there too while the 96px ceiling still governs desktop.
            fontSize: "clamp(52px, 8vw, 96px)",
            fontWeight: 900,
            color: "#f5f5f5",
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          ASÍ SE VIVE
          <br />
          POCCO.
        </h2>
      </div>

      {/* Driver height is set explicitly from the measured grid height (see
          the ResizeObserver above) rather than a vh value, so it's always
          exactly (grid height + EXTRA_SCROLL_PX) regardless of viewport
          shape — this is what gives position:sticky a real, correctly-sized
          margin to pin within. Until the first measurement lands,
          gridHeight is null and the driver falls back to 100vh so there's
          no zero-height flash. */}
      <div
        ref={scrollRef}
        style={{
          position: "relative",
          height: gridHeight != null ? gridHeight + EXTRA_SCROLL_PX : "100vh",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            // Capped at 100vh so an unusually tall grid still can't push the
            // sticky box past the viewport itself — on any shorter grid,
            // gridHeight (measured) governs instead.
            maxHeight:
              gridHeight != null && viewportHeight != null
                ? Math.min(gridHeight, viewportHeight)
                : "100vh",
            display: "flex",
            alignItems: "flex-start",
            overflow: "hidden",
          }}
          className="gallery-sticky"
        >
          <div
            ref={gridRef}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.4vw",
              width: "100%",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <GalleryColumn tiles={COL_1} progress={scrollYProgress} range={[-160, 160]} />
            <GalleryColumn
              tiles={COL_2}
              progress={scrollYProgress}
              range={[220, -220]}
              offsetClass="gallery-col-mid"
            />
            <GalleryColumn tiles={COL_3} progress={scrollYProgress} range={[-120, 120]} />
          </div>
        </div>
      </div>

      <style>{`
        /* Middle column starts pushed down so the three columns don't align
           into a flat grid — matches the reference's staggered-column feel. */
        .gallery-col-mid { margin-top: 10vh; }
        @media (max-width: 640px) {
          /* Reduced from 6vh — on a narrow phone only ~3 tiles are visible
             per column at once, so a large offset on the middle column
             left a big empty black gap above it instead of reading as a
             deliberate stagger. A smaller nudge keeps a bit of the
             asymmetry without that dead space. */
          .gallery-col-mid { margin-top: 2vh; }
          /* Same fix as .events-section: the fixed nav eats proportionally
             more of a narrow phone's viewport, so the header needs more
             clearance there than desktop's own padding-top. */
          .gallery-header { padding-top: 8vh !important; }
        }
      `}</style>
    </section>
  );
}
