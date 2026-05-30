"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════════
   WorldviewRadar — 8-axis meta-model radar contrasting five worldviews on the
   features Sean Carroll highlights in The Big Picture (Poetic Naturalism and
   its alternatives).

   Five worldview presets morph the polygon; any two can be overlaid for
   comparison. Scores are an interpretive analytical lens — not canonical
   doctrine or the book's explicit claims.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────── axes ────────────────────────────────────

const AXES: Bi[] = [
  { en: "Physical\nMonism", zh: "物理\n一元论" },
  { en: "Role of\nEvidence", zh: "证据的\n角色" },
  { en: "Emergence of\nHigher Levels", zh: "高层的\n涌现" },
  { en: "Openness to\nMystery", zh: "对神秘的\n开放" },
  { en: "Source of\nMeaning: Internal", zh: "意义来\n自内部" },
  { en: "Free Will:\nCompatibilist", zh: "相容论的\n自由意志" },
  { en: "Mind is\nPhysical", zh: "心灵是\n物理的" },
  { en: "Cosmic\nPurpose", zh: "宇宙的\n目的" },
];

const AXIS_NOTES: Bi[] = [
  {
    en: "The degree to which a worldview holds that only the natural, physical world exists — no separate supernatural realm, no immaterial substances beyond matter and energy obeying the laws of physics. Maximal in strict naturalism; minimal where a transcendent creator or spiritual reality is foundational.",
    zh: "一种世界观在多大程度上坚持：只有自然的、物理的世界存在——没有单独的超自然领域，没有超越物质与能量（遵从物理定律）的非物质实体。在严格的自然主义中达到最大值；在超越性造物主或精神现实作为基础的世界观中降至最低。",
  },
  {
    en: "How tightly a worldview binds its beliefs to empirical evidence and the revision of claims when evidence changes. Maximal where science and repeatable observation are the final arbiters of truth; lower where revealed texts, personal experience, or a priori metaphysics are treated as epistemically prior.",
    zh: "一种世界观在多大程度上将其信念与经验证据紧密绑定，并在证据变化时修正主张。在科学与可重复观察是真理最终仲裁者的世界观中达到最大值；在天启文本、个人体验或先验形而上学被视为认识论优先时则较低。",
  },
  {
    en: "The degree to which higher-level descriptions — biology over chemistry, psychology over neuroscience, narratives over physics — are granted genuine ontological reality and causal power. Carroll's Poetic Naturalism insists emergent levels are real and useful; eliminative reductionism denies this; theism typically affirms it but grounds it in a different substrate.",
    zh: "高层次描述——生物学超越化学、心理学超越神经科学、叙事超越物理学——被赋予真实本体论地位和因果力量的程度。卡罗尔的诗性自然主义坚持涌现层次是真实且有用的；消去式还原论否定这一点；有神论通常肯定它，但将其奠基于不同的基底之上。",
  },
  {
    en: "How much room a worldview leaves for the genuinely unexplained, the transcendent, or experiences that resist scientific reduction — awe, mystical states, the hard problem of consciousness, the brute fact of existence itself. Not the same as irrationalism; high here means the worldview explicitly holds that current frameworks are incomplete.",
    zh: "一种世界观为真正无法解释的事物、超越性体验，以及抵制科学还原的经验——敬畏、神秘状态、意识的难题、存在本身的裸事实——留下多少空间。这与非理性主义不同；在这里分数高意味着该世界观明确认为当前框架是不完整的。",
  },
  {
    en: "The degree to which meaning, value, and purpose are understood as constructed or discovered by minds — not inscribed in the universe from without. Carroll argues that meaning we create is no less real for being created. Low here corresponds to views where meaning requires an external source: God, natural teleology, or cosmic narrative.",
    zh: "意义、价值和目的在多大程度上被理解为由心灵建构或发现的——而非从外部铭刻于宇宙之中。卡罗尔认为，我们所创造的意义并不因为是被创造的而减少其真实性。这里分数低对应于那些认为意义需要外部来源的观点：上帝、自然目的论或宇宙叙事。",
  },
  {
    en: "Whether free will is understood as compatible with determinism (or near-determinism) at the physical level. Compatibilists hold that deliberation, choice, and responsibility are genuine features of the human level even if microphysics is fixed; hard incompatibilists deny this; libertarian free-will views require genuine indeterminism or a non-physical agent.",
    zh: "自由意志是否被理解为与物理层面的决定论（或近似决定论）相容。相容论者认为，即使微观物理学是固定的，审议、选择和责任也是人类层面的真实特征；硬性不相容论者否认这一点；自由意志论观点需要真正的非决定论或非物理能动者。",
  },
  {
    en: "The degree to which mental states — consciousness, intentionality, qualia — are held to be entirely physical, fully explicable (in principle) by neuroscience and physics. Maximal in eliminative materialism and strong functionalism; minimal in substance dualism where mind and matter are distinct kinds of thing; intermediate in property dualism.",
    zh: "心理状态——意识、意向性、感受质——在多大程度上被认为是完全物理性的，原则上可由神经科学和物理学完全解释。在消去式唯物主义和强功能主义中达到最大值；在心灵与物质被视为不同种类的实体二元论中降至最低；在属性二元论中居于中间。",
  },
  {
    en: "The degree to which the universe is understood to have a built-in, objective purpose, direction, or telos — an arrow pointing toward some end that is not merely a human projection. Maximal in classical theism (creation has a divine purpose) and Aristotelian teleology; minimal in Carroll's Poetic Naturalism, where the universe is indifferent and purpose is a human-level concept only.",
    zh: "宇宙在多大程度上被理解为具有内在的、客观的目的、方向或终极目标——一个指向某种终点的箭头，而不仅仅是人类的投射。在古典有神论（创造具有神圣目的）和亚里士多德目的论中达到最大值；在卡罗尔的诗性自然主义中降至最低，在那里宇宙是漠然的，目的仅仅是一个人类层次的概念。",
  },
];

