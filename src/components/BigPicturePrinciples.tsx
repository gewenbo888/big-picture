"use client";

import { useState } from "react";
import { useLang } from "./lang";

/* ─── types ──────────────────────────────────────────────────────────────── */

type ClusterId =
  | "poetic-naturalism"
  | "how-we-know"
  | "physics"
  | "time-entropy"
  | "emergence"
  | "life-complexity"
  | "mind-consciousness"
  | "free-will-meaning";

type Idea = {
  id: number;
  cluster: ClusterId;
  contested?: true;
  principle: { en: string; zh: string };
  gloss: { en: string; zh: string };
};

/* ─── cluster definitions ────────────────────────────────────────────────── */

type ClusterDef = {
  id: ClusterId;
  label: { en: string; zh: string };
  accent: string;
  chipActive: string;
  chipText: string;
  chipBorder: string;
  cardAccent: string;
  dotColor: string;
  numberColor: string;
};

const CLUSTERS: ClusterDef[] = [
  {
    id: "poetic-naturalism",
    label: { en: "Poetic Naturalism", zh: "诗性自然主义" },
    accent: "#ff6b5c",
    chipActive: "bg-flux-500/20",
    chipText: "text-flux-400",
    chipBorder: "border-flux-500/50",
    cardAccent: "border-l-flux-500",
    dotColor: "bg-flux-400",
    numberColor: "text-flux-500",
  },
  {
    id: "how-we-know",
    label: { en: "How We Know", zh: "我们如何知道" },
    accent: "#8b7bff",
    chipActive: "bg-iris-500/20",
    chipText: "text-iris-400",
    chipBorder: "border-iris-500/50",
    cardAccent: "border-l-iris-500",
    dotColor: "bg-iris-400",
    numberColor: "text-iris-500",
  },
  {
    id: "physics",
    label: { en: "Physics & Core Theory", zh: "物理与核心理论" },
    accent: "#f5b942",
    chipActive: "bg-gold-500/20",
    chipText: "text-gold-400",
    chipBorder: "border-gold-500/50",
    cardAccent: "border-l-gold-500",
    dotColor: "bg-gold-400",
    numberColor: "text-gold-500",
  },
  {
    id: "time-entropy",
    label: { en: "Time & Entropy", zh: "时间与熵" },
    accent: "#ff4fa3",
    chipActive: "bg-plasm-500/20",
    chipText: "text-plasm-400",
    chipBorder: "border-plasm-500/50",
    cardAccent: "border-l-plasm-500",
    dotColor: "bg-plasm-400",
    numberColor: "text-plasm-500",
  },
  {
    id: "emergence",
    label: { en: "Emergence & Layers", zh: "涌现与层级" },
    accent: "#2dd4bf",
    chipActive: "bg-leaf-500/20",
    chipText: "text-leaf-400",
    chipBorder: "border-leaf-500/50",
    cardAccent: "border-l-leaf-500",
    dotColor: "bg-leaf-400",
    numberColor: "text-leaf-500",
  },
  {
    id: "life-complexity",
    label: { en: "Life & Complexity", zh: "生命与复杂性" },
    accent: "#6ee7d6",
    chipActive: "bg-leaf-400/20",
    chipText: "text-leaf-400",
    chipBorder: "border-leaf-400/50",
    cardAccent: "border-l-leaf-400",
    dotColor: "bg-leaf-500",
    numberColor: "text-leaf-400",
  },
  {
    id: "mind-consciousness",
    label: { en: "Mind & Consciousness", zh: "心灵与意识" },
    accent: "#b3a8ff",
    chipActive: "bg-iris-400/20",
    chipText: "text-iris-400",
    chipBorder: "border-iris-400/50",
    cardAccent: "border-l-iris-400",
    dotColor: "bg-iris-500",
    numberColor: "text-iris-400",
  },
  {
    id: "free-will-meaning",
    label: { en: "Free Will & Meaning", zh: "自由意志与意义" },
    accent: "#ffd27a",
    chipActive: "bg-gold-400/20",
    chipText: "text-gold-300",
    chipBorder: "border-gold-400/50",
    cardAccent: "border-l-gold-400",
    dotColor: "bg-gold-500",
    numberColor: "text-gold-400",
  },
];

