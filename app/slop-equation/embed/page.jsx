import SlopCalculator from "../../_components/SlopCalculator";

// The embeddable widget. Lives under /slop-equation/embed so the attribution
// link and the widget share a namespace, and it's obvious in a host page's
// source where it came from. noindex so it never competes with the article.
export const metadata = {
  title: "The SLOP Equation — embeddable calculator",
  description:
    "Embeddable calculator: how many unedited AI words get published every day. SLOP = S × L × O × P.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/slop-equation/embed" },
  openGraph: { url: "/slop-equation/embed", images: ["/og.png"] },
};

export default function SlopEquationEmbed() {
  return (
    <main className="eq-embed-page">
      <SlopCalculator embed />
    </main>
  );
}
