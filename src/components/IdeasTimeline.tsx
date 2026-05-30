"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "./lang";

/* ─── types ──────────────────────────────────────────────────────── */
type IdeaKind =
  | "determinism"
  | "biology"
  | "thermo"
  | "symmetry"
  | "quantum"
  | "particle"
  | "core"
  | "discovery"
  | "synthesis";

interface IdeaMilestone {
  year: number;
  yearLabel: { en: string; zh: string };
  label: { en: string; zh: string };
  title: { en: string; zh: string };
  thinker: { en: string; zh: string };
  significance: { en: string; zh: string };
  detail: { en: string; zh: string };
  kind: IdeaKind;
}

/* ─── helpers ─────────────────────────────────────────────────────── */
function L(lang: "en" | "zh", en: string, zh: string): string {
  return lang === "zh" ? zh : en;
}

/* ─── palette by idea kind ───────────────────────────────────────── */
const KIND_COLOR: Record<IdeaKind, string> = {
  determinism: "#8b7bff", // iris-500 — the old clockwork dream
  biology:     "#2dd4bf", // leaf-500 — life unfurling without intention
  thermo:      "#ff6b5c", // flux-500 — entropy's arrow
  symmetry:    "#f5b942", // gold-500 — the deep order beneath the laws
  quantum:     "#ff4fa3", // plasm-500 — the wavefunction taken literally
  particle:    "#b3a8ff", // iris-400 — the zoo of particles tamed
  core:        "#ffd27a", // gold-400 — the Core Theory crown
  discovery:   "#f5b942", // gold-500 — the last piece found
  synthesis:   "#ff9b8f", // flux-400 — meaning made from all of it
};

const KIND_LABEL: {
  en: Record<IdeaKind, string>;
  zh: Record<IdeaKind, string>;
} = {
  en: {
    determinism: "CLASSICAL DETERMINISM",
    biology:     "EVOLUTIONARY THEORY",
    thermo:      "STATISTICAL MECHANICS",
    symmetry:    "MATHEMATICAL PHYSICS",
    quantum:     "QUANTUM FOUNDATIONS",
    particle:    "PARTICLE PHYSICS",
    core:        "CORE THEORY",
    discovery:   "EXPERIMENTAL PHYSICS",
    synthesis:   "POETIC NATURALISM",
  },
  zh: {
    determinism: "经典决定论",
    biology:     "进化论",
    thermo:      "统计力学",
    symmetry:    "数学物理",
    quantum:     "量子基础",
    particle:    "粒子物理",
    core:        "核心理论",
    discovery:   "实验物理",
    synthesis:   "诗意自然主义",
  },
};

