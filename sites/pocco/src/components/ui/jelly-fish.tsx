"use client";

// Fonts: the heavy display headline + all UI text use Inter (Google Font, here at
// weights 500/600/900). Load it in your project for an exact match; without it the
// headline falls back to Helvetica Neue / Arial Black and the UI to a system sans.
//
// Dependencies: the jellyfish is a real procedural 3D creature (a shaded bell +
// shader-driven tentacles), so this scene uses react-three-fiber + three. Install
// them first:   npm i three @react-three/fiber
// Everything else is inline — all @keyframes live in the one injected <style>
// block, there are no Tailwind classes, and there are no image files to ship.

import type { CSSProperties } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import ChromaVideo from "./chroma-video";
import { PillNav } from "./pill-nav";
import * as THREE from "three";

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

/* ═══════════════════════ The procedural 3D jellyfish ═══════════════════════
   A jellyfish recreated ENTIRELY IN CODE (react-three-fiber + custom GLSL) — no
   footage, no model file, no textures. The bell is a shaded dome with radial ribs,
   a mottled/speckled margin, an iridescent fresnel rim and an inner bioluminescent
   glow; long tentacles and frilly oral arms undulate via a vertex-shader traveling
   wave. Front-facing (gentle bob + pulse + sway); the canvas is transparent so the
   orbiting words show through behind. ───────────────────────────────────────── */

/* One shared time value drives every shader so the whole creature stays in sync. */
function useTime() {
  const t = useRef({ value: 0 });
  useFrame((s) => (t.current.value = s.clock.elapsedTime));
  return t.current;
}

/* ── The bell ───────────────────────────────────────────────────────────────── */
const BELL_VERT = /* glsl */ `
  varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
  void main(){
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const BELL_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
  }

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float fres = pow(1.0 - max(dot(N,V),0.0), 2.4);

    float h = clamp((vPos.y + 0.40)/1.40, 0.0, 1.0);  // 1 apex → 0 margin
    float ang = atan(vPos.z, vPos.x);                 // -pi..pi

    // vertical colour gradient: magenta apex → pink → lilac margin
    vec3 top  = vec3(0.72, 0.26, 0.60);
    vec3 mid  = vec3(0.85, 0.42, 0.78);
    vec3 edge = vec3(0.74, 0.60, 0.93);
    vec3 col = mix(edge, mid, smoothstep(0.0,0.5,h));
    col = mix(col, top, smoothstep(0.45,1.0,h));

    // radial ribs (meridians) — fade out at apex and margin
    float ribs = abs(fract(ang/(2.0*3.14159265)*18.0) - 0.5) * 2.0;
    float ribLine = smoothstep(0.80, 0.99, ribs);
    float ribMask = smoothstep(0.98,0.55,h) * smoothstep(-0.02,0.22,h);
    col *= 1.0 - ribLine * 0.55 * ribMask;

    // The inward-facing back wall is also drawn (DoubleSide). Left alone its dark
    // margin mottling punches a hard, wobbling shadow band through the translucent
    // dome — so on back faces we drop the mottling and fade the wall right down, and
    // it reads as a faint translucent hint instead of an unstable shadow.
    float backw = gl_FrontFacing ? 1.0 : 0.0;

    // mottled / speckled dark band around the margin
    float band = smoothstep(0.34, 0.02, h);
    float spots = noise(vec2(ang*7.0, h*12.0));
    float wart = smoothstep(0.58, 0.86, spots) * band;
    col = mix(col, vec3(0.30,0.10,0.18), wart*0.85*backw);

    // iridescent rim + inner glow
    col += fres * vec3(0.26, 0.18, 0.48);
    col += (1.0 - fres) * vec3(0.20,0.05,0.15) * (0.5 + 0.5*h);

    float alpha = 0.50 + fres*0.45 + ribLine*ribMask*0.22 + wart*0.35*backw;
    alpha *= mix(0.30, 1.0, backw);
    alpha = clamp(alpha, 0.0, 0.96);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Bell({ time }: { time: { value: number } }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BELL_VERT,
        fragmentShader: BELL_FRAG,
        uniforms: { uTime: time },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [time]
  );
  return (
    <mesh material={mat} scale={[1, 0.84, 1]}>
      <sphereGeometry args={[1, 160, 160, 0, Math.PI * 2, 0, 1.98]} />
    </mesh>
  );
}

/* Inner bioluminescent core — additive glow that reads through the translucent bell. */
function Glow() {
  return (
    <mesh position={[0, 0.18, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color={"#ff6fbf"}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── Undulating strands (tentacles + oral arms) ─────────────────────────────── */
const STRAND_VERT = /* glsl */ `
  uniform float uTime; uniform float uLen; uniform float uPhase; uniform float uAmp; uniform float uFreq;
  varying float vK; varying vec3 vNormal; varying vec3 vView; varying float vWorldY;
  void main(){
    vec3 p = position;
    float k = clamp(-p.y / uLen, 0.0, 1.0);   // 0 at top, 1 at drifting tip
    float amp = k*k*uAmp;
    p.x += sin(uTime*1.5 + k*uFreq + uPhase) * amp;
    p.z += cos(uTime*1.2 + k*uFreq*0.9 + uPhase*1.3) * amp;
    vK = k;
    vWorldY = (modelMatrix * vec4(p,1.0)).y;     // height in the scene, for the dissolve
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const STRAND_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uTop; uniform vec3 uTip; uniform float uOpacity; uniform vec2 uFade; uniform vec2 uFadeTop;
  varying float vK; varying vec3 vNormal; varying vec3 vView; varying float vWorldY;
  void main(){
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)),0.0), 1.6);
    // Dissolve to nothing as the strand drops below the frame, so it trails off into
    // wispy tips instead of being clipped flat at the bottom edge. (uFade.x = lower /
    // fully gone, uFade.y = upper / still solid.)
    // A matching dissolve at the TOP hides each strand's attachment up inside the
    // bell, so they appear to emerge from within it rather than join at a hard, flat
    // ring under the dome. (uFadeTop.x = lower / fully solid, .y = upper / gone.)
    float vis = smoothstep(uFade.x, uFade.y, vWorldY)
              * smoothstep(uFadeTop.y, uFadeTop.x, vWorldY);
    vec3 col = mix(uTop, uTip, vK) + fres*0.25;
    float alpha = ((1.0 - vK*0.92) * uOpacity + fres*0.12) * vis;
    gl_FragColor = vec4(col, clamp(alpha,0.0,1.0));
  }
