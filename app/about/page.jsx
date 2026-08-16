import { FAQ } from "../../lib/faq";

export const metadata = {
  title: "About",
  description:
    "What UnSlopIt does, how the free tier works, and answers to common questions about editing, storage, and limits.",
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