/* ─── ideas data ─────────────────────────────────────────────────── */
const MILESTONES: IdeaMilestone[] = [
  {
    year: 1814,
    yearLabel: { en: "1814", zh: "1814" },
    label: { en: "Laplace's Demon", zh: "拉普拉斯妖" },
    title: {
      en: "Laplace's Demon — classical determinism",
      zh: "拉普拉斯妖——经典决定论",
    },
    thinker: {
      en: "Pierre-Simon Laplace",
      zh: "皮埃尔-西蒙·拉普拉斯",
    },
    significance: {
      en: "A sufficiently knowing intelligence could compute the entire future — and past — from one moment's state.",
      zh: "一个拥有足够知识的智慧体，可以从某一时刻的状态推算出整个未来与过去。",
    },
    detail: {
      en: "In his 'Philosophical Essay on Probabilities,' Laplace imagined a supremely knowing intellect — now called Laplace's Demon — that possesses, at a single instant, knowledge of the positions and momenta of every particle in the universe and every force acting on them. For such an intellect, Laplace wrote, 'nothing would be uncertain and the future, as the past, would be present to its eyes.' This is the purest statement of classical Newtonian determinism: the universe as a mechanism whose future is entirely encoded in its present. Carroll treats this as the bedrock of the naturalist picture — the universe is law-governed all the way down — even as quantum mechanics would later complicate the demon's powers. The demon is not the final word; it is the baseline from which the story climbs.",
      zh: "在《概率的哲学散论》中，拉普拉斯设想了一个拥有至高知识的智慧体——今称拉普拉斯妖——它在某一瞬间掌握宇宙中每个粒子的位置、动量以及作用于它们的每一种力。对于这样的智慧体，拉普拉斯写道：没有什么是不确定的，未来如同过去，尽在其眼前。这是牛顿经典决定论最纯粹的表述：宇宙是一台机器，其未来完全编码于当下。卡罗尔将此视为自然主义图景的基石——宇宙自上而下皆受定律支配——尽管量子力学后来使妖的能力复杂化了。妖不是终点，而是这段故事攀升的基线。",
    },
    kind: "determinism",
  },
  {
    year: 1859,
    yearLabel: { en: "1859", zh: "1859" },
    label: { en: "Origin of Species", zh: "物种起源" },
    title: {
      en: "Darwin — design without a designer",
      zh: "达尔文——没有设计者的设计",
    },
    thinker: { en: "Charles Darwin", zh: "查尔斯·达尔文" },
    significance: {
      en: "Natural selection produces the appearance of purpose in living things with no recourse to intention whatsoever.",
      zh: "自然选择在生命体中产生出目的性的表象，完全无需任何意图。",
    },
    detail: {
      en: "On the Origin of Species establishes that the variety and complexity of living organisms — including the exquisite fit between organisms and their environments that had for centuries been the strongest argument for a designer — arises through descent with modification and natural selection acting on heritable variation. No plan, no goal, no foresight is required: only differential survival and reproduction across vast stretches of time. For Carroll, this is the pivotal conceptual move: it establishes that meaning, purpose, and apparent direction can be emergent properties of mindless physical processes. What Darwin did for biology, the rest of the scientific picture tries to extend to the whole cosmos. Poetic naturalism inherits Darwin's key insight: complexity and value can exist in a universe that has no inherent teleology.",
      zh: "《物种起源》确立了：生物体的多样性与复杂性——包括生物与其环境之间精妙的契合，这曾是数百年来支持设计者存在的最有力论据——源于可遗传变异上的变异传代与自然选择。不需要任何计划、目标或预见：只需在漫长时间中不同个体的存活与繁殖差异。对卡罗尔而言，这是关键的概念转折：它确立了意义、目的与表面方向性可以是无意识物理过程的涌现属性。达尔文为生物学所做的事，其余的科学图景尝试延伸至整个宇宙。诗意自然主义继承了达尔文的核心洞见：复杂性与价值可以在一个没有内在目的论的宇宙中存在。",
    },
    kind: "biology",
  },
  {
    year: 1877,
    yearLabel: { en: "1870s", zh: "1870年代" },
    label: { en: "Boltzmann & Entropy", zh: "玻尔兹曼与熵" },
    title: {
      en: "Boltzmann — entropy and the statistical arrow of time",
      zh: "玻尔兹曼——熵与时间的统计之箭",
    },
    thinker: { en: "Ludwig Boltzmann", zh: "路德维希·玻尔兹曼" },
    significance: {
      en: "The second law of thermodynamics is not a fundamental law but a statistical fact: high-entropy states are overwhelmingly more probable.",
      zh: "热力学第二定律不是基本定律，而是统计事实：高熵状态在概率上压倒性地占多数。",
    },
    detail: {
      en: "Ludwig Boltzmann's statistical mechanics — developed through the 1870s and reaching its canonical form in 1877 with the entropy formula S = k log W — reframes the second law of thermodynamics as a probabilistic statement rather than an absolute one. Entropy increases not because the laws of physics forbid its decrease, but because the overwhelming majority of microscopic configurations correspond to high-entropy macroscopic states. The arrow of time — the felt asymmetry between past and future — emerges not from time-asymmetric fundamental laws but from the extraordinarily low-entropy initial condition of the universe. Carroll's work on cosmological fine-tuning and the arrow of time builds directly on Boltzmann: why did the universe begin in such an improbable state? Boltzmann also demonstrates that concepts like entropy are not fundamental but emergent — different useful vocabularies can apply to the same underlying physics, which is central to Carroll's poetic naturalism.",
      zh: "路德维希·玻尔兹曼的统计力学——在整个1870年代发展，并于1877年以熵公式S = k log W达到经典形式——将热力学第二定律重新表述为概率性陈述而非绝对定律。熵增不是因为物理定律禁止熵减，而是因为绝大多数微观组态对应于高熵的宏观状态。时间之箭——过去与未来之间感知到的不对称——不是源于时间不对称的基本定律，而是源于宇宙极低熵的初始条件。卡罗尔关于宇宙学微调与时间之箭的研究直接建立在玻尔兹曼之上：宇宙为何以如此低概率的状态开始？玻尔兹曼还证明熵之类的概念并非基本性的，而是涌现的——不同的有用词汇可以适用于同一底层物理，这是卡罗尔诗意自然主义的核心。",
    },
    kind: "thermo",
  },
  {
    year: 1918,
    yearLabel: { en: "1918", zh: "1918" },
    label: { en: "Noether's Theorem", zh: "诺特定理" },
    title: {
      en: "Noether — symmetry grounds every conservation law",
      zh: "诺特——对称性奠基每一条守恒定律",
    },
    thinker: { en: "Emmy Noether", zh: "埃米·诺特" },
    significance: {
      en: "Every continuous symmetry of the laws of physics corresponds to a conserved quantity — one of the deepest structural facts about reality.",
      zh: "物理定律的每一个连续对称性都对应一个守恒量——这是关于现实的最深刻的结构性事实之一。",
    },
    detail: {
      en: "Emmy Noether's 1918 theorem establishes one of the most profound connections in all of physics: every continuous symmetry of a physical system corresponds to a conserved quantity. Time-translation symmetry gives energy conservation; spatial-translation symmetry gives momentum conservation; rotational symmetry gives angular momentum conservation. The theorem is elegant to the point of being almost incomprehensible in its depth. It reveals that what we call conservation laws are not independent empirical discoveries but consequences of the symmetry structure of the laws themselves. For Carroll, Noether's theorem exemplifies how the deep order underlying physics is mathematical and structural — and how the right conceptual vocabulary (symmetry) can unify what seemed like unrelated phenomena. It is a quiet triumph of mathematical physics that lurks inside every equation of the Standard Model.",
      zh: "埃米·诺特1918年的定理确立了物理学中最深刻的联系之一：物理系统的每一个连续对称性都对应一个守恒量。时间平移对称性给出能量守恒；空间平移对称性给出动量守恒；旋转对称性给出角动量守恒。该定理的优雅深刻到令人难以置信。它揭示了我们所称的守恒定律并非独立的经验发现，而是定律本身对称结构的推论。对卡罗尔而言，诺特定理体现了物理学底层深刻秩序的数学性与结构性——以及正确的概念词汇（对称性）如何能统一看似无关的现象。这是数学物理的安静胜利，潜藏于标准模型的每一个方程之中。",
    },
    kind: "symmetry",
  },
  {
    year: 1957,
    yearLabel: { en: "1957", zh: "1957" },
    label: { en: "Many-Worlds", zh: "多世界读解" },
    title: {
      en: "Everett — taking the wavefunction literally",
      zh: "埃弗雷特——字面上对待波函数",
    },
    thinker: { en: "Hugh Everett III", zh: "休·埃弗雷特三世" },
    significance: {
      en: "If quantum mechanics is universally true and the wavefunction never collapses, all outcomes occur — in branching worlds.",
      zh: "如果量子力学普遍成立且波函数从不崩塌，则所有结果均会发生——在分支世界中。",
    },
    detail: {
      en: "Hugh Everett III's 1957 doctoral thesis proposes that the wavefunction of quantum mechanics is a complete and literal description of reality, obeying the Schrodinger equation at all times without any special measurement process that causes collapse. The consequence is that every time a quantum event has multiple possible outcomes, the universe branches: all outcomes occur, each in its own branch of the universal wavefunction. Observers in each branch experience only one outcome. Carroll is among the most prominent contemporary advocates of the Everett (Many-Worlds) interpretation. He argues it is the simplest and most consistent reading of quantum mechanics, requiring no extra postulates about collapse and no privileged observers. For poetic naturalism, the many-worlds interpretation matters because it preserves a fully naturalistic, fully deterministic picture at the level of the wavefunction — the apparent randomness of quantum measurement is an artifact of the branching structure.",
      zh: "休·埃弗雷特三世1957年的博士论文提出：量子力学的波函数是对现实的完整且字面的描述，始终服从薛定谔方程，不存在导致崩塌的特殊测量过程。其推论是：每当一个量子事件有多个可能结果时，宇宙就会分支——所有结果均在宇宙波函数的各自分支中发生。每个分支中的观察者只经历一个结果。卡罗尔是埃弗雷特（多世界）读解最著名的当代倡导者之一。他认为这是对量子力学最简洁、最一致的解读，不需要关于崩塌的额外假设，也不需要特权观察者。对诗意自然主义而言，多世界读解之所以重要，是因为它在波函数层面保留了完全自然主义、完全决定论的图景——量子测量的表面随机性是分支结构的副产品。",
    },
    kind: "quantum",
  },
  {
    year: 1975,
    yearLabel: { en: "1970s", zh: "1970年代" },
    label: { en: "Standard Model", zh: "标准模型" },
    title: {
      en: "The Standard Model assembled",
      zh: "标准模型建立",
    },
    thinker: {
      en: "Glashow, Weinberg, Salam, Gell-Mann + many others",
      zh: "格拉肖、温伯格、萨拉姆、盖尔曼等众多科学家",
    },
    significance: {
      en: "Quarks, leptons, and the electroweak and strong forces unified in one renormalisable quantum field theory.",
      zh: "夸克、轻子以及电弱力与强力，统一于一个可重整化的量子场论。",
    },
    detail: {
      en: "The Standard Model of particle physics — assembled through the late 1960s and crystallised in the 1970s with the unification of electromagnetic and weak forces by Glashow, Weinberg, and Salam (Nobel 1979), Gell-Mann's quark model, and the confirmation of quantum chromodynamics — is the most precisely tested scientific theory in history. It describes all known matter (quarks and leptons) and three of the four fundamental forces (electromagnetic, weak, strong) as quantum fields whose excitations are particles. Predictions have been confirmed to extraordinary precision: the anomalous magnetic moment of the electron agrees with experiment to one part in a trillion. For Carroll, the Standard Model plus weak-field general relativity constitutes the Core Theory — not an approximation, but a complete and exact description of the physics underlying everyday experience. This is not a working hypothesis; it is, within its domain, a finished edifice.",
      zh: "粒子物理标准模型——在1960年代末逐步建立，并在整个1970年代随格拉肖、温伯格和萨拉姆对电磁力与弱力的统一（1979年诺贝尔奖）、盖尔曼的夸克模型以及量子色动力学的验证而结晶——是有史以来检验最精确的科学理论。它将所有已知物质（夸克和轻子）以及四种基本力中的三种（电磁力、弱力、强力）描述为量子场，其激发即为粒子。预言已被以惊人的精度所验证：电子反常磁矩与实验结果的吻合精度达到万亿分之一。对卡罗尔而言，标准模型加上弱场广义相对论构成了核心理论——不是近似，而是对日常经验底层物理的完整而精确的描述。这不是一个工作假说；在其适用范围内，这是一座已完工的大厦。",
    },
    kind: "particle",
  },
  {
    year: 2005,
    yearLabel: { en: "c. 2000s", zh: "约2000年代" },
    label: { en: "Core Theory", zh: "核心理论" },
    title: {
      en: "The Core Theory — QFT + gravity covers all of everyday life",
      zh: "核心理论——量子场论加引力覆盖日常生活的全部",
    },
    thinker: {
      en: "Sean Carroll (synthesis)",
      zh: "肖恩·卡罗尔（综合）",
    },
    significance: {
      en: "The known laws of physics are sufficient to account for every physical process relevant to human life — no new physics is needed at human scales.",
      zh: "已知的物理定律足以解释与人类生活相关的每一个物理过程——在人类尺度上不需要任何新物理。",
    },
    detail: {
      en: "Carroll's framing of the Core Theory is one of the distinctive conceptual contributions of The Big Picture. The Core Theory is the Standard Model of particle physics combined with general relativity (in the weak-field, non-relativistic limit appropriate to human scales). Its significance is not that it is new — the equations have been known for decades — but that it is sufficient. For every physical process relevant to human experience — every chemical reaction, every biological process, every thought — the Core Theory's equations already account for the relevant physics. There is no room, within the domain of human-scale experience, for undiscovered forces, vital essences, or non-physical influences on matter. This is Carroll's strongest argument for naturalism: if you want to invoke a non-physical soul that interacts with the body, you are proposing new physics that should, in principle, be detectable. The Core Theory sets the boundary condition for all upper-level descriptions — chemistry, biology, neuroscience, experience.",
      zh: "卡罗尔对核心理论的表述是《大图景》中独特的概念贡献之一。核心理论是粒子物理标准模型与广义相对论（在适用于人类尺度的弱场、非相对论极限下）的结合。其意义不在于它是新的——这些方程几十年前就已知晓——而在于它是充分的。对于每一个与人类经验相关的物理过程——每一个化学反应、每一个生物过程、每一个思维——核心理论的方程已然涵盖了相关物理。在人类尺度经验的范围内，没有未被发现的力、生命精华或对物质的非物质影响的容身之处。这是卡罗尔为自然主义提出的最有力论证：如果你想援引一个与身体相互作用的非物质灵魂，你就是在提出原则上应该可被探测到的新物理。核心理论为所有上层描述——化学、生物学、神经科学、经验——设定了边界条件。",
    },
    kind: "core",
  },
  {
    year: 2012,
    yearLabel: { en: "2012", zh: "2012" },
    label: { en: "Higgs Confirmed", zh: "希格斯发现" },
    title: {
      en: "Higgs boson confirmed — the Standard Model complete",
      zh: "希格斯玻色子确认——标准模型完整",
    },
    thinker: {
      en: "ATLAS & CMS Collaborations, CERN",
      zh: "CERN ATLAS与CMS合作组",
    },
    significance: {
      en: "The last predicted particle of the Standard Model found at the LHC — the mechanism that gives mass to fundamental particles confirmed.",
      zh: "大型强子对撞机发现标准模型的最后一个预言粒子——赋予基本粒子质量的机制得到确认。",
    },
    detail: {
      en: "On July 4, 2012, the ATLAS and CMS experiments at CERN's Large Hadron Collider announced the discovery of a new boson consistent with the Higgs boson predicted by Peter Higgs, Francois Englert, and others in 1964. The Higgs field is the mechanism by which fundamental particles acquire mass through spontaneous symmetry breaking — without it, quarks and electrons would be massless and no atoms could form. The Higgs was the last unconfirmed prediction of the Standard Model; its discovery closed the experimental ledger on a theory assembled over fifty years. Englert and Higgs received the Nobel Prize in 2013. For Carroll, the Higgs discovery is both a triumph of the Core Theory and a closing of a chapter: the Standard Model is now empirically complete within its domain. The LHC has subsequently found no evidence for physics beyond the Standard Model at its energy scale, reinforcing Carroll's argument that the Core Theory is genuinely sufficient for the physics of everyday life.",
      zh: "2012年7月4日，CERN大型强子对撞机的ATLAS和CMS实验宣布发现一种与彼得·希格斯、弗朗索瓦·恩格勒特等人1964年预言的希格斯玻色子相符的新玻色子。希格斯场是基本粒子通过自发对称性破缺获得质量的机制——没有它，夸克和电子将是无质量的，原子将无法形成。希格斯玻色子是标准模型最后一个未经证实的预言；它的发现为这个历经五十年建立的理论关闭了实验账本。恩格勒特和希格斯于2013年获得诺贝尔奖。对卡罗尔而言，希格斯发现既是核心理论的胜利，也是一个章节的终结：标准模型现在在其适用范围内已经实验完备。大型强子对撞机此后在其能量尺度上未发现超出标准模型的物理证据，强化了卡罗尔的论点：核心理论对于日常生活的物理来说确实是充分的。",
    },
    kind: "discovery",
  },
  {
    year: 2016,
    yearLabel: { en: "2016", zh: "2016" },
    label: { en: "The Big Picture", zh: "大图景" },
    title: {
      en: "Carroll's The Big Picture — poetic naturalism",
      zh: "卡罗尔《大图景》——诗意自然主义",
    },
    thinker: { en: "Sean Carroll", zh: "肖恩·卡罗尔" },
    significance: {
      en: "A worldview that takes the scientific picture seriously and finds — not imposes — meaning, purpose, and value within it.",
      zh: "一种认真对待科学图景，并在其中发现——而非强加——意义、目的与价值的世界观。",
    },
    detail: {
      en: "Sean Carroll's The Big Picture: On the Origins of Life, Meaning, and the Universe Itself (2016) is the culminating synthesis that gives this timeline its name and frame. Poetic naturalism is Carroll's label for a position that accepts the findings of modern science — the Core Theory, evolution, the statistical arrow of time, the Everettian wavefunction — as the best account of reality we have, while insisting that this does not exhaust what can be meaningfully said. Different levels of description — particle physics, chemistry, biology, persons, values — are all legitimate and useful, not reductions to be eliminated but emergent vocabularies that carve reality at its joints. Poetic does not mean imprecise or fanciful; it means that the human work of finding meaning, of constructing stories, of caring about the future, is real and valuable even in a universe that did not pre-load it. The book synthesises Laplace's determinism, Darwin's emergence, Boltzmann's arrows, Noether's symmetries, Everett's branches, and the particle physicist's completed Standard Model into one coherent picture of what it means to be alive in the cosmos we actually inhabit.",
      zh: "肖恩·卡罗尔的《大图景：生命、意义与宇宙本身的起源》（2016年）是赋予这条时间线其名称与框架的终极综合。诗意自然主义是卡罗尔对一种立场的命名：接受现代科学的发现——核心理论、进化论、时间的统计之箭、埃弗雷特的波函数——作为我们对现实的最佳描述，同时坚持认为这并不穷尽所有可以有意义地言说的事物。不同层次的描述——粒子物理、化学、生物学、人格、价值观——都是合法且有用的，不是待消除的还原，而是在现实的接合处切割现实的涌现词汇。诗意不意味着不精确或富有幻想；它意味着人类寻找意义、构建故事、关心未来的工作是真实且有价值的，即便在一个并未预先加载这些的宇宙中。这本书将拉普拉斯的决定论、达尔文的涌现、玻尔兹曼的时间箭、诺特的对称性、埃弗雷特的分支与粒子物理学家已完成的标准模型综合成一幅连贯的图景：在我们实际栖居的宇宙中，活着意味着什么。",
    },
    kind: "synthesis",
  },
];