/* ─── the 32 ideas ───────────────────────────────────────────────────────── */

const IDEAS: Idea[] = [
  /* ── POETIC NATURALISM ── */
  {
    id: 1,
    cluster: "poetic-naturalism",
    principle: {
      en: "One world, many true stories.",
      zh: "一个世界，多种真实叙述。",
    },
    gloss: {
      en: "Physics, chemistry, biology, and ethics all describe the same underlying reality — none cancels the others out.",
      zh: "物理、化学、生物学与伦理学描述同一个底层现实——任何一种都无法取消其他。",
    },
  },
  {
    id: 2,
    cluster: "poetic-naturalism",
    principle: {
      en: "Descriptions are valid within their domain.",
      zh: "描述在其适用领域内有效。",
    },
    gloss: {
      en: "Calling water 'H₂O' and calling it 'refreshing' are both correct — they operate at different levels of description.",
      zh: "称水为「H₂O」和称它「解渴」都是正确的——它们在不同层次的描述上运作。",
    },
  },
  {
    id: 3,
    cluster: "poetic-naturalism",
    principle: {
      en: "No separate spiritual realm is needed.",
      zh: "不需要单独的灵性领域。",
    },
    gloss: {
      en: "A naturalist universe is not a cold, diminished one — awe, beauty, and meaning arise from the same matter that makes stars.",
      zh: "自然主义的宇宙并不冷漠或贫乏——敬畏、美与意义从构成星辰的同一物质中涌现。",
    },
  },
  {
    id: 4,
    cluster: "poetic-naturalism",
    principle: {
      en: "You are atoms AND a person.",
      zh: "你既是原子，也是一个人。",
    },
    gloss: {
      en: "The atomic description is complete at its level; the personal description is equally complete at its level — neither erases the other.",
      zh: "原子层次的描述在其层次上是完整的；个人层次的描述同样完整——两者互不抹消。",
    },
  },
  {
    id: 5,
    cluster: "poetic-naturalism",
    principle: {
      en: "\"Poetic\" is not decoration — it is essential.",
      zh: "「诗性」不是装饰，而是本质。",
    },
    gloss: {
      en: "The humanistic vocabulary — purpose, love, beauty — earns its keep by capturing patterns that particle physics cannot.",
      zh: "人文词汇——目的、爱、美——凭借捕捉粒子物理学无法捕捉的规律而赢得其地位。",
    },
  },

  /* ── HOW WE KNOW ── */
  {
    id: 6,
    cluster: "how-we-know",
    principle: {
      en: "Belief is a credence, not a binary.",
      zh: "信念是概率，不是非此即彼。",
    },
    gloss: {
      en: "Holding a belief really means assigning it a probability; certainty is always an approximation.",
      zh: "持有一个信念实际上意味着给它分配一个概率；确定性永远只是近似。",
    },
  },
  {
    id: 7,
    cluster: "how-we-know",
    principle: {
      en: "Update on evidence — Bayes is the discipline.",
      zh: "依据证据更新——贝叶斯是规范。",
    },
    gloss: {
      en: "Good reasoning is not about having the right opinions; it is about shifting them by exactly the right amount when new data arrives.",
      zh: "好的推理不在于拥有正确观点，而在于当新数据到来时恰好按正确幅度调整它们。",
    },
  },
  {
    id: 8,
    cluster: "how-we-know",
    principle: {
      en: "Planets of belief, not a flat map.",
      zh: "信念的星球，而非平面地图。",
    },
    gloss: {
      en: "Our picture of the world is a network of mutually reinforcing credences, not a checklist of independent facts.",
      zh: "我们对世界的认识是一个相互强化的概率网络，而非一份独立事实的清单。",
    },
  },
  {
    id: 9,
    cluster: "how-we-know",
    principle: {
      en: "Abduction: reason to the best explanation.",
      zh: "溯因推理：推导至最佳解释。",
    },
    gloss: {
      en: "Science does not prove — it selects the hypothesis that best fits all the evidence while asking the fewest of reality.",
      zh: "科学不是证明——它选择在以最少前提的情况下最契合所有证据的假说。",
    },
  },
  {
    id: 10,
    cluster: "how-we-know",
    principle: {
      en: "No certainty — only calibrated confidence.",
      zh: "没有确定性——只有经过校准的信心。",
    },
    gloss: {
      en: "The goal is not to be certain but to be wrong in ways you can measure and correct.",
      zh: "目标不是确定无误，而是以可测量、可纠正的方式犯错。",
    },
  },

  /* ── PHYSICS & CORE THEORY ── */
  {
    id: 11,
    cluster: "physics",
    principle: {
      en: "The laws of everyday life are complete.",
      zh: "日常生活的物理定律已经完备。",
    },
    gloss: {
      en: "Quantum field theory plus weak-field gravity already contain every force that acts on you today — no undiscovered physics governs your morning.",
      zh: "量子场论加上弱场引力已经包含了今天作用于你的所有力——没有未发现的物理学支配你的早晨。",
    },
  },
  {
    id: 12,
    cluster: "physics",
    principle: {
      en: "No room for souls in the Core Theory.",
      zh: "核心理论中没有灵魂的位置。",
    },
    gloss: {
      en: "If a non-material soul influenced the body, it would alter the electrons in neurons — and we would have detected that deviation long ago.",
      zh: "如果非物质灵魂影响身体，它会改变神经元中的电子——而我们早就会探测到这种偏差。",
    },
  },
  {
    id: 13,
    cluster: "physics",
    principle: {
      en: "The mysteries live at extremes, not in us.",
      zh: "谜题存在于极端之处，而非在我们之中。",
    },
    gloss: {
      en: "Dark matter, quantum gravity, the origin of the Big Bang — these are open; but they do not reach into the chemistry of a human cell.",
      zh: "暗物质、量子引力、大爆炸的起源——这些是开放问题；但它们无法渗入人类细胞的化学。",
    },
  },
  {
    id: 14,
    cluster: "physics",
    principle: {
      en: "Fields, not particles, are the fundamental stuff.",
      zh: "场，而非粒子，是最基本的存在。",
    },
    gloss: {
      en: "What we call a particle is a localized excitation of a quantum field — the field itself spans the whole universe.",
      zh: "我们所称的粒子是量子场的局域激发——场本身遍布整个宇宙。",
    },
  },

  /* ── TIME & ENTROPY ── */
  {
    id: 15,
    cluster: "time-entropy",
    principle: {
      en: "The arrow of time is entropy's arrow.",
      zh: "时间箭头就是熵的箭头。",
    },
    gloss: {
      en: "The microscopic laws are symmetric in time; the fact that tomorrow feels different from yesterday traces back to one thing: entropy was lower in the past.",
      zh: "微观定律在时间上是对称的；明天与昨天感觉不同，这一事实归根结底是一件事：过去的熵更低。",
    },
  },
  {
    id: 16,
    cluster: "time-entropy",
    principle: {
      en: "The past hypothesis: our universe started very ordered.",
      zh: "过去假说：我们的宇宙始于极度有序的状态。",
    },
    gloss: {
      en: "The low entropy of the Big Bang is the deepest unexplained fact in cosmology — it is what makes memory, causality, and cooking possible.",
      zh: "大爆炸的低熵是宇宙学中最深刻的未解之谜——它使记忆、因果关系和烹饪成为可能。",
    },
  },
  {
    id: 17,
    cluster: "time-entropy",
    principle: {
      en: "Reversible laws, irreversible experience.",
      zh: "可逆的定律，不可逆的体验。",
    },
    gloss: {
      en: "There is no law of physics that forbids a scrambled egg from unscrambling — the prohibition is entirely statistical.",
      zh: "没有物理定律禁止打散的鸡蛋重新复原——这种禁止完全是统计性的。",
    },
  },
  {
    id: 18,
    cluster: "time-entropy",
    principle: {
      en: "Higher entropy is not disorder — it is possibility.",
      zh: "更高的熵不是混乱——而是可能性。",
    },
    gloss: {
      en: "Entropy counts the number of ways a system can be arranged; a high-entropy state simply has more realizations.",
      zh: "熵计量一个系统可以被排列的方式数量；高熵状态只是拥有更多的实现方式。",
    },
  },

  /* ── EMERGENCE & LAYERS ── */
  {
    id: 19,
    cluster: "emergence",
    principle: {
      en: "Higher levels are real, not illusory.",
      zh: "更高层次是真实的，而非幻象。",
    },
    gloss: {
      en: "The economy, the cell, the mind — these are not polite fictions layered on top of physics; they are genuine patterns with genuine causal power.",
      zh: "经济、细胞、心灵——这些不是叠加在物理学上的礼貌性虚构；它们是具有真实因果力的真实规律。",
    },
  },
  {
    id: 20,
    cluster: "emergence",
    principle: {
      en: "Weak emergence: the higher level is always in principle derivable.",
      zh: "弱涌现：更高层次原则上始终可以推导。",
    },
    gloss: {
      en: "Nothing at the macro level violates micro-level physics — but that derivation might require tracking every particle in the universe.",
      zh: "宏观层次没有任何东西违反微观物理学——但这种推导可能需要追踪宇宙中的每一个粒子。",
    },
  },
  {
    id: 21,
    cluster: "emergence",
    principle: {
      en: "Reductionism without eliminativism.",
      zh: "还原论，但不是消除论。",
    },
    gloss: {
      en: "The right view is that biology reduces to chemistry, not that only chemistry is real; tables and thoughts still exist.",
      zh: "正确的观点是生物学还原到化学，而非只有化学是真实的；桌子和思想依然存在。",
    },
  },
  {
    id: 22,
    cluster: "emergence",
    principle: {
      en: "The map chosen depends on the question asked.",
      zh: "选择哪张地图取决于被提出的问题。",
    },
    gloss: {
      en: "There is no single correct level of description — the right one is whichever makes the phenomenon most tractable.",
      zh: "没有单一正确的描述层次——正确的层次是使现象最易于处理的那个。",
    },
  },

  /* ── LIFE & COMPLEXITY ── */
  {
    id: 23,
    cluster: "life-complexity",
    principle: {
      en: "Life is entropy increasing — just locally.",
      zh: "生命是熵的增加——只是局部的。",
    },
    gloss: {
      en: "A living cell maintains its low internal entropy by exporting disorder to its surroundings; life is a thermodynamic stratagem, not a miracle.",
      zh: "活细胞通过向周围输出无序来维持其内部的低熵；生命是热力学策略，而非奇迹。",
    },
  },
  {
    id: 24,
    cluster: "life-complexity",
    principle: {
      en: "Free-energy gradients drive all biological work.",
      zh: "自由能梯度驱动所有生物活动。",
    },
    gloss: {
      en: "From photosynthesis to ATP synthesis, biology is gradient-surfing: capturing the flow from high to low free energy.",
      zh: "从光合作用到ATP合成，生物学是在「梯度冲浪」：捕捉从高到低自由能的流动。",
    },
  },
  {
    id: 25,
    cluster: "life-complexity",
    principle: {
      en: "Design without a designer: natural selection.",
      zh: "没有设计者的设计：自然选择。",
    },
    gloss: {
      en: "Variation plus differential reproduction over deep time can build an eye or a brain without any planning or intention.",
      zh: "在深远的时间中，变异加上差异繁殖可以构建出眼睛或大脑，而无需任何规划或意图。",
    },
  },
  {
    id: 26,
    cluster: "life-complexity",
    principle: {
      en: "Abiogenesis: the open question Carroll respects.",
      zh: "生命起源：卡罗尔尊重的开放问题。",
    },
    gloss: {
      en: "How chemistry first crossed into self-replication is genuinely unsolved — naturalism predicts it happened, but the mechanism is still being worked out.",
      zh: "化学如何首次跨越到自我复制仍是真正的未解之谜——自然主义预测这曾经发生，但机制仍在探究之中。",
    },
  },

  /* ── MIND & CONSCIOUSNESS ── */
  {
    id: 27,
    cluster: "mind-consciousness",
    contested: true,
    principle: {
      en: "The hard problem is real — and hard.",
      zh: "意识的难题是真实的——而且很难。",
    },
    gloss: {
      en: "Why any physical process is accompanied by subjective experience is not explained by mapping brain states to behavior — it is a genuine explanatory gap. (Contested: many philosophers dispute how 'hard' this really is.)",
      zh: "为何任何物理过程都伴随着主观体验，这并不能通过将脑状态映射到行为来解释——这是真正的解释鸿沟。（争议：许多哲学家对这究竟有多「难」持异议。）",
    },
  },
  {
    id: 28,
    cluster: "mind-consciousness",
    contested: true,
    principle: {
      en: "Inner experience and neural activity are compatible descriptions.",
      zh: "内在体验与神经活动是相容的描述。",
    },
    gloss: {
      en: "Carroll leans toward a deflationary view: the 'what it is like' and the 'what the neurons do' talk about the same event from different vantage points. (Still actively debated.)",
      zh: "卡罗尔倾向于通缩主义观点：「感受如何」与「神经元做了什么」从不同的角度谈论同一个事件。（仍在积极辩论中。）",
    },
  },
  {
    id: 29,
    cluster: "mind-consciousness",
    principle: {
      en: "Consciousness needs no spooky ingredient.",
      zh: "意识不需要神秘的成分。",
    },
    gloss: {
      en: "There is no evidence for a non-physical mind-stuff; the discipline is to explain consciousness from within the natural world, however difficult that proves.",
      zh: "没有证据表明存在非物质的心灵材料；这门学科的任务是从自然世界内部解释意识，无论这有多困难。",
    },
  },

  /* ── FREE WILL & MEANING ── */
  {
    id: 30,
    cluster: "free-will-meaning",
    contested: true,
    principle: {
      en: "Compatibilism: free will and determinism can coexist.",
      zh: "相容论：自由意志与决定论可以共存。",
    },
    gloss: {
      en: "If 'free will' means acting from your own desires without external coercion, a deterministic universe does not remove it — it explains where those desires come from. (Contested by hard determinists and libertarian free-will proponents alike.)",
      zh: "如果「自由意志」意味着在没有外部强制的情况下依照自己的欲望行动，那么决定论宇宙并不能消除它——它只是解释了那些欲望的来源。（被硬决定论者和自由意志论者共同争议。）",
    },
  },
  {
    id: 31,
    cluster: "free-will-meaning",
    principle: {
      en: "Meaning is constructed, not discovered.",
      zh: "意义是建构的，而非发现的。",
    },
    gloss: {
      en: "The universe offers no pre-installed purpose; we assemble meaning from the raw material of our situation, and that act is no less real for being ours.",
      zh: "宇宙没有预设的目的；我们从自身处境的原材料中组建意义，这一行为因出于我们自身而毫不逊色。",
    },
  },
  {
    id: 32,
    cluster: "free-will-meaning",
    principle: {
      en: "Morality without commandments.",
      zh: "没有诫命的道德。",
    },
    gloss: {
      en: "Ethics can be grounded in the lived experience of beings who suffer and flourish, without needing a cosmic rule-giver to validate it.",
      zh: "伦理可以植根于有苦有乐的生命的活生生体验，而不需要宇宙规则制定者来认可它。",
    },
  },
  {
    id: 33,
    cluster: "free-will-meaning",
    contested: true,
    principle: {
      en: "\"Significant anyway\" — the existentialist wager.",
      zh: "「依然意义重大」——存在主义的赌注。",
    },
    gloss: {
      en: "Carroll argues that a finite, unobserved life in a vast cosmos is not thereby trivial — significance is a property we confer, and conferring it is itself a human act. (Some critics call this wishful reasoning.)",
      zh: "卡罗尔认为，在浩瀚宇宙中有限而不被观察的生命并非因此微不足道——意义是我们赋予的属性，赋予本身即是一种人类行为。（一些批评者称此为一厢情愿的推理。）",
    },
  },
  {
    id: 34,
    cluster: "free-will-meaning",
    principle: {
      en: "Living poetically inside a naturalist universe.",
      zh: "在自然主义宇宙中诗意地生活。",
    },
    gloss: {
      en: "The book's culmination: once you accept one world and many true stories, you are free to pursue beauty, connection, and care — not despite the science, but illuminated by it.",
      zh: "本书的结论：一旦你接受一个世界与多种真实叙述，你就可以自由地追求美、连结与关怀——不是尽管科学如此，而是被科学所照亮。",
    },
  },
];

