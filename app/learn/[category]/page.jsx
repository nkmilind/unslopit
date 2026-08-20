import { notFound } from "next/navigation";
import { TAXONOMY } from "../../../lib/taxonomy";
import { ARTICLES } from "./articles";

export function generateStaticParams() {
  return TAXONOMY.map((c) => ({ category: c.id }));
}

function find(id) {
  return TAXONOMY.find((c) => c.id === id);
}

// Wrap each exact substring in `marks` (a word or a phrase — the tell itself)
// in a red mark. Case-insensitive; original casing/spacing is preserved.
function highlight(text, marks) {
  if (!marks || !marks.length) return text;
  const escaped = marks
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re).map((part, k) =>
    marks.some((m) => m.toLowerCase() === part.toLowerCase()) ? (
      <mark className="ex-hit" key={k}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = find(category);
  if (!c) return {};
  return {
    title: c.metaTitle || c.title,
    description:
      c.metaDescription ||
      `${c.blurb} Why AI produces it, and how to cut it — from the UnSlopIt slop taxonomy.`,
    alternates: { canonical: `/learn/${c.id}` },
    // Next replaces (does not deep-merge) openGraph, so re-declare the image.
    openGraph: { url: `/learn/${c.id}`, images: ["/og.png"] },
  };
}

export default async function Spoke({ params }) {
  const { category } = await params;
  const c = find(category);
  if (!c) notFound();

  const i = TAXONOMY.findIndex((t) => t.id === c.id);
  const n = TAXONOMY.length;
  const prev = TAXONOMY[(i - 1 + n) % n];
  const next = TAXONOMY[(i + 1) % n];
  const Article = ARTICLES[c.id];

  // "In the wild" specimen — shared between the default layout and article pages.
  const exampleSection = c.example ? (
    <section className="learn-section example">
      <h2>In the wild</h2>
      <p>
        A real one, quoted verbatim —{" "}
        {c.example.marks && c.example.marks.length
          ? "the underlined words are the tell."
          : "the formatting is the tell."}
      </p>
      {c.example.artifact ? (
        <>
          <figure className="ex-shot">
            <div className="ex-shot-bar">
              <span className="dot" style={{ background: "#d6b0aa" }} />
              <span className="dot" style={{ background: "#ddd3b6" }} />
              <span className="dot" style={{ background: "#b9cdb2" }} />
              <span className="ex-shot-url">{c.example.artifact.chrome}</span>
            </div>
            <div className="ex-shot-body">
              {c.example.artifact.thumb && (
                <div className="ex-shot-thumb" aria-hidden="true" />
              )}
              <div>
                <p className="ex-shot-title">
                  {highlight(c.example.quote, c.example.marks)}
                  {c.example.artifact.tail}
                </p>
                {c.example.artifact.price && (
                  <p className="ex-shot-price">
                    ${c.example.artifact.price}
                    <sup style={{ fontSize: "12px" }}>
                      {c.example.artifact.cents}
                    </sup>
                  </p>
                )}
              </div>
            </div>
          </figure>
          <p className="ex-shot-cap">
            reconstruction ·{" "}
            <a href={c.example.url} target="_blank" rel="noopener noreferrer">
              {c.example.who} ↗
            </a>
          </p>
        </>
      ) : (
        <div className="ex-item">
          <blockquote className="ex-quote">
            &ldquo;{highlight(c.example.quote, c.example.marks)}&rdquo;
          </blockquote>
          <p className="ex-cite">
            <a href={c.example.url} target="_blank" rel="noopener noreferrer">
              {c.example.who} ↗
            </a>{" "}
            — {c.example.what}
          </p>
        </div>
      )}
    </section>
  ) : null;

  return (
    <>
      <header>
        <div className="wrap head-inner">
          <a className="wordmark" href="/">
            Un<span className="slop">Slop</span>It.ai
          </a>
          <a className="head-link" href={`/?sample=${c.id}`}>
            Try it &rarr;
          </a>
        </div>
      </header>

      <main className="wrap learn">
        <p className="spoke-crumb">
          <a href="/learn">← The slop taxonomy</a>
        </p>

        <section className="learn-section learn-first">
          <h1>{c.title}</h1>
          <p className="lede">{c.blurb}</p>
        </section>

        {Article ? (
          <>
            {exampleSection}
            <Article />
          </>
        ) : (
          <>
            <section className="learn-section">
              <h2>What it looks like</h2>
              <p>The phrases and patterns that give it away:</p>
              <p className="tax-tells">
                {c.tells.map((t, j) => (
                  <span className="tell" key={j}>
                    {t}
                  </span>
                ))}
              </p>
            </section>

            {exampleSection}

            <section className="learn-section">
              <h2>Why AI produces it</h2>
              <p>{c.why}</p>
            </section>

            <section className="learn-section">
              <h2>How UnSlopIt handles it</h2>
              <p>
                UnSlopIt flags {c.title.toLowerCase()} and rewrites around it —
                cutting the tell while keeping your meaning, facts, and voice. You
                see exactly what changed, as a redline plus a clean version.
              </p>
              <p style={{ marginTop: 18 }}>
                <a className="inline-link" href={`/?sample=${c.id}`}>
                  Unslop a draft &rarr;
                </a>
              </p>
            </section>
          </>
        )}

        <section className="learn-section spoke-siblings">
          <h2>Related tells</h2>
          <ul>
            <li>
              <a href={`/learn/${prev.id}`}>{prev.title}</a>
            </li>
            <li>
              <a href={`/learn/${next.id}`}>{next.title}</a>
            </li>
            <li>
              <a href="/learn">All {n} categories →</a>
            </li>
          </ul>
        </section>

        <section className="learn-cta">
          <a className="primary" href={`/?sample=${c.id}`}>
            Unslop your draft &rarr;
          </a>
        </section>
      </main>

      <footer>
        <div className="wrap">
          UnSlopIt.ai · <a href="/">Home</a> · <a href="/learn">What is AI slop?</a> ·{" "}
          <a href="/about">About</a>
        </div>
      </footer>
    </>
  );
}