/* ─── NodeGlow ────────────────────────────────────────────────────── */
function NodeGlow({
  color,
  active,
  isSynthesis,
}: {
  color: string;
  active: boolean;
  isSynthesis?: boolean;
}) {
  return (
    <div
      className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
      style={{
        background: active
          ? `radial-gradient(circle, ${color}28 0%, ${color}05 70%)`
          : "transparent",
        border: isSynthesis
          ? `2px solid ${color}`
          : `2px solid ${active ? color : color + "40"}`,
        boxShadow: active
          ? `0 0 24px 6px ${color}55, 0 0 48px 14px ${color}18`
          : isSynthesis
          ? `0 0 16px 4px ${color}44`
          : "none",
      }}
    >
      <div
        className="h-3 w-3 rounded-full transition-all duration-300"
        style={{
          background: color,
          opacity: active ? 1 : 0.55,
          boxShadow: active ? `0 0 12px 5px ${color}88` : "none",
        }}
      />
      {active && (
        <div
          className="absolute inset-0 animate-ping rounded-full"
          style={{ border: `1px solid ${color}44`, animationDuration: "1.8s" }}
        />
      )}
      {isSynthesis && !active && (
        <div
          className="pulse absolute inset-[-5px] rounded-full"
          style={{ border: `1px solid ${color}55` }}
        />
      )}
    </div>
  );
}

