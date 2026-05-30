"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   ConsciousnessViz
   Theme 07 — Consciousness & the Inner World

   Part 1: Split-canvas "same event, two descriptions"
           LEFT  (OUTER / third-person) — neurons firing, iris/violet palette
           RIGHT (INNER / first-person) — felt qualia, flux/coral palette
           Blend slider: cross-fades between views. Both always animate.

   Part 2: The Hard Problem — four live philosophical positions on
           consciousness (Carroll-naturalism, dualism, panpsychism,
           mysterianism / illusionism). Prominent "UNSOLVED" framing.

   Part 3: Carroll's Poetic Naturalist position — explained, credited,
           and placed among the alternatives. Not declared the winner.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── palette — matches globals.css contract ─── */
const C = {
  void950:  "#07080f",
  void900:  "#0c0e1a",
  void800:  "#12141f",
  void700:  "#1b1e30",
  /* flux — inner / felt view — coral */
  flux500:  "#ff6b5c",
  flux400:  "#ff9b8f",
  flux300:  "#ffc4ba",
  /* iris — outer / neural view — violet */
  iris500:  "#8b7bff",
  iris400:  "#b3a8ff",
  iris300:  "#d4ceff",
  /* leaf — teal */
  leaf500:  "#2dd4bf",
  leaf400:  "#6ee7d6",
  /* gold */
  gold500:  "#f5b942",
  gold400:  "#ffd27a",
  /* plasm — hard problem / contested — magenta */
  plasm500: "#ff4fa3",
  plasm400: "#ff8cc4",
  /* ink */
  ink50:    "#f4f4fb",
  ink300:   "#a8aac6",
  ink500:   "#6c6e90",
} as const;

