import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DominoGuard — See the cascade before the damage starts",
  description:
    "DominoGuard is a privacy-first cybersecurity simulator. Select your digital accounts, trigger a threat scenario, and watch the AI-powered blast radius unfold. No passwords required.",
  keywords: ["cybersecurity", "account security", "blast radius", "domino effect", "AWS Bedrock", "hackathon"],
  openGraph: {
    title: "DominoGuard — Cyber Cascade Simulator",
    description: "See how one compromised account can expose everything. Powered by Amazon Bedrock.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