/* ─── ConnectorLine ───────────────────────────────────────────────── */
function ConnectorLine({
  fromColor,
  toColor,
  index,
}: {
  fromColor: string;
  toColor: string;
  index: number;
}) {
  // Deterministic id — no Math.random()
  const gradId = `itl-grad-${index}`;
  return (
    <div className="flex flex-shrink-0 items-center" style={{ width: "40px" }}>
      <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="7"
          x2="40"
          y2="7"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          className="flow"
        />
      </svg>
    </div>
  );
}

/* ─── throughline badge ───────────────────────────────────────────── */
function ThroughlineBadge({ lang }: { lang: "en" | "zh" }) {
  return (
    <div
      className="mx-auto mb-6 flex max-w-2xl items-start gap-3 rounded-xl px-4 py-3"
      style={{
        background:
          "linear-gradient(120deg, rgba(139,123,255,0.07), rgba(45,212,191,0.06), rgba(255,107,92,0.05))",
        border: "1px solid rgba(139,123,255,0.18)",
      }}
    >
      <div
        className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: "#8b7bff", boxShadow: "0 0 8px 3px #8b7bff66" }}
      />
      <p className={`text-xs leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        {L(
          lang,
          "Each milestone removed one more veil of mystery — design, purpose, collapse — until what remained was a lawful, beautiful universe in which meaning is something we build, not find pre-installed. Interpretive framing by this companion; dates of original events accurate.",
          "每个里程碑都揭去一层神秘的面纱——设计、目的、崩塌——直到剩下的是一个合乎规律、美丽的宇宙，其中意义是我们建构的，而非预先安装的。本伴读进行了诠释性框架；原始事件日期准确。"
        )}
      </p>
    </div>
  );
}

/* ─── detail card ─────────────────────────────────────────────────── */
function DetailCard({
  m,
  lang,
  onClose,
  onPrev,
  onNext,
  index,
  total,
}: {
  m: IdeaMilestone;
  lang: "en" | "zh";
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}) {
  const color = KIND_COLOR[m.kind];
  const isSynthesis = m.kind === "synthesis";

  return (
    <div
      className="panel mx-auto max-w-2xl rounded-2xl p-6 rise-in"
      style={{
        borderColor: `${color}30`,
        boxShadow: isSynthesis
          ? `0 0 80px -20px ${color}55, 0 0 120px -40px ${color}22`
          : `0 0 60px -24px ${color}40`,
      }}
    >
      {isSynthesis && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg px-3 py-2"
          style={{
            background: "rgba(255,155,143,0.09)",
            border: "1px solid rgba(255,155,143,0.32)",
          }}
        >
          <span
            className="pulse h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: color }}
          />
          <span
            className={`text-[0.62rem] font-mono uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
            style={{ color }}
          >
            {L(
              lang,
              "Synthesis — all prior strands woven into a worldview",
              "综合——所有前驱脉络编织成一个世界观"
            )}
          </span>
        </div>
      )}

      <div className="mb-1 flex flex-wrap items-baseline gap-3">
        <span
          className="font-mono text-[0.58rem] uppercase tracking-[0.22em]"
          style={{ color }}
        >
          {m.yearLabel[lang]}
        </span>
        <span
          className={`font-mono text-[0.52rem] tracking-wider text-ink-500 ${lang === "zh" ? "zh" : ""}`}
        >
          {m.thinker[lang]}
        </span>
      </div>

      <h3
        className={`display mt-0.5 text-xl text-ink-50 md:text-2xl ${lang === "zh" ? "zh" : ""}`}
      >
        {m.title[lang]}
      </h3>

      <p
        className={`mt-2 text-sm font-medium leading-snug ${lang === "zh" ? "zh" : ""}`}
        style={{ color }}
      >
        {m.significance[lang]}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}25`,
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span
            className="font-mono text-[0.52rem] uppercase tracking-widest"
            style={{ color }}
          >
            {KIND_LABEL[lang][m.kind]}
          </span>
        </div>
      </div>

      <p
        className={`mt-4 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}
      >
        {m.detail[lang]}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            onClick={onPrev}
            className="font-mono text-[0.58rem] uppercase tracking-wider text-ink-500 transition hover:text-ink-300 disabled:opacity-30"
            disabled={index === 0}
            aria-label={L(lang, "Previous", "上一条")}
          >
            {L(lang, "← prev", "← 上一")}
          </button>
          <span className="font-mono text-[0.52rem] tracking-wider text-ink-500 opacity-40">
            {index + 1} / {total}
          </span>
          <button
            onClick={onNext}
            className="font-mono text-[0.58rem] uppercase tracking-wider text-ink-500 transition hover:text-ink-300 disabled:opacity-30"
            disabled={index === total - 1}
            aria-label={L(lang, "Next", "下一条")}
          >
            {L(lang, "next →", "下一 →")}
          </button>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-[0.58rem] uppercase tracking-wider text-ink-500 transition hover:text-ink-300"
        >
          {L(lang, "× close", "× 收起")}
        </button>
      </div>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────────────── */