/* ─── cluster lookup helper ──────────────────────────────────────────────── */

function getCluster(id: ClusterId): ClusterDef {
  return CLUSTERS.find((c) => c.id === id)!;
}

/* ─── cluster chip ───────────────────────────────────────────────────────── */

function ClusterChip({
  cluster,
  count,
  active,
  onClick,
  lang,
}: {
  cluster: ClusterDef;
  count: number;
  active: boolean;
  onClick: () => void;
  lang: string;
}) {
  const label = lang === "zh" ? cluster.label.zh : cluster.label.en;

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs
        transition-all duration-200 cursor-pointer select-none
        ${
          active
            ? `${cluster.chipActive} ${cluster.chipText} ${cluster.chipBorder}`
            : "bg-void-800/60 text-ink-500 border-void-600/60 hover:text-ink-300 hover:border-void-500/50"
        }
      `}
    >
      {active && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cluster.dotColor}`}
        />
      )}
      <span
        className={`label-mono text-[0.56rem] tracking-widest ${
          lang === "zh" ? "zh" : ""
        }`}
      >
        {label}
      </span>
      <span
        className={`label-mono text-[0.52rem] px-1 py-0.5 rounded-md ${
          active ? cluster.chipActive : "bg-void-700/60"
        }`}
        style={{ letterSpacing: "0.1em" }}
      >
        {count}
      </span>
    </button>
  );
}

