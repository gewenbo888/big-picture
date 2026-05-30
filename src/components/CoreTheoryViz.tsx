"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   CoreTheoryViz
   Theme 03 — The Core Theory

   Visualizes the Standard Model + weak-field gravity, partitioned into:
   IN  — particles/forces whose laws are COMPLETE for everyday life
   OUT — mysteries at the extremes where physics remains open

   Carroll's bold claim: the laws governing everyday matter are completely
   known. No new forces or substances can carry a soul or let mind move
   matter outside this framework. Physics mainstream; philosophically contested.
═══════════════════════════════════════════════════════════════════════════ */

/* ── colour palette ─────────────────────────────────────────────────────── */
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
  plasm400: "#ff8cc4",
  ink50:   "#f4f4fb",
  ink300:  "#a8aac6",
  ink500:  "#6c6e90",
};

/* ── deterministic pseudo-random (no Math.random in render) ─────────────── */
function seeded(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE / FORCE DATA
═══════════════════════════════════════════════════════════════════════════ */
type Zone = "in" | "out";
type Category = "quark" | "lepton" | "boson" | "gravity" | "mystery";

interface Particle {
  id: string;
  symbol: string;
  zone: Zone;
  category: Category;
  spin: string;
  mass: { en: string; zh: string };
  role: { en: string; zh: string };          // everyday life role
  philosophy: { en: string; zh: string };    // the deeper implication
  color: string;                              // display colour
}

const PARTICLES: Particle[] = [
  /* ── IN: quarks that make ordinary matter ─────────────────────────────── */
  {
    id: "up",
    symbol: "u",
    zone: "in",
    category: "quark",
    spin: "½",
    mass: { en: "2.2 MeV/c²", zh: "2.2 MeV/c²" },
    role: {
      en: "Two up quarks + one down = a proton. Every proton in every atom you have ever touched.",
      zh: "两个上夸克加一个下夸克构成一个质子。你触碰过的每一个原子中的每一个质子。",
    },
    philosophy: {
      en: "The up quark is one of three fundamental ingredients of all visible matter. Its interactions with gluons are completely described by QCD — no unknown force acts here.",
      zh: "上夸克是所有可见物质的三种基本成分之一。它与胶子的相互作用由量子色动力学（QCD）完整描述——这里没有未知力量作用。",
    },
    color: C.iris500,
  },
  {
    id: "down",
    symbol: "d",
    zone: "in",
    category: "quark",
    spin: "½",
    mass: { en: "4.7 MeV/c²", zh: "4.7 MeV/c²" },
    role: {
      en: "One up quark + two down quarks = a neutron. Every neutron in every nucleus. Chemistry depends on neutrons holding nuclei together.",
      zh: "一个上夸克加两个下夸克构成一个中子。每个原子核中的每个中子。化学依赖中子将原子核凝聚在一起。",
    },
    philosophy: {
      en: "Like the up quark, the down quark belongs to the completed sector of physics. Its behaviour is fully predicted; no supernatural force touches it.",
      zh: "与上夸克一样，下夸克属于物理学的已完成领域。其行为可被完整预测；没有超自然力量触及它。",
    },
    color: C.iris400,
  },
  /* ── IN: leptons relevant to everyday life ──────────────────────────── */
  {
    id: "electron",
    symbol: "e⁻",
    zone: "in",
    category: "lepton",
    spin: "½",
    mass: { en: "0.511 MeV/c²", zh: "0.511 MeV/c²" },
    role: {
      en: "Electron clouds around nuclei are chemistry. Every bond, every molecule, every living cell — the electron is the actor.",
      zh: "围绕原子核的电子云就是化学。每一个化学键、每一个分子、每一个活细胞——电子是主角。",
    },
    philosophy: {
      en: "The electron's complete lawbook (QED) is arguably the most precisely tested theory in all of science. Agreement with experiment exceeds 10 significant figures. No gap for unknown influences.",
      zh: "电子的完整法则（量子电动力学）可以说是所有科学中检验最精确的理论。与实验的吻合度超过10个有效数字。不存在未知影响的空间。",
    },
    color: C.flux500,
  },
  {
    id: "electron_neutrino",
    symbol: "νₑ",
    zone: "in",
    category: "lepton",
    spin: "½",
    mass: { en: "< 1.1 eV/c²", zh: "< 1.1 eV/c²" },
    role: {
      en: "Emitted in beta decay; carries energy in nuclear reactions that power the Sun. Passes through matter almost unimpeded.",
      zh: "在β衰变中释放；在为太阳提供能量的核反应中携带能量。几乎无阻碍地穿过物质。",
    },
    philosophy: {
      en: "Electron neutrinos interact only via the weak force and gravity. Their tiny mass is known to be non-zero but is included in the extended Standard Model. Everyday matter is largely transparent to them.",
      zh: "电子中微子只通过弱力和引力相互作用。已知其微小质量不为零，包含在扩展标准模型中。日常物质对它们几乎是透明的。",
    },
    color: C.flux400,
  },
  /* ── IN: force carriers of everyday physics ──────────────────────────── */
  {
    id: "photon",
    symbol: "γ",
    zone: "in",
    category: "boson",
    spin: "1",
    mass: { en: "0 (massless)", zh: "0（无质量）" },
    role: {
      en: "Light, electricity, magnetism, chemical bonds. The photon mediates every electromagnetic interaction — sight, fire, radio, chemistry.",
      zh: "光、电、磁、化学键。光子介导每一种电磁相互作用——视觉、火焰、无线电、化学。",
    },
    philosophy: {
      en: "QED predicts the photon with extraordinary precision. The electromagnetic force is the force of everyday life — and it is completely known.",
      zh: "量子电动力学以惊人的精度预测光子。电磁力是日常生活的力量——并且已被完整地认识。",
    },
    color: C.gold500,
  },
  {
    id: "gluon",
    symbol: "g",
    zone: "in",
    category: "boson",
    spin: "1",
    mass: { en: "0 (massless)", zh: "0（无质量）" },
    role: {
      en: "Binds quarks inside protons and neutrons. The strong nuclear force. Without it, nuclei fly apart and matter cannot form.",
      zh: "将夸克束缚在质子和中子内部。强核力。没有它，原子核会飞散，物质无法形成。",
    },
    philosophy: {
      en: "Gluons are permanently confined inside hadrons — you never see a free gluon. QCD describes them exactly. The strong force does not reach beyond the nucleus.",
      zh: "胶子被永久禁闭在强子内部——你永远看不到自由胶子。量子色动力学（QCD）精确描述它们。强力不会延伸到原子核之外。",
    },
    color: C.leaf500,
  },
  {
    id: "higgs",
    symbol: "H",
    zone: "in",
    category: "boson",
    spin: "0",
    mass: { en: "125.1 GeV/c²", zh: "125.1 GeV/c²" },
    role: {
      en: "Gives mass to quarks, electrons, and W/Z bosons via the Higgs field. Without it, particles would be massless, chemistry impossible, stars non-existent.",
      zh: "通过希格斯场赋予夸克、电子和W/Z玻色子质量。没有它，粒子将是无质量的，化学不可能存在，恒星也将不复存在。",
    },
    philosophy: {
      en: "Confirmed at the LHC in 2012. The Higgs completes the Standard Model's account of mass. Every particle's inertia, every atom's stability — ultimately traced here.",
      zh: "2012年在大型强子对撞机得到证实。希格斯完成了标准模型对质量的描述。每个粒子的惯性、每个原子的稳定性——最终都可追溯于此。",
    },
    color: C.gold400,
  },
  {
    id: "gravity_weak",
    symbol: "grav",
    zone: "in",
    category: "gravity",
    spin: "2*",
    mass: { en: "massless (weak field)", zh: "无质量（弱场）" },
    role: {
      en: "Holds you to the Earth; shapes planets, stars, orbits. In the weak-field, slow-motion regime: general relativity is a complete, precise description.",
      zh: "将你束缚在地球上；塑造行星、恒星、轨道。在弱场、慢速运动范围内：广义相对论是一个完整、精确的描述。",
    },
    philosophy: {
      en: "At everyday scales, gravity is fully described by GR. The quantum theory of gravity (a graviton) remains unknown — but this matters only near black hole singularities or at the Planck scale, not here.",
      zh: "在日常尺度上，引力由广义相对论完整描述。引力的量子理论（引力子）尚未完成——但这只在黑洞奇点附近或普朗克尺度才重要，在日常生活中并不如此。",
    },
    color: C.leaf400,
  },
  /* ── IN: heavier generations (present but not in ordinary matter) ─────── */
  {
    id: "charm_strange",
    symbol: "c/s",
    zone: "in",
    category: "quark",
    spin: "½",
    mass: { en: "1.27 GeV / 96 MeV", zh: "1.27 GeV / 96 MeV" },
    role: {
      en: "Second-generation quarks. Appear in cosmic rays, particle accelerators, some nuclear reactions — not in stable matter around you, but part of the same complete framework.",
      zh: "第二代夸克。出现在宇宙射线、粒子加速器、某些核反应中——不在你周围的稳定物质中，但属于同一个完整框架。",
    },
    philosophy: {
      en: "The heavier quark generations obey the same QCD rules as up/down. Their existence (three families) is fully catalogued; the reason for three generations is one of the few open questions within the Standard Model.",
      zh: "较重的夸克世代遵循与上/下夸克相同的QCD规则。它们的存在（三个家族）已被完整记录；为何存在三代是标准模型内少数几个开放问题之一。",
    },
    color: C.iris500,
  },
  {
    id: "top_bottom",
    symbol: "t/b",
    zone: "in",
    category: "quark",
    spin: "½",
    mass: { en: "173 GeV / 4.18 GeV", zh: "173 GeV / 4.18 GeV" },
    role: {
      en: "Third-generation quarks. Top quark decays before forming hadrons. Bottom quark forms B mesons studied at colliders. Present in the early universe and extreme conditions.",
      zh: "第三代夸克。顶夸克在形成强子前就会衰变。底夸克形成在对撞机研究的B介子。存在于早期宇宙和极端条件中。",
    },
    philosophy: {
      en: "Also fully described by the Standard Model — no unknown physics here either. The extreme mass of the top quark (~173 GeV) is a verified fact, not a mystery.",
      zh: "同样由标准模型完整描述——这里也没有未知物理。顶夸克的极大质量（约173 GeV）是一个已验证的事实，不是谜。",
    },
    color: C.iris500,
  },
  {
    id: "wz",
    symbol: "W±/Z",
    zone: "in",
    category: "boson",
    spin: "1",
    mass: { en: "80/91 GeV/c²", zh: "80/91 GeV/c²" },
    role: {
      en: "Mediates the weak nuclear force — beta decay, radioactive transmutation, and the fusion reactions that power the Sun.",
      zh: "介导弱核力——β衰变、放射性嬗变，以及为太阳提供能量的聚变反应。",
    },
    philosophy: {
      en: "The W and Z bosons are massive — they acquire mass via the Higgs mechanism. Discovered at CERN 1983. The electroweak theory (Glashow–Salam–Weinberg) is complete and verified.",
      zh: "W和Z玻色子有质量——通过希格斯机制获得质量。1983年在欧洲核子研究中心发现。电弱理论（格拉肖–萨拉姆–温伯格）已完整并经过验证。",
    },
    color: C.leaf500,
  },
  {
    id: "mu_tau",
    symbol: "μ/τ",
    zone: "in",
    category: "lepton",
    spin: "½",
    mass: { en: "106 MeV / 1.78 GeV", zh: "106 MeV / 1.78 GeV" },
    role: {
      en: "Heavier cousins of the electron. Unstable; appear in cosmic rays and accelerators. Muons penetrate deep into matter — useful in muon tomography.",
      zh: "电子的较重同类。不稳定；出现在宇宙射线和加速器中。μ子能深入穿透物质——在μ子成像中很有用。",
    },
    philosophy: {
      en: "Both fully described by the Standard Model. The muon's anomalous magnetic moment (g−2) is a possible tension with theory, under active investigation — a potential hint of new physics beyond the Standard Model.",
      zh: "两者均由标准模型完整描述。μ子的反常磁矩（g-2）可能与理论存在张力，正在积极研究中——可能是超出标准模型的新物理迹象。",
    },
    color: C.flux400,
  },
  /* ── OUT: the open mysteries ──────────────────────────────────────────── */
  {
    id: "dark_matter",
    symbol: "DM",
    zone: "out",
    category: "mystery",
    spin: "?",
    mass: { en: "unknown", zh: "未知" },
    role: {
      en: "Inferred from galaxy rotation curves, gravitational lensing, and the CMB. Constitutes ~27% of the universe's energy. Does not interact electromagnetically — we cannot see it.",
      zh: "从星系旋转曲线、引力透镜和宇宙微波背景推断。构成宇宙能量的约27%。不通过电磁力相互作用——我们无法看到它。",
    },
    philosophy: {
      en: "Dark matter is genuine physics — observed gravitationally, named 'dark' only because it emits no light. Its particle identity is an open question. It does not affect chemistry or everyday life directly.",
      zh: "暗物质是真实的物理现象——通过引力观测到，之所以称为'暗'只是因为它不发光。其粒子特性是一个开放问题。它不直接影响化学或日常生活。",
    },
    color: C.plasm500,
  },
  {
    id: "dark_energy",
    symbol: "Λ",
    zone: "out",
    category: "mystery",
    spin: "—",
    mass: { en: "—", zh: "—" },
    role: {
      en: "Drives the accelerating expansion of the universe. Corresponds to the cosmological constant Λ. ~68% of the universe's energy-density.",
      zh: "驱动宇宙的加速膨胀。对应于宇宙学常数Λ。约占宇宙能量密度的68%。",
    },
    philosophy: {
      en: "Dark energy's origin is deeply mysterious. The cosmological constant problem — why Λ is so small — is one of the greatest unsolved problems in physics. Not relevant to everyday scales.",
      zh: "暗能量的起源极为神秘。宇宙学常数问题——为何Λ如此小——是物理学中最大的未解决问题之一。与日常尺度无关。",
    },
    color: C.plasm400,
  },
  {
    id: "quantum_gravity",
    symbol: "QG",
    zone: "out",
    category: "mystery",
    spin: "2?",
    mass: { en: "massless?", zh: "无质量？" },
    role: {
      en: "The reconciliation of quantum mechanics with general relativity. Becomes important only near the Planck scale (~10⁻³⁵ m) or inside black hole singularities.",
      zh: "量子力学与广义相对论的调和。仅在普朗克尺度附近（约10⁻³⁵米）或黑洞奇点内部变得重要。",
    },
    philosophy: {
      en: "The graviton — the hypothetical quantum of gravity — has never been detected. String theory and loop quantum gravity are competing frameworks. Irrelevant to every human-scale process.",
      zh: "引力子——假想的引力量子——从未被探测到。弦理论和圈量子引力是相互竞争的框架。与每一个人类尺度的过程无关。",
    },
    color: C.plasm500,
  },
  {
    id: "early_universe",
    symbol: "t→0",
    zone: "out",
    category: "mystery",
    spin: "—",
    mass: { en: "—", zh: "—" },
    role: {
      en: "The conditions of the Big Bang, inflation, baryogenesis (why more matter than antimatter). Temperatures and densities where the Standard Model breaks down.",
      zh: "大爆炸、暴胀、重子发生的条件（为何物质多于反物质）。标准模型失效的温度和密度。",
    },
    philosophy: {
      en: "The early universe is a regime where new physics is clearly needed. What happened at t=0 is genuinely unknown. This is where cosmology and particle physics are still incomplete.",
      zh: "早期宇宙是明显需要新物理学的领域。t=0时发生了什么确实未知。这是宇宙学和粒子物理学仍不完整的地方。",
    },
    color: C.plasm400,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS: Two-zone orbital diagram
   IN zone: warm gold ring (everyday matter) — particles orbit
   OUT zone: plasm outer ring (mysteries) — particles hover at periphery
═══════════════════════════════════════════════════════════════════════════ */
interface ZoneCanvasProps {
  particles: Particle[];
  selectedId: string | null;
  lang: "en" | "zh";
  onSelect: (id: string) => void;
}

function ZoneCanvas({ particles, selectedId, lang, onSelect }: ZoneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef  = useRef(0);
  const rafRef    = useRef(0);
  const lastRef   = useRef(0);
  const hitAreasRef = useRef<{ id: string; x: number; y: number; r: number }[]>([]);

  // Assign deterministic positions to each particle
  const inParticles  = particles.filter((p) => p.zone === "in");
  const outParticles = particles.filter((p) => p.zone === "out");

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, W: number, H: number, phase: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.void950;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.min(W, H) / 2 - 20;

      // Zone radii
      const innerR = maxR * 0.42; // IN zone edge
      const outerR = maxR * 0.85; // OUT zone

      /* ── Zone fills ── */
      // IN zone (gold aura)
      const inGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
      inGrad.addColorStop(0,   C.gold500 + "08");
      inGrad.addColorStop(0.6, C.gold500 + "05");
      inGrad.addColorStop(1,   C.gold500 + "18");
      ctx.fillStyle = inGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();

      // IN ring stroke
      ctx.save();
      const pulse = 0.55 + 0.45 * Math.sin(phase * 0.6);
      ctx.strokeStyle = C.gold500 + "44";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = pulse;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // OUT zone (plasm ring)
      const outGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      outGrad.addColorStop(0,   C.plasm500 + "00");
      outGrad.addColorStop(0.5, C.plasm500 + "05");
      outGrad.addColorStop(1,   C.plasm500 + "15");
      ctx.fillStyle = outGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.strokeStyle = C.plasm500 + "44";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = pulse;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* ── Zone labels ── */
      ctx.save();
      ctx.font = "bold 8px 'JetBrains Mono', monospace";
      ctx.fillStyle = C.gold500 + "bb";
      ctx.textAlign = "center";
      ctx.fillText(lang === "zh" ? "日常生活 · 已知完整" : "EVERYDAY LIFE · COMPLETE", cx, cy - innerR + 13);
      ctx.restore();

      ctx.save();
      ctx.font = "bold 7px 'JetBrains Mono', monospace";
      ctx.fillStyle = C.plasm400 + "99";
      ctx.textAlign = "center";
      ctx.fillText(lang === "zh" ? "极端条件 · 开放谜题" : "EXTREMES · OPEN MYSTERIES", cx, cy - outerR + 12);
      ctx.restore();

      /* ── Centre glyph ── */
      // Tiny atom-like nucleus at centre
      const nucR = 6;
      const nucGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucR * 2);
      nucGrad.addColorStop(0, C.gold400 + "ff");
      nucGrad.addColorStop(1, C.gold500 + "00");
      ctx.fillStyle = nucGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, nucR * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.gold500;
      ctx.beginPath();
      ctx.arc(cx, cy, nucR, 0, Math.PI * 2);
      ctx.fill();

      /* ── Place particles ── */
      const newHits: { id: string; x: number; y: number; r: number }[] = [];

      // IN particles: arranged in the inner zone
      inParticles.forEach((p, i) => {
        const total   = inParticles.length;
        // deterministic angle: evenly spaced + slow drift
        const baseAngle = (i / total) * Math.PI * 2 + seeded(i, 1) * 0.4;
        const drift     = phase * (0.08 + seeded(i, 7) * 0.04) * (seeded(i, 9) > 0.5 ? 1 : -1);
        const angle     = baseAngle + drift;
        // radius: vary slightly within inner zone
        const radFrac = 0.4 + seeded(i, 2) * 0.55;
        const radius  = innerR * radFrac;

        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const nodeR = 14;

        const isSelected = p.id === selectedId;

        // Glow behind node
        if (isSelected) {
          const glowPulse = 0.6 + 0.4 * Math.sin(phase * 3.2);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, nodeR * 3.2);
          glow.addColorStop(0, p.color + "55");
          glow.addColorStop(1, p.color + "00");
          ctx.save();
          ctx.globalAlpha = glowPulse;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, nodeR * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Node circle
        const nodeGrad = ctx.createRadialGradient(x - nodeR * 0.3, y - nodeR * 0.3, 1, x, y, nodeR);
        nodeGrad.addColorStop(0, p.color + (isSelected ? "ff" : "cc"));
        nodeGrad.addColorStop(1, p.color + (isSelected ? "88" : "44"));
        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.save();
        ctx.strokeStyle = isSelected ? p.color + "ff" : p.color + "66";
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Symbol text
        ctx.save();
        ctx.font = `bold ${lang === "zh" ? "8" : "9"}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isSelected ? C.ink50 : C.ink300;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, x, y);
        ctx.restore();

        newHits.push({ id: p.id, x, y, r: nodeR + 4 });
      });

      // OUT particles: in the outer ring
      outParticles.forEach((p, i) => {
        const total   = outParticles.length;
        const baseAngle = (i / total) * Math.PI * 2 + seeded(i + 100, 1) * 0.8;
        const drift     = phase * 0.04 * (i % 2 === 0 ? 1 : -1);
        const angle     = baseAngle + drift;
        const radius    = innerR + (outerR - innerR) * (0.35 + seeded(i, 5) * 0.55);

        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const nodeR = 16;

        const isSelected = p.id === selectedId;

        if (isSelected) {
          const glowPulse = 0.5 + 0.5 * Math.sin(phase * 2.8);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, nodeR * 3.5);
          glow.addColorStop(0, p.color + "44");
          glow.addColorStop(1, p.color + "00");
          ctx.save();
          ctx.globalAlpha = glowPulse;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, nodeR * 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Misty / faded fill for mystery particles
        const alpha = isSelected ? "88" : "44";
        const nodeGrad = ctx.createRadialGradient(x, y, 0, x, y, nodeR);
        nodeGrad.addColorStop(0, p.color + alpha);
        nodeGrad.addColorStop(1, p.color + "11");
        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fill();

        // Dashed border — unknown / mysterious
        ctx.save();
        ctx.strokeStyle = isSelected ? p.color + "cc" : p.color + "55";
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        ctx.save();
        ctx.font = `bold ${lang === "zh" ? "8" : "9"}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isSelected ? p.color : p.color + "aa";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, x, y);
        ctx.restore();

        newHits.push({ id: p.id, x, y, r: nodeR + 5 });
      });

      // Floating ambient particles (stars in the void)
      for (let si = 0; si < 30; si++) {
        const sx = seeded(si, 11) * W;
        const sy = seeded(si, 22) * H;
        const sr = 0.5 + seeded(si, 33) * 1;
        const flicker = 0.15 + 0.35 * Math.sin(phase * 1.2 + si * 0.7);
        // skip if inside inner zone
        const dist = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
        if (dist < innerR * 0.25) continue;
        ctx.save();
        ctx.globalAlpha = flicker;
        ctx.fillStyle = C.ink300;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      hitAreasRef.current = newHits;
    },
    [inParticles, outParticles, selectedId, lang]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function tick(ts: number) {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      phaseRef.current += dt;

      const ctx = canvas!.getContext("2d");
      if (ctx) {
        const rect = canvas!.getBoundingClientRect();
        draw(ctx, rect.width, rect.height, phaseRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [draw]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const hit of hitAreasRef.current) {
      const dist = Math.sqrt((mx - hit.x) ** 2 + (my - hit.y) ** 2);
      if (dist <= hit.r) {
        onSelect(hit.id);
        return;
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="block w-full rounded-2xl cursor-pointer"
      style={{ height: 420 }}
      aria-label={
        lang === "zh"
          ? "核心理论粒子图，分为日常生活区域（金色）和极端谜题区域（玫红色）。点击粒子查看详情。"
          : "Core Theory particle diagram divided into everyday life zone (gold) and extreme mysteries zone (magenta). Click a particle for details."
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY LEGEND ROW
═══════════════════════════════════════════════════════════════════════════ */
function CategoryLegend({ lang }: { lang: "en" | "zh" }) {
  const items = [
    { color: C.iris500, en: "Quarks", zh: "夸克" },
    { color: C.flux500, en: "Leptons", zh: "轻子" },
    { color: C.leaf500, en: "Force carriers", zh: "力载体" },
    { color: C.gold500, en: "Higgs / gravity", zh: "希格斯/引力" },
    { color: C.plasm500, en: "Open mysteries", zh: "开放谜题" },
  ];
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {items.map((it) => (
        <div key={it.en} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: it.color }} />
          <span
            className={`font-mono text-[0.58rem] tracking-wide ${lang === "zh" ? "zh" : ""}`}
            style={{ color: it.color + "cc" }}
          >
            {lang === "zh" ? it.zh : it.en}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ZONE TABS — filter to IN / OUT / ALL
═══════════════════════════════════════════════════════════════════════════ */
type ZoneFilter = "all" | "in" | "out";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function CoreTheoryViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const [selectedId, setSelectedId] = useState<string | null>("electron");
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>("all");
  const [caveatOpen, setCaveatOpen] = useState(false);

  const selectedParticle = PARTICLES.find((p) => p.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  // Zone colour helpers
  function zoneColor(z: Zone) {
    return z === "in" ? C.gold500 : C.plasm500;
  }
  function zoneLabel(z: Zone) {
    if (z === "in")
      return { en: "IN · Core Theory", zh: "内圈 · 核心理论" };
    return { en: "OUT · Extreme / Unknown", zh: "外圈 · 极端 / 未知" };
  }

  // Category label
  const catLabel: Record<Category, { en: string; zh: string }> = {
    quark:   { en: "Quark", zh: "夸克" },
    lepton:  { en: "Lepton", zh: "轻子" },
    boson:   { en: "Force-carrying boson", zh: "力载玻色子" },
    gravity: { en: "Gravity (weak field)", zh: "引力（弱场）" },
    mystery: { en: "Open mystery", zh: "开放谜题" },
  };

  return (
    <div className="w-full space-y-10">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1" style={{ color: C.gold500 }}>
          {L("Theme 03 · The Core Theory", "主题 03 · 核心理论")}
        </p>
        <h3
          className={`display text-2xl md:text-3xl leading-tight mb-2 spark-text ${lang === "zh" ? "zh" : ""}`}
        >
          {L(
            "The Physics of Everyday Life — Complete",
            "日常生活的物理学——已完整"
          )}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-3 ${lang === "zh" ? "zh" : ""}`}
          style={{
            color: C.ink300,
            fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
          }}
        >
          {L(
            "Sean Carroll's core claim: the laws governing the particles and forces that make up people, planets, and chemistry are completely known. The Standard Model of particle physics — quarks, electrons, photons, gluons, the Higgs — plus general relativity in its weak-field regime form a closed, consistent description of everything you will ever encounter. No new forces or substances lurk at everyday scales. This has a radical philosophical consequence: there is no room in this framework for a soul-stuff or a mind-force that acts outside of physics.",
            "肖恩·卡罗尔的核心主张：支配构成人类、行星和化学的粒子与力的定律已被完整认识。粒子物理学的标准模型——夸克、电子、光子、胶子、希格斯——加上弱场范围内的广义相对论，构成了对你所能遇到的一切事物的封闭、自洽描述。在日常尺度上没有潜伏的新力或物质。这具有一个激进的哲学后果：这个框架中没有灵魂实体或在物理之外运作的心灵力量的容身之地。"
          )}
        </p>
        <div className="rule-flux h-px rounded" />
      </div>

      {/* ── ZONE FILTER TABS ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="label-mono" style={{ color: C.ink500 }}>
          {L("Show", "显示")}
        </span>
        {([
          { key: "all",  en: "All particles", zh: "全部粒子" },
          { key: "in",   en: "IN — Everyday complete", zh: "内圈 — 日常已知" },
          { key: "out",  en: "OUT — Open mysteries", zh: "外圈 — 开放谜题" },
        ] as { key: ZoneFilter; en: string; zh: string }[]).map((tab) => {
          const active = zoneFilter === tab.key;
          const col = tab.key === "out" ? C.plasm500 : tab.key === "in" ? C.gold500 : C.iris500;
          return (
            <button
              key={tab.key}
              onClick={() => setZoneFilter(tab.key)}
              className={`px-3 py-1 rounded-lg font-mono text-[0.62rem] tracking-wide border transition-all duration-200 ${lang === "zh" ? "zh" : ""}`}
              style={{
                borderColor: active ? col : `${C.ink500}30`,
                background:  active ? `${col}15` : "transparent",
                color:       active ? col : C.ink500,
                boxShadow:   active ? `0 0 12px -4px ${col}55` : undefined,
              }}
            >
              {lang === "zh" ? tab.zh : tab.en}
            </button>
          );
        })}
      </div>

      {/* ── CANVAS DIAGRAM ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <CategoryLegend lang={lang} />

        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            background: C.void950,
            borderColor: `${C.gold500}18`,
            boxShadow: `0 4px 60px -20px rgba(0,0,0,0.7), 0 0 80px -40px ${C.gold500}22`,
          }}
        >
          <ZoneCanvas
            particles={
              zoneFilter === "all"
                ? PARTICLES
                : PARTICLES.filter((p) => p.zone === zoneFilter)
            }
            selectedId={selectedId}
            lang={lang}
            onSelect={handleSelect}
          />
        </div>

        <div
          className={`text-[0.62rem] font-mono text-center ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink500 }}
        >
          {L(
            "Click any particle or force to explore its role in everyday life",
            "点击任意粒子或力，探索其在日常生活中的作用"
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL ─────────────────────────────────────────────── */}
      {selectedParticle && (
        <div
          key={selectedParticle.id + lang}
          className="panel rounded-2xl p-5 space-y-5 rise-in"
          style={{
            borderColor: `${selectedParticle.color}30`,
            boxShadow: `0 0 60px -24px ${selectedParticle.color}44`,
          }}
        >
          {/* header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p
                className="label-mono"
                style={{ color: selectedParticle.color, fontSize: "0.56rem" }}
              >
                {catLabel[selectedParticle.category][lang === "zh" ? "zh" : "en"]}
              </p>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono font-bold"
                  style={{
                    fontSize: "2.4rem",
                    lineHeight: 1,
                    color: selectedParticle.color,
                    textShadow: `0 0 28px ${selectedParticle.color}55`,
                  }}
                >
                  {selectedParticle.symbol}
                </span>
                <div className="space-y-0.5">
                  <p
                    className="font-mono text-[0.6rem]"
                    style={{ color: C.ink500 }}
                  >
                    {L("spin", "自旋")} {selectedParticle.spin}
                  </p>
                  <p
                    className="font-mono text-[0.6rem]"
                    style={{ color: C.ink500 }}
                  >
                    {L("mass:", "质量：")} {selectedParticle.mass[lang === "zh" ? "zh" : "en"]}
                  </p>
                </div>
              </div>
            </div>

            {/* Zone badge */}
            <div
              className={`rounded-xl px-4 py-2 flex flex-col items-end gap-1`}
              style={{
                background: `${zoneColor(selectedParticle.zone)}0c`,
                border: `1px solid ${zoneColor(selectedParticle.zone)}30`,
              }}
            >
              <span
                className="label-mono"
                style={{
                  color: zoneColor(selectedParticle.zone),
                  fontSize: "0.56rem",
                }}
              >
                {zoneLabel(selectedParticle.zone)[lang === "zh" ? "zh" : "en"]}
              </span>
              <span
                className="font-mono text-[1.6rem] leading-none font-bold"
                style={{ color: zoneColor(selectedParticle.zone) }}
              >
                {selectedParticle.zone === "in" ? "✓" : "?"}
              </span>
              <span
                className={`text-[0.58rem] font-mono ${lang === "zh" ? "zh" : ""}`}
                style={{ color: zoneColor(selectedParticle.zone) + "99" }}
              >
                {selectedParticle.zone === "in"
                  ? L("laws complete", "定律已完整")
                  : L("laws open", "定律未完整")}
              </span>
            </div>
          </div>

          {/* two-column: everyday role + philosophy */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* everyday role */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{
                background: `${selectedParticle.color}07`,
                border: `1px solid ${selectedParticle.color}20`,
              }}
            >
              <p
                className="label-mono"
                style={{ color: selectedParticle.color, fontSize: "0.56rem" }}
              >
                {L("Role in everyday life", "在日常生活中的作用")}
              </p>
              <p
                className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: C.ink300,
                  fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
                }}
              >
                {selectedParticle.role[lang === "zh" ? "zh" : "en"]}
              </p>
            </div>

            {/* philosophy */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{
                background:
                  selectedParticle.zone === "in"
                    ? `${C.gold500}06`
                    : `${C.plasm500}06`,
                border: `1px solid ${
                  selectedParticle.zone === "in" ? C.gold500 : C.plasm500
                }20`,
              }}
            >
              <p
                className="label-mono"
                style={{
                  color:
                    selectedParticle.zone === "in" ? C.gold400 : C.plasm400,
                  fontSize: "0.56rem",
                }}
              >
                {L("Philosophical implication", "哲学含义")}
              </p>
              <p
                className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: C.ink300,
                  fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
                }}
              >
                {selectedParticle.philosophy[lang === "zh" ? "zh" : "en"]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── THE "COMPLETE FOR EVERYDAY LIFE" CLAIM ─────────────────────── */}
      <div className="space-y-4">
        <p className="label-mono" style={{ color: C.ink500 }}>
          {L("Carroll's bold claim", "卡罗尔的大胆主张")}
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            className="panel rounded-xl p-5 space-y-3 flex flex-col panel-gold"
            style={{ borderColor: `${C.gold500}22` }}
          >
            <div className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 font-mono font-bold text-lg leading-none"
                style={{ color: C.gold500 }}
              >
                ✓
              </span>
              <h5
                className={`display text-[0.92rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.gold400 }}
              >
                {L(
                  "No gap for unknown forces",
                  "没有未知力量的空间"
                )}
              </h5>
            </div>
            <p
              className={`text-[0.71rem] leading-relaxed flex-1 ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
              }}
            >
              {L(
                "The Standard Model + GR account for every force that acts on matter at human scales. Precision measurements (electron magnetic moment to 12 significant figures; GPS corrections from GR) leave no experimental window for new forces at everyday energies. A soul-substance or vital force would have to interact with electrons and quarks — and those interactions are already fully mapped.",
                "标准模型加广义相对论说明了在人类尺度上作用于物质的每一种力。精密测量（电子磁矩精确到12位有效数字；GPS的广义相对论修正）在日常能量下没有留下新力的实验窗口。灵魂实体或生命力必须与电子和夸克相互作用——而这些相互作用已被完整描绘。"
              )}
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="panel rounded-xl p-5 space-y-3 flex flex-col panel-iris"
          >
            <div className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 font-mono font-bold text-lg leading-none"
                style={{ color: C.iris500 }}
              >
                ≠
              </span>
              <h5
                className={`display text-[0.92rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.iris400 }}
              >
                {L(
                  "Complete ≠ Simple",
                  "完整 ≠ 简单"
                )}
              </h5>
            </div>
            <p
              className={`text-[0.71rem] leading-relaxed flex-1 ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
              }}
            >
              {L(
                "Knowing all the laws does not mean being able to calculate everything. The equations governing chemistry, biology, and consciousness are exact but computationally intractable. 'Complete' refers to the underlying rules, not to derivability in practice. Emergence — complex behaviour from simple laws — is entirely consistent with Carroll's claim.",
                "了解所有定律并不意味着能够计算一切。支配化学、生物学和意识的方程式是精确的，但在计算上是难以处理的。'完整'指的是基本规则，而非实际上的可推导性。涌现——从简单定律产生的复杂行为——与卡罗尔的主张完全一致。"
              )}
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="panel rounded-xl p-5 space-y-3 flex flex-col panel-plasm"
          >
            <div className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 font-mono font-bold text-lg leading-none"
                style={{ color: C.plasm500 }}
              >
                ?
              </span>
              <h5
                className={`display text-[0.92rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.plasm400 }}
              >
                {L(
                  "The extremes remain open",
                  "极端情况仍是开放问题"
                )}
              </h5>
            </div>
            <p
              className={`text-[0.71rem] leading-relaxed flex-1 ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
              }}
            >
              {L(
                "Dark matter, dark energy, quantum gravity, the Big Bang — genuine open questions where new physics almost certainly exists. Carroll's claim is precisely scoped: the Core Theory is complete for everyday life, not for the cosmos at its edges. Intellectual honesty requires holding both truths simultaneously.",
                "暗物质、暗能量、量子引力、大爆炸——真正的开放问题，几乎可以肯定新物理学在这些领域存在。卡罗尔的主张有精确的界定：核心理论在日常生活中是完整的，而不是在宇宙的边缘。知识诚信要求同时持有这两个真理。"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── PHILOSOPHICAL CAVEAT ────────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: `${C.plasm500}28`,
          background: `${C.plasm500}05`,
        }}
      >
        <button
          onClick={() => setCaveatOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 transition-all"
          style={{ color: C.plasm400 }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[1rem]" aria-hidden="true">⚑</span>
            <span
              className={`label-mono ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.plasm400, letterSpacing: "0.2em" }}
            >
              {L(
                "Bold Claim — Physics Mainstream, Philosophically Contested",
                "大胆主张 — 物理主流，哲学上存争议"
              )}
            </span>
          </div>
          <span
            className="font-mono text-[0.8rem] transition-transform duration-300"
            style={{
              transform: caveatOpen ? "rotate(180deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▼
          </span>
        </button>

        {caveatOpen && (
          <div className="px-5 pb-5 space-y-4 rise-in">
            <p
              className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
              }}
            >
              {L(
                "Carroll's claim that the Core Theory is complete for everyday life is a strong but defensible reading of the physics. Here is what it does — and does not — assert:",
                "卡罗尔关于核心理论对日常生活完整的主张是对物理学的一个强有力但可辩护的解读。以下是它主张的内容——以及不主张的内容："
              )}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: { en: "What the physics says", zh: "物理学的说法" },
                  body: {
                    en: "No experiment at everyday energies (up to ~TeV) has revealed any force or particle beyond the Standard Model. The framework is consistent, renormalizable, and predictive. This is empirical consensus, not mere opinion.",
                    zh: "在日常能量（最高约太电子伏特）下，没有任何实验揭示出超出标准模型的力或粒子。该框架是自洽的、可重整化的、有预测性的。这是经验上的共识，不仅仅是观点。",
                  },
                  color: C.gold500,
                  icon: "✓",
                },
                {
                  title: { en: "Where philosophers push back", zh: "哲学家的反驳点" },
                  body: {
                    en: "Critics note that 'complete at everyday energies' does not settle the hard problem of consciousness, the nature of qualia, or the measurement problem in quantum mechanics. These may require new conceptual frameworks even if no new particles are found.",
                    zh: "批评者指出，'在日常能量下完整'并不能解决意识的难问题、感质的本质，或量子力学中的测量问题。即使没有发现新粒子，这些问题也可能需要新的概念框架。",
                  },
                  color: C.plasm500,
                  icon: "?",
                },
                {
                  title: { en: "The soul / vital force argument", zh: "灵魂/生命力的论证" },
                  body: {
                    en: "If a soul or non-physical mind causally acts on the body, it must push electrons and atoms around. But QED tracks every electromagnetic interaction with 10-digit precision — there is no experimental room for an extra push. This is Carroll's sharpest argument and it is physics-grounded.",
                    zh: "如果灵魂或非物质心灵对身体产生因果作用，它必须推动电子和原子移动。但量子电动力学以10位数精度追踪每一个电磁相互作用——没有额外推力的实验空间。这是卡罗尔最锐利的论证，且以物理学为根基。",
                  },
                  color: C.flux500,
                  icon: "◈",
                },
                {
                  title: { en: "What remains genuinely open", zh: "真正开放的问题" },
                  body: {
                    en: "Why these particular equations? Why do the constants have these values (fine-tuning)? What is the correct interpretation of quantum mechanics (many worlds, Copenhagen, pilot wave)? These are deep open questions that the Core Theory does not close.",
                    zh: "为何是这些特定方程式？为何常数具有这些数值（精细调节）？量子力学的正确诠释是什么（多世界、哥本哈根、导波）？这些是核心理论未能解决的深层开放问题。",
                  },
                  color: C.iris500,
                  icon: "∞",
                },
              ].map((item) => (
                <div
                  key={item.title.en}
                  className="rounded-lg p-3.5 space-y-1.5"
                  style={{
                    background: `${item.color}0c`,
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono font-bold text-sm"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </span>
                    <p
                      className="font-mono text-[0.62rem] tracking-wide font-bold"
                      style={{ color: item.color }}
                    >
                      {item.title[lang === "zh" ? "zh" : "en"]}
                    </p>
                  </div>
                  <p
                    className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
                    }}
                  >
                    {item.body[lang === "zh" ? "zh" : "en"]}
                  </p>
                </div>
              ))}
            </div>

            <p
              className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.plasm400,
                fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
                borderLeft: `2px solid ${C.plasm500}44`,
                paddingLeft: "0.8rem",
              }}
            >
              {L(
                "The Core Theory is not the end of curiosity. It is a baseline of certainty against which open questions become sharper. Knowing what is settled is what makes genuine mystery legible.",
                "核心理论不是好奇心的终点。它是一个确定性的基线，使开放问题变得更加清晰。知道什么已经确定，才能使真正的谜题变得可读。"
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── CLOSING OBSERVATION ─────────────────────────────────────────── */}
      <div
        className="rounded-xl px-5 py-4 flex gap-3"
        style={{
          background: `${C.gold500}05`,
          border: `1px solid ${C.gold500}14`,
        }}
      >
        <span
          style={{ color: C.gold400, fontSize: "0.9rem", flexShrink: 0, lineHeight: 1.5 }}
        >
          ◇
        </span>
        <p
          className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{
            color: C.ink300,
            fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
          }}
        >
          {L(
            "The Standard Model is one of the greatest intellectual achievements in human history. Built over fifty years of experiment and theory, it describes every particle interaction that has ever been measured in a laboratory. Carroll's point is not that physics is finished — dark matter, quantum gravity, and the arrow of time remain genuinely open. His point is that the slice of physics governing your daily life — your body, your brain, the atoms in a tree — is settled. That settled core is the foundation from which the still-open questions can be asked with precision.",
            "标准模型是人类历史上最伟大的智识成就之一。经过五十年的实验和理论建构，它描述了实验室中有史以来测量的每一次粒子相互作用。卡罗尔的论点不是说物理学已经完成——暗物质、量子引力和时间之箭仍是真正开放的问题。他的论点是，支配你日常生活的那一片物理学——你的身体、你的大脑、树木中的原子——已经确定。那个已确定的核心是从中可以精确地提出仍然开放的问题的基础。"
          )}
        </p>
      </div>

    </div>
  );
}
