"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "./lang";

/* ─────────────────────────────────────────────────────────────────────────────
   PALETTE  (project-wide tokens; explicit hex for canvas)
───────────────────────────────────────────────────────────────────────────── */
const C = {
  void950: "#07080f",
  void900: "#0c0e1a",
  void800: "#12141f",
  void700: "#1b1e30",
  flux500: "#ff6b5c",
  flux400: "#ff9b8f",
  iris500: "#8b7bff",
  iris400: "#b3a8ff",
  leaf500: "#2dd4bf",
  leaf400: "#6ee7d6",
  gold500: "#f5b942",
  gold400: "#ffd27a",
  plasm500: "#ff4fa3",
  ink50:   "#f4f4fb",
  ink300:  "#a8aac6",
  ink500:  "#6c6e90",
};

/* ─────────────────────────────────────────────────────────────────────────────
   BELIEF LANDSCAPE DATA
   Five "planets" — coherent worldview clusters. Each belief on a planet
   mutually supports the others. Crossing to a neighbour costs a "gap".
   Positions are fixed (deterministic — no Math.random).
───────────────────────────────────────────────────────────────────────────── */
interface Planet {
  id: string;
  label: { en: string; zh: string };
  tagline: { en: string; zh: string };
  beliefs: { en: string; zh: string }[];
  // normalised canvas coordinates [0..1]
  cx: number;
  cy: number;
  r: number; // planet radius, normalised
  color: string;
  gapCost: number; // conceptual leap cost to nearest neighbour (1=hard, 0=easy)
}

