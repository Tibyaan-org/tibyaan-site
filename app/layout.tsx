import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "./_components/Nav";
import { Footer } from "./_components/Footer";

// Self-hosted at build time by next/font: no runtime request to Google.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-serif",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tibyaan-org.github.io"),
  title: {
    default: "Tibyaan: AI agents for the backend you already run",
    template: "%s · Tibyaan",
  },
  description:
    "Tibyaan reads your Spring application's source, exposes only the read operations it can prove, and serves them to AI agents over MCP. Everything it cannot prove, it refuses, with the reason.",
  openGraph: {
    title: "Tibyaan: AI agents for the backend you already run",
    description:
      "Every tool proven, or refused. Zero wrong bindings across three real applications.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EEE3",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}
    >
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
