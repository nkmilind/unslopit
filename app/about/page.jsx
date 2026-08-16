export const metadata = {
  title: "About — UnSlopIt.ai",
  description:
    "UnSlopIt turns AI-drafted text into writing that sounds like a person wrote it — stripping the tells while keeping your meaning, facts, and voice.",
};

export default function About() {
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

        <section className="learn-section">
          <p>
            Instant AI editing is free while we&apos;re in prototype. Human
            editing — a real person, in your voice, with a tracked-changes
            summary — is on the way; you can register your interest from the
            home page.
          </p>
          <p>
            Curious what actually counts as slop?{" "}
            <a className="inline-link" href="/learn">
              Read the field guide &rarr;
            </a>
          </p>
        </section>

        <section className="learn-cta">
          <a className="primary" href="/">
            Unslop your draft &rarr;
          </a>
        </section>
      </main>

      <footer>
        <div className="wrap">
          UnSlopIt.ai · Just UnSlopIt. · <a href="/">Home</a> ·{" "}
          <a href="/learn">What is AI slop?</a>
        </div>
      </footer>
    </>
  );
}
