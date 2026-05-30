"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ─── data ─────────────────────────────────────────────────────────────────── */

type Voice = {
  id: string;
  role: Bi;
  blurb: Bi;
  tabActive: string;
  border: string;
  bgFrom: string;
  textAccent: string;
};

const VOICES: Voice[] = [
  {
    id: "physicist",
    role:      { en: "Physicist",              zh: "物理学家" },
    blurb:     { en: "Core Theory, the arrow of time, what physics settles",
                 zh: "核心理论、时间之箭、物理学能回答什么" },
    tabActive: "border-iris-500/60 bg-iris-500/10 text-iris-400",
    border:    "border-iris-500/40",
    bgFrom:    "from-iris-500/[0.07]",
    textAccent:"text-iris-400",
  },
  {
    id: "philosopher",
    role:      { en: "Philosopher of Mind",    zh: "心灵哲学家" },
    blurb:     { en: "the hard problem, qualia, whether consciousness deflates",
                 zh: "意识难题、感质、意识是否可还原" },
    tabActive: "border-flux-500/60 bg-flux-500/10 text-flux-400",
    border:    "border-flux-500/40",
    bgFrom:    "from-flux-500/[0.07]",
    textAccent:"text-flux-400",
  },
  {
    id: "biologist",
    role:      { en: "Biologist",              zh: "生物学家" },
    blurb:     { en: "emergence, origin of life, design without a designer",
                 zh: "涌现、生命起源、无设计者的设计" },
    tabActive: "border-leaf-500/60 bg-leaf-500/10 text-leaf-400",
    border:    "border-leaf-500/40",
    bgFrom:    "from-leaf-500/[0.07]",
    textAccent:"text-leaf-400",
  },
  {
    id: "theist",
    role:      { en: "Theist",                 zh: "有神论者" },
    blurb:     { en: "fine-tuning, why there is something, limits of naturalism",
                 zh: "精细调节、为何有存在、自然主义的边界" },
    tabActive: "border-gold-500/60 bg-gold-500/10 text-gold-400",
    border:    "border-gold-500/40",
    bgFrom:    "from-gold-500/[0.07]",
    textAccent:"text-gold-400",
  },
  {
    id: "ethicist",
    role:      { en: "Ethicist",               zh: "伦理学家" },
    blurb:     { en: "constructed meaning, whether values can be built, is it enough",
                 zh: "建构的意义、价值观能否被创造、这是否足够" },
    tabActive: "border-gold-400/60 bg-gold-400/10 text-gold-300",
    border:    "border-gold-400/40",
    bgFrom:    "from-gold-400/[0.07]",
    textAccent:"text-gold-300",
  },
  {
    id: "skeptic",
    role:      { en: "Skeptic",                zh: "怀疑者" },
    blurb:     { en: "compatibilism redefines, deflation is contested, plausible ≠ proven",
                 zh: "相容论在重新定义、还原论有争议、可信不等于证明" },
    tabActive: "border-plasm-500/60 bg-plasm-500/10 text-plasm-400",
    border:    "border-plasm-500/40",
    bgFrom:    "from-plasm-500/[0.07]",
    textAccent:"text-plasm-400",
  },
];

/* ─── questions + voice answers ─────────────────────────────────────────────── */

type QA = {
  q: Bi;
  answers: Record<string, Bi>;
};

