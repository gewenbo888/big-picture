"use client";

import { useEffect, useRef } from "react";

/* CosmosField — full-bleed animated hero background for The Big Picture.
   Poetic-naturalist cosmos: a fine quantum-mote shimmer drifts and coalesces
   into a warm starfield; two slow galaxy-like swirl arms; three faint
   nebula blooms; a handful of bright accent stars — evoking "one world,
   from quantum fields to galaxies".  Calm and warm; never distracts from text.

   Palette (site bg #07080f):
     coral     #ff6b5c / #ff9b8f   quantum motes / warm near-stars
     violet    #8b7bff             cosmic iris / swirl arms
     teal      #2dd4bf             life accent stars / nebula
     gold      #f5b942             starlight gold / bright accent
   All drawn with additive blending (globalCompositeOperation="lighter")
   at very low alpha; NaN clamped at every color computation.               */

/* ── types ──────────────────────────────────────────────────────────────── */
interface Mote {
  x: number;        // 0..1 canvas fraction
  y: number;
  r: number;        // logical px radius
  a: number;        // base alpha
  vx: number;       // drift velocity, canvas-fraction/tick
  vy: number;
  tw: number;       // twinkle frequency
  phase: number;    // twinkle phase
  hue: number;      // 0=coral 1=violet 2=teal 3=gold
}

interface AccentStar {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  phase: number;
  hue: number;      // 0=coral 1=violet 2=teal 3=gold
}

interface SwirlArm {
  cx: number;       // 0..1 centre
  cy: number;
  turns: number;    // how many full turns (typically 1.5–2.5)
  lenFrac: number;  // max radius as fraction of min(w,h)
  alpha: number;
  angleOffset: number;  // starting angle (rad)
  spinRate: number;     // rad/tick  (very small)
  hue: number;      // 0=coral 1=violet
}

interface NebulaBoom {
  x: number;        // 0..1
  y: number;
  rFrac: number;    // radius as fraction of min(w,h)
  alpha: number;
  hue: number;      // 0=coral 1=violet 2=teal 3=gold
  breathPhase: number;
  breathFreq: number;
}

/* ── deterministic LCG (same contract as ElonField) ─────────────────────── */
function makeLCG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = ((s * 9301 + 49297) >>> 0) % 233280;
    return s / 233280;
  };
}

/* ── safe clamp so NaN never reaches rgba() ─────────────────────────────── */
function clamp(v: number, lo = 0, hi = 1): number {
  if (!isFinite(v)) return lo;
  return v < lo ? lo : v > hi ? hi : v;
}

/* ── palette helpers ─────────────────────────────────────────────────────── */
// Returns [r,g,b] 0-255 for hue index
function palette(hue: number): [number, number, number] {
  switch (hue & 3) {
    case 0: return [255, 107, 92];   // coral  #ff6b5c
    case 1: return [139, 123, 255];  // violet #8b7bff
    case 2: return [45,  212, 191];  // teal   #2dd4bf
    default:return [245, 185, 66];   // gold   #f5b942
  }
}

