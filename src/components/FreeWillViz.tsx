"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   FreeWillViz
   Theme 08 — Free Will & Compatibilism

   A "two descriptions of one act" visualization for Carroll's compatibilism.
   The user triggers a choice — "she raises her hand" — and sees the same
   event rendered in two valid, non-competing vocabularies:

   MICRO: particles/fields evolving under fixed laws. Deterministic substrate.
   MACRO: a person with desires deliberating among options; "could have done
          otherwise" in the compatibilist sense — the counterfactual sense.

   Prominent honest caveat: critics say this REDEFINES free will rather
   than vindicating the libertarian, uncaused kind many people mean.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── palette ─── */
const C = {
  void:   "#07080f",
  void9:  "#0c0e1a",
  void8:  "#12141f",
  void7:  "#1b1e30",
  // flux = coral / macro / human
  flux5:  "#ff6b5c",
  flux4:  "#ff9b8f",
  // iris = violet / micro / physical
  iris5:  "#8b7bff",
  iris4:  "#b3a8ff",
  // leaf = teal
  leaf5:  "#2dd4bf",
  // gold
  gold5:  "#f5b942",
  gold4:  "#ffd27a",
  // plasm = magenta / critique
  plasm5: "#ff4fa3",
  plasm4: "#ff8cc4",
  // ink
  ink50:  "#f4f4fb",
  ink3:   "#a8aac6",
  ink5:   "#6c6e90",
} as const;

/* ─── helpers ─── */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/* clamp 0-255 */
function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/* deterministic "random" from seed */
function seeded(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ─── micro particle (one neuron-region particle) ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  color: string; // hex
}

function makeParticles(w: number, h: number, n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    x: w * seeded(i * 7 + 1),
    y: h * seeded(i * 7 + 2),
    vx: (seeded(i * 7 + 3) - 0.5) * 0.7,
    vy: (seeded(i * 7 + 4) - 0.5) * 0.7,
    r: 1.2 + seeded(i * 7 + 5) * 2.2,
    phase: seeded(i * 7 + 6) * Math.PI * 2,
    color: i % 3 === 0 ? C.iris5 : i % 3 === 1 ? C.iris4 : C.leaf5,
  }));
}