const PLANETS: Planet[] = [
  {
    id: "naturalism",
    label: { en: "Naturalism", zh: "自然主义" },
    tagline: { en: "All that exists is the physical world", zh: "存在的一切皆是物质世界" },
    beliefs: [
      { en: "Mind emerges from matter", zh: "心灵从物质中涌现" },
      { en: "No supernatural forces", zh: "不存在超自然力量" },
      { en: "Science is our best guide", zh: "科学是最好的认识工具" },
      { en: "Meaning is constructed", zh: "意义是被建构出来的" },
    ],
    cx: 0.25, cy: 0.38, r: 0.11, color: C.flux500, gapCost: 0.78,
  },
  {
    id: "theism",
    label: { en: "Theism", zh: "有神论" },
    tagline: { en: "A transcendent mind grounds reality", zh: "超越性心灵支撑真实存在" },
    beliefs: [
      { en: "Consciousness is fundamental", zh: "意识是最基本的" },
      { en: "Morality has objective ground", zh: "道德有客观基础" },
      { en: "Fine-tuning needs explanation", zh: "宇宙精调需要解释" },
      { en: "Revelation as testimony", zh: "启示是一种见证" },
    ],
    cx: 0.68, cy: 0.28, r: 0.10, color: C.gold500, gapCost: 0.82,
  },
  {
    id: "simulation",
    label: { en: "Simulation", zh: "模拟论" },
    tagline: { en: "Our reality runs on a substrate", zh: "我们的现实运行于某种基底" },
    beliefs: [
      { en: "Computation is ontologically basic", zh: "计算是本体论基础" },
      { en: "Physics laws are code", zh: "物理定律是代码" },
      { en: "Ancestor simulations are probable", zh: "祖先模拟在概率上可能" },
      { en: "Consciousness can be substrate-independent", zh: "意识可以独立于基底" },
    ],
    cx: 0.76, cy: 0.62, r: 0.09, color: C.iris500, gapCost: 0.70,
  },
  {
    id: "emergence",
    label: { en: "Strong Emergence", zh: "强涌现论" },
    tagline: { en: "Higher levels are genuinely new", zh: "高层级拥有真实新颖性" },
    beliefs: [
      { en: "Downward causation is real", zh: "向下因果是真实的" },
      { en: "Reduction always loses something", zh: "还原论总会遗漏某些东西" },
      { en: "Consciousness resists physics", zh: "意识无法被物理完整解释" },
      { en: "Life is a new ontological kind", zh: "生命是一种全新的本体类型" },
    ],
    cx: 0.28, cy: 0.70, r: 0.09, color: C.leaf500, gapCost: 0.60,
  },
  {
    id: "pragmatism",
    label: { en: "Pragmatism", zh: "实用主义" },
    tagline: { en: "Truth is what works in practice", zh: "真理是在实践中行得通的" },
    beliefs: [
      { en: "Theory is a tool, not a mirror", zh: "理论是工具，不是镜子" },
      { en: "Experience is foundational", zh: "经验是基础" },
      { en: "Pluralism is principled", zh: "多元主义是有原则的" },
      { en: "Usefulness validates claims", zh: "有用性验证主张" },
    ],
    cx: 0.52, cy: 0.52, r: 0.08, color: C.plasm500, gapCost: 0.50,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   BELIEF LANDSCAPE CANVAS
───────────────────────────────────────────────────────────────────────────── */
interface LandscapeCanvasProps {
  activePlanetId: string;
  hoveredPlanetId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  lang: "en" | "zh";
}

function LandscapeCanvas({ activePlanetId, hoveredPlanetId, onHover, onSelect, lang }: LandscapeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const lastTsRef = useRef(0);

  // Track mouse for hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    let hit: string | null = null;
    for (const p of PLANETS) {
      const dx = mx - p.cx;
      const dy = my - p.cy;
      if (Math.sqrt(dx * dx + dy * dy) < p.r + 0.04) { hit = p.id; break; }
    }
    onHover(hit);
  }, [onHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    for (const p of PLANETS) {
      const dx = mx - p.cx;
      const dy = my - p.cy;
      if (Math.sqrt(dx * dx + dy * dy) < p.r + 0.04) { onSelect(p.id); break; }
    }
  }, [onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      phaseRef.current += dt * 0.55;

      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(loop); return; }
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      // Background: deep void with subtle nebula gradient
      ctx.fillStyle = C.void950;
      ctx.fillRect(0, 0, W, H);

      // Nebula glow behind active planet
      const ap = PLANETS.find(p => p.id === activePlanetId)!;
      const apx = ap.cx * W;
      const apy = ap.cy * H;
      const nebula = ctx.createRadialGradient(apx, apy, 0, apx, apy, ap.r * W * 2.2);
      nebula.addColorStop(0, `${ap.color}14`);
      nebula.addColorStop(1, "transparent");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, W, H);

      // Draw "valleys" (faint connection arcs between nearby planets)
      const pairs: [number, number][] = [[0,4],[1,4],[2,4],[3,4],[0,3],[1,2]];
      for (const [ai, bi] of pairs) {
        const a = PLANETS[ai];
        const b = PLANETS[bi];
        const ax = a.cx * W; const ay = a.cy * H;
        const bx = b.cx * W; const by = b.cy * H;
        const avgGap = (a.gapCost + b.gapCost) / 2;
        // dashed valley line
        ctx.save();
        ctx.strokeStyle = `${C.ink500}28`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.setLineDash([]);

        // Gap cost label at midpoint
        const mx2 = (ax + bx) / 2;
        const my2 = (ay + by) / 2;
        ctx.font = `6px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `${C.ink500}55`;
        ctx.textAlign = "center";
        ctx.fillText(`gap ${(avgGap * 10).toFixed(0)}`, mx2, my2);
        ctx.restore();
      }

      // Draw planets
      for (const p of PLANETS) {
        const px = p.cx * W;
        const py = p.cy * H;
        const pr = p.r * Math.min(W, H);
        const isActive = p.id === activePlanetId;
        const isHov = p.id === hoveredPlanetId;
        const pulse = isActive ? 1 + 0.05 * Math.sin(phaseRef.current * 2.1) : 1;
        const drawR = pr * pulse;

        // Atmosphere halo
        const haloR = drawR * (isActive ? 1.85 : isHov ? 1.55 : 1.4);
        const halo = ctx.createRadialGradient(px, py, drawR * 0.6, px, py, haloR);
        halo.addColorStop(0, `${p.color}${isActive ? "35" : "18"}`);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        const bodyGrad = ctx.createRadialGradient(px - drawR * 0.28, py - drawR * 0.28, drawR * 0.05, px, py, drawR);
        bodyGrad.addColorStop(0, `${p.color}ee`);
        bodyGrad.addColorStop(0.6, `${p.color}bb`);
        bodyGrad.addColorStop(1, `${p.color}55`);
        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isActive ? 22 : isHov ? 12 : 5;
        ctx.fillStyle = bodyGrad;
        ctx.strokeStyle = isActive ? p.color : `${p.color}66`;
        ctx.lineWidth = isActive ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.arc(px, py, drawR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Orbital ring for active
        if (isActive) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(phaseRef.current * 0.4);
          ctx.strokeStyle = `${p.color}55`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 6]);
          ctx.beginPath();
          ctx.ellipse(0, 0, drawR * 1.6, drawR * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // Label
        ctx.save();
        ctx.font = `bold ${isActive ? 9 : 8}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = isActive ? C.ink50 : `${C.ink300}cc`;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isActive ? 8 : 0;
        const labelY = py + drawR + 13;
        ctx.fillText(lang === "zh" ? p.label.zh : p.label.en, px, labelY);
        ctx.restore();

        // "You are here" marker on active
        if (isActive) {
          ctx.save();
          ctx.font = `8px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.fillStyle = `${p.color}cc`;
          ctx.fillText("▲ YOU", px, py - drawR - 8);
          ctx.restore();
        }
      }

      // Drift particles orbiting active planet
      const numParticles = 5;
      for (let i = 0; i < numParticles; i++) {
        const angle = phaseRef.current * 0.7 + (i * Math.PI * 2) / numParticles;
        const orbitR = ap.r * Math.min(W, H) * 1.9;
        const ppx = apx + Math.cos(angle) * orbitR;
        const ppy = apy + Math.sin(angle) * orbitR * 0.45;
        const alpha = 0.3 + 0.4 * Math.sin(angle + phaseRef.current);
        const clamped = Math.max(0, Math.min(1, alpha));
        ctx.save();
        ctx.globalAlpha = clamped;
        ctx.fillStyle = ap.color;
        ctx.shadowColor = ap.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(ppx, ppy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [activePlanetId, hoveredPlanetId, lang]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
      aria-label={lang === "zh" ? "信念星球景观图——点击探索各个世界观" : "Belief landscape — click planets to explore worldviews"}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PLANET DETAIL PANEL
───────────────────────────────────────────────────────────────────────────── */
interface PlanetDetailProps {
  planet: Planet;
  lang: "en" | "zh";
}

function PlanetDetail({ planet, lang }: PlanetDetailProps) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const p = planet;

  return (
    <div
      className="panel rounded-2xl p-5 flex flex-col gap-4 rise-in"
      style={{ borderColor: `${p.color}35`, boxShadow: `0 0 48px -20px ${p.color}44` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
          style={{
            background: `${p.color}22`,
            border: `1.5px solid ${p.color}55`,
            boxShadow: `0 0 18px -6px ${p.color}`,
            color: p.color,
          }}
        >
          ◉
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <div
            className={`display text-lg font-bold leading-tight ${lang === "zh" ? "zh" : ""}`}
            style={{ color: p.color }}
          >
            {p.label[lang]}
          </div>
          <div
            className={`text-[0.73rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
            style={{ color: `${C.ink300}aa`, fontFamily: lang === "zh" ? undefined : '"Spectral", serif', fontStyle: "italic" }}
          >
            {p.tagline[lang]}
          </div>
        </div>
      </div>

      {/* Mutually-supporting beliefs */}
      <div className="flex flex-col gap-1.5">
        <div className="label-mono text-[0.58rem] mb-1" style={{ color: p.color }}>
          {L("MUTUALLY SUPPORTING BELIEFS", "相互支撑的信念")}
        </div>
        {p.beliefs.map((b, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 text-[0.72rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
          >
            <span style={{ color: `${p.color}88`, fontSize: "0.55rem", marginTop: 3, flexShrink: 0 }}>◆</span>
            <span style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}>
              {b[lang]}
            </span>
          </div>
        ))}
      </div>

      {/* Gap cost indicator */}
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2.5"
        style={{ background: `${p.color}0d`, border: `1px solid ${p.color}22` }}
      >
        <span className="label-mono text-[0.58rem] flex-shrink-0" style={{ color: `${p.color}99` }}>
          {L("LEAP COST", "跨越成本")}
        </span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${C.void800}` }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${p.gapCost * 100}%`, background: `linear-gradient(90deg, ${p.color}88, ${p.color})` }}
          />
        </div>
        <span className="font-mono text-[0.65rem] flex-shrink-0" style={{ color: p.color }}>
          {(p.gapCost * 10).toFixed(1)}/10
        </span>
      </div>

      <p
        className={`text-[0.71rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
        style={{ color: `${C.ink500}cc`, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
      >
        {L(
          "A single contrary fact rarely dislodges a person from this planet — each belief shores up the others. Shifting requires the whole web to reconstitute itself around new anchors.",
          "单一的反例很难将人从这个星球上赶走——每种信念都在强化其他信念。转变需要整个信念网络围绕新的锚点重新构建。",
        )}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ABDUCTION SECTION — Inference to the Best Explanation
───────────────────────────────────────────────────────────────────────────── */
interface Evidence {
  id: string;
  text: { en: string; zh: string };
  // Likelihood ratio scores for each hypothesis (how much this evidence favours it)
  // Scores 0–1 normalised
  scores: { naturalism: number; theism: number; simulation: number };
}

const EVIDENCE_ITEMS: Evidence[] = [
  {
    id: "finetuning",
    text: { en: "The universe's constants are exquisitely fine-tuned for complexity", zh: "宇宙常数被精妙调节以支持复杂性" },
    scores: { naturalism: 0.38, theism: 0.92, simulation: 0.85 },
  },
  {
    id: "evolution",
    text: { en: "All living things share common ancestry via natural selection", zh: "所有生命通过自然选择共享共同祖先" },
    scores: { naturalism: 0.95, theism: 0.48, simulation: 0.72 },
  },
  {
    id: "consciousness",
    text: { en: "Subjective experience seems categorically unlike physical process", zh: "主观体验似乎与物理过程有本质差别" },
    scores: { naturalism: 0.30, theism: 0.88, simulation: 0.75 },
  },
  {
    id: "qm",
    text: { en: "Quantum mechanics is genuinely probabilistic at the deepest level", zh: "量子力学在最深层面是真正概率性的" },
    scores: { naturalism: 0.80, theism: 0.55, simulation: 0.90 },
  },
  {
    id: "evil",
    text: { en: "Gratuitous suffering exists throughout the natural world", zh: "无意义的苦难广泛存在于自然界" },
    scores: { naturalism: 0.88, theism: 0.22, simulation: 0.70 },
  },
  {
    id: "math",
    text: { en: "Mathematics is unreasonably effective at describing nature", zh: "数学对自然的描述能力令人惊讶地有效" },
    scores: { naturalism: 0.70, theism: 0.75, simulation: 0.96 },
  },
];

const ABD_HYPS = [
  { id: "naturalism" as const, label: { en: "Naturalism", zh: "自然主义" }, color: C.flux500 },
  { id: "theism" as const,     label: { en: "Theism",      zh: "有神论"   }, color: C.gold500 },
  { id: "simulation" as const, label: { en: "Simulation",  zh: "模拟论"   }, color: C.iris500 },
];

function AbductionLab({ lang }: { lang: "en" | "zh" }) {
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);
  const [activeEvidence, setActiveEvidence] = useState<Set<string>>(new Set(["evolution", "finetuning"]));

  const toggleEvidence = (id: string) => {
    setActiveEvidence(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Compute aggregate score per hypothesis (product of likelihood ratios for active evidence)
  // To avoid zero-collapse, floor each at 0.1
  const activeItems = EVIDENCE_ITEMS.filter(e => activeEvidence.has(e.id));
  const rawScores = ABD_HYPS.map(h => {
    if (activeItems.length === 0) return { id: h.id, raw: 1 };
    const product = activeItems.reduce((acc, e) => acc * Math.max(0.1, e.scores[h.id]), 1);
    return { id: h.id, raw: product };
  });
  const total = rawScores.reduce((s, x) => s + x.raw, 0);
  const scores = rawScores.map(x => ({ id: x.id, pct: total > 0 ? x.raw / total : 1 / 3 }));
  const bestId = scores.reduce((b, x) => x.pct > b.pct ? x : b, scores[0]).id;

  // Simplicity bonus nudge label
  const bestHyp = ABD_HYPS.find(h => h.id === bestId)!;

  return (
    <div className="flex flex-col gap-6">
      {/* Explanation */}
      <p
        className={`text-sm leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
        style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
      >
        {L(
          "Abduction — inference to the best explanation — isn't deduction or induction. We gather evidence, then ask: which hypothesis most simply and completely accounts for all of it? Toggle evidence pieces to see how the explanatory balance shifts.",
          "溯因推理——推断最佳解释——既非演绎也非归纳。我们收集证据，然后问：哪个假设最简洁、最完整地解释了所有证据？切换证据项，看看解释性天平如何变化。",
        )}
      </p>

      {/* Evidence cards */}
      <div className="grid sm:grid-cols-2 gap-2">
        {EVIDENCE_ITEMS.map(ev => {
          const on = activeEvidence.has(ev.id);
          return (
            <button
              key={ev.id}
              onClick={() => toggleEvidence(ev.id)}
              aria-pressed={on}
              className={`text-left px-3 py-2.5 rounded-xl border transition-all duration-150 ${lang === "zh" ? "zh" : ""}`}
              style={{
                background: on ? `${C.gold500}12` : `${C.void800}`,
                borderColor: on ? `${C.gold500}55` : `${C.ink500}28`,
                color: on ? C.gold400 : C.ink500,
                fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
                fontSize: "0.73rem",
                lineHeight: 1.45,
                boxShadow: on ? `0 0 20px -8px ${C.gold500}66` : "none",
              }}
            >
              <span
                className="label-mono text-[0.55rem] block mb-1"
                style={{ color: on ? C.gold500 : C.ink500 }}
              >
                {on ? L("● EVIDENCE ON", "● 已加入证据") : L("○ CLICK TO ADD", "○ 点击加入")}
              </span>
              {ev.text[lang]}
            </button>
          );
        })}
      </div>

      {/* Score bars */}
      <div className="flex flex-col gap-3">
        <div className="label-mono text-[0.58rem]" style={{ color: C.leaf500 }}>
          {L("EXPLANATORY POWER — ABDUCTIVE SCORE", "解释力——溯因推理得分")}
        </div>
        {ABD_HYPS.map(h => {
          const sc = scores.find(s => s.id === h.id)!;
          const isBest = h.id === bestId && activeItems.length > 0;
          const pct = Math.round(sc.pct * 100);
          return (
            <div key={h.id} className="flex items-center gap-3">
              <div
                className={`label-mono text-[0.6rem] w-24 text-right flex-shrink-0 transition-colors duration-300 ${lang === "zh" ? "zh" : ""}`}
                style={{ color: isBest ? h.color : `${C.ink500}` }}
              >
                {h.label[lang]}
              </div>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: `${C.void700}` }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: isBest
                      ? `linear-gradient(90deg, ${h.color}99, ${h.color})`
                      : `${h.color}55`,
                    boxShadow: isBest ? `0 0 12px -2px ${h.color}` : "none",
                  }}
                />
              </div>
              <div
                className="font-mono text-[0.68rem] w-8 text-right flex-shrink-0 transition-colors duration-300"
                style={{ color: isBest ? h.color : C.ink500 }}
              >
                {pct}%
              </div>
              {isBest && (
                <div
                  className="label-mono text-[0.52rem] px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: `${h.color}22`,
                    border: `1px solid ${h.color}44`,
                    color: h.color,
                  }}
                >
                  {L("BEST FIT", "最佳解释")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Best explanation callout */}
      {activeItems.length > 0 && (
        <div
          className="rounded-xl border px-4 py-3.5 flex flex-col gap-1.5 rise-in"
          style={{
            borderColor: `${bestHyp.color}30`,
            background: `${bestHyp.color}08`,
          }}
        >
          <div className="label-mono text-[0.58rem]" style={{ color: bestHyp.color }}>
            {L("INFERENCE TO THE BEST EXPLANATION", "最佳解释推断")}
          </div>
          <p
            className={`text-[0.74rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              `Given these ${activeItems.length} evidence pieces, ${bestHyp.label.en} currently offers the most parsimonious account. But notice: this is not proof. Adding or removing a single piece of evidence can tip the balance — abduction tracks the weight of evidence, not certainty.`,
              `根据这${activeItems.length}条证据，${bestHyp.label.zh}目前提供了最简洁的解释。但请注意：这不是证明。增减一条证据就可能改变天平——溯因推理追踪的是证据的权重，而非确定性。`,
            )}
          </p>
        </div>
      )}
      {activeItems.length === 0 && (
        <div
          className="rounded-xl border px-4 py-3.5 pulse"
          style={{ borderColor: `${C.ink500}20`, background: `${C.void800}` }}
        >
          <p
            className={`text-[0.73rem] leading-relaxed text-center ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L("Select at least one piece of evidence to begin abductive reasoning.", "请选择至少一条证据以开始溯因推理。")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STICKINESS EXPLAINER — why worldviews resist single facts
───────────────────────────────────────────────────────────────────────────── */
function StickinessNote({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const nodes = [
    { label: { en: "Core belief", zh: "核心信念" }, x: 0.50, y: 0.22, color: C.iris500 },
    { label: { en: "Auxiliary A", zh: "辅助信念A" }, x: 0.22, y: 0.55, color: C.iris400 },
    { label: { en: "Auxiliary B", zh: "辅助信念B" }, x: 0.78, y: 0.55, color: C.iris400 },
    { label: { en: "Fact X ✕", zh: "事实X ✕" },   x: 0.50, y: 0.80, color: C.flux500 },
  ];
  const edges: [number, number][] = [[0,1],[0,2],[1,3],[2,3]];

  return (
    <div
      className="panel rounded-2xl p-5 flex flex-col gap-4"
      style={{ borderColor: `${C.iris500}20` }}
    >
      <div className="label-mono text-[0.58rem]" style={{ color: C.iris400 }}>
        {L("WHY WORLDVIEWS ARE STICKY", "为何世界观如此顽固")}
      </div>
      <div style={{ height: 120, position: "relative" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x * 100} y1={nodes[a].y * 100}
              x2={nodes[b].x * 100} y2={nodes[b].y * 100}
              stroke={`${C.iris500}44`} strokeWidth="0.8" strokeDasharray="2 4"
            />
          ))}
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x * 100} cy={n.y * 100} r={i === 3 ? 5.5 : 7}
                fill={`${n.color}22`} stroke={n.color} strokeWidth={i === 3 ? 0.6 : 1}
                strokeDasharray={i === 3 ? "2 3" : undefined} />
              <text x={n.x * 100} y={n.y * 100 + 2.5}
                textAnchor="middle" fontSize="4.5"
                fill={n.color}
                fontFamily={lang === "zh" ? "'Noto Serif SC', serif" : "'Space Grotesk', sans-serif"}
              >
                {n.label[lang]}
              </text>
            </g>
          ))}
          {/* Arrow showing Fact X is absorbed rather than demolishing core */}
          <path d="M50 75 Q35 62 28 58" stroke={`${C.flux500}66`} strokeWidth="0.7" fill="none"
            markerEnd="url(#arr)" strokeDasharray="2 3" />
          <defs>
            <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
              <path d="M0,0 L4,2 L0,4 Z" fill={`${C.flux500}66`} />
            </marker>
          </defs>
        </svg>
      </div>
      <p
        className={`text-[0.72rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
        style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
      >
        {L(
          "When a single contrary fact (Fact X) appears, the web doesn't collapse — the auxiliary beliefs absorb and re-interpret it. This is Quine–Duhem: any belief can be preserved if you are willing to modify the auxiliaries. This is why worldviews are 'sticky' and why big shifts require many converging pressures, not a single decisive blow.",
          "当单一反例（事实X）出现时，信念之网并不崩溃——辅助信念会吸收并重新解释它。这正是奎因–迪昂论题：只要你愿意修改辅助信念，任何核心信念都可以被保留。这就是世界观之所以「顽固」，而重大转变需要多重汇聚压力而非单一决定性打击的原因。",
        )}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function ReasoningViz() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);

  // Active planet starts at naturalism (deterministic)
  const [activePlanetId, setActivePlanetId] = useState<string>("naturalism");
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);

  // Tab between sections
  const [section, setSection] = useState<"landscape" | "abduction">("landscape");

  const activePlanet = PLANETS.find(p => p.id === activePlanetId)!;

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ── SECTION HEADER ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono" style={{ color: C.iris500 }}>
          {L("Theme 02 · How We Know", "主题02 · 我们如何认知")}
        </div>
        <h2 className={`display text-3xl md:text-4xl leading-tight spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("The Landscape of Belief", "信念的景观")}
        </h2>
        <p
          className={`text-sm max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "We don't hold beliefs one-by-one; we inhabit coherent worldviews — planets of mutually-supporting ideas. Moving between them isn't a single logical step but a costly crossing of a conceptual gap. And we select among worldviews not by deduction, but by asking: which account is simplest, most complete, best?",
            "我们不是逐一持有信念；我们栖居于连贯的世界观之中——由相互支撑的观念构成的星球。在它们之间移动不是一个简单的逻辑步骤，而是跨越概念鸿沟的代价高昂的旅程。我们在世界观之间作出选择，靠的不是演绎，而是追问：哪种解释最简洁、最完整、最优？",
          )}
        </p>
      </div>

      <div className="h-px rule-flux opacity-40 rounded-full" />

      {/* ── TAB NAV ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "landscape" as const, en: "Planets of Belief", zh: "信念星球" },
          { id: "abduction" as const, en: "Best Explanation", zh: "最佳解释" },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            className={`px-4 py-2 rounded-full font-mono text-[0.68rem] border transition-all duration-200 ${lang === "zh" ? "zh" : ""}`}
            style={{
              borderColor: section === t.id
                ? (t.id === "landscape" ? `${C.iris500}70` : `${C.leaf500}70`)
                : `${C.ink500}28`,
              color: section === t.id
                ? (t.id === "landscape" ? C.iris400 : C.leaf400)
                : C.ink500,
              background: section === t.id
                ? (t.id === "landscape" ? `${C.iris500}18` : `${C.leaf500}18`)
                : "transparent",
              boxShadow: section === t.id
                ? `0 0 18px -6px ${t.id === "landscape" ? C.iris500 : C.leaf500}66`
                : "none",
            }}
          >
            {lang === "zh" ? t.zh : t.en}
          </button>
        ))}
      </div>

      {/* ── SECTION A: PLANETS OF BELIEF ─────────────────────────────────── */}
      {section === "landscape" && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="label-mono mb-2" style={{ color: C.iris500 }}>
              {L("Part 1 · Planets of Belief", "第一部分 · 信念星球")}
            </div>
            <p
              className={`text-[0.8rem] max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
            >
              {L(
                "Each planet below is a cluster of mutually-reinforcing beliefs. Click any planet to land on it — see which ideas it gathers, how costly it is to leave, and why a single contrary fact rarely dislodges a worldview.",
                "下方每个星球代表一组相互强化的信念。点击任一星球降落其上——查看它汇聚了哪些观念、离开的代价有多高，以及为何单一反例很难动摇一个世界观。",
              )}
            </p>
          </div>

          {/* Canvas + Detail grid */}
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-5 items-start">

            {/* Landscape canvas */}
            <div
              className="rounded-2xl overflow-hidden border"
              style={{
                background: C.void950,
                borderColor: `${activePlanet.color}28`,
                boxShadow: `0 0 60px -24px ${activePlanet.color}44`,
                transition: "border-color 0.4s, box-shadow 0.5s",
              }}
            >
              <div style={{ height: 320 }}>
                <LandscapeCanvas
                  activePlanetId={activePlanetId}
                  hoveredPlanetId={hoveredPlanetId}
                  onHover={setHoveredPlanetId}
                  onSelect={setActivePlanetId}
                  lang={lang}
                />
              </div>
              <div
                className={`px-4 py-2 text-[0.63rem] text-center font-mono ${lang === "zh" ? "zh" : ""}`}
                style={{ color: `${C.ink500}77` }}
              >
                {L("Dashed lines = conceptual valleys; gap scores show crossing cost", "虚线=概念谷地；差距值表示跨越成本")}
              </div>
            </div>

            {/* Detail panel */}
            <PlanetDetail planet={activePlanet} lang={lang} />
          </div>

          {/* Planet selector chips */}
          <div className="flex flex-wrap gap-2">
            {PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePlanetId(p.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-[0.62rem] border transition-all duration-200 ${lang === "zh" ? "zh" : ""}`}
                style={{
                  borderColor: activePlanetId === p.id ? `${p.color}70` : `${p.color}28`,
                  color: activePlanetId === p.id ? p.color : `${p.color}88`,
                  background: activePlanetId === p.id ? `${p.color}18` : "transparent",
                  boxShadow: activePlanetId === p.id ? `0 0 14px -4px ${p.color}55` : "none",
                }}
              >
                {p.label[lang]}
              </button>
            ))}
          </div>

          <div className="h-px rule-flux opacity-25 rounded-full" />

          {/* Why sticky */}
          <StickinessNote lang={lang} />
        </div>
      )}

      {/* ── SECTION B: ABDUCTION ─────────────────────────────────────────── */}
      {section === "abduction" && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="label-mono mb-2" style={{ color: C.leaf500 }}>
              {L("Part 2 · Abduction — Inference to the Best Explanation", "第二部分 · 溯因推理——最佳解释推断")}
            </div>
          </div>
          <AbductionLab lang={lang} />

          <div className="h-px rule-flux opacity-25 rounded-full" />

          {/* Abduction vs Deduction vs Induction mini-explainer */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                label: { en: "Deduction", zh: "演绎" },
                icon: "→",
                color: C.flux500,
                body: {
                  en: "From premises that guarantee the conclusion. Truth-preserving but can't go beyond what's already assumed.",
                  zh: "从前提必然推出结论。保真但无法超越前提本身。",
                },
              },
              {
                label: { en: "Induction", zh: "归纳" },
                icon: "↑",
                color: C.gold500,
                body: {
                  en: "From observed patterns to general rules. Can be wrong; the next swan may not be white.",
                  zh: "从观察规律推出一般规则。可能出错；下一只天鹅未必是白色的。",
                },
              },
              {
                label: { en: "Abduction", zh: "溯因" },
                icon: "✦",
                color: C.leaf500,
                body: {
                  en: "From evidence to the best available explanation. Uses simplicity and fit as guides. Carroll's workhorse.",
                  zh: "从证据推出最佳可用解释。以简洁性和拟合度为向导。卡罗尔的主要推理工具。",
                },
              },
            ].map((item) => (
              <div
                key={item.label.en}
                className="panel rounded-xl p-4 flex flex-col gap-2"
                style={{ borderColor: `${item.color}25` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base" style={{ color: item.color }}>{item.icon}</span>
                  <div
                    className={`display text-[0.82rem] font-bold ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: item.color }}
                  >
                    {item.label[lang]}
                  </div>
                </div>
                <p
                  className={`text-[0.71rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
                >
                  {item.body[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CLOSING OBSERVATION ──────────────────────────────────────────── */}
      <div
        className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
        style={{
          borderColor: `${C.iris500}15`,
          background: `${C.iris500}04`,
          color: C.ink500,
          fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
        }}
      >
        {L(
          "Carroll's epistemology resists two failure modes: the dogmatist who never updates, and the radical skeptic who holds nothing. The middle path is to hold a coherent planet of belief with calibrated credences — knowing it is a planet, not bedrock — and to move only when the evidence accumulated on the other side becomes too great to ignore.",
          "卡罗尔的认识论抵制两种失败模式：从不更新的教条主义者，以及什么都不相信的极端怀疑论者。中间道路是以校准过的可信度持有一个连贯的信念星球——明知它是星球而非基岩——只有当另一侧累积的证据大到无法忽视时才选择迁移。",
        )}
      </div>

    </div>
  );
}
