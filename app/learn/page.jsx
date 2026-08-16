import { TAXONOMY } from "../../lib/taxonomy";

export const metadata = {
  title: "What is AI slop? — UnSlopIt.ai",
  description:
    "AI slop is text that obviously reads like AI wrote it. Here's what it is, the 13 tells UnSlopIt strips, and an FAQ.",
};

const FAQ = [
  {
    q: "Is my text stored?",
    a: "No. Drafts are processed to produce the edit and are not saved. The browser never talks to the AI directly — your text goes to our server, which holds the API key and returns the rewrite.",
  },
  {
    q: "Will it change what I meant?",
    a: "No. The editor preserves your meaning, facts, claims, and roughly your length — it never invents new claims or statistics. You choose how hard it edits: Light touch, Medium (default), or Full rewrite.",
  },
  {
    q: "How is this different from asking an AI to “rewrite this”?",
    a: "A general model often adds its own slop. UnSlopIt runs a purpose-built editor against a fixed taxonomy of tells (below) and shows you exactly what it changed and why — as a redline plus a clean version.",
  },
  {
    q: "What's the “add a typo” option?",
    a: "Perfectly clean text is itself a tell. Toggle it on and the editor slips in one small, natural typo so the result reads as human-written. We mark where it landed with a spellcheck-style squiggle.",
  },
  {
    q: "Can a real person edit it?",
    a: "Human editing is on the way. Register your interest on the home page and we'll email you when it's live.",
  },
  {
    q: "Is there a limit?",
    a: "In the prototype you get a few free edits, then the option to create a free account for more. Drafts are capped at 3,000 words per pass — split longer pieces by section.",
  },
];

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

export default function Learn() {
  return (
    <>
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
          <p>
            &ldquo;AI slop&rdquo; is writing that reads like a machine produced
            it: fluent, equivocating, and strangely empty. The sentences hedge
            and balance too neatly, lean on a small set of overused words, and
            pad pretty much every point. And then there are the summaries that
            assume the reader needs to be spoon-fed every takeaway.
          </p>
          <p>
            It matters because readers can feel it, even when they can&apos;t
            put their finger on it. Slop signals that the writer did not put in
            any effort to review and refine. It erodes trust. The statistical
            patterns that make it sound &ldquo;AI&rdquo; are also the ones AI
            detection tools flag. The fix is cutting out the tells and adding a
            warm, human voice that values simplicity.
          </p>
        </section>

        {/* The taxonomy */}
        <section id="taxonomy" className="learn-section">
          <h2>The slop taxonomy</h2>
          <p>
            The {TAXONOMY.length} categories of tell the editor hunts for. Each
            has its own link — point people straight at the one they keep
            committing.
          </p>
          <ol className="tax-list">
            {TAXONOMY.map((c, i) => (
              <li key={c.id} id={c.id} className="tax-item">
                <div className="tax-n">{String(i + 1).padStart(2, "0")}</div>
                <div className="tax-body">
                  <h3>
                    <a href={`#${c.id}`}>{c.title}</a>
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
        </section>

        {/* FAQ */}
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
          <a href="/about">About</a>
        </div>
      </footer>
    </>
  );
}