const QUESTIONS: QA[] = [
  {
    q: {
      en: "Is everyday physics really complete?",
      zh: "日常物理学真的完备了吗？",
    },
    answers: {
      physicist: {
        en: "Carroll's Core Theory claim is precise and defensible: the quantum field theory underlying atoms, molecules, and their interactions is complete in the sense that no new physics is needed to explain chemistry, biology, or neuroscience at the energy scales relevant to everyday life. This is not a claim that physics is finished at the cosmological or Planck scale — dark matter, quantum gravity, and the measurement problem remain open. It is the narrower but substantial claim that whatever supervenes on atomic physics is already governed by known equations. The philosophical consequence is that any proposed mechanism for consciousness, free will, or vitalistic biology that requires new fundamental forces must quantitatively face that constraint.",
        zh: "卡罗尔关于核心理论的论断是精确且可辩护的：在与日常生活相关的能量尺度上，支撑原子、分子及其相互作用的量子场论，在解释化学、生物学或神经科学时不需要任何新物理学——这个意义上它是完备的。这并不是说物理学在宇宙学或普朗克尺度上已经完成——暗物质、量子引力和测量问题仍然悬而未决。这是一个较窄但实质性的论断：任何附随于原子物理学的事物，都已由已知方程所支配。其哲学推论是：任何关于意识、自由意志或生命论生物学的机制，若需要新的基本力，就必须在量化层面面对这一约束。",
      },
      philosopher: {
        en: "The completeness of physics at atomic scales does not close the question it is often recruited to close. Even granting that every brain event is fully described by the Core Theory, the description is third-personal and dispositional — it tells you how matter is arranged and what it will do, not what it is like to be that arrangement. This explanatory gap is not a gap in the physics; it is a gap between physical vocabulary and phenomenal vocabulary. Carroll is aware of this and does not claim physics eliminates the hard problem. What is less clear is whether his poetic naturalism — acknowledging that higher-level descriptions are useful without adding new ontology — actually dissolves the problem or merely restates it at a different register.",
        zh: "原子尺度上物理学的完备性，并不能封闭它通常被用来封闭的那个问题。即使承认每个大脑事件都被核心理论完整描述，这个描述也是第三人称的、倾向性的——它告诉你物质是如何排列的以及它会做什么，而不是成为那种排列是什么感觉。这个解释鸿沟不是物理学中的鸿沟；而是物理词汇与现象词汇之间的鸿沟。卡罗尔意识到这一点，并不声称物理学消除了意识难题。不那么清楚的是，他的诗性自然主义——承认高层描述有用而不增加新本体论——是否真正化解了这个问题，还是只是在不同层面上重述了它。",
      },
      biologist: {
        en: "From the biological side, the completeness of the Core Theory is largely uncontroversial and has been tacitly assumed since the molecular biology revolution of the mid-twentieth century. DNA replication, protein folding, signal transduction, and neural firing are all, in principle, reducible to quantum electrodynamics — and this reduction has been progressively filled in, not just asserted. What the reductionist framework does not straightforwardly give you is the explanatory leverage to predict or understand life from the equations alone; the complexity is too high and the initial conditions too specific. Emergence in biology is not magic — no new forces — but it is epistemically real: you need the higher-level concepts to think usefully about living systems.",
        zh: "从生物学角度来看，核心理论的完备性基本上是无争议的，自二十世纪中期分子生物学革命以来就被默认假设。DNA复制、蛋白质折叠、信号转导和神经放电，原则上都可还原为量子电动力学——这种还原已逐步得到填充，而不仅仅是断言。还原论框架无法直接给你的，是仅从方程出发预测或理解生命的解释杠杆；复杂性太高，初始条件太特定。生物学中的涌现不是魔法——没有新的力——但它在认识论上是真实的：你需要高层概念来有效思考生命系统。",
      },
      theist: {
        en: "The completeness of physics at the scale of atoms and molecules is consistent with, and does not preclude, the claim that there is something further to say about why those laws are what they are. A universe governed by the Standard Model and general relativity is a universe with a very particular mathematical structure, calibrated constants, and initial conditions. Physics describes the grammar of nature with impressive precision; it does not explain why nature has any grammar at all, or why the grammar is one that permits complexity, life, and minds rather than a featureless void. The Core Theory's completeness within its domain is not an embarrassment for theism — it is what one might expect if the world is governed by rational structure all the way down.",
        zh: "原子和分子尺度上物理学的完备性，与——并且不排除——关于为何这些定律是这样的说法是相容的。一个由标准模型和广义相对论支配的宇宙，是一个具有非常特定的数学结构、精细调节常数和初始条件的宇宙。物理学以令人印象深刻的精度描述了自然的语法；它没有解释为什么自然有任何语法，或者为什么这个语法允许复杂性、生命和心灵，而不是一片特征虚空。核心理论在其领域内的完备性，对有神论来说不是尴尬——如果世界从头到尾都由理性结构所支配，这正是人们所期待的。",
      },
      ethicist: {
        en: "The physicalist picture matters for ethics less than it might appear. If human choices are constituted by physical processes without remainder, it does not follow that ethics reduces to physics or that moral reasoning is mere rationalisation of prior causes. The relevant level of description for ethics is the one at which agents, intentions, reasons, and consequences are legible — which is precisely the poetic-naturalist case for higher-level vocabulary. Carroll's picture is actually hospitable to ethics: if we are the kinds of systems that are genuinely responsive to reasons and that have the capacity to act otherwise in the relevant compatibilist sense, then moral evaluation retains its grip regardless of what is happening at the quantum field level.",
        zh: "物理主义图景对伦理学的影响比表面看起来要小。如果人类选择完全由物理过程构成，并不能推出伦理学还原为物理学，或者道德推理仅仅是对先前原因的合理化。伦理学相关的描述层面，是主体、意图、理由和后果清晰可辨的那个层面——这恰好是高层词汇的诗性自然主义论证。卡罗尔的图景实际上对伦理学很友好：如果我们是真正能回应理由的系统，并且在相关的相容论意义上有能力采取不同行动，那么无论量子场层面发生什么，道德评价都保持其约束力。",
      },
      skeptic: {
        en: "The Core Theory completeness claim is epistemically strong but philosophically overloaded in how it is often deployed. The argument from physics-is-complete to consciousness-is-just-physics runs the risk of a level-conflation: it establishes that no new fundamental forces are needed, then treats this as if it settles what phenomenal experience is. These are different questions. Moreover, 'complete at everyday energy scales' is a claim about predictive sufficiency, not ontological exhaustiveness. The history of physics suggests that claims of completeness made from within a successful paradigm have a poor track record: Newtonian mechanics was complete enough for planets and steam engines; it was not the last word. Intellectual humility here is not obscurantism — it is the appropriate scientific attitude toward boundary questions.",
        zh: "核心理论完备性论断在认识论上很强，但在通常的部署方式中被哲学上超载了。从\"物理学完备\"到\"意识只是物理学\"的论证，有层次混淆的风险：它确立了不需要新的基本力，然后把这当作已经解决了现象经验是什么的问题。这是不同的问题。此外，\"在日常能量尺度上完备\"是关于预测充分性的论断，而非本体论穷尽性的论断。物理学史表明，从成功范式内部提出的完备性论断记录糟糕：牛顿力学对行星和蒸汽机足够完备；但它不是最后一句话。在这里保持智识谦逊不是蒙昧主义——而是对边界问题的适当科学态度。",
      },
    },
  },

  {
    q: {
      en: "Does consciousness fit into naturalism?",
      zh: "意识能纳入自然主义吗？",
    },
    answers: {
      physicist: {
        en: "Physics as currently formulated has nothing to say about phenomenal consciousness — not because it is outside physics, but because physics describes the structure and dynamics of physical systems without addressing intrinsic experiential properties. The hard problem is not a contradiction for physics; it is simply outside the physics formalism's scope. What Carroll argues, and what is consistent with physics, is that consciousness correlates with physical processes in ways that will become increasingly well understood, and that invoking non-physical substances to explain it introduces explanatory complications without resolving the underlying puzzle. Whether there is a richer physical story to be told — panpsychism, integrated information theory — remains genuinely open.",
        zh: "目前表述的物理学对现象意识无话可说——不是因为它在物理学之外，而是因为物理学在不涉及内在经验属性的情况下描述物理系统的结构和动力学。意识难题对物理学来说不是矛盾；它只是超出了物理学形式主义的范围。卡罗尔论证的，以及与物理学相符的，是意识与物理过程的关联方式将变得越来越清晰，而诉诸非物质实体来解释它，会引入解释上的复杂性而不解决根本谜题。是否有更丰富的物理故事可讲——泛心论、整合信息论——仍然真正地开放。",
      },
      philosopher: {
        en: "This is the most contested ground in contemporary philosophy of mind, and Carroll's position — emergent consciousness, higher-level vocabulary, deflation of the hard problem — is a serious and widely-held view, but it is not the settled consensus it can sometimes be made to sound. The hard problem, as Chalmers formulated it, asks why any physical process should be accompanied by subjective experience at all. 'We will eventually explain the neural correlates' is an answer to the easy problems; it is a restatement of the hard problem. A naturalist deflation that says 'higher-level descriptions are useful fictions without extra ontology' still has to explain why the fiction is accompanied by genuine experience rather than nothing. The explanatory gap is not obviously closable by appeal to emergence alone.",
        zh: "这是当代心灵哲学中争议最激烈的领域，卡罗尔的立场——涌现意识、高层词汇、化解意识难题——是严肃且广泛持有的观点，但它并不是有时听起来像是的既定共识。查尔默斯所表述的意识难题，追问的是为什么任何物理过程都应该伴随着主观经验。'我们最终会解释神经相关物'是对简单问题的回答；它是对意识难题的重述。一个说'高层描述是有用的虚构，没有额外本体论'的自然主义化解，仍然需要解释为什么这个虚构伴随着真实的体验而不是什么都没有。单凭诉诸涌现，解释鸿沟显然不容易被弥合。",
      },
      biologist: {
        en: "From a biological standpoint, consciousness is an evolved capacity, and evolution does not produce structures without function. The subjective character of experience — the what-it-is-likeness — is not something evolution can directly select for; selection operates on behaviour and survival. This suggests that phenomenal experience is either a byproduct of cognitive capacities that are selected (the epiphenomenalist worry) or that it is causally relevant in ways we do not yet fully understand. Neither answer is clearly consistent with a strict eliminativist reading of naturalism. What evolutionary biology does strongly support is that consciousness is continuous with animal cognition rather than a human-unique faculty, and that it came in degrees over evolutionary time — which is itself significant for understanding its nature.",
        zh: "从生物学角度来看，意识是一种进化出的能力，进化不会产生没有功能的结构。体验的主观特征——那种\"感觉如何\"——不是进化能直接选择的；选择作用于行为和生存。这表明现象经验要么是被选择的认知能力的副产品（副现象论的担忧），要么它以我们尚未完全理解的方式与因果相关。这两个答案都不明显与严格消除主义的自然主义解读相符。进化生物学强有力支持的是：意识与动物认知是连续的，而非人类独有的能力，并且它在进化时间中是逐步出现的——这本身对理解其本质就意义重大。",
      },
      theist: {
        en: "The hard problem of consciousness is, I would argue, the most powerful empirical argument for the inadequacy of pure naturalism. It is not a gap-in-the-science-of-the-gaps argument; it is a structural claim about what kinds of facts can be explained by third-personal physical descriptions. No matter how complete our neuroscience becomes, the account will tell us everything about the structure and function of experience without ever touching the first-personal reality of what it is like to be in pain or to see red. This is not a failure of neuroscience; it is a category observation. Theistic metaphysics, which holds that minds are fundamental to reality rather than derivative of matter, faces the problem directly rather than deflating it — and that directness is, I think, an advantage.",
        zh: "意识难题，我认为，是对纯粹自然主义不充分性最有力的经验论证。这不是\"知识空白的上帝\"式论证；而是关于第三人称物理描述能解释什么类型事实的结构性主张。无论我们的神经科学变得多么完整，这个描述会告诉我们关于体验的结构和功能的一切，但永远不会触及处于疼痛或看到红色的第一人称现实。这不是神经科学的失败；这是一个分类观察。持有心灵是现实基础而非物质衍生物的有神论形而上学，是直面这个问题而非化解它——我认为，这种直面是一种优势。",
      },
      ethicist: {
        en: "The ethics of the consciousness question runs in both directions. If consciousness is fully explicable within naturalism, it becomes something we can understand better and potentially engineer — which raises pressing moral questions about which systems have morally relevant experience, and whether we might create, modify, or destroy conscious beings as part of ordinary technology. If consciousness is sui generis in a way that naturalism cannot capture, then moral status attaches to something we may be systematically unable to detect. Both scenarios have profound implications for how we think about animal welfare, artificial intelligence, and medical ethics. Carroll's framework is useful here not because it resolves the consciousness question but because it encourages clarity about what kind of question it is.",
        zh: "意识问题的伦理含义是双向的。如果意识可以在自然主义框架内完整解释，它就成为我们可以更好理解并可能工程化的东西——这引发了关于哪些系统具有道德上相关体验、以及我们是否可能作为普通技术的一部分创造、修改或摧毁有意识存在的迫切道德问题。如果意识以自然主义无法捕捉的方式是独一无二的，那么道德地位就附着于我们可能系统性地无法检测到的东西上。这两种情景对我们如何思考动物福利、人工智能和医学伦理都有深远影响。卡罗尔的框架在这里的用处，不在于它解决了意识问题，而在于它鼓励我们明确这是什么类型的问题。",
      },
      skeptic: {
        en: "Carroll's treatment of consciousness is admirably careful but risks being read as more conclusive than it is. Poetic naturalism — the view that higher-level descriptions are legitimate without implying ontological addition — is a reasonable heuristic, but it does not explain why there is subjective experience accompanying those descriptions rather than none. The move from 'emergence is real in chemistry' to 'consciousness is just emergence' glosses over the disanalogy: the emergent properties of water are third-personally observable, while phenomenal consciousness is known first-personally and the connection to its physical substrate remains deeply puzzling. A well-argued worldview is not a solved problem. Carroll has made the naturalist picture as coherent as it can currently be made; that coherence should be distinguished from completeness.",
        zh: "卡罗尔对意识的处理令人钦佩地谨慎，但有被读解为比实际更确凿的风险。诗性自然主义——高层描述是合法的而不隐含本体论增加的观点——是一个合理的启发方法，但它没有解释为什么伴随那些描述有主观体验而不是什么都没有。从'涌现在化学中是真实的'到'意识只是涌现'的举动，掩盖了不类比性：水的涌现属性是可以第三人称观察的，而现象意识是第一人称认识的，其与物质基底的联系仍然深度令人困惑。论证严密的世界观不等于已解决的问题。卡罗尔已经使自然主义图景尽可能连贯；这种连贯性应当与完备性区分开来。",
      },
    },
  },

  {
    q: {
      en: "Is compatibilist free will real free will?",
      zh: "相容论的自由意志是真正的自由意志吗？",
    },
    answers: {
      physicist: {
        en: "Physics constrains the free will debate without settling it. If the laws of physics are deterministic (or stochastic at the quantum level, but not in ways that help libertarian free will), then the sequence of brain states is fixed by prior causes. What physics cannot adjudicate is the normative question of what 'free will' should mean for purposes of moral responsibility, praise, and blame. The physicist can confirm that human decisions are physical processes; the physicist has no special authority over whether the relevant concept of freedom requires something more than what those processes provide. This is a question for philosophy, not for quantum field theory.",
        zh: "物理学约束了自由意志争论而不能解决它。如果物理定律是决定论的（或量子层面是随机的，但对自由意志论的自由意志没有帮助），那么大脑状态的序列由先前原因固定。物理学无法裁决的是规范性问题：出于道德责任、称赞和责备的目的，'自由意志'应该意味着什么。物理学家可以确认人类决策是物理过程；物理学家对自由的相关概念是否需要超出这些过程所提供的东西，没有特殊权威。这是哲学问题，而非量子场论问题。",
      },
      philosopher: {
        en: "Compatibilism is the dominant view in academic philosophy, and its main argument is compelling: what matters for moral responsibility is whether the agent acts from their own reasons, values, and deliberative processes — not whether those processes are themselves determined. A person who acts from threat of violence is unfree in the morally relevant sense; a person who acts from their settled character is free in the relevant sense, regardless of determinism. Where compatibilism faces genuine challenge is the source incompatibilism objection: if your character itself was shaped by factors you did not control — genetics, upbringing, circumstance — in what sense did you author the values you act from? Carroll's view handles this reasonably, but it does not dissolve the objection; it argues that the remaining freedom is worth caring about.",
        zh: "相容论是学术哲学中的主流观点，其主要论证是有说服力的：对于道德责任，重要的是行为者是否从自己的理由、价值观和审议过程中行动——而不是这些过程本身是否被决定。受暴力威胁而行动的人，在道德相关意义上是不自由的；从自己稳定性格中行动的人，在相关意义上是自由的，无论决定论如何。相容论面临真正挑战的地方是来源不相容论反对：如果你的性格本身被你无法控制的因素塑造——基因、成长环境、际遇——那么在何种意义上你是你行动所依据的价值观的作者？卡罗尔的观点对此处理得相当合理，但并未化解这个反对意见；它论证剩余的自由值得珍视。",
      },
      biologist: {
        en: "From evolutionary biology, the interesting question is not whether free will is compatible with determinism but why organisms evolved decision-making mechanisms that feel deliberative. The phenomenology of choice — weighing options, experiencing uncertainty, feeling responsible for outcomes — is not a residue of pre-scientific thinking; it is a functional architecture that arose because it was adaptive. Organisms that represent themselves as choosing agents, track their own reasons, and hold themselves and others responsible coordinate better and learn faster than organisms that do not. This does not settle the metaphysical question, but it suggests that the free-will vocabulary is tracking something real about the causal structure of deliberation — even if that structure is itself fully physical.",
        zh: "从进化生物学来看，有趣的问题不是自由意志是否与决定论相容，而是有机体为何进化出感觉是审议性的决策机制。选择的现象学——权衡选项、感受不确定性、感到对结果负责——不是前科学思维的残留；而是因适应性而出现的功能架构。将自己表征为选择主体、追踪自身理由、对自己和他人追责的有机体，比不这样做的有机体协调得更好、学习得更快。这不能解决形而上学问题，但表明自由意志词汇追踪了关于审议因果结构的真实内容——即使该结构本身完全是物理的。",
      },
      theist: {
        en: "The compatibilist move is philosophically sophisticated, but I think it changes the subject rather than answering it. The traditional concern about free will is whether human beings are genuinely self-originating agents, capable of acting otherwise in an absolute sense — and that concern is motivated by the felt reality of moral responsibility, not by a philosophical technicality. When compatibilists redefine freedom as 'acting from your own reasons given determinism,' they preserve the label but surrender the metaphysical substance that made it matter. The strength of theism here is not a simple appeal to miracles but the coherence of a picture in which persons are real agents, not just convenient nodes in a causal network — where my choices contribute something irreducible to the unfolding of events.",
        zh: "相容论的举动在哲学上是精妙的，但我认为它改变了论题而非回答了它。关于自由意志的传统关切，是人类是否是真正自我起源的行为者，能够在绝对意义上采取不同行动——这种关切由道德责任的感受现实所驱动，而非哲学技术细节。当相容论者将自由重新定义为'在决定论下从自己的理由行动'时，他们保留了标签但放弃了使其重要的形而上学实质。有神论在这里的力量，不是简单诉诸奇迹，而是一幅图景的连贯性：在其中，人是真实的行为者，不仅仅是因果网络中方便的节点——我的选择对事件展开贡献了某种不可还原的东西。",
      },
      ethicist: {
        en: "For ethics, compatibilism is not just defensible — it is necessary. A system of moral responsibility that requires libertarian free will for its legitimacy cannot get off the ground, because libertarian free will (agent causation, contra-causal freedom) is either incoherent or empirically unsupported. Compatibilism preserves what matters: the distinction between actions done freely and actions done under compulsion, the rationality of holding people responsible for expressions of their character, and the value of practices of praise and blame in shaping future behavior. What compatibilism cannot fully deliver is the narrative of ultimate desert — the intuition that a person can be wholly deserving of punishment or reward independent of the circumstances that made them who they are. That intuition may need revising rather than accommodating.",
        zh: "对于伦理学，相容论不仅是可辩护的——它是必要的。一个其合法性需要自由意志论的自由意志的道德责任体系，根本无法起步，因为自由意志论的自由意志（主体因果性、反因果自由）要么是不连贯的，要么是经验上不受支持的。相容论保留了重要的东西：自由行动与被迫行动之间的区分、基于性格表达追究责任的理性性、以及称赞和责备实践在塑造未来行为方面的价值。相容论无法完全提供的是终极应得的叙事——一个人可以独立于使其成为现在这样的际遇，完全应得惩罚或奖励的直觉。那个直觉可能需要修正而非迁就。",
      },
      skeptic: {
        en: "The standard compatibilist reply to incompatibilism is that the incompatibilist is using the wrong concept of freedom — a concept too tied to folk metaphysics to be scientifically useful. This may be true, but it sidesteps rather than answers the intuition driving the concern. The problem is not just semantic: people care about free will because they care about whether their choices are really theirs, whether they could really have done otherwise, whether praise and blame track genuine desert. Compatibilism answers a tidied-up version of that question and calls it the original. The skeptic's position is not that compatibilism is false, but that it is incomplete — and that the incompleteness matters especially when the stakes are high, as in criminal punishment, where 'you acted from your reasons' is a thin reed on which to hang significant suffering.",
        zh: "对不相容论的标准相容论回应是，不相容论者使用了错误的自由概念——一个与民间形而上学联系太紧密而无法具有科学用处的概念。这可能是真的，但它回避而非回答了驱动关切的直觉。问题不仅仅是语义上的：人们关心自由意志，是因为他们关心自己的选择是否真的是自己的，是否真的可以采取不同行动，赞扬和责备是否追踪了真正的应得。相容论回答了该问题的整洁版本，并称其为原始版本。怀疑者的立场不是相容论是错误的，而是它是不完整的——而这种不完整性在风险极高时尤为重要，如在刑事惩罚中，'你从自己的理由行动'是用来支撑巨大苦难的薄弱支撑。",
      },
    },
  },

  {
    q: {
      en: "Can meaning be constructed, or only found?",
      zh: "意义能被建构，还是只能被发现？",
    },
    answers: {
      physicist: {
        en: "Physics is silent on meaning, but the question is not outside the scope of naturalism — it is just not a question for physics specifically. The relevant observation is that meaning, like temperature or fitness, may be a higher-level concept that is real and causally potent without being reducible to fundamental physics. Whether meaning is 'found' or 'constructed' may be a false dichotomy from the physicist's perspective: both descriptions are ways of talking about the same underlying process in which human cognitive systems assign significance to events, states, and relationships. The interesting empirical questions — which things humans reliably find meaningful, and why, given their evolutionary history — are accessible to science even if the deeper metaphysical question remains open.",
        zh: "物理学对意义沉默，但这个问题并不超出自然主义的范围——它只是不特定属于物理学的问题。相关观察是：意义，像温度或适应度一样，可能是一个高层概念，它是真实且具有因果效力的，而不需要还原为基本物理学。从物理学家的角度来看，意义是'发现的'还是'建构的'可能是个虚假二分：两种描述都是谈论同一基本过程的方式，在这个过程中，人类认知系统赋予事件、状态和关系以意义。有趣的经验问题——人类可靠地发现什么是有意义的，以及为什么，基于他们的进化历史——即使更深的形而上学问题仍然开放，也是科学可以探究的。",
      },
      philosopher: {
        en: "The construction-versus-discovery framing maps onto a deep disagreement in metaethics between constructivists (meaning and value are products of human attitudes, commitments, and practices) and realists (there are objective truths about meaning that we may discover or fail to discover). Carroll's naturalism places him in the constructivist or quasi-realist camp. The strongest challenge to this view is not the 'merely constructed' objection — few constructivists think construction is 'mere' — but the normative authority problem: if meaning is constructed by human attitudes, what governs which constructions are better or worse? Carroll's answer appeals to what we actually care about on reflection. This is plausible, but it requires that we have reliable access to what we reflectively care about, which is itself philosophically contested.",
        zh: "建构与发现的框架映射到元伦理学中建构主义者（意义和价值是人类态度、承诺和实践的产物）与实在论者（关于意义有我们可能发现或未能发现的客观真理）之间的深层分歧。卡罗尔的自然主义将他置于建构主义或准实在论阵营。对该观点最强的挑战，不是'仅仅是建构的'反对——很少有建构主义者认为建构是'仅仅的'——而是规范权威问题：如果意义由人类态度建构，什么支配着哪些建构更好或更差？卡罗尔的回答诉诸于我们经反思真正在乎的东西。这是合理的，但它要求我们能可靠地获知我们经反思所关心的，而这本身在哲学上是有争议的。",
      },
      biologist: {
        en: "Evolutionary biology offers a third option between pure construction and pure discovery: meaning-responsiveness is an adaptation. Humans are constitutionally oriented toward certain sources of meaning — attachment, contribution, narrative coherence, transcendence — not because they have discovered objective values or constructed arbitrary preferences, but because these orientations were selected across millions of years because organisms that had them flourished. This does not make meaning illusory or merely subjective; the functional reality of an evolved meaning-orientation is as real as the functional reality of an evolved immune system. It does suggest, however, that the content of what we find meaningful is constrained by our evolutionary heritage and not freely chosen, which complicates the pure construction story.",
        zh: "进化生物学提供了纯粹建构和纯粹发现之间的第三种选择：对意义的响应是一种适应。人类在构成上朝向某些意义来源——依恋、贡献、叙事连贯性、超越——不是因为他们发现了客观价值或建构了任意偏好，而是因为这些朝向在数百万年中被选择，因为拥有它们的有机体蓬勃发展。这不使意义成为虚幻的或纯粹主观的；进化意义朝向的功能现实，与进化免疫系统的功能现实一样真实。然而，这确实表明，我们认为有意义的内容受到进化遗产的约束，不能自由选择，这使纯粹建构的故事变得复杂。",
      },
      theist: {
        en: "The existentialist and naturalist traditions both face a structural problem with constructed meaning: construction presupposes a constructor with preferences and values, but in a purely naturalist universe, those preferences are themselves products of processes indifferent to meaning. The regress has to terminate somewhere. If it terminates in evolved preferences that are 'just facts about us,' then the meaning we construct is contingent in a way that can feel unmoored — we could easily have been the kind of creatures that found different things meaningful, or nothing at all. The theistic alternative is not that meaning is simply 'handed to us' but that the universe has a meaningful structure we are equipped to participate in — which grounds the significance of our constructions without reducing them to mere preference satisfaction.",
        zh: "存在主义和自然主义传统在建构意义方面都面临一个结构性问题：建构预设了一个有偏好和价值观的建构者，但在纯粹自然主义的宇宙中，这些偏好本身是对意义漠然的过程的产物。这个回退必须在某处终止。如果它终止于'只是关于我们的事实'的进化偏好，那么我们建构的意义就是偶然的，感觉会是漂浮无根的——我们很容易成为发现不同事物有意义、或什么都无意义的生物。有神论的替代方案不是意义简单地'被给予我们'，而是宇宙有一种我们有能力参与的有意义结构——这支撑了我们建构的意义，而不把它们还原为纯粹的偏好满足。",
      },
      ethicist: {
        en: "For practical ethics, the construction-discovery debate matters less than it might seem, because the content of constructed meaning tends to converge with what objectivists claim is discovered. Humans who reflect carefully tend to find the same broad categories meaningful: close relationships, purposive work, contribution to something larger than themselves, understanding, aesthetic experience. This convergence — predicted by both robust naturalism and mild moral realism — suggests that the distinction between construction and discovery is less important than the quality of the reflective process. Carroll's picture asks us to take our values seriously, interrogate them, and build a life around what we find on reflection. That is a substantive normative recommendation regardless of whether values are ultimately constructed or real.",
        zh: "对于实践伦理学，建构-发现争论不如它看起来那么重要，因为建构意义的内容往往与客观主义者所称发现的内容趋同。仔细反思的人类倾向于发现相同的宽泛类别是有意义的：亲密关系、有目的的工作、对比自己更大的事物的贡献、理解、审美体验。这种趋同——由强健自然主义和温和道德实在论都预测到——表明建构与发现之间的区分不如反思过程的质量重要。卡罗尔的图景要求我们认真对待自己的价值观，审视它们，并围绕我们经反思所发现的东西建立生活。无论价值观最终是建构的还是真实的，这都是一个实质性的规范建议。",
      },
      skeptic: {
        en: "Carroll's account of meaning is among the most personally compelling parts of the book, and the basic move — you can build a life worth living without cosmic guarantees — is one I find persuasive. The skeptic's concern is not with the conclusion but with the weight placed on reflection. 'What we find meaningful on reflection' is assumed to be more reliable than unreflective preference, but reflection can also be self-deceived, culturally conditioned, and anxiety-driven. Psychological research consistently shows that humans are poor predictors of what will make them happy, and that reflective judgments about meaning are heavily shaped by narrative templates that may not fit the actual lives people are living. The construction story is right that we are active participants in our own meaning-making; it may underestimate how much the raw material is given rather than chosen.",
        zh: "卡罗尔关于意义的叙述是书中最个人上引人共鸣的部分之一，基本举动——你可以在没有宇宙保证的情况下建立值得过的生活——是我认为有说服力的。怀疑者的关切不在于结论，而在于对反思的依赖程度。'我们经反思认为有意义的东西'被假设比未经反思的偏好更可靠，但反思也可能是自欺的、文化条件化的和焦虑驱动的。心理学研究一致表明，人类对什么会让自己快乐的预测很差，关于意义的反思性判断受到可能不适合人们实际生活的叙事模板的重大影响。建构故事在我们是自身意义建构的积极参与者这一点上是正确的；它可能低估了原材料有多大程度上是给定的而非选择的。",
      },
    },
  },

  {
    q: {
      en: "Why is there something rather than nothing?",
      zh: "为何有存在，而不是什么都没有？",
    },
    answers: {
      physicist: {
        en: "Physics can push the question back to earlier and simpler conditions — inflation, quantum fluctuation, a prior state — but cannot answer why there is any physical reality at all. Every physical explanation assumes a set of laws and an initial state; the question 'why those laws?' is not a physics question. Carroll is honest about this: the 'something rather than nothing' question may not have an answer within any scientific framework, or it may be a confused question arising from applying causal reasoning outside the domain where it is applicable. The strongest physics-adjacent response is that 'nothing' may be inherently unstable — some versions of quantum gravity suggest that no-space-no-time is not a stable solution — but this still does not explain why any physical reality exists rather than no reality at all.",
        zh: "物理学可以把问题推回更早、更简单的条件——暴胀、量子涨落、先前状态——但无法回答为什么存在任何物理现实。每一个物理解释都预设了一组定律和一个初始状态；'为什么是那些定律？'不是一个物理学问题。卡罗尔对此是诚实的：'有存在而非虚无'的问题可能在任何科学框架内都没有答案，或者它可能是一个将因果推理应用于其适用范围之外而产生的混乱问题。最强的物理学相邻回应是'虚无'可能本质上不稳定——量子引力的某些版本表明无空间无时间不是稳定解——但这仍然无法解释为什么存在任何物理现实而非根本没有现实。",
      },
      philosopher: {
        en: "This is the oldest metaphysical question, and it remains genuinely open. Leibniz thought the answer must lie in a necessary being whose essence entails existence. Heidegger thought the question revealed Being as the ground of beings and could not be answered in terms of beings. Contemporary analytic philosophers are divided: some think it is a confused pseudo-question (there is no coherent 'nothing' to contrast with something); others think it is a genuine question that no explanation can answer without presupposing something. Carroll's response — accept it as a brute fact or retreat to 'the question doesn't make sense' — is intellectually honest but may feel unsatisfying. The dissatisfaction may be philosophically significant rather than a failure of nerve.",
        zh: "这是最古老的形而上学问题，它仍然真正地开放。莱布尼茨认为答案必须在于一个其本质蕴含存在的必然存在者。海德格尔认为这个问题揭示了存在作为存在者的基础，无法用存在者的术语来回答。当代分析哲学家意见分歧：一些人认为这是一个混乱的伪问题（没有连贯的'虚无'可以与某物相对照）；另一些人认为这是一个真实的问题，任何解释都无法在不预设某物的情况下回答。卡罗尔的回应——接受它作为不可进一步解释的事实，或退到'这个问题没有意义'——是智识上诚实的，但可能感觉不令人满足。这种不满足感可能在哲学上是有意义的，而非怯懦的表现。",
      },
      biologist: {
        en: "Biology can offer only a weak answer here: once there is something — laws of physics, matter, energy — evolutionary processes can explain the emergence of complexity, life, and minds without remainder. The scope of evolutionary explanation is, in one direction, extremely powerful: from replicating polymers to human consciousness is a continuous, broadly understood trajectory. But evolutionary biology has nothing to say about the existence of the physical substrate it operates on. The question of why there is something rather than nothing is above biology's pay grade, and biologists who pretend otherwise are speaking outside their domain. What biology does contribute is a profound demonstration that mind-like properties can emerge from non-mind-like matter — which is a data point relevant to the larger debate even if it does not resolve it.",
        zh: "生物学在这里只能提供一个弱答案：一旦有了某物——物理定律、物质、能量——进化过程就可以完整解释复杂性、生命和心灵的涌现。进化解释的范围，在一个方向上是极为强大的：从复制聚合物到人类意识，是一个连续的、大体上可理解的轨迹。但进化生物学对其所运作的物理基底的存在无话可说。为何有存在而非虚无的问题，超出了生物学的职责范围，假装不是如此的生物学家是在越界发言。生物学确实贡献的，是对类心灵属性可以从非类心灵物质中涌现的深刻示范——即使这不能解决更大的争论，也是与之相关的数据点。",
      },
      theist: {
        en: "This question is where theism has historically felt most at home, not because theism makes it easy, but because it takes the question seriously as a question. The cosmological argument does not simply say 'God did it'; in its Leibnizian form it says that contingent things — things that exist but might not have — require an explanation that does not itself trace back to contingency. The conclusion is a necessary being whose existence is self-grounded. Carroll responds that the universe might itself be such a necessary being, or that the question is unanswerable. Both responses are possible, but they concede that the question has force. The theist's advantage is not that God is an obvious answer; it is that invoking a self-subsistent ground of being is a coherent response to a question that brute-fact naturalism simply declines to answer.",
        zh: "这个问题是有神论历史上感觉最自在的地方，不是因为有神论使它变得容易，而是因为它认真地把这个问题当作问题对待。宇宙论论证不是简单地说'上帝做到了'；在其莱布尼茨形式中，它说偶然事物——那些存在但可能不存在的事物——需要一个本身不追溯到偶然性的解释。结论是一个存在自我奠基的必然存在者。卡罗尔回应说，宇宙本身可能是这样一个必然存在者，或者这个问题是无法回答的。两个回应都是可能的，但它们承认这个问题是有力量的。有神论者的优势不在于上帝是一个明显的答案；而在于援引一个自存的存在基础，是对暴力事实自然主义简单拒绝回答的问题的连贯回应。",
      },
      ethicist: {
        en: "The why-something-rather-than-nothing question matters for ethics in an indirect but real way. If existence is a brute fact without ground or purpose, then human value-creation is unmoored from any larger context of significance — which is Carroll's starting point and something he considers liveable. If existence has a ground — whether rational necessity, a creative mind, or some other principle — then human value-making participates in something larger than itself, which many people find both more motivating and more rationally satisfying. Carroll is correct that the ethical life does not require settling this question; you can love people, pursue justice, and build meaning regardless. But the question of whether that meaning is embedded in something or floating free is not merely academic — it shapes the texture of how that meaning is experienced.",
        zh: "为何有存在而非虚无的问题，以间接但真实的方式对伦理学重要。如果存在是一个没有根据或目的的不可进一步解释的事实，那么人类的价值创造就脱离了任何更大的意义语境——这是卡罗尔的出发点，也是他认为可以接受的东西。如果存在有一个根据——无论是理性必然性、创造性心灵还是某种其他原则——那么人类的价值建构就参与了比自身更大的东西，许多人认为这既更具激励性又在理性上更令人满足。卡罗尔是正确的，伦理生活不需要解决这个问题；无论如何你都可以爱人、追求正义、建构意义。但那个意义是嵌入在某物之中还是自由漂浮的问题，不仅仅是学术性的——它塑造了那种意义被体验的质感。",
      },
      skeptic: {
        en: "The 'why something rather than nothing' question has two failure modes: taking it too seriously and taking it not seriously enough. Carroll steers toward the latter — treating it as potentially confused or unanswerable — and this is a respectable intellectual move. The skeptic's concern is that the deflation is too quick. Leibniz's question has generated serious formal work in modal metaphysics and in the philosophy of physics, and the various 'the question is confused' responses have not all landed convincingly. At the same time, theism's answer — a necessary being — faces the regress problem: if the universe requires explanation, why doesn't the theistic ground? 'God is self-explanatory' is a claim that requires the same justification as 'the universe is self-explanatory.' Both sides should be more honest about how much this question outruns current tools for answering it.",
        zh: "'为何有存在而非虚无'这个问题有两种失败模式：过于认真地对待它和不够认真地对待它。卡罗尔倾向于后者——把它当作可能混乱或无法回答的问题——这是一个可敬的智识举动。怀疑者的关切是这种化解来得太快。莱布尼茨的问题在模态形而上学和物理哲学中产生了严肃的形式化工作，而各种'这个问题是混乱的'回应并非都令人信服地着陆。与此同时，有神论的回答——一个必然存在者——面临回退问题：如果宇宙需要解释，为什么有神论的根据不需要？'上帝是自我解释的'是一个需要与'宇宙是自我解释的'相同证明的主张。双方都应该对这个问题在多大程度上超出了当前回答它的工具，更加诚实。",
      },
    },
  },
];

