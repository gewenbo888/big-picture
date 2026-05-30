"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, PANELS } from "./content";
import CosmosField from "./CosmosField";
import BayesLab from "./BayesLab";
import IdeasTimeline from "./IdeasTimeline";
import BigPicturePrinciples from "./BigPicturePrinciples";
import OneWorldManyStories from "./OneWorldManyStories";
import ReasoningViz from "./ReasoningViz";
import CoreTheoryViz from "./CoreTheoryViz";
import EntropyArrowViz from "./EntropyArrowViz";
import LayersViz from "./LayersViz";
import ComplexityViz from "./ComplexityViz";
import ConsciousnessViz from "./ConsciousnessViz";
import FreeWillViz from "./FreeWillViz";
import CarrollAnalyst from "./CarrollAnalyst";
import WorldviewRadar from "./WorldviewRadar";
import RecursiveLayersEngine from "./RecursiveLayersEngine";

const BOOK_URL = "https://www.penguinrandomhouse.com/books/533002/the-big-picture-by-sean-carroll/";

function ConceptPanels({ id }: { id: string }) {
  const { lang } = useLang();
  const set = PANELS[id];
  if (!set) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {set.map((c, i) => (
        <div key={i} className="panel rounded-xl p-5">
          <div key={lang} className={`display text-base text-flux-400 lang-fade ${lang === "zh" ? "zh" : ""}`}>{c.t[lang]}</div>
          <p key={`d-${lang}`} className={`mt-2 text-sm leading-relaxed text-ink-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>{c.d[lang]}</p>
        </div>
      ))}
    </div>
  );
}

const VIS: Record<string, ReactNode> = {
  naturalism: <OneWorldManyStories />,
  bayes: <ReasoningViz />,
  coretheory: <CoreTheoryViz />,
  time: <EntropyArrowViz />,
  emergence: <LayersViz />,
  life: <ComplexityViz />,
  consciousness: <ConsciousnessViz />,
  freewill: <FreeWillViz />,
  meaning: <ConceptPanels id="meaning" />,
};

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-ink-100/10 bg-void-950/85 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md border border-flux-500/30 bg-void-800">
          <svg viewBox="0 0 32 32" className="h-5 w-5">
            <circle cx="16" cy="16" r="11" fill="none" stroke="#2dd4bf" strokeWidth="1.3" opacity="0.85" />
            <circle cx="16" cy="16" r="7.5" fill="none" stroke="#8b7bff" strokeWidth="1.3" opacity="0.9" />
            <circle cx="16" cy="16" r="4" fill="none" stroke="#f5b942" strokeWidth="1.3" opacity="0.9" />
            <circle cx="16" cy="16" r="2" fill="#ff6b5c" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="display text-base text-ink-50">The Big Picture</div>
          <div className="zh text-[0.6rem] text-ink-500">大图景</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-500 lg:flex">
        <a href="#lab" className="hover:text-flux-400">Bayes</a>
        <a href="#emergence" className="hover:text-flux-400">Layers</a>
        <a href="#consciousness" className="hover:text-flux-400">Consciousness</a>
        <a href="#principles" className="hover:text-flux-400">Ideas</a>
        <a href="#analyst" className="hover:text-flux-400">Analyst</a>
        <a href="#synthesis" className="hover:text-flux-400">Synthesis</a>
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a href="https://psyverse.fun" className="hidden font-mono text-[0.6rem] uppercase tracking-[0.18em] text-flux-500 hover:text-flux-400 sm:block">← Psyverse</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <CosmosField />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/30 via-transparent to-void-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · an analytical companion</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ink-500">
          EN · 中文 · a study guide to Sean Carroll's «The Big Picture»
        </div>
        <h1 className="display mt-6 text-5xl leading-[0.96] text-ink-50 md:text-7xl">
          The Big <span className="spark-text">Picture</span>
        </h1>
        <h2 className="zh mt-3 text-2xl text-ink-200 md:text-4xl">大图景 · 论生命、意义与宇宙本身</h2>

        <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-ink-100 md:text-xl">
          <T v={{
            en: "Sean Carroll's «The Big Picture» runs in one unbroken chain from the equations of physics to the meaning of a human life — under a stance he calls poetic naturalism: one natural world, described by many true vocabularies. This is an independent companion to that book: a thematic map of its argument across physics, biology, mind and morality, rebuilt as original interactive visualizations — with the science held firmly and the contested philosophy held open.",
            zh: "肖恩·卡罗尔的《大图景》，以一条不断裂的链条，从物理学的方程一路运行到一段人生的意义——在他所称的一种立场之下：诗性自然主义——一个自然的世界，由许多真实的词汇所描述。这是一份对那本书的独立解读：把它横跨物理、生物、心灵与道德的论证绘成一张主题地图，重建为原创的交互可视化——把科学握得牢固，把有争议的哲学保持敞开。",
          }} />
        </p>

        <div className="mt-10 max-w-2xl panel rounded-lg p-6">
          <div className="label-mono">Central stance · 核心立场</div>
          <p className="mt-3 font-serif text-xl leading-relaxed text-ink-50 md:text-2xl">
            <T v={{
              en: "There is one world, the natural one — and there are many true ways of talking about it. You are atoms, and you are a person who hopes. Both are real.",
              zh: "只有一个世界，即自然的世界——而有许多真实的谈论它的方式。你是原子，你也是一个会希望的人。二者都真实。",
            }} />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-500">
          <span>10 themes · fields → meaning</span>
          <span>poetic naturalism · Core Theory · emergence</span>
          <span>commentary, not the book itself</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ s, vis }: { s: (typeof SECTIONS)[number]; vis?: ReactNode }) {
  return (
    <section id={s.id} className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="label-mono"><T v={s.kicker} /></div>
        <div className="mt-3 flex items-baseline gap-4">
          <span className="display text-5xl text-flux-500/30">{s.num}</span>
          <div>
            <h2 className="display text-3xl text-ink-50 md:text-5xl"><T v={s.title} /></h2>
            <h3 className="mt-1 text-base text-iris-400 md:text-lg"><T v={s.sub} /></h3>
          </div>
        </div>
        <div className="mt-5 h-px rule-flux opacity-60" />
        <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-ink-200"><T v={s.body} /></p>
        <div className="mt-5 flex items-start gap-3 max-w-3xl">
          <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-plasm-500" />
          <p className="font-serif text-base italic leading-relaxed text-plasm-400/90"><T v={s.ask} /></p>
        </div>
        {vis && <div className="mt-12">{vis}</div>}
      </div>
    </section>
  );
}

function Body() {
  const { lang } = useLang();
  const synthesis = SECTIONS.find((s) => s.id === "synthesis")!;
  const rest = SECTIONS.filter((s) => s.id !== "synthesis");

  return (
    <main className="relative bg-void-950 text-ink-100">
      <Header />
      <Hero />

      {/* attribution banner */}
      <div className="border-y border-flux-500/20 bg-void-900/70 px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-serif text-sm leading-relaxed text-ink-300">
            <T v={{
              en: "Based on «The Big Picture: On the Origins of Life, Meaning, and the Universe Itself» by Sean Carroll (© 2016). This site is independent commentary and analysis — not affiliated with, nor a substitute for, the book.",
              zh: "基于肖恩·卡罗尔的《大图景：论生命、意义与宇宙本身的起源》（© 2016）。本站为独立的评论与分析——与本书无隶属关系，亦非其替代品。",
            }} />
          </p>
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer"
            className="flex-none rounded-full border border-flux-500/40 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-flux-400 transition hover:bg-flux-500/15">
            {lang === "zh" ? "获取原书 →" : "Get the book →"}
          </a>
        </div>
      </div>

      {/* timeline */}
      <section className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The lineage · 谱系</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "How the naturalist picture was built", zh: "自然主义的图景，如何被建立" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "The ideas behind poetic naturalism didn't arrive all at once — from Laplace's clockwork and Darwin's descent to Boltzmann's entropy and the completion of the Core Theory. The milestones, read as a single lineage; the framing is ours.",
              zh: "诗性自然主义背后的理念，并非一蹴而就——从拉普拉斯的钟表与达尔文的演化，到玻尔兹曼的熵与核心理论的完成。这些里程碑，读作一道单一的谱系；这番框定出自我们。",
            }} />
          </p>
          <div className="mt-12"><IdeasTimeline /></div>
        </div>
      </section>

      {/* ticker */}
      <div className="border-y border-ink-100/10 bg-void-900 py-2.5 overflow-hidden">
        <div className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.3em] text-flux-400/80">
          {(lang === "zh"
            ? "诗性自然主义 · 一个世界，许多真实的故事 · 信念即可信度 · 核心理论已被理解 · 时间之箭来自低熵开端 · 涌现是真实的 · 生命是熵增的后果 · 意识是高层之谈 · 相容论的自由意志 · 意义是被建构的 · 你是原子，也是一个人 · "
            : "POETIC NATURALISM · ONE WORLD, MANY TRUE STORIES · BELIEF AS CREDENCE · THE CORE THEORY IS UNDERSTOOD · TIME'S ARROW FROM A LOW-ENTROPY START · EMERGENCE IS REAL · LIFE IS A CONSEQUENCE OF ENTROPY · CONSCIOUSNESS AS HIGHER-LEVEL TALK · COMPATIBILIST FREE WILL · MEANING IS CONSTRUCTED · YOU ARE ATOMS, AND A PERSON · ").repeat(2)}
        </div>
      </div>

      {/* Feature — Bayes Lab */}
      <section id="lab" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The signature method · 标志性方法</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "Planets of Belief", zh: "信念的行星" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "Carroll's epistemology, made interactive. Start with prior credences across competing big pictures — naturalism, theism, a simulation — then feed in pieces of evidence one at a time and watch your confidence update by Bayes' rule. No single fact decides; confidence is the slow accumulation of many small shifts. See for yourself how the weight of evidence moves the needle — without ever reaching certainty.",
              zh: "卡罗尔的认识论，被做成可交互的。先在彼此竞争的大图景上设定先验可信度——自然主义、有神论、模拟假说——然后一次一项地喂入证据，看你的信心按贝叶斯法则更新。没有单一的事实拍板；信心是许多微小挪移的缓慢累积。亲眼看看，证据的分量如何挪动那根指针——却从不抵达确定。",
            }} />
          </p>
          <div className="mt-10"><BayesLab /></div>
        </div>
      </section>

      {/* Sections 01–09 */}
      {rest.map((s) => (
        <SectionBlock key={s.id} s={s} vis={VIS[s.id]} />
      ))}

      {/* Feature — Ideas */}
      <section id="principles" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The key ideas · 核心理念</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "The ideas, clustered", zh: "核心理念，分簇" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "The book's central ideas, restated in our own words and grouped into clusters so the shape of the argument is visible at a glance. Filter by cluster; each is a pointer back into the book, not a replacement for it.",
              zh: "本书的核心理念，以我们自己的语言重述，并归入若干簇，好让这论证的形状一目了然。按簇筛选；每一条，都是指回本书的一个路标，而非对它的替代。",
            }} />
          </p>
          <div className="mt-10"><BigPicturePrinciples /></div>
        </div>
      </section>

      {/* Analyst */}
      <section id="analyst" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The analyst · 分析者</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "Six readings of one worldview", zh: "对一种世界观的六种读法" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "Pick a question the book raises, then hear it from six angles — a physicist, a philosopher of mind, a biologist, a theist, an ethicist, and a skeptic. The theist and the skeptic are deliberate: the boldest moves (deflating consciousness, compatibilist free will, constructed meaning) are genuinely contested, and a fair companion keeps the dissenting chairs occupied.",
              zh: "选一个本书引出的问题，再从六个角度听它——一位物理学家、一位心灵哲学家、一位生物学家、一位有神论者、一位伦理学家，以及一位怀疑者。那位有神论者与那位怀疑者，是刻意安排的：最大胆的几着（消解意识、相容论的自由意志、被建构的意义）确有争议，而一份公允的解读，会让那几把异议的椅子始终有人坐着。",
            }} />
          </p>
          <div className="mt-10"><CarrollAnalyst /></div>
        </div>
      </section>

      {/* Meta-model — radar */}
      <section id="model" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The worldview model · 世界观模型</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "What kind of worldview is it?", zh: "这是一种怎样的世界观？" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "Score eight features of a worldview — physical monism, role of evidence, emergence of higher levels, openness to mystery, source of meaning, free will, the place of mind, and cosmic purpose — and trace how poetic naturalism, theism, eliminative reductionism, and a dualist worldview light up very different shapes.",
              zh: "为一种世界观的八项特征打分——物理一元论、证据的角色、高层的涌现、对神秘的开放、意义的来源、自由意志、心灵的位置，以及宇宙的目的——并描摹：诗性自然主义、有神论、消去式还原论，与一种二元论的世界观，如何点亮截然不同的形状。",
            }} />
          </p>
          <div className="mt-12"><WorldviewRadar /></div>
        </div>
      </section>

      {/* Section 10 — synthesis */}
      <section id={synthesis.id} className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono"><T v={synthesis.kicker} /></div>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="display text-5xl text-flux-500/30">{synthesis.num}</span>
            <div>
              <h2 className="display text-3xl text-ink-50 md:text-5xl"><T v={synthesis.title} /></h2>
              <h3 className="mt-1 text-base text-iris-400 md:text-lg"><T v={synthesis.sub} /></h3>
            </div>
          </div>
          <div className="mt-5 h-px rule-flux opacity-60" />
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-ink-200"><T v={synthesis.body} /></p>
          <div className="mt-5 flex items-start gap-3 max-w-3xl">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-plasm-500" />
            <p className="font-serif text-base italic leading-relaxed text-plasm-400/90"><T v={synthesis.ask} /></p>
          </div>
          <div className="mt-12"><RecursiveLayersEngine /></div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative border-t border-ink-100/8 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display text-4xl leading-snug text-ink-50 md:text-6xl">
            <T v={{ en: "One natural world — and we get to decide what matters anyway.", zh: "一个自然的世界——而我们无论如何，得以决定何者要紧。" }} />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-300">
            <T v={{
              en: "Carroll's architecture is unusually complete and humane: a single chain from quantum fields to a meaningful life, with no break and no smuggled-in extras. Its physics is solid; its boldest philosophical moves — the deflation of consciousness, compatibilist free will, constructed meaning — are exactly the contested ones, argued with clarity but not consensus. Take poetic naturalism as one of the most coherent naturalist worldviews on offer; keep your own judgement, at the contested seams, switched on.",
              zh: "卡罗尔的架构异乎寻常地完整而充满人性：一条从量子场到一段有意义人生的单一链条，没有断裂，也没有偷偷塞进的额外之物。它的物理是扎实的；它最大胆的哲学之着——对意识的消解、相容论的自由意志、被建构的意义——恰恰是那些有争议者，以清晰、却非共识加以论证。把诗性自然主义，当作现有最自洽的自然主义世界观之一；而在那些有争议的接缝处，让你自己的判断，保持开启。",
            }} />
          </p>
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-flux-500/25 bg-void-900 p-5">
            <p className="text-xs leading-relaxed text-ink-500">
              <T v={{
                en: "An independent, educational study companion to «The Big Picture» by Sean Carroll (© 2016 Sean Carroll). All ideas are explained and synthesised in our own words with original commentary and visualizations; this site is not affiliated with the author or publisher and is not a substitute for the book.",
                zh: "一份针对肖恩·卡罗尔《大图景》（© 2016 肖恩·卡罗尔）的、独立的教育性研读伴侣。所有理念均以我们自己的语言解释与综合，配以原创评论与可视化；本站与作者或出版方无隶属关系，亦非本书的替代品。",
              }} />
            </p>
          </div>
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full border border-flux-500/40 px-6 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-flux-400 transition hover:bg-flux-500/15">
            {lang === "zh" ? "获取《大图景》原书 →" : "Get «The Big Picture» →"}
          </a>
          <div className="mx-auto mt-12 h-px w-40 rule-flux" />
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-flux-500/70">
            The Big Picture · companion · Psyverse · 2026
          </p>
        </div>
      </section>

      <footer className="border-t border-ink-100/10 bg-void-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-ink-50">The Big Picture</div>
            <div className="zh mt-1 text-sm text-ink-300">大图景</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              <T v={{ en: "An independent bilingual companion to Sean Carroll's «The Big Picture» — poetic naturalism, Bayesian reasoning, the Core Theory, the arrow of time, emergence, consciousness, free will and meaning, rebuilt as original interactive analysis.", zh: "一份对肖恩·卡罗尔《大图景》的独立双语解读——诗性自然主义、贝叶斯推理、核心理论、时间之箭、涌现、意识、自由意志与意义，重建为原创的交互分析。" }} />
            </p>
          </div>
          <div>
            <div className="label-mono">Themes · 主题</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hover:text-flux-400">{s.num} · <T v={s.title} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-300">
              <li><a href="https://beginning-of-infinity.psyverse.fun" className="hover:text-flux-400">The Beginning of Infinity · 无穷的开始</a></li>
              <li><a href="https://chaos-science.psyverse.fun" className="hover:text-flux-400">Chaos · 混沌</a></li>
              <li><a href="https://entropy.psyverse.fun" className="hover:text-flux-400">Entropy · 熵</a></li>
              <li><a href="https://consciousness.psyverse.fun" className="hover:text-flux-400">Consciousness · 意识</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-flux-500 hover:text-flux-400">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-flux" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-ink-500">
          <div>© 2026 Gewenbo · Psyverse · commentary</div>
          <div>EN · 中文 · educational</div>
        </div>
      </footer>
    </main>
  );
}

export default function BigPictureEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
