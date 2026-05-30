"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   BAYES LAB — "Planets of Belief"
   An interactive Bayesian credence updater for Sean Carroll's Big Picture
   epistemology. THREE competing big-picture hypotheses; evidence cards that
   the user toggles ON/OFF; posteriors update live via Bayes' theorem.

   Carroll's core idea: credences are not certainties. The verdict is the
   slow accumulation of many small updates. No single fact decides.
   ════════════════════════════════════════════════════════════════════════ */

function Lf(en: string, zh: string, lang: string) {
  return lang === "zh" ? zh : en;
}

/* ─── HYPOTHESES ─── */
type HypId = "naturalism" | "theism" | "simulation";

type Hypothesis = {
  id: HypId;
  label: { en: string; zh: string };
  tagline: { en: string; zh: string };
  color: string;       // Tailwind key (for prose)
  hex: string;         // raw hex for canvas / inline styles
  hexFaint: string;    // alpha variant for backgrounds
  icon: string;
};

const HYPOTHESES: Hypothesis[] = [
  {
    id: "naturalism",
    label: { en: "Naturalism", zh: "自然主义" },
    tagline: {
      en: "The physical world is all there is — mind, meaning, and morality emerge from matter.",
      zh: "物质世界是一切的基础——心灵、意义与道德皆从物质中涌现。",
    },
    color: "flux",
    hex: "#ff6b5c",
    hexFaint: "rgba(255,107,92,0.12)",
    icon: "◉",
  },
  {
    id: "theism",
    label: { en: "Theism", zh: "有神论" },
    tagline: {
      en: "A transcendent mind or intelligence underlies or created the cosmos.",
      zh: "一种超验的心灵或智慧创造或支撑着整个宇宙。",
    },
    color: "iris",
    hex: "#8b7bff",
    hexFaint: "rgba(139,123,255,0.12)",
    icon: "◈",
  },
  {
    id: "simulation",
    label: { en: "Simulation", zh: "模拟假说" },
    tagline: {
      en: "Our reality is computed — a designed information process run by some external system.",
      zh: "我们的现实是被计算出来的——由某个外部系统运行的信息程序。",
    },
    color: "leaf",
    hex: "#2dd4bf",
    hexFaint: "rgba(45,212,191,0.10)",
    icon: "◎",
  },
];

/* ─── EVIDENCE ─── */
type Evidence = {
  id: string;
  label: { en: string; zh: string };
  body: { en: string; zh: string };
  // Likelihood ratios under each hypothesis (not probabilities; unnormalised weights)
  // Using a 1–10 qualitative scale, where 5 = neutral (doesn't shift anything),
  // >5 = more likely under this hypothesis, <5 = less likely.
  likelihoods: Record<HypId, number>;
  // Which way does this cut? (for UX colouring only — inferred from max likelihood)
  tag: { en: string; zh: string };
};

