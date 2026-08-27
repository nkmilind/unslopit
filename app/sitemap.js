import { TAXONOMY } from "../lib/taxonomy";

const SITE = "https://unslopit.ai";

// Next generates /sitemap.xml from this. The taxonomy spoke pages are derived
// from the same data, so new categories are picked up automatically.
export default function sitemap() {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/learn`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/humanize-ai-text`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/slop-equation`, changeFrequency: "monthly", priority: 0.8 },
    ...TAXONOMY.map((c) => ({
      url: `${SITE}/learn/${c.id}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