/* ─── deterministic noise — never called with Date.now() in render ─── */
function dNoise(seed: number, t: number): number {
  const x = Math.sin(seed * 127.1 + t * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* ═══════════════════════════════════════════════════════════════════
   NEURON NETWORK — deterministic seeds
═══════════════════════════════════════════════════════════════════ */
interface Neuron {
  fx: number; fy: number;  // 0..1 fractions
  r: number;
  phase: number;
  speed: number;
}
interface Synapse { a: number; b: number }

const N_NEURONS = 22;
const NEURONS: Neuron[] = Array.from({ length: N_NEURONS }, (_, i) => ({
  fx:    0.06 + dNoise(i * 5 + 0, 0) * 0.88,
  fy:    0.06 + dNoise(i * 5 + 1, 0) * 0.88,
  r:     3.5 + dNoise(i * 5 + 2, 0) * 4.5,
  phase: dNoise(i * 5 + 3, 0) * Math.PI * 2,
  speed: 0.6 + dNoise(i * 5 + 4, 0) * 1.6,
}));

/* connect nearby pairs deterministically */
const SYNAPSES: Synapse[] = (() => {
  const out: Synapse[] = [];
  for (let a = 0; a < N_NEURONS; a++) {
    for (let b = a + 1; b < N_NEURONS; b++) {
      const dx = NEURONS[a].fx - NEURONS[b].fx;
      const dy = NEURONS[a].fy - NEURONS[b].fy;
      if (dx * dx + dy * dy < 0.07) out.push({ a, b });
    }
  }
  return out;
})();

/* ═══════════════════════════════════════════════════════════════════
   QUALIA PARTICLES — felt-experience side
═══════════════════════════════════════════════════════════════════ */
interface QParticle {
  fx: number; fy: number;
  r: number;
  phase: number;
  speed: number;
  hue: number; // 0..1 maps to palette
}
const N_QUALIA = 34;
const QUALIA: QParticle[] = Array.from({ length: N_QUALIA }, (_, i) => ({
  fx:    0.05 + dNoise(i * 7 + 0, 0) * 0.9,
  fy:    0.05 + dNoise(i * 7 + 1, 0) * 0.9,
  r:     2.8 + dNoise(i * 7 + 2, 0) * 6.2,
  phase: dNoise(i * 7 + 3, 0) * Math.PI * 2,
  speed: 0.4 + dNoise(i * 7 + 4, 0) * 1.0,
  hue:   dNoise(i * 7 + 5, 0),
}));

/* ═══════════════════════════════════════════════════════════════════
   DRAW: OUTER — neural firing network (left / violet)
═══════════════════════════════════════════════════════════════════ */
function drawOuter(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  frame: number,
  alpha: number,   // 0 = hidden, 1 = fully visible
) {
  const t = frame * 0.012;

  // synapses first (below neurons)
  for (const { a, b } of SYNAPSES) {
    const na = NEURONS[a]; const nb = NEURONS[b];
    const ax = na.fx * w; const ay = na.fy * h;
    const bx = nb.fx * w; const by = nb.fy * h;

    // signal pulse along synapse: 0..1 fraction
    const pulse = (Math.sin(t * na.speed * 0.8 + na.phase) + 1) / 2;
    const brightness = clamp01(0.12 + pulse * 0.38);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = `rgba(139,123,255,${brightness * alpha})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // travelling dot
    const dot = (t * na.speed * 0.25 + na.phase / (Math.PI * 2)) % 1;
    const dx = lerp(ax, bx, dot);
    const dy = lerp(ay, by, dot);
    ctx.beginPath();
    ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(179,168,255,${clamp01(0.5 * alpha)})`;
    ctx.fill();
  }

  // neurons
  for (let i = 0; i < N_NEURONS; i++) {
    const n = NEURONS[i];
    const fire = (Math.sin(t * n.speed + n.phase) + 1) / 2;
    const nx = n.fx * w; const ny = n.fy * h;
    const glow = clamp01(0.14 + fire * 0.72);

    // glow halo
    const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r * 5);
    rg.addColorStop(0, `rgba(139,123,255,${glow * alpha * 0.8})`);
    rg.addColorStop(0.5, `rgba(139,123,255,${glow * alpha * 0.2})`);
    rg.addColorStop(1, `rgba(139,123,255,0)`);
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(nx, ny, n.r * 5, 0, Math.PI * 2);
    ctx.fill();

    // soma
    ctx.beginPath();
    ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
    const fireColor = fire > 0.72
      ? `rgba(212,206,255,${clamp01(alpha * (0.6 + fire * 0.4))})`
      : `rgba(139,123,255,${clamp01(alpha * (0.3 + fire * 0.4))})`;
    ctx.fillStyle = fireColor;
    ctx.fill();
  }

  // region labels (brain areas) — faint, monospaced
  ctx.font = "7px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  const regions: [number, number, string][] = [
    [0.18, 0.15, "V4·COLOUR"],
    [0.82, 0.20, "V1·PRIMARY"],
    [0.50, 0.82, "PFC·ATTENTION"],
    [0.20, 0.62, "THALAMUS"],
    [0.78, 0.70, "AMYGDALA"],
  ];
  for (const [rx, ry, label] of regions) {
    ctx.fillStyle = `rgba(179,168,255,${clamp01(alpha * 0.35)})`;
    ctx.fillText(label, rx * w, ry * h);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   DRAW: INNER — qualia field (right / coral)
═══════════════════════════════════════════════════════════════════ */
function drawInner(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  frame: number,
  alpha: number,
) {
  const t = frame * 0.010;

  // qualia rings — soft radiating waves
  const cx = w * 0.5; const cy = h * 0.5;
  for (let ring = 0; ring < 4; ring++) {
    const phase = (t * 0.35 + ring * 0.8) % (Math.PI * 2);
    const rr = clamp01(Math.sin(phase)) * Math.min(w, h) * 0.44;
    if (rr < 2) continue;
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
    const ringAlpha = clamp01((1 - rr / (Math.min(w, h) * 0.44)) * 0.25 * alpha);
    ctx.strokeStyle = ring % 2 === 0
      ? `rgba(255,107,92,${ringAlpha})`
      : `rgba(255,155,143,${ringAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // qualia particles
  for (let i = 0; i < N_QUALIA; i++) {
    const q = QUALIA[i];
    const pulse = (Math.sin(t * q.speed + q.phase) + 1) / 2;
    // drift positions gently — deterministic oscillation
    const px = (q.fx + 0.06 * Math.sin(t * q.speed * 0.5 + q.phase)) * w;
    const py = (q.fy + 0.06 * Math.cos(t * q.speed * 0.4 + q.phase * 1.3)) * h;
    const glow = clamp01(0.12 + pulse * 0.8);

    // pick a felt-colour from palette by hue bucket
    let r: string; let g: string; let b: string;
    if (q.hue < 0.25) { r = "255"; g = "107"; b = "92"; }       // coral
    else if (q.hue < 0.50) { r = "255"; g = "79"; b = "163"; }  // magenta
    else if (q.hue < 0.75) { r = "245"; g = "185"; b = "66"; }  // gold
    else { r = "45"; g = "212"; b = "191"; }                     // teal

    // glow halo
    const rg = ctx.createRadialGradient(px, py, 0, px, py, q.r * 5);
    rg.addColorStop(0, `rgba(${r},${g},${b},${glow * alpha * 0.7})`);
    rg.addColorStop(0.5, `rgba(${r},${g},${b},${glow * alpha * 0.18})`);
    rg.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(px, py, q.r * 5, 0, Math.PI * 2);
    ctx.fill();

    // core dot
    ctx.beginPath();
    ctx.arc(px, py, clamp01(q.r * (0.5 + pulse * 0.7)), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${clamp01(alpha * (0.45 + pulse * 0.55))})`;
    ctx.fill();
  }

  // felt-quality labels — poetic, monospaced
  ctx.font = "7px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  const labels: [number, number, string][] = [
    [0.18, 0.18, "WARMTH"],
    [0.80, 0.22, "REDNESS"],
    [0.48, 0.83, "WONDER"],
    [0.15, 0.65, "BEAUTY"],
    [0.82, 0.68, "LONGING"],
  ];
  for (const [lx, ly, label] of labels) {
    const fl = clamp01(alpha * 0.4);
    ctx.fillStyle = `rgba(255,155,143,${fl})`;
    ctx.fillText(label, lx * w, ly * h);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   FULL CANVAS DRAW FUNCTION
═══════════════════════════════════════════════════════════════════ */
function drawCanvas(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  frame: number,
  blend: number, // 0 = fully outer, 1 = fully inner
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = C.void950;
  ctx.fillRect(0, 0, w, h);

  // subtle background gradient
  const bg = ctx.createLinearGradient(0, 0, w, 0);
  bg.addColorStop(0, `rgba(139,123,255,0.06)`);
  bg.addColorStop(0.5, `rgba(12,14,26,0)`);
  bg.addColorStop(1, `rgba(255,107,92,0.06)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // divider line (fades as blend moves away from 0.5)
  const dividerAlpha = clamp01(0.5 - Math.abs(blend - 0.5) * 2) * 0.45;
  if (dividerAlpha > 0.01) {
    const mx = w / 2;
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, h);
    const dg = ctx.createLinearGradient(0, 0, 0, h);
    dg.addColorStop(0, `rgba(200,200,255,0)`);
    dg.addColorStop(0.35, `rgba(200,200,255,${dividerAlpha})`);
    dg.addColorStop(0.65, `rgba(255,180,180,${dividerAlpha})`);
    dg.addColorStop(1, `rgba(255,180,180,0)`);
    ctx.strokeStyle = dg;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // outer alpha = 1 at blend=0, fades to 0 at blend=1
  const outerAlpha = clamp01(1 - blend * 1.4);
  // inner alpha = 0 at blend=0, full at blend=1
  const innerAlpha = clamp01((blend - 0.0) * 1.4);

  // draw both layers, always on top of each other — they cross-fade
  ctx.save();
  drawOuter(ctx, w, h, frame, outerAlpha);
  ctx.restore();

  ctx.save();
  drawInner(ctx, w, h, frame, innerAlpha);
  ctx.restore();

  // at blend≈0.5 add a "SAME EVENT" pulse glow from centre
  const overlapAlpha = clamp01(1 - Math.abs(blend - 0.5) * 4);
  if (overlapAlpha > 0.01) {
    const cx2 = w / 2; const cy2 = h / 2;
    const rg2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.min(w, h) * 0.35);
    rg2.addColorStop(0, `rgba(255,200,160,${overlapAlpha * 0.22})`);
    rg2.addColorStop(0.5, `rgba(180,140,255,${overlapAlpha * 0.08})`);
    rg2.addColorStop(1, `rgba(255,200,160,0)`);
    ctx.fillStyle = rg2;
    ctx.fillRect(0, 0, w, h);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   SPLIT CANVAS COMPONENT
═══════════════════════════════════════════════════════════════════ */
interface SplitCanvasProps { blend: number }

function SplitCanvas({ blend }: SplitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const frameRef  = useRef<number>(0);
  const blendRef  = useRef<number>(blend);

  // keep blendRef in sync without re-mounting
  useEffect(() => { blendRef.current = blend; }, [blend]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0; let h = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      frameRef.current += 1;
      if (w > 0 && h > 0) {
        drawCanvas(ctx!, w, h, frameRef.current, blendRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl"
      style={{ height: "300px", display: "block" }}
      aria-label="Split visualization: neural network (outer, third-person) vs qualia field (inner, first-person)"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHILOSOPHICAL POSITIONS on consciousness
═══════════════════════════════════════════════════════════════════ */
interface Position {
  id: string;
  icon: string;
  color: string;
  panelVariant: string;
  title: { en: string; zh: string };
  tagline: { en: string; zh: string };
  body: { en: string; zh: string };
  verdict: { en: string; zh: string };
  verdictColor: string;
}

const POSITIONS: Position[] = [
  {
    id: "naturalism",
    icon: "◈",
    color: C.iris500,
    panelVariant: "panel-iris",
    title:   { en: "Poetic Naturalism (Carroll)", zh: "诗意自然主义（卡罗尔）" },
    tagline: { en: "Consciousness is real, but it is higher-level talk about physical processes — not a separate substance.", zh: "意识是真实的，但只是对物理过程的高层次描述——而非独立实体。" },
    body: {
      en: "Sean Carroll argues that 'consciousness' is a perfectly real concept — as real as 'temperature' or 'justice' — but that this does not make it something over and above physics. Just as temperature is real emergent talk about the motion of molecules, consciousness is real emergent talk about the information-processing patterns in brains. There is one world, described at many levels. The inner and outer descriptions are both valid; neither dissolves the other. This is a strong, serious position with deep roots in philosophy of mind and is the position the book defends.",
      zh: "肖恩·卡罗尔认为，\"意识\"是一个完全真实的概念——如同\"温度\"或\"正义\"一样真实——但这并不意味着它超越于物理之上。正如温度是对分子运动的真实涌现性描述，意识是对大脑信息处理模式的真实涌现性描述。世界只有一个，以多种层次来描述。内在与外在的描述都有效；两者都不消解对方。这是一个严肃有力的立场，在心灵哲学中有深厚根基，也是本书所捍卫的立场。",
    },
    verdict: { en: "Carroll's own position — serious, well-argued, contested", zh: "卡罗尔本人的立场——严肃、论证有力、仍有争议" },
    verdictColor: C.iris400,
  },
  {
    id: "dualism",
    icon: "◇",
    color: C.gold500,
    panelVariant: "panel-gold",
    title:   { en: "Property / Substance Dualism", zh: "属性二元论 / 实体二元论" },
    tagline: { en: "Mind is not reducible to matter, even in principle — there is something extra.", zh: "心灵即便在原则上也不可还原为物质——存在某种额外的东西。" },
    body: {
      en: "Descartes posed the original hard problem: mind seems categorically different from extended matter. Modern property dualism (Chalmers, Jackson) grants that brains are physical but argues that phenomenal properties — what it is like to see red — are irreducibly mental. Even if we had a complete physical description of the brain, it would leave out the felt quality. 'Mary's Room' and 'the zombie argument' are classic thought experiments expressing this intuition. Many working philosophers of mind find physical reductionism unable to account for qualia.",
      zh: "笛卡尔提出了最初的困难问题：心灵似乎与广延物质存在本质差异。现代属性二元论（查尔默斯、杰克逊）承认大脑是物理的，但认为现象属性——看到红色\"是什么感觉\"——在本质上是心理的，不可还原。即便我们拥有完整的大脑物理描述，也遗漏了被感受到的质。\"玛丽的房间\"和\"僵尸论证\"是表达这一直觉的经典思想实验。许多从事心灵哲学研究的哲学家认为物理还原论无法解释感质。",
    },
    verdict: { en: "Mainstream in philosophy of mind — hard problem taken as real", zh: "心灵哲学主流——将困难问题视为真实" },
    verdictColor: C.gold400,
  },
  {
    id: "panpsychism",
    icon: "○",
    color: C.flux500,
    panelVariant: "panel",
    title:   { en: "Panpsychism", zh: "泛心论" },
    tagline: { en: "Consciousness — or its precursors — is a fundamental feature of reality, present at every level.", zh: "意识——或其前身——是实在的基本特征，存在于每一个层次。" },
    body: {
      en: "If consciousness cannot emerge from entirely non-conscious matter, perhaps some form of experience is basic to the universe. Panpsychism — defended by philosophers including Galen Strawson, Philip Goff, and Nagel in a weaker form — argues that the hard problem is best solved by recognising experiential properties as intrinsic to physical reality. Complex consciousness arises when simpler proto-conscious elements combine. This view is not mysticism: it is a serious metaphysical response to the explanatory gap. Integrated Information Theory (Tononi) provides a mathematical framework compatible with this intuition.",
      zh: "如果意识不能从完全无意识的物质中涌现，那么也许某种形式的体验是宇宙的基本特征。泛心论——由斯特劳森、菲利普·高夫、纳格尔（以更弱的形式）等哲学家所捍卫——认为最好的解决方案是承认体验性属性是物理实在的内在特征。复杂意识从更简单的原始意识元素的组合中涌现。这一观点并非神秘主义：它是对解释鸿沟的严肃形而上学回应。整合信息论（托诺尼）提供了与这一直觉相符的数学框架。",
    },
    verdict: { en: "Growing minority view — serious academic defence in last decade", zh: "增长中的少数立场——过去十年获得严肃的学术捍卫" },
    verdictColor: C.flux400,
  },
  {
    id: "mysterianism",
    icon: "△",
    color: C.plasm500,
    panelVariant: "panel-plasm",
    title:   { en: "Mysterianism / Illusionism", zh: "神秘主义 / 幻觉主义" },
    tagline: { en: "Either consciousness is beyond human cognitive reach — or the felt quality is itself an illusion.", zh: "要么意识超出人类认知能力的范围——要么被感受到的质感本身就是幻觉。" },
    body: {
      en: "Two opposed escape routes: Mysterianism (McGinn) holds that the mind–body problem is genuinely insoluble — not because it requires dualism, but because human brains may simply lack the cognitive equipment to solve it. We are cognitively closed to the answer. Illusionism (Frankish, Dennett in his stronger moments) takes the opposite route: consciousness seems to have intrinsic felt quality, but that seeming is itself a cognitive illusion — a story the brain tells itself. Both routes avoid dualism while acknowledging the depth of the problem. Both are controversial and both have serious defenders.",
      zh: "两条相反的出路：神秘主义（麦金）认为心身问题真的无解——不是因为它需要二元论，而是人类大脑可能根本缺乏解决它所需的认知装备。我们在认知上对答案是封闭的。幻觉主义（弗兰基什、丹内特的更强立场）走向反面：意识似乎具有内在的感受质，但这种\"似乎\"本身就是一种认知幻觉——大脑对自己讲述的故事。两条路都回避了二元论，同时承认问题的深度。两者都有争议，也都有严肃的捍卫者。",
    },
    verdict: { en: "Live alternatives — the hard problem is the shared premise", zh: "活跃的替代立场——困难问题是共同前提" },
    verdictColor: C.plasm400,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */

export default function ConsciousnessViz() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);

  // blend: 0 = fully outer (neural), 1 = fully inner (felt)
  const [blend, setBlend] = useState<number>(0);
  const [activePosition, setActivePosition] = useState<string | null>(null);

  // label for current blend state
  const blendLabel = blend < 0.25
    ? L("Outer view · neural firing", "外部视角 · 神经放电")
    : blend < 0.75
    ? L("Both descriptions · same event", "两种描述 · 同一事件")
    : L("Inner view · felt experience", "内部视角 · 感受体验");

  const blendColor = blend < 0.33 ? C.iris400 : blend > 0.66 ? C.flux400 : C.gold400;

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ── Section header ── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono" style={{ color: C.plasm400 }}>
          {L("Theme 07 · Consciousness & the Inner World", "主题07 · 意识与内在世界")}
        </div>
        <h2 className={`display text-3xl md:text-4xl leading-tight spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("The Hardest Problem in Naturalism", "自然主义最困难的问题")}
        </h2>
        <p
          className={`text-sm max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "One event — seeing a sunset. Two descriptions: neurons firing across visual cortex, information flowing through thalamo-cortical loops; and the felt flush of gold and warmth, the ache of beauty. Carroll's poetic naturalism says these are the same event described at two levels. The hard problem asks: why is there any felt quality at all — rather than processing in the dark?",
            "同一个事件——看到日落。两种描述：视觉皮层中神经元放电，信息在丘脑-皮层回路中流动；以及感受到的金色与温暖，那种美的隐痛。卡罗尔的诗意自然主义说这是同一事件在两个层次上的描述。困难问题追问：为何会有任何感受质——而不是在黑暗中的处理？",
          )}
        </p>
      </div>

      <div className="h-px rule-flux opacity-40 rounded-full" />

      {/* ── HARD PROBLEM BANNER ── */}
      <div
        className="rounded-2xl border px-6 py-5 flex flex-col gap-3"
        style={{
          borderColor: `${C.plasm500}45`,
          background: `linear-gradient(135deg, rgba(30,14,32,0.75), rgba(12,14,26,0.95))`,
          boxShadow: `0 0 48px -20px ${C.plasm500}55`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="label-mono" style={{ color: C.plasm400 }}>
            {L("The Hard Problem — Status: Unsolved", "困难问题——状态：未解决")}
          </div>
          <span
            className="text-[0.58rem] font-mono px-2.5 py-0.5 rounded-full border animate-pulse"
            style={{ color: C.plasm400, borderColor: `${C.plasm400}40`, background: `${C.plasm500}18` }}
          >
            {L("OPEN QUESTION", "开放问题")}
          </span>
        </div>
        <p
          className={`text-sm leading-relaxed max-w-3xl ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink50, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "David Chalmers named it in 1995: even a complete physical description of the brain — every neuron, every synapse, every information flow — would not explain why there is subjective experience at all. Why does the processing feel like anything? This is not the \"easy problems\" of explaining attention, memory, or behaviour. This is: why is anyone home? The hard problem has not been solved. Carroll offers a serious deflationary answer. Many first-rate philosophers think that answer is insufficient. Both are reasonable positions.",
            "大卫·查尔默斯于1995年命名了这个问题：即便对大脑进行完整的物理描述——每一个神经元、每一个突触、每一个信息流——也无法解释为何存在主观体验。为什么这种处理过程会有任何感受？这不是关于注意力、记忆或行为的\"容易问题\"。而是：为什么会有人\"在家\"？困难问题至今未解。卡罗尔提出了一个严肃的消解性回答。许多一流哲学家认为这个回答不够充分。两种立场都是合理的。",
          )}
        </p>
      </div>

      {/* ── SPLIT CANVAS + blend controls ── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="label-mono" style={{ color: C.gold400 }}>
              {L("The Same Sunset — Two Descriptions", "同一个日落——两种描述")}
            </div>
          </div>
          <span
            className="text-[0.6rem] font-mono px-2.5 py-1 rounded-full border transition-colors duration-500"
            style={{ color: blendColor, borderColor: `${blendColor}35`, background: `${blendColor}10` }}
          >
            {blendLabel}
          </span>
        </div>

        {/* column labels */}
        <div className="grid grid-cols-2 gap-0 text-[0.65rem] font-mono px-1">
          <div style={{ color: C.iris400, opacity: clamp01(1.2 - blend * 2.0) }}>
            <span className="tracking-widest uppercase">
              {L("◁ OUTER / THIRD-PERSON", "◁ 外部 / 第三人称")}
            </span>
            <div className={`text-[0.6rem] mt-0.5 ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink500 }}>
              {L("neurons · signals · regions", "神经元 · 信号 · 脑区")}
            </div>
          </div>
          <div className="text-right" style={{ color: C.flux400, opacity: clamp01(blend * 2.0 - 0.2 + 0.4) }}>
            <span className="tracking-widest uppercase">
              {L("INNER / FIRST-PERSON ▷", "内部 / 第一人称 ▷")}
            </span>
            <div className={`text-[0.6rem] mt-0.5 ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink500 }}>
              {L("warmth · colour · beauty", "温暖 · 色彩 · 美")}
            </div>
          </div>
        </div>

        <div
          className="panel rounded-2xl overflow-hidden"
          style={{
            borderColor: blend < 0.33 ? `${C.iris500}28` : blend > 0.66 ? `${C.flux500}28` : `${C.gold500}22`,
            boxShadow: blend < 0.33
              ? `0 0 50px -24px rgba(139,123,255,0.4)`
              : blend > 0.66
              ? `0 0 50px -24px rgba(255,107,92,0.4)`
              : `0 0 50px -24px rgba(245,185,66,0.35)`,
          }}
        >
          <SplitCanvas blend={blend} />

          {/* Blend slider */}
          <div className="px-5 py-4 flex flex-col gap-2 border-t border-white/5">
            <div className="flex items-center justify-between text-[0.6rem] font-mono">
              <span style={{ color: C.iris400 }}>{L("OUTER · NEURAL", "外部 · 神经")}</span>
              <span style={{ color: C.gold400 }}>{L("← DRAG TO BLEND →", "← 拖动融合 →")}</span>
              <span style={{ color: C.flux400 }}>{L("INNER · FELT", "内部 · 感受")}</span>
            </div>
            <div className="relative flex items-center">
              {/* custom-styled range */}
              <input
                type="range"
                min={0} max={100} step={1}
                value={Math.round(blend * 100)}
                onChange={(e) => setBlend(Number(e.target.value) / 100)}
                className="w-full appearance-none h-1.5 rounded-full cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(90deg, ${C.iris500} 0%, ${C.gold400} ${blend * 100}%, ${C.flux500} 100%)`,
                  accentColor: C.gold400,
                }}
                aria-label={L("Blend between outer neural view and inner felt view", "在外部神经视角与内部感受视角之间融合")}
              />
            </div>
          </div>
        </div>

        {/* What this illustrates */}
        <div
          className="rounded-xl border px-5 py-4 flex flex-col gap-2"
          style={{ borderColor: `${C.gold500}18`, background: `linear-gradient(135deg, rgba(18,20,31,0.7), rgba(12,14,26,0.9))` }}
        >
          <div className="label-mono text-[0.58rem]" style={{ color: C.gold400 }}>
            {L("Carroll's claim", "卡罗尔的主张")}
          </div>
          <p
            className={`text-[0.8rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              "These are not two separate things happening simultaneously. There is one event — a brain process — and two valid ways to talk about it: the physical vocabulary of neuroscience, and the experiential vocabulary of the first person. Neither vocabulary is more real. Both are useful. This is \"poetic naturalism\" — consciousness is real, but consciousness-talk is emergent talk about physical processes, not evidence for a second substance.",
              "这不是两件同时发生的事。只有一个事件——一个脑过程——以及两种有效的谈论方式：神经科学的物理词汇，以及第一人称的体验词汇。没有哪种词汇更真实。两者都有用。这就是\"诗意自然主义\"——意识是真实的，但关于意识的谈论是对物理过程的涌现性描述，而非第二种实体存在的证据。",
            )}
          </p>
          <p
            className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.plasm400, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              "The hard problem presses back: even granting this, why does the physical process produce felt experience at all? A philosophical zombie — a being physically identical to you — would process the sunset identically but feel nothing. What is missing? This remains genuinely open.",
              "困难问题的反驳：即便承认这些，为什么物理过程会产生任何感受体验？一个哲学僵尸——与你在物理上完全相同的存在——将以同样方式处理日落，却什么都感受不到。缺少的是什么？这在真正意义上仍是悬案。",
            )}
          </p>
        </div>
      </div>

      <div className="h-px" style={{ background: `rgba(180,180,255,0.08)` }} />

      {/* ── PHILOSOPHICAL POSITIONS ── */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="label-mono" style={{ color: C.plasm400 }}>
            {L("Four Live Positions", "四种活跃立场")}
          </div>
          <h3 className={`display text-xl ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink50 }}>
            {L("The Debate — Who Is Right?", "这场争论——谁是对的？")}
          </h3>
          <p
            className={`text-[0.8rem] leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              "Carroll's naturalism is serious and well-argued. It is also one position among several that serious philosophers of mind defend. Click each to read the case.",
              "卡罗尔的自然主义是严肃且论证充分的。它同时也是严肃的心灵哲学家所捍卫的多种立场之一。点击各项阅读其论证。",
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {POSITIONS.map((pos) => {
            const isOpen = activePosition === pos.id;
            return (
              <div
                key={pos.id}
                className={`panel ${pos.panelVariant} rounded-xl cursor-pointer transition-all duration-300 overflow-hidden`}
                style={{
                  borderColor: isOpen ? `${pos.color}55` : undefined,
                  boxShadow: isOpen ? `0 0 36px -14px ${pos.color}55` : undefined,
                }}
                onClick={() => setActivePosition(isOpen ? null : pos.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => e.key === "Enter" && setActivePosition(isOpen ? null : pos.id)}
              >
                <div
                  className="h-0.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${pos.color}55, transparent)` }}
                />
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono text-base"
                      style={{ background: `${pos.color}15`, color: pos.color, border: `1px solid ${pos.color}30` }}
                      aria-hidden="true"
                    >
                      {pos.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`display text-[0.88rem] font-bold leading-snug ${lang === "zh" ? "zh" : ""}`}
                        style={{ color: pos.color }}
                      >
                        {pos.title[lang]}
                      </h4>
                      <p
                        className={`text-[0.73rem] leading-relaxed mt-1 italic ${lang === "zh" ? "zh" : ""}`}
                        style={{ color: C.ink300 }}
                      >
                        {pos.tagline[lang]}
                      </p>
                    </div>
                    <span
                      className="label-mono text-[0.55rem] shrink-0 mt-0.5 transition-transform duration-300"
                      style={{ color: pos.color, transform: isOpen ? "rotate(180deg)" : undefined }}
                    >
                      ▾
                    </span>
                  </div>

                  {isOpen && (
                    <div className="rise-in flex flex-col gap-3 pt-1">
                      <div className="h-px" style={{ background: `${pos.color}22` }} />
                      <p
                        className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                        style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
                      >
                        {pos.body[lang]}
                      </p>
                      <div
                        className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[0.6rem] font-mono uppercase tracking-widest"
                        style={{ color: pos.verdictColor, background: `${pos.color}12`, border: `1px solid ${pos.color}30` }}
                      >
                        <span>◆</span>
                        <span className={lang === "zh" ? "zh" : ""}>{pos.verdict[lang]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spectrum bar */}
        <div
          className="rounded-xl border px-5 py-4 flex flex-col gap-2"
          style={{ borderColor: `rgba(200,180,255,0.12)`, background: `linear-gradient(135deg, rgba(15,12,28,0.75), rgba(12,14,26,0.9))` }}
        >
          <div className="label-mono text-[0.58rem]" style={{ color: C.ink500 }}>
            {L("Where these positions sit", "这些立场的分布")}
          </div>
          <div className="flex flex-wrap items-center gap-1 font-mono text-[0.65rem]">
            {[
              { label: { en: "Illusionism", zh: "幻觉主义" }, c: C.plasm400 },
              { label: { en: "·", zh: "·" },                  c: C.ink500 },
              { label: { en: "Naturalism", zh: "自然主义" },   c: C.iris400 },
              { label: { en: "·", zh: "·" },                  c: C.ink500 },
              { label: { en: "Panpsychism", zh: "泛心论" },    c: C.flux400 },
              { label: { en: "·", zh: "·" },                  c: C.ink500 },
              { label: { en: "Dualism", zh: "二元论" },        c: C.gold400 },
              { label: { en: "·", zh: "·" },                  c: C.ink500 },
              { label: { en: "Mysterianism", zh: "神秘主义" }, c: C.plasm500 },
            ].map((seg, i) => (
              <span key={i} style={{ color: seg.c }} className={lang === "zh" ? "zh" : ""}>
                {seg.label[lang]}
              </span>
            ))}
          </div>
          <div
            className="h-1.5 rounded-full mt-1"
            style={{
              background: `linear-gradient(90deg, ${C.plasm400}, ${C.iris500}, ${C.flux500}, ${C.gold500}, ${C.plasm500})`,
              opacity: 0.6,
            }}
          />
          <p
            className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              "All of these positions are held by serious, careful philosophers. The hard problem is the shared starting point. The disagreement is about what follows from it — and none of the answers is settled.",
              "所有这些立场都由严肃认真的哲学家所持有。困难问题是共同的出发点。分歧在于它意味着什么——没有任何答案是定论。",
            )}
          </p>
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── CLOSING SYNTHESIS ── */}
      <div
        className="rounded-2xl border px-6 py-5 flex flex-col gap-3"
        style={{
          borderColor: `${C.iris500}20`,
          background: `linear-gradient(135deg, rgba(14,14,30,0.7), rgba(12,14,26,0.95))`,
        }}
      >
        <div className="label-mono" style={{ color: C.iris400 }}>
          {L("The honest framing", "诚实的表述")}
        </div>
        <p
          className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "Carroll's poetic naturalism is an elegant and serious answer to the hard problem: consciousness is real, but it is the brain described from the inside, not a second substance floating above physics. The argument is philosophically sophisticated and genuinely compelling. But the hard problem was posed precisely because this move — identifying the inner description with the physical process — does not obviously explain why the inner description is felt rather than merely computed. The question of why there is something it is like to be a brain is, as of now, unanswered by any position, including Carroll's. This is not a failure of his book. It is an accurate map of where philosophy of mind actually stands.",
            "卡罗尔的诗意自然主义是对困难问题的一个优雅而严肃的回答：意识是真实的，但它是从内部描述的大脑，而非漂浮于物理之上的第二种实体。这一论证在哲学上是精致且真正令人信服的。但困难问题的提出恰恰是因为这一策略——将内在描述与物理过程等同——并不明显地解释了为什么内在描述是被感受到的，而不仅仅是被计算到的。为什么\"成为一个大脑\"会有某种感受，这个问题迄今任何立场都未能回答，包括卡罗尔的立场。这不是本书的失败——它是心灵哲学当前处境的一份准确地图。",
          )}
        </p>
        <div className="h-px rule-flux opacity-30 rounded-full" />
        <p
          className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "The sunset fires in V4 and V1 and the prefrontal cortex. And somewhere in that firing — or nowhere, or everywhere — there is the warmth of it. Where exactly it comes from is the question this theme leaves open, as it should.",
            "日落在V4、V1和前额叶皮层中激活。而在那激活之中——或无处，或处处——有那份温暖的感受。它究竟从何而来，是本主题应当留下的开放问题。",
          )}
        </p>
      </div>

    </div>
  );
}