const EVIDENCE_CARDS: Evidence[] = [
  {
    id: "ev_physics_everyday",
    label: {
      en: "Physics explains everyday life completely",
      zh: "物理学完整解释日常生活",
    },
    body: {
      en: "The Core Theory of physics (quantum field theory + general relativity) accounts for every phenomenon at the energy scales of human life with no gaps requiring supernatural intervention.",
      zh: "物理学核心理论（量子场论＋广义相对论）在人类生活的能量尺度上完整地解释了一切现象，无需任何超自然干预。",
    },
    likelihoods: { naturalism: 9, theism: 4, simulation: 6 },
    tag: { en: "Physics scope", zh: "物理学范围" },
  },
  {
    id: "ev_vast_lifeless",
    label: {
      en: "The universe is vast, old, and mostly lifeless",
      zh: "宇宙广阔、古老，且大部分是无生命的",
    },
    body: {
      en: "Across 93 billion light-years and 13.8 billion years, life appears to occupy a vanishingly small corner. A cosmos designed primarily for humanity seems oddly wasteful of space and time.",
      zh: "在930亿光年和138亿年的宇宙中，生命似乎只占据极其微小的角落。一个主要为人类设计的宇宙，似乎对空间和时间有着奇怪的浪费。",
    },
    likelihoods: { naturalism: 8, theism: 3, simulation: 5 },
    tag: { en: "Cosmic scale", zh: "宇宙尺度" },
  },
  {
    id: "ev_entropy_arrow",
    label: {
      en: "The arrow of time traces to a low-entropy past",
      zh: "时间之箭源于低熵的过去",
    },
    body: {
      en: "The second law of thermodynamics and the felt direction of time follow naturally from a very-low-entropy boundary condition at the Big Bang — a feature explained by cosmological physics, not agency.",
      zh: "热力学第二定律与时间的流向，自然地来源于大爆炸时极低熵的边界条件——这是宇宙物理学的特征，而非某种意志的体现。",
    },
    likelihoods: { naturalism: 8, theism: 4, simulation: 5 },
    tag: { en: "Thermodynamics", zh: "热力学" },
  },
  {
    id: "ev_no_souls",
    label: {
      en: "No souls, psychic forces, or afterlife detected",
      zh: "未检测到灵魂、超自然力量或来世",
    },
    body: {
      en: "Decades of controlled research in parapsychology, near-death experience studies, and neuroscience find no evidence of mind operating outside the physical brain or surviving death.",
      zh: "数十年来在超心理学、濒死体验研究和神经科学领域的对照研究，均未找到心灵在物质大脑之外运作或在死后存续的证据。",
    },
    likelihoods: { naturalism: 9, theism: 3, simulation: 4 },
    tag: { en: "Neuroscience", zh: "神经科学" },
  },
  {
    id: "ev_fine_tuning",
    label: {
      en: "Fundamental constants appear fine-tuned for life",
      zh: "基本常数似乎为生命精确调节",
    },
    body: {
      en: "Small changes to constants like the cosmological constant or proton-to-electron mass ratio would produce a universe with no chemistry, no stars, no life. Many regard this as surprising; others invoke the anthropic principle or a multiverse.",
      zh: "对宇宙学常数或质子与电子质量比等常数的微小改变，将产生一个没有化学、没有恒星、没有生命的宇宙。许多人认为这令人惊讶；另一些人则诉诸人择原理或多元宇宙。",
    },
    likelihoods: { naturalism: 4, theism: 8, simulation: 8 },
    tag: { en: "Fine-tuning", zh: "精确调节" },
  },
  {
    id: "ev_religious_experience",
    label: {
      en: "Widespread religious and spiritual experience",
      zh: "广泛的宗教与灵性体验",
    },
    body: {
      en: "Across cultures and history, billions of people report experiences of transcendence, presence, or divine contact. Whether these are evidence of something beyond or emergent features of complex brains is contested.",
      zh: "跨越文化与历史，数十亿人报告了超验体验、神圣临在或与神的接触。这些体验究竟是超自然存在的证据，还是复杂大脑的涌现特征，尚存争议。",
    },
    likelihoods: { naturalism: 4, theism: 8, simulation: 4 },
    tag: { en: "Experience", zh: "主观体验" },
  },
  {
    id: "ev_computable",
    label: {
      en: "Reality is suspiciously computable and law-like",
      zh: "现实疑似可计算且遵循精确定律",
    },
    body: {
      en: "The universe obeys precise mathematical laws — quantum mechanics is literally a computation over a complex Hilbert space. Tegmark's Mathematical Universe and Bostrom's simulation argument both exploit this feature.",
      zh: "宇宙遵循精确的数学定律——量子力学字面上就是在复数希尔伯特空间上的计算。泰格马克的数学宇宙和博斯特罗姆的模拟论证都利用了这一特征。",
    },
    likelihoods: { naturalism: 5, theism: 5, simulation: 9 },
    tag: { en: "Mathematics", zh: "数学结构" },
  },
  {
    id: "ev_problem_evil",
    label: {
      en: "Immense suffering exists — the problem of evil",
      zh: "存在巨大苦难——恶的问题",
    },
    body: {
      en: "Cancer, childhood death, animal suffering over millions of years of evolution — the sheer quantity of suffering is hard to reconcile with an omnipotent, omnibenevolent creator. Theodicy attempts answers; they remain disputed.",
      zh: "癌症、儿童夭折、数百万年演化中动物的苦难——巨大的苦难难以与一个全能、全善的造物主相调和。神义论试图给出答案，但争议仍在持续。",
    },
    likelihoods: { naturalism: 7, theism: 3, simulation: 5 },
    tag: { en: "Evil & suffering", zh: "苦难问题" },
  },
  {
    id: "ev_emergence_mind",
    label: {
      en: "Consciousness appears to emerge from physical processes",
      zh: "意识似乎从物理过程中涌现",
    },
    body: {
      en: "Anaesthesia, brain damage, neurotransmitters, and fMRI studies all show tight correlations between brain states and conscious experience, suggesting mind is substrate-dependent — though the 'hard problem' remains open.",
      zh: "麻醉、脑损伤、神经递质以及功能性磁共振成像研究都显示了大脑状态与意识体验之间的紧密关联，暗示心灵依赖于物质基底——尽管'困难问题'仍悬而未决。",
    },
    likelihoods: { naturalism: 8, theism: 4, simulation: 6 },
    tag: { en: "Mind", zh: "心灵问题" },
  },
];

