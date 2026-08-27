import { TAXONOMY } from "../../lib/taxonomy";
import SiteHeader from "../_components/SiteHeader";
import Footer from "../_components/Footer";

export const metadata = {
  title: `What is AI slop? The ${TAXONOMY.length} signs of AI writing (2026)`,
  description: `What AI slop is, why it costs you reader trust, and the ${TAXONOMY.length} signs of AI writing — the full taxonomy UnSlopIt uses to strip it.`,
  alternates: { canonical: "/learn" },
  // Next replaces (does not deep-merge) openGraph, so re-declare the image.
  openGraph: { url: "/learn", images: ["/og.png"] },
};

// Decorative cloud of tells at the top of the page.
const CLOUD = [
  { t: "delve", size: 48, red: true, strike: true },
  { t: "em-dash overuse", size: 20 },
  { t: "truly", size: 38, red: true },
  { t: "Hope this helps!", size: 30, red: true, strike: true },
  { t: "Nobody talks about this…", size: 26 },
  { t: "leverage", size: 34, red: true, strike: true },
  { t: "You don't need X. You need Y.", size: 22, italic: true },
  { t: "tapestry", size: 22 },
  { t: "Let that sink in.", size: 24, red: true },
  { t: "seamless", size: 18 },
  { t: "it's not just X, it's Y", size: 20, italic: true },
  { t: "pivotal", size: 18 },
];

