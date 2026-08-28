// Sitewide header for content pages: wordmark, Learn + Guide nav, and a primary
// action on the right (defaults to "Try it →"). The homepage keeps its own
// header (it carries auth/meter state), but mirrors the Learn + Guide links.
export default function SiteHeader({ action = { href: "/", label: "Try it →" } }) {
  return (
    <header>
      <div className="wrap head-inner">
        <a className="wordmark" href="/">
          Un<span className="slop">Slop</span>It.ai
        </a>
        <nav className="head-nav">
          <a className="head-nav-link" href="/learn">
            Learn
          </a>
          <a className="head-nav-link" href="/humanize-ai-text">
            Guide
          </a>
          <a className="head-nav-link" href="/slop-equation">
            Data
          </a>
          <a className="head-link" href={action.href}>
            {action.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