/* ─── BAYES ENGINE ─── */

/** Compute posterior credences from priors and toggled evidence. */
function computePosteriors(
  priors: Record<HypId, number>,
  toggledIds: Set<string>
): Record<HypId, number> {
  const hyps: HypId[] = ["naturalism", "theism", "simulation"];

  // Unnormalised product of likelihoods
  const unnorm: Record<HypId, number> = { naturalism: 1, theism: 1, simulation: 1 };

  for (const ev of EVIDENCE_CARDS) {
    if (!toggledIds.has(ev.id)) continue;
    for (const h of hyps) {
      unnorm[h] *= ev.likelihoods[h] / 5; // divide by 5 so 5 is neutral (ratio = 1)
    }
  }

  // Multiply by priors
  const joint: Record<HypId, number> = {
    naturalism: priors.naturalism * unnorm.naturalism,
    theism: priors.theism * unnorm.theism,
    simulation: priors.simulation * unnorm.simulation,
  };

  const total = joint.naturalism + joint.theism + joint.simulation;
  if (total <= 0) {
    return { naturalism: 1 / 3, theism: 1 / 3, simulation: 1 / 3 };
  }

  return {
    naturalism: joint.naturalism / total,
    theism: joint.theism / total,
    simulation: joint.simulation / total,
  };
}

/** Normalise a raw (possibly non-summing) credence map so it sums to 1. */
function normalise(raw: Record<HypId, number>): Record<HypId, number> {
  const total = raw.naturalism + raw.theism + raw.simulation;
  if (total <= 0) return { naturalism: 1 / 3, theism: 1 / 3, simulation: 1 / 3 };
  return {
    naturalism: raw.naturalism / total,
    theism: raw.theism / total,
    simulation: raw.simulation / total,
  };
}

/* ─── COSMOLOGICAL NEEDLE CANVAS ─── */

/** Draws an animated credence "orrery" — three arcs orbiting a centre,
 *  their angular spans proportional to their posterior credence.
 *  Deterministic: no Math.random; all animation from requestAnimationFrame. */
