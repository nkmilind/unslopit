// Long-form articles for spoke pages that have one. Keyed by category id and
// rendered by the spoke template (app/learn/[category]/page.jsx) in place of the
// default thin sections. Prose is rendered from string constants so quotes and
// apostrophes stay clear of the JSX unescaped-entities lint rule.

const TABLES = [
  {
    title: "Adjectives that inflate",
    rows: [
      ["intricate", "complicated, or nothing"],
      ["pivotal", "important"],
      ["crucial", "necessary, or nothing"],
      ["multifaceted", "complicated"],
      ["nuanced", "complicated"],
      ["comprehensive", "complete, or nothing"],
      ["meticulous", "careful"],
      ["robust", "strong, reliable"],
      ["seamless", "easy, or nothing"],
      ["profound", "large, deep, or nothing"],
      ["invaluable", "useful"],
      ["vibrant", "busy, colorful"],
    ],
  },
  {
    title: "Nouns that show off",
    rows: [
      ["tapestry", "mix, range"],
      ["realm", "field, area"],
      ["landscape", "industry, market, field"],
      ["testament", "evidence, proof"],
      ["cornerstone", "basis"],
      ["beacon", "example"],
      ["myriad", "many"],
      ["plethora", "many"],
    ],
  },
  {
    title: "Verbs and constructions that announce",
    rows: [
      ["underscores", "shows, proves"],
      ["showcases", "shows"],
      ["boasts", "has"],
      ["fosters", "encourages, causes"],
      ["navigates", "handles, deals with"],
      ["plays a crucial role in", "matters to, affects"],
      ["serves as a", "is"],
      ["stands as a", "is"],
    ],
  },
  {
    title: "Adverbs that pad",
    rows: [
      ["notably", "(cut)"],
      ["significantly", "(cut, or give the number)"],
      ["arguably", "(cut, or make the argument)"],
      ["undoubtedly", "(cut)"],
      ["ultimately", "(cut)"],
    ],
  },
];

const INTRO =
  "Some words appear far more often in AI-generated text than in anything people wrote before 2022. Intricate, pivotal, tapestry, multifaceted, underscores — these are the words AI-detection tools weight most heavily, and the ones readers have learned to notice. They are worth cutting because most of them are doing no work.";

const LIST_INTRO =
  "Grouped by what they usually replace. The right-hand column is the word the sentence probably wanted.";

const PATTERN =
  "The pattern across all four groups is the same. Each word appears in place of a specific claim without making one. Intricate tells you something is complicated but not how. Underscores tells you something matters but not to whom. A reader can move through a paragraph of these and learn nothing.";

const WHY_LIST = [
  "Two things put a word on this list.",
  "The first is frequency in the training data relative to ordinary use. These words are common in press releases, corporate reports, grant applications, and journal abstracts — typically the type of writing produced to sound serious. A model trained on the internet, when asked to write professionally, taps into them because it has seen them frequently.",
  "The second is that AI-detection tools measure this. Detectors look for text that is statistically ordinary: predictable word choices, even sentence rhythm, low variation. A paragraph built from the words above is easy to predict, which is what a detector flags. That makes this list useful for a purpose it was not designed for. Cutting these words to slip past a detector is a losing game, since detectors change and false positives are common.",
];

const WHY_AI = [
  "A language model predicts the most probable next word. Asked for a professional adjective, it returns the adjective that most often appears in professional writing, which by definition is the one already worn smooth by overuse. The model has no way to prefer the precise word over the frequent one, because frequency is the only signal it has. When completing the sentence “It is starting to rain outside; I need to grab my ___,” it will almost certainly fill the blank with ‘umbrella’ because it is the most common word — even though you may have intended to grab a coat because it is only a drizzle.",
  "Human feedback training compounds this. Reviewers reward answers that sound authoritative and complete, and vocabulary like crucial, comprehensive, and robust reads as both.",
  "This is why the list keeps growing rather than shrinking. As each word becomes a known tell, models retrained on human feedback shift to adjacent vocabulary carrying the same register. Delve was the famous case. It is less common now, and intricate and nuanced have absorbed the traffic.",
];

const BA = {
  before:
    "Our comprehensive platform boasts a robust feature set that plays a crucial role in helping teams navigate the intricate landscape of modern collaboration. This multifaceted approach underscores our commitment to seamless workflows.",
  beforeNote:
    "Thirty-eight words, eleven of them from the list, and no information about what the product does.",
  after:
    "Our platform helps teams share work across time zones without email. It syncs comments, files, and approvals in one place.",
  afterNote: "Twenty-one words, and a reader now knows what it is.",
  close:
    "The second version is not better simply because the flagged vocabulary was removed. Removing the flagged vocabulary left nowhere to hide, so the sentence had to say something.",
};

