"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   LayersViz
   Theme 05 — Emergence & Layers of Reality

   Interactive "zoom across scales" — the user moves a slider through seven
   levels of reality (quark → atom → molecule → cell → organism → brain →
   society). Each level has its own valid vocabulary, an illustrative canvas
   drawing, and a note emphasising weak emergence: these levels are REAL,
   fully compatible with the one beneath, not an illusion. Reductionism is
   true; "therefore only atoms are real" is false.
═══════════════════════════════════════════════════════════════════════════ */

/* ── palette ─────────────────────────────────────────────────────────────── */
const C = {
  void950:  "#07080f",
  void900:  "#0c0e1a",
  void800:  "#12141f",
  void700:  "#1b1e30",
  flux500:  "#ff6b5c",
  flux400:  "#ff9b8f",
  iris500:  "#8b7bff",
  iris400:  "#b3a8ff",
  leaf500:  "#2dd4bf",
  leaf400:  "#6ee7d6",
  gold500:  "#f5b942",
  gold400:  "#ffd27a",
  plasm500: "#ff4fa3",
  ink50:    "#f4f4fb",
  ink300:   "#a8aac6",
  ink500:   "#6c6e90",
};

/* ── deterministic PRNG ──────────────────────────────────────────────────── */
function seeded(s: number, salt: number = 0): number {
  const x = Math.sin(s * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function clamp(v: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}

/* ── level definitions ──────────────────────────────────────────────────── */
interface Level {
  id: string;
  scale: { en: string; zh: string };
  name:  { en: string; zh: string };
  vocab: { en: string[]; zh: string[] };
  note:  { en: string; zh: string };
  color: string;
  colorHi: string;
  panelClass: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
}

/* ── shared canvas helpers ───────────────────────────────────────────────── */
function fillBg(ctx: CanvasRenderingContext2D, w: number, h: number, col: string) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, C.void900);
  bg.addColorStop(1, C.void950);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  // subtle vignette
  const vg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
  // center glow
  const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.55);
  const hex = col;
  glow.addColorStop(0, hex + "1a");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