function OrreryCanvas({
  posteriors,
}: {
  posteriors: Record<HypId, number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const prevTsRef = useRef<number>(0);

  // Target arcs for smooth lerp
  const targetRef = useRef<Record<HypId, number>>(posteriors);
  const displayRef = useRef<Record<HypId, number>>({ ...posteriors });

  useEffect(() => {
    targetRef.current = posteriors;
  }, [posteriors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return;
      const dt = prevTsRef.current === 0 ? 0.016 : Math.min((ts - prevTsRef.current) / 1000, 0.1);
      prevTsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;

      // Smooth display values toward target
      const speed = 3 * dt;
      displayRef.current.naturalism = lerp(displayRef.current.naturalism, targetRef.current.naturalism, speed);
      displayRef.current.theism = lerp(displayRef.current.theism, targetRef.current.theism, speed);
      displayRef.current.simulation = lerp(displayRef.current.simulation, targetRef.current.simulation, speed);

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55);
      bg.addColorStop(0, "rgba(27,30,48,0.8)");
      bg.addColorStop(1, "rgba(7,8,15,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Three orbit rings
      const radii = [68, 96, 122];
      const hexes: Record<HypId, string> = {
        naturalism: "#ff6b5c",
        theism: "#8b7bff",
        simulation: "#2dd4bf",
      };
      const hyps: HypId[] = ["naturalism", "theism", "simulation"];
      const speeds = [0.38, 0.26, 0.18]; // rad/s

      for (let i = 0; i < 3; i++) {
        const r = radii[i];
        // Faint orbit track
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(168,170,198,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Arc spans proportional to credence
      const TAU = Math.PI * 2;
      for (let i = 0; i < 3; i++) {
        const h = hyps[i];
        const r = radii[i];
        const cred = Math.max(0.001, displayRef.current[h]);
        const spanAngle = cred * TAU * 0.9; // never a full circle; cap at 90%
        const startAngle = t * speeds[i];
        const endAngle = startAngle + spanAngle;

        const hex = hexes[h];
        const [rr, gg, bb] = [
          parseInt(hex.slice(1, 3), 16),
          parseInt(hex.slice(3, 5), 16),
          parseInt(hex.slice(5, 7), 16),
        ];

        // Arc glow
        ctx.save();
        ctx.shadowColor = `rgba(${rr},${gg},${bb},0.6)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},0.85)`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // Leading dot
        const dotX = Math.round(cx + r * Math.cos(endAngle));
        const dotY = Math.round(cy + r * Math.sin(endAngle));
        ctx.save();
        ctx.shadowColor = `rgba(${rr},${gg},${bb},0.9)`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, TAU);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},1)`;
        ctx.fill();
        ctx.restore();

        // Credence label on arc
        const labelAngle = startAngle + spanAngle / 2;
        const lr = r + 16;
        const lx = Math.round(cx + lr * Math.cos(labelAngle));
        const ly = Math.round(cy + lr * Math.sin(labelAngle));
        ctx.font = "bold 10px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${rr},${gg},${bb},0.9)`;
        ctx.fillText(`${Math.round(cred * 100)}%`, lx, ly);
      }

      // Centre glyph
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(244,244,251,0.25)";
      ctx.fillText("⊕", cx, cy);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="w-full max-w-[320px] mx-auto rounded-2xl"
      aria-label="Credence orrery"
    />
  );
}

/* ─── CREDENCE BAR ─── */
function CredenceBar({
  hyp,
  value,
  lang,
}: {
  hyp: Hypothesis;
  value: number;
  lang: string;
}) {
  const pct = Math.max(1, Math.round(value * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem]" style={{ color: hyp.hex }}>
            {hyp.icon}
          </span>
          <span
            className={`font-mono text-[0.68rem] uppercase tracking-[0.14em] ${lang === "zh" ? "zh" : ""}`}
            style={{ color: hyp.hex }}
          >
            {Lf(hyp.label.en, hyp.label.zh, lang)}
          </span>
        </div>
        <span className="font-mono text-sm font-bold" style={{ color: hyp.hex }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-void-700/80 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${hyp.hex}55, ${hyp.hex})`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── PRIOR SLIDER ─── */
function PriorSlider({
  hyp,
  value,
  onChange,
  lang,
}: {
  hyp: Hypothesis;
  value: number;
  onChange: (v: number) => void;
  lang: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-[0.6rem] uppercase tracking-[0.14em] ${lang === "zh" ? "zh" : ""}`}
          style={{ color: hyp.hex }}
        >
          {Lf(hyp.label.en, hyp.label.zh, lang)}
        </span>
        <span className="font-mono text-[0.65rem]" style={{ color: hyp.hex }}>
          {Math.round(value * 100)}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={99}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(parseInt(e.target.value, 10) / 100)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: hyp.hex,
          background: `linear-gradient(90deg, ${hyp.hex} ${Math.round(value * 100)}%, rgba(40,44,72,0.6) ${Math.round(value * 100)}%)`,
        }}
        aria-label={`Prior credence for ${hyp.label.en}`}
      />
    </div>
  );
}

