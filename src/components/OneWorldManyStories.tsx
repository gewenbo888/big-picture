"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   OneWorldManyStories
   Theme 01 — Poetic Naturalism

   Sean Carroll's thesis: there is one physical world, but many legitimate
   vocabularies for describing it.  The "higher" level (the person, the drink,
   the choice) is not less real than the quantum-field substrate — it is a
   different, valid, emergent description.  All levels are compatible and true
   within their domain.

   Interactives:
     · Pick one of three objects: PERSON · GLASS OF WATER · DECISION
     · Cycle through description levels (4–5 layers per object)
     · Canvas renders the object differently at each level:
         PERSON  → particle-dots → atom grid → cell mosaic → silhouette → labeled agent
         WATER   → molecule swarm → fluid field → "cold drink" icon
         DECISION → firing neurons → weighted graph → narrative sentence
     · Panel shows vocabulary, what it captures, domain, compatibility note
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

/* ── deterministic pseudo-random ─────────────────────────────────────────── */
function seeded(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

/* ── clamp helper ────────────────────────────────────────────────────────── */
function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

/* ── hex to rgba ─────────────────────────────────────────────────────────── */
function hexA(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const ac = clamp(a);
  return `rgba(${r},${g},${b},${ac.toFixed(3)})`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — objects × levels
═══════════════════════════════════════════════════════════════════════════ */
type LevelId =
  | "quantum" | "atomic" | "cellular" | "animal" | "agent"
  | "molecular" | "fluid" | "drink"
  | "neural" | "cognitive" | "narrative";

type ObjectId = "person" | "water" | "decision";

interface Level {
  id: LevelId;
  label: { en: string; zh: string };
  vocab: { en: string; zh: string };
  captures: { en: string; zh: string };
  domain: { en: string; zh: string };
  compat: { en: string; zh: string };
  color: string;
}

interface StoryObject {
  id: ObjectId;
  label: { en: string; zh: string };
  subtitle: { en: string; zh: string };
  levels: Level[];
}

const OBJECTS: StoryObject[] = [
  {
    id: "person",
    label: { en: "A Person", zh: "一个人" },
    subtitle: {
      en: "The same human, seen through five legitimate lenses.",
      zh: "同一个人，经由五种合法的视角来看。",
    },
    levels: [
      {
        id: "quantum",
        label: { en: "Quantum Fields", zh: "量子场" },
        vocab: {
          en: "Fermion field excitations, virtual photon exchanges, superposition amplitudes, Pauli exclusion.",
          zh: "费米子场激发、虚光子交换、叠加振幅、泡利不相容原理。",
        },
        captures: {
          en: "The most fundamental known substrate. Every particle is a ripple in a field that permeates space.",
          zh: "已知最基本的底层结构。每个粒子都是弥漫于空间的场中的一道涟漪。",
        },
        domain: { en: "Particle physics / quantum field theory", zh: "粒子物理学 / 量子场论" },
        compat: {
          en: "True and complete at its scale — but uselessly silent on thoughts, intentions, or love.",
          zh: "在其尺度上真实且完整——但对思想、意图或爱则毫无用处。",
        },
        color: C.iris500,
      },
      {
        id: "atomic",
        label: { en: "Atoms & Chemistry", zh: "原子与化学" },
        vocab: {
          en: "Carbon, hydrogen, oxygen, nitrogen. Covalent bonds. ATP hydrolysis. DNA base pairs. Electrochemical gradients.",
          zh: "碳、氢、氧、氮。共价键。ATP水解。DNA碱基对。电化学梯度。",
        },
        captures: {
          en: "The molecular machinery of life — metabolism, heredity, chemical signalling.",
          zh: "生命的分子机器——新陈代谢、遗传、化学信号传导。",
        },
        domain: { en: "Chemistry / biochemistry", zh: "化学 / 生物化学" },
        compat: {
          en: "Fully consistent with quantum fields. Richer vocabulary for biology; still silent on purpose.",
          zh: "与量子场完全一致。对生物学更丰富；仍对目的沉默。",
        },
        color: C.gold500,
      },
      {
        id: "cellular",
        label: { en: "Cells & Organs", zh: "细胞与器官" },
        vocab: {
          en: "Neurons, glial cells, cardiac muscle, epithelium. Synaptic firing. Homeostasis. Immune response.",
          zh: "神经元、神经胶质细胞、心肌、上皮组织。突触放电。稳态。免疫应答。",
        },
        captures: {
          en: "Coordinated biological function — how trillions of cells act as a unified organism.",
          zh: "协调的生物功能——数万亿个细胞如何作为统一的有机体运作。",
        },
        domain: { en: "Cell biology / physiology", zh: "细胞生物学 / 生理学" },
        compat: {
          en: "Cells are atoms arranged; organs are cells coordinated. No contradiction, only emergence.",
          zh: "细胞是原子的排列；器官是细胞的协调。没有矛盾，只有涌现。",
        },
        color: C.leaf500,
      },
      {
        id: "animal",
        label: { en: "A Living Animal", zh: "一个活生物" },
        vocab: {
          en: "Behaviour, sensation, nociception, hunger, fear, bonding, learning, memory, action potential → motor output.",
          zh: "行为、感觉、伤害感受、饥饿、恐惧、依附、学习、记忆，动作电位→运动输出。",
        },
        captures: {
          en: "The animal as a whole — its survival strategies, social bonds, and experiential states.",
          zh: "作为整体的动物——其生存策略、社会纽带和体验状态。",
        },
        domain: { en: "Evolutionary biology / ethology", zh: "进化生物学 / 动物行为学" },
        compat: {
          en: "No extra ingredient added. Emergent properties are real features of physical systems.",
          zh: "没有添加额外成分。涌现属性是物理系统的真实特征。",
        },
        color: C.plasm500,
      },
      {
        id: "agent",
        label: { en: "A Thinking Agent", zh: "一个有思想的主体" },
        vocab: {
          en: "Beliefs, desires, intentions, regret, love, ambition, responsibility, meaning, dignity.",
          zh: "信念、欲望、意图、悔恨、爱、抱负、责任、意义、尊严。",
        },
        captures: {
          en: "The person as a locus of moral concern, narrative identity, and purposeful action.",
          zh: "作为道德关怀、叙事身份和有目的行动中心的人。",
        },
        domain: { en: "Ethics / psychology / phenomenology", zh: "伦理学 / 心理学 / 现象学" },
        compat: {
          en: "Not less real for being high-level. \"She forgave him\" is as true as any field equation — and far more useful for guiding life.",
          zh: `处于高层级并不意味着不真实。“她原谅了他”与任何场方程一样真实——而且对指导生活更为有用。`,
        },
        color: C.flux500,
      },
    ],
  },
  {
    id: "water",
    label: { en: "A Glass of Water", zh: "一杯水" },
    subtitle: {
      en: "H₂O — the same substance, three true stories.",
      zh: "H₂O——同一种物质，三个真实的叙述。",
    },
    levels: [
      {
        id: "molecular",
        label: { en: "Molecule Swarm", zh: "分子蜂群" },
        vocab: {
          en: "~1.67 × 10²⁵ H₂O molecules. Hydrogen bonds (2.5 kcal/mol). Van der Waals forces. Dipole moment 1.85 D.",
          zh: "约1.67×10²⁵个H₂O分子。氢键（2.5千卡/摩尔）。范德华力。偶极矩1.85德拜。",
        },
        captures: {
          en: "The microscopic truth: water is a chaotic thermal dance of bent molecules, constantly forming and breaking bonds.",
          zh: "微观的真相：水是弯曲分子的混沌热运动舞蹈，不断形成和断裂键。",
        },
        domain: { en: "Physical chemistry / molecular dynamics", zh: "物理化学 / 分子动力学" },
        compat: {
          en: "Fully consistent with quantum fields. Richer vocabulary for the specific structure of water.",
          zh: "与量子场完全一致。对水的具体结构提供了更丰富的词汇。",
        },
        color: C.iris400,
      },
      {
        id: "fluid",
        label: { en: "Fluid Dynamics", zh: "流体力学" },
        vocab: {
          en: "Temperature: 4°C. Pressure: 1 atm. Density: 1 g/cm³. Viscosity: 1 mPa·s. Surface tension: 72 mN/m.",
          zh: "温度：4°C。压力：1大气压。密度：1克/立方厘米。粘度：1毫帕·秒。表面张力：72毫牛/米。",
        },
        captures: {
          en: "The bulk behaviour — thermodynamics, fluid mechanics, the continuum approximation that lets engineers design pipes.",
          zh: "整体行为——热力学、流体力学、让工程师设计管道的连续介质近似。",
        },
        domain: { en: "Thermodynamics / fluid mechanics", zh: "热力学 / 流体力学" },
        compat: {
          en: "Temperature and pressure are real — they are statistical summaries of molecular motion. No molecule knows the temperature; the ensemble does.",
          zh: "温度和压力是真实的——它们是分子运动的统计摘要。没有分子知道温度；整体知道。",
        },
        color: C.leaf400,
      },
      {
        id: "drink",
        label: { en: "A Cold Drink", zh: "一杯冷饮" },
        vocab: {
          en: "Refreshing. Thirst-quenching. Clean. Offered in friendship. Part of a ritual. Precious in a desert.",
          zh: "清爽。解渴。清洁。在友谊中递上。一种仪式的一部分。在沙漠中弥足珍贵。",
        },
        captures: {
          en: "The human-scale meaning: water as sustenance, comfort, gift, symbol. This level is indispensable to living a life.",
          zh: "人类尺度的意义：水作为滋养、慰藉、礼物、象征。这个层次对于生活是不可或缺的。",
        },
        domain: { en: "Human experience / culture / meaning", zh: "人类体验 / 文化 / 意义" },
        compat: {
          en: "\"A cold drink\" is not a naïve mistake that physics will one day correct. It is an accurate description at the right level of abstraction.",
          zh: `"一杯冷饮"并非物理学将来会纠正的天真错误。它是在正确抽象层次上的准确描述。`,
        },
        color: C.gold400,
      },
    ],
  },
  {
    id: "decision",
    label: { en: "A Decision", zh: "一个决定" },
    subtitle: {
      en: "\"She chose to forgive\" — three ways to be right simultaneously.",
      zh: `"她选择了原谅"——三种同时正确的方式。`,
    },
    levels: [
      {
        id: "neural",
        label: { en: "Neurons Firing", zh: "神经元放电" },
        vocab: {
          en: "Prefrontal-limbic coupling. Dopamine release. Action potentials at 70 mV threshold. ~86 billion neurons; ~100 trillion synapses.",
          zh: "前额叶-边缘系统耦合。多巴胺释放。70毫伏阈值的动作电位。约860亿神经元；约100万亿个突触。",
        },
        captures: {
          en: "The physical substrate of every thought: electrochemical cascades in a biological neural network.",
          zh: "每一个想法的物理底层：生物神经网络中的电化学级联。",
        },
        domain: { en: "Neuroscience / electrophysiology", zh: "神经科学 / 电生理学" },
        compat: {
          en: "Every mental event has a neural correlate. That does not make the mental event illusory — it makes it physical.",
          zh: "每一个心理事件都有神经相关物。这并不使心理事件成为幻觉——而是使其成为物理的。",
        },
        color: C.plasm500,
      },
      {
        id: "cognitive",
        label: { en: "Weighing Options", zh: "权衡选项" },
        vocab: {
          en: "Belief revision. Utility estimation. Emotional tagging. Memory retrieval. Prospective simulation. Conflict resolution.",
          zh: "信念修正。效用估计。情感标记。记忆检索。前瞻性模拟。冲突解决。",
        },
        captures: {
          en: "The computational story: the brain as an inference engine, integrating priors, evidence, and anticipated outcomes.",
          zh: "计算的故事：大脑作为推理引擎，整合先验、证据和预期结果。",
        },
        domain: { en: "Cognitive science / decision theory", zh: "认知科学 / 决策理论" },
        compat: {
          en: "Beliefs and utilities are patterns in neural activity — real patterns, not less real for being patterns.",
          zh: "信念和效用是神经活动中的模式——真实的模式，作为模式并不意味着不真实。",
        },
        color: C.gold500,
      },
      {
        id: "narrative",
        label: { en: "She Chose to Forgive", zh: "她选择了原谅" },
        vocab: {
          en: "Forgiveness. Moral courage. Letting go. Choosing the future over the wound. An act of agency. Love.",
          zh: "宽恕。道德勇气。放下。选择未来而非伤口。一种能动性的行为。爱。",
        },
        captures: {
          en: "The meaning of the event — what it says about character, relationships, and the kind of world she is building.",
          zh: "事件的意义——它对性格、关系以及她正在构建的世界类型所说明的内容。",
        },
        domain: { en: "Ethics / narrative / lived experience", zh: "伦理学 / 叙事 / 生活体验" },
        compat: {
          en: "\"She chose to forgive\" is not wrong just because neuroscience can describe its substrate. Both are true. Neither replaces the other. That is poetic naturalism.",
          zh: `"她选择了原谅"并不因为神经科学能描述其底层而变得错误。两者都是真的。没有一个替代另一个。这就是诗性自然主义。`,
        },
        color: C.flux400,
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS — draw the object at a given level
═══════════════════════════════════════════════════════════════════════════ */

function drawPerson(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  t: number,
  levelIdx: number,   // 0..4
  levelColor: string,
) {
  ctx.clearRect(0, 0, w, h);

  // background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, C.void900);
  bg.addColorStop(1, C.void950);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.5;

  // LEVEL 0: quantum fields — swirling particle dots
  if (levelIdx === 0) {
    const N = 120;
    for (let i = 0; i < N; i++) {
      const bx = seeded(i, 0) * w;
      const by = seeded(i, 1) * h;
      const freq = 0.5 + seeded(i, 2) * 1.5;
      const amp = 4 + seeded(i, 3) * 12;
      const px = bx + Math.cos(t * freq + seeded(i, 4) * Math.PI * 2) * amp;
      const py = by + Math.sin(t * freq * 0.7 + seeded(i, 5) * Math.PI * 2) * amp;
      const alpha = clamp(0.25 + 0.55 * Math.sin(t * freq * 0.9 + seeded(i, 6) * 6), 0, 1);
      const r = 1.2 + seeded(i, 7) * 2.2;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = hexA(i % 3 === 0 ? C.iris500 : i % 3 === 1 ? C.iris400 : C.plasm500, alpha);
      ctx.fill();
    }
    // label
    ctx.save();
    ctx.font = `600 10px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.iris400, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("ψ FIELD EXCITATIONS", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 1: atoms — grid of small circles with bonds
  if (levelIdx === 1) {
    const cols = 9; const rows = 7;
    const gw = w * 0.72; const gh = h * 0.66;
    const ox = (w - gw) / 2; const oy = (h - gh) / 2;
    const dx = gw / (cols - 1); const dy = gh / (rows - 1);
    // bonds first
    ctx.save();
    ctx.strokeStyle = hexA(C.gold500, 0.18);
    ctx.lineWidth = 0.8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const ax = ox + c * dx + Math.sin(t * 0.6 + seeded(idx, 0) * 4) * 2;
        const ay = oy + r * dy + Math.cos(t * 0.5 + seeded(idx, 1) * 4) * 2;
        if (c < cols - 1) {
          const ax2 = ox + (c + 1) * dx + Math.sin(t * 0.6 + seeded(idx + 1, 0) * 4) * 2;
          const ay2 = oy + r * dy + Math.cos(t * 0.5 + seeded(idx + 1, 1) * 4) * 2;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax2, ay2); ctx.stroke();
        }
        if (r < rows - 1) {
          const ax2 = ox + c * dx + Math.sin(t * 0.6 + seeded(idx + cols, 0) * 4) * 2;
          const ay2 = oy + (r + 1) * dy + Math.cos(t * 0.5 + seeded(idx + cols, 1) * 4) * 2;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax2, ay2); ctx.stroke();
        }
      }
    }
    ctx.restore();
    // atoms
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const ax = ox + c * dx + Math.sin(t * 0.6 + seeded(idx, 0) * 4) * 2;
        const ay = oy + r * dy + Math.cos(t * 0.5 + seeded(idx, 1) * 4) * 2;
        const rad = 2.5 + seeded(idx, 2) * 2;
        const kind = idx % 4;
        const col = kind === 0 ? C.gold500 : kind === 1 ? C.ink300 : kind === 2 ? C.leaf400 : C.plasm500;
        ctx.beginPath();
        ctx.arc(ax, ay, rad, 0, Math.PI * 2);
        ctx.fillStyle = hexA(col, 0.75);
        ctx.shadowColor = col;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.gold400, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("C · H · O · N  BONDS", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 2: cells — mosaic of irregular blobs
  if (levelIdx === 2) {
    const N = 24;
    for (let i = 0; i < N; i++) {
      const bx = seeded(i, 10) * w * 0.86 + w * 0.07;
      const by = seeded(i, 11) * h * 0.78 + h * 0.08;
      const rx = 14 + seeded(i, 12) * 22;
      const ry = 10 + seeded(i, 13) * 18;
      const rot = seeded(i, 14) * Math.PI;
      const col = i % 3 === 0 ? C.leaf500 : i % 3 === 1 ? C.leaf400 : C.iris400;
      const alpha = 0.18 + seeded(i, 15) * 0.22;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = hexA(col, alpha);
      ctx.fill();
      ctx.strokeStyle = hexA(col, 0.55);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // nucleus
      ctx.beginPath();
      ctx.arc(rx * 0.1, 0, Math.min(rx, ry) * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = hexA(col, 0.45);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.leaf400, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("CELLS · TISSUES · ORGANS", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 3: animal silhouette — simple standing figure (geometric)
  if (levelIdx === 3) {
    const pulse = 0.97 + 0.03 * Math.sin(t * 1.2);
    const fh = h * 0.54 * pulse;
    const fw = fh * 0.36;
    const fx = cx;
    const fy = cy + h * 0.05;
    const headR = fw * 0.28;

    ctx.save();
    ctx.shadowColor = C.plasm500;
    ctx.shadowBlur = 18;
    ctx.fillStyle = hexA(C.plasm500, 0.72);
    ctx.strokeStyle = hexA(C.plasm500, 0.9);
    ctx.lineWidth = 1.5;

    // head
    ctx.beginPath();
    ctx.arc(fx, fy - fh * 0.5 + headR, headR, 0, Math.PI * 2);
    ctx.fill();

    // torso
    ctx.beginPath();
    ctx.roundRect(fx - fw * 0.22, fy - fh * 0.5 + headR * 2 + 2, fw * 0.44, fh * 0.32, 4);
    ctx.fill();

    // legs
    ctx.lineWidth = fw * 0.13;
    ctx.lineCap = "round";
    // left leg
    const legTop = fy - fh * 0.5 + headR * 2 + fh * 0.32 + 2;
    ctx.beginPath();
    ctx.moveTo(fx - fw * 0.1, legTop);
    ctx.lineTo(fx - fw * 0.14, fy + fh * 0.18);
    ctx.stroke();
    // right leg
    ctx.beginPath();
    ctx.moveTo(fx + fw * 0.1, legTop);
    ctx.lineTo(fx + fw * 0.14, fy + fh * 0.18);
    ctx.stroke();

    // arms
    const armTop = fy - fh * 0.5 + headR * 2 + fh * 0.07 + 2;
    ctx.lineWidth = fw * 0.1;
    ctx.beginPath();
    ctx.moveTo(fx - fw * 0.22, armTop);
    ctx.lineTo(fx - fw * 0.38, armTop + fh * 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx + fw * 0.22, armTop);
    ctx.lineTo(fx + fw * 0.38, armTop + fh * 0.16);
    ctx.stroke();

    ctx.restore();

    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.plasm500, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("LIVING ORGANISM · BEHAVIOUR", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 4: thinking agent — silhouette + annotations
  if (levelIdx === 4) {
    const fh = h * 0.52;
    const fw = fh * 0.36;
    const fx = cx;
    const fy = cy + h * 0.06;
    const headR = fw * 0.28;

    // soft glow halo
    const grd = ctx.createRadialGradient(fx, fy - fh * 0.5 + headR, 0, fx, fy, fh * 0.72);
    grd.addColorStop(0, hexA(C.flux500, 0.12));
    grd.addColorStop(1, hexA(C.flux500, 0));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.fillStyle = hexA(C.flux400, 0.65);
    ctx.strokeStyle = hexA(C.flux400, 0.88);
    ctx.shadowColor = C.flux400;
    ctx.shadowBlur = 14;
    ctx.lineWidth = 1.5;

    // head
    ctx.beginPath();
    ctx.arc(fx, fy - fh * 0.5 + headR, headR, 0, Math.PI * 2);
    ctx.fill();

    // torso
    ctx.beginPath();
    ctx.roundRect(fx - fw * 0.22, fy - fh * 0.5 + headR * 2 + 2, fw * 0.44, fh * 0.32, 4);
    ctx.fill();

    // legs
    ctx.lineWidth = fw * 0.13;
    ctx.lineCap = "round";
    const legTop = fy - fh * 0.5 + headR * 2 + fh * 0.32 + 2;
    ctx.beginPath(); ctx.moveTo(fx - fw * 0.1, legTop); ctx.lineTo(fx - fw * 0.14, fy + fh * 0.16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.1, legTop); ctx.lineTo(fx + fw * 0.14, fy + fh * 0.16); ctx.stroke();

    // arms
    const armTop = fy - fh * 0.5 + headR * 2 + fh * 0.07 + 2;
    ctx.lineWidth = fw * 0.1;
    ctx.beginPath(); ctx.moveTo(fx - fw * 0.22, armTop); ctx.lineTo(fx - fw * 0.38, armTop + fh * 0.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.22, armTop); ctx.lineTo(fx + fw * 0.38, armTop + fh * 0.14); ctx.stroke();
    ctx.restore();

    // annotation lines + labels
    const annots: { sx: number; sy: number; ex: number; ey: number; text: string }[] = [
      { sx: fx - fw * 0.28, sy: fy - fh * 0.5 + headR, ex: fx - fw * 0.28 - 28, ey: fy - fh * 0.5 + headR - 18, text: "BELIEFS" },
      { sx: fx + fw * 0.28, sy: fy - fh * 0.46 + headR, ex: fx + fw * 0.28 + 28, ey: fy - fh * 0.5 + headR - 18, text: "DESIRES" },
      { sx: fx - fw * 0.22, sy: fy - fh * 0.22 + headR * 2, ex: fx - fw * 0.22 - 30, ey: fy + fh * 0.04, text: "INTENTIONS" },
      { sx: fx + fw * 0.22, sy: fy - fh * 0.22 + headR * 2, ex: fx + fw * 0.22 + 30, ey: fy + fh * 0.04, text: "MEANING" },
    ];
    ctx.save();
    ctx.font = `bold 7.5px "JetBrains Mono", monospace`;
    for (const a of annots) {
      ctx.strokeStyle = hexA(C.flux400, 0.42);
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(a.ex, a.ey); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = hexA(C.flux400, 0.75);
      ctx.textAlign = a.ex < cx ? "right" : "left";
      ctx.fillText(a.text, a.ex + (a.ex < cx ? -3 : 3), a.ey);
    }
    ctx.restore();

    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.flux400, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("A PERSON · AN AGENT · A SELF", cx, h - 12);
    ctx.restore();
    return;
  }
}

function drawWater(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  t: number,
  levelIdx: number,
  levelColor: string,
) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, C.void900);
  bg.addColorStop(1, C.void950);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.5;

  // LEVEL 0: molecule swarm
  if (levelIdx === 0) {
    const N = 80;
    for (let i = 0; i < N; i++) {
      const bx = seeded(i, 20) * w * 0.88 + w * 0.06;
      const by = seeded(i, 21) * h * 0.78 + h * 0.08;
      const freq = 0.4 + seeded(i, 22) * 1.2;
      const px = bx + Math.sin(t * freq + seeded(i, 23) * 6) * 7;
      const py = by + Math.cos(t * freq * 0.8 + seeded(i, 24) * 6) * 7;
      // H-O-H angle 104.5°
      const angle = 104.5 * Math.PI / 180;
      const bondLen = 8;
      const hx1 = px + Math.cos(-angle / 2) * bondLen;
      const hy1 = py - Math.sin(-angle / 2) * bondLen;
      const hx2 = px + Math.cos(angle / 2) * bondLen;
      const hy2 = py - Math.sin(angle / 2) * bondLen;
      // H-bond
      if (i < N - 1) {
        const nx = seeded(i + 1, 20) * w * 0.88 + w * 0.06 + Math.sin(t * (0.4 + seeded(i + 1, 22) * 1.2) + seeded(i + 1, 23) * 6) * 7;
        const ny = seeded(i + 1, 21) * h * 0.78 + h * 0.08 + Math.cos(t * (0.4 + seeded(i + 1, 22) * 1.2) * 0.8 + seeded(i + 1, 24) * 6) * 7;
        const dist = Math.hypot(nx - px, ny - py);
        if (dist < 36) {
          ctx.save();
          ctx.strokeStyle = hexA(C.iris400, 0.12);
          ctx.lineWidth = 0.6;
          ctx.setLineDash([2, 3]);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      }
      // bonds
      ctx.save();
      ctx.strokeStyle = hexA(C.iris400, 0.55);
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(hx1, hy1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(hx2, hy2); ctx.stroke();
      ctx.restore();
      // O atom
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = hexA(C.iris500, 0.8); ctx.fill();
      // H atoms
      ctx.beginPath(); ctx.arc(hx1, hy1, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = hexA(C.ink300, 0.7); ctx.fill();
      ctx.beginPath(); ctx.arc(hx2, hy2, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = hexA(C.ink300, 0.7); ctx.fill();
    }
    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.iris400, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("H₂O · MOLECULAR DANCE", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 1: fluid field — waves + isotherms
  if (levelIdx === 1) {
    // glass outline
    ctx.save();
    ctx.strokeStyle = hexA(C.leaf400, 0.4);
    ctx.lineWidth = 1.5;
    const gx = cx - 38; const gy = cy - 52; const gw2 = 76; const gh2 = 94;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh2);
    ctx.lineTo(gx + gw2, gy + gh2);
    ctx.lineTo(gx + gw2, gy);
    ctx.stroke();
    ctx.restore();

    // fluid waves
    for (let row = 0; row < 7; row++) {
      const wy = gy + 10 + row * 12;
      if (wy > gy + gh2 - 4) continue;
      const alpha = 0.12 + row * 0.04;
      ctx.save();
      ctx.strokeStyle = hexA(C.leaf500, clamp(alpha));
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(gx + 4, wy);
      for (let xi = 0; xi <= gw2 - 8; xi += 2) {
        const wy2 = wy + Math.sin((xi / (gw2 - 8)) * Math.PI * 3 + t * 1.2 + row * 0.5) * 3;
        ctx.lineTo(gx + 4 + xi, wy2);
      }
      ctx.stroke();
      ctx.restore();
    }

    // T, P labels inside
    ctx.save();
    ctx.font = `bold 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.leaf400, 0.7);
    ctx.textAlign = "center";
    ctx.fillText("T = 4°C", cx, cy - 16);
    ctx.fillText("P = 1 atm", cx, cy + 1);
    ctx.fillText("ρ = 1 g/cm³", cx, cy + 18);
    ctx.restore();

    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.leaf400, 0.5);
    ctx.textAlign = "center";
    ctx.fillText("THERMODYNAMIC STATE", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 2: drink — glass icon + aura
  if (levelIdx === 2) {
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.44);
    grd.addColorStop(0, hexA(C.gold500, 0.08));
    grd.addColorStop(1, hexA(C.gold500, 0));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // glass
    const gx = cx - 36; const gy = cy - 58; const gw2 = 72; const gh2 = 96;
    ctx.save();
    ctx.strokeStyle = hexA(C.gold400, 0.55);
    ctx.lineWidth = 1.5;
    ctx.shadowColor = C.gold400;
    ctx.shadowBlur = 12;
    // tapered glass shape
    ctx.beginPath();
    ctx.moveTo(gx + 8, gy);
    ctx.lineTo(gx, gy + gh2);
    ctx.lineTo(gx + gw2, gy + gh2);
    ctx.lineTo(gx + gw2 - 8, gy);
    ctx.closePath();
    ctx.stroke();
    // water fill
    ctx.fillStyle = hexA(C.gold400, 0.08);
    ctx.fill();
    ctx.restore();

    // ice cubes
    const cubes = [[cx - 14, cy - 12], [cx + 8, cy - 22], [cx - 4, cy + 6]];
    for (const [icx, icy] of cubes) {
      ctx.save();
      ctx.strokeStyle = hexA(C.ink300, 0.45);
      ctx.lineWidth = 0.8;
      ctx.fillStyle = hexA(C.ink300, 0.07);
      const s = 13;
      ctx.beginPath();
      ctx.roundRect(icx - s / 2, icy - s / 2, s, s, 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // bubbles
    for (let i = 0; i < 8; i++) {
      const bx = cx - 22 + seeded(i, 30) * 44;
      const by = gy + gh2 - 6 - (((seeded(i, 31) * 80 + t * (12 + seeded(i, 32) * 8)) % 80));
      if (by < gy + 6) continue;
      ctx.save();
      ctx.beginPath();
      ctx.arc(bx, by, 2 + seeded(i, 33) * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = hexA(C.gold400, 0.4);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    }

    // text
    ctx.save();
    ctx.font = `italic 600 14px "Newsreader", serif`;
    ctx.fillStyle = hexA(C.gold400, 0.85);
    ctx.textAlign = "center";
    ctx.shadowColor = C.gold400;
    ctx.shadowBlur = 10;
    ctx.fillText("a cold drink", cx, gy + gh2 + 22);
    ctx.restore();

    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.gold400, 0.5);
    ctx.textAlign = "center";
    ctx.fillText("HUMAN EXPERIENCE · MEANING", cx, h - 12);
    ctx.restore();
    return;
  }
}

function drawDecision(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  t: number,
  levelIdx: number,
  levelColor: string,
) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, C.void900);
  bg.addColorStop(1, C.void950);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;

  // LEVEL 0: neurons firing
  if (levelIdx === 0) {
    const nodes: { x: number; y: number; active: boolean }[] = [];
    const N = 18;
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: seeded(i, 40) * w * 0.82 + w * 0.09,
        y: seeded(i, 41) * h * 0.74 + h * 0.1,
        active: seeded(i, 42) < 0.6,
      });
    }
    // edges
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(nodes[j].x - nodes[i].x, nodes[j].y - nodes[i].y);
        if (d < 80 && seeded(i * 100 + j, 0) < 0.55) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 2.1 + seeded(i + j, 43) * 6);
          const alpha = clamp(nodes[i].active && nodes[j].active ? pulse * 0.55 : 0.08);
          ctx.save();
          ctx.strokeStyle = hexA(C.plasm500, alpha);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    // nodes
    for (let i = 0; i < N; i++) {
      const pulse = 0.8 + 0.2 * Math.sin(t * 2.4 + seeded(i, 44) * 6);
      const r = (nodes[i].active ? 5 : 3.5) * pulse;
      const col = nodes[i].active ? C.plasm500 : C.iris500;
      ctx.save();
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, r, 0, Math.PI * 2);
      ctx.fillStyle = hexA(col, nodes[i].active ? 0.85 : 0.4);
      ctx.shadowColor = col;
      ctx.shadowBlur = nodes[i].active ? 14 : 4;
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.plasm500, 0.55);
    ctx.textAlign = "center";
    ctx.fillText("PREFRONTAL-LIMBIC FIRING", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 1: cognitive — weighted option graph
  if (levelIdx === 1) {
    const options = [
      { label: "forgive", x: cx, y: h * 0.28, weight: 0.78, col: C.flux400 },
      { label: "withdraw", x: cx - w * 0.28, y: h * 0.58, weight: 0.31, col: C.iris400 },
      { label: "confront", x: cx + w * 0.28, y: h * 0.58, weight: 0.44, col: C.gold400 },
    ];
    // center decision node
    const dcx = cx; const dcy = h * 0.46;

    // edges
    for (const o of options) {
      ctx.save();
      ctx.strokeStyle = hexA(o.col, 0.32 + o.weight * 0.3);
      ctx.lineWidth = 0.8 + o.weight * 1.5;
      ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.moveTo(dcx, dcy); ctx.lineTo(o.x, o.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // option nodes
    for (const o of options) {
      const r = 16 + o.weight * 12;
      ctx.save();
      ctx.beginPath();
      ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
      ctx.fillStyle = hexA(o.col, 0.12 + o.weight * 0.12);
      ctx.strokeStyle = hexA(o.col, 0.5 + o.weight * 0.3);
      ctx.lineWidth = 1.2;
      ctx.shadowColor = o.col;
      ctx.shadowBlur = 8 + o.weight * 8;
      ctx.fill(); ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.font = `600 8.5px "JetBrains Mono", monospace`;
      ctx.fillStyle = hexA(o.col, 0.85);
      ctx.textAlign = "center";
      ctx.fillText(o.label.toUpperCase(), o.x, o.y + 2);
      ctx.fillStyle = hexA(o.col, 0.5);
      ctx.font = `9px "JetBrains Mono", monospace`;
      ctx.fillText(`w=${o.weight.toFixed(2)}`, o.x, o.y + 13);
      ctx.restore();
    }

    // decision node
    ctx.save();
    ctx.beginPath(); ctx.arc(dcx, dcy, 12, 0, Math.PI * 2);
    ctx.fillStyle = hexA(C.gold500, 0.22);
    ctx.strokeStyle = hexA(C.gold400, 0.65);
    ctx.lineWidth = 1.5;
    ctx.shadowColor = C.gold400; ctx.shadowBlur = 12;
    ctx.fill(); ctx.stroke();
    ctx.font = `600 7.5px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.gold400, 0.8);
    ctx.textAlign = "center";
    ctx.fillText("DECIDE", dcx, dcy + 3);
    ctx.restore();

    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.gold500, 0.5);
    ctx.textAlign = "center";
    ctx.fillText("BELIEF · UTILITY · SIMULATION", cx, h - 12);
    ctx.restore();
    return;
  }

  // LEVEL 2: narrative
  if (levelIdx === 2) {
    const grd = ctx.createRadialGradient(cx, h * 0.44, 0, cx, h * 0.44, h * 0.46);
    grd.addColorStop(0, hexA(C.flux500, 0.09));
    grd.addColorStop(1, hexA(C.flux500, 0));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // quote marks
    ctx.save();
    ctx.font = `bold 64px "Newsreader", serif`;
    ctx.fillStyle = hexA(C.flux400, 0.12);
    ctx.textAlign = "left";
    ctx.fillText("“", w * 0.05, h * 0.46);
    ctx.textAlign = "right";
    ctx.fillText("”", w * 0.95, h * 0.72);
    ctx.restore();

    // narrative sentence — word-wrap
    const lines = ["She chose", "to forgive."];
    ctx.save();
    ctx.font = `italic 700 22px "Newsreader", serif`;
    ctx.fillStyle = hexA(C.flux400, 0.9);
    ctx.textAlign = "center";
    ctx.shadowColor = C.flux400;
    ctx.shadowBlur = 18;
    ctx.fillText(lines[0], cx, h * 0.42);
    ctx.fillText(lines[1], cx, h * 0.42 + 30);
    ctx.restore();

    // sub-words
    const words: { text: string; x: number; y: number; col: string }[] = [
      { text: "agency", x: cx - w * 0.25, y: h * 0.66, col: C.flux400 },
      { text: "responsibility", x: cx + w * 0.22, y: h * 0.62, col: C.gold400 },
      { text: "love", x: cx, y: h * 0.74, col: C.plasm500 },
      { text: "courage", x: cx - w * 0.2, y: h * 0.78, col: C.leaf400 },
    ];
    for (const wd of words) {
      const pulse = 0.6 + 0.4 * Math.sin(t * 0.9 + wd.x * 0.05);
      ctx.save();
      ctx.font = `italic 10px "Newsreader", serif`;
      ctx.fillStyle = hexA(wd.col, clamp(pulse * 0.6));
      ctx.textAlign = "center";
      ctx.fillText(wd.text, wd.x, wd.y);
      ctx.restore();
    }

    ctx.save();
    ctx.font = `600 9px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(C.flux400, 0.5);
    ctx.textAlign = "center";
    ctx.fillText("NARRATIVE · MEANING · AGENCY", cx, h - 12);
    ctx.restore();
    return;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
function LevelCanvas({
  object, levelIdx, levelColor,
}: {
  object: ObjectId;
  levelIdx: number;
  levelColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const objRef = useRef(object);
  const lvlRef = useRef(levelIdx);
  useEffect(() => { objRef.current = object; }, [object]);
  useEffect(() => { lvlRef.current = levelIdx; }, [levelIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
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
      const rw = rect.width; const rh = rect.height;
      const obj = objRef.current;
      const lvl = lvlRef.current;
      const col = levelColor;
      if (obj === "person") drawPerson(ctx!, rw, rh, tRef.current, lvl, col);
      else if (obj === "water") drawWater(ctx!, rw, rh, tRef.current, lvl, col);
      else drawDecision(ctx!, rw, rh, tRef.current, lvl, col);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full"
      style={{ aspectRatio: "16/9", minHeight: 180 }}
      aria-label="Level visualization"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEVEL STACK — horizontal scroll of level tabs
═══════════════════════════════════════════════════════════════════════════ */
function LevelStrip({
  levels, activeIdx, onSelect, lang,
}: {
  levels: Level[];
  activeIdx: number;
  onSelect: (i: number) => void;
  lang: "en" | "zh";
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {levels.map((lv, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={lv.id}
            onClick={() => onSelect(i)}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-200"
            style={{
              background: active ? hexA(lv.color, 0.12) : "rgba(12,14,26,0.7)",
              borderColor: active ? hexA(lv.color, 0.55) : "rgba(168,170,198,0.1)",
              boxShadow: active ? `0 0 22px -8px ${lv.color}66` : undefined,
              minWidth: 68,
            }}
            aria-pressed={active}
          >
            {/* level index dot */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: active ? lv.color : hexA(C.ink500, 0.4) }}
            />
            <span
              className={`text-center leading-tight ${lang === "zh" ? "zh" : "font-mono"}`}
              style={{
                fontSize: "0.6rem",
                color: active ? lv.color : C.ink500,
                fontFamily: lang === "zh" ? undefined : '"JetBrains Mono", monospace',
                letterSpacing: "0.04em",
              }}
            >
              {lv.label[lang]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPATIBILITY BADGE
═══════════════════════════════════════════════════════════════════════════ */
function CompatNote({
  level, lang,
}: { level: Level; lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  return (
    <div
      className="rounded-xl px-4 py-3 flex gap-3 items-start"
      style={{
        background: hexA(level.color, 0.055),
        border: `1px solid ${hexA(level.color, 0.22)}`,
      }}
    >
      <span style={{ color: level.color, fontSize: "0.85rem", flexShrink: 0, lineHeight: 1.5 }}>◈</span>
      <div className="space-y-1 min-w-0">
        <p className="label-mono" style={{ color: hexA(level.color, 0.75) }}>
          {L("Compatible Levels", "层次相容")}
        </p>
        <p
          className={`text-[0.69rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {level.compat[lang]}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function OneWorldManyStories() {
  const { lang } = useLang();
  const L = useCallback(
    (en: string, zh: string) => (lang === "zh" ? zh : en),
    [lang],
  );

  const [objectIdx, setObjectIdx] = useState<number>(0);
  const [levelIdx, setLevelIdx] = useState<number>(0);

  // reset level when object changes
  function selectObject(i: number) {
    setObjectIdx(i);
    setLevelIdx(0);
  }

  const obj = OBJECTS[objectIdx];
  const level = obj.levels[levelIdx];

  return (
    <div className="w-full space-y-6">

      {/* ── header ───────────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1" style={{ color: C.iris500 }}>
          {L("Theme 01 · Poetic Naturalism", "主题 01 · 诗性自然主义")}
        </p>
        <h3 className={`display text-2xl md:text-3xl leading-tight mb-2 spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("One World, Many True Stories", "一个世界，众多真实叙述")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-3 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "There is only one physical world. Yet many valid vocabularies describe it — each true, each indispensable, none replacing the others. A person is simultaneously quantum fields and a moral agent. Both are right. That is poetic naturalism.",
            "只有一个物理世界。然而，许多有效的词汇体系都能描述它——每一种都是真实的，每一种都不可或缺，没有一种能取代其他种。一个人同时是量子场，也是道德主体。两者都是对的。这就是诗性自然主义。",
          )}
        </p>
        <div className="rule-flux h-px rounded" />
      </div>

      {/* ── object selector ───────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-3" style={{ color: C.ink500 }}>
          {L("Choose an object", "选择一个对象")}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {OBJECTS.map((o, i) => {
            const active = i === objectIdx;
            const col = o.levels[o.levels.length - 1].color; // top-level color
            return (
              <button
                key={o.id}
                onClick={() => selectObject(i)}
                className={`panel rounded-xl px-3 py-3 flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? "panel" : ""}`}
                style={{
                  borderColor: active ? hexA(col, 0.5) : "rgba(168,170,198,0.09)",
                  boxShadow: active ? `0 0 32px -12px ${col}66` : undefined,
                  background: active
                    ? `linear-gradient(160deg, ${hexA(col, 0.1)}, ${hexA(C.void900, 0.92)})`
                    : undefined,
                }}
                aria-pressed={active}
              >
                <span
                  className={`display text-xs tracking-wide ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: active ? col : C.ink500 }}
                >
                  {o.label[lang]}
                </span>
                <span
                  className="font-mono text-[0.52rem] tracking-widest uppercase"
                  style={{ color: active ? hexA(col, 0.65) : hexA(C.ink500, 0.5) }}
                >
                  {o.levels.length}{L(" levels", " 层")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── subtitle ─────────────────────────────────────────────────────────── */}
      <div key={obj.id} className="rise-in">
        <p
          className={`text-[0.72rem] italic ${lang === "zh" ? "zh" : ""}`}
          style={{
            color: C.ink500,
            fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
          }}
        >
          {obj.subtitle[lang]}
        </p>
      </div>

      {/* ── level strip ──────────────────────────────────────────────────────── */}
      <LevelStrip
        levels={obj.levels}
        activeIdx={levelIdx}
        onSelect={setLevelIdx}
        lang={lang}
      />

      {/* ── canvas + info grid ───────────────────────────────────────────────── */}
      <div key={`${obj.id}-${levelIdx}`} className="rise-in grid md:grid-cols-[1fr_300px] gap-4">

        {/* canvas */}
        <div
          className="rounded-xl overflow-hidden border"
          style={{
            borderColor: hexA(level.color, 0.28),
            boxShadow: `0 0 60px -24px ${level.color}55`,
          }}
        >
          <LevelCanvas object={obj.id} levelIdx={levelIdx} levelColor={level.color} />
        </div>

        {/* info panel */}
        <div className="space-y-3 flex flex-col">
          {/* level label */}
          <div>
            <p className="label-mono mb-0.5" style={{ color: hexA(level.color, 0.75) }}>
              {L("Description Level", "描述层次")}
            </p>
            <h4
              className={`display text-xl leading-snug ${lang === "zh" ? "zh" : ""}`}
              style={{ color: level.color }}
            >
              {level.label[lang]}
            </h4>
            <p
              className="font-mono text-[0.56rem] tracking-widest uppercase mt-0.5"
              style={{ color: hexA(level.color, 0.5) }}
            >
              {level.domain[lang]}
            </p>
          </div>

          {/* vocabulary */}
          <div
            className="panel rounded-xl p-3 flex-1"
            style={{
              borderColor: hexA(level.color, 0.2),
              background: `linear-gradient(160deg, ${hexA(level.color, 0.06)}, ${hexA(C.void900, 0.88)})`,
            }}
          >
            <p className="label-mono mb-1.5" style={{ color: hexA(level.color, 0.65) }}>
              {L("Vocabulary", "词汇")}
            </p>
            <p
              className={`text-[0.69rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
            >
              {level.vocab[lang]}
            </p>
          </div>

          {/* captures */}
          <div
            className="rounded-xl px-3 py-2.5"
            style={{
              background: hexA(level.color, 0.04),
              border: `1px solid ${hexA(level.color, 0.14)}`,
            }}
          >
            <p className="label-mono mb-1" style={{ color: hexA(level.color, 0.55) }}>
              {L("What it captures", "它捕捉的内容")}
            </p>
            <p
              className={`text-[0.68rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
            >
              {level.captures[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* ── compatibility note ───────────────────────────────────────────────── */}
      <CompatNote level={level} lang={lang} />

      {/* ── all levels bar — quick level-jump ────────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-3 space-y-2"
        style={{ background: hexA(C.void800, 0.7), border: "1px solid rgba(168,170,198,0.07)" }}
      >
        <p className="label-mono" style={{ color: C.ink500 }}>
          {L("All levels — compatible, not competing", "所有层次——相容，而非竞争")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {obj.levels.map((lv, i) => {
            const active = i === levelIdx;
            return (
              <button
                key={lv.id}
                onClick={() => setLevelIdx(i)}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6rem] font-mono tracking-wide border transition-all duration-200"
                style={{
                  background: active ? hexA(lv.color, 0.15) : "transparent",
                  borderColor: active ? hexA(lv.color, 0.5) : "rgba(168,170,198,0.1)",
                  color: active ? lv.color : C.ink500,
                  boxShadow: active ? `0 0 12px -4px ${lv.color}66` : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: active ? lv.color : hexA(C.ink500, 0.4) }}
                />
                {lv.label[lang]}
              </button>
            );
          })}
          <span
            className="flex items-center px-2.5 py-1 text-[0.58rem] font-mono"
            style={{ color: hexA(C.ink500, 0.45) }}
          >
            {L("← all true", "← 均为真")}
          </span>
        </div>
      </div>

      {/* ── thesis footnote ──────────────────────────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-3 flex gap-3"
        style={{ background: "rgba(139,123,255,0.04)", border: "1px solid rgba(139,123,255,0.10)" }}
      >
        <span style={{ color: hexA(C.iris400, 0.8), fontSize: "0.9rem", flexShrink: 0, lineHeight: 1.5 }}>◇</span>
        <p
          className={`text-[0.67rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "Poetic naturalism (Carroll, Biggest Picture) holds that the higher-level story is not a convenient fiction waiting to be eliminated by physics. It is a genuinely true description at the right scale of abstraction. The levels are compatible because they answer different questions about the same physical reality.",
            "诗性自然主义（卡罗尔，《大图景》）认为，高层次的叙事并非等待被物理学消除的方便虚构。它是在正确的抽象尺度上真正真实的描述。各层次之间相容，因为它们回答的是关于同一物理现实的不同问题。",
          )}
        </p>
      </div>
    </div>
  );
}
