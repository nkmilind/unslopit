import { FAQ } from "../../lib/faq";

export const metadata = {
  title: "About",
  description:
    "What UnSlopIt does, who writes and maintains the slop taxonomy, what data it records, and answers to common questions about editing, storage, and limits.",
  alternates: { canonical: "/about" },
  // Next replaces (does not deep-merge) openGraph, so re-declare the image.
  openGraph: { url: "/about", images: ["/og.png"] },
};

// FAQPage schema — must match the FAQ rendered on this page (same source).
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Editorial copy rendered from strings (via {expressions}) so the quotes and
// apostrophes stay clear of the JSX unescaped-entities lint rule.
const EDITOR = [
  "UnSlopIt is written and maintained by one person — me. I write this anonymously; it’s a side project and the arguments should stand without a byline. I’ve spent over a decade in B2B marketing, most of it leading teams that produce a lot of writing: product copy, thought leadership, sales material, executive communications. Reading and editing other people’s drafts for customer clarity, brand voice, and simplicity is a big part of the job. When AI tools arrived, the same handful of patterns started appearing in everything that crossed my desk, and the taxonomy on this site began as a private list of them.",
  "I spend too much time reading LinkedIn, but I also enjoy the classics at bedtime and quality business media, which I mine for their occasional gems. A recent favorite, from an Economist article on OpenAI, Anthropic, and xAI’s race to go public:",
];

const ECONOMIST_QUOTE =
  "To understand the clash between the trio, it helps to consider the personalities. These can be summed up as the mercenary (Mr Altman), the missionary (Mr Amodei) and the messianic (Mr Musk).";

const TAXONOMY_BUILT = [
  "The taxonomy started from patterns observed in AI output. In the beginning, I made the rookie mistake of tracking words, but soon realized it went beyond words. Some of it was words, some of it was patterns, and some of it was the structure of the arguments. I also relied on documented community observations (choice subreddits, published research on overrepresented vocabulary).",
  "I continue to revise the taxonomy as models change and new research gets published. I love doing this stuff. It is almost an Orwellian tradition — not in the 1984 sense but in the ‘Orwell’s 6 Rules of Writing’ sense. In that spirit, take the taxonomy and recommendations from UnSlopIt as broad guidelines and follow Orwell’s Rule #6: break any of these rules sooner than say anything outright barbarous.",
];

const DATA_COLLECTED =
  "This app does not store your drafts or the edits. It records which of the taxonomy categories were detected in your draft, the word count, and when an edit was made — retained indefinitely in aggregate, not linked to any user or account, so I can refine which categories to tighten or expand. For example, ‘engagement bait appeared in 78% of drafts’ would probably signal that the category is too broad.";

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header>
        <div className="wrap head-inner">
          <a className="wordmark" href="/">
            Un<span className="slop">Slop</span>It.ai
          </a>
          <a className="head-link" href="/">
            Try it &rarr;
          </a>
        </div>
      </header>

      <main className="wrap learn">
        <section className="learn-hero">
          <h1>Text that sounds human.</h1>
          <p className="lede">
            UnSlopIt takes anything an AI drafted and strips the tells that give
            it away. The buzzwords, the stock framings, and the fake balance.
            All while keeping your facts and meaning intact. Paste a draft, pick
            how aggressively to edit, and get back a clean version plus a red-pen
            list of every change and why it was made.
          </p>
        </section>

        <section className="learn-section">
          <p>
            Instant AI editing is free for the first 3 drafts. You get 3 more
            free edits once you register with your email. For human editing
            turned around in a couple of hours, with a tracked-changes summary;
            you can register your interest from the home page.
          </p>
          <p>
            Curious what actually counts as slop?{" "}
            <a className="inline-link" href="/learn">
              Read the field guide &rarr;
            </a>
          </p>
        </section>

        <section id="editorial" className="learn-section">
          <h2>Editorial</h2>

          <h3>Who’s the editor?</h3>
          {EDITOR.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <blockquote className="about-quote">{ECONOMIST_QUOTE}</blockquote>
          <p className="about-quote-cite">— The Economist</p>

          <h3>How was the taxonomy built?</h3>
          {TAXONOMY_BUILT.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <h3>What data is collected?</h3>
          <p>{DATA_COLLECTED}</p>

          <h3>Corrections policy</h3>
          <p>
            What happens when a category is wrong — misattributed, or a
            statistic turns out to be misreported? Please contact me at{" "}
            <a className="inline-link" href="mailto:editor@unslopit.ai">
              editor@unslopit.ai
            </a>{" "}
            and I’ll do my best to make corrections, and to show all historical
            corrections so they stay easily visible.
          </p>
        </section>

        <section id="faq" className="learn-section">
          <h2>FAQ</h2>
          <dl className="faq">
            {FAQ.map((item, i) => (
              <div className="faq-item" key={i}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
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

      <footer>
        <div className="wrap">
          UnSlopIt.ai · <a href="/">Home</a> ·{" "}
          <a href="/learn">What is AI slop?</a>
        </div>
      </footer>
    </>
  );
}
