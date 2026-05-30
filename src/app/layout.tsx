import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "The Big Picture · An Analytical Companion to Sean Carroll's Book";
const TITLE_ZH =
  "《大图景》深度解读 · 肖恩·卡罗尔";
const DESC =
  "A bilingual analytical companion to Sean Carroll's «The Big Picture» — a thematic map of poetic naturalism: one world described by many true vocabularies, Bayesian reasoning, the Core Theory of everyday physics, the arrow of time, emergence and layers of reality, the origin of complexity and life, consciousness, free will, and the construction of meaning. Independent commentary and study guide, not the book itself.";

export const metadata: Metadata = {
  metadataBase: new URL("https://big-picture.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "The Big Picture", "Sean Carroll", "poetic naturalism", "naturalism", "Bayesian reasoning",
    "Core Theory", "quantum field theory", "arrow of time", "entropy", "past hypothesis", "emergence",
    "layers of reality", "origin of life", "complexity", "consciousness", "the hard problem", "free will",
    "compatibilism", "meaning", "morality", "constructivism", "Laplace's demon", "naturalism vs theism",
    "book summary", "study guide", "book analysis",
    "大图景", "肖恩·卡罗尔", "诗性自然主义", "自然主义", "贝叶斯推理", "核心理论", "量子场论",
    "时间之箭", "熵", "过去假设", "涌现", "实在的层级", "生命起源", "复杂性", "意识", "难问题",
    "自由意志", "相容论", "意义", "道德", "建构主义", "拉普拉斯妖", "读书笔记", "深度解读",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "The Big Picture · 《大图景》深度解读 — An Analytical Companion to Sean Carroll’s Book" }],
    title: "The Big Picture — An Analytical Companion",
    description:
      "A bilingual study guide to Sean Carroll's «The Big Picture»: poetic naturalism, Bayesian reasoning, the Core Theory, the arrow of time, emergence, the origin of life, consciousness, free will and the construction of meaning — rebuilt as original interactive visualizations. Independent commentary, not the book.",
    url: "https://big-picture.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "The Big Picture — An Analytical Companion",
    description: "A bilingual analytical companion to Sean Carroll's «The Big Picture»: poetic naturalism, Bayesian reasoning, the Core Theory, time's arrow, emergence, consciousness, free will and meaning — with original interactive visualizations.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#07080f" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://big-picture.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              about: { "@type": "Book", name: "The Big Picture", author: { "@type": "Person", name: "Sean Carroll" } },
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-ink-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
