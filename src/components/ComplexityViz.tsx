"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   ComplexityViz — Theme 06: The Origin of Complexity & Life
   Free-energy gradient canvas: hot Sun ↔ cold Space with flowing energy.
   Convection cells → self-organizing proto-life-like structures emerge when
   gradient is right, proving life accelerates entropy — NOT violating the
   second law. Gradient slider lets user dial up/down and watch complexity
   appear or collapse. Side panel shows the cell's entropy accounting.
   HONEST: the thermodynamic WHY is understood; ABIOGENESIS remains unsolved.
═══════════════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas) ──────────────────────────────────────── */
const C = {
  void950:  "#07080f",
  void900:  "#0c0e1a",
  void800:  "#12141f",
  void700:  "#1b1e30",
  flux500:  "#ff6b5c",  // heat / Sun
  flux400:  "#ff9b8f",
  iris500:  "#8b7bff",  // cold sink / space
  iris400:  "#a99bff",
  leaf500:  "#2dd4bf",  // emergent life / complexity
  leaf400:  "#6ee7d6",
  gold500:  "#f5b942",  // free energy
  gold400:  "#ffd27a",
  plasm500: "#ff4fa3",  // abiogenesis-unsolved caveat
  plasm400: "#ff8cc4",
  ink50:    "#f4f4fb",
  ink300:   "#a8aac6",
  ink500:   "#6c6e90",
};

