"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ══════════════════════════════════════════════════════════════════
   RecursiveLayersEngine — The Ascending Layers of Reality
   Closing synthesis: an animated ascent through the emergent
   vocabulary stack that poetic naturalism holds together — from
   quantum fields at the base to "the big picture" at the apex.
   Contested layers (mind, persons, values) are surfaced honestly.
   Each layer is fully compatible with the one below yet genuinely
   real and not eliminable — that is Carroll's core thesis.
══════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas / SVG) ── */
const HEX = {
  /* quantum / fundamental — iris violet */
  iris:    "#8b7bff",
  iris4:   "#b3a8ff",
  /* life / biology — leaf teal */
  leaf:    "#2dd4bf",
  leaf4:   "#6ee7d6",
  /* chemistry / matter — gold */
  gold:    "#f5b942",
  gold4:   "#ffd27a",
  /* human / mind — flux coral */
  flux:    "#ff6b5c",
  flux4:   "#ff9b8f",
  /* contested seams — plasm magenta */
  plasm:   "#ff4fa3",
  plasm4:  "#ff8cc4",
  /* apex unity */
  apex:    "#f5b942",
  /* void */
  void9:   "#07080f",
  void8:   "#12141f",
  void7:   "#1b1e30",
  void6:   "#282c48",
  /* ink */
  ink3:    "#a8aac6",
  ink5:    "#6c6e90",
} as const;

/* ── layer definitions ── */
interface Layer {
  id: string;
  num: number;
  name: Bi;
  vocab: Bi;         // the vocabulary this layer introduces
  emergence: Bi;     // what genuinely new thing emerges here
  compatible: Bi;    // how it remains compatible with the layer below
  contested?: true;  // Carroll's contested / boldly-staked claim
  apex?: true;       // the final unity layer
}

