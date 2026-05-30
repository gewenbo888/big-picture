import { Bi } from "./lang";

export type Panel = { t: Bi; d: Bi };

/* ═══════════════════════════════ THE TEN THEMES ═══════════════════════════════
   An ANALYTICAL COMPANION to Sean Carroll's "The Big Picture" (© 2016 Sean
   Carroll). Each section is original commentary and synthesis — a thematic map of
   the book's argument, in our own words, with a fair, two-handed edge that marks
   the contested philosophical claims as contested. This is a study guide, NOT the
   book; we explain and attribute throughout. id maps to a visualization in
   BigPictureEngine.tsx. */

export interface Section {
  num: string;
  id: string;
  kicker: Bi;
  title: Bi;
  sub: Bi;
  body: Bi;
  ask: Bi;
}

export const SECTIONS: Section[] = [
  {
    num: "01",
    id: "naturalism",
    kicker: { en: "Theme I · the frame", zh: "主题一 · 那个框架" },
    title: { en: "Poetic Naturalism", zh: "诗性自然主义" },
    sub: { en: "One world, described by many true vocabularies", zh: "一个世界，由许多真实的词汇所描述" },
    body: {
      en: "The whole book hangs on a single stance Carroll names poetic naturalism. The 'naturalism' half is the claim that there is only one world, the natural one, governed by impersonal laws — no separate spiritual realm, no purpose woven into the cosmos. The 'poetic' half is the rescue from bleakness: although there is just one kind of stuff, there are many equally true ways of talking about it, each valid at its own level. A human being is, truly, a collection of quantum fields; she is also, just as truly, a person who hopes and decides. These vocabularies do not compete; they are different, mutually compatible descriptions of the same underlying reality, and a description earns its keep by being useful and consistent within its domain. The companion frames this as the book's master move: it refuses the false choice between 'science says you're just atoms' and 'there must be something more'. There is nothing more than the natural world — and that world contains, as real higher-level patterns, everything we care about.",
      zh: "全书系于卡罗尔所命名的一种立场之上：诗性自然主义。『自然主义』那一半，是这样的主张：只有一个世界，即自然的世界，由非人格的定律所支配——没有独立的灵性领域，没有被编入宇宙的目的。『诗性』那一半，则是从荒凉中的拯救：尽管只有一种质料，却有许多同样真实的谈论它的方式，每一种在它自己的层级上有效。一个人，确实是一团量子场的集合；她也同样确实地，是一个会希望、会抉择的人。这些词汇并不彼此竞争；它们是对同一个底层实在的、不同的、彼此相容的描述，而一个描述之所以站得住脚，在于它在其领域内有用且自洽。本解读把这框定为本书的总纲之着：它拒绝那个虚假的二选一——『科学说你不过是原子』与『一定还有更多』。除了自然的世界，再没有更多——而那个世界，作为真实的高层模式，包含着我们所在意的一切。",
    },
    ask: { en: "If 'just atoms' and 'a person who decides' are both true, which one is real?", zh: "若『不过是原子』与『一个会抉择的人』都为真，哪一个，才是真实的？" },
  },
  {
    num: "02",
    id: "bayes",
    kicker: { en: "Theme II · the method", zh: "主题二 · 那套方法" },
    title: { en: "How We Know", zh: "我们如何知道" },
    sub: { en: "Belief as credence, updated by evidence", zh: "信念即可信度，由证据来更新" },
    body: {
      en: "Before defending a worldview, Carroll lays out how to weigh one — and his answer is Bayesian. We never have certainty; we have credences, degrees of belief between zero and one, which we update as evidence arrives. A good thinker holds many 'planets of belief' — coherent webs of ideas — and asks not 'is this proven?' but 'given everything I know, how does this evidence shift my confidence?' Crucially, the evidence for a big-picture view is not one knockout fact but the slow accumulation of many small updates: each finding that fits naturalism better than its rivals nudges the needle. The companion highlights why this matters for the book's honesty: Carroll is not claiming proof that the universe is godless and purposeless. He is arguing that, weighing all the evidence in the Bayesian way, naturalism has become by far the most credible big picture — while remaining, like every empirical claim, revisable. It is a method that builds confidence without ever pretending to certainty, and it is the engine beneath every later chapter.",
      zh: "在为一种世界观辩护之前，卡罗尔先铺陈如何称量一种世界观——而他的回答是贝叶斯式的。我们从无确定性；我们拥有的是可信度，介于零与一之间的信念程度，随证据的到来而更新。一个好的思考者，持有许多『信念的行星』——自洽的理念之网——并且问的不是『这被证明了吗？』，而是『鉴于我所知的一切，这份证据如何挪动我的信心？』关键在于：支持一种大图景的证据，不是某一个一锤定音的事实，而是许多微小更新的缓慢累积：每一项比起其对手更契合自然主义的发现，都把指针轻轻推一下。本解读凸显这为何关乎本书的诚实：卡罗尔并未声称证明了宇宙无神、无目的。他论证的是：以贝叶斯的方式称量全部证据，自然主义已成为迄今最可信的大图景——同时，一如每一个经验主张，仍是可修正的。这是一套不假装确定、却建立起信心的方法，也是其后每一章之下的引擎。",
    },
    ask: { en: "Can a worldview be 'most credible' yet never proven — and is that enough?", zh: "一种世界观能否『最为可信』、却永不被证明——而那，够了吗？" },
  },
  {
    num: "03",
    id: "coretheory",
    kicker: { en: "Theme III · the foundation", zh: "主题三 · 那个基础" },
    title: { en: "The Core Theory", zh: "核心理论" },
    sub: { en: "The physics of everyday life is already understood", zh: "日常生活的物理，已经被理解" },
    body: {
      en: "Carroll's most provocative scientific claim is also one of his most defensible: the laws of physics underlying everyday life are completely known. The 'Core Theory' — quantum field theory combining the particles and forces of the Standard Model with Einstein's gravity in its weak-field regime — accounts, he argues, for every process relevant to people, planets and chemistry. This does not mean physics is finished; deep mysteries remain (dark matter, quantum gravity, the origin of the universe). It means those mysteries live at extreme energies and scales irrelevant to your morning coffee or your beating heart. The companion stresses the philosophical payload, because it is what the rest of the book leans on: if the Core Theory really is complete for everyday matter, then there is no room for new forces or substances to carry a soul, channel psychic powers, or let mind move matter outside the known physics. Any 'something more' would have shown up as a deviation in experiments we have already done with exquisite precision. The claim is bold and contested at its philosophical edges, but its physics core is mainstream.",
      zh: "卡罗尔最具挑衅性的科学主张，也是他最站得住脚的主张之一：支配日常生活的物理定律，已被完全知晓。『核心理论』——量子场论，把标准模型的粒子与力，和弱场区域中爱因斯坦的引力结合起来——他论证道，足以解释每一个与人、行星和化学相关的过程。这并不意味着物理学已经完结；深邃的谜团仍在（暗物质、量子引力、宇宙的起源）。它意味着那些谜团栖居于与你的晨咖啡或你跳动的心脏无关的、极端的能量与尺度上。本解读强调其哲学的载荷，因为这正是本书其余部分所倚靠之物：若核心理论对日常物质确实完备，那么便没有余地，让新的力或物质去承载一个灵魂、引导通灵之力，或让心灵在已知物理之外撼动物质。任何『更多之物』，都本该作为一项偏差，在我们早已以精妙的精度做过的实验中现身。这一主张大胆、且在其哲学的边缘有争议，但它的物理内核，是主流。",
    },
    ask: { en: "If everyday physics is closed, where could a soul or a psychic force hide?", zh: "若日常的物理已经闭合，一个灵魂、或一种通灵之力，又能藏在何处？" },
  },
  {
    num: "04",
    id: "time",
    kicker: { en: "Theme IV · the arrow", zh: "主题四 · 那支箭" },
    title: { en: "Time & Entropy", zh: "时间与熵" },
    sub: { en: "Why the future feels different from the past", zh: "为何未来感觉起来，与过去不同" },
    body: {
      en: "The deepest laws of physics are nearly symmetric in time — they look almost the same run forwards or backwards. Yet our lives are drenched in a direction: we remember the past, not the future; eggs break but never unbreak; we age. Carroll's account, following Boltzmann, locates the arrow of time not in the laws but in a boundary condition: the early universe was in a state of extraordinarily low entropy — the 'past hypothesis' — and ever since, entropy has been climbing toward disorder, and that climb is the arrow. Memory, cause and effect, growth and decay, even our sense of making choices that affect a still-open future, all ride on this one-way slide. The companion underlines how much work this does for the book: the arrow of time is not an extra ingredient but a consequence of where the universe started, and from it Carroll derives why we can influence the future but not the past, and why complexity and life are possible at all. It reframes our most intimate experience — that time flows — as an emergent feature of a low-entropy beginning.",
      zh: "物理学最深的定律，在时间上几乎是对称的——正放或倒放，看起来几乎一样。然而我们的生活，浸透着一个方向：我们记得过去，而非未来；蛋会碎，却从不复原；我们会老去。卡罗尔的解释，追随玻尔兹曼，把时间之箭定位于定律之外、一个边界条件之中：早期宇宙处于一种极其低熵的状态——『过去假设』——而自那以后，熵一直朝无序攀升，而那攀升，正是那支箭。记忆、因与果、生长与衰败，乃至我们『做出影响一个仍敞开之未来的抉择』之感，全都骑在这一道单向的滑落之上。本解读强调这为本书做了多少工作：时间之箭并非一味额外的成分，而是『宇宙从何处起步』的一个后果，而卡罗尔由此推导出：为何我们能影响未来、却不能影响过去，以及为何复杂与生命竟成为可能。它把我们最亲密的经验——时间在流动——重新框定为一个低熵开端的涌现特征。",
    },
    ask: { en: "Is the flow of time a law of nature — or a memory of how the universe began?", zh: "时间的流动，是自然的一条定律——还是对宇宙如何开端的一段记忆？" },
  },
  {
    num: "05",
    id: "emergence",
    kicker: { en: "Theme V · the layers", zh: "主题五 · 那些层级" },
    title: { en: "Layers of Reality", zh: "实在的层级" },
    sub: { en: "Higher levels are real, not illusions", zh: "高层是真实的，而非幻象" },
    body: {
      en: "If everything is fields and particles, are tables, cells and minds merely convenient fictions? Carroll's answer, central to poetic naturalism, is no: emergence is real, and higher-level descriptions are genuinely true, not approximations we tolerate until the 'real' physics takes over. Temperature, fluidity, life and thought are patterns that exist at certain scales and are best described in their own vocabularies — vocabularies that capture real regularities the language of quarks cannot. This is 'weak' emergence: the higher levels are fully compatible with the lower (no new fundamental forces appear), yet they are not eliminable, because the useful information lives in the pattern, not the parts. The companion draws the moral the book keeps returning to: reductionism in the sense of 'it's all atoms underneath' is correct, but reductionism in the sense of 'therefore only atoms are real' is a mistake. Reality is layered, and a description's truth is judged within its domain. The biologist talking about cells is not saying something less true than the physicist talking about electrons — only something true at a different scale.",
      zh: "若一切皆是场与粒子，那么桌子、细胞与心灵，是否不过是方便的虚构？卡罗尔的回答——诗性自然主义的核心——是否：涌现是真实的，而高层的描述是货真价实地为真，而非我们暂且容忍、直到『真正的』物理接管的近似。温度、流动性、生命与思想，是在某些尺度上存在的模式，最好以它们自己的词汇来描述——那些词汇捕捉到夸克的语言所无法捕捉的、真实的规律。这是『弱』涌现：高层与低层完全相容（没有新的基本力出现），却不可被消去，因为有用的信息，住在模式里，而非部件里。本解读引出本书一再回到的那条寓意：『底下全是原子』意义上的还原论，是正确的，但『因此只有原子才真实』意义上的还原论，是一个错误。实在是分层的，而一个描述的真，要在其领域之内来评判。谈论细胞的生物学家，所说的并不比谈论电子的物理学家更不真——只是在一个不同的尺度上为真。",
    },
    ask: { en: "Is a thought less real than the atoms it runs on — or just real at another level?", zh: "一个思想，是否比它所运行其上的原子更不真实——还是只是在另一个层级上真实？" },
  },
  {
    num: "06",
    id: "life",
    kicker: { en: "Theme VI · the spark", zh: "主题六 · 那点火花" },
    title: { en: "The Origin of Complexity & Life", zh: "复杂性与生命的起源" },
    sub: { en: "Why order arises in a universe heading for disorder", zh: "为何在一个走向无序的宇宙中，秩序得以兴起" },
    body: {
      en: "If entropy always rises, how can life — exquisitely ordered — appear and persist? Carroll's answer dissolves the apparent paradox. Life is not a violation of the second law but a consequence of it: complex structures arise precisely because they are efficient at capturing flows of free energy and accelerating the overall increase of entropy. A living thing is a local pocket of order that pays for itself by dumping more disorder into its surroundings; the Sun-to-Earth-to-space energy flow is the gradient that complexity feeds on. On this view life is not a miracle requiring a special ingredient or a designer, but the kind of thing that tends to happen when energy flows through matter under the right conditions — and biology, once underway, is captured by Darwinian evolution, which builds astonishing apparent design with no designer. The companion notes the honest seam: the deep details of how the first self-replicating chemistry got started (abiogenesis) are still genuinely unsolved, and Carroll is careful to mark the difference between the well-understood thermodynamic framing and the open scientific question of life's actual origin.",
      zh: "若熵总在上升，生命——精妙地有序——又如何能出现并存续？卡罗尔的回答化解了这个表面的悖论。生命并非对第二定律的违反，而是它的一个后果：复杂的结构之所以兴起，恰恰因为它们善于捕获自由能的流动、并加速熵的总体增加。一个活物，是一处局部的秩序口袋，它通过把更多的无序倾倒进周遭来为自己买单；从太阳到地球再到太空的能量流动，正是复杂性所赖以为食的梯度。在此视角下，生命并非需要某种特殊成分或一位设计者的奇迹，而是『当能量在恰当条件下流经物质时，倾向于发生』的那类事——而生物学，一旦启动，便被达尔文式的演化所捕获，后者无需设计者，便造出令人惊叹的、表观的设计。本解读指出那道诚实的接缝：第一个自我复制的化学如何起步（生命起源）的深层细节，至今确实未解，而卡罗尔谨慎地标明了『被充分理解的热力学框定』与『生命实际起源这一开放的科学问题』之间的区别。",
    },
    ask: { en: "Is life a special exception to physics — or exactly what physics tends to make?", zh: "生命，是对物理的一个特殊例外——还是恰恰是物理倾向于造就之物？" },
  },
  {
    num: "07",
    id: "consciousness",
    kicker: { en: "Theme VII · the inner", zh: "主题七 · 那内在" },
    title: { en: "Consciousness & the Inner World", zh: "意识与内在世界" },
    sub: { en: "The hardest test for a one-world view", zh: "对一元世界观最艰难的检验" },
    body: {
      en: "Nothing strains naturalism like consciousness — the felt, first-person quality of experience, the 'what it is like' to see red or feel pain. Carroll faces the so-called hard problem directly and takes a poetic-naturalist line: consciousness is real, but it is a higher-level way of talking about certain physical processes in brains, not evidence of a separate mental substance. He resists both dismissing inner experience as illusion and inflating it into something physics cannot touch; the inner story and the neuronal story are, he argues, two compatible descriptions of one process. The companion is careful to keep this honest, because it is the book's most contested ground. Carroll's deflationary stance is a serious, well-argued position — but the hard problem remains genuinely unsolved and hotly debated, and many thoughtful philosophers think consciousness resists exactly this kind of dissolving. We present Carroll's view as one strong naturalist answer among live alternatives, not as a settled result. It is where poetic naturalism is most ambitious, and where a fair reader keeps the question open.",
      zh: "没有什么比意识——经验那被感到的、第一人称的质地，看见红色或感到疼痛时『那是何种感受』——更使自然主义紧张。卡罗尔直面所谓的难问题，并采取一条诗性自然主义的路线：意识是真实的，但它是谈论大脑中某些物理过程的一种高层方式，而非一种独立的心灵物质的证据。他既抵抗『把内在经验斥为幻象』，也抵抗『把它膨胀为物理无法触及之物』；他论证道，那内在的故事与那神经元的故事，是对同一个过程的两种相容的描述。本解读谨慎地把这保持诚实，因为这是本书最具争议的地盘。卡罗尔那消解性的立场，是一个严肃、论证有力的立场——但难问题仍确实未解、争论激烈，而许多深思熟虑的哲学家认为，意识恰恰抵抗这种消解。我们把卡罗尔的观点，呈现为众多活跃的备选中、一个有力的自然主义回答，而非一个已尘埃落定的结果。这是诗性自然主义最具野心之处，也是一个公允的读者，让问题保持敞开之处。",
    },
    ask: { en: "Is the feeling of experience just brain-talk at another level — or something physics leaves out?", zh: "经验之感受，只是另一层级上的『大脑之谈』——还是物理所遗漏之物？" },
  },
  {
    num: "08",
    id: "freewill",
    kicker: { en: "Theme VIII · the choice", zh: "主题八 · 那抉择" },
    title: { en: "Free Will, Compatibly", zh: "自由意志，相容地" },
    sub: { en: "Real choices in a lawful universe", zh: "在一个合乎定律的宇宙中，真实的抉择" },
    body: {
      en: "If you are quantum fields obeying fixed laws, in what sense do you choose anything? Carroll's answer is compatibilism, expressed through poetic naturalism. At the level of fundamental physics there is no 'free will' — there are only fields evolving. But 'you', 'choice' and 'could have done otherwise' belong to a different, equally legitimate vocabulary: the human-scale story of agents with desires deliberating about options. That story is not falsified by the physics beneath it any more than 'the table is solid' is falsified by mostly-empty atoms. Within the only framework where the concept even applies — the macroscopic description of people — free will is perfectly real and indispensable. The companion frames the elegance and the catch together. The elegance: it lets us keep moral responsibility and genuine deliberation without smuggling in a ghost that overrides physics. The catch: critics argue this redefines free will rather than vindicating the libertarian, uncaused kind many people actually mean — so whether Carroll has saved free will or tactfully replaced it is itself a live debate the companion keeps open.",
      zh: "若你是一团遵循固定定律的量子场，那么在何种意义上，你抉择了任何东西？卡罗尔的回答是相容论，借由诗性自然主义来表达。在基本物理的层级上，没有『自由意志』——只有演化着的场。但『你』、『抉择』与『本可以做出不同选择』，属于一种不同的、同样正当的词汇：人类尺度的故事，关于怀着欲望、在诸选项间审议的主体。那个故事，并不被其下的物理所证伪，正如『桌子是坚实的』并不被『大半是空的原子』所证伪。在那个唯一让这一概念得以适用的框架内——对人的宏观描述——自由意志是完全真实、且不可或缺的。本解读把这优雅与那症结一同框定。优雅之处：它让我们得以保留道德责任与真正的审议，而不必偷偷塞进一个凌驾于物理之上的幽灵。症结之处：批评者论证道，这是重新定义了自由意志，而非为许多人实际所指的那种自由意志论的、无因的种类正名——所以，卡罗尔究竟是拯救了自由意志、还是得体地替换了它，这本身是一场活跃的争论，本解读让它保持敞开。",
    },
    ask: { en: "Has Carroll saved free will — or tactfully replaced it with something else?", zh: "卡罗尔是拯救了自由意志——还是得体地用别的东西替换了它？" },
  },
  {
    num: "09",
    id: "meaning",
    kicker: { en: "Theme IX · the point", zh: "主题九 · 那意义" },
    title: { en: "Constructing Meaning", zh: "建构意义" },
    sub: { en: "Purpose is made, not found — and that is enough", zh: "目的是被造的，而非被找到的——而那，已经足够" },
    body: {
      en: "Having argued there is no purpose handed down from outside — no cosmic plan, no built-in meaning of life — Carroll faces the obvious worry: doesn't that make everything pointless? His answer, and the warm heart of the book, is no. Meaning and morality are real, but they are things we construct rather than discover, the way we construct languages and laws and love. There is no theorem that proves what we ought to value; values are not read off the universe but built by valuing creatures, and they are no less real for being built. This is constructivism, not nihilism: the absence of an external scorekeeper does not erase the meaning we create between ourselves, here, now. The companion presents this as the book's emotional argument and its philosophically lightest-footed — Carroll offers considerations and a stance, not a proof, and is candid that some readers will find a self-authored meaning thinner than a given one. But the core claim is bracing: a meaningful, moral, examined life is fully available in a purely natural world. We are not cosmically significant, and we get to decide what matters anyway.",
      zh: "在论证了『没有从外部递下的目的——没有宇宙的计划，没有内建的人生意义』之后，卡罗尔直面那显而易见的忧虑：这岂不是让一切都失去意义？他的回答，也是本书温暖的内核，是否。意义与道德是真实的，但它们是我们所建构、而非所发现之物，正如我们建构语言、法律与爱。没有一条定理能证明我们应当珍视什么；价值并非从宇宙中读出，而是由会珍视的造物所建造，而它们并不因被建造而更不真实。这是建构主义，而非虚无主义：一个外部记分者的缺席，并不抹去我们在彼此之间、在此处、在此刻所创造的意义。本解读把这呈现为本书情感上的论证，也是它在哲学上脚步最轻者——卡罗尔提供的是考量与一种姿态，而非一个证明，并坦言，某些读者会觉得一个自我撰写的意义，比一个被给定的意义更单薄。但其核心主张令人振奋：一种有意义的、道德的、经过省察的人生，在一个纯然自然的世界里，是完全可得的。我们并非宇宙级地重要，而我们无论如何，得以决定何者要紧。",
    },
    ask: { en: "Is a meaning we author for ourselves thinner than one handed down — or finally ours?", zh: "一个我们为自己撰写的意义，是否比一个被给定的更单薄——还是终于属于我们？" },
  },
  {
    num: "10",
    id: "synthesis",
    kicker: { en: "Synthesis · the big picture", zh: "综合 · 大图景" },
    title: { en: "The Big Picture", zh: "大图景" },
    sub: { en: "How the themes assemble into one view", zh: "诸主题，如何拼成同一种视野" },
    body: {
      en: "Read whole, the book climbs from physics to the meaning of a life without a single break in the chain. Bayesian reasoning tells us how to weigh worldviews; the weight of evidence favours naturalism; the Core Theory closes off room for the supernatural in everyday matter; the arrow of time and the flow of free energy make complexity and life possible; emergence makes the higher levels — cells, minds, choices, values — genuinely real rather than illusions; and poetic naturalism lets us speak truly in all those vocabularies at once. The destination is a stance for living: there is one natural world, we are wholly part of it, no external source hands us purpose, and we are free — indeed obliged — to construct meaning and morality ourselves. The companion's closing position is admiring but honest. The architecture is unusually complete and humane, and its physics is solid. Yet its load-bearing philosophical moves — the deflation of consciousness, compatibilist free will, constructed meaning — are exactly the contested ones, presented with characteristic clarity but not settled. Take the framework as one of the most coherent naturalist worldviews on offer; keep your own judgement, at the contested seams, switched on.",
      zh: "整体读来，本书从物理一路攀升到一段人生的意义，链条中没有一处断裂。贝叶斯推理告诉我们如何称量世界观；证据的分量偏向自然主义；核心理论在日常物质中关闭了超自然的余地；时间之箭与自由能的流动，使复杂与生命成为可能；涌现，使高层——细胞、心灵、抉择、价值——成为货真价实的真实、而非幻象；而诗性自然主义，让我们得以在所有那些词汇中同时真实地言说。其终点，是一种生活的姿态：只有一个自然的世界，我们全然是它的一部分，没有外部的来源把目的递给我们，而我们自由——实则有义务——去自己建构意义与道德。本解读的收尾立场，是赞许的，却诚实。其架构异乎寻常地完整而充满人性，且它的物理是扎实的。然而它承重的哲学之着——对意识的消解、相容论的自由意志、被建构的意义——恰恰是那些有争议者，以其一贯的清晰呈现，却未尘埃落定。把这套框架，当作现有最自洽的自然主义世界观之一；而在那些有争议的接缝处，让你自己的判断，保持开启。",
    },
    ask: { en: "One natural world, no cosmic purpose, meaning we make — is that a loss, or a liberation?", zh: "一个自然的世界、没有宇宙的目的、我们所造的意义——这是一种丧失，还是一场解放？" },
  },
];

