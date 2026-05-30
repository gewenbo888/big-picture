"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "./lang";

/* ─────────────────────────────────────────────────────────────────────────────
   COLOUR PALETTE
───────────────────────────────────────────────────────────────────────────── */
const C = {
  void950: "#07080f",
  void900: "#0c0e1a",
  void800: "#12141f",
  void700: "#1b1e30",
  flux500: "#ff6b5c",  // coral — gas A
  flux400: "#ff9b8f",
  iris500: "#8b7bff",  // violet — gas B
  iris400: "#b3a8ff",
  leaf500: "#2dd4bf",  // teal — entropy curve
  gold500: "#f5b942",  // gold — entropy curve fill
  gold400: "#ffd27a",
  plasm500: "#ff4fa3", // magenta — low-entropy past marker
  plasm400: "#ff8cc4",
  ink50:   "#f4f4fb",
  ink300:  "#a8aac6",
  ink500:  "#6c6e90",
};

/* ─────────────────────────────────────────────────────────────────────────────
   SIMULATION CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const N_PARTICLES = 60;          // total particles
const BOX_W = 1.0;               // normalised box width  [0,1]
const BOX_H = 1.0;               // normalised box height [0,1]
const PARTICLE_SPEED = 0.22;     // normalised units / second
const WALL_DAMPING = 1.0;        // elastic

// Deterministic seeding by index
function seedParticle(i: number): { x: number; y: number; vx: number; vy: number; kind: 0 | 1 } {
  // Park-Miller LCG
  const lcg = (s: number) => ((s * 48271) % 2147483647);
  let s = i * 31337 + 1;
  s = lcg(s); const r0 = (s - 1) / 2147483646;
  s = lcg(s); const r1 = (s - 1) / 2147483646;
  s = lcg(s); const r2 = (s - 1) / 2147483646;
  s = lcg(s); const r3 = (s - 1) / 2147483646;

  const kind: 0 | 1 = i < N_PARTICLES / 2 ? 0 : 1;
  // Low-entropy initial state: gas A on left quarter, gas B on right quarter
  const x = kind === 0
    ? 0.02 + r0 * 0.23          // left quarter
    : 0.75 + r0 * 0.23;        // right quarter
  const y = 0.08 + r1 * 0.84;

  // Deterministic velocity angle from seed
  const angle = r2 * Math.PI * 2;
  const speed = PARTICLE_SPEED * (0.5 + r3 * 1.0);
  return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, kind };
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  kind: 0 | 1;
}

// Boltzmann-like entropy: divide box into 8 cells, measure mixing
function computeEntropy(particles: Particle[]): number {
  const COLS = 4; const ROWS = 4; const CELLS = COLS * ROWS;
  const countA = new Float32Array(CELLS);
  const countB = new Float32Array(CELLS);
  for (const p of particles) {
    const ci = Math.min(Math.floor(p.x * COLS), COLS - 1);
    const ri = Math.min(Math.floor(p.y * ROWS), ROWS - 1);
    const cell = ri * COLS + ci;
    if (p.kind === 0) countA[cell]++; else countB[cell]++;
  }
  const na = N_PARTICLES / 2;
  const nb = N_PARTICLES / 2;
  let S = 0;
  for (let c = 0; c < CELLS; c++) {
    const fa = countA[c] / na;
    const fb = countB[c] / nb;
    if (fa > 1e-9) S += -fa * Math.log(fa);
    if (fb > 1e-9) S += -fb * Math.log(fb);
  }
  // Normalise: max S = 2 * ln(CELLS)
  return Math.min(S / (2 * Math.log(CELLS)), 1.0);
}

/* ─────────────────────────────────────────────────────────────────────────────
   DRAW: PARTICLE BOX
───────────────────────────────────────────────────────────────────────────── */
function drawBox(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  particles: Particle[],
  entropy: number,
  reversed: boolean,
  paused: boolean,
  pulse: number,
  lang: "en" | "zh",
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = C.void950;
  ctx.fillRect(0, 0, W, H);

  const PAD = W < 340 ? 12 : 18;
  const bx = PAD;
  const by = PAD;
  const bw = W - PAD * 2;
  const bh = H - PAD * 2;

  // Box border
  const borderCol = reversed ? C.iris500 : entropy < 0.18 ? C.plasm500 : C.leaf500;
  ctx.save();
  ctx.strokeStyle = `${borderCol}55`;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = borderCol;
  ctx.shadowBlur = reversed ? 10 : 4;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.restore();

  // Divider — only visible when entropy is very low (initial state)
  if (entropy < 0.25) {
    const divX = bx + bw * 0.5;
    const alpha = Math.max(0, Math.min(1, (0.25 - entropy) * 4));
    ctx.save();
    ctx.strokeStyle = `${C.ink500}${Math.round(alpha * 80).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(divX, by);
    ctx.lineTo(divX, by + bh);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Particles
  const PR = W < 340 ? 3.2 : 4.0;
  for (const p of particles) {
    const px = bx + p.x * bw;
    const py = by + p.y * bh;
    const col = p.kind === 0 ? C.flux500 : C.iris500;
    const glow = p.kind === 0 ? C.flux400 : C.iris400;

    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 5;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, py, PR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Status badge
  const badgeLabel = reversed
    ? (lang === "zh" ? "逆时间" : "REVERSED")
    : paused
    ? (lang === "zh" ? "暂停" : "PAUSED")
    : entropy < 0.18
    ? (lang === "zh" ? "低熵初态" : "LOW-ENTROPY")
    : entropy > 0.85
    ? (lang === "zh" ? "已充分混合" : "MIXED")
    : (lang === "zh" ? "演化中" : "MIXING");

  const badgeCol = reversed ? C.iris400 : entropy < 0.18 ? C.plasm400 : C.leaf500;
  const bw2 = W < 340 ? 60 : 76;
  const bh2 = 14;
  const bx2 = W - PAD - bw2;
  const by2 = PAD + 4;

  ctx.save();
  ctx.fillStyle = `${badgeCol}22`;
  ctx.strokeStyle = `${badgeCol}88`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(bx2, by2, bw2, bh2, 3);
  ctx.fill();
  ctx.stroke();
  ctx.font = `bold ${W < 340 ? 6 : 7}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = badgeCol;
  ctx.shadowColor = badgeCol;
  ctx.shadowBlur = 4;
  ctx.fillText(badgeLabel, bx2 + bw2 / 2, by2 + bh2 - 3.5);
  ctx.restore();

  // Gas A / B labels when separated
  if (entropy < 0.35) {
    const alpha = Math.max(0, Math.min(1, (0.35 - entropy) * 3));
    const aHex = Math.round(alpha * 200).toString(16).padStart(2, "0");
    ctx.save();
    ctx.font = `bold ${W < 340 ? 7.5 : 9}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.fillStyle = `${C.flux400}${aHex}`;
    ctx.fillText(lang === "zh" ? "气体A" : "Gas A", bx + bw * 0.25, by + bh - 8);
    ctx.fillStyle = `${C.iris400}${aHex}`;
    ctx.fillText(lang === "zh" ? "气体B" : "Gas B", bx + bw * 0.75, by + bh - 8);
    ctx.restore();
  }

  // Pulse ring when reversed — highlight impossibility
  if (reversed) {
    const cx2 = bx + bw / 2;
    const cy2 = by + bh / 2;
    const r = (bw < bh ? bw : bh) * 0.42;
    const ringAlpha = 0.12 + 0.08 * Math.sin(pulse * 3);
    ctx.save();
    ctx.strokeStyle = `${C.iris400}${Math.round(ringAlpha * 255).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   DRAW: ENTROPY CURVE
───────────────────────────────────────────────────────────────────────────── */
function drawEntropyCurve(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  history: number[],       // entropy values, newest last
  reversed: boolean,
  lang: "en" | "zh",
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = C.void900;
  ctx.fillRect(0, 0, W, H);

  const MX = W < 340 ? 10 : 16;
  const MY = 10;
  const plotW = W - MX * 2;
  const plotH = H - MY * 2 - 18; // room for label below

  // Axis
  ctx.save();
  ctx.strokeStyle = `${C.ink500}28`;
  ctx.lineWidth = 0.7;
  // Y axis
  ctx.beginPath();
  ctx.moveTo(MX, MY); ctx.lineTo(MX, MY + plotH); ctx.stroke();
  // X axis
  ctx.beginPath();
  ctx.moveTo(MX, MY + plotH); ctx.lineTo(MX + plotW, MY + plotH); ctx.stroke();
  ctx.restore();

  // Max-entropy dashed line
  const maxY = MY;
  ctx.save();
  ctx.strokeStyle = `${C.ink500}30`;
  ctx.lineWidth = 0.8;
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  ctx.moveTo(MX, maxY); ctx.lineTo(MX + plotW, maxY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Axis labels
  ctx.save();
  ctx.font = `7px 'JetBrains Mono', monospace`;
  ctx.fillStyle = `${C.ink500}70`;
  ctx.textAlign = "left";
  ctx.fillText(lang === "zh" ? "高熵" : "max S", MX + 2, maxY + 8);
  ctx.fillText(lang === "zh" ? "低熵" : "min S", MX + 2, MY + plotH - 2);
  ctx.restore();

  if (history.length < 2) return;

  const maxPoints = Math.min(history.length, 300);
  const slice = history.slice(history.length - maxPoints);

  // Build path
  const pts: [number, number][] = slice.map((s, i) => [
    MX + (i / (maxPoints - 1)) * plotW,
    MY + plotH - s * plotH,
  ]);

  // Fill
  const fillGrad = ctx.createLinearGradient(0, MY, 0, MY + plotH);
  fillGrad.addColorStop(0, `${C.gold500}44`);
  fillGrad.addColorStop(1, `${C.gold500}05`);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0][0], MY + plotH);
  for (const [px, py] of pts) ctx.lineTo(px, py);
  ctx.lineTo(pts[pts.length - 1][0], MY + plotH);
  ctx.closePath();
  ctx.fillStyle = fillGrad;
  ctx.fill();
  ctx.restore();

  // Stroke
  const curveCol = reversed ? C.iris500 : C.gold500;
  ctx.save();
  ctx.strokeStyle = curveCol;
  ctx.lineWidth = 1.8;
  ctx.shadowColor = curveCol;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
  ctx.restore();

  // Live entropy dot
  const last = pts[pts.length - 1];
  ctx.save();
  ctx.fillStyle = curveCol;
  ctx.shadowColor = curveCol;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(last[0], last[1], 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Bottom label
  const currentS = slice[slice.length - 1];
  ctx.save();
  ctx.font = `bold 8px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";
  ctx.fillStyle = C.gold400;
  ctx.shadowColor = C.gold400;
  ctx.shadowBlur = 4;
  ctx.fillText(
    lang === "zh"
      ? `熵 S = ${currentS.toFixed(3)}`
      : `Entropy S = ${currentS.toFixed(3)}`,
    MX,
    MY + plotH + 13,
  );
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
   ENTROPY SIM CANVAS
───────────────────────────────────────────────────────────────────────────── */
type SimMode = "forward" | "reversed" | "paused";

interface EntropyCanvasProps {
  mode: SimMode;
  lang: "en" | "zh";
  onEntropyChange: (s: number) => void;
  resetKey: number;
}

function EntropyCanvas({ mode, lang, onEntropyChange, resetKey }: EntropyCanvasProps) {
  const boxRef = useRef<HTMLCanvasElement>(null);
  const curveRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const pulseRef = useRef(0);

  const particlesRef = useRef<Particle[]>([]);
  const historyRef = useRef<number[]>([]);
  const modeRef = useRef<SimMode>(mode);
  modeRef.current = mode;
  const langRef = useRef(lang);
  langRef.current = lang;
  const onEntropyRef = useRef(onEntropyChange);
  onEntropyRef.current = onEntropyChange;

  // Initialise particles deterministically
  const initParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: N_PARTICLES }, (_, i) => ({ ...seedParticle(i) }));
    historyRef.current = [computeEntropy(particlesRef.current)];
  }, []);

  useEffect(() => {
    initParticles();
  }, [resetKey, initParticles]);

  useEffect(() => {
    const boxCanvas = boxRef.current;
    const curveCanvas = curveRef.current;
    if (!boxCanvas || !curveCanvas) return;

    const resizeBox = () => {
      const r = boxCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      boxCanvas.width = r.width * dpr;
      boxCanvas.height = r.height * dpr;
      const c = boxCanvas.getContext("2d");
      if (c) c.scale(dpr, dpr);
    };
    const resizeCurve = () => {
      const r = curveCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      curveCanvas.width = r.width * dpr;
      curveCanvas.height = r.height * dpr;
      const c = curveCanvas.getContext("2d");
      if (c) c.scale(dpr, dpr);
    };

    resizeBox();
    resizeCurve();
    const ro = new ResizeObserver(() => { resizeBox(); resizeCurve(); });
    ro.observe(boxCanvas);
    ro.observe(curveCanvas);

    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      pulseRef.current += dt * 2.0;

      const currentMode = modeRef.current;
      const paused = currentMode === "paused";
      const reversed = currentMode === "reversed";
      const sign = reversed ? -1 : 1;

      if (!paused) {
        // Step particles
        const ps = particlesRef.current;
        for (const p of ps) {
          p.x += p.vx * dt * sign;
          p.y += p.vy * dt * sign;

          // Wall collisions (elastic)
          if (p.x < 0) { p.x = -p.x; p.vx = Math.abs(p.vx) * WALL_DAMPING; }
          if (p.x > BOX_W) { p.x = 2 * BOX_W - p.x; p.vx = -Math.abs(p.vx) * WALL_DAMPING; }
          if (p.y < 0) { p.y = -p.y; p.vy = Math.abs(p.vy) * WALL_DAMPING; }
          if (p.y > BOX_H) { p.y = 2 * BOX_H - p.y; p.vy = -Math.abs(p.vy) * WALL_DAMPING; }

          // Clamp positions to avoid NaN
          if (!isFinite(p.x) || p.x < 0) p.x = 0;
          if (!isFinite(p.x) || p.x > BOX_W) p.x = BOX_W;
          if (!isFinite(p.y) || p.y < 0) p.y = 0;
          if (!isFinite(p.y) || p.y > BOX_H) p.y = BOX_H;
        }

        const S = computeEntropy(ps);
        historyRef.current.push(S);
        if (historyRef.current.length > 1200) historyRef.current.shift();
        onEntropyRef.current(S);
      }

      const entropy = historyRef.current[historyRef.current.length - 1] ?? 0;

      // Draw box
      const bCtx = boxCanvas.getContext("2d");
      if (bCtx) {
        const br = boxCanvas.getBoundingClientRect();
        drawBox(bCtx, br.width, br.height, particlesRef.current, entropy, reversed, paused, pulseRef.current, langRef.current);
      }

      // Draw curve
      const cCtx = curveCanvas.getContext("2d");
      if (cCtx) {
        const cr = curveCanvas.getBoundingClientRect();
        drawEntropyCurve(cCtx, cr.width, cr.height, historyRef.current, reversed, langRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []); // self-contained loop reads from refs

  return (
    <div className="flex flex-col gap-3">
      {/* Particle box */}
      <div
        className="relative rounded-2xl overflow-hidden border"
        style={{
          background: C.void950,
          borderColor: `${C.flux500}22`,
          boxShadow: `0 0 60px -28px ${C.flux500}33`,
        }}
      >
        <canvas
          ref={boxRef}
          className="w-full"
          style={{ height: 200 }}
          aria-label={lang === "zh" ? "粒子盒熵演化" : "Particle box entropy simulation"}
        />
      </div>

      {/* Entropy curve */}
      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          background: C.void900,
          borderColor: `${C.gold500}18`,
          boxShadow: `0 0 40px -20px ${C.gold500}33`,
        }}
      >
        <canvas
          ref={curveRef}
          className="w-full"
          style={{ height: 80 }}
          aria-label={lang === "zh" ? "实时熵曲线" : "Live entropy curve"}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function EntropyArrowViz() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);

  const [mode, setMode] = useState<SimMode>("paused");
  const [entropy, setEntropy] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const handleEntropyChange = useCallback((s: number) => {
    setEntropy(s);
  }, []);

  const handleReset = useCallback(() => {
    setMode("paused");
    setResetKey((k) => k + 1);
  }, []);

  const entropyPct = Math.round(entropy * 100);
  const isMixed = entropy > 0.82;
  const isLow = entropy < 0.22;

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ── Section header ── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono" style={{ color: C.flux500 }}>
          {L("Theme 04 · Time & Entropy", "主题04 · 时间与熵")}
        </div>
        <h2 className={`display text-3xl md:text-4xl leading-tight spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("The Arrow of Time", "时间之箭")}
        </h2>
        <p
          className={`text-sm max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{
            color: C.ink300,
            fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
          }}
        >
          {L(
            "The microscopic laws of physics are time-symmetric — they work equally well run forwards or backwards. Yet the universe has a clear direction: from order to disorder, from past to future. That arrow is not written into the laws. It comes from a single cosmic fact: the early universe began in a state of extraordinarily low entropy.",
            "微观物理定律是时间对称的——正向或逆向运行均同样有效。然而宇宙有明确的方向：从有序走向无序，从过去走向未来。这支箭并非写入定律之中。它来自一个单一的宇宙事实：早期宇宙起始于极低熵状态。",
          )}
        </p>
      </div>

      <div className="h-px rule-flux opacity-40 rounded-full" />

      {/* ── SIMULATION ── */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="label-mono" style={{ color: C.flux400 }}>
            {L("Live Entropy Simulation", "实时熵演化模拟")}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Play / Pause */}
            <button
              onClick={() => setMode((m) => m === "forward" ? "paused" : "forward")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[0.68rem] font-mono transition-all duration-200"
              style={{
                borderColor: mode === "forward" ? `${C.leaf500}88` : `${C.ink500}35`,
                background: mode === "forward" ? `${C.leaf500}18` : "transparent",
                color: mode === "forward" ? C.leaf500 : C.ink300,
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: mode === "forward" ? C.leaf500 : C.ink500 }}
              />
              {mode === "forward" ? L("Pause", "暂停") : L("Play →", "播放 →")}
            </button>

            {/* Reverse */}
            <button
              onClick={() => setMode((m) => m === "reversed" ? "paused" : "reversed")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[0.68rem] font-mono transition-all duration-200"
              style={{
                borderColor: mode === "reversed" ? `${C.iris400}88` : `${C.ink500}35`,
                background: mode === "reversed" ? `${C.iris500}18` : "transparent",
                color: mode === "reversed" ? C.iris400 : C.ink300,
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: mode === "reversed" ? C.iris400 : C.ink500 }}
              />
              {L("← Reverse", "← 逆时")}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-full border text-[0.68rem] font-mono transition-all duration-200"
              style={{
                borderColor: `${C.plasm500}45`,
                background: `${C.plasm500}0a`,
                color: C.plasm400,
              }}
            >
              {L("Reset", "重置")}
            </button>
          </div>
        </div>

        <EntropyCanvas
          mode={mode}
          lang={lang}
          onEntropyChange={handleEntropyChange}
          resetKey={resetKey}
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: L("Entropy S", "熵 S"),
              value: `${entropyPct}%`,
              color: C.gold400,
            },
            {
              label: L("State", "状态"),
              value: isLow
                ? L("Ordered", "有序")
                : isMixed
                ? L("Mixed", "已混合")
                : L("Mixing", "混合中"),
              color: isLow ? C.plasm400 : isMixed ? C.leaf500 : C.flux400,
            },
            {
              label: L("Direction", "方向"),
              value: mode === "forward"
                ? L("Forward →", "正向 →")
                : mode === "reversed"
                ? L("← Reversed", "← 逆时")
                : L("Paused", "暂停"),
              color: mode === "forward" ? C.leaf500 : mode === "reversed" ? C.iris400 : C.ink300,
            },
            {
              label: L("Particles", "粒子数"),
              value: `${N_PARTICLES}`,
              color: C.ink300,
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="panel rounded-xl px-4 py-3 flex flex-col gap-1"
              style={{ borderColor: `${color}22` }}
            >
              <span className="label-mono text-[0.56rem]" style={{ color: `${color}88` }}>
                {label}
              </span>
              <span className="font-mono text-sm font-bold" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Reversal note */}
        {mode === "reversed" && (
          <div
            className={`rounded-xl border px-4 py-3 text-[0.76rem] leading-relaxed pulse ${lang === "zh" ? "zh" : ""}`}
            style={{
              borderColor: `${C.iris500}44`,
              background: `${C.iris500}0c`,
              color: C.iris400,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "Running the velocities backwards is perfectly legal physics — the microscopic equations allow it. But watch: the particles don't spontaneously un-mix. Ordered states are astronomically rare among all possible states, so the system overwhelmingly wanders toward disorder regardless of the direction of time's arrow in the equations.",
              "逆转速度在物理上完全合法——微观方程允许这样做。但请注意：粒子并不会自发地反向分离。有序态在所有可能的状态中极为罕见，因此系统无论方程中时间箭头的方向如何，都压倒性地趋向无序。",
            )}
          </div>
        )}

        {/* Mixed note */}
        {isMixed && mode === "forward" && (
          <div
            className={`rounded-xl border px-4 py-3 text-[0.76rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{
              borderColor: `${C.gold500}33`,
              background: `${C.gold500}08`,
              color: C.gold400,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "Equilibrium reached. The gases have mixed. To restore the original separation you would need to know the exact position and velocity of every particle and reverse them perfectly — a computation of astronomical difficulty. This is why disorder is the default destination.",
              "已达到平衡。气体已充分混合。要恢复最初的分离状态，你需要知道每个粒子的精确位置和速度并完美地逆转——这是天文数字难度的计算。这就是为什么无序是默认的归宿。",
            )}
          </div>
        )}
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── PAST HYPOTHESIS PANEL ── */}
      <div className="flex flex-col gap-5">
        <div className="label-mono" style={{ color: C.plasm500 }}>
          {L("The Past Hypothesis", "过去假设")}
        </div>

        {/* Timeline strip */}
        <div
          className="panel panel-plasm rounded-2xl p-5 flex flex-col gap-4 overflow-hidden relative"
          style={{ borderColor: `${C.plasm500}28` }}
        >
          {/* Cosmic background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 8% 50%, ${C.plasm500}10, transparent 60%)`,
            }}
          />

          <div className={`display text-xl md:text-2xl leading-tight relative ${lang === "zh" ? "zh" : ""}`} style={{ color: C.plasm400 }}>
            {L(
              "Why do we remember the past and not the future?",
              "我们为何记得过去而非未来？",
            )}
          </div>

          <p
            className={`text-sm leading-relaxed max-w-2xl relative ${lang === "zh" ? "zh" : ""}`}
            style={{
              color: C.ink300,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "Memory, causation, aging, cooking, radiation — every arrow we experience rides on a single gradient: entropy was lower in the past. Our brains can only record traces of events that increase entropy (a fired neuron, an ink mark). The present is the high-entropy side of a gradient that began at the Big Bang.",
              "记忆、因果、衰老、烹饪、辐射——我们体验到的每一支箭头都依赖于一个梯度：过去的熵更低。我们的大脑只能记录那些增加熵的事件的痕迹（一个激发的神经元，一个墨水痕迹）。现在是一个始于大爆炸的梯度的高熵一侧。",
            )}
          </p>

          {/* Arrow timeline */}
          <div className="relative flex flex-col gap-2">
            {/* Track */}
            <div className="flex items-center gap-0 relative">
              {/* Low-entropy marker (Big Bang) */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0" style={{ width: 80 }}>
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 pulse"
                  style={{
                    backgroundColor: C.plasm500,
                    boxShadow: `0 0 12px ${C.plasm500}`,
                  }}
                />
                <span
                  className={`text-[0.6rem] text-center font-mono leading-tight ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.plasm400, maxWidth: 72 }}
                >
                  {L("Big Bang\nLowest entropy", "大爆炸\n最低熵")}
                </span>
              </div>

              {/* Arrow bar */}
              <div className="flex-1 relative mx-2">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${C.plasm500}cc, ${C.gold500}88, ${C.iris500}55, ${C.leaf500}44)`,
                    boxShadow: `0 0 8px ${C.gold500}44`,
                  }}
                />
                {/* Arrow head */}
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  style={{ color: C.leaf500, fontSize: 14, lineHeight: 1, marginRight: -6 }}
                >▶</div>
                {/* "Time flows →" label */}
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 label-mono"
                  style={{ fontSize: "0.48rem", color: `${C.gold400}88`, whiteSpace: "nowrap" }}
                >
                  {L("entropy increases →", "熵增加 →")}
                </div>
              </div>

              {/* High-entropy marker (now / future) */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0" style={{ width: 72 }}>
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: C.leaf500,
                    boxShadow: `0 0 8px ${C.leaf500}55`,
                    opacity: 0.7,
                  }}
                />
                <span
                  className={`text-[0.6rem] text-center font-mono leading-tight ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.leaf500, maxWidth: 68, opacity: 0.8 }}
                >
                  {L("Heat death\nMax entropy", "热寂\n最高熵")}
                </span>
              </div>
            </div>
          </div>

          {/* Carroll quote */}
          <blockquote
            className={`border-l-2 pl-4 text-[0.78rem] leading-relaxed italic relative ${lang === "zh" ? "zh" : ""}`}
            style={{
              borderColor: `${C.plasm400}55`,
              color: `${C.ink300}cc`,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "\"The arrow of time is a consequence of the fact that the universe started in a very special, low-entropy state.\" — Sean Carroll, The Big Picture",
              "「时间之箭是宇宙起始于一个非常特殊、低熵状态这一事实的结果。」——肖恩·卡罗尔，《大图景》",
            )}
          </blockquote>
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── Editorial panels ── */}
      <div className="flex flex-col gap-4">
        <div className="label-mono" style={{ color: C.gold500 }}>
          {L("Three Deep Truths", "三条深层真理")}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: L("Laws are reversible; time is not", "定律可逆，时间不可逆"),
              body: L(
                "Every equation of classical mechanics, quantum mechanics, and general relativity works identically forward and backward in time. Drop a ball — the equations describe it falling and rising with equal faithfulness. There is no preferred direction baked in. The arrow comes from elsewhere.",
                "经典力学、量子力学和广义相对论的每个方程在时间上正向和逆向运行时完全相同。扔下一个球——方程对其下落和上升的描述同样精确。其中没有预设的方向。箭头来自其他地方。",
              ),
              color: C.flux400,
            },
            {
              title: L("Entropy is statistical, not absolute", "熵是统计的，非绝对的"),
              body: L(
                "The second law of thermodynamics is not a fundamental law — it is a statement about probability. An un-mixing of gases is not forbidden; it is merely fantastically unlikely. With 10²³ particles, the waiting time exceeds the age of the universe by unimaginable factors. Unlikely becomes impossible at cosmic scale.",
                "热力学第二定律不是基本定律——它是关于概率的陈述。气体的反混合并非被禁止，只是概率极低。拥有10²³个粒子时，等待时间以难以想象的因子超过宇宙年龄。在宇宙尺度上，不可能变成了不可能。",
              ),
              color: C.gold500,
            },
            {
              title: L("Memory and causation are entropy gradients", "记忆与因果是熵梯度"),
              body: L(
                "Why can you remember breakfast but not tomorrow's lunch? Because forming a memory increases entropy (neurons fire, molecules rearrange). A universe where entropy were equally high in all directions of time would have no records of anything, no causality, no \"before\" or \"after\". The past hypothesis is what makes minds possible.",
                "为什么你能记住早餐，却记不住明天的午餐？因为形成记忆会增加熵（神经元放电，分子重排）。若熵在时间的所有方向上同样高，则任何事物都没有记录，没有因果性，没有「之前」或「之后」。过去假设使得心智成为可能。",
              ),
              color: C.iris400,
            },
          ].map(({ title, body, color }) => (
            <div
              key={title}
              className="panel rounded-xl p-4 flex flex-col gap-3"
              style={{ borderColor: `${color}22` }}
            >
              <h4
                className={`display text-base font-bold leading-snug ${lang === "zh" ? "zh" : ""}`}
                style={{ color }}
              >
                {title}
              </h4>
              <p
                className={`text-[0.76rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: C.ink300,
                  fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Closing observation ── */}
      <div
        className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
        style={{
          borderColor: `${C.plasm500}18`,
          background: `${C.plasm500}05`,
          fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
          color: `${C.ink300}cc`,
        }}
      >
        {L(
          "Time's arrow is not a property of the laws of nature. It is a property of the universe's initial conditions. We live downstream from the most improbable event imaginable — a cosmos born near perfect order. Every memory you hold, every cause that precedes its effect, every moment of aging is the universe paying down that original debt of low entropy, one irreversible transaction at a time.",
          "时间之箭不是自然规律的属性，而是宇宙初始条件的属性。我们生活在可以想象的最不可能事件的下游——一个在接近完美秩序中诞生的宇宙。你拥有的每一份记忆，每一个先于结果的原因，每一刻的衰老，都是宇宙在偿还那笔低熵的原始债务，一次不可逆的交易接着一次。",
        )}
      </div>
    </div>
  );
}