// External source link (opens in a new tab). Used to cite the statistics.
function Src({ href, children }) {
  return (
    <a
      className="inline-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

// Body paragraphs. Plain strings render as-is; JSX fragments carry links.
// Text uses curly quotes/apostrophes so it stays clear of the JSX
// unescaped-entities lint rule.
const INTRO = [
  "“AI slop” is writing that reads like a machine produced it: fluent, equivocating, and strangely empty. The sentences hedge and balance too neatly, lean on a small set of overused words, and pad pretty much every point. And then there’s the jargon, and the summaries that spoon-feed every takeaway.",
  "This page is about AI slop in text. The same word gets used for AI images and video; the tells there are different.",
  <>
    Of course we’re all using these tools. They have certainly helped me
    personally get past the dreaded blinking cursor on a blank page. A 2025
    Ahrefs study found{" "}
    <a className="inline-link" href="/slop-equation">
      74%
    </a>{" "}
    of newly created web pages contained AI-generated content. That’s
    not necessarily all AI slop. It includes finishing touches that writers may
    have applied with the help of AI. What does make some of it slop is when no
    one reviews it and it has the telltale signs of AI writing. With LLM use on
    the rise, readers can now feel it, even when they can’t put their finger on
    it. Slop signals that the writer did not put in any effort to review and
    refine. It erodes trust. The fix is always reviewing what you publish,
    cutting out the tells, and adding a warm, human voice that values
    simplicity.
  </>,
];

const SECTIONS = [
  {
    id: "how-common",
    h: "How common is AI-generated content?",
    paras: [
      <>
        By late 2025,{" "}
        <Src href="https://www.nber.org/digest/202605/how-large-language-models-are-reshaping-book-market">
          roughly 300,000 e-books were being released on Amazon each month
        </Src>
        , up from about 100,000 before ChatGPT. In academia,{" "}
        <Src href="https://www.pnas.org/doi/10.1073/pnas.2605754123">
          57% of arXiv papers
        </Src>{" "}
        showed AI-influenced language in 2025, up from 12% in 2023. When everyone
        has the same tools, sounding like the tools is what makes you
        indistinguishable.
      </>,
    ],
  },
  {
    id: "presumed-guilty",
    h: "You’re already presumed guilty",
    paras: [
      <>
        Everyone expects you to use AI. For your LinkedIn posts, for your
        important emails, for internal memos. And even for sales and marketing
        materials. Cashew, a market research company, found in their survey of
        2,149 North
        American consumers that{" "}
        <a className="inline-link" href="/slop-equation">
          87%
        </a>{" "}
        believe brand content is at least partly AI-created, while only 13% are
        very confident they can tell what is and what isn’t.
      </>,
      "Readers are scanning for confirmation of a suspicion they already hold. Which is why you need to eliminate the easy-to-spot patterns.",
    ],
  },
  {
    id: "what-it-costs",
    h: "What does AI slop cost you?",
    paras: [
      <>
        A Gartner survey of 1,539 US consumers in October 2025 found that{" "}
        <a className="inline-link" href="/slop-equation">
          50%
        </a>{" "}
        would prefer to buy from brands that don’t use AI in consumer-facing
        content, and 68%
        frequently wonder whether what they’re seeing is real.
      </>,
      <>
        <Src href="https://www.emarketer.com/content/shoppers-aren-t-impressed-by-ai-generated-marketing">
          Klaviyo and Datalily’s survey
        </Src>{" "}
        of 8,000 consumers found 31% trust a brand less when marketing content is
        visibly AI-generated.
      </>,
      <>
        <Src href="https://www.prnewswire.com/news-releases/when-ai-gets-brand-information-wrong-consumers-look-beyond-the-brand-302797363.html">
          Data from Skyword
        </Src>{" "}
        says that when AI-generated information conflicts with a brand’s own
        messaging, only 29% of consumers trust the brand and 54% go looking for
        third-party validation. And evidence is emerging that AI slop is getting
        worse uptake from consumers.{" "}
        <Src href="https://www.economist.com/business/2025/10/16/sloponomics-who-wins-and-loses-in-the-ai-content-flood">
          The Economist
        </Src>{" "}
        reported that books that appear AI-authored draw fewer and worse reviews
        on Amazon.
      </>,
    ],
  },
  {
    id: "why-ai-writes-this-way",
    h: "Why does AI write this way?",
    paras: [
      "Large Language Models (LLMs) produce slop by design. A language model predicts the most probable next word from an enormous body of published text, so its default output is close to the average of everything written before. Human feedback training pushes it further in the same direction: reviewers reward answers that are complete, agreeable, and unlikely to offend, so a hedge scores better than a wrong claim and a summary scores better than an abrupt ending. Repeat that across millions of examples and you get a writer that never commits and never leaves anything out.",
    ],
  },
  {
    id: "why-tells-change",
    h: "Why do AI tells keep changing?",
    paras: [
      "Some 2023 giveaways have faded. “As an AI language model” is gone. The long ethical-consideration paragraph is mostly gone. But many others didn’t die. “Delve” still shows up now and then; the em-dash pileup is more discussed now than it was two years ago, and writers who used em-dashes long before ChatGPT now feel obliged to defend themselves. The list has got longer. How many times have you shaken your head at another “it’s not just this, it’s that” post on LinkedIn? A fixed blacklist will not solve the problem. What you need is a maintained taxonomy.",
    ],
  },
];

const TAX_CLOSING =
  "These are the principles that will help you fix sloppy content. It is not a fixed blacklist of words. It asks you to cut out what doesn’t inform, vary your rhythm, delete announcements of importance, and above all read it before you ship it. You don’t have to prove to readers that your voice is human, you just have to not give them anything to point at.";

// FAQ. `a` is the plain-text answer (used for the FAQPage schema). `aNode` is
// an optional rich version with links, used only for display.
const LEARN_FAQ = [
  {
    q: "Is AI writing bad?",
    a: "No. Unedited AI writing is the problem, not AI writing itself. A draft produced with AI that is thoughtfully revised with cuts, reordering, rewriting in your own cadence is indistinguishable from any other well-edited piece. What readers react against is output that was generated and published hastily with all the sloppy hedging and padding, and no evidence a human made a decision about any of it. The tells are the clearest sign that nobody cared enough to look. Why should readers care about reading it?",
  },
  {
    q: "What’s the difference between AI writing and human writing?",
    a: "Less than most people assume. Blind tests have repeatedly found readers rating AI-generated text as highly as human writing, sometimes higher. However, a human writer decides what to leave out, which claim to stand behind, and where to let a sentence sit unresolved. A model includes everything and commits to nothing, because that is what it was trained to do. Both can read well. But even good writing styles, when overused, can become tiresome.",
  },
  {
    q: "Can readers actually tell?",
    a: "Mostly not. Cashew’s survey of 2,149 North American consumers found 87% believe brand content is at least partly AI-created, while only 13% are very confident they can identify it. So the average reader can’t reliably prove what’s machine-written. But they suspect everything, and they penalize simply based on suspicion. And as more such content hits the internet, as is expected, and as readers get better at pattern recognition, they will be able to tell with greater success.",
    aNode: (
      <>
        Mostly not.{" "}
        <Src href="https://www.prnewswire.com/news-releases/consumers-assume-brand-content-is-ai-generated-new-cashew-research-reveals-what-builds-trust-instead-302843128.html">
          Cashew’s survey
        </Src>{" "}
        of 2,149 North American consumers found 87% believe brand content is at
        least partly AI-created, while only 13% are very confident they can
        identify it. So the average reader can’t reliably prove what’s
        machine-written. But they suspect everything, and they penalize simply
        based on suspicion. And as more such content hits the internet, as is
        expected, and as readers get better at pattern recognition, they will be
        able to tell with greater success.
      </>
    ),
  },
  {
    q: "Does Google penalize AI content?",
    a: "Not for simply being AI-generated. Google’s position, stated in 2023 and unchanged since, is that it rewards quality content however it’s produced. The policy that actually bites is called scaled content abuse. Introduced in the March 2024 spam update, it targets generating many pages primarily to manipulate rankings rather than help users. It applies regardless of method: AI, human writers, scraping, or a mix. Human-written thin content is covered under this policy. On May 15, 2026 Google clarified that these same spam policies also apply to generative AI responses in Search (its AI Overviews and AI Mode). Using AI won’t necessarily hurt you, and adding a human approval step won’t automatically save you. It is necessary but not sufficient. What matters most is whether your page is worth reading.",
    aNode: (
      <>
        Not for simply being AI-generated. Google’s position, stated in 2023 and
        unchanged since, is that it rewards quality content however it’s produced.
        The policy that actually bites is called{" "}
        <Src href="https://developers.google.com/search/docs/essentials/spam-policies">
          scaled content abuse
        </Src>
        . Introduced in the March 2024 spam update, it targets generating many
        pages primarily to manipulate rankings rather than help users. It applies
        regardless of method: AI, human writers, scraping, or a mix.
        Human-written thin content is covered under this policy.{" "}
        <Src href="https://developers.google.com/search/updates">
          On May 15, 2026 Google clarified
        </Src>{" "}
        that these same spam policies also apply to generative AI responses in
        Search (its AI Overviews and AI Mode). Using AI won’t necessarily hurt
        you, and adding a human approval step won’t automatically save you. It is
        necessary but not sufficient. What matters most is whether your page is
        worth reading.
      </>
    ),
  },
  {
    q: "If I edit AI writing myself, do I need a tool?",
    a: "Honestly, you don’t. All power to you, good writer. The tool is for speed and for the patterns you’ve stopped noticing in your own writing. Because with every model update, the patterns become more subtle. But they are still there.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LEARN_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Learn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />

      <main className="wrap learn">
        <div className="slop-cloud" aria-hidden="true">
          {CLOUD.map((w, i) => (
            <span
              key={i}
              className={w.strike ? "sc-strike" : undefined}
              style={{
                fontSize: `${w.size}px`,
                color: w.red ? "var(--red)" : "var(--muted)",
                fontStyle: w.italic ? "italic" : "normal",
              }}
            >
              {w.t}
            </span>
          ))}
        </div>

        {/* What is AI slop */}
        <section id="what-is-ai-slop" className="learn-section learn-first">
          <h1>What is AI slop?</h1>
          {INTRO.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        {/* Context sections */}
        {SECTIONS.map((s) => (
          <section id={s.id} key={s.id} className="learn-section">
            <h2>{s.h}</h2>
            {s.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        {/* The fix: the taxonomy */}
        <section id="taxonomy" className="learn-section">
          <h2>The {TAXONOMY.length} signs of AI writing</h2>
          <p>
            UnSlopIt.ai delivers exactly that. As of mid-2026, these
            are the {TAXONOMY.length} categories of tell the UnSlopIt editor
            hunts for — each with its own page:
          </p>
          <p>
            <a className="pdf-dl" href="/signs-of-ai-writing.pdf" download>
              ↓ Get all {TAXONOMY.length} as a one-page PDF
            </a>
          </p>
          <ol className="tax-list">
            {TAXONOMY.map((c, i) => (
              <li key={c.id} id={c.id} className="tax-item">
                <div className="tax-n">{String(i + 1).padStart(2, "0")}</div>
                <div className="tax-body">
                  <h3>
                    <a href={`/learn/${c.id}`}>{c.title}</a>
                    {c.isNew && <span className="tax-new">new</span>}
                  </h3>
                  <p>{c.blurb}</p>
                  <p className="tax-tells">
                    {c.tells.map((t, j) => (
                      <span className="tell" key={j}>
                        {t}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p>{TAX_CLOSING}</p>
          <p>
            Now that you can spot the tells, fix them:{" "}
            <a className="inline-link" href="/humanize-ai-text">
              How to humanize AI text — a 5-step method &rarr;
            </a>
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="learn-section">
          <h2>FAQs</h2>
          <dl className="faq">
            {LEARN_FAQ.map((item, i) => (
              <div className="faq-item" key={i}>
                <dt>{item.q}</dt>
                <dd>{item.aNode || item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="learn-cta">
          <a className="primary" href="/">
            Unslop your draft &rarr;
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}
