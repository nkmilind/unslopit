import { TAXONOMY, BEFORE_AFTER } from "../../lib/taxonomy";

export const metadata = {
  title: "What is AI slop? — UnSlopIt.ai",
  description:
    "AI slop is text that obviously reads like a machine wrote it. Here's what it is, the 13 tells UnSlopIt strips, an FAQ, and before/after examples.",
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
        {/* 1 — what UnSlopIt does */}
        <section className="learn-hero">
          <h1>Text that sounds like a person wrote it.</h1>
          <p className="lede">
            UnSlopIt takes anything an AI drafted and strips the tells that give
            it away — the buzzwords, the stock framings, the chatbot sign-offs —
            while keeping your meaning, your facts, and your voice. Paste a
            draft, pick how hard to edit, and get back a clean version plus a
            red-pen list of every change and why it was made.
          </p>
        </section>

        {/* 2 — what is AI slop */}
        <section id="what-is-ai-slop" className="learn-section">
          <h2>What is AI slop?</h2>
          <p>
            &ldquo;AI slop&rdquo; is writing that reads like a machine produced
            it: fluent, confident, and strangely empty. It isn&apos;t about
            being wrong — it&apos;s about a texture. The sentences hedge and
            balance too neatly, lean on a small set of overused words, and pad
            every point with throat-clearing and summary.
          </p>
          <p>
            It matters because readers can feel it, even when they can&apos;t
            name it. Slop reads as low-effort and erodes trust, and the same
            statistical patterns that make it sound &ldquo;AI&rdquo; are exactly
            what detection tools flag. The fix isn&apos;t more polish — it&apos;s
            cutting the tells and letting a specific, human point stand.
          </p>
        </section>

        {/* 3 — the taxonomy */}
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

        {/* 4 — FAQ */}
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

        {/* 5 — before / after */}
        <section id="examples" className="learn-section">
          <h2>Before &amp; after</h2>
          <div className="ba-grid">
            {BEFORE_AFTER.map((ex, i) => (
              <div className="ba" key={i}>
                <span className="ba-label">{ex.label}</span>
                <p className="ba-before">{ex.before}</p>
                <p className="ba-after">{ex.after}</p>
                <p className="ba-caught">
                  {ex.caught.map((c, j) => (
                    <span className="tell" key={j}>
                      {c}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="learn-cta">
          <a className="primary" href="/">
            UnSlopIt your draft &rarr;
          </a>
        </section>
      </main>

      <footer>
        <div className="wrap">
          UnSlopIt.ai · Just UnSlopIt. · <a href="/">Home</a>
        </div>
      </footer>
    </>
  );
}