// ─────────────────────────────────── presets ─────────────────────────────────

interface Preset {
  name: Bi;
  note: Bi;
  scores: [number, number, number, number, number, number, number, number];
  color: string;
  interpretive?: boolean;
}

/* Scores order:
   [PhysicalMonism, RoleOfEvidence, EmergenceOfHigherLevels, OpennessToMystery,
    SourceOfMeaningInternal, FreeWillCompatibilist, MindIsPhysical, CosmicPurpose] */
const PRESETS: Preset[] = [
  {
    name: { en: "Poetic Naturalism", zh: "诗性自然主义" },
    note: {
      en: "Carroll's own view: the physical world is all there is, higher-level descriptions are real and meaningful, and we construct purpose rather than discover it cosmically. The book's core thesis.",
      zh: "卡罗尔自己的观点：物理世界就是一切，高层描述是真实且有意义的，我们建构目的而非在宇宙中发现它。本书的核心论题。",
    },
    scores: [0.97, 0.95, 0.90, 0.18, 0.93, 0.88, 0.92, 0.05],
    color: "#ff6b5c", // flux coral — the book's own view
    interpretive: true,
  },
  {
    name: { en: "Theism", zh: "有神论" },
    note: {
      en: "A personal creator God exists, grounds meaning and moral order, and the universe has a divinely intended purpose. Mind may be partially non-physical (soul). Evidence accommodated but revelation is also authoritative.",
      zh: "一位人格化的造物主上帝存在，奠定意义与道德秩序，宇宙具有神圣意图赋予的目的。心灵可能部分是非物理的（灵魂）。证据被纳入考量，但启示同样具有权威性。",
    },
    scores: [0.08, 0.52, 0.75, 0.88, 0.22, 0.60, 0.30, 0.97],
    color: "#f5b942", // gold — theism
    interpretive: true,
  },
  {
    name: { en: "Eliminative Reductionism", zh: "消去式还原论" },
    note: {
      en: "Only fundamental physics is real; folk psychology, biology, and higher-level categories are convenient fictions to be eliminated or reduced without remainder. Beliefs, desires, and free will are ultimately nothing but neuron firings.",
      zh: "只有基础物理学是真实的；民间心理学、生物学和高层范畴是便利的虚构，最终将被消除或无余地还原。信念、欲望和自由意志归根结底不过是神经元放电。",
    },
    scores: [0.98, 0.92, 0.10, 0.05, 0.30, 0.20, 0.95, 0.03],
    color: "#2dd4bf", // leaf teal — eliminative reductionism
    interpretive: true,
  },
  {
    name: { en: "Dualism", zh: "二元论" },
    note: {
      en: "Mind and matter are fundamentally distinct kinds of substance or property — Cartesian substance dualism at the extreme, or property dualism's irreducible qualia. Physical laws govern matter; mental reality is something more.",
      zh: "心灵与物质在根本上是不同种类的实体或属性——极端情况是笛卡尔的实体二元论，或属性二元论中不可还原的感受质。物理定律支配物质；心理现实是某种更多的东西。",
    },
    scores: [0.15, 0.62, 0.65, 0.72, 0.48, 0.45, 0.08, 0.52],
    color: "#8b7bff", // iris violet — dualism
    interpretive: true,
  },
  {
    name: { en: "Existentialism", zh: "存在主义" },
    note: {
      en: "Existence precedes essence: there is no pre-given cosmic meaning or human nature — radical freedom compels us to author our own values. Atheistic existentialism (Sartre/Camus) agrees with naturalism on the indifferent cosmos but stresses the anguish of that freedom.",
      zh: "存在先于本质：没有预先给定的宇宙意义或人类本质——彻底的自由迫使我们自己创作价值。无神论存在主义（萨特/加缪）在宇宙漠然这一点上与自然主义一致，但强调这种自由所带来的焦虑。",
    },
    scores: [0.72, 0.70, 0.78, 0.55, 0.97, 0.65, 0.68, 0.05],
    color: "#ff4fa3", // plasm magenta — existentialism
    interpretive: true,
  },
];