/* ─── component ─────────────────────────────────────────────────────────────── */

export default function CarrollAnalyst() {
  const { lang } = useLang();
  const [qi, setQi] = useState(0);
  const [voiceId, setVoiceId] = useState("physicist");

  const q = QUESTIONS[qi];
  const activeVoice = VOICES.find((v) => v.id === voiceId) ?? VOICES[0];

  return (
    <div className="panel rounded-2xl p-5 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">

        {/* ── left: question selector ─────────────────────────────────────── */}
        <div>
          <div className="label-mono mb-4">
            {lang === "zh" ? "选择一个问题" : "choose a question"}
          </div>
          <div className="space-y-2">
            {QUESTIONS.map((item, i) => (
              <button
                key={i}
                onClick={() => setQi(i)}
                className={`block w-full rounded-lg border px-4 py-2.5 text-left text-sm leading-snug transition ${
                  i === qi
                    ? "border-iris-500/50 bg-iris-500/10 text-iris-300"
                    : "border-ink-100/10 text-ink-400 hover:border-iris-500/30 hover:text-ink-200"
                }`}
              >
                <T v={item.q} />
              </button>
            ))}
          </div>
        </div>

        {/* ── right: voice selector + answer ──────────────────────────────── */}
        <div>
          {/* voice tabs */}
          <div className="flex flex-wrap gap-2">
            {VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setVoiceId(voice.id)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] transition ${
                  voiceId === voice.id
                    ? voice.tabActive
                    : "border-ink-100/10 text-ink-500 hover:text-ink-200"
                }`}
              >
                <T v={voice.role} />
              </button>
            ))}
          </div>

          {/* selected question heading */}
          <h3 className="display mt-5 text-xl leading-snug text-ink-50 md:text-2xl">
            <T v={q.q} />
          </h3>

          {/* answer card */}
          <div
            key={`${qi}-${voiceId}`}
            className={`lang-fade mt-4 rounded-xl border ${activeVoice.border} bg-gradient-to-br ${activeVoice.bgFrom} to-transparent p-5`}
          >
            {/* voice label */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`label-mono ${activeVoice.textAccent}`}>
                <T v={activeVoice.role} />
              </span>
              <span className="text-ink-600">·</span>
              <span className="label-mono text-ink-500">
                <T v={activeVoice.blurb} />
              </span>
            </div>

            {/* answer body */}
            <p className="mt-3 font-serif text-base leading-relaxed text-ink-100 md:text-lg">
              <T v={q.answers[activeVoice.id]} />
            </p>
          </div>

          {/* epistemic footnote */}
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            {lang === "zh"
              ? "每条回答力求忠实于该视角的主流理解，公平呈现竞争性观点，并标注何处仍是开放问题。六位声音一致处，是坚实的地基；分歧处——尤其是有神论者与怀疑者发声时——才是真正的前沿。这是一部分析性伴读，不引用、不转述书中原文。"
              : "Each answer aims to be faithful to its perspective's mainstream understanding, to present competing views fairly, and to flag genuinely open questions. Where the six voices agree, the ground is solid. Where they diverge — especially when the Theist and Skeptic speak — that is the real frontier. This is analytical commentary, not a reproduction of the book."}
          </p>
        </div>

      </div>
    </div>
  );
}
