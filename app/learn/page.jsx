import { TAXONOMY } from "../../lib/taxonomy";

export const metadata = {
  title: "What is AI slop?",
  description:
    "AI slop is text that obviously reads like AI wrote it. Here's what it is and the 13 tells UnSlopIt strips.",
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
            The {TAXONOMY.length} categories of tell the editor hunts for — each
            with its own page. Point people straight at the one they keep
            committing.
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
                </div>
              </li>
            ))}
          </ol>
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