/* ─────────────────────── concept panels (constructing meaning) ─────────────────── */

export const PANELS: Record<string, Panel[]> = {
  meaning: [
    {
      t: { en: "No external scorekeeper", zh: "没有外部的记分者" },
      d: { en: "There is no cosmic plan that assigns your life a purpose. For Carroll this is not a loss of meaning but the removal of a fiction we never needed.", zh: "没有一个宇宙的计划，为你的人生指派一个目的。对卡罗尔，这并非意义的丧失，而是移除了一个我们从未需要的虚构。" },
    },
    {
      t: { en: "Values are built, not found", zh: "价值是被建造的，而非被找到的" },
      d: { en: "You cannot derive what you ought to value from the laws of physics. Values are constructed by valuing creatures — and are no less real for it.", zh: "你无法从物理定律中推导出『你应当珍视什么』。价值由会珍视的造物所建造——而它并不因此更不真实。" },
    },
    {
      t: { en: "Constructivism, not nihilism", zh: "建构主义，而非虚无主义" },
      d: { en: "The absence of a given meaning does not imply meaninglessness. We create meaning between ourselves, here and now — and that is genuine.", zh: "一个被给定的意义的缺席，并不蕴含无意义。我们在彼此之间、在此处此刻创造意义——而那是货真价实的。" },
    },
    {
      t: { en: "Morality without commandments", zh: "没有诫命的道德" },
      d: { en: "Carroll offers considerations rather than proofs: caring, fairness and the wellbeing of conscious creatures can ground ethics with no need for divine decree.", zh: "卡罗尔提供的是考量、而非证明：关怀、公平，与有意识造物的福祉，无需神圣的法令，便能为伦理奠基。" },
    },
    {
      t: { en: "The honest caveat", zh: "那诚实的告诫" },
      d: { en: "Carroll is candid that some will find a self-authored meaning thinner than a handed-down one. This is the book's emotional argument, not a theorem.", zh: "卡罗尔坦言，某些人会觉得自我撰写的意义，比被给定的更单薄。这是本书情感上的论证，而非一条定理。" },
    },
    {
      t: { en: "Significant anyway", zh: "无论如何，依然重要" },
      d: { en: "We are not cosmically central, and we still get to decide what matters. An examined, caring, meaningful life is fully available in a purely natural world.", zh: "我们并非宇宙的中心，而我们依然得以决定何者要紧。一种经过省察的、有关怀的、有意义的人生，在一个纯然自然的世界里，完全可得。" },
    },
  ],
};