const LAYERS: Layer[] = [
  {
    id: "quantum",
    num: 1,
    name: { en: "Quantum Fields", zh: "量子场" },
    vocab: {
      en: "Core Theory: Feynman diagrams, virtual particles, vacuum fluctuations, superposition, entanglement.",
      zh: "核心理论：费曼图、虚粒子、真空涨落、叠加态、纠缠。",
    },
    emergence: {
      en: "The fundamental layer. There is no deeper 'stuff'. The entire observable universe is excitations of a handful of quantum fields governed by the Standard Model plus gravity.",
      zh: "这是最基础的层次，没有更深的'本质'。整个可观测宇宙都是少数几个量子场的激发，由标准模型与引力支配。",
    },
    compatible: {
      en: "This is the base. Everything above must be consistent with it — though nothing above is reducible to it alone.",
      zh: "这是基础。上方的一切都必须与之相容——但上方的一切都无法单独由它还原。",
    },
  },
  {
    id: "particles",
    num: 2,
    name: { en: "Particles & Atoms", zh: "粒子与原子" },
    vocab: {
      en: "Protons, neutrons, electrons, the periodic table, chemical bonding potential.",
      zh: "质子、中子、电子、元素周期表、化学键势能。",
    },
    emergence: {
      en: "Stable matter. Quantum field excitations bind into hadrons, then atoms. Atoms are overwhelmingly empty space structured by probability clouds — yet they reliably persist.",
      zh: "稳定物质出现了。量子场激发结合成强子，再结合成原子。原子几乎全是空旷的空间，由概率云构成——但它们可靠地存在。",
    },
    compatible: {
      en: "Proton stability is a quantum-field result. No new forces required — only the same ones expressing stable patterns.",
      zh: "质子稳定性是量子场的结果。不需要任何新的力——只是同样的力呈现出稳定的模式。",
    },
  },
  {
    id: "chemistry",
    num: 3,
    name: { en: "Chemistry", zh: "化学" },
    vocab: {
      en: "Molecules, bonds, reaction kinetics, thermodynamic free energy, catalysis, chirality.",
      zh: "分子、化学键、反应动力学、热力学自由能、催化、手性。",
    },
    emergence: {
      en: "The molecular world. Atoms combine into structures with qualitatively new properties — water is not oxygen plus hydrogen. Chemistry's vocabulary is real and irreplaceable.",
      zh: "分子世界出现了。原子组合成具有全新性质的结构——水不是氧加氢。化学的词汇是真实的、不可替代的。",
    },
    compatible: {
      en: "Every bond is an electromagnetic interaction between electron clouds. No new forces; same fields, richer patterns.",
      zh: "每一个化学键都是电子云之间的电磁相互作用。没有新的力；同样的场，更丰富的模式。",
    },
  },
  {
    id: "cells",
    num: 4,
    name: { en: "Cells & Life", zh: "细胞与生命" },
    vocab: {
      en: "Metabolism, heredity, homeostasis, cell division, DNA replication, ATP, protein folding.",
      zh: "代谢、遗传、稳态、细胞分裂、DNA 复制、ATP、蛋白质折叠。",
    },
    emergence: {
      en: "Self-sustaining, reproducing chemical systems. Life is chemistry with a recursive twist: structures that perpetuate themselves, draw energy from the environment, and carry heritable information.",
      zh: "自我维持、可繁殖的化学系统。生命是具有递归特征的化学：能自我延续、从环境中获取能量、并携带可遗传信息的结构。",
    },
    compatible: {
      en: "No 'vital force'. All biochemistry is organic chemistry. The emergence is structural — complexity and self-reference, not magic.",
      zh: "没有'生命力'。所有生物化学都是有机化学。涌现是结构性的——是复杂性与自我指涉，而非魔法。",
    },
  },
  {
    id: "organisms",
    num: 5,
    name: { en: "Organisms & Evolution", zh: "生物与演化" },
    vocab: {
      en: "Fitness, natural selection, adaptation, phenotype, speciation, niche, ecosystem.",
      zh: "适合度、自然选择、适应、表型、物种形成、生态位、生态系统。",
    },
    emergence: {
      en: "Design without a designer. Variation plus selection plus time produces apparent purpose — eyes for seeing, wings for flying — with no intentional agent needed. Darwin's great unification.",
      zh: "没有设计者的设计。变异加选择加时间，产生了表面上的目的性——用于看的眼睛，用于飞的翅膀——无需任何有意图的主体。达尔文的伟大统一。",
    },
    compatible: {
      en: "Natural selection operates on chemistry and physics. The new vocabulary — adaptation, fitness — is not reducible to chemistry alone, but requires nothing beyond it.",
      zh: "自然选择作用于化学和物理之上。新的词汇——适应、适合度——无法单独还原为化学，但也不需要超越化学的任何东西。",
    },
  },
  {
    id: "minds",
    num: 6,
    name: { en: "Brains & Minds", zh: "大脑与心灵" },
    vocab: {
      en: "Consciousness, qualia, perception, memory, intentionality, affect, the hard problem.",
      zh: "意识、感质、知觉、记忆、意向性、情感、意识难题。",
    },
    emergence: {
      en: "Information becomes experience — maybe. The brain is an evolved organ for predicting and acting. Carroll's stance: consciousness is real and not eliminable, but it supervenes on physical processes. The hard problem is genuinely hard.",
      zh: "信息也许成为了体验。大脑是演化出来用于预测和行动的器官。卡罗尔的立场：意识是真实的，不可消除，但它随附于物理过程。意识难题是真正困难的。",
    },
    compatible: {
      en: "No soul, no extra force. But Carroll does not dismiss qualia. He holds that the physical story is complete and the experiential story is also true — both vocabularies are real.",
      zh: "没有灵魂，没有额外的力。但卡罗尔并不否定感质。他认为物理故事是完整的，体验故事也是真实的——两套词汇都是真实的。",
    },
    contested: true,
  },
  {
    id: "persons",
    num: 7,
    name: { en: "Persons & Choices", zh: "人与抉择" },
    vocab: {
      en: "Agency, free will, deliberation, responsibility, intention, selfhood, practical reason.",
      zh: "能动性、自由意志、审议、责任、意图、自我、实践理性。",
    },
    emergence: {
      en: "Compatibilist free will: choices are real because they are made by persons, not particles. The relevant causal level for agency is the person-level vocabulary — 'I decided' is not a deceptive shorthand but a true description at its own level.",
      zh: "相容论式自由意志：选择是真实的，因为它们是由人做出的，而不是粒子。能动性相关的因果层次是人这一层面的词汇——'我决定'不是一种欺骗性的简写，而是在其自身层次上的真实描述。",
    },
    compatible: {
      en: "Physics never violated — every neural event is physical. But 'I decided to do otherwise' is still a true claim at its appropriate level of description. Carroll argues this is not an evasion.",
      zh: "物理从未被违反——每个神经事件都是物理性的。但'我本可以做出不同选择'在其适当的描述层次上仍然是真实的。卡罗尔认为这不是回避。",
    },
    contested: true,
  },
  {
    id: "societies",
    num: 8,
    name: { en: "Societies & Values", zh: "社会与价值" },
    vocab: {
      en: "Morality, justice, rights, meaning, narrative, institutions, constructed norms.",
      zh: "道德、正义、权利、意义、叙事、制度、建构性规范。",
    },
    emergence: {
      en: "Constructed meaning, real stakes. Moral facts are not written into physics, but they are not arbitrary either — they are negotiated agreements among conscious, caring beings with reasons. Carroll's poetic naturalism: we invent meaning without diminishing it.",
      zh: "建构的意义，真实的赌注。道德事实不是写入物理的，但也不是任意的——它们是有意识、有关怀的存在之间有理由的协商一致。卡罗尔的诗意自然主义：我们发明意义，但这并不会贬低意义。",
    },
    compatible: {
      en: "Social facts supervene on physical facts but cannot be deduced from the Standard Model. Both vocabularies hold. Institutions are real patterns, not illusions.",
      zh: "社会事实随附于物理事实，但不能从标准模型推导出来。两套词汇都成立。制度是真实的模式，不是幻觉。",
    },
    contested: true,
  },
  {
    id: "bigpicture",
    num: 9,
    name: { en: "The Big Picture", zh: "大图景" },
    vocab: {
      en: "Poetic naturalism: one world, many true vocabularies, each real at its own level, none eliminable.",
      zh: "诗意自然主义：一个世界，多套真实词汇，每一套在其层次上都是真实的，没有任何一套可以被消除。",
    },
    emergence: {
      en: "Unity without reduction. The same universe — quantum fields all the way down — supports atoms, chemistry, life, minds, persons, and values. Each layer's vocabulary is genuinely true. Science and humanity share one world.",
      zh: "不以还原为代价的统一。同一个宇宙——从底层的量子场开始——支撑着原子、化学、生命、心灵、人以及价值。每一层的词汇都真实有效。科学与人文共享一个世界。",
    },
    compatible: {
      en: "The whole chain is unbroken. No layer contradicts the one below; no layer is mere fiction. This is the argument of the book — and Carroll's wager on poetic naturalism.",
      zh: "整条链条从未断裂。没有哪一层与其下方的层次矛盾；没有哪一层只是虚构。这是这本书的论点——也是卡罗尔对诗意自然主义的押注。",
    },
    apex: true,
  },
];

