import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DominoGuard — Cyber Cascade & Blast Radius Dashboard",
  description:
    "DominoGuard simulates how a single compromised account or SIM swap chains across your digital footprint. Privacy-first, powered by Amazon Bedrock.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f2eae2] text-[#1c1917] antialiased">{children}</body>
    </html>
  );
}
