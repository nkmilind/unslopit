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
        <p>Three habits cover most of it.</p>
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

// Registry: category id -> article component.
export const ARTICLES = {
  "detector-bait": DetectorBaitArticle,
};
