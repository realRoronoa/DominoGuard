import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DominoGuard",
  description: "See the cascade. Stop the domino effect."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