const HABITS = [
  "Read your draft looking only for adjectives and adverbs, and delete every one you cannot defend. Most will not be missed. The ones that survive are usually carrying real information.",
  "When you cut a word like intricate, resist replacing it with a synonym. Ask what made the thing complicated and write that instead. The replacement is usually a clause, not a word.",
  "Watch for the constructions more than the individual words. Plays a crucial role in, serves as a, and stands as a testament to are five- and six-word phrases that each replace the verb is. They are harder to notice than a single flagged adjective and they do more damage to a sentence.",
];

const FAQS = [
  {
    q: "What words does ChatGPT overuse most?",
    a: "Delve, intricate, pivotal, crucial, tapestry, multifaceted, underscores, realm, robust, seamless, comprehensive, and meticulous appear on nearly every list, and they are the ones AI-detection tools weight most heavily. The specific words shift as models are retrained, but the category holds steady: abstract adjectives and formal-sounding verbs that signal seriousness without adding meaning.",
  },
  {
    q: "Should I avoid these words entirely?",
    a: "No. Every word on this list has legitimate uses. Crucial is the right word when something genuinely is. The problem is frequency. One robust on a page is fine; robust, intricate, nuanced, and seamless on the same page signals AI writing. If you find several in a single paragraph, the paragraph is probably describing nothing.",
  },
  {
    q: "Does removing these words beat AI detectors?",
    a: "Sometimes, but it is not a reliable strategy. Detectors weigh statistical predictability across a whole document, and they produce false positives on human writing often enough that no edit guarantees a result. Removing empty vocabulary improves your writing whether or not anyone runs a detector on it, which is a better reason to do it.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function DetectorBaitArticle() {
  return (
    <div className="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="learn-section">
        <p>{INTRO}</p>
      </section>

      <section className="learn-section">
        <h2>The list</h2>
        <p>{LIST_INTRO}</p>
        {TABLES.map((t) => (
          <div className="word-table-wrap" key={t.title}>
            <h3>{t.title}</h3>
            <table className="word-table">
              <thead>
                <tr>
                  <th>Overused</th>
                  <th>Usually means</th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <p style={{ marginTop: 20 }}>{PATTERN}</p>
      </section>

      <section className="learn-section">
        <h2>Why these words and not others</h2>
        {WHY_LIST.map((p, k) => (
          <p key={k}>{p}</p>
        ))}
      </section>

      <section className="learn-section">
        <h2>Why AI reaches for them</h2>
        {WHY_AI.map((p, k) => (
          <p key={k}>{p}</p>
        ))}
      </section>

      <section className="learn-section">
        <h2>Before and after</h2>
        <div className="art-ba">
          <div className="art-ba-col">
            <span className="art-ba-label art-ba-before">Before</span>
            <p>{BA.before}</p>
          </div>
          <p className="art-ba-note">{BA.beforeNote}</p>
          <div className="art-ba-col">
            <span className="art-ba-label art-ba-after">After</span>
            <p>{BA.after}</p>
          </div>
          <p className="art-ba-note">{BA.afterNote}</p>
        </div>
        <p style={{ marginTop: 18 }}>{BA.close}</p>
      </section>

      <section className="learn-section">
        <h2>What to do instead</h2>
        <ol className="art-habits">
          {HABITS.map((h, k) => (
            <li key={k}>{h}</li>
          ))}
        </ol>
      </section>

      <section className="learn-section">
        <h2>FAQs</h2>
        <dl className="faq">
          {FAQS.map((f, k) => (
            <div className="faq-item" key={k}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

// ── Emoji inflation ──────────────────────────────────────────────────────

const EMOJI_WILD =
  "Asked to reformat a README, GitHub Copilot expanded it from 13 lines to 163 and added twelve emoji — one per section. In its own pull-request description it filed them under the heading “Enhanced Visual Appeal,” explaining that they make sections easy to identify. That’s the AI describing its own emoji inflation — a better exhibit than any human example.";
const EMOJI_WILD_ROW = "📋 🎯 ✨ 🛠 📦 🚀 ⚙️ 🏃 📚 🏗 🤝 📄";

const EMOJI_WHY = [
  "Chat and social interfaces taught the models that emoji read as energy and structure, so they get stapled onto headings, bullets, and announcements by default. Reinforcement learning from human feedback (RLHF) rewards output that reads as “friendly, enthusiastic, and clear,” which nudges models to overcompensate with icons like 🚀, 💡, and 📊 — and raters skimming quickly may have scored scannable-looking text higher. It’s not quite ALL CAPS, but it’s close: the visual cousin of exclamation inflation, with the same effect of making your message sound unserious or over-decorated.",
  "Taste aside, there’s an accessibility argument too. Screen readers announce every emoji aloud. A bulleted list that uses ✅ as its markers reads as “white heavy check mark” before every item; the 🚀 in a heading becomes “rocket.” That turns emoji inflation from a style quibble into a usability defect — a much harder thing to wave off.",
];

const EMOJI_GUILTIEST =
  "The repeat offenders are a narrow, recognizable set — the ChatGPT / Claude / Gemini shortlist:";
const EMOJI_GUILTIEST_ROW = "🚀 💡 📊 ✅ ✨ 📌";

const EMOJI_WORST =
  "Emoji inflation isn’t uniform — it concentrates in headings, list markers, LinkedIn posts, release notes, and README files. The exhibit above is a README, and that’s typical: these are walls of text, so the model takes it upon itself to “improve readability” with emoji instead of real formatting and sectioning.";

const EMOJI_WHEN_FINE =
  "We’re not arguing for a total ban. Emoji are fine in a personal text or a Slack message — a genuine form of expression that does its job in the right context. But drop them into a serious memo, or pile too many into an email, and you lose the reader. The test we apply when editing: does the emoji carry meaning the words don’t, or is it just decorating text that already says the thing? If it’s the latter, cut it.";

const EMOJI_HANDLES =
  "UnSlopIt flags emoji inflation and rewrites around it — cutting the decorative and per-item emoji, and the scaffolding they prop up, while keeping your meaning, facts, and voice. You see exactly what changed, as a redline plus a clean version.";

const EMOJI_BEFORE = `Meet IdeaWeaver, your new AI agent for content creation.
Just type: ⌨️ ideaweaver agent linkedin_post --topic "AI trends in 2025"
📌 That's it. One command, and a high-quality, engaging post is ready for LinkedIn.
✅ Completely free
✅ First tries your local LLM via Ollama
✅ Falls back to OpenAI if needed
No brainstorming. No writer's block. Just results.
💡 Whether you're a founder, developer, or content creator, IdeaWeaver makes it ridiculously easy to build a personal brand with AI. Try it out today. It doesn't get simpler than this.`;

const EMOJI_AFTER = `Meet IdeaWeaver, an AI agent for content creation.
Type: ideaweaver agent linkedin_post --topic "AI trends in 2025"
One command and a post is ready for LinkedIn. It's free — it tries your local LLM via Ollama first, then falls back to OpenAI if needed. No brainstorming, no writer's block.
IdeaWeaver makes it easy to build a personal brand with AI. Try it today.`;

function EmojiInflationArticle({ c }) {
  return (
    <div className="article">
      <section className="learn-section">
        <h2>What it looks like</h2>
        <p>The patterns that give it away:</p>
        <p className="tax-tells">
          {c.tells.map((t, j) => (
            <span className="tell" key={j}>
              {t}
            </span>
          ))}
        </p>
      </section>

      <section className="learn-section example">
        <h2>In the wild</h2>
        <p>{EMOJI_WILD}</p>
        <p
          className="emoji-exhibit"
          aria-label="Twelve section-heading emoji from the README"
        >
          {EMOJI_WILD_ROW}
        </p>
        <p className="ex-cite">
          <a
            href="https://github.blog/news-insights/product-news/universe-2024-previews-releases/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>{" "}
          — product-news blog post
        </p>
      </section>

      <section className="learn-section">
        <h2>Why AI produces it</h2>
        {EMOJI_WHY.map((p, k) => (
          <p key={k}>{p}</p>
        ))}
      </section>

      <section className="learn-section">
        <h2>The guiltiest emoji</h2>
        <p>{EMOJI_GUILTIEST}</p>
        <p className="emoji-exhibit">{EMOJI_GUILTIEST_ROW}</p>
      </section>

      <section className="learn-section">
        <h2>Where it’s worst</h2>
        <p>{EMOJI_WORST}</p>
      </section>

      <section className="learn-section">
        <h2>When emoji are fine</h2>
        <p>{EMOJI_WHEN_FINE}</p>
      </section>

      <section className="learn-section">
        <h2>How UnSlopIt handles it</h2>
        <p>{EMOJI_HANDLES}</p>
        <div className="art-ba">
          <div className="art-ba-col">
            <span className="art-ba-label art-ba-before">Before</span>
            <p className="ba-multiline">{EMOJI_BEFORE}</p>
          </div>
          <div className="art-ba-col">
            <span className="art-ba-label art-ba-after">After</span>
            <p className="ba-multiline">{EMOJI_AFTER}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Registry: category id -> article component.
export const ARTICLES = {
  "chatgpt-words": DetectorBaitArticle,
  "emoji-inflation": EmojiInflationArticle,
};

// Categories whose article renders its own "In the wild" exhibit, so the spoke
// template skips the default example section for them.
export const ARTICLE_HAS_OWN_EXAMPLE = new Set(["emoji-inflation"]);
