import SiteHeader from "../_components/SiteHeader";
import Footer from "../_components/Footer";
import SlopCalculator from "../_components/SlopCalculator";
import CopyButton from "../_components/CopyButton";

const SITE = "https://unslopit.ai";
const PUBLISHED = "2026-08-26";
const MODIFIED = "2026-08-26";
const VERSION = "v1.0";
const UPDATED_HUMAN = "26 August 2026";

const TITLE = "The SLOP Equation: statistics on AI-generated text (2026)";
const DESCRIPTION =
  "The SLOP Equation estimates how much unedited AI text is published every day — SLOP = S × L × O × P. An interactive, sourced calculator, plus the statistics behind each term.";

const CITATION =
  "The SLOP Equation, UnSlopIt.ai, 2026. https://unslopit.ai/slop-equation";
const EMBED_CODE =
  '<iframe src="https://unslopit.ai/slop-equation/embed" width="100%" height="720" style="border:1px solid #E4DDCC;border-radius:2px" title="The SLOP Equation — UnSlopIt.ai" loading="lazy"></iframe>';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/slop-equation" },
  openGraph: { url: "/slop-equation", images: ["/og.png"] },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "The SLOP Equation: how much unedited AI text gets published every day",
  description: DESCRIPTION,
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  version: "1.0",
  license: "https://creativecommons.org/licenses/by/4.0/",
  isAccessibleForFree: true,
  author: { "@type": "Person", name: "The Editor", url: `${SITE}/about` },
  publisher: {
    "@type": "Organization",
    name: "UnSlopIt",
    logo: { "@type": "ImageObject", url: `${SITE}/wordmark-square.png` },
  },
  image: `${SITE}/og.png`,
  mainEntityOfPage: `${SITE}/slop-equation`,
};

