const SITE = "https://unslopit.ai";

// Next generates /sitemap.xml from this. Content pages (Part 2) get appended
// here as they ship.
export default function sitemap() {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/learn`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