/* ── narrative panels keyed by layer-ascent progress ── */
interface NarrativeState { min: number; title: Bi; body: Bi; }
const NARRATIVE: NarrativeState[] = [
  {
    min: 0,
    title: { en: "The base of everything", zh: "万物的基础" },
    body: {
      en: "Start at the bottom: quantum fields. The Core Theory is humanity's most precisely tested knowledge. Its vocabulary — wavefunctions, operators, field excitations — is the deepest true description we have of physical reality.",
      zh: "从底层开始：量子场。核心理论是人类经过最精确检验的知识。它的词汇——波函数、算符、场激发——是我们对物理现实拥有的最深刻的真实描述。",
    },
  },
  {
    min: 0.12,
    title: { en: "Stable patterns emerge", zh: "稳定模式涌现" },
    body: {
      en: "Particles and atoms are not merely convenient fictions. They are stable, robust patterns in the quantum fields — patterns so reliable that the vocabulary of chemistry becomes genuinely true and not eliminable in favour of field theory.",
      zh: "粒子和原子不仅仅是方便的虚构。它们是量子场中稳定、可靠的模式——模式如此可靠，以至于化学的词汇变得真实有效，不能被场论所取代。",
    },
  },
  {
    min: 0.3,
    title: { en: "Life is chemistry with a twist", zh: "生命是带有递归特征的化学" },
    body: {
      en: "The move from chemistry to cells is not the insertion of a vital force — it is the discovery that chemistry can become self-sustaining and heritable. Darwin then shows that heritable variation plus selection is sufficient for apparent design.",
      zh: "从化学到细胞的跃迁不是插入了生命力——而是发现了化学可以变得自我维持且可遗传。达尔文随后表明，可遗传的变异加上选择，足以产生表面上的设计。",
    },
  },
  {
    min: 0.5,
    title: { en: "The contested seams", zh: "有争议的接缝" },
    body: {
      en: "At minds, persons, and values the chain of emergence becomes contested. Carroll does not pretend otherwise — consciousness, free will, and moral realism are genuinely hard. His wager: the physical story is complete AND the higher-level vocabularies are true. Both hold simultaneously.",
      zh: "在心灵、人以及价值这几层，涌现的链条变得有争议。卡罗尔不假装无视这一点——意识、自由意志和道德实在论都是真正困难的问题。他的押注：物理故事是完整的，而且更高层次的词汇也是真实的。两者同时成立。",
    },
  },
  {
    min: 0.72,
    title: { en: "Poetic naturalism", zh: "诗意自然主义" },
    body: {
      en: "The name for the view is poetic naturalism. Naturalism: there is only the natural world, no supernatural. Poetic: our many ways of talking about it — chemistry, biology, history, ethics, art — are all genuinely true descriptions, not fictions tolerated for convenience.",
      zh: "这种观点的名称是诗意自然主义。自然主义：只有自然世界，没有超自然。诗意：我们谈论它的许多方式——化学、生物、历史、伦理、艺术——都是真正真实的描述，而不是为了方便而容忍的虚构。",
    },
  },
  {
    min: 0.9,
    title: { en: "One world, all these vocabularies", zh: "一个世界，所有这些词汇" },
    body: {
      en: "The big picture is the view from the apex: one unbroken world from quantum fields to human meaning. No layer cancels another; each is real in its domain. The chain is what makes both rigorous science and genuine humanity possible — simultaneously.",
      zh: "大图景是从顶点俯瞰的视野：一个从量子场到人类意义的完整世界。没有哪一层会取消另一层；每一层在其领域内都是真实的。这条链条使严谨的科学和真正的人性同时成为可能。",
    },
  },
];