/* ── LEVEL 0: Quark / subatomic — iris ───────────────────────────────────── */
function drawQuark(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.iris500);
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.28;

  // orbiting colour-charge blobs (3 quarks in a proton)
  const quarkCols = [C.iris500, C.plasm500, C.leaf500];
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3 + t * 1.1;
    const r = R * 0.55;
    const qx = cx + Math.cos(angle) * r;
    const qy = cy + Math.sin(angle) * r;

    // gluon flux tubes (dashed arcs between quarks)
    const nextAngle = ((i + 1) * 2 * Math.PI) / 3 + t * 1.1;
    const nx = cx + Math.cos(nextAngle) * r;
    const ny = cy + Math.sin(nextAngle) * r;
    ctx.save();
    ctx.strokeStyle = quarkCols[i] + "55";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(qx, qy);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // quark blob
    const grad = ctx.createRadialGradient(qx, qy, 0, qx, qy, R * 0.18);
    grad.addColorStop(0, quarkCols[i] + "ee");
    grad.addColorStop(1, quarkCols[i] + "00");
    ctx.save();
    ctx.beginPath();
    ctx.arc(qx, qy, R * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.shadowColor = quarkCols[i];
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.restore();

    // label R G B
    ctx.save();
    ctx.font = `600 ${clamp(Math.floor(w * 0.028), 8, 12)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = quarkCols[i];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(["R", "G", "B"][i], qx, qy);
    ctx.restore();
  }

  // quantum foam background dots
  for (let i = 0; i < 28; i++) {
    const fx = seeded(i, 1) * w;
    const fy = seeded(i, 2) * h;
    const phase = seeded(i, 3) * Math.PI * 2;
    const alpha = clamp(0.18 + 0.14 * Math.sin(t * 2.3 + phase));
    ctx.save();
    ctx.beginPath();
    ctx.arc(fx, fy, seeded(i, 4) * 2.5 + 0.5, 0, Math.PI * 2);
    ctx.fillStyle = C.iris400 + Math.round(alpha * 255).toString(16).padStart(2, "0");
    ctx.fill();
    ctx.restore();
  }

  // wavefunction probability cloud
  const wfc = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  wfc.addColorStop(0, C.iris500 + "44");
  wfc.addColorStop(0.6, C.iris500 + "18");
  wfc.addColorStop(1, "transparent");
  ctx.save();
  ctx.globalAlpha = 0.5 + 0.25 * Math.sin(t * 0.9);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = wfc;
  ctx.fill();
  ctx.restore();

  // centre label
  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.025), 7, 11)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.iris400 + "cc";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("10⁻¹⁵ m", cx, cy - R - clamp(h * 0.06, 12, 22));
  ctx.restore();
}

/* ── LEVEL 1: Atom — iris/violet ─────────────────────────────────────────── */
function drawAtom(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.iris400);
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.32;

  // electron orbital shells (3 ellipses, rotated)
  const orbits = [
    { rx: R, ry: R * 0.38, tilt: 0 },
    { rx: R * 0.9, ry: R * 0.4, tilt: Math.PI / 3 },
    { rx: R * 0.85, ry: R * 0.35, tilt: -Math.PI / 3 },
  ];
  orbits.forEach((orb, oi) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(orb.tilt + t * 0.12 * (oi % 2 === 0 ? 1 : -1));
    ctx.strokeStyle = C.iris400 + "55";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // electron dot
    const eAngle = t * (1.4 + oi * 0.3);
    const ex = Math.cos(eAngle) * orb.rx;
    const ey = Math.sin(eAngle) * orb.ry;
    ctx.beginPath();
    ctx.arc(ex, ey, clamp(w * 0.018, 3, 7), 0, Math.PI * 2);
    ctx.fillStyle = C.iris400;
    ctx.shadowColor = C.iris400;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });

  // nucleus
  const nucGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.14);
  nucGrad.addColorStop(0, "#ffffff");
  nucGrad.addColorStop(0.4, C.iris400);
  nucGrad.addColorStop(1, C.iris500 + "88");
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = nucGrad;
  ctx.shadowColor = C.iris400;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.restore();

  // wavefunction haze
  const haze = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.05);
  haze.addColorStop(0, C.iris500 + "18");
  haze.addColorStop(1, "transparent");
  ctx.save();
  ctx.globalAlpha = 0.6 + 0.3 * Math.sin(t * 0.7);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = haze;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.025), 7, 11)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.iris400 + "bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("10⁻¹⁰ m", cx, cy - R - clamp(h * 0.06, 12, 22));
  ctx.restore();
}

/* ── LEVEL 2: Molecule — gold ────────────────────────────────────────────── */
function drawMolecule(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.gold500);
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.28;

  // water molecule: O in centre, two H at angles
  const bondAngle = Math.PI * 0.59;  // ~104.5° H-O-H
  const bondLen = R * 0.65;

  // gentle vibration
  const vib = Math.sin(t * 2.1) * R * 0.025;

  const oR = R * 0.2;
  const hR = R * 0.13;

  const h1x = cx + Math.cos(Math.PI + bondAngle / 2) * bondLen;
  const h1y = cy + Math.sin(Math.PI + bondAngle / 2) * bondLen + vib;
  const h2x = cx + Math.cos(Math.PI - bondAngle / 2) * bondLen;
  const h2y = cy + Math.sin(Math.PI - bondAngle / 2) * bondLen - vib;

  // covalent bonds
  [[cx, cy, h1x, h1y], [cx, cy, h2x, h2y]].forEach(([ax, ay, bx, by]) => {
    ctx.save();
    ctx.strokeStyle = C.gold400 + "aa";
    ctx.lineWidth = clamp(w * 0.018, 3, 8);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();
  });

  // electron cloud around O
  const oCloud = ctx.createRadialGradient(cx, cy, 0, cx, cy, oR * 2.2);
  oCloud.addColorStop(0, C.gold400 + "44");
  oCloud.addColorStop(1, "transparent");
  ctx.save();
  ctx.globalAlpha = 0.5 + 0.2 * Math.sin(t * 1.4);
  ctx.beginPath();
  ctx.arc(cx, cy, oR * 2.2, 0, Math.PI * 2);
  ctx.fillStyle = oCloud;
  ctx.fill();
  ctx.restore();

  // O atom
  const oGrad = ctx.createRadialGradient(cx - oR * 0.3, cy - oR * 0.3, 0, cx, cy, oR);
  oGrad.addColorStop(0, "#ffffff");
  oGrad.addColorStop(0.35, C.gold400);
  oGrad.addColorStop(1, C.gold500);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, oR, 0, Math.PI * 2);
  ctx.fillStyle = oGrad;
  ctx.shadowColor = C.gold500;
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.font = `700 ${clamp(Math.floor(oR * 0.85), 7, 13)}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = C.void950;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("O", cx, cy);
  ctx.restore();

  // H atoms
  [{ x: h1x, y: h1y }, { x: h2x, y: h2y }].forEach(({ x, y }) => {
    const hGrad = ctx.createRadialGradient(x - hR * 0.3, y - hR * 0.3, 0, x, y, hR);
    hGrad.addColorStop(0, "#ffffff");
    hGrad.addColorStop(0.4, C.iris400);
    hGrad.addColorStop(1, C.iris500);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, hR, 0, Math.PI * 2);
    ctx.fillStyle = hGrad;
    ctx.shadowColor = C.iris400;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.font = `700 ${clamp(Math.floor(hR * 0.9), 6, 11)}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = C.void950;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("H", x, y);
    ctx.restore();
  });

  // dipole moment arrow
  ctx.save();
  ctx.strokeStyle = C.plasm500 + "88";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 5]);
  const dLen = R * 0.55;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - dLen);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(cx, cy - dLen);
  ctx.lineTo(cx - 4, cy - dLen + 9);
  ctx.lineTo(cx + 4, cy - dLen + 9);
  ctx.closePath();
  ctx.fillStyle = C.plasm500 + "88";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.022), 7, 10)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.gold400 + "bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("10⁻¹⁰–10⁻⁹ m", cx, clamp(cy - R - h * 0.1, 6, cy - 12));
  ctx.restore();
}

/* ── LEVEL 3: Cell — leaf/teal ───────────────────────────────────────────── */
function drawCell(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.leaf500);
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.33;

  // membrane pulse
  const pulse = 1 + 0.018 * Math.sin(t * 1.2);

  // outer membrane double bilayer
  for (let layer = 0; layer < 2; layer++) {
    const lr = R * pulse * (1 + layer * 0.06);
    ctx.save();
    ctx.strokeStyle = layer === 0
      ? C.leaf400 + "99"
      : C.leaf500 + "55";
    ctx.lineWidth = layer === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.arc(cx, cy, lr, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // cytoplasm fill
  const cyto = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * pulse);
  cyto.addColorStop(0, C.leaf500 + "22");
  cyto.addColorStop(0.7, C.leaf500 + "0e");
  cyto.addColorStop(1, "transparent");
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R * pulse, 0, Math.PI * 2);
  ctx.fillStyle = cyto;
  ctx.fill();
  ctx.restore();

  // organelles (deterministic positions)
  const organelles = [
    { seed: 10, r: R * 0.12, col: C.gold500, label: "M" },  // mitochondria
    { seed: 20, r: R * 0.09, col: C.gold500, label: "M" },
    { seed: 30, r: R * 0.065, col: C.iris400, label: "V" }, // vacuole
    { seed: 40, r: R * 0.055, col: C.flux400, label: "G" }, // golgi
  ];
  organelles.forEach(({ seed, r, col, label }) => {
    const angle = seeded(seed, 1) * Math.PI * 2 + t * seeded(seed, 5) * 0.15;
    const dist = seeded(seed, 2) * R * 0.52;
    const ox = cx + Math.cos(angle) * dist;
    const oy = cy + Math.sin(angle) * dist;
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    g.addColorStop(0, col + "ee");
    g.addColorStop(1, col + "33");
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.shadowColor = col;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    if (r > R * 0.09) {
      ctx.save();
      ctx.font = `700 ${clamp(Math.floor(r * 0.85), 5, 10)}px "JetBrains Mono", monospace`;
      ctx.fillStyle = C.void950;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, ox, oy);
      ctx.restore();
    }
  });

  // nucleus (larger, central-ish)
  const nucR = R * 0.22;
  const nucOff = R * 0.1;
  const nucX = cx + nucOff * Math.cos(t * 0.18);
  const nucY = cy + nucOff * Math.sin(t * 0.22);
  const nucGrad = ctx.createRadialGradient(nucX, nucY, 0, nucX, nucY, nucR);
  nucGrad.addColorStop(0, C.leaf400 + "cc");
  nucGrad.addColorStop(0.6, C.leaf500 + "88");
  nucGrad.addColorStop(1, C.leaf500 + "22");
  ctx.save();
  ctx.beginPath();
  ctx.arc(nucX, nucY, nucR, 0, Math.PI * 2);
  ctx.fillStyle = nucGrad;
  ctx.strokeStyle = C.leaf400 + "99";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(nucR * 0.55), 6, 9)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.leaf400;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DNA", nucX, nucY);
  ctx.restore();

  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.022), 7, 10)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.leaf400 + "bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("10⁻⁵–10⁻⁴ m", cx, clamp(cy - R * 1.12 - h * 0.02, 6, cy - 10));
  ctx.restore();
}

/* ── LEVEL 4: Organism — leaf/warm ──────────────────────────────────────── */
function drawOrganism(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.leaf400);
  const cx = w / 2, cy = h / 2;

  // heartbeat wave
  const beatPhase = t * 1.5;
  const beatY = cy + h * 0.26;
  const waveW = w * 0.72;
  const waveX = cx - waveW / 2;

  ctx.save();
  ctx.strokeStyle = C.flux400 + "cc";
  ctx.lineWidth = 2;
  ctx.shadowColor = C.flux400;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  const STEPS = 200;
  for (let i = 0; i <= STEPS; i++) {
    const x = waveX + (i / STEPS) * waveW;
    const phase = (i / STEPS) * Math.PI * 6 - beatPhase * 3;
    // ECG-like shape
    let y = beatY;
    const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    if (p > 1.1 && p < 1.4) y += -h * 0.12 * ((p - 1.1) / 0.15); // QRS spike
    else if (p >= 1.4 && p < 1.7) y += -h * 0.12 * ((1.7 - p) / 0.3);
    else y += Math.sin(phase * 0.4) * h * 0.018; // baseline undulation
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // stylised organism silhouette (simple radial body)
  const bodyR = Math.min(w, h) * 0.22;
  const bodyGrad = ctx.createRadialGradient(cx, cy - h * 0.05, 0, cx, cy - h * 0.05, bodyR * 1.3);
  bodyGrad.addColorStop(0, C.leaf400 + "44");
  bodyGrad.addColorStop(0.5, C.leaf500 + "28");
  bodyGrad.addColorStop(1, "transparent");
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy - h * 0.05, bodyR * 1.3, 0, Math.PI * 2);
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.restore();

  // organ nodes orbiting
  const organs = [
    { angle: -Math.PI / 2, label: "♡", col: C.flux400 },
    { angle: Math.PI / 6, label: "⬡", col: C.gold400 },
    { angle: Math.PI * 5 / 6, label: "⬡", col: C.gold400 },
    { angle: Math.PI * 3 / 2 + 0.3, label: "◎", col: C.iris400 },
  ];
  organs.forEach(({ angle, label, col }) => {
    const orbitR = bodyR * 0.75;
    const ox = cx + Math.cos(angle + t * 0.08) * orbitR;
    const oy = cy - h * 0.05 + Math.sin(angle + t * 0.08) * orbitR;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox, oy, bodyR * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = col + "44";
    ctx.strokeStyle = col + "bb";
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.font = `${clamp(Math.floor(w * 0.03), 8, 14)}px sans-serif`;
    ctx.fillStyle = col;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, ox, oy);
    ctx.restore();

    // connection line to centre
    ctx.save();
    ctx.strokeStyle = col + "44";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - h * 0.05);
    ctx.lineTo(ox, oy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  });

  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.022), 7, 10)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.leaf400 + "bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("10⁻³–1 m", cx, clamp(beatY + h * 0.06, h - 6, h - 2));
  ctx.restore();
}

/* ── LEVEL 5: Brain / Mind — flux/coral ─────────────────────────────────── */
function drawBrain(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.flux500);
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.3;

  // neuron nodes (deterministic positions)
  const N = 16;
  const nodes: { x: number; y: number; phase: number }[] = [];
  for (let i = 0; i < N; i++) {
    const angle = seeded(i, 10) * Math.PI * 2;
    const dist = seeded(i, 11) * R * 0.9 + R * 0.1;
    nodes.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      phase: seeded(i, 12) * Math.PI * 2,
    });
  }

  // synaptic edges
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (seeded(i * N + j, 99) > 0.62) continue;
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > R * 0.7) continue;

      // signal pulse travelling along edge
      const pulseT = ((t * 0.7 + seeded(i + j, 50)) % 1);
      const pulseX = nodes[i].x + dx * pulseT;
      const pulseY = nodes[i].y + dy * pulseT;

      ctx.save();
      ctx.strokeStyle = C.flux400 + "3a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
      ctx.restore();

      // travelling dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = C.flux400 + "cc";
      ctx.shadowColor = C.flux400;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  // neuron soma
  nodes.forEach((n, i) => {
    const alpha = clamp(0.5 + 0.5 * Math.sin(t * 1.8 + n.phase));
    const r = clamp(w * 0.014, 4, 8) * (0.8 + 0.4 * alpha);
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 1.8);
    g.addColorStop(0, C.flux400 + Math.round(clamp(alpha) * 220 + 35).toString(16).padStart(2, "0"));
    g.addColorStop(1, "transparent");
    ctx.save();
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = C.flux500;
    ctx.strokeStyle = C.flux400;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  // central "thought" glow
  const thGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55);
  thGlow.addColorStop(0, C.flux400 + "1e");
  thGlow.addColorStop(1, "transparent");
  ctx.save();
  ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 0.6);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = thGlow;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.022), 7, 10)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.flux400 + "bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("0.1–1 m", cx, cy - R - clamp(h * 0.06, 10, 20));
  ctx.restore();
}

/* ── LEVEL 6: Society — flux warm ───────────────────────────────────────── */
function drawSociety(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  fillBg(ctx, w, h, C.flux400);
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.32;

  // grid of "people" agents
  const cols = 7, rows = 5;
  const spacing = R * 2.1 / cols;
  const startX = cx - (cols / 2) * spacing;
  const startY = cy - (rows / 2) * spacing;

  type Agent = { x: number; y: number; group: number; phase: number };
  const agents: Agent[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      agents.push({
        x: startX + c * spacing,
        y: startY + r * spacing,
        group: Math.floor(seeded(i, 77) * 3),
        phase: seeded(i, 78) * Math.PI * 2,
      });
    }
  }

  const groupCols = [C.flux400, C.gold400, C.iris400];

  // connections between nearby same-group members
  agents.forEach((a, i) => {
    agents.forEach((b, j) => {
      if (j <= i) return;
      if (a.group !== b.group) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > spacing * 2.2) return;
      const col = groupCols[a.group];
      ctx.save();
      ctx.strokeStyle = col + "44";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    });
  });

  // norm / information ripples (emerging from a "leader" node)
  const leaderIdx = 17;
  const lx = agents[leaderIdx]?.x ?? cx;
  const ly = agents[leaderIdx]?.y ?? cy;
  for (let ring = 0; ring < 3; ring++) {
    const phase = (t * 0.55 + ring * 0.33) % 1;
    const rr = phase * R * 1.3;
    const alpha = clamp(1 - phase) * 0.3;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(lx, ly, rr, 0, Math.PI * 2);
    ctx.strokeStyle = C.flux400;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  // agent circles
  agents.forEach((a) => {
    const pulse = clamp(0.7 + 0.3 * Math.sin(t * 1.2 + a.phase));
    const r = clamp(w * 0.018, 3.5, 8) * pulse;
    const col = groupCols[a.group];
    ctx.save();
    ctx.beginPath();
    ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
    ctx.fillStyle = col + "cc";
    ctx.shadowColor = col;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
    // tiny head
    ctx.save();
    ctx.beginPath();
    ctx.arc(a.x, a.y - r * 1.6, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = col + "77";
    ctx.fill();
    ctx.restore();
  });

  ctx.save();
  ctx.font = `600 ${clamp(Math.floor(w * 0.022), 7, 10)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.flux400 + "bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("10²–10⁷ m", cx, cy - R - clamp(h * 0.06, 10, 18));
  ctx.restore();
}

/* ── level data ──────────────────────────────────────────────────────────── */
const LEVELS: Level[] = [
  {
    id: "quark",
    scale:   { en: "10⁻¹⁵ m — subatomic", zh: "10⁻¹⁵ 米 · 亚原子" },
    name:    { en: "Quark / Subatomic", zh: "夸克 / 亚原子" },
    vocab:   {
      en: ["wavefunction", "colour charge", "spin", "superposition", "quantum field"],
      zh: ["波函数", "色荷", "自旋", "叠加态", "量子场"],
    },
    note: {
      en: "Quantum mechanics governs here. Probability amplitudes, not trajectories. No concept of 'temperature' or 'bond' applies yet — those emerge later, from aggregates.",
      zh: "量子力学在此主宰。这里的语言是概率幅，而非轨迹。\"温度\"或\"化学键\"的概念在这个层次尚不存在——它们将从聚合中涌现。",
    },
    color: C.iris500, colorHi: C.iris400, panelClass: "panel-iris",
    draw: drawQuark,
  },
  {
    id: "atom",
    scale:   { en: "10⁻¹⁰ m — atomic", zh: "10⁻¹⁰ 米 · 原子" },
    name:    { en: "Atom", zh: "原子" },
    vocab:   {
      en: ["electron orbital", "ionisation energy", "valence", "wavefunction collapse", "spectral line"],
      zh: ["电子轨道", "电离能", "化合价", "波函数坍缩", "谱线"],
    },
    note: {
      en: "A new vocabulary clicks in: orbitals, valence, ionisation. These are real patterns — not illusions dressed up in convenient shorthand. The atom is not 'mostly empty space' any more than a melody is 'mostly silence'.",
      zh: "新的词汇浮现：轨道、价键、电离。这些是真实的规律，而非为了方便而虚构的简称。原子并不是\"大部分是空的\"，就像一段旋律并不\"大部分是沉默\"一样。",
    },
    color: C.iris500, colorHi: C.iris400, panelClass: "panel-iris",
    draw: drawAtom,
  },
  {
    id: "molecule",
    scale:   { en: "10⁻⁹ m — molecular", zh: "10⁻⁹ 米 · 分子" },
    name:    { en: "Molecule", zh: "分子" },
    vocab:   {
      en: ["chemical bond", "polarity", "reaction rate", "entropy", "free energy"],
      zh: ["化学键", "极性", "反应速率", "熵", "自由能"],
    },
    note: {
      en: "Thermodynamics is born here. 'Temperature', 'entropy', 'free energy' — none of these exist at the quantum level. They emerge from the statistics of vast numbers of particles. Emergence is not hand-waving; it is precise.",
      zh: "热力学诞生于此。\"温度\"\"熵\"\"自由能\"——这些概念在量子层面根本不存在，它们从大量粒子的统计中涌现。涌现不是含糊其辞，而是精确的。",
    },
    color: C.gold500, colorHi: C.gold400, panelClass: "panel-gold",
    draw: drawMolecule,
  },
  {
    id: "cell",
    scale:   { en: "10⁻⁵ m — cellular", zh: "10⁻⁵ 米 · 细胞" },
    name:    { en: "Cell", zh: "细胞" },
    vocab:   {
      en: ["metabolism", "membrane potential", "replication", "homeostasis", "ATP"],
      zh: ["代谢", "膜电位", "复制", "稳态", "ATP"],
    },
    note: {
      en: "Life's first foothold. The cell does not violate chemistry — it exploits it. Metabolism, replication, homeostasis: concepts meaningless at the molecular scale, indispensable here. Weak emergence is not magic; it is chemistry reading its own statistics.",
      zh: "生命的第一个立足点。细胞并不违反化学规律，而是利用它。代谢、复制、稳态：这些概念在分子层面毫无意义，在这里却不可或缺。弱涌现不是魔法，而是化学读懂了自身的统计规律。",
    },
    color: C.leaf500, colorHi: C.leaf400, panelClass: "panel-leaf",
    draw: drawCell,
  },
  {
    id: "organism",
    scale:   { en: "10⁻²–1 m — organism", zh: "10⁻²–1 米 · 有机体" },
    name:    { en: "Organism", zh: "有机体" },
    vocab:   {
      en: ["digestion", "immune response", "nervous system", "behaviour", "homeostasis"],
      zh: ["消化", "免疫应答", "神经系统", "行为", "稳态"],
    },
    note: {
      en: "Billions of cells coordinating. 'Digestion', 'immune response', 'nervous system' — these are not reducible to a single cell's vocabulary without loss. The level is real; the vocabulary is load-bearing.",
      zh: "数十亿个细胞协同运作。\"消化\"\"免疫应答\"\"神经系统\"——这些概念无法无损地还原为单个细胞的词汇。这个层次是真实的，词汇是有实质意义的。",
    },
    color: C.leaf400, colorHi: C.leaf400, panelClass: "panel-leaf",
    draw: drawOrganism,
  },
  {
    id: "brain",
    scale:   { en: "0.1–1 m — neural", zh: "0.1–1 米 · 神经" },
    name:    { en: "Brain / Mind", zh: "大脑 / 心智" },
    vocab:   {
      en: ["thought", "memory", "belief", "intention", "consciousness"],
      zh: ["思想", "记忆", "信念", "意图", "意识"],
    },
    note: {
      en: "'It's all neurons' is true, and 'therefore thoughts don't exist' does not follow. 'Belief' and 'intention' pick out real patterns. Denying them would cost you most of your ability to predict and explain human behaviour — precisely what good vocabulary is for.",
      zh: "\"一切都是神经元\"是真的，但\"因此思想不存在\"这个结论并不成立。\"信念\"与\"意图\"指向真实的模式。否认它们，你将失去大部分预测和解释人类行为的能力——这正是好词汇存在的意义。",
    },
    color: C.flux500, colorHi: C.flux400, panelClass: "",
    draw: drawBrain,
  },
  {
    id: "society",
    scale:   { en: "10²–10⁷ m — social", zh: "10²–10⁷ 米 · 社会" },
    name:    { en: "Society", zh: "社会" },
    vocab:   {
      en: ["norm", "institution", "law", "culture", "economy"],
      zh: ["规范", "制度", "法律", "文化", "经济"],
    },
    note: {
      en: "'It's all individuals' is true, and 'therefore institutions don't exist' does not follow. Laws, norms, and economies are patterns in collective behaviour — patterns with causal power. Saying 'there's no such thing as a nation, only people' is like saying 'there's no such thing as temperature, only molecules'.",
      zh: "\"一切都是个体\"是真的，但\"因此制度不存在\"这个结论并不成立。法律、规范和经济体是集体行为中的模式——具有因果力量的模式。说\"没有国家这种东西，只有人\"，就像说\"没有温度这种东西，只有分子\"。",
    },
    color: C.flux400, colorHi: C.flux400, panelClass: "",
    draw: drawSociety,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
interface LevelCanvasProps {
  levelIndex: number;
  animT: number;
}

function LevelCanvas({ levelIndex, animT }: LevelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(animT);
  const idxRef    = useRef(levelIndex);

  useEffect(() => { idxRef.current = levelIndex; }, [levelIndex]);
  useEffect(() => { tRef.current = animT; }, [animT]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    function tick(ts: number) {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      tRef.current += dt;
      const rect = canvas!.getBoundingClientRect();
      try {
        LEVELS[idxRef.current].draw(ctx!, rect.width, rect.height, tRef.current);
      } catch (_) { /* guard against any canvas edge-case */ }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function LayersViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const [levelIdx, setLevelIdx] = useState(0);
  const animT = useRef(0);

  const level = LEVELS[levelIdx];

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLevelIdx(parseInt(e.target.value, 10));
  }, []);

  const goTo = useCallback((i: number) => {
    setLevelIdx(i);
  }, []);

  return (
    <div className="w-full space-y-8">

      {/* ── header ──────────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1">
          {L("Theme 05 · Emergence", "主题 05 · 涌现")}
        </p>
        <h3 className={`display text-2xl md:text-3xl leading-tight mb-2 spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("Layers of Reality", "现实的层次")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-1 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "The universe is made of quarks all the way down — and also made of thoughts, norms, and economies all the way up. Both statements are true. Each level has its own real vocabulary; the language of the level below cannot say what the level above needs to say. Weak emergence: no new forces, but genuinely new patterns.",
            "宇宙从底层由夸克构成，也从顶层由思想、规范和经济构成。两句话都是真的。每个层次都拥有自己真实的词汇；下一层次的语言无法表达上一层次需要表达的内容。弱涌现：没有新的基本力，但存在真正新的模式。",
          )}
        </p>
        <div className="rule-flux h-px rounded mt-3" />
      </div>

      {/* ── main canvas + sidebar layout ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_260px] gap-5 items-start">

        {/* canvas */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            border: `1px solid ${level.color}30`,
            boxShadow: `0 0 60px -18px ${level.color}44`,
            transition: "border-color 0.5s ease, box-shadow 0.5s ease",
          }}
        >
          <div style={{ aspectRatio: "16/10", minHeight: 220 }}>
            <LevelCanvas levelIndex={levelIdx} animT={animT.current} />
          </div>

          {/* level name overlay */}
          <div
            className="absolute top-3 left-4 pointer-events-none"
            style={{ transition: "opacity 0.35s ease" }}
          >
            <p
              className={`display text-xl md:text-2xl leading-none ${lang === "zh" ? "zh" : ""}`}
              style={{ color: level.colorHi, textShadow: `0 0 24px ${level.color}99` }}
            >
              {lang === "zh" ? level.name.zh : level.name.en}
            </p>
            <p
              className="label-mono text-[0.58rem] mt-0.5"
              style={{ color: level.colorHi + "88", letterSpacing: "0.15em" }}
            >
              {lang === "zh" ? level.scale.zh : level.scale.en}
            </p>
          </div>

          {/* level indicator strip at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex">
            {LEVELS.map((lv, i) => (
              <div
                key={lv.id}
                className="flex-1 h-1 transition-all duration-400"
                style={{
                  background: i === levelIdx ? lv.color : lv.color + "25",
                  boxShadow: i === levelIdx ? `0 0 8px ${lv.color}` : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* right sidebar: vocab + note */}
        <div className="flex flex-col gap-4">

          {/* scale slider */}
          <div className={`panel ${level.panelClass} rounded-xl p-5 space-y-4 transition-all duration-400`}
            style={{ borderColor: `${level.color}35` }}
          >
            <p className="label-mono" style={{ color: level.colorHi }}>
              {L("Zoom Scale", "缩放尺度")}
            </p>

            {/* stepper buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={levelIdx === 0}
                onClick={() => goTo(Math.max(0, levelIdx - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm border transition-all duration-150"
                style={{
                  borderColor: `${level.color}44`,
                  background: levelIdx === 0 ? "transparent" : `${level.color}14`,
                  color: levelIdx === 0 ? C.ink500 : level.colorHi,
                  cursor: levelIdx === 0 ? "not-allowed" : "pointer",
                }}
                aria-label={L("Zoom out one level", "缩小一个层次")}
              >
                ‹
              </button>

              <input
                type="range"
                min="0"
                max={LEVELS.length - 1}
                step="1"
                value={levelIdx}
                onChange={handleSlider}
                className="flex-1 h-1.5 rounded cursor-ew-resize"
                style={{
                  accentColor: level.color,
                  background: `linear-gradient(90deg, ${C.iris500} 0%, ${C.gold500} 33%, ${C.leaf500} 55%, ${C.flux500} 100%)`,
                }}
                aria-label={L("Slide through scales of reality", "拖动以穿越现实的尺度")}
              />

              <button
                disabled={levelIdx === LEVELS.length - 1}
                onClick={() => goTo(Math.min(LEVELS.length - 1, levelIdx + 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm border transition-all duration-150"
                style={{
                  borderColor: `${level.color}44`,
                  background: levelIdx === LEVELS.length - 1 ? "transparent" : `${level.color}14`,
                  color: levelIdx === LEVELS.length - 1 ? C.ink500 : level.colorHi,
                  cursor: levelIdx === LEVELS.length - 1 ? "not-allowed" : "pointer",
                }}
                aria-label={L("Zoom in one level", "放大一个层次")}
              >
                ›
              </button>
            </div>

            {/* tick labels */}
            <div className="flex justify-between text-[0.52rem] font-mono" style={{ color: C.ink500 }}>
              <span>{L("Quark", "夸克")}</span>
              <span>{L("Society", "社会")}</span>
            </div>
          </div>

          {/* vocabulary chips */}
          <div
            key={level.id + "-vocab-" + lang}
            className="panel rounded-xl p-4 space-y-3 rise-in"
            style={{ borderColor: `${level.color}28` }}
          >
            <p className="label-mono text-[0.58rem]" style={{ color: level.colorHi }}>
              {L("Vocabulary at this level", "本层次的词汇")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(lang === "zh" ? level.vocab.zh : level.vocab.en).map((word) => (
                <span
                  key={word}
                  className={`px-2 py-0.5 rounded-full font-mono text-[0.62rem] border ${lang === "zh" ? "zh" : ""}`}
                  style={{
                    borderColor: `${level.color}55`,
                    background: `${level.color}14`,
                    color: level.colorHi,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* emergence note */}
          <div
            key={level.id + "-note-" + lang}
            className="panel rounded-xl p-4 rise-in"
            style={{ borderColor: `${level.color}20` }}
          >
            <p
              className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
              }}
            >
              {lang === "zh" ? level.note.zh : level.note.en}
            </p>
          </div>
        </div>
      </div>

      {/* ── level navigator pills ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((lv, i) => {
          const isActive = i === levelIdx;
          return (
            <button
              key={lv.id}
              onClick={() => goTo(i)}
              className="px-3 py-1.5 rounded-lg font-mono text-[0.58rem] tracking-wide border transition-all duration-200"
              style={{
                borderColor: isActive ? lv.color : `${lv.color}28`,
                background:  isActive ? `${lv.color}18` : "transparent",
                color:       isActive ? lv.colorHi : C.ink500,
                boxShadow:   isActive ? `0 0 14px -4px ${lv.color}66` : undefined,
              }}
            >
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "zh" ? lv.name.zh : lv.name.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── the key philosophical insight ─────────────────────────────────── */}
      <div className="space-y-4">
        <p className="label-mono" style={{ color: C.leaf400 }}>
          {L("The Core Argument", "核心论点")}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              color: C.iris400,
              title: { en: "Reductionism — true", zh: "还原论 · 真" },
              icon: "⬇",
              body: {
                en: "Every level obeys the rules of the level below. Atoms obey quantum mechanics. Cells obey chemistry. Minds obey neuroscience. There are no additional fundamental forces layered on top. The hierarchy is seamless, all the way down.",
                zh: "每个层次都遵守下一层次的规律。原子遵守量子力学。细胞遵守化学。心智遵守神经科学。没有任何额外的基本力叠加其上。这个层级结构是无缝的，一路向下。",
              },
            },
            {
              color: C.leaf400,
              title: { en: '"Only atoms are real" — false', zh: "\"只有原子是真实的\" · 假" },
              icon: "⬆",
              body: {
                en: "The useful information lives in the pattern, not the substrate. A sonnet is not better described as ink molecules than as language. A market crash is not better described as neuron firings than as investor panic. The pattern is real. Its vocabulary is load-bearing.",
                zh: "有用的信息存在于模式中，而非基底。一首十四行诗用墨分子描述，不如用语言描述。一场市场崩盘用神经元放电描述，不如用投资者恐慌描述。模式是真实的，它的词汇是有实质意义的。",
              },
            },
          ].map((card) => (
            <div
              key={card.title.en}
              className="panel rounded-xl p-5 space-y-3"
              style={{ borderColor: `${card.color}30` }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: card.color, fontSize: "1rem" }}>{card.icon}</span>
                <p
                  className={`display text-base leading-tight ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: card.color }}
                >
                  {lang === "zh" ? card.title.zh : card.title.en}
                </p>
              </div>
              <p
                className={`text-[0.72rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
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

        {/* capstone callout */}
        <div
          className="rounded-xl px-5 py-4 flex gap-3"
          style={{
            background: "rgba(45,212,191,0.04)",
            border: "1px solid rgba(45,212,191,0.18)",
          }}
        >
          <span style={{ color: C.leaf400, fontSize: "0.9rem", flexShrink: 0, lineHeight: 1.5 }}>◈</span>
          <p
            className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{
              color: C.ink300,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "Carroll's word for this is 'weak emergence': higher-level patterns are entailed by the lower-level physics, but they are not predictable or describable from it without conceptual work. No new forces; yes new vocabulary; yes genuine explanatory power. The division of reality into levels is not a failure of nerve — it is good epistemic practice.",
              "卡罗尔称之为\"弱涌现\"：高层模式由低层物理决定，但不借助概念工作便无法从低层预测或描述。没有新的基本力，但有新的词汇，有真实的解释力。将现实划分为层次，不是认知上的软弱，而是良好的认识论实践。",
            )}
          </p>
        </div>
      </div>

    </div>
  );
}