`;

function strandGeometry(length: number, thickness: number, curl: number) {
  const seg = 40;
  const radial = 6;
  const spine: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    spine.push(new THREE.Vector3(Math.sin(t * 3) * curl * t, -t * length, Math.cos(t * 2) * curl * t));
  }
  const curve = new THREE.CatmullRomCurve3(spine);
  const frames = curve.computeFrenetFrames(seg, false);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const p = curve.getPointAt(t);
    const r = thickness * (1 - Math.pow(t, 0.75));
    const Nf = frames.normals[i];
    const Bf = frames.binormals[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      pos.push(
        p.x + (c * Nf.x + s * Bf.x) * r,
        p.y + (c * Nf.y + s * Bf.y) * r,
        p.z + (c * Nf.z + s * Bf.z) * r
      );
    }
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Strand({
  time,
  angle,
  radius,
  yOffset,
  length,
  thickness,
  curl,
  amp,
  freq,
  phase,
  top,
  tip,
  opacity,
}: {
  time: { value: number };
  angle: number;
  radius: number;
  yOffset: number;
  length: number;
  thickness: number;
  curl: number;
  amp: number;
  freq: number;
  phase: number;
  top: string;
  tip: string;
  opacity: number;
}) {
  const geometry = useMemo(() => strandGeometry(length, thickness, curl), [length, thickness, curl]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: STRAND_VERT,
        fragmentShader: STRAND_FRAG,
        uniforms: {
          uTime: time,
          uLen: { value: length },
          uPhase: { value: phase },
          uAmp: { value: amp },
          uFreq: { value: freq },
          uTop: { value: new THREE.Color(top) },
          uTip: { value: new THREE.Color(tip) },
          uOpacity: { value: opacity },
          // Dissolve window (world Y): solid above .y, fully gone below .x.
          uFade: { value: new THREE.Vector2(-1.85, -0.7) },
          // Top dissolve (world Y): solid at/below .x, fully hidden at/above .y — so
          // the attachment is tucked up under the bell rim (~ -0.34).
          uFadeTop: { value: new THREE.Vector2(-0.62, -0.22) },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [time, length, phase, amp, freq, top, tip, opacity]
  );
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return <mesh geometry={geometry} material={mat} position={[x, yOffset, z]} />;
}

/* The whole creature. It stays put in the centre; the only big motion is a steady
   turn locked to the word-ring's LOOP, which reads as the CAMERA orbiting the whole
   scene (the words form as we come round, and we see every side of the bell too). A
   faint pulse + bob keep it alive in place. */
function Jelly({ loop }: { loop: number }) {
  const time = useTime();
  const grp = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // One revolution per LOOP, same direction as the CSS word orbit (rotateY 0 → -360).
    grp.current.rotation.y = -(t / loop) * Math.PI * 2;
    grp.current.position.y = Math.sin(t * 0.6) * 0.08;
    const k = Math.sin(t * 1.7);
    grp.current.scale.set(1 + k * 0.05, 1 - k * 0.06, 1 + k * 0.05);
  });

  const tentacles = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({ angle: (i / 28) * Math.PI * 2, phase: i * 0.5 })),
    []
  );
  const arms = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({ angle: (i / 8) * Math.PI * 2, phase: i * 1.0 + 0.4 })),
    []
  );

  return (
    <group ref={grp}>
      <Bell time={time} />
      <Glow />
      {/* Long, thin marginal tentacles */}
      {tentacles.map((s, i) => (
        <Strand
          key={`t${i}`}
          time={time}
          angle={s.angle}
          radius={0.82}
          yOffset={-0.25}
          length={4.2}
          thickness={0.016}
          curl={0.05}
          amp={0.5}
          freq={7.0}
          phase={s.phase}
          top={"#e9b6e6"}
          tip={"#f3d9f0"}
          opacity={0.55}
        />
      ))}
      {/* Frilly, fuller oral arms clustered under the centre */}
      {arms.map((s, i) => (
        <Strand
          key={`a${i}`}
          time={time}
          angle={s.angle}
          radius={0.22}
          yOffset={-0.1}
          length={2.0}
          thickness={0.07}
          curl={0.14}
          amp={0.32}
          freq={10.0}
          phase={s.phase}
          top={"#f7d6ef"}
          tip={"#e79fd8"}
          opacity={0.72}
        />
      ))}
    </group>
  );
}

/* The transparent 3D canvas holding the jellyfish. Exported so it can be dropped in
   on its own too; the hero below renders it at the hub of the word-ring. */
export function Jellyfish3D({ loop = 20 }: { loop?: number }) {
  return (
    <Canvas
      flat
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 6], fov: 34 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={1} />
      <Jelly loop={loop} />
    </Canvas>
  );
}

function SideRuler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
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
            backgroundImage: "url('/assets/hero-main.jpg')",
            backgroundSize: "170% auto",
            backgroundPosition: "85% center",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px)",
            transform: "scale(1.06)",
          }}
        />
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

      {/* ── Top nav ───────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          padding: "2.4vh 2.6vw",
          // Pins the header to the same overall height/vertical position it had
          // with the 5vh-tall logo mark still in it — without this, the header
          // shrinks to fit just the (shorter) pill nav and the whole bar sits
          // higher/tighter against the top edge than before.
          minHeight: "calc(5vh + 4.8vh)",
          color: "#f5f5f5",
        }}
      >
        {/* Absolutely centred on the full header width — the nav is the only
            content in the header now that the top-left video logo mark has
            been removed. */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <PillNav />
        </div>
      </header>

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
              fontSize: "28vh",
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
          width: "60vw",
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
              fontSize: "1.15vh",
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