/* ── component ──────────────────────────────────────────────────────────── */
export default function CosmosField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr    = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0;

    /* ── scene state ──────────────────────────────────────────────────── */
    let motes: Mote[]           = [];
    let accentStars: AccentStar[] = [];
    let swirlArms: SwirlArm[]   = [];
    let nebulaBooms: NebulaBoom[] = [];

    /* ── resize + reinit ──────────────────────────────────────────────── */
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width  = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function init() {
      const rand = makeLCG(0x3b9e1ca7);   // fixed seed — deterministic first frame

      /* ── quantum motes (fine shimmer base) ────────────────────────── */
      const moteCount = w < 640 ? 120 : w < 1200 ? 200 : 300;
      motes = [];
      for (let i = 0; i < moteCount; i++) {
        motes.push({
          x:     rand(),
          y:     rand(),
          r:     0.25 + rand() * 0.65,
          a:     0.04 + rand() * 0.10,
          vx:    (rand() - 0.5) * 0.00008,
          vy:    (rand() - 0.5) * 0.00006 - 0.000025,  // gentle upward drift
          tw:    0.4 + rand() * 1.5,
          phase: rand() * Math.PI * 2,
          hue:   Math.floor(rand() * 4),
        });
      }

      /* ── accent stars (brighter, sparser) ─────────────────────────── */
      const starCount = w < 640 ? 50 : w < 1200 ? 80 : 120;
      accentStars = [];
      for (let i = 0; i < starCount; i++) {
        accentStars.push({
          x:     rand(),
          y:     rand(),
          r:     0.55 + rand() * 1.1,
          a:     0.12 + rand() * 0.26,
          tw:    0.2 + rand() * 0.9,
          phase: rand() * Math.PI * 2,
          // mostly warm coral / gold; occasional violet / teal
          hue:   rand() < 0.42 ? 0 : rand() < 0.6 ? 3 : rand() < 0.8 ? 1 : 2,
        });
      }

      /* ── galaxy swirl arms ─────────────────────────────────────────── */
      //  Two loose spiral arms, slow rotation, very faint
      const base = Math.min(w, h);
      swirlArms = [
        {
          cx: 0.38, cy: 0.42,
          turns: 1.8, lenFrac: 0.34, alpha: 0.07,
          angleOffset: 0.6, spinRate: 0.00015,
          hue: 1,  // violet
        },
        {
          cx: 0.62, cy: 0.55,
          turns: 1.5, lenFrac: 0.28, alpha: 0.06,
          angleOffset: 3.8, spinRate: -0.00010,
          hue: 0,  // coral
        },
      ];
      void base; // used conceptually via lenFrac * min(w,h) at draw time

      /* ── nebula blooms ─────────────────────────────────────────────── */
      nebulaBooms = [
        { x: 0.18, y: 0.22, rFrac: 0.30, alpha: 0.045, hue: 1, breathPhase: 0.0,       breathFreq: 0.00020 },
        { x: 0.82, y: 0.30, rFrac: 0.25, alpha: 0.040, hue: 0, breathPhase: 1.0,       breathFreq: 0.00015 },
        { x: 0.50, y: 0.78, rFrac: 0.35, alpha: 0.035, hue: 2, breathPhase: 2.1,       breathFreq: 0.00018 },
      ];
    }

    resize();

    /* ── draw quantum motes ─────────────────────────────────────────────── */
    function drawMotes(tick: number) {
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";
      for (const m of motes) {
        // drift wrap
        m.x += m.vx;
        m.y += m.vy;
        if (m.x < -0.02) m.x += 1.04;
        if (m.x >  1.02) m.x -= 1.04;
        if (m.y < -0.02) m.y += 1.04;
        if (m.y >  1.02) m.y -= 1.04;

        const twinkle = 0.5 + 0.5 * Math.sin(tick * 0.010 * m.tw + m.phase);
        const alpha   = clamp(m.a * (0.4 + 0.6 * twinkle));

        const [r, g, b] = palette(m.hue);
        ctx!.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    /* ── draw accent stars ──────────────────────────────────────────────── */
    function drawStars(tick: number) {
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";
      for (const s of accentStars) {
        const twinkle = 0.5 + 0.5 * Math.sin(tick * 0.008 * s.tw + s.phase);
        const alpha   = clamp(s.a * (0.55 + 0.45 * twinkle));
        const [r, g, b] = palette(s.hue);

        // soft halo for larger stars
        if (s.r > 1.0) {
          const grd = ctx!.createRadialGradient(
            s.x * w, s.y * h, 0,
            s.x * w, s.y * h, s.r * 4,
          );
          grd.addColorStop(0,   `rgba(${r},${g},${b},${(alpha * 0.35).toFixed(3)})`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx!.fillStyle = grd;
          ctx!.beginPath();
          ctx!.arc(s.x * w, s.y * h, s.r * 4, 0, Math.PI * 2);
          ctx!.fill();
        }

        // crisp core
        ctx!.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    /* ── draw galaxy swirl arms ─────────────────────────────────────────── */
    /* Each arm is a spiral curve drawn as many small additive dots along
       parametric polar coords: r(θ) = maxR * θ/(turns*2π), rendered
       as tiny radial-gradient blobs at low alpha.                          */
    function drawSwirls(tick: number) {
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      for (const arm of swirlArms) {
        arm.angleOffset += arm.spinRate;

        const cx    = arm.cx * w;
        const cy    = arm.cy * h;
        const maxR  = arm.lenFrac * Math.min(w, h);
        const [r, g, b] = palette(arm.hue);
        const totalAngle = arm.turns * Math.PI * 2;
        const STEPS = 120;

        for (let i = 0; i <= STEPS; i++) {
          const frac  = i / STEPS;
          const theta = frac * totalAngle + arm.angleOffset;
          const rad   = maxR * frac;

          const px = cx + Math.cos(theta) * rad;
          const py = cy + Math.sin(theta) * rad;

          // fade: bright near centre, dim at tips; also taper near 0
          const alphaScale = clamp(frac < 0.08 ? frac / 0.08 : 1 - (frac - 0.08) / 0.92);
          const alpha = clamp(arm.alpha * alphaScale);

          const dotR = 1.5 + frac * 3.5;

          const grd = ctx!.createRadialGradient(px, py, 0, px, py, dotR * 2.5);
          grd.addColorStop(0,   `rgba(${r},${g},${b},${alpha.toFixed(3)})`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx!.fillStyle = grd;
          ctx!.beginPath();
          ctx!.arc(px, py, dotR * 2.5, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      ctx!.restore();
      void tick;
    }

    /* ── draw nebula blooms ─────────────────────────────────────────────── */
    function drawNebulae(tick: number) {
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      for (const nb of nebulaBooms) {
        const breath  = 0.5 + 0.5 * Math.sin(tick * nb.breathFreq + nb.breathPhase);
        const alpha   = clamp(nb.alpha * (0.7 + 0.3 * breath));
        const rad     = nb.rFrac * Math.min(w, h) * (0.92 + 0.08 * breath);
        const [r, g, b] = palette(nb.hue);

        // three-stop radial: hot centre → mid glow → transparent
        const grd = ctx!.createRadialGradient(
          nb.x * w, nb.y * h, 0,
          nb.x * w, nb.y * h, rad,
        );
        const a0 = clamp(alpha * 0.55);
        const a1 = clamp(alpha * 0.18);
        grd.addColorStop(0,    `rgba(${r},${g},${b},${a0.toFixed(3)})`);
        grd.addColorStop(0.38, `rgba(${r},${g},${b},${a1.toFixed(3)})`);
        grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(nb.x * w, nb.y * h, rad, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore();
    }

    /* ── ambient vignette (keeps edges dark so text stays legible) ──────── */
    function drawVignette() {
      const grd = ctx!.createRadialGradient(
        w * 0.5, h * 0.45, Math.min(w, h) * 0.22,
        w * 0.5, h * 0.45, Math.max(w, h) * 0.82,
      );
      grd.addColorStop(0, "rgba(7,8,15,0)");
      grd.addColorStop(1, "rgba(7,8,15,0.62)");
      ctx!.fillStyle = grd;
      ctx!.fillRect(0, 0, w, h);
    }

    /* ── warm centre pulse — very faint coral heartbeat at canvas center ─── */
    let pulseTick = 0;
    function drawCentrePulse() {
      pulseTick++;
      const pulse = 0.5 + 0.5 * Math.sin(pulseTick * 0.0055);
      const alpha = clamp(0.028 + 0.018 * pulse);
      const rad   = Math.min(w, h) * (0.18 + 0.04 * pulse);
      const cx    = w * 0.50;
      const cy    = h * 0.42;

      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";
      const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, rad);
      const [r, g, b] = palette(0);  // coral
      grd.addColorStop(0,   `rgba(${r},${g},${b},${alpha.toFixed(3)})`);
      grd.addColorStop(0.5, `rgba(${r},${g},${b},${(alpha * 0.3).toFixed(3)})`);
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    /* ── main loop ──────────────────────────────────────────────────────── */
    let tick = 0;
    function frame() {
      tick++;
      ctx!.clearRect(0, 0, w, h);

      drawNebulae(tick);
      drawSwirls(tick);
      drawMotes(tick);
      drawStars(tick);
      drawCentrePulse();
      drawVignette();

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    frame();
    if (reduce) {
      // a few extra frames so motes reach their settled positions
      for (let i = 0; i < 20; i++) frame();
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