/* ─── EVIDENCE CARD ─── */
function EvidenceCard({
  ev,
  active,
  onToggle,
  posteriors,
  lang,
}: {
  ev: Evidence;
  active: boolean;
  onToggle: () => void;
  posteriors: Record<HypId, number>;
  lang: string;
}) {
  const [expanded, setExpanded] = useState(false);

  // Compute the "direction" of this evidence: which hypothesis gets the highest boost
  const maxH = (["naturalism", "theism", "simulation"] as HypId[]).reduce((best, h) =>
    ev.likelihoods[h] > ev.likelihoods[best] ? h : best,
    "naturalism" as HypId
  );
  const lead = HYPOTHESES.find((h) => h.id === maxH)!;
  const isNeutral = ev.likelihoods.naturalism === ev.likelihoods.theism &&
    ev.likelihoods.theism === ev.likelihoods.simulation;

  return (
    <div
      className={`panel rounded-xl transition-all duration-300 ${active ? "" : "opacity-60"}`}
      style={
        active
          ? {
              borderColor: lead.hex + "55",
              boxShadow: `0 0 28px -12px ${lead.hex}44`,
            }
          : {
              borderColor: "rgba(40,44,72,0.6)",
            }
      }
    >
      {/* Card header */}
      <div className="p-4 flex items-start gap-3">
        {/* Toggle checkbox */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 mt-0.5 h-5 w-5 rounded border transition-all duration-200 flex items-center justify-center"
          style={
            active
              ? {
                  borderColor: lead.hex,
                  background: lead.hex + "22",
                  color: lead.hex,
                }
              : {
                  borderColor: "rgba(108,110,144,0.5)",
                  background: "transparent",
                  color: "transparent",
                }
          }
          aria-pressed={active}
          aria-label={`Toggle evidence: ${ev.label.en}`}
        >
          {active && <span className="text-[0.6rem] font-bold">✓</span>}
        </button>

        <div className="flex-1 min-w-0 space-y-1">
          <div
            className={`text-sm font-medium leading-snug ${lang === "zh" ? "zh" : ""}`}
            style={{ color: active ? "#f4f4fb" : "#6c6e90" }}
          >
            {Lf(ev.label.en, ev.label.zh, lang)}
          </div>

          {/* Tag badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono text-[0.53rem] uppercase tracking-[0.12em] border rounded px-1.5 py-0.5"
              style={
                active
                  ? {
                      borderColor: lead.hex + "55",
                      color: lead.hex,
                      background: lead.hex + "10",
                    }
                  : {
                      borderColor: "rgba(108,110,144,0.25)",
                      color: "#6c6e90",
                    }
              }
            >
              {Lf(ev.tag.en, ev.tag.zh, lang)}
            </span>
            {!isNeutral && active && (
              <span
                className={`font-mono text-[0.52rem] ${lang === "zh" ? "zh" : ""}`}
                style={{ color: lead.hex + "bb" }}
              >
                ↑ {Lf(lead.label.en, lead.label.zh, lang)}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded border border-ink-100/10 font-mono text-[0.65rem] text-ink-500 hover:text-ink-300 hover:border-ink-100/25 transition-all"
          aria-label="Show details"
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 rise-in border-t border-ink-100/6 pt-3">
          <p
            className={`text-xs leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}
          >
            {Lf(ev.body.en, ev.body.zh, lang)}
          </p>

          {/* Likelihood mini-bars */}
          <div className="space-y-2">
            <div className="label-mono text-ink-500 text-[0.52rem]">
              {Lf("Likelihood weights (relative)", "似然权重（相对值）", lang)}
            </div>
            {HYPOTHESES.map((h) => {
              const lk = ev.likelihoods[h.id];
              const pct = Math.round((lk / 10) * 100);
              return (
                <div key={h.id} className="flex items-center gap-2">
                  <span
                    className={`w-20 font-mono text-[0.56rem] uppercase tracking-[0.1em] flex-shrink-0 ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: h.hex }}
                  >
                    {Lf(h.label.en, h.label.zh, lang)}
                  </span>
                  <div className="flex-1 h-1.5 bg-void-700/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${h.hex}44, ${h.hex})`,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[0.58rem] w-5 text-right flex-shrink-0"
                    style={{ color: h.hex }}
                  >
                    {lk}
                  </span>
                </div>
              );
            })}
            <p className="text-[0.52rem] text-ink-500 font-mono leading-relaxed">
              {Lf(
                "5 = neutral (no update). >5 = fits this hypothesis better. <5 = fits it less.",
                "5＝中性（不更新）。>5＝更符合该假说。<5＝与之不符。",
                lang
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── TEACHING INSIGHT ─── */
function UpdateLog({
  activeIds,
  posteriors,
  priors,
  lang,
}: {
  activeIds: Set<string>;
  posteriors: Record<HypId, number>;
  priors: Record<HypId, number>;
  lang: string;
}) {
  const normPriors = normalise(priors);

  // Compute the shift per hypothesis from prior → posterior
  const shifts: Record<HypId, number> = {
    naturalism: posteriors.naturalism - normPriors.naturalism,
    theism: posteriors.theism - normPriors.theism,
    simulation: posteriors.simulation - normPriors.simulation,
  };

  const dominant = (["naturalism", "theism", "simulation"] as HypId[]).reduce(
    (best, h) => (posteriors[h] > posteriors[best] ? h : best),
    "naturalism" as HypId
  );

  const dominantHyp = HYPOTHESES.find((h) => h.id === dominant)!;

  const nActive = activeIds.size;

  return (
    <div className="panel rounded-xl p-4 space-y-4 panel-gold">
      <div className="label-mono text-gold-500">
        {Lf("Bayesian Update Log", "贝叶斯更新日志", lang)}
      </div>

      {/* Shift summary */}
      <div className="space-y-2">
        {HYPOTHESES.map((h) => {
          const shift = shifts[h.id];
          const signChar = shift >= 0 ? "+" : "−";
          const absShift = Math.abs(Math.round(shift * 100));
          return (
            <div key={h.id} className="flex items-center gap-2">
              <span
                className={`font-mono text-[0.62rem] uppercase tracking-[0.12em] w-28 flex-shrink-0 ${lang === "zh" ? "zh" : ""}`}
                style={{ color: h.hex }}
              >
                {Lf(h.label.en, h.label.zh, lang)}
              </span>
              <span
                className="font-mono text-[0.65rem]"
                style={{ color: shift >= 0 ? "#f5b942" : "#6c6e90" }}
              >
                {signChar}{absShift}pp
              </span>
              <div className="flex-1 h-1 rounded-full bg-void-700/60 overflow-hidden">
                {shift !== 0 && (
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, absShift * 2)}%`,
                      background: shift > 0 ? h.hex : "#6c6e90",
                      marginLeft: shift < 0 ? "auto" : 0,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-ink-100/8" />

      {/* Leading hypothesis call-out */}
      <div
        className="rounded-lg border px-3 py-2.5 text-xs leading-relaxed"
        style={{
          borderColor: dominantHyp.hex + "44",
          background: dominantHyp.hexFaint,
        }}
      >
        <span
          className={`font-mono text-[0.6rem] uppercase tracking-[0.13em] ${lang === "zh" ? "zh" : ""}`}
          style={{ color: dominantHyp.hex }}
        >
          {Lf(dominantHyp.label.en, dominantHyp.label.zh, lang)}
        </span>
        <span className="text-ink-300 font-mono text-[0.6rem]"> — </span>
        <span className="text-ink-300">
          {Math.round(posteriors[dominant] * 100)}%
        </span>
        {nActive === 0 && (
          <p className={`mt-1.5 text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            {Lf(
              "No evidence toggled yet — posteriors equal the priors.",
              "尚未选择任何证据——后验等于先验。",
              lang
            )}
          </p>
        )}
      </div>

      {/* Carroll teaching note */}
      <p className={`text-[0.62rem] leading-relaxed text-ink-500 italic ${lang === "zh" ? "zh" : ""}`}>
        {nActive === 0
          ? Lf(
              "Toggle evidence cards to start updating. Each piece of evidence shifts the probabilities by a small amount — no single fact is decisive.",
              "勾选证据卡片以开始更新。每条证据都会小幅移动概率——没有任何单一事实能做出最终裁决。",
              lang
            )
          : Lf(
              `${nActive} piece${nActive === 1 ? "" : "s"} of evidence considered. The verdict is never certain — it is a credence, not a proof.`,
              `已考虑 ${nActive} 条证据。结论永远不是确定的——它是一种可信度，而非证明。`,
              lang
            )}
      </p>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function BayesLab() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => Lf(en, zh, lang), [lang]);

  // Raw prior sliders (before normalisation; each can be moved independently)
  // Default: 50 / 30 / 20 — weighted toward naturalism as a starting exploration point.
  // The user is immediately shown the normalised values and can freely change them.
  const [rawPriors, setRawPriors] = useState<Record<HypId, number>>({
    naturalism: 0.50,
    theism: 0.30,
    simulation: 0.20,
  });

  // Active (toggled ON) evidence
  const [activeEv, setActiveEv] = useState<Set<string>>(new Set());

  // Normalised priors
  const priors = normalise(rawPriors);

  // Posteriors
  const posteriors = computePosteriors(priors, activeEv);

  // Toggle evidence
  const toggleEvidence = useCallback((id: string) => {
    setActiveEv((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Prior change — adjust one; others remain as-is (normalisation handles the rest)
  const handlePriorChange = useCallback((h: HypId, v: number) => {
    setRawPriors((prev) => ({ ...prev, [h]: v }));
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setRawPriors({ naturalism: 0.50, theism: 0.30, simulation: 0.20 });
    setActiveEv(new Set());
  }, []);

  return (
    <section className="w-full space-y-8">
      {/* ── HEADER ── */}
      <div className="space-y-3">
        <div className="label-mono">
          {L("Bayesian Epistemology · Sean Carroll's Big Picture", "贝叶斯认识论 · 卡罗尔《宏观图景》")}
        </div>
        <h2 className="display text-3xl sm:text-4xl spark-text">
          {L("Planets of Belief", "信念之星")}
        </h2>
        <p className={`text-sm leading-relaxed text-ink-300 max-w-2xl ${lang === "zh" ? "zh" : ""}`}>
          {L(
            "Set your prior credences, then toggle evidence cards on or off. Posteriors update in real time via Bayes' theorem. No single fact decides — the verdict is the slow accumulation of many small updates. Credences never reach 0 or 1.",
            "设置你的先验可信度，然后切换证据卡片的开关。后验通过贝叶斯定理实时更新。没有任何单一事实能做出最终裁决——结论是众多小幅更新的缓慢积累。可信度永远不会达到0或1。"
          )}
        </p>
        <div className="h-px rule-flux" />
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT — controls */}
        <div className="space-y-6">

          {/* PRIORS */}
          <div className="panel rounded-2xl p-5 space-y-4 panel-iris">
            <div className="flex items-center justify-between">
              <div className="label-mono text-iris-400">
                {L("Prior Credences", "先验可信度")}
              </div>
              <div className={`text-[0.6rem] font-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                {L("(normalised to 100)", "（归一化至100）")}
              </div>
            </div>

            <div className="space-y-4">
              {HYPOTHESES.map((h) => (
                <PriorSlider
                  key={h.id}
                  hyp={h}
                  value={rawPriors[h.id]}
                  onChange={(v) => handlePriorChange(h.id, v)}
                  lang={lang}
                />
              ))}
            </div>

            <p className={`text-[0.6rem] leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              {L(
                "Your prior is what you believe before consulting any evidence — it reflects background knowledge and philosophical instinct. Move the sliders freely; they auto-normalise.",
                "先验是你在查看任何证据之前的信念——它反映了你的背景知识与哲学直觉。自由移动滑块；它们会自动归一化。"
              )}
            </p>
          </div>

          {/* POSTERIOR BARS */}
          <div className="panel rounded-2xl p-5 space-y-4">
            <div className="label-mono">
              {L("Posterior Credences", "后验可信度")}
            </div>
            {HYPOTHESES.map((h) => (
              <CredenceBar
                key={h.id}
                hyp={h}
                value={posteriors[h.id]}
                lang={lang}
              />
            ))}

            {/* Hypothesis taglines */}
            <div className="space-y-2 pt-1">
              {HYPOTHESES.map((h) => (
                <div key={h.id} className="flex items-start gap-2">
                  <span
                    className="font-mono text-[0.7rem] flex-shrink-0 mt-0.5"
                    style={{ color: h.hex }}
                  >
                    {h.icon}
                  </span>
                  <p
                    className={`text-[0.62rem] leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}
                  >
                    {Lf(h.tagline.en, h.tagline.zh, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* UPDATE LOG */}
          <UpdateLog
            activeIds={activeEv}
            posteriors={posteriors}
            priors={rawPriors}
            lang={lang}
          />
        </div>

        {/* RIGHT — orrery + evidence */}
        <div className="space-y-6">

          {/* ORRERY */}
          <div className="panel rounded-2xl p-5 panel-leaf space-y-3">
            <div className="flex items-center justify-between">
              <div className="label-mono text-leaf-500">
                {L("Credence Orrery", "可信度星环")}
              </div>
              <button
                onClick={handleReset}
                className="label-mono text-ink-500 hover:text-flux-400 transition-colors px-2 py-1 rounded border border-ink-100/10 hover:border-flux-500/30 text-[0.52rem]"
              >
                {L("Reset ↺", "重置 ↺")}
              </button>
            </div>

            <OrreryCanvas posteriors={posteriors} />

            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {HYPOTHESES.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em]"
                  style={{
                    borderColor: h.hex + "44",
                    color: h.hex,
                    background: h.hex + "0d",
                  }}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0 pulse"
                    style={{ background: h.hex }}
                  />
                  <span className={lang === "zh" ? "zh" : ""}>
                    {Lf(h.label.en, h.label.zh, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EVIDENCE CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="label-mono">
                {L("Evidence — toggle to update", "证据——切换以更新")}
              </div>
              <div className="font-mono text-[0.58rem] text-ink-500">
                {activeEv.size}/{EVIDENCE_CARDS.length} {L("active", "激活")}
              </div>
            </div>

            <div className="space-y-2">
              {EVIDENCE_CARDS.map((ev) => (
                <EvidenceCard
                  key={ev.id}
                  ev={ev}
                  active={activeEv.has(ev.id)}
                  onToggle={() => toggleEvidence(ev.id)}
                  posteriors={posteriors}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TEACHING FOOTER ── */}
      <div className="panel rounded-2xl p-6 space-y-4 panel-gold">
        <div className="label-mono text-gold-500">
          {L("On Credences · Carroll's Poetic Naturalism", "关于可信度 · 卡罗尔的诗意自然主义")}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "⊘",
              color: "#ff6b5c",
              en: "No certainties",
              zh: "没有确定性",
              bodyEn: "Credences are not beliefs you hold — they are degrees of confidence. Even 1% leaves room for the universe to surprise you.",
              bodyZh: "可信度不是你持有的信念，而是置信程度。即使只有1%，也给宇宙留下了让你惊讶的空间。",
            },
            {
              icon: "≈",
              color: "#8b7bff",
              en: "Slow accumulation",
              zh: "缓慢积累",
              bodyEn: "Each fact nudges your credence a little. The verdict isn't a single eureka — it's the patient weight of many small updates.",
              bodyZh: "每一条事实都会微微移动你的可信度。最终裁决不是某个灵光一闪——而是众多微小更新的耐心积累。",
            },
            {
              icon: "∂",
              color: "#2dd4bf",
              en: "Open revision",
              zh: "保持开放",
              bodyEn: "Bayesian reasoning never locks in a final answer. New evidence always changes things — staying revisable is a feature, not a flaw.",
              bodyZh: "贝叶斯推理从不锁定最终答案。新证据总是会改变一切——保持可修订性是一种特性，而非缺陷。",
            },
          ].map((item) => (
            <div
              key={item.en}
              className="rounded-xl border p-4 space-y-2"
              style={{
                borderColor: item.color + "33",
                background: item.color + "08",
              }}
            >
              <div className="font-mono text-xl" style={{ color: item.color }}>
                {item.icon}
              </div>
              <div
                className={`font-mono text-[0.65rem] uppercase tracking-[0.14em] ${lang === "zh" ? "zh" : ""}`}
                style={{ color: item.color }}
              >
                {L(item.en, item.zh)}
              </div>
              <p className={`text-[0.65rem] leading-relaxed text-ink-400 ${lang === "zh" ? "zh" : ""}`}>
                {L(item.bodyEn, item.bodyZh)}
              </p>
            </div>
          ))}
        </div>

        <p className={`text-[0.6rem] text-ink-500 italic leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}>
          {L(
            "The likelihood values in this lab are qualitative approximations for illustration. Real Bayesian cosmology is a live research programme. The point is to develop the habit of holding views as credences — not as certainties — and updating them honestly as evidence accumulates.",
            "本实验室中的似然值是用于说明目的的定性近似。真正的贝叶斯宇宙学是一个活跃的研究项目。重点在于培养将观点视为可信度（而非确定性）的习惯，并随着证据积累而诚实地更新它们。"
          )}
        </p>
      </div>
    </section>
  );
}
