import "./globals.css";
import Script from "next/script";

const SITE = "https://unslopit.ai";
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const DESCRIPTION =
  "Remove AI slop in seconds. UnSlopIt strips the tells — buzzwords, stock framings, chatbot sign-offs — and hands back a clean draft with a red-pen change list.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "UnSlopIt — remove AI slop, keep your meaning",
    template: "%s · UnSlopIt",
  },
  description: DESCRIPTION,
  applicationName: "UnSlopIt",
  keywords: [
    "AI slop",
    "remove AI slop",
    "AI writing tells",
    "make AI text sound human",
    "humanize AI text",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "UnSlopIt",
    url: SITE,
    title: "UnSlopIt — remove AI slop, keep your meaning",
    description: DESCRIPTION,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "UnSlopIt — remove AI slop" },
    ],
  },
  twitter: {
    // title/description/image are intentionally omitted: X falls back to the
    // per-page og: tags, so every page (including future spokes) gets correct
    // card text automatically, with one set of fields and no drift. `card` has
    // no og: equivalent, so it stays.
    card: "summary_large_image",
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
        {ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gads" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ADS_ID}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
