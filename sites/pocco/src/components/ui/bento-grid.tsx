"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * Bento-style grid: 2 equal cards on top, 3 equal cards below (matches the
 * layout of 21st.dev's "Bento" by KinfeMichael Tariku / Farm UI — that
 * component's source is locked, so this is a from-scratch reimplementation
 * of the observed layout/interaction, in POCCO's own dark/red visual
 * language, not a copy of its code).
 *
 * Kept ALIVE the same way the hero is: every card has its own perpetual
 * slow Ken-Burns drift (CSS keyframes, staggered per card via animation-delay
 * so they never move in lockstep) instead of sitting still until hovered —
 * the hero never waits for interaction to move either. Hover still adds a
 * faster, more pronounced push on top of the idle drift.
 */
export interface BentoItem {
  tag: string;
  title: string;
  description: string;
  image?: string;
  /** CSS background-position for the image, to break repeated-photo sameness across cards. */
  imagePosition?: string;
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  const topRow = items.slice(0, 2);
  const bottomRow = items.slice(2, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25vh" }}>
      <style>{KEN_BURNS_CSS}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25vh",
        }}
      >
        {topRow.map((item, i) => (
          <BentoCard key={i} item={item} index={i} />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25vh",
        }}
      >
        {bottomRow.map((item, i) => (
          <BentoCard key={i} item={item} index={i + 2} />
        ))}
      </div>
    </div>
  );
}

// Single stylesheet for the whole grid (not one <style> tag per card) — keeps
// the CSS parse/recalc work to one shot instead of 5 identical re-injections,
// which was part of what made scrolling past this section feel snagged.
const KEN_BURNS_CSS = `
@keyframes bento-kenburns-a{
  0%{ transform: translateZ(0) scale(1.02) translate(0,0); }
  50%{ transform: translateZ(0) scale(1.11) translate(-1.5%,-1%); }
  100%{ transform: translateZ(0) scale(1.02) translate(0,0); }
}
@keyframes bento-kenburns-b{
  0%{ transform: translateZ(0) scale(1.08) translate(0,0); }
  50%{ transform: translateZ(0) scale(1.02) translate(1.5%,1%); }
  100%{ transform: translateZ(0) scale(1.08) translate(0,0); }
}
`;

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const driftName = index % 2 === 0 ? "bento-kenburns-a" : "bento-kenburns-b";
  const driftDuration = 14 + (index % 3) * 3; // 14/17/20s — cards never sync up
  const driftDelay = -(index * 2.7); // negative delay: each card starts mid-cycle, not all at once

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: (index % 5) * 0.06 }}
      whileHover="hover"
      className={clsx("relative overflow-hidden")}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 14,
        aspectRatio: "4 / 5",
        background: "#0a0a0a",
        cursor: "pointer",
      }}
    >
      {item.image && (
        <motion.div
          variants={{ hover: { scale: 1.18 } }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "absolute",
            inset: "-4%",
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: item.imagePosition ?? "center",
            filter: "saturate(1.15) contrast(1.05)",
            animation: `${driftName} ${driftDuration}s ease-in-out infinite`,
            animationDelay: `${driftDelay}s`,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      )}

      {/* Dominant brand-red wash + dark falloff so cards read as POCCO's own
          language (matches the hero's radial-gradient-over-photo treatment)
          instead of a neutral black gradient. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(121,31,34,0.25) 0%, rgba(10,2,2,0.55) 55%, rgba(5,1,1,0.95) 100%)",
        }}
      />
      <motion.div
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        initial="rest"
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(121,31,34,0.32)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Film-grain overlay, matching the hero's texture treatment. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
          opacity: 0.14,
          pointerEvents: "none",
        }}
      />

      {/* Giant ghost index number, same "lab instrument" editorial move the
          hero used (its dropped "Concept / 01" corner mark) — reintroduced
          here to give each card real graphic weight instead of reading as a
          generic SaaS feature-card template. */}
      <p
        aria-hidden
        style={{
          position: "absolute",
          top: "0.5vh",
          right: "0.6rem",
          margin: 0,
          fontFamily: "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(4rem, 9vw, 7.5rem)",
          lineHeight: 1,
          color: "rgba(245,245,245,0.08)",
          letterSpacing: "-0.04em",
          pointerEvents: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </p>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "2.6vh 1.8rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#e8555a",
            margin: "0 0 0.7rem",
          }}
        >
          {item.tag}
        </p>
        <p
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
            color: "#f5f5f5",
            margin: "0 0 0.7rem",
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          {item.title}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "rgba(245,245,245,0.65)",
            margin: 0,
            lineHeight: 1.4,
            maxWidth: "34ch",
          }}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
