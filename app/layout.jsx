import "./globals.css";

const SITE = "https://unslopit.ai";
const DESCRIPTION =
  "Humanize AI text in seconds. UnSlopIt strips the tells — buzzwords, stock framings, chatbot sign-offs — and hands back a clean draft with a red-pen change list.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "UnSlopIt — humanize AI text, keep your meaning",
    template: "%s · UnSlopIt",
  },
  description: DESCRIPTION,
  applicationName: "UnSlopIt",
  keywords: [
    "humanize AI text",
    "AI slop",
    "make AI text sound human",
    "AI writing tells",
    "remove AI buzzwords",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "UnSlopIt",
    url: SITE,
    title: "UnSlopIt — humanize AI text, keep your meaning",
    description: DESCRIPTION,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "UnSlopIt — humanize AI text" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UnSlopIt — humanize AI text, keep your meaning",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "UnSlopIt",
  url: SITE,
  description: DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Fragment+Mono:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
