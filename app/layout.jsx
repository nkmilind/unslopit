import "./globals.css";

export const metadata = {
  title: "UnSlopIt.ai — Just UnSlopIt",
  description:
    "Turn AI slop into text that sounds like a person wrote it. Instant AI edit, or a human editor in 1 hour.",
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
      <body>{children}</body>
    </html>
  );
}