/* ─── idea card ──────────────────────────────────────────────────────────── */

function IdeaCard({ idea, lang }: { idea: Idea; lang: string }) {
  const cluster = getCluster(idea.cluster);

  return (
    <article
      className={`
        panel rounded-xl border-l-2 ${cluster.cardAccent}
        px-4 py-4 flex flex-col gap-2.5 rise-in
      `}
    >
      {/* number + cluster badge row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={`label-mono text-[0.52rem] ${cluster.numberColor}`}>
          IDEA {String(idea.id).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1.5">
          {idea.contested && (
            <span
              className="label-mono text-[0.46rem] px-2 py-0.5 rounded-full border border-gold-500/40 text-gold-400"
              style={{ background: "rgba(245,185,66,0.08)" }}
              title={
                lang === "zh"
                  ? "争议性观点"
                  : "Contested view"
              }
            >
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "zh" ? "争议" : "CONTESTED"}
              </span>
            </span>
          )}
          <span
            className={`label-mono text-[0.48rem] px-2 py-0.5 rounded-full border ${cluster.chipText} ${cluster.chipBorder}`}
            style={{ background: cluster.accent + "14" }}
          >
            <span className={lang === "zh" ? "zh" : ""}>
              {lang === "zh" ? cluster.label.zh : cluster.label.en}
            </span>
          </span>
        </div>
      </div>

      {/* principle */}
      <p
        className={`text-ink-50 text-sm font-medium leading-snug ${
          lang === "zh" ? "zh" : "display"
        }`}
        style={{
          fontFamily:
            lang === "zh"
              ? undefined
              : '"Fraunces", ui-serif, serif',
          fontWeight: 600,
        }}
      >
        {lang === "zh" ? idea.principle.zh : idea.principle.en}
      </p>

      {/* hairline divider */}
      <div
        className="h-px"
        style={{ background: cluster.accent + "25" }}
      />

      {/* gloss */}
      <p
        className={`text-ink-500 text-xs leading-relaxed ${
          lang === "zh" ? "zh leading-loose" : ""
        }`}
        style={{
          fontFamily:
            lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
        }}
      >
        {lang === "zh" ? idea.gloss.zh : idea.gloss.en}
      </p>
    </article>
  );
}

