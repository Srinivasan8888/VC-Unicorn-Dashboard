import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unicorns — IndianVCs",
  description:
    "A broadsheet ledger of India's private $1B+ startups. Valuations, sectors, cities, funding. Updated April 2026.",
  icons: {
    icon: [
      { url: "https://hub.indianvcs.com/brand/favicon-16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "https://hub.indianvcs.com/brand/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "https://hub.indianvcs.com/brand/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "https://hub.indianvcs.com/brand/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: "https://hub.indianvcs.com/brand/apple-touch-icon.png?v=2",
    shortcut: "https://hub.indianvcs.com/favicon.ico?v=2",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