export default function IdeasTimeline() {
  const { lang } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active === null || !trackRef.current) return;
    const nodes = trackRef.current.querySelectorAll("[data-node]");
    const el = nodes[active] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [active]);

  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <p className="label-mono mb-3">
          {L(lang, "Lineage of Ideas", "思想谱系")}
        </p>
        <h2 className="display text-2xl text-ink-50 md:text-3xl">
          {L(lang, "The Road to Poetic Naturalism", "通往诗意自然主义之路")}
        </h2>
        <p className={`mt-2 text-sm text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
          {L(
            lang,
            "1814–2016 · Click any node to explore the idea.",
            "1814–2016 · 点击任意节点探索思想。"
          )}
        </p>
        <div className="rule-flux mx-auto mt-4 h-px w-24" />
      </div>

      <ThroughlineBadge lang={lang} />

      {/* horizontal scrollable track */}
      <div
        ref={trackRef}
        className="scrollbar-thin overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="flex items-center"
          style={{ minWidth: "max-content", padding: "24px 36px" }}
        >
          {MILESTONES.map((m, i) => {
            const color = KIND_COLOR[m.kind];
            const isActive = active === i;
            const isSynthesis = m.kind === "synthesis";
            return (
              <div key={i} className="flex items-center" data-node={i}>
                <button
                  onClick={() => setActive(isActive ? null : i)}
                  className="flex flex-shrink-0 flex-col items-center gap-1.5 focus:outline-none"
                  style={{ scrollSnapAlign: "center", width: "90px" }}
                  aria-label={m.title[lang]}
                  aria-pressed={isActive}
                >
                  <NodeGlow color={color} active={isActive} isSynthesis={isSynthesis} />
                  <span
                    className="font-mono text-[0.47rem] uppercase leading-tight tracking-wider"
                    style={{ color: isActive ? color : "#6b7293" }}
                  >
                    {m.yearLabel[lang]}
                  </span>
                  <span
                    className={`text-center text-[0.58rem] font-semibold leading-tight ${lang === "zh" ? "zh" : ""}`}
                    style={{
                      color: isActive ? color : isSynthesis ? "#ff9b8f" : "#a8add0",
                      maxWidth: "82px",
                      filter: isActive ? `drop-shadow(0 0 6px ${color}88)` : "none",
                    }}
                  >
                    {m.label[lang]}
                  </span>
                </button>

                {i < MILESTONES.length - 1 && (
                  <ConnectorLine
                    fromColor={color}
                    toColor={KIND_COLOR[MILESTONES[i + 1].kind]}
                    index={i}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* detail card */}
      <div
        className={`transition-all duration-500 ${
          active !== null
            ? "mt-6 opacity-100"
            : "pointer-events-none mt-0 h-0 overflow-hidden opacity-0"
        }`}
      >
        {active !== null && (
          <DetailCard
            m={MILESTONES[active]}
            lang={lang}
            onClose={() => setActive(null)}
            onPrev={() =>
              setActive((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
            }
            onNext={() =>
              setActive((prev) =>
                prev !== null && prev < MILESTONES.length - 1 ? prev + 1 : prev
              )
            }
            index={active}
            total={MILESTONES.length}
          />
        )}
      </div>

      {/* legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {(
          [
            { kind: "determinism" as IdeaKind, en: "Classical Determinism", zh: "经典决定论" },
            { kind: "biology"     as IdeaKind, en: "Evolutionary Theory",   zh: "进化论" },
            { kind: "thermo"      as IdeaKind, en: "Statistical Mechanics",  zh: "统计力学" },
            { kind: "symmetry"    as IdeaKind, en: "Mathematical Physics",   zh: "数学物理" },
            { kind: "quantum"     as IdeaKind, en: "Quantum Foundations",    zh: "量子基础" },
            { kind: "particle"    as IdeaKind, en: "Particle Physics",       zh: "粒子物理" },
            { kind: "core"        as IdeaKind, en: "Core Theory",            zh: "核心理论" },
            { kind: "discovery"   as IdeaKind, en: "Experimental Physics",   zh: "实验物理" },
            { kind: "synthesis"   as IdeaKind, en: "Poetic Naturalism",      zh: "诗意自然主义" },
          ] as { kind: IdeaKind; en: string; zh: string }[]
        ).map(({ kind, en, zh }) => (
          <div key={kind} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: KIND_COLOR[kind],
                boxShadow: `0 0 6px ${KIND_COLOR[kind]}88`,
              }}
            />
            <span
              className={`font-mono text-[0.56rem] uppercase tracking-wider text-ink-500 ${lang === "zh" ? "zh" : ""}`}
            >
              {L(lang, en, zh)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