function ext(href, children) {
  return (
    <a className="inline-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function SlopEquation() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <SiteHeader />

      <main className="wrap learn">
        <section className="learn-hero">
          <h1>
            The SLOP equation: how much unedited AI text gets published every day
          </h1>
          <p className="lede">Statistics on AI-generated text, 2026</p>
          <p className="updated">
            {VERSION} · updated {UPDATED_HUMAN}
          </p>
        </section>

        <section className="learn-section learn-first">
          <p>
            Plop! That&rsquo;s the sound of text slop hitting the internet every
            second. Nobody knows exactly how much unedited AI text gets published
            every day, because no one measures it directly. So we estimated it.
            The
            SLOP Equation multiplies four numbers — how many pages go up, how
            long they run, the share that&rsquo;s AI, and the share that got
            published without any human review — into one figure. Three of the
            four are sourced; one is a guess. There is plenty of slop imagery,
            music, and video created, but this page is about slop of the text
            variety.
          </p>
        </section>

        <section className="learn-section eq-hero">
          <SlopCalculator />
        </section>

        <section className="learn-section">
          <h2>How honest is this number?</h2>
          <p>
            A figure this large and this round should make you suspicious. This
            is an estimate, not a measurement. S, L, and O rest on published
            figures; P — the share that goes out with no human review — is the
            slider that lets you use your own factor because no one publishes
            it. At the conservative 10% default the equation lands near 814
            million words a day. At 50% it clears four billion. Treat it as an
            estimate, as you would the Drake equation that estimates
            extraterrestrial civilizations.
          </p>
        </section>

        <section className="learn-section">
          <h2>The factor nobody can measure</h2>
          <p>
            P — the fraction of AI text that ships without a human ever reading
            it — is a difficult one to measure. One survey by{" "}
            {ext(
              "https://blog.hubspot.com/marketing/ai-in-content-marketing",
              "HubSpot"
            )}{" "}
            found marketers published 7% of their content without review, albeit
            self-reported. Move it from 10% to 30% and the daily total triples,
            so the final estimate is very sensitive to this factor.
          </p>
          <p>
            That is the point of the exercise. It is the Drake-equation move: you
            build the formula less to get an exact number than to find out which
            number is missing or most sensitive to the estimate. Here the
            variable P is also the thesis: slop is not merely a generative-AI
            problem; it is a human-review problem. The tells that give AI writing
            away — the buzzwords, the hedging — are what&rsquo;s left when no one
            edits the writing. Only a human who cares about craft and quality can
            decide when a draft is complete and edited for publication. P
            measures how often nobody did that.
          </p>
        </section>

        <section className="learn-section">
          <h2>Where the numbers come from</h2>
          <h3>S and L: the open web</h3>
          <p>
            The web&rsquo;s daily output is best estimated as a range.{" "}
            {ext("https://www.wix.com/blog/blogging-statistics-and-facts", "Wix")}{" "}
            alone reports on the order of 7.5 million new blog posts a day, each
            its own page;{" "}
            {ext(
              "https://www.forbes.com/advisor/business/software/website-statistics/",
              "global domain registrations"
            )}{" "}
            add several hundred thousand fresh homepages; and platform pages —
            product listings, forum replies, localized news — run into the
            millions more. We use ten million indexable pages a day as a
            deliberately round, defensible S. For length, we weight three page
            types — long-form posts near 1,380 words (
            {ext(
              "https://colorlib.com/wp/blogging-statistics/",
              "Orbit Media’s survey"
            )}{" "}
            and{" "}
            {ext(
              "https://www.digitalapplied.com/blog/blogging-statistics-2026-data-points",
              "Digital Applied’s trackers"
            )}{" "}
            put the average at 1,333&ndash;1,427), thin dynamic pages near 250 (
            {ext("https://yoast.com/blog-post-word-count-seo/", "Yoast")} and{" "}
            {ext("https://wpvip.com/blog/ideal-word-count/", "WordPress VIP")}{" "}
            treat 200&ndash;300 as the floor), and new homepages near 400 — into
            a blended 1,100. The AI share, O, is the one hard number of the
            three:{" "}
            {ext(
              "https://ahrefs.com/blog/what-percentage-of-new-content-is-ai-generated/",
              "Ahrefs found in 2025"
            )}{" "}
            that 74% of newly created web pages contain AI-generated content.
          </p>

          <h3>Books and publishing</h3>
          <p>
            The pattern shows up off the open web too. By late 2025{" "}
            {ext(
              "https://www.nber.org/digest/202605/how-large-language-models-are-reshaping-book-market",
              "Amazon was seeing roughly 300,000 e-books released a month"
            )}
            , up from about 100,000 before ChatGPT — and titles that read as
            AI-authored draw fewer and worse reviews, according to{" "}
            {ext(
              "https://www.economist.com/business/2025/10/16/sloponomics-who-wins-and-loses-in-the-ai-content-flood",
              "the Economist"
            )}
            . The market is absorbing the volume and appears to be penalizing
            the slop.
          </p>

          <h3>Academic writing</h3>
          <p>
            Academia is the best-measured corner. A{" "}
            {ext(
              "https://www.pnas.org/doi/10.1073/pnas.2605754123",
              "PNAS analysis"
            )}{" "}
            found AI-influenced language in 57% of arXiv papers in 2025, up from
            12% in 2023 — a nearly fivefold jump in two years. The interesting
            part isn&rsquo;t that researchers use the tools; it&rsquo;s how fast
            unreviewed AI phrasing spread once they did.
          </p>

          <h3>Business and professional writing</h3>
          <p>
            This is our daily reality. However, LinkedIn posts, cold emails,
            internal memos, and marketing copy are the writing most likely to be
            generated and least likely to be tracked. Public per-day figures
            barely exist here, which is why it&rsquo;s best to estimate P: the
            professional web is where &ldquo;no one reviewed it&rdquo; is most
            plausible. It&rsquo;s the section we most want to strengthen — and one
            of the reasons we built UnSlopIt.ai.
          </p>

          <h3>Reader trust</h3>
          <p>
            The cost lands on the reader, and here the numbers are firmer.{" "}
            {ext(
              "https://www.gartner.com/en/newsroom/press-releases/2026-03-16-gartner-marketing-survey-finds-50-percent-of-consumers-prefer-brands-that-avoid-using-genai-in-consumer-facing-content0",
              "Gartner"
            )}{" "}
            found 50% of consumers prefer brands that avoid AI in consumer-facing
            content, and 68% often wonder whether what they&rsquo;re seeing is
            real.{" "}
            {ext(
              "https://www.emarketer.com/content/shoppers-aren-t-impressed-by-ai-generated-marketing",
              "Klaviyo and Datalily"
            )}{" "}
            put trust-loss at 31% when content is visibly AI-generated.{" "}
            {ext(
              "https://www.prnewswire.com/news-releases/when-ai-gets-brand-information-wrong-consumers-look-beyond-the-brand-302797363.html",
              "Skyword"
            )}{" "}
            found that when AI content conflicts with a brand&rsquo;s own
            messaging, only 29% still trust the brand and 54% go hunting for
            third-party validation. And{" "}
            {ext(
              "https://www.prnewswire.com/news-releases/consumers-assume-brand-content-is-ai-generated-new-cashew-research-reveals-what-builds-trust-instead-302843128.html",
              "Cashew"
            )}{" "}
            found 87% of people already assume brand content is at least partly
            AI-made, while just 13% are confident they can tell. The slop is
            being published faster than trust can survive it.
          </p>
        </section>

        <section className="learn-section">
          <h2>Methodology</h2>
          <p>
            Primary sources where they exist, and the more conservative figure
            when a range is reported. Every sourced term links to its origin;
            assumptions are labeled as assumptions, and P is left as a slider
            rather than a claim. Found an error or a better number? The equation
            is versioned (below) and corrections are made in the open — reach us
            through the{" "}
            <a className="inline-link" href="/about">
              About page
            </a>
            .
          </p>
        </section>

        <section className="learn-section">
          <h2>Our own data</h2>
          <p>
            One number we will eventually own. UnSlopIt logs anonymous pattern
            counts on every edit — which tells appear, per thousand words, never
            the text itself. As that dataset grows it gives us a measured
            &ldquo;tells per 1,000 words,&rdquo; which extends the equation from
            words to tells: not just how much unedited AI text ships, but how
            much of it a reader can actually spot. That&rsquo;s the next version.
          </p>
        </section>

        <section className="learn-section">
          <h2>Put the equation on your page</h2>
          <p>
            The calculator is embeddable — copy the snippet below. And if you
            want to do something about your own slop, start with{" "}
            <a className="inline-link" href="/learn">
              what the tells are
            </a>{" "}
            or{" "}
            <a className="inline-link" href="/humanize-ai-text">
              how to cut them
            </a>
            .
          </p>

          <div className="code-block">
            <div className="code-head">
              <span className="code-label">Embed</span>
              <CopyButton text={EMBED_CODE} label="Copy embed code" />
            </div>
            <pre>
              <code>{EMBED_CODE}</code>
            </pre>
          </div>

          <div className="cite-block">
            <p className="cite-license">
              The SLOP Equation is published under{" "}
              {ext("https://creativecommons.org/licenses/by/4.0/", "CC BY 4.0")}
              {" "}— reuse it, remix it, just keep the credit.
            </p>
            <div className="code-block">
              <div className="code-head">
                <span className="code-label">Cite this</span>
                <CopyButton text={CITATION} label="Copy citation" />
              </div>
              <pre>
                <code>{CITATION}</code>
              </pre>
            </div>
            <p className="cite-version">
              {VERSION} · published {UPDATED_HUMAN}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
