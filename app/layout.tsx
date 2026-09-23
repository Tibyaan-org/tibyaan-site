import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "./_components/Nav";
import { Footer } from "./_components/Footer";

// Self-hosted at build time by next/font: no runtime request to Google.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

// The deploy origin. Overridable at build time via SITE_URL so the canonical/OG
// URLs track wherever the site lands.
const SITE_URL = process.env.SITE_URL || "https://tibyaan-org.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tibyaan: connect AI agents to your Spring backend",
    template: "%s · Tibyaan",
  },
  description:
    "Tibyaan reads your Spring application's source and serves the read operations it can verify to AI agents over MCP, from inside your app. Anything it can't verify is left out, and the scan output tells you why.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tibyaan: connect AI agents to your Spring backend",
    description:
      "Tibyaan turns the read operations it can verify from your source code into MCP tools. Zero wrong bindings across three benchmark applications, on every run.",
    type: "website",
    url: "/",
    siteName: "Tibyaan",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0a09" },
    { media: "(prefers-color-scheme: light)", color: "#0b0a09" },
  ],
};

// Runs before first paint so the stored theme never flashes. Dark is the default;
// a visitor's explicit choice (the nav toggle) is remembered in localStorage.
const THEME_SCRIPT = `try{var t=localStorage.getItem("tibyaan-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} style={{ outline: "none" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