/* ── deterministic seeded RNG ────────────────────────────────────────────── */
function seeded(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/* safe hex color with clamped alpha string (no NaN) */
function hexAlpha(hex: string, alpha: number): string {
  const a = clamp(isNaN(alpha) ? 0 : alpha, 0, 1);
  const byte = Math.round(a * 255).toString(16).padStart(2, "0");
  return hex + byte;
}

/* ── convection cell data (deterministic) ───────────────────────────────── */
interface Cell {
  cx: number;  // fraction 0–1
  cy: number;
  r: number;   // fraction
  phase: number;
  speed: number;
  complexity: number; // 0–1 internal "order" level
}

const CELLS: Cell[] = Array.from({ length: 9 }, (_, i) => ({
  cx: 0.12 + (i % 3) * 0.28 + seeded(i, 1) * 0.08,
  cy: 0.25 + Math.floor(i / 3) * 0.28 + seeded(i, 2) * 0.06,
  r: 0.05 + seeded(i, 3) * 0.04,
  phase: seeded(i, 4) * Math.PI * 2,
  speed: 0.3 + seeded(i, 5) * 0.5,
  complexity: seeded(i, 6),
}));

/* ── energy photon particles ─────────────────────────────────────────────── */
interface Photon {
  y: number;   // fraction 0–1 height
  speed: number;
  brightness: number;
}
const PHOTONS: Photon[] = Array.from({ length: 24 }, (_, i) => ({
  y: seeded(i, 10),
  speed: 0.08 + seeded(i, 11) * 0.14,
  brightness: 0.5 + seeded(i, 12) * 0.5,
}));

/* ── proto-life motes (self-organizing structures) ──────────────────────── */
interface Mote {
  x: number;  // fraction
  y: number;
  orbitR: number;
  orbitPhase: number;
  orbitSpeed: number;
  size: number;
  parentCell: number;
}
const MOTES: Mote[] = Array.from({ length: 18 }, (_, i) => ({
  x: seeded(i, 20),
  y: seeded(i, 21),
  orbitR: 0.02 + seeded(i, 22) * 0.03,
  orbitPhase: seeded(i, 23) * Math.PI * 2,
  orbitSpeed: 0.2 + seeded(i, 24) * 0.6,
  size: 1.5 + seeded(i, 25) * 2,
  parentCell: i % 9,
}));

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DRAW
═══════════════════════════════════════════════════════════════════════════ */
function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gradient: number,   // 0–1 slider value
  tickT: number,
  lang: "en" | "zh"
) {
  ctx.clearRect(0, 0, w, h);

  /* ── background gradient: hot left → cool right ───────────────────────── */
  const bg = ctx.createLinearGradient(0, 0, w, 0);
  bg.addColorStop(0,    hexAlpha(C.flux500, 0.22 * gradient));
  bg.addColorStop(0.18, hexAlpha(C.void950, 1));
  bg.addColorStop(0.5,  hexAlpha(C.void900, 1));
  bg.addColorStop(0.82, hexAlpha(C.void950, 1));
  bg.addColorStop(1,    hexAlpha(C.iris500, 0.18 * gradient));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const isNarrow = w < 480;

  /* ── Sun (hot source, left side) ──────────────────────────────────────── */
  const sunX = isNarrow ? w * 0.07 : w * 0.06;
  const sunY = h * 0.5;
  const sunR = clamp(isNarrow ? w * 0.06 : w * 0.055, 14, 48);
  const sunPulse = 0.88 + 0.12 * Math.sin(tickT * 1.6);

  // corona glow
  for (let ring = 3; ring >= 1; ring--) {
    const ringR = sunR * (1 + ring * 0.85);
    const ringA = clamp((0.08 + 0.04 * ring) * gradient * sunPulse, 0, 1);
    const coronaG = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, ringR);
    coronaG.addColorStop(0, hexAlpha(C.flux400, ringA * 0.9));
    coronaG.addColorStop(1, hexAlpha(C.gold500, 0));
    ctx.fillStyle = coronaG;
    ctx.beginPath();
    ctx.arc(sunX, sunY, ringR, 0, Math.PI * 2);
    ctx.fill();
  }

  // sun body
  const sunBodyG = ctx.createRadialGradient(sunX - sunR * 0.2, sunY - sunR * 0.2, 0, sunX, sunY, sunR);
  sunBodyG.addColorStop(0, C.ink50);
  sunBodyG.addColorStop(0.25, C.gold400);
  sunBodyG.addColorStop(0.7,  C.flux400);
  sunBodyG.addColorStop(1,    C.flux500);
  ctx.fillStyle = sunBodyG;
  ctx.globalAlpha = clamp(0.7 + 0.3 * gradient, 0, 1);
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * sunPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  /* ── cold sink (space, right side) ────────────────────────────────────── */
  const sinkX = w - (isNarrow ? w * 0.07 : w * 0.06);
  const sinkY = h * 0.5;
  const sinkR = clamp(isNarrow ? w * 0.055 : w * 0.05, 12, 42);

  const spaceG = ctx.createRadialGradient(sinkX, sinkY, 0, sinkX, sinkY, sinkR * 3.5);
  spaceG.addColorStop(0, hexAlpha(C.iris500, 0.25));
  spaceG.addColorStop(0.5, hexAlpha(C.iris500, 0.08));
  spaceG.addColorStop(1, hexAlpha(C.iris500, 0));
  ctx.fillStyle = spaceG;
  ctx.beginPath();
  ctx.arc(sinkX, sinkY, sinkR * 3.5, 0, Math.PI * 2);
  ctx.fill();

  // void core
  ctx.fillStyle = C.void950;
  ctx.strokeStyle = hexAlpha(C.iris500, 0.35);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sinkX, sinkY, sinkR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // few stars around the cold sink
  for (let si = 0; si < 6; si++) {
    const angle = seeded(si, 50) * Math.PI * 2;
    const dist = sinkR * (1.8 + seeded(si, 51) * 2.5);
    const sx = sinkX + Math.cos(angle) * dist;
    const sy = sinkY + Math.sin(angle) * dist;
    const starA = clamp(0.3 + 0.7 * seeded(si, 52) * (0.5 + 0.5 * Math.sin(tickT * (0.5 + seeded(si, 53)) + seeded(si, 54) * 5)), 0, 1);
    ctx.beginPath();
    ctx.arc(sx, sy, 1, 0, Math.PI * 2);
    ctx.fillStyle = hexAlpha(C.iris400, starA);
    ctx.fill();
  }

  /* ── photon stream (energy flowing left → right) ─────────────────────── */
  if (gradient > 0.05) {
    PHOTONS.forEach((ph, i) => {
      const xFrac = ((ph.y + tickT * ph.speed) % 1);
      const px = lerp(sunX + sunR, sinkX - sinkR, xFrac);
      const py = h * (0.28 + seeded(i, 60) * 0.44);
      const photonA = clamp(ph.brightness * gradient * (0.5 + 0.5 * Math.sin(tickT * 1.2 + i)), 0, 1);

      // color shifts from gold→iris as it crosses
      const t = clamp(xFrac, 0, 1);
      const r = Math.round(lerp(245, 139, t));
      const g = Math.round(lerp(185, 123, t));
      const b = Math.round(lerp(66, 255, t));
      const rC = clamp(r, 0, 255);
      const gC = clamp(g, 0, 255);
      const bC = clamp(b, 0, 255);
      const aB = Math.round(photonA * 255).toString(16).padStart(2, "0");

      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `#${rC.toString(16).padStart(2,"0")}${gC.toString(16).padStart(2,"0")}${bC.toString(16).padStart(2,"0")}${aB}`;
      ctx.fill();

      // tail
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 8 * gradient, py);
      ctx.strokeStyle = `#${rC.toString(16).padStart(2,"0")}${gC.toString(16).padStart(2,"0")}${bC.toString(16).padStart(2,"0")}${Math.round(photonA * 0.3 * 255).toString(16).padStart(2,"0")}`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  /* ── convection cells + proto-life (only appear above threshold) ───────── */
  const complexityThreshold = 0.25;
  const complexityAlpha = clamp((gradient - complexityThreshold) / (1 - complexityThreshold), 0, 1);

  // "maximum complexity" zone — where gradient is just right (around 0.55–0.75)
  const optimalGradient = gradient > 0.4 && gradient < 0.85;
  const optimalBoost = optimalGradient ? 1.0 : 0.55;

  if (complexityAlpha > 0.01) {
    /* ── convection cells ───────────────────────────────────────────────── */
    CELLS.forEach((cell, ci) => {
      const cx = lerp(sunX + sunR * 1.8, sinkX - sinkR * 1.8, cell.cx);
      const cy = h * cell.cy;
      const r = clamp(cell.r * Math.min(w, h) * optimalBoost, 8, 60);

      const cellPhase = tickT * cell.speed + cell.phase;
      const breathe = 0.88 + 0.12 * Math.sin(cellPhase);
      const cellA = clamp(complexityAlpha * optimalBoost * breathe, 0, 1);

      // outer ring — warm circulation
      ctx.save();
      ctx.globalAlpha = cellA * 0.4;
      const outerG = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8);
      outerG.addColorStop(0, hexAlpha(C.leaf500, 0.2));
      outerG.addColorStop(0.6, hexAlpha(C.gold500, 0.08));
      outerG.addColorStop(1, hexAlpha(C.leaf500, 0));
      ctx.fillStyle = outerG;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // cell body
      ctx.save();
      ctx.globalAlpha = cellA * 0.6;
      const cellBodyG = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cellBodyG.addColorStop(0, hexAlpha(C.leaf400, 0.18));
      cellBodyG.addColorStop(0.75, hexAlpha(C.leaf500, 0.06));
      cellBodyG.addColorStop(1, hexAlpha(C.leaf500, 0));
      ctx.fillStyle = cellBodyG;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // cell membrane arc (structural boundary)
      ctx.save();
      ctx.globalAlpha = cellA * 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = hexAlpha(C.leaf500, 0.45);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // circulation arrows (two half-arcs showing convective rolls)
      ctx.save();
      ctx.globalAlpha = cellA * 0.6;
      ctx.strokeStyle = hexAlpha(C.gold400, 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx - r * 0.25, cy, r * 0.5, Math.PI + cellPhase * 0.15, Math.PI * 2 + cellPhase * 0.15, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + r * 0.25, cy, r * 0.5, cellPhase * 0.15, Math.PI + cellPhase * 0.15, false);
      ctx.stroke();
      ctx.restore();

      // order label at center (only when large enough)
      if (r > 22 && !isNarrow) {
        ctx.save();
        ctx.globalAlpha = cellA * 0.7;
        ctx.fillStyle = C.leaf400;
        ctx.font = `${clamp(r * 0.28, 6, 9)}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const orderLabel = lang === "zh" ? "有序" : "order";
        ctx.fillText(orderLabel, cx, cy);
        ctx.restore();
      }
    });

    /* ── proto-life motes (orbiting around cells) ───────────────────────── */
    const moteThreshold = 0.45;
    const moteAlpha = clamp((gradient - moteThreshold) / 0.35, 0, 1) * optimalBoost;

    if (moteAlpha > 0.01) {
      MOTES.forEach((mote, mi) => {
        const pc = CELLS[mote.parentCell];
        const pcx = lerp(sunX + sunR * 1.8, sinkX - sinkR * 1.8, pc.cx);
        const pcy = h * pc.cy;
        const orbitR = mote.orbitR * Math.min(w, h);

        const angle = mote.orbitPhase + tickT * mote.orbitSpeed;
        const mx2 = pcx + Math.cos(angle) * orbitR;
        const my2 = pcy + Math.sin(angle) * orbitR * 0.45; // slight ellipse

        const moteA = clamp(moteAlpha * (0.6 + 0.4 * Math.sin(tickT * 1.5 + mi)), 0, 1);

        ctx.save();
        ctx.globalAlpha = moteA;
        ctx.beginPath();
        ctx.arc(mx2, my2, mote.size, 0, Math.PI * 2);
        ctx.fillStyle = mi % 3 === 0 ? C.leaf500 : mi % 3 === 1 ? C.gold400 : C.leaf400;
        ctx.shadowColor = C.leaf500;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // connecting line to center (chemical bond look)
        ctx.save();
        ctx.globalAlpha = moteA * 0.25;
        ctx.beginPath();
        ctx.moveTo(pcx, pcy);
        ctx.lineTo(mx2, my2);
        ctx.strokeStyle = C.leaf400;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      });
    }

    /* ── emergent entropy export arrows (going right into sink) ─────────── */
    const arrowAlpha = clamp((gradient - 0.35) / 0.5, 0, 1);
    if (arrowAlpha > 0.01) {
      const arrowCount = 3;
      for (let ai = 0; ai < arrowCount; ai++) {
        const ay = h * (0.3 + ai * 0.2);
        const axStart = w * 0.55 + (tickT * 40 * seeded(ai, 70)) % (w * 0.2);
        const axEnd = axStart + 30;

        ctx.save();
        ctx.globalAlpha = clamp(arrowAlpha * (0.4 + 0.3 * Math.sin(tickT * 0.8 + ai * 2)), 0, 1);
        ctx.strokeStyle = hexAlpha(C.iris400, 0.6);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(clamp(axStart, 0, w), ay);
        ctx.lineTo(clamp(axEnd, 0, w), ay);
        ctx.stroke();
        ctx.setLineDash([]);
        // arrowhead
        ctx.fillStyle = hexAlpha(C.iris400, 0.6);
        ctx.beginPath();
        const arX = clamp(axEnd, 0, w);
        ctx.moveTo(arX, ay);
        ctx.lineTo(arX - 5, ay - 3);
        ctx.lineTo(arX - 5, ay + 3);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /* ── labels: Sun / Space ───────────────────────────────────────────────── */
  ctx.save();
  ctx.fillStyle = hexAlpha(C.flux400, 0.8);
  ctx.font = `bold ${isNarrow ? 7 : 8}px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(lang === "zh" ? "太阳" : "SUN", sunX, sunY + sunR + 6);
  ctx.fillStyle = hexAlpha(C.gold400, 0.6);
  ctx.font = `${isNarrow ? 6 : 7}px "JetBrains Mono", monospace`;
  ctx.fillText(lang === "zh" ? "热源" : "hot source", sunX, sunY + sunR + 16);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = hexAlpha(C.iris400, 0.8);
  ctx.font = `bold ${isNarrow ? 7 : 8}px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(lang === "zh" ? "宇宙空间" : "SPACE", sinkX, sinkY + sinkR + 6);
  ctx.fillStyle = hexAlpha(C.iris500, 0.55);
  ctx.font = `${isNarrow ? 6 : 7}px "JetBrains Mono", monospace`;
  ctx.fillText(lang === "zh" ? "冷汇" : "cold sink", sinkX, sinkY + sinkR + 16);
  ctx.restore();

  /* ── free energy label in the middle ───────────────────────────────────── */
  if (gradient > 0.1) {
    const midX = w * 0.5;
    const midY = h * 0.08;
    const feA = clamp(gradient * 0.7, 0, 1);
    ctx.save();
    ctx.globalAlpha = feA;
    ctx.fillStyle = C.gold500;
    ctx.font = `${isNarrow ? 6.5 : 8}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(lang === "zh" ? "自由能流动 →" : "free energy flux →", midX, midY);
    ctx.restore();
  }

  /* ── complexity state label ─────────────────────────────────────────────── */
  {
    const stateY = h * 0.92;
    const stateX = w * 0.5;
    let stateText = "";
    let stateColor = C.ink500;
    if (gradient < 0.08) {
      stateText = lang === "zh" ? "无梯度 · 热力学死亡" : "no gradient · heat death";
      stateColor = C.ink500;
    } else if (gradient < complexityThreshold) {
      stateText = lang === "zh" ? "梯度过低 · 仅有扩散" : "gradient too low · diffusion only";
      stateColor = C.gold500;
    } else if (gradient < 0.45) {
      stateText = lang === "zh" ? "出现对流胞 · 有序萌生" : "convection cells · order emerging";
      stateColor = C.leaf500;
    } else if (gradient < 0.85) {
      stateText = lang === "zh" ? "自组织结构 · 加速熵产" : "self-org structures · accelerating entropy";
      stateColor = C.leaf400;
    } else {
      stateText = lang === "zh" ? "梯度极高 · 湍流耗散" : "gradient very high · turbulent dissipation";
      stateColor = C.flux400;
    }
    ctx.save();
    ctx.fillStyle = stateColor;
    ctx.font = `bold ${isNarrow ? 7 : 8.5}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(stateText, stateX, stateY);
    ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTROPY ACCOUNTING MINI-CHART (side panel canvas)
═══════════════════════════════════════════════════════════════════════════ */
function drawEntropyChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gradient: number,
  tickT: number,
  lang: "en" | "zh"
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = C.void900;
  ctx.fillRect(0, 0, w, h);

  const PAD = 18;
  const cw = w - PAD * 2;
  const ch = h - PAD * 2 - 16;

  // bars: internal_order (cell), exported_entropy (surroundings), net_entropy
  const cellOrder    = gradient * 0.38;   // the local pocket of order
  const exported     = gradient * 0.68;   // disorder dumped to surroundings
  const net          = exported - cellOrder;  // net positive (second law respected)

  const bars = [
    { label: lang === "zh" ? "细胞内部\n有序度" : "cell\norder", value: cellOrder, color: C.leaf500, negative: true },
    { label: lang === "zh" ? "输出到\n环境的熵" : "entropy\nexported", value: exported, color: C.iris500, negative: false },
    { label: lang === "zh" ? "净熵产\n(>0)" : "net entropy\nproduced (>0)", value: net, color: C.gold500, negative: false },
  ];

  const maxVal = 0.72;
  const barW = clamp((cw - 12) / bars.length - 6, 16, 40);

  bars.forEach((bar, i) => {
    const bx = PAD + i * (barW + 8) + (cw - bars.length * (barW + 8)) / 2;
    const barH = clamp((bar.value / maxVal) * ch, 0, ch);
    const by = PAD + ch - barH;
    const liveH = clamp(barH * (0.95 + 0.05 * Math.sin(tickT * 1.4 + i)), 0, ch);
    const liveBy = PAD + ch - liveH;

    // track
    ctx.fillStyle = hexAlpha(bar.color, 0.08);
    ctx.beginPath();
    ctx.roundRect(bx, PAD, barW, ch, 3);
    ctx.fill();

    // fill
    const fillG = ctx.createLinearGradient(0, liveBy, 0, PAD + ch);
    fillG.addColorStop(0, hexAlpha(bar.color, 0.85));
    fillG.addColorStop(1, hexAlpha(bar.color, 0.25));
    ctx.fillStyle = fillG;
    ctx.beginPath();
    ctx.roundRect(bx, liveBy, barW, liveH, 3);
    ctx.fill();

    // negative arrow decoration for "cell order"
    if (bar.negative) {
      ctx.fillStyle = hexAlpha(C.leaf400, 0.55);
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("▼", bx + barW / 2, liveBy - 1);
    } else {
      ctx.fillStyle = hexAlpha(bar.color, 0.7);
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("▲", bx + barW / 2, liveBy - 1);
    }

    // label (handle newlines)
    const parts = bar.label.split("\n");
    ctx.fillStyle = bar.color;
    ctx.font = `${w < 200 ? 6 : 7}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    parts.forEach((part, pi) => {
      ctx.fillText(part, bx + barW / 2, PAD + ch + 3 + pi * 8);
    });
  });

  // second-law annotation
  ctx.fillStyle = hexAlpha(C.gold400, 0.55);
  ctx.font = `6px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const note = lang === "zh" ? "净熵 ≥ 0 (热力学第二定律)" : "net entropy ≥ 0 (2nd law holds)";
  ctx.fillText(note, w / 2, 4);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function ComplexityViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => (lang === "zh" ? zh : en);

  /* ── state ─────────────────────────────────────────────────────────────── */
  const [gradient, setGradient] = useState(0.55);
  const [showCaveat, setShowCaveat] = useState(false);
  const [showEntropyPanel, setShowEntropyPanel] = useState(true);

  /* ── refs ─────────────────────────────────────────────────────────────── */
  const sceneRef  = useRef<HTMLCanvasElement>(null);
  const entropyRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tickRef   = useRef<number>(0);
  const gradRef   = useRef<number>(gradient);
  const langRef   = useRef<"en" | "zh">(lang);

  useEffect(() => { gradRef.current = gradient; }, [gradient]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  /* ── animation loop ─────────────────────────────────────────────────── */
  useEffect(() => {
    const scene   = sceneRef.current;
    const entropy = entropyRef.current;
    if (!scene || !entropy) return;
    const sCtx = scene.getContext("2d");
    const eCtx = entropy.getContext("2d");
    if (!sCtx || !eCtx) return;

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

    function resize() {
      if (!scene || !entropy) return;
      const sr = scene.getBoundingClientRect();
      scene.width  = Math.floor(sr.width  * dpr);
      scene.height = Math.floor(sr.height * dpr);
      sCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const er = entropy.getBoundingClientRect();
      entropy.width  = Math.floor(er.width  * dpr);
      entropy.height = Math.floor(er.height * dpr);
      eCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    function tick(ts: number) {
      const dt = clamp((ts - last) / 1000, 0, 0.05);
      last = ts;
      tickRef.current += dt;

      const sr = scene!.getBoundingClientRect();
      const er = entropy!.getBoundingClientRect();
      drawScene(sCtx!, sr.width, sr.height, gradRef.current, tickRef.current, langRef.current);
      drawEntropyChart(eCtx!, er.width, er.height, gradRef.current, tickRef.current, langRef.current);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── gradient description ───────────────────────────────────────────── */
  const gradientLabel = useCallback(() => {
    if (gradient < 0.08) return L("None — Heat Death", "无梯度 · 热寂");
    if (gradient < 0.25) return L("Weak — Diffusion Only", "弱梯度 · 仅扩散");
    if (gradient < 0.45) return L("Moderate — Order Emerging", "中等 · 有序萌生");
    if (gradient < 0.85) return L("Optimal — Life-like Structures", "适中 · 类生命结构");
    return L("Maximum — Turbulent Chaos", "极高 · 湍流耗散");
  }, [gradient, lang]);

  const gradientColor = gradient < 0.08 ? C.ink500 :
    gradient < 0.25 ? C.gold500 :
    gradient < 0.45 ? C.gold400 :
    gradient < 0.85 ? C.leaf400 : C.flux400;

  /* ── physics insight cards ──────────────────────────────────────────── */
  const physicsCards = [
    {
      color: C.gold500,
      icon: "→",
      title: { en: "Free Energy Gradient", zh: "自由能梯度" },
      body: {
        en: "When a high-entropy source (the Sun) and a low-entropy sink (cold space) exist, free energy flows. This gradient is the precondition for all complexity — from weather to life.",
        zh: "当高熵源（太阳）与低熵汇（冷空间）同时存在时，自由能开始流动。这一梯度是所有复杂性的前提条件——从天气到生命。"
      },
    },
    {
      color: C.leaf500,
      icon: "⟳",
      title: { en: "Order as Entropy Accelerant", zh: "秩序是熵的加速器" },
      body: {
        en: "Convection cells, hurricanes, and life all spontaneously arise not despite the second law but because of it — ordered dissipative structures accelerate the flow of entropy better than mere diffusion.",
        zh: "对流胞、飓风和生命的自发出现，并非违背热力学第二定律，恰恰是因为它：有序的耗散结构比单纯扩散更有效地加速熵流。"
      },
    },
    {
      color: C.iris500,
      icon: "⇅",
      title: { en: "The Cell's Entropy Bargain", zh: "细胞的熵交换" },
      body: {
        en: "A cell maintains local order by exporting more disorder to its surroundings. It pays for its structure in entropy. The accounting always balances — local order is purchased with global disorder.",
        zh: "细胞通过向外界输出更多无序来维持内部秩序。它用熵来支付自身结构的代价。账目永远平衡——局部有序以全局无序为代价。"
      },
    },
    {
      color: C.flux400,
      icon: "✦",
      title: { en: "Darwinian Evolution", zh: "达尔文演化" },
      body: {
        en: "Once self-replication exists, natural selection automatically builds apparent design with no designer. The algorithm is simple: copy, vary, select. Complexity accumulates across generations.",
        zh: "一旦自我复制出现，自然选择就会自动构建出无需设计者的表观设计。算法很简单：复制、变异、选择。复杂性在世代间积累。"
      },
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* ── header ──────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1" style={{ color: C.leaf500 }}>
          {L("Theme 06 · The Origin of Complexity & Life", "主题 06 · 复杂性与生命的起源")}
        </p>
        <h3
          className={`display text-2xl md:text-3xl leading-tight mb-2 ${lang === "zh" ? "zh" : ""}`}
          style={{
            background: `linear-gradient(100deg, ${C.flux400} 0%, ${C.gold400} 35%, ${C.leaf500} 70%, ${C.iris400} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {L("Life as an Entropy Engine", "生命是熵的引擎")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-3 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "Energy flows from the hot Sun through matter and out to cold space. Where the gradient is right, ordered structures spontaneously arise — not violating the second law, but fulfilling it. Life accelerates entropy production; complexity is the universe finding faster ways to disorder.",
            "能量从炽热的太阳流经物质，最终消散于寒冷的宇宙空间。当梯度恰当时，有序结构自发涌现——这不是在违背热力学第二定律，而是在实现它。生命加速了熵的产生；复杂性是宇宙寻找更快无序化方式的过程。"
          )}
        </p>
        <div className="rule-flux h-px rounded" />
      </div>

      {/* ── main canvas + side panel ─────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_220px] gap-4 items-start">

        {/* ── scene canvas ─────────────────────────────────────────────── */}
        <div
          className="relative rounded-xl overflow-hidden border"
          style={{
            borderColor: `rgba(45,212,191,0.18)`,
            boxShadow: `0 0 48px -18px rgba(45,212,191,0.25), inset 0 0 60px -30px rgba(255,107,92,0.08)`,
            background: C.void950,
          }}
        >
          <canvas
            ref={sceneRef}
            className="block w-full"
            style={{ aspectRatio: "16/9", minHeight: 200 }}
            aria-label={L("Free-energy gradient simulation", "自由能梯度模拟")}
          />

          {/* gradient badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md font-mono text-[0.65rem] font-bold"
            style={{
              background: `${gradientColor}16`,
              color: gradientColor,
              border: `1px solid ${gradientColor}33`,
            }}
          >
            <span className={lang === "zh" ? "zh" : ""}>{gradientLabel()}</span>
          </div>

          {/* gradient indicator */}
          <div
            className="absolute top-3 right-3 font-mono text-[0.65rem]"
            style={{ color: C.gold400 }}
          >
            ΔG = {(gradient * 100).toFixed(0)}%
          </div>
        </div>

        {/* ── entropy accounting panel ─────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div
            className="panel rounded-xl overflow-hidden"
            style={{ borderColor: "rgba(45,212,191,0.15)" }}
          >
            <button
              onClick={() => setShowEntropyPanel(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
            >
              <p className="label-mono" style={{ color: C.leaf500 }}>
                {L("Entropy Accounting", "熵的账簿")}
              </p>
              <span className="font-mono text-xs" style={{ color: C.leaf400 }}>
                {showEntropyPanel ? "↑" : "↓"}
              </span>
            </button>
            {showEntropyPanel && (
              <canvas
                ref={entropyRef}
                className="block w-full"
                style={{ height: 160 }}
                aria-label={L("Entropy accounting chart", "熵的账簿图")}
              />
            )}
          </div>

          {/* complexity threshold note */}
          <div
            className="panel rounded-xl p-3 space-y-1.5"
            style={{ borderColor: "rgba(139,123,255,0.18)" }}
          >
            <p className="label-mono text-[0.58rem]" style={{ color: C.iris400 }}>
              {L("Order Emerges When", "有序涌现的条件")}
            </p>
            <div className="space-y-1">
              {[
                { label: { en: "Gradient ≥ 25%", zh: "梯度 ≥ 25%" }, desc: { en: "convection begins", zh: "对流开始" }, color: C.gold500 },
                { label: { en: "Gradient 40–85%", zh: "梯度 40–85%" }, desc: { en: "self-org peak", zh: "自组织高峰" }, color: C.leaf500 },
                { label: { en: "Gradient → 0%", zh: "梯度 → 0%" }, desc: { en: "heat death", zh: "热寂" }, color: C.ink500 },
              ].map((row) => (
                <div key={row.label.en} className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[0.62rem] ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: row.color }}
                  >
                    {lang === "zh" ? row.label.zh : row.label.en}
                  </span>
                  <span
                    className={`font-mono text-[0.6rem] ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: C.ink500 }}
                  >
                    {lang === "zh" ? row.desc.zh : row.desc.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── gradient slider control ──────────────────────────────────────── */}
      <div
        className="panel rounded-xl p-5 space-y-4"
        style={{ borderColor: "rgba(245,185,66,0.18)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="label-mono" style={{ color: C.gold500 }}>
              {L("Free Energy Gradient", "自由能梯度")}
            </p>
            <p
              className={`text-[0.65rem] font-mono mt-0.5 ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink500 }}
            >
              {L("Drag to control the Sun–Space temperature differential", "拖动以控制太阳-空间温差")}
            </p>
          </div>
          <div
            className="font-mono text-lg font-bold"
            style={{ color: gradientColor }}
          >
            {(gradient * 100).toFixed(0)}%
          </div>
        </div>

        {/* slider */}
        <div className="relative">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${gradient * 100}%`,
              background: `linear-gradient(90deg, ${C.flux500}, ${C.gold500} 50%, ${C.leaf500})`,
              height: "100%",
              opacity: 0.25,
              pointerEvents: "none",
              borderRadius: 8,
            }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={gradient}
            onChange={(e) => setGradient(parseFloat(e.target.value))}
            className="relative w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: "transparent",
              accentColor: C.gold400,
            }}
            aria-label={L("Gradient strength", "梯度强度")}
          />
        </div>

        {/* preset buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 0, label: { en: "Heat Death", zh: "热寂" } },
            { value: 0.18, label: { en: "Weak Flow", zh: "弱流" } },
            { value: 0.55, label: { en: "Life Zone", zh: "生命区" } },
            { value: 0.82, label: { en: "Near-Peak", zh: "近峰值" } },
            { value: 1, label: { en: "Maximum", zh: "最大" } },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setGradient(preset.value)}
              className="px-3 py-1.5 rounded-lg font-mono text-[0.6rem] border transition-all duration-200"
              style={{
                borderColor: Math.abs(gradient - preset.value) < 0.05
                  ? C.gold500
                  : "rgba(245,185,66,0.2)",
                background: Math.abs(gradient - preset.value) < 0.05
                  ? "rgba(245,185,66,0.14)"
                  : "transparent",
                color: Math.abs(gradient - preset.value) < 0.05
                  ? C.gold400
                  : C.ink500,
              }}
            >
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "zh" ? preset.label.zh : preset.label.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── physics insight cards ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.iris500 }}>
          {L("The Physics — Four Key Principles", "物理学——四个关键原理")}
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {physicsCards.map((card) => (
            <div
              key={card.title.en}
              className="panel rounded-xl p-4 space-y-2"
              style={{ borderColor: `${card.color}20` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg" style={{ color: card.color }}>{card.icon}</span>
                <p
                  className={`display text-[0.82rem] ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: card.color }}
                >
                  {lang === "zh" ? card.title.zh : card.title.en}
                </p>
              </div>
              <p
                className={`text-[0.68rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: C.ink300,
                  fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                }}
              >
                {lang === "zh" ? card.body.zh : card.body.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABIOGENESIS CAVEAT — most important, always prominent ─────────── */}
      <div
        className="rounded-xl border overflow-hidden rise-in"
        style={{
          borderColor: "rgba(255,79,163,0.38)",
          background: "rgba(255,79,163,0.04)",
          boxShadow: "0 0 32px -14px rgba(255,79,163,0.35)",
        }}
      >
        {/* always-visible header */}
        <div className="px-5 py-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0 breathe" style={{ color: C.plasm500 }}>⬡</span>
          <div className="flex-1 min-w-0">
            <p className="label-mono" style={{ color: C.plasm500 }}>
              {L("Genuine Open Question — Abiogenesis", "真正的未解之谜——生命起源")}
            </p>
            <p
              className={`text-[0.73rem] leading-relaxed mt-2 ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
              }}
            >
              {L(
                "The thermodynamic framing above — why free-energy gradients tend to produce ordered dissipative structures — is well-understood physics (Prigogine, Schrödinger, England). What remains genuinely, deeply unsolved is abiogenesis: how the first self-replicating chemistry arose from non-living matter. No scientist has demonstrated this step in the lab. There are good hypotheses (RNA World, hydrothermal vents, alkaline-vent chemistry) but no consensus and no confirmed mechanism.",
                "上述热力学框架——为何自由能梯度倾向于产生有序的耗散结构——是已被充分理解的物理学（普里高津、薛定谔、英格兰）。真正深刻未解的问题是生命起源：第一个自我复制的化学系统如何从非生命物质中产生。没有任何科学家在实验室中展示过这一步骤。目前有合理的假说（RNA世界、热液喷口、碱性热液口化学），但尚无共识，也没有经过确认的机制。"
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCaveat(v => !v)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-left border-t transition-colors hover:bg-pink-500/5"
          style={{ borderColor: "rgba(255,79,163,0.18)" }}
        >
          <p className={`text-[0.65rem] font-mono ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink500 }}>
            {L("Why this matters for Carroll's argument — expand", "为何这对卡罗尔的论证至关重要——展开")}
          </p>
          <span className="font-mono text-sm" style={{ color: C.plasm400 }}>
            {showCaveat ? "↑" : "↓"}
          </span>
        </button>

        {showCaveat && (
          <div className="px-5 pb-5 space-y-3 rise-in">
            <div className="h-px" style={{ background: "rgba(255,79,163,0.2)" }} />
            <div className="grid md:grid-cols-2 gap-3">
              {[
                {
                  title: { en: "What Carroll's Poetic Naturalism Explains", zh: "卡罗尔的诗意自然主义能解释什么" },
                  color: C.leaf500,
                  points: [
                    {
                      en: "Why, once life exists, it proliferates and grows more complex (thermodynamics + Darwinian evolution).",
                      zh: "为何一旦生命存在，它就会扩散并变得更加复杂（热力学 + 达尔文演化）。"
                    },
                    {
                      en: "Why the universe is hospitable to complexity at all — free-energy gradients are the necessary condition.",
                      zh: "为何宇宙对复杂性具有基本的容纳性——自由能梯度是必要条件。"
                    },
                    {
                      en: "Why life does not violate the second law — the entropy accounting always balances.",
                      zh: "为何生命不违反热力学第二定律——熵的账目始终平衡。"
                    },
                  ],
                },
                {
                  title: { en: "What Remains Genuinely Unsolved", zh: "什么仍然真正未解" },
                  color: C.plasm500,
                  points: [
                    {
                      en: "The specific chemical pathway from simple molecules to a self-replicating system — abiogenesis remains an open research problem.",
                      zh: "从简单分子到自我复制系统的具体化学路径——生命起源仍是一个开放的研究问题。"
                    },
                    {
                      en: "Whether life arose once or many times on Earth; whether it is common or rare in the cosmos.",
                      zh: "生命在地球上是起源一次还是多次；它在宇宙中是普遍还是罕见。"
                    },
                    {
                      en: "Why this particular planet's chemistry produced self-replication when and how it did.",
                      zh: "为何这颗特定星球的化学在特定时间和方式下产生了自我复制。"
                    },
                  ],
                },
              ].map((panel) => (
                <div
                  key={panel.title.en}
                  className="rounded-lg p-3 space-y-2"
                  style={{
                    background: `${panel.color}0d`,
                    border: `1px solid ${panel.color}22`,
                  }}
                >
                  <p
                    className={`font-mono text-[0.65rem] font-bold ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: panel.color }}
                  >
                    {lang === "zh" ? panel.title.zh : panel.title.en}
                  </p>
                  {panel.points.map((pt, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: panel.color }}
                      />
                      <p
                        className={`text-[0.67rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                        style={{
                          color: C.ink300,
                          fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                        }}
                      >
                        {lang === "zh" ? pt.zh : pt.en}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p
              className={`text-[0.65rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink500,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
              }}
            >
              {L(
                "Carroll is explicit about this: The Big Picture does not claim to solve abiogenesis. It argues that there is no in-principle barrier — the laws of physics allow it — and that naturalistic explanations are the right framework even if the specific history of life's origin is not yet known.",
                "卡罗尔对此直言不讳：《大图景》并不声称能解决生命起源问题。它的论点是：不存在原则性障碍——物理定律允许这一点——即使生命起源的具体历史尚不可知，自然主义的解释框架仍然是正确的。"
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── Carroll's central argument ──────────────────────────────────── */}
      <div
        className="panel rounded-xl p-5"
        style={{ borderColor: "rgba(139,123,255,0.18)" }}
      >
        <p className="label-mono mb-3" style={{ color: C.iris500 }}>
          {L("Carroll's Central Argument", "卡罗尔的核心论证")}
        </p>
        <blockquote
          className={`text-[0.78rem] leading-relaxed italic border-l-2 pl-4 ${lang === "zh" ? "zh" : ""}`}
          style={{
            color: C.ink300,
            borderColor: C.iris500,
            fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
          }}
        >
          {L(
            "\"Life is not special from the perspective of physics. It is simply a particularly interesting case of self-organization driven by the flow of free energy. The same thermodynamic logic that produces hurricanes and Bénard convection cells also, eventually, produces us — organisms that reflect on their own existence.\"",
            "「从物理学的角度来看，生命并不特殊。它只是由自由能流动驱动的自组织的一个特别有趣的案例。同样的热力学逻辑——产生飓风和贝纳对流胞的逻辑——最终也产生了我们：能够反思自身存在的生命体。」"
          )}
        </blockquote>
        <p
          className="font-mono text-[0.6rem] mt-3 text-right"
          style={{ color: C.ink500 }}
        >
          {L("— Sean Carroll, The Big Picture (2016), paraphrase", "——肖恩·卡罗尔，《大图景》（2016），意译")}
        </p>
      </div>
    </div>
  );
}
