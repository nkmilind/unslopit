// Sitewide footer. One source of truth — edit the nav here, not per page.
export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        UnSlopIt.ai · <a href="/">Home</a> ·{" "}
        <a href="/learn">What is AI slop?</a> ·{" "}
        <a href="/humanize-ai-text">How to humanize AI text</a> ·{" "}
        <a href="/slop-equation">The SLOP Equation</a> ·{" "}
        <a href="/about">About</a>
      </div>
    </footer>
  );
}