/* ── canvas dimensions ── */
const W = 440;
const H = 360;

/* ── deterministic seeded value ── */
function seededVal(x: number, seed: number): number {
  const s = Math.sin(x * 127.1 + seed * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/* ── colour for layer index ── */
function layerColor(i: number): string {
  if (i === 8) return HEX.apex;          // big picture — gold
  if (i >= 5) return HEX.plasm;          // contested — magenta
  if (i >= 3) return HEX.flux;           // persons/organisms/cells — coral
  if (i === 2) return HEX.gold;          // chemistry — gold
  if (i === 1) return HEX.leaf;          // atoms — teal
  return HEX.iris;                        // quantum — violet
}

/* ── draw the layers stack ── */
function drawLayers(
  ctx: CanvasRenderingContext2D,
  layerIdx: number,
  progress: number,
  tick: number,
): void {
  const n = LAYERS.length; // 9

  ctx.clearRect(0, 0, W, H);

  /* micro-grid background */
  ctx.strokeStyle = "rgba(139,123,255,0.03)";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 24) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  /* layout */
  const leftPad  = 52;
  const rightPad = 16;
  const topPad   = 16;
  const botPad   = 48;
  const bw = W - leftPad - rightPad;
  const bh = H - topPad - botPad;
  const bandH = bh / n;

  /* contested zone marker — layers 5,6,7 (indices 5,6,7) */
  const contestedTop    = topPad + (n - 1 - 7) * bandH;
  const contestedBottom = topPad + (n - 1 - 5) * bandH + bandH;
  ctx.save();
  ctx.setLineDash([3, 6]);
  ctx.strokeStyle = HEX.plasm + "30";
  ctx.lineWidth   = 1;
  ctx.strokeRect(leftPad - 2, contestedTop, bw + 4, contestedBottom - contestedTop);
  ctx.setLineDash([]);
  ctx.restore();

  ctx.font      = "7px 'JetBrains Mono', monospace";
  ctx.fillStyle = HEX.plasm + "66";
  ctx.textAlign = "right";
  ctx.fillText("CONTESTED ↕", leftPad + bw - 2, contestedTop - 3);

  /* layer bands — rendered bottom-up (layer 0 at bottom) */
  for (let i = 0; i < n; i++) {
    const col     = layerColor(i);
    const by      = topPad + (n - 1 - i) * bandH; // higher i = higher band

    let fill = 0;
    if (i < layerIdx)      fill = 1;
    else if (i === layerIdx) fill = progress;

    /* background band outline always visible */
    ctx.strokeStyle = col + "18";
    ctx.lineWidth   = 0.5;
    ctx.strokeRect(leftPad, by + 1, bw, bandH - 2);

    if (fill <= 0) continue;

    /* filled band */
    const grad = ctx.createLinearGradient(leftPad, 0, leftPad + bw, 0);
    grad.addColorStop(0,   col + "1a");
    grad.addColorStop(0.5, col + "77");
    grad.addColorStop(1,   col + "dd");
    ctx.fillStyle = grad;
    ctx.fillRect(leftPad, by + 1, bw * fill, bandH - 2);

    /* apex layer — pulsing glow */
    if (LAYERS[i].apex && fill > 0) {
      const pulse = 0.06 + 0.06 * Math.sin(tick * 0.05);
      const gr2 = ctx.createRadialGradient(
        leftPad + bw * 0.5, by + bandH / 2, 0,
        leftPad + bw * 0.5, by + bandH / 2, bw * 0.8,
      );
      gr2.addColorStop(0, HEX.apex + Math.round(pulse * 255).toString(16).padStart(2, "0"));
      gr2.addColorStop(1, HEX.apex + "00");
      ctx.fillStyle = gr2;
      ctx.fillRect(leftPad, by + 1, bw, bandH - 2);
    }

    /* contested dashed overlay */
    if (LAYERS[i].contested && fill > 0) {
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = HEX.plasm + "55";
      ctx.lineWidth   = 0.9;
      ctx.strokeRect(leftPad + 1, by + 2, bw * fill - 2, bandH - 4);
      ctx.setLineDash([]);
      ctx.restore();
    }

    /* leading-edge glow */
    if (i === layerIdx && fill > 0.02) {
      const ex   = leftPad + bw * fill;
      const eglow = ctx.createLinearGradient(ex - 22, 0, ex + 6, 0);
      eglow.addColorStop(0, col + "00");
      eglow.addColorStop(1, col + "ff");
      ctx.fillStyle = eglow;
      ctx.fillRect(ex - 22, by + 1, 28, bandH - 2);
    }

    /* flowing dashes for active layer */
    if (i === layerIdx && fill > 0.05) {
      const phase = (tick * 0.4) % 28;
      ctx.setLineDash([5, 9]);
      ctx.lineDashOffset = -phase;
      ctx.strokeStyle = col + "77";
      ctx.lineWidth   = 0.8;
      ctx.beginPath();
      ctx.moveTo(leftPad, by + bandH / 2);
      ctx.lineTo(leftPad + bw * fill, by + bandH / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* animated sparks on active layer */
  if (layerIdx < n) {
    const col    = layerColor(layerIdx);
    const by     = topPad + (n - 1 - layerIdx) * bandH;
    const maxX   = leftPad + bw * Math.max(0.06, progress);
    for (let s = 0; s < 6; s++) {
      const t  = (tick + s * 8) % 60;
      const sx = leftPad + (t / 60) * (maxX - leftPad);
      const sy = by + bandH / 2 + (seededVal(s, tick * 0.01) - 0.5) * (bandH * 0.5);
      const r  = 1.1 + seededVal(s + 3, tick * 0.02) * 1.8;
      ctx.beginPath();
      ctx.arc(Math.round(sx), Math.round(sy), r, 0, Math.PI * 2);
      ctx.fillStyle = col + "cc";
      ctx.fill();
    }
  }

  /* vertical emission connector between filled layers */
  for (let i = 1; i < n; i++) {
    const filled = i < layerIdx || (i === layerIdx && progress > 0.05);
    if (!filled) continue;
    const prevFilled = i - 1 < layerIdx || (i - 1 === layerIdx && progress > 0.05);
    if (!prevFilled) continue;
    const col  = layerColor(i);
    const byA  = topPad + (n - 1 - (i - 1)) * bandH + bandH; // bottom of prev band
    const byB  = topPad + (n - 1 - i) * bandH;                // top of this band
    const cx   = leftPad + bw * 0.5;
    ctx.strokeStyle = col + "44";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(cx, byA);
    ctx.lineTo(cx, byB);
    ctx.stroke();
  }

  /* y-axis layer numbers */
  ctx.font      = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  for (let i = 0; i < n; i++) {
    const cy  = topPad + (n - 1 - i) * bandH + bandH / 2 + 3.5;
    const col = layerColor(i);
    ctx.fillStyle = i <= layerIdx ? col + "ff" : HEX.ink5 + "55";
    ctx.fillText(`${i + 1}`, leftPad - 6, cy);
  }

  /* bottom legend */
  const legY = H - botPad + 14;
  ctx.textAlign = "left";
  ctx.font      = "7px 'JetBrains Mono', monospace";
  ctx.fillStyle = HEX.iris + "99";
  ctx.fillText("FUNDAMENTAL", leftPad, legY);
  const midX = leftPad + bw * 0.5;
  ctx.fillStyle = HEX.leaf + "99";
  ctx.fillText("LIFE", midX - 12, legY);
  ctx.textAlign = "right";
  ctx.fillStyle = HEX.apex + "99";
  ctx.fillText("UNITY ▲", leftPad + bw, legY);

  const legY2 = H - botPad + 26;
  ctx.textAlign = "center";
  ctx.fillStyle = HEX.ink5 + "55";
  ctx.font      = "7px 'JetBrains Mono', monospace";
  ctx.fillText("each layer emergent ↑ yet compatible ↓", leftPad + bw / 2, legY2);

  /* top label */
  ctx.textAlign = "center";
  ctx.fillStyle = HEX.iris4 + "99";
  ctx.font      = "9px 'JetBrains Mono', monospace";
  ctx.fillText("LAYERS OF REALITY — POETIC NATURALISM", W / 2, 11);
}

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
export default function RecursiveLayersEngine() {
  const { lang } = useLang();

  const [layerIdx,   setLayerIdx]   = useState(0);
  const [sweepProg,  setSweepProg]  = useState(0);
  const [running,    setRunning]    = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);
  const tickRef   = useRef(0);
  const runRef    = useRef(false);
  const layerRef  = useRef(layerIdx);
  const sweepRef  = useRef(sweepProg);

  layerRef.current = layerIdx;
  sweepRef.current = sweepProg;

  const totalLayers = LAYERS.length;
  const ascent      = (layerIdx + sweepProg) / totalLayers;

  let narrative = NARRATIVE[0];
  for (const ns of NARRATIVE) if (ascent >= ns.min) narrative = ns;

  /* canvas draw loop */
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    tickRef.current += 1;
    drawLayers(ctx, layerRef.current, sweepRef.current, tickRef.current);
    rafRef.current = requestAnimationFrame(renderFrame);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFrame]);

  /* auto-advance ascent */
  const startRun = useCallback(() => {
    if (runRef.current) return;
    runRef.current = true;
    setRunning(true);

    let startLayer = layerRef.current;
    let startSweep = sweepRef.current;
    if (startLayer >= totalLayers - 1 && startSweep >= 0.99) {
      startLayer = 0;
      startSweep = 0;
      setLayerIdx(0);
      setSweepProg(0);
    }

    const layerDurMs = 460;
    const totalMs    = layerDurMs * (totalLayers - startLayer - startSweep);
    const startT     = performance.now();

    const step = (now: number) => {
      if (!runRef.current) return;
      const elapsed      = now - startT;
      const totalProg    = startSweep + elapsed / layerDurMs;
      const clampedTotal = Math.min(totalProg, totalLayers - startLayer);
      const newLayer     = Math.min(totalLayers - 1, startLayer + Math.floor(clampedTotal));
      const newSweep     =
        newLayer < totalLayers - 1
          ? clampedTotal - Math.floor(clampedTotal)
          : 1;

      setLayerIdx(newLayer);
      setSweepProg(newSweep);

      if (elapsed < totalMs - layerDurMs * startSweep) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setLayerIdx(totalLayers - 1);
        setSweepProg(1);
        runRef.current = false;
        setRunning(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [totalLayers]);

  /* step forward / backward */
  const stepLayer = useCallback(
    (dir: 1 | -1) => {
      if (runRef.current) { runRef.current = false; setRunning(false); }
      setLayerIdx((prev) => {
        const next = Math.max(0, Math.min(totalLayers - 1, prev + dir));
        setSweepProg(dir > 0 ? 1 : 0);
        return next;
      });
    },
    [totalLayers],
  );

  const resetAll = useCallback(() => {
    runRef.current = false;
    setRunning(false);
    setLayerIdx(0);
    setSweepProg(0);
  }, []);

  const currentLayer = LAYERS[layerIdx];
  const isContested  = !!currentLayer.contested;
  const isApex       = !!currentLayer.apex;

  /* colour classification for UI */
  const colKey =
    isApex       ? "apex"
    : isContested ? "plasm"
    : layerIdx >= 3 ? "flux"
    : layerIdx === 2 ? "gold"
    : layerIdx === 1 ? "leaf"
    : "iris";

  const borderCls =
    colKey === "apex"  ? "border-gold-500/50 bg-gold-500/[0.08]"
    : colKey === "plasm" ? "border-plasm-500/40 bg-plasm-500/[0.07]"
    : colKey === "flux"  ? "border-flux-500/40 bg-flux-500/[0.08]"
    : colKey === "gold"  ? "border-gold-500/35 bg-gold-500/[0.07]"
    : colKey === "leaf"  ? "border-leaf-500/35 bg-leaf-500/[0.07]"
    : "border-iris-500/35 bg-iris-500/[0.07]";

  const textCls =
    colKey === "apex"  ? "gold-text"
    : colKey === "plasm" ? "plasm-text"
    : colKey === "flux"  ? "flux-glow"
    : colKey === "gold"  ? "gold-text"
    : colKey === "leaf"  ? "leaf-text"
    : "iris-text";

  const dotCls =
    colKey === "apex"  ? "bg-gold-500"
    : colKey === "plasm" ? "bg-plasm-500"
    : colKey === "flux"  ? "bg-flux-500"
    : colKey === "gold"  ? "bg-gold-500"
    : colKey === "leaf"  ? "bg-leaf-500"
    : "bg-iris-500";

  /* ascent bar gradient */
  const barGrad =
    "linear-gradient(90deg,#8b7bff,#2dd4bf,#f5b942,#ff6b5c,#ff4fa3,#f5b942)";

  return (
    <div className="panel rounded-2xl p-5 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-center">

        {/* ── canvas ── */}
        <div className="relative mx-auto w-full max-w-[440px]">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full rounded-lg"
            style={{ background: HEX.void9 }}
            aria-label={
              lang === "zh"
                ? "现实层次上升可视化——诗意自然主义"
                : "ascending layers of reality — poetic naturalism"
            }
          />

          {/* layer pill overlay */}
          <div className="pointer-events-none absolute left-2 top-2">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.13em] backdrop-blur-sm ${borderCls} ${textCls}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotCls} pulse`} />
              <span
                key={`lp-${layerIdx}-${lang}`}
                className={`lang-fade ${lang === "zh" ? "zh" : ""}`}
              >
                {lang === "zh"
                  ? `第 ${currentLayer.num} 层`
                  : `Layer ${currentLayer.num} / ${totalLayers}`}
              </span>
            </div>
          </div>

          {/* contested badge */}
          {isContested && (
            <div className="pointer-events-none absolute right-2 top-2">
              <div className="flex items-center gap-1 rounded-full border border-plasm-500/40 bg-plasm-500/10 px-2 py-1 font-mono text-[0.58rem] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-plasm-500 pulse" />
                <span className="text-plasm-400">
                  {lang === "zh" ? "有争议" : "contested"}
                </span>
              </div>
            </div>
          )}
          {isApex && (
            <div className="pointer-events-none absolute right-2 top-2">
              <div className="flex items-center gap-1 rounded-full border border-gold-500/50 bg-gold-500/10 px-2 py-1 font-mono text-[0.58rem] backdrop-blur-sm">
                <span className="text-gold-400">
                  {lang === "zh" ? "统一" : "unity"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── right panel ── */}
        <div>

          {/* ascent meter */}
          <div className="flex items-center justify-between">
            <div className="label-mono">
              {lang === "zh" ? "现实层次上升" : "layers of reality"}
            </div>
            <div className={`display text-3xl ${textCls}`}>
              {Math.round(ascent * 100)}%
            </div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-void-700">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${ascent * 100}%`, background: barGrad }}
            />
          </div>

          {/* current layer card */}
          <div
            key={`lc-${layerIdx}-${lang}`}
            className={`mt-5 rounded-xl border p-5 lang-fade ${borderCls}`}
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div className={`display text-xl ${textCls}`}>
                <span
                  key={`ln-${layerIdx}-${lang}`}
                  className={`lang-fade ${lang === "zh" ? "zh" : ""}`}
                >
                  <T v={currentLayer.name} />
                </span>
              </div>
              <div className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ink-500 shrink-0">
                {lang === "zh" ? `第 ${currentLayer.num} 层` : `Layer ${currentLayer.num}`}
              </div>
            </div>

            {/* badges */}
            <div className="mt-2 flex flex-wrap gap-2">
              {isContested && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-plasm-500/40 bg-plasm-500/10 px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-plasm-500 pulse" />
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-plasm-400">
                    {lang === "zh" ? "⚠ 有争议的接缝" : "⚠ contested seam"}
                  </span>
                </div>
              )}
              {isApex && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-gold-400">
                    {lang === "zh" ? "◎ 诗意自然主义" : "◎ poetic naturalism"}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex gap-2 text-sm leading-snug">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-ink-500 shrink-0 mt-0.5 w-16">
                  {lang === "zh" ? "词汇" : "vocab"}
                </span>
                <span className={`text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
                  <T v={currentLayer.vocab} />
                </span>
              </div>
              <div className="flex gap-2 text-sm leading-snug">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-ink-500 shrink-0 mt-0.5 w-16">
                  {lang === "zh" ? "涌现" : "emergence"}
                </span>
                <span className={`${textCls} text-sm leading-snug ${lang === "zh" ? "zh" : ""}`}>
                  <T v={currentLayer.emergence} />
                </span>
              </div>
              <div className="flex gap-2 text-sm leading-snug">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-ink-500 shrink-0 mt-0.5 w-16">
                  {lang === "zh" ? "相容" : "compatible"}
                </span>
                <span className={`text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
                  <T v={currentLayer.compatible} />
                </span>
              </div>
            </div>
          </div>

          {/* narrative panel */}
          <div
            key={`np-${narrative.title.en}-${lang}`}
            className="mt-4 rounded-xl border border-void-600 bg-void-800/50 p-4 lang-fade"
          >
            <div className="display text-base text-ink-300">
              <T v={narrative.title} />
            </div>
            <p className={`mt-1.5 text-sm leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              <T v={narrative.body} />
            </p>
          </div>

          {/* layer stepper dots */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500 mb-2">
              <span>{lang === "zh" ? "选择层次" : "layer"}</span>
              <span className={textCls}>{layerIdx + 1} / {totalLayers}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LAYERS.map((lay, i) => {
                const isC   = !!lay.contested;
                const isA   = !!lay.apex;
                const isCur = i === layerIdx;
                const ck    =
                  isA ? "apex"
                  : isC ? "plasm"
                  : i >= 3 ? "flux"
                  : i === 2 ? "gold"
                  : i === 1 ? "leaf"
                  : "iris";
                const curStyle =
                  ck === "apex"  ? "bg-gold-500/25 border border-gold-500/60 text-gold-400"
                  : ck === "plasm" ? "bg-plasm-500/25 border border-plasm-500/60 text-plasm-400"
                  : ck === "flux"  ? "bg-flux-500/25 border border-flux-500/60 text-flux-400"
                  : ck === "gold"  ? "bg-gold-500/25 border border-gold-500/60 text-gold-400"
                  : ck === "leaf"  ? "bg-leaf-500/25 border border-leaf-500/60 text-leaf-400"
                  : "bg-iris-500/25 border border-iris-500/60 text-iris-400";
                const idleStyle =
                  isC
                    ? "border border-dashed border-plasm-500/30 text-ink-500 hover:border-plasm-500/60 hover:text-plasm-400"
                    : isA
                    ? "border border-dashed border-gold-500/40 text-ink-500 hover:border-gold-500/70 hover:text-gold-400"
                    : "border border-void-600 text-ink-500 hover:border-iris-500/40 hover:text-iris-400";
                return (
                  <button
                    key={lay.id}
                    onClick={() => {
                      if (runRef.current) { runRef.current = false; setRunning(false); }
                      setLayerIdx(i);
                      setSweepProg(1);
                    }}
                    className={`h-7 w-7 rounded font-mono text-[0.62rem] transition ${isCur ? curStyle : idleStyle}`}
                    aria-label={`Layer ${i + 1}`}
                    aria-pressed={isCur}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={startRun}
              disabled={running}
              className="rounded-full border border-iris-500/50 bg-iris-500/10 px-5 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-iris-400 transition hover:bg-iris-500/20 disabled:opacity-40"
            >
              {running
                ? lang === "zh" ? "上升中…" : "ascending…"
                : lang === "zh" ? "▲ 逐层上升" : "▲ ascend layers"}
            </button>
            <button
              onClick={() => stepLayer(-1)}
              disabled={layerIdx === 0}
              className="rounded-full border border-ink-100/15 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400 transition hover:text-iris-400 disabled:opacity-30"
            >
              ‹ {lang === "zh" ? "下一层" : "below"}
            </button>
            <button
              onClick={() => stepLayer(1)}
              disabled={layerIdx === totalLayers - 1}
              className="rounded-full border border-ink-100/15 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400 transition hover:text-iris-400 disabled:opacity-30"
            >
              {lang === "zh" ? "上一层" : "above"} ›
            </button>
            <button
              onClick={resetAll}
              className="rounded-full border border-ink-100/15 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400 transition hover:text-iris-400"
            >
              {lang === "zh" ? "重置" : "reset"}
            </button>
          </div>

          {/* poetic naturalism thesis */}
          <div className="mt-5 border-t border-void-700 pt-4">
            <p className={`text-xs leading-relaxed text-ink-500 italic ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "诗意自然主义的核心主张：这九个层次共同描述一个世界。物理学的词汇在量子场层次是真实的；化学的词汇在分子层次是真实的；意识和意义的词汇在心灵与人的层次也是真实的。没有任何一层是幻觉；没有任何一层违反其下方的层次。关于心灵、自由意志与道德的层次是真正有争议的——卡罗尔在此持有大胆的立场，这些争议值得认真对待。"
                : "Poetic naturalism's core claim: these nine layers jointly describe one world. The vocabulary of physics is true at the quantum-field level; chemistry is true at the molecular level; consciousness and meaning are true at the mind-and-person level. No layer is illusion; no layer violates the one below. The layers of mind, free will, and morality are genuinely contested — Carroll stakes a bold position, and the debates deserve to be taken seriously."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