// ─────────────────────────────── geometry ────────────────────────────────────

const SIZE = 460;
const C = SIZE / 2;
const R = SIZE * 0.36;
const N = AXES.length;

function pt(i: number, frac: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
  return [
    Math.round((C + Math.cos(a) * R * frac) * 1000) / 1000,
    Math.round((C + Math.sin(a) * R * frac) * 1000) / 1000,
  ];
}

function polyPoints(scores: readonly number[]): string {
  return scores.map((s, i) => pt(i, s).join(",")).join(" ");
}

// ─────────────────────────────── component ───────────────────────────────────

export default function WorldviewRadar() {
  const { lang } = useLang();

  // primary selected preset (always shown) — default: Poetic Naturalism
  const [primary, setPrimary] = useState<number>(0);
  // optional compare overlay (null = off)
  const [compare, setCompare] = useState<number | null>(null);
  // hovered axis for tooltip
  const [axis, setAxis] = useState<number | null>(null);
  // hover on a preset button to dim others
  const [hover, setHover] = useState<number | null>(null);

  const primaryPreset = PRESETS[primary];
  const comparePreset = compare !== null ? PRESETS[compare] : null;

  function handlePresetClick(idx: number) {
    if (idx === primary) return;
    if (compare === null) {
      setPrimary(idx);
    } else {
      if (idx === compare) {
        setCompare(null);
      } else {
        setPrimary(idx);
      }
    }
  }

  function handleCompareToggle(idx: number) {
    if (idx === primary) return;
    setCompare((c) => (c === idx ? null : idx));
  }

  // Spoke color matches primary preset's color at low opacity
  const spokeColor = `${primaryPreset.color}1a`;
  const ringColor = `${primaryPreset.color}14`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      {/* ─── Radar SVG ─── */}
      <div className="relative mx-auto w-full max-w-[540px]">
        <svg viewBox={`-140 -60 ${SIZE + 280} ${SIZE + 120}`} className="w-full">
          {/* grid rings */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon
              key={f}
              points={AXES.map((_, i) => pt(i, f).join(",")).join(" ")}
              fill="none"
              stroke={ringColor}
              strokeWidth={1}
            />
          ))}

          {/* ring labels (25 … 100) at top axis */}
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const [lx, ly] = pt(0, f);
            return (
              <text
                key={f}
                x={lx + 5}
                y={ly}
                fontSize={8}
                dominantBaseline="middle"
                fill="rgba(168,170,198,0.45)"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {(f * 100).toFixed(0)}
              </text>
            );
          })}

          {/* axis spokes */}
          {AXES.map((_, i) => {
            const [x, y] = pt(i, 1);
            return (
              <g key={i}>
                <line
                  x1={C}
                  y1={C}
                  x2={x}
                  y2={y}
                  stroke={spokeColor}
                  strokeWidth={1}
                />
                {/* invisible hit target */}
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setAxis(i)}
                  onMouseLeave={() => setAxis(null)}
                />
              </g>
            );
          })}

          {/* compare polygon (drawn below primary so primary is on top) */}
          {comparePreset && (
            <g style={{ transition: "opacity 0.25s" }}>
              <polygon
                points={polyPoints(comparePreset.scores)}
                fill={comparePreset.color}
                fillOpacity={0.07}
                stroke={comparePreset.color}
                strokeWidth={1.6}
                strokeDasharray="5 3"
                strokeLinejoin="round"
                style={{ transition: "points 0.45s cubic-bezier(0.4,0,0.2,1)" }}
              />
              {comparePreset.scores.map((s, i) => {
                const [x, y] = pt(i, s);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={2.2}
                    fill={comparePreset.color}
                    opacity={0.7}
                  />
                );
              })}
            </g>
          )}

          {/* primary polygon */}
          <g>
            <polygon
              points={polyPoints(primaryPreset.scores)}
              fill={primaryPreset.color}
              fillOpacity={0.11}
              stroke={primaryPreset.color}
              strokeWidth={2.2}
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 9px ${primaryPreset.color}88)`,
                transition: "points 0.45s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
            {primaryPreset.scores.map((s, i) => {
              const [x, y] = pt(i, s);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3}
                  fill={primaryPreset.color}
                  style={{ filter: `drop-shadow(0 0 4px ${primaryPreset.color})` }}
                />
              );
            })}
          </g>

          {/* axis labels */}
          {AXES.map((ax, i) => {
            const [x, y] = pt(i, 1.22);
            const anchor: "middle" | "start" | "end" =
              Math.abs(x - C) < 40 ? "middle" : x > C ? "start" : "end";
            const lines = ax[lang].split("\n");
            return (
              <text
                key={i}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={lang === "zh" ? 12 : 10.5}
                className={`${
                  axis === i ? "fill-flux-400" : "fill-[#6c6e90]"
                } ${lang === "zh" ? "zh" : "font-mono"}`}
                style={{
                  letterSpacing: lang === "zh" ? "0.02em" : "0.04em",
                  cursor: "pointer",
                  textTransform: lang === "zh" ? "none" : "uppercase",
                  transition: "fill 0.15s",
                }}
                onMouseEnter={() => setAxis(i)}
                onMouseLeave={() => setAxis(null)}
              >
                {lines.map((line, li) => (
                  <tspan
                    key={li}
                    x={x}
                    dy={li === 0 ? (lines.length > 1 ? "-0.55em" : "0") : "1.25em"}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}

          {/* centre dot */}
          <circle cx={C} cy={C} r={3} fill={`${primaryPreset.color}4d`} />
        </svg>
      </div>

      {/* ─── Controls panel ─── */}
      <div>
        <div className="label-mono">
          {lang === "zh"
            ? "世界观雷达 · 八维特征对比"
            : "worldview radar · eight-feature contrast"}
        </div>

        <div className="mt-4 space-y-2">
          {PRESETS.map((p, pi) => {
            const isPrimary = pi === primary;
            const isCompare = pi === compare;
            const dimmed =
              hover !== null && hover !== pi && !isPrimary && !isCompare;

            return (
              <div
                key={pi}
                className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                  isPrimary
                    ? "border-ink-100/25 bg-void-800/80"
                    : isCompare
                    ? "border-ink-100/15 bg-void-900/60"
                    : "border-ink-100/6 bg-void-950/40"
                } ${dimmed ? "opacity-35" : "opacity-100"}`}
                style={{ transition: "opacity 0.2s, border-color 0.2s" }}
                onMouseEnter={() => setHover(pi)}
                onMouseLeave={() => setHover(null)}
              >
                {/* colour swatch + click-to-set-primary */}
                <button
                  onClick={() => handlePresetClick(pi)}
                  className="flex min-w-0 flex-1 items-start gap-3"
                  aria-pressed={isPrimary}
                >
                  <span
                    className="mt-1 h-3 w-3 flex-none rounded-sm"
                    style={{
                      background: p.color,
                      boxShadow: isPrimary
                        ? `0 0 12px ${p.color}`
                        : isCompare
                        ? `0 0 7px ${p.color}88`
                        : "none",
                    }}
                  />
                  <span className="min-w-0">
                    <span className="display block text-sm text-ink-100">
                      <T v={p.name} />
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-500">
                      <T v={p.note} />
                    </span>
                  </span>
                </button>

                {/* compare toggle button */}
                {!isPrimary && (
                  <button
                    onClick={() => handleCompareToggle(pi)}
                    title={
                      isCompare
                        ? lang === "zh"
                          ? "移除对比"
                          : "Remove overlay"
                        : lang === "zh"
                        ? "添加对比"
                        : "Overlay"
                    }
                    className={`mt-0.5 flex-none rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition ${
                      isCompare
                        ? "border-iris-500/50 bg-iris-500/15 text-iris-400"
                        : "border-ink-100/10 text-ink-500 hover:border-iris-500/40 hover:text-iris-400"
                    }`}
                  >
                    {isCompare
                      ? lang === "zh"
                        ? "取消"
                        : "×"
                      : lang === "zh"
                      ? "对比"
                      : "vs"}
                  </button>
                )}

                {isPrimary && (
                  <span className="mt-0.5 flex-none rounded border border-flux-500/40 bg-flux-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-flux-400">
                    {lang === "zh" ? "选中" : "active"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── axis detail card ─── */}
        <div
          key={axis ?? -1}
          className="mt-6 min-h-[96px] rounded-xl border border-flux-500/20 bg-void-900/60 p-4 lang-fade"
        >
          {axis === null ? (
            <p className="text-sm leading-relaxed text-ink-400">
              <T
                v={{
                  en: "Hover an axis to read what it measures. Click a worldview to morph the polygon; use the vs button to overlay a second worldview for comparison.",
                  zh: "悬停某个轴以阅读它度量什么。点击某个世界观，多边形将变形；使用「对比」按钮叠加另一个世界观进行比较。",
                }}
              />
            </p>
          ) : (
            <>
              <div className="display text-base flux-glow">
                <T v={AXES[axis]} />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                <T v={AXIS_NOTES[axis]} />
              </p>
            </>
          )}
        </div>

        {/* ─── compare legend strip (visible when comparing) ─── */}
        {comparePreset && (
          <div
            className="mt-3 flex items-center gap-4 rounded-lg border border-ink-100/8 bg-void-900/40 px-4 py-2.5"
            style={{ transition: "opacity 0.3s" }}
          >
            <span className="flex items-center gap-2 text-xs text-ink-400">
              <span
                className="inline-block h-2.5 w-5 rounded-sm"
                style={{
                  background: primaryPreset.color,
                  boxShadow: `0 0 8px ${primaryPreset.color}`,
                }}
              />
              <T v={primaryPreset.name} />
            </span>
            <span className="text-xs text-ink-500/40">vs</span>
            <span className="flex items-center gap-2 text-xs text-ink-400">
              <span
                className="inline-block h-2.5 w-5 rounded-sm opacity-70"
                style={{
                  background: comparePreset.color,
                  border: `1px dashed ${comparePreset.color}`,
                }}
              />
              <T v={comparePreset.name} />
            </span>
          </div>
        )}

        {/* ─── interpretive note ─── */}
        <p className="mt-4 border-t border-ink-100/5 pt-3 text-[10px] leading-relaxed text-ink-500/70">
          <T
            v={{
              en: "Scores are an interpretive analytical lens — a way of reading each worldview's commitments spatially. They are not canonical doctrine, nor the book's explicit claims, nor verified measurements of any tradition.",
              zh: "分数是一种诠释性分析视角——以空间方式呈现每种世界观的核心承诺。它们既非任何传统的权威教义，也非本书的明确主张，更非经过验证的量化数据。",
            }}
          />
        </p>
      </div>
    </div>
  );
}