/* ─── main export ────────────────────────────────────────────────────────── */

export default function BigPicturePrinciples() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => (lang === "zh" ? zh : en);

  const [activeCluster, setActiveCluster] = useState<ClusterId | "all">("all");

  const filteredIdeas =
    activeCluster === "all"
      ? IDEAS
      : IDEAS.filter((i) => i.cluster === activeCluster);

  const countFor = (id: ClusterId) =>
    IDEAS.filter((i) => i.cluster === id).length;

  const activeClusterDef =
    activeCluster !== "all" ? getCluster(activeCluster) : null;

  const contestedCount = filteredIdeas.filter((i) => i.contested).length;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">

      {/* ── section header ── */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <div className="label-mono text-leaf-400">
          {L("Ideas · The Big Picture", "观念 · 宏观视角")}
        </div>
        <h2 className="display text-4xl md:text-5xl spark-text leading-none">
          {L("The Big Picture", "宏观视角")}
        </h2>
        <p
          className={`text-base text-ink-300 leading-relaxed max-w-2xl ${
            lang === "zh" ? "zh" : ""
          }`}
          style={{
            fontFamily:
              lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
          }}
        >
          {L(
            "Sean Carroll's poetic naturalism in 34 ideas — paraphrased as original analytical observations across eight thematic clusters. Contested ideas are flagged.",
            "肖恩·卡罗尔的诗性自然主义凝聚为34个观念——以原创分析性观察的形式呈现，归纳为八个主题群组。争议性观点已标注。"
          )}
        </p>

        {/* attribution */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-void-600/60 bg-void-800/50 px-3 py-2 self-start">
          <svg
            viewBox="0 0 12 12"
            width="10"
            height="10"
            aria-hidden="true"
          >
            <circle
              cx="6"
              cy="6"
              r="5"
              fill="none"
              stroke="#6c6e90"
              strokeWidth="1.2"
            />
            <line
              x1="6"
              y1="5"
              x2="6"
              y2="9"
              stroke="#6c6e90"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="6" cy="3.5" r="0.8" fill="#6c6e90" />
          </svg>
          <span
            className={`text-[0.65rem] text-ink-500 ${
              lang === "zh" ? "zh" : ""
            }`}
            style={{
              fontFamily:
                lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
            }}
          >
            {L(
              "Ideas paraphrased in original words — based on Sean Carroll's «The Big Picture»",
              "原创措辞转述观念——基于肖恩·卡罗尔所著《宏观视角》"
            )}
          </span>
        </div>
      </div>

      {/* ── cluster filter chips ── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono text-[0.55rem] text-ink-500">
          {L("FILTER BY CLUSTER", "按主题筛选")}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All chip */}
          <button
            onClick={() => setActiveCluster("all")}
            aria-pressed={activeCluster === "all"}
            className={`
              inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5
              transition-all duration-200 cursor-pointer select-none
              ${
                activeCluster === "all"
                  ? "bg-leaf-500/15 text-leaf-400 border-leaf-500/40"
                  : "bg-void-800/60 text-ink-500 border-void-600/60 hover:text-ink-300 hover:border-void-500/50"
              }
            `}
          >
            <span className="label-mono text-[0.56rem] tracking-widest">
              {L("ALL", "全部")}
            </span>
            <span
              className={`label-mono text-[0.52rem] px-1 py-0.5 rounded-md ${
                activeCluster === "all" ? "bg-leaf-500/20" : "bg-void-700/60"
              }`}
            >
              {IDEAS.length}
            </span>
          </button>

          {CLUSTERS.map((c) => (
            <ClusterChip
              key={c.id}
              cluster={c}
              count={countFor(c.id)}
              active={activeCluster === c.id}
              onClick={() =>
                setActiveCluster(activeCluster === c.id ? "all" : c.id)
              }
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* ── active cluster strip ── */}
      {activeClusterDef && (
        <div
          className="rounded-xl border px-4 py-3 flex items-center gap-3 rise-in"
          style={{
            borderColor: activeClusterDef.accent + "30",
            background: activeClusterDef.accent + "08",
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 pulse"
            style={{
              background: activeClusterDef.accent,
              boxShadow: `0 0 6px 2px ${activeClusterDef.accent}55`,
            }}
          />
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`label-mono text-[0.6rem] ${activeClusterDef.chipText}`}
            >
              {lang === "zh"
                ? activeClusterDef.label.zh
                : activeClusterDef.label.en}
            </span>
            <span
              className="text-ink-500 text-xs"
              style={{ fontFamily: '"Newsreader", ui-serif, serif' }}
            >
              —
            </span>
            <span
              className={`text-ink-300 text-xs ${lang === "zh" ? "zh" : ""}`}
              style={{
                fontFamily:
                  lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
              }}
            >
              {L(
                `${filteredIdeas.length} ideas in this cluster`,
                `此主题共 ${filteredIdeas.length} 个观念`
              )}
            </span>
            {contestedCount > 0 && (
              <>
                <span className="text-ink-500 text-xs">·</span>
                <span
                  className={`text-gold-400 text-xs ${
                    lang === "zh" ? "zh" : ""
                  }`}
                  style={{
                    fontFamily:
                      lang === "zh"
                        ? undefined
                        : '"Newsreader", ui-serif, serif',
                  }}
                >
                  {L(
                    `${contestedCount} contested`,
                    `${contestedCount} 项争议`
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── idea cards grid ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-live="polite"
        aria-label={L("Filtered ideas", "已筛选观念")}
      >
        {filteredIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} lang={lang} />
        ))}
      </div>

      {/* ── rule divider ── */}
      <div className="h-px rule-flux rounded-full opacity-30" />

      {/* ── closing note ── */}
      <div
        className="rounded-2xl border px-6 py-5 text-sm leading-relaxed"
        style={{
          borderColor: "rgba(45,212,191,0.10)",
          background: "rgba(45,212,191,0.03)",
        }}
      >
        <p
          className={`text-ink-300 ${lang === "zh" ? "zh leading-loose" : ""}`}
          style={{
            fontFamily:
              lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
          }}
        >
          {L(
            "These ideas are analytical paraphrases — not the book's verbatim text. They represent the underlying logic as observed across Carroll's argument. Ideas marked «CONTESTED» reflect genuine ongoing debate in philosophy of mind, physics, or ethics. For the primary source, see Sean Carroll's «The Big Picture» (2016).",
            "这些观念是分析性转述——并非原书的逐字文本。它们代表了从卡罗尔论证中观察到的底层逻辑。标注「争议」的观念反映了心灵哲学、物理学或伦理学中真正持续进行的辩论。原始资料请参阅肖恩·卡罗尔所著《宏观视角》（2016年）。"
          )}
        </p>
      </div>

    </section>
  );
}