/* ─── MICRO canvas ──────────────────────────────────────────────────────── */
function drawMicro(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  phase: "idle" | "triggered" | "settled",
  particles: Particle[]
) {
  ctx.clearRect(0, 0, w, h);

  // background
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, "#12141f");
  bg.addColorStop(1, "#07080f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const t = frame * 0.016;
  const triggered = phase === "triggered" || phase === "settled";
  const intensity = triggered ? 1.0 : 0.45;

  // draw field lines (deterministic lattice ripple)
  for (let ix = 0; ix < 5; ix++) {
    for (let iy = 0; iy < 3; iy++) {
      const bx = (w / 5) * (ix + 0.5);
      const by = (h / 3) * (iy + 0.5);
      const phase0 = ix * 1.3 + iy * 2.1;
      const amp = triggered ? 14 : 7;
      const cx2 = bx + Math.sin(t * 1.1 + phase0) * amp;
      const cy2 = by + Math.cos(t * 0.9 + phase0 + 1) * amp * 0.7;
      const ir = hexToRgb(C.iris5);
      const a = clamp(Math.round((0.04 + 0.08 * Math.sin(t * 1.4 + phase0)) * intensity * 255));
      ctx.strokeStyle = `rgba(${ir},${a / 255})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx2, cy2, 18 + 6 * Math.sin(t * 0.7 + phase0), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // move and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx * (triggered ? 1.8 : 0.9);
    p.y += p.vy * (triggered ? 1.8 : 0.9);
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    const pulse = 0.55 + 0.45 * Math.sin(t * 1.8 + p.phase);
    const gA = clamp(Math.round(0.28 * pulse * intensity * 255)) / 255;
    const rgb = hexToRgb(p.color);

    // glow
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
    grd.addColorStop(0, `rgba(${rgb},${gA})`);
    grd.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
    ctx.fill();

    // core dot
    ctx.fillStyle = `rgba(${rgb},${0.7 + 0.3 * pulse})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // connection lines between nearby particles (law-like bonds)
  ctx.lineWidth = 0.4;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[j].x - particles[i].x;
      const dy = particles[j].y - particles[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 55) {
        const a = clamp(Math.round((1 - dist / 55) * 0.25 * intensity * 255)) / 255;
        ctx.strokeStyle = `rgba(${hexToRgb(C.iris4)},${a})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // "DETERMINISTIC" law banner across top
  if (triggered) {
    const bA = Math.min(1, (frame % 999) * 0.014);
    ctx.font = "9px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(${hexToRgb(C.iris4)},${bA * 0.6})`;
    ctx.fillText("F = ma  ·  ψ(t+Δt) = Ûψ(t)  ·  S = kB ln Ω", w / 2, h - 10);
  }
}

/* ─── MACRO canvas (agent deliberation ring) ──────────────────────────── */
const CHOICES_EN = [
  "Raise hand",
  "Stay still",
  "Reach for water",
  "Turn head",
];
const CHOICES_ZH = [
  "举手",
  "保持不动",
  "伸手拿水",
  "转头",
];

function drawMacro(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  phase: "idle" | "triggered" | "settled",
  lang: "en" | "zh"
) {
  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, "#14120f");
  bg.addColorStop(1, "#07080f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const t = frame * 0.016;
  const choices = lang === "zh" ? CHOICES_ZH : CHOICES_EN;
  const cx = w / 2;
  const cy = h / 2;
  const ringR = Math.min(w, h) * 0.33;

  const triggered = phase === "triggered" || phase === "settled";
  const settled = phase === "settled";

  // soft ambient ring
  const ambient = ctx.createRadialGradient(cx, cy, ringR * 0.6, cx, cy, ringR * 1.2);
  ambient.addColorStop(0, `rgba(${hexToRgb(C.flux5)},0.04)`);
  ambient.addColorStop(1, `rgba(${hexToRgb(C.flux5)},0)`);
  ctx.fillStyle = ambient;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR * 1.2, 0, Math.PI * 2);
  ctx.fill();

  // deliberation orbit ring
  const orbA = triggered ? 0.22 : 0.1;
  ctx.strokeStyle = `rgba(${hexToRgb(C.flux5)},${orbA})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 9]);
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // choice nodes
  for (let i = 0; i < choices.length; i++) {
    const angle = (i / choices.length) * Math.PI * 2 - Math.PI / 2;
    const chosen = settled && i === 0; // choice index 0 = "Raise hand" — the chosen act
    const nx = cx + Math.cos(angle) * ringR;
    const ny = cy + Math.sin(angle) * ringR;

    const pulse = 0.5 + 0.5 * Math.sin(t * 1.3 + i * 1.4);
    const nodeR = chosen ? 11 : 8;
    const nodeA = chosen ? 0.95 : triggered ? 0.55 : 0.28;

    // spoke line from center
    const spokeA = chosen ? 0.55 : triggered ? 0.18 : 0.08;
    ctx.strokeStyle = `rgba(${hexToRgb(chosen ? C.flux5 : C.flux4)},${spokeA})`;
    ctx.lineWidth = chosen ? 1.5 : 0.7;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    // glow
    const gR = nodeR * (chosen ? 5.5 : 3.5);
    const nodeGlow = ctx.createRadialGradient(nx, ny, 0, nx, ny, gR);
    nodeGlow.addColorStop(0, `rgba(${hexToRgb(C.flux5)},${nodeA * pulse * 0.45})`);
    nodeGlow.addColorStop(1, `rgba(${hexToRgb(C.flux5)},0)`);
    ctx.fillStyle = nodeGlow;
    ctx.beginPath();
    ctx.arc(nx, ny, gR, 0, Math.PI * 2);
    ctx.fill();

    // node circle
    ctx.fillStyle = `rgba(${hexToRgb(chosen ? C.flux5 : C.flux4)},${nodeA})`;
    ctx.beginPath();
    ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${hexToRgb(chosen ? C.gold5 : C.flux4)},${chosen ? 0.9 : 0.35})`;
    ctx.lineWidth = chosen ? 2 : 1;
    ctx.stroke();

    // label
    const labelR = ringR + (chosen ? 30 : 24);
    const lx = cx + Math.cos(angle) * labelR;
    const ly = cy + Math.sin(angle) * labelR;
    ctx.font = `${chosen ? "bold " : ""}${lang === "zh" ? "11px" : "9px"} ${lang === "zh" ? "Noto Serif SC, serif" : "JetBrains Mono, monospace"}`;
    ctx.textAlign = "center";
    ctx.fillStyle = chosen
      ? `rgba(${hexToRgb(C.flux4)},0.95)`
      : `rgba(${hexToRgb(C.ink3)},${triggered ? 0.55 : 0.25})`;
    ctx.fillText(choices[i], lx, ly + 4);
  }

  // "CHOSEN" checkmark + arc on settled
  if (settled) {
    const chosenAngle = -Math.PI / 2;
    const nx = cx + Math.cos(chosenAngle) * ringR;
    const ny = cy + Math.sin(chosenAngle) * ringR;
    const arcA = Math.min(1, (frame % 999) * 0.02);
    ctx.strokeStyle = `rgba(${hexToRgb(C.gold5)},${arcA * 0.8})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(nx, ny, 16, 0, Math.PI * 2 * arcA);
    ctx.stroke();
  }

  // center agent node
  const agentR = 18;
  const agentGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, agentR * 3);
  agentGrad.addColorStop(0, `rgba(${hexToRgb(C.flux5)},${triggered ? 0.22 : 0.1})`);
  agentGrad.addColorStop(1, `rgba(${hexToRgb(C.flux5)},0)`);
  ctx.fillStyle = agentGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, agentR * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(${hexToRgb(C.void8)},0.9)`;
  ctx.beginPath();
  ctx.arc(cx, cy, agentR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(${hexToRgb(C.flux5)},${triggered ? 0.85 : 0.45})`;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // person glyph inside center circle
  ctx.fillStyle = `rgba(${hexToRgb(C.flux4)},${triggered ? 0.95 : 0.55})`;
  ctx.font = "13px serif";
  ctx.textAlign = "center";
  ctx.fillText("♾", cx, cy + 5);
}

/* ─── micro canvas component ────────────────────────────────────────────── */
function MicroCanvas({
  phase,
}: {
  phase: "idle" | "triggered" | "settled";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const phaseRef = useRef(phase);
  const particlesRef = useRef<Particle[]>([]);
  const sizedRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!sizedRef.current) {
        particlesRef.current = makeParticles(w, h, 38);
        sizedRef.current = true;
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      frameRef.current += 1;
      if (w > 0 && h > 0 && particlesRef.current.length > 0) {
        drawMicro(ctx!, w, h, frameRef.current, phaseRef.current, particlesRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl"
      style={{ height: "200px" }}
      aria-label="Micro substrate: particles and fields evolving under physical law"
    />
  );
}

/* ─── macro canvas component ────────────────────────────────────────────── */
function MacroCanvas({
  phase,
  lang,
}: {
  phase: "idle" | "triggered" | "settled";
  lang: "en" | "zh";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const phaseRef = useRef(phase);
  const langRef = useRef(lang);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      frameRef.current += 1;
      if (w > 0 && h > 0) {
        drawMacro(ctx!, w, h, frameRef.current, phaseRef.current, langRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl"
      style={{ height: "200px" }}
      aria-label="Macro description: agent deliberating among options"
    />
  );
}

/* ─── vocabulary comparison table row ──────────────────────────────────── */
interface VocabRow {
  en_dim: string;
  zh_dim: string;
  en_micro: string;
  zh_micro: string;
  en_macro: string;
  zh_macro: string;
}

const VOCAB_ROWS: VocabRow[] = [
  {
    en_dim: "Unit of description",
    zh_dim: "描述单元",
    en_micro: "Particles, fields, quantum amplitudes",
    zh_micro: "粒子、场、量子振幅",
    en_macro: "Person with beliefs, desires, intentions",
    zh_macro: "具有信念、欲望与意图的人",
  },
  {
    en_dim: "Causation",
    zh_dim: "因果关系",
    en_micro: "Physical law: F = ma, Schrödinger eq.",
    zh_micro: "物理定律：F = ma，薛定谔方程",
    en_macro: "Reasons → deliberation → choice",
    zh_macro: "理由 → 审慎 → 选择",
  },
  {
    en_dim: "'Could have done otherwise'",
    zh_dim: "「本可做出不同选择」",
    en_micro: "No — prior state + laws fix the outcome.",
    zh_micro: "否——初始状态加定律决定结果。",
    en_macro: "Yes — if circumstances / desires had differed, the act would differ.",
    zh_macro: "是——若环境或欲望不同，行为结果也会不同。",
  },
  {
    en_dim: "Responsibility",
    zh_dim: "责任",
    en_micro: "Not applicable at this level.",
    zh_micro: "此层面不适用。",
    en_macro: "Fully applicable: acted from own reasoning.",
    zh_macro: "完全适用：源于自身推理而行动。",
  },
  {
    en_dim: "Free will",
    zh_dim: "自由意志",
    en_micro: "Absent (no meaningful concept at particle level).",
    zh_micro: "不存在（粒子层面无此概念）。",
    en_macro: "Present — the kind that matters for ethics and law.",
    zh_macro: "存在——这正是伦理与法律所关切的那种。",
  },
];

/* ─── vocab table component ─────────────────────────────────────────────── */
function VocabTable({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  return (
    <div className="panel rounded-xl overflow-x-auto">
      <table className="w-full text-[0.72rem] border-collapse min-w-[420px]">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { en: "Dimension", zh: "维度" },
              { en: "Micro (physics)", zh: "微观（物理）" },
              { en: "Macro (person)", zh: "宏观（人）" },
            ].map((h, i) => (
              <th
                key={i}
                className={`text-left px-4 py-3 font-mono text-[0.62rem] ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: i === 0 ? C.ink3 : i === 1 ? C.iris4 : C.flux4,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {lang === "zh" ? h.zh : h.en}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VOCAB_ROWS.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <td className={`px-4 py-3 font-semibold text-[0.7rem] ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink3 }}>
                {L(row.en_dim, row.zh_dim)}
              </td>
              <td className={`px-4 py-3 ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.iris4, fontFamily: "JetBrains Mono, monospace" }}>
                {L(row.en_micro, row.zh_micro)}
              </td>
              <td className={`px-4 py-3 ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.flux4 }}>
                {L(row.en_macro, row.zh_macro)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── analogy panel ─────────────────────────────────────────────────────── */
function AnalogyPanel({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const analogies = [
    {
      en_claim: "The table is solid.",
      zh_claim: "这张桌子是固体。",
      en_micro: "Mostly empty space — atoms separated by fields.",
      zh_micro: "大部分是空的——原子之间被场隔开。",
      en_verdict: "Micro doesn't falsify macro. Both true.",
      zh_verdict: "微观不反驳宏观，两者均为真。",
      color: C.leaf5,
    },
    {
      en_claim: "Water is wet.",
      zh_claim: "水是湿的。",
      en_micro: "H₂O molecules: no 'wetness' property at particle scale.",
      zh_micro: "H₂O分子：粒子尺度上无「湿润」属性。",
      en_verdict: "An emergent property — real at the level it applies.",
      zh_verdict: "涌现属性——在其适用的层面上是真实的。",
      color: C.iris4,
    },
    {
      en_claim: "She freely chose to raise her hand.",
      zh_claim: "她自由地选择举起了手。",
      en_micro: "Neurons fired by electrochemical law — no uncaused cause.",
      zh_micro: "神经元受电化学定律驱动——没有无因之因。",
      en_verdict: "Carroll: free in the only sense that exists or matters.",
      zh_verdict: "卡罗尔：在唯一存在且重要的意义上是自由的。",
      color: C.flux4,
    },
  ];

  return (
    <div className="space-y-3">
      {analogies.map((a, i) => {
        const rgb = hexToRgb(a.color);
        return (
          <div
            key={i}
            className="panel rounded-xl p-4 space-y-2.5"
            style={{ borderColor: `rgba(${rgb},0.22)` }}
          >
            <p className={`font-semibold text-[0.86rem] ${lang === "zh" ? "zh" : ""}`}
               style={{ color: a.color }}>
              "{L(a.en_claim, a.zh_claim)}"
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="rounded-lg p-2.5 space-y-0.5"
                   style={{ background: "rgba(139,123,255,0.06)", border: "1px solid rgba(139,123,255,0.12)" }}>
                <p className="label-mono text-[0.52rem]" style={{ color: C.iris4 }}>
                  {L("Micro says", "微观层面")}
                </p>
                <p className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                   style={{ color: C.ink3 }}>
                  {L(a.en_micro, a.zh_micro)}
                </p>
              </div>
              <div className="rounded-lg p-2.5 space-y-0.5"
                   style={{ background: "rgba(245,185,66,0.05)", border: "1px solid rgba(245,185,66,0.14)" }}>
                <p className="label-mono text-[0.52rem]" style={{ color: C.gold4 }}>
                  {L("Verdict", "结论")}
                </p>
                <p className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                   style={{ color: C.ink3 }}>
                  {L(a.en_verdict, a.zh_verdict)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── critique panel ────────────────────────────────────────────────────── */
function CritiquePanel({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const [open, setOpen] = useState(true);

  return (
    <div
      className="panel panel-plasm rounded-2xl overflow-hidden"
      style={{
        borderColor: "rgba(255,79,163,0.32)",
        boxShadow: "0 0 64px -28px rgba(255,79,163,0.35)",
      }}
    >
      <button
        className="w-full flex items-start gap-4 p-5 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="label-mono text-[0.6rem]" style={{ color: C.plasm4 }}>
              {L("Live Debate · Honest Caveat", "尚存争议 · 诚实说明")}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[0.55rem] font-mono border"
              style={{
                color: C.plasm4,
                borderColor: "rgba(255,79,163,0.3)",
                background: "rgba(255,79,163,0.08)",
              }}
            >
              {L("Read This", "请阅读此处")}
            </span>
          </div>
          <h3 className={`display text-base md:text-xl ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.plasm4 }}>
            {L(
              "Did Carroll vindicate free will — or tactfully replace it?",
              "卡罗尔是在捍卫自由意志，还是在悄然替换它？"
            )}
          </h3>
        </div>
        <span
          className="label-mono text-[0.55rem] shrink-0 mt-1 transition-transform duration-300"
          style={{ color: C.plasm4, transform: open ? "rotate(180deg)" : undefined }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-5 pb-6 space-y-5 rise-in">
          <div
            className="h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,79,163,0.5), transparent)" }}
          />

          {/* core tension */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "linear-gradient(135deg, rgba(255,79,163,0.06), rgba(255,107,92,0.04))",
              border: "1px solid rgba(255,79,163,0.18)",
            }}
          >
            <p className={`text-[0.9rem] font-semibold leading-snug ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.plasm4 }}>
              {L(
                "The redefinition objection: Carroll's 'free will' is not what most people mean.",
                "重新定义的反驳：卡罗尔的「自由意志」并非大多数人所指的那种。"
              )}
            </p>
            <p className={`text-[0.8rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.ink3 }}>
              {L(
                "The libertarian intuition — shared by most non-philosophers — is that genuine free will requires some act of choice that is not fully determined by prior causes and physical law. Call this 'contra-causal' freedom. Carroll argues that concept is incoherent in a world of physical law. But critics (Galen Strawson, Peter van Inwagen, and many ordinary people) insist that simply relabelling the compatible remainder 'free will' doesn't vindicate the thing people actually care about; it dissolves the problem by semantic substitution rather than solving it.",
                "大多数非哲学背景人士所持的自由论直觉是：真正的自由意志要求某种选择行为不完全由先前原因和物理定律所决定。可将此称为「反因果」自由。卡罗尔认为，在物理定律主宰的世界中，这一概念是不连贯的。但批评者（加伦·斯特劳森、彼得·范·因瓦根，以及许多普通人）坚持认为：仅仅将兼容主义的剩余部分重新标注为「自由意志」，并不能捍卫人们真正在乎的东西；这是用语义替换来消解问题，而非解决问题。"
              )}
            </p>
          </div>

          {/* two sides */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div
              className="panel rounded-xl p-4 space-y-2"
              style={{ borderColor: "rgba(45,212,191,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: C.leaf5 }}>◆</span>
                <span className={`text-[0.74rem] font-semibold ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: C.leaf5 }}>
                  {L("Carroll's compatibilist case", "卡罗尔的兼容主义立场")}
                </span>
              </div>
              <ul className={`space-y-1.5 text-[0.72rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.ink3 }}>
                {[
                  L(
                    "The libertarian concept requires something — a causally unconstrained will — that has no place in the best current picture of physics.",
                    "自由论概念需要某种在当前最佳物理图景中没有位置的东西——一个不受因果约束的意志。"
                  ),
                  L(
                    "Holding people responsible is fully warranted at the human scale. Nothing is lost for ethics, law, or lived experience.",
                    "在人的尺度上追究责任完全正当。对于伦理、法律或生活体验而言，什么都没有失去。"
                  ),
                  L(
                    "'Solid', 'wet', 'alive' are also emergent vocabulary inapplicable at the particle level; we don't say those concepts are fake.",
                    "「固体」「湿润」「生命」也是涌现词汇，在粒子层面同样不适用；我们不会说这些概念是虚假的。"
                  ),
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span style={{ color: C.leaf5 }} className="shrink-0 mt-0.5">·</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="panel rounded-xl p-4 space-y-2"
              style={{ borderColor: "rgba(255,79,163,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: C.plasm4 }}>◈</span>
                <span className={`text-[0.74rem] font-semibold ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: C.plasm4 }}>
                  {L("The libertarian objection", "自由论的反驳")}
                </span>
              </div>
              <ul className={`space-y-1.5 text-[0.72rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.ink3 }}>
                {[
                  L(
                    "Compatibilist 'free will' is perfectly fine as a concept — it just isn't what has historically been called free will, and it doesn't satisfy what people feel is at stake.",
                    "兼容主义的「自由意志」作为概念完全没问题——只是它并不是历史上所称的自由意志，也无法满足人们感受到的那种切身关切。"
                  ),
                  L(
                    "Renaming 'what happens when reasons influence behaviour' as 'free will' is a bait-and-switch. The hard question — whether any choice is, in any sense, truly up to us — is left untouched.",
                    "将「理由影响行为时所发生的事」重新命名为「自由意志」是一种偷换概念。真正的难题——任何选择在任何意义上是否真正由我们决定——依然未被触及。"
                  ),
                  L(
                    "The analogy to 'solid' doesn't hold perfectly: nobody feels a moral stake in whether tables are really solid at the atomic scale. They do feel one about free will.",
                    "「固体」的类比并不完全成立：没有人觉得桌子在原子尺度上是否真正坚固与道德息息相关。但对于自由意志，人们确实有这种切身感受。"
                  ),
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span style={{ color: C.plasm4 }} className="shrink-0 mt-0.5">·</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* open question */}
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: "rgba(245,185,66,0.05)",
              border: "1px solid rgba(245,185,66,0.2)",
            }}
          >
            <span style={{ color: C.gold4 }} className="shrink-0 text-base mt-0.5">◇</span>
            <p className={`text-[0.8rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.ink3 }}>
              {L(
                "The question is genuinely open among professional philosophers. Carroll's compatibilism is the majority view in analytic philosophy departments, but the libertarian intuition refuses to die because it tracks something real about the phenomenology of choice. This visualization presents both levels honestly; whether that dissolves the problem or merely restates it is a question you should keep asking.",
                "这个问题在职业哲学家之间仍然悬而未决。卡罗尔的兼容主义是分析哲学系的主流观点，但自由论的直觉之所以难以消亡，是因为它触及了关于选择现象学的某种真实感受。本可视化诚实地呈现两个层面；这究竟是消解了问题，还是仅仅重述了问题——这个追问应当保持开放。"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── two-pane description strip ────────────────────────────────────────── */
function DescriptionStrip({
  phase,
  lang,
}: {
  phase: "idle" | "triggered" | "settled";
  lang: "en" | "zh";
}) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const microLines: Array<{ en: string; zh: string; phase: "idle" | "triggered" | "settled" }> = [
    { en: "Neural substrate at rest. Field amplitudes in ground state.", zh: "神经基底处于静止。场振幅处于基态。", phase: "idle" },
    { en: "Motor cortex activates. Action potential propagates — electrochemical cascade.", zh: "运动皮层激活。动作电位传播——电化学级联反应。", phase: "triggered" },
    { en: "Neuromuscular junction fires. Muscle fibers contract. Governed throughout by physical law.", zh: "神经肌肉接头放电。肌纤维收缩。全程受物理定律支配。", phase: "settled" },
  ];
  const macroLines: Array<{ en: string; zh: string; phase: "idle" | "triggered" | "settled" }> = [
    { en: "She considers her options. Reasons are present to her.", zh: "她正在考虑各种选项。理由已在她心中呈现。", phase: "idle" },
    { en: "She deliberates. Desires, beliefs, and plans are weighed.", zh: "她进行权衡。欲望、信念与计划被置于审视之下。", phase: "triggered" },
    { en: "She chooses to raise her hand. She could have done otherwise — had her desires or situation differed.", zh: "她选择举起手。若她的欲望或处境不同，她本可作出别的选择。", phase: "settled" },
  ];

  const mLine = microLines.find(l => l.phase === phase) ?? microLines[0];
  const mALine = macroLines.find(l => l.phase === phase) ?? macroLines[0];

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div
        className="panel rounded-xl p-4 space-y-2"
        style={{ borderColor: "rgba(139,123,255,0.22)" }}
      >
        <p className="label-mono text-[0.55rem]" style={{ color: C.iris4 }}>
          {L("Micro description · physics vocabulary", "微观描述 · 物理词汇")}
        </p>
        <p
          key={phase + "m"}
          className={`text-[0.82rem] leading-relaxed rise-in ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.iris4 }}
        >
          {L(mLine.en, mLine.zh)}
        </p>
      </div>
      <div
        className="panel rounded-xl p-4 space-y-2"
        style={{ borderColor: "rgba(255,107,92,0.22)" }}
      >
        <p className="label-mono text-[0.55rem]" style={{ color: C.flux4 }}>
          {L("Macro description · person vocabulary", "宏观描述 · 人的词汇")}
        </p>
        <p
          key={phase + "a"}
          className={`text-[0.82rem] leading-relaxed rise-in ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.flux4 }}
        >
          {L(mALine.en, mALine.zh)}
        </p>
      </div>
    </div>
  );
}

/* ─── root component ────────────────────────────────────────────────────── */
export default function FreeWillViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const [phase, setPhase] = useState<"idle" | "triggered" | "settled">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (phase === "triggered") return;
    setPhase("triggered");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPhase("settled");
    }, 2200);
  }, [phase]);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("idle");
  }, []);

  return (
    <section className="w-full space-y-8 py-2">

      {/* ── header ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.flux4 }}>
          {L("Theme 08 · Free Will", "主题08 · 自由意志")}
        </p>
        <h2 className="display text-2xl md:text-3xl spark-text">
          {L("Two Descriptions of One Act", "一个行为，两种描述")}
        </h2>
        <p
          className={`text-[0.88rem] max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink3 }}
        >
          {L(
            "Sean Carroll's compatibilism: free will is real — not because physics allows uncaused choices, but because the human-scale vocabulary of deliberation, reasons, and responsibility is a legitimate and indispensable way of describing the same world that physics describes at a lower level. The two vocabularies are compatible, not competing.",
            "卡罗尔的兼容主义：自由意志是真实的——不是因为物理学允许无因之果，而是因为关于审慎、理由与责任的人类尺度词汇，是描述同一个世界的合法且不可或缺的方式——物理学只是在更低层面描述了同一个世界。两种词汇是兼容的，而非相互竞争。"
          )}
        </p>
      </div>

      {/* ── critique panel (prominent, always visible) ─────────────────── */}
      <CritiquePanel lang={lang} />

      {/* ── trigger control ────────────────────────────────────────────── */}
      <div
        className="panel rounded-2xl p-5 space-y-4"
        style={{ borderColor: "rgba(245,185,66,0.18)" }}
      >
        <div className="space-y-1">
          <p className="label-mono text-[0.58rem]" style={{ color: C.gold4 }}>
            {L("Interactive · The Act", "交互 · 这一行为")}
          </p>
          <p className={`text-[0.84rem] ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink3 }}>
            {L(
              "She is about to raise her hand. Trigger the act and watch the same event described in two valid vocabularies simultaneously.",
              "她即将举起她的手。触发这个行为，观察同一事件如何在两种有效词汇中被同时描述。"
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={trigger}
            disabled={phase === "triggered"}
            className={`px-5 py-2.5 rounded-full font-mono text-[0.8rem] border transition-all duration-300 ${
              phase === "triggered"
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer hover:brightness-110"
            }`}
            style={{
              background: "rgba(245,185,66,0.12)",
              borderColor: "rgba(245,185,66,0.45)",
              color: C.gold4,
              boxShadow: phase === "idle" ? "0 0 28px -10px rgba(245,185,66,0.5)" : undefined,
            }}
          >
            {L(
              phase === "triggered" ? "Deliberating…" : phase === "settled" ? "She raised her hand ✓" : "She decides to raise her hand →",
              phase === "triggered" ? "正在权衡…" : phase === "settled" ? "她举起了手 ✓" : "她决定举起手 →"
            )}
          </button>
          {phase !== "idle" && (
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-full font-mono text-[0.75rem] border transition-all duration-200 hover:brightness-110 cursor-pointer"
              style={{
                background: "transparent",
                borderColor: "rgba(168,170,198,0.2)",
                color: C.ink5,
              }}
            >
              {L("Reset", "重置")}
            </button>
          )}
          {/* phase indicator dots */}
          <div className="flex items-center gap-1.5 ml-auto">
            {(["idle", "triggered", "settled"] as const).map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === p ? "pulse" : ""}`}
                style={{
                  background: phase === p
                    ? (p === "idle" ? C.ink5 : p === "triggered" ? C.gold5 : C.flux5)
                    : "rgba(108,110,144,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── dual canvas panels ──────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* MICRO panel */}
        <div
          className="panel rounded-2xl p-4 space-y-3"
          style={{ borderColor: "rgba(139,123,255,0.25)" }}
        >
          <div className="space-y-0.5">
            <p className="label-mono text-[0.58rem]" style={{ color: C.iris4 }}>
              {L("Micro description · fundamental physics", "微观描述 · 基础物理")}
            </p>
            <p className={`text-[0.72rem] ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.ink5 }}>
              {L(
                "Particles, fields, and electrochemical cascades — governed throughout by law. No free will here; no 'her'. Just physics.",
                "粒子、场与电化学级联——全程受定律支配。这里没有自由意志，也没有「她」，只有物理。"
              )}
            </p>
          </div>
          <MicroCanvas phase={phase} />
          <div
            className="rounded-lg px-3 py-2"
            style={{ background: "rgba(139,123,255,0.07)", border: "1px solid rgba(139,123,255,0.15)" }}
          >
            <p className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.iris4 }}>
              {L(
                "At this level: deterministic (or quantum-random) — no agent, no choice, no responsibility. These concepts are simply out of scope.",
                "在这一层面：确定性的（或量子随机的）——没有主体，没有选择，没有责任。这些概念在此层面根本无从适用。"
              )}
            </p>
          </div>
        </div>

        {/* MACRO panel */}
        <div
          className="panel rounded-2xl p-4 space-y-3"
          style={{ borderColor: "rgba(255,107,92,0.25)" }}
        >
          <div className="space-y-0.5">
            <p className="label-mono text-[0.58rem]" style={{ color: C.flux4 }}>
              {L("Macro description · human person", "宏观描述 · 人的层面")}
            </p>
            <p className={`text-[0.72rem] ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.ink5 }}>
              {L(
                "An agent with desires, deliberating among available options — the level where 'choice', 'responsibility', and 'could have done otherwise' apply.",
                "具有欲望的主体，在可用选项中进行审慎权衡——「选择」「责任」与「本可不同」在此层面才有意义。"
              )}
            </p>
          </div>
          <MacroCanvas phase={phase} lang={lang} />
          <div
            className="rounded-lg px-3 py-2"
            style={{ background: "rgba(255,107,92,0.07)", border: "1px solid rgba(255,107,92,0.15)" }}
          >
            <p className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
               style={{ color: C.flux4 }}>
              {L(
                "At this level: the concept of free will is fully applicable and real. 'Could have done otherwise' means: had desires or circumstances differed, the act would have differed.",
                "在这一层面：自由意志的概念完全适用且真实存在。「本可做出不同选择」意味着：若欲望或情境有所不同，行为就会不同。"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── description strip ───────────────────────────────────────────── */}
      <DescriptionStrip phase={phase} lang={lang} />

      {/* ── rule ──────────────────────────────────────────────────────── */}
      <div className="w-full h-px rule-flux rounded" />

      {/* ── analogy section ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="label-mono" style={{ color: C.ink3 }}>
            {L("The structural argument — analogies", "结构性论证——类比")}
          </p>
          <p className={`text-[0.84rem] max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
             style={{ color: C.ink5 }}>
            {L(
              "Carroll's move: the micro description of X never falsifies the macro description of X, as long as both are at the right level of abstraction. 'She freely chose' stands to 'neurons fired' as 'the table is solid' stands to 'mostly empty atoms'.",
              "卡罗尔的论证策略：对X的微观描述从不反驳对X的宏观描述，只要两者都处于正确的抽象层级。「她自由地选择了」与「神经元放电」的关系，正如「桌子是固体」与「大部分是空的原子」的关系。"
            )}
          </p>
        </div>
        <AnalogyPanel lang={lang} />
      </div>

      {/* ── vocabulary table ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.ink3 }}>
          {L("Two vocabularies — same world", "两种词汇——同一个世界")}
        </p>
        <VocabTable lang={lang} />
        <p className="text-[0.65rem] font-mono" style={{ color: C.ink5 }}>
          {L(
            "Neither column falsifies the other. The micro column is not more real — it is more fundamental. Both are real at the level they apply.",
            "两列互不反驳。微观一列并非更真实——它只是更基础。两者在各自适用的层面上都是真实的。"
          )}
        </p>
      </div>

      {/* ── closing note ──────────────────────────────────────────────── */}
      <div
        className="panel panel-iris rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: C.iris4 }}>◇</span>
          <span className="label-mono text-[0.62rem]" style={{ color: C.iris4 }}>
            {L("Carroll's conclusion", "卡罗尔的结论")}
          </span>
        </div>
        <p className={`text-[0.86rem] leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
           style={{ color: C.ink3 }}>
          {L(
            "Free will, properly understood, is perfectly compatible with a world governed by physical law. The 'could have done otherwise' that matters is not a mysterious gap in causation — it is a true counterfactual statement at the human scale. What makes an act free is that it flows from the agent's own reasoning, desires, and character: the things that are genuinely hers.",
            "正确理解的自由意志，与受物理定律支配的世界完全兼容。那种重要的「本可做出不同选择」，并不是因果关系中神秘的空缺——而是在人的尺度上成立的真实反事实陈述。使一个行为自由的，是它源自主体自身的推理、欲望与性格：这些才是真正属于她的东西。"
          )}
        </p>
        <div className="h-px" style={{ background: "rgba(139,123,255,0.15)" }} />
        <p className={`text-[0.76rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
           style={{ color: C.ink5 }}>
          {L(
            "Whether this satisfies the philosophical question depends on what you thought the question was. Compatibilism is the majority view in professional philosophy; the libertarian intuition remains widespread among non-specialists. This visualization presents Carroll's account faithfully while keeping the debate open — as it should be.",
            "这是否解答了哲学问题，取决于你认为这个问题究竟是什么。兼容主义是职业哲学界的主流观点；自由论的直觉在非专业人士中依然广泛存在。本可视化忠实呈现卡罗尔的论述，同时保持争论的开放性——这正是应有的态度。"
          )}
        </p>
      </div>

    </section>
  );
}
