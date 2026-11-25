import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Intro from "@/components/celestial/Intro";
import SparkleTrail from "@/components/celestial/SparkleTrail";
import StarBurst from "@/components/celestial/StarBurst";
import Starfield from "@/components/celestial/Starfield";
import BackToTop from "@/components/ui/BackToTop";
import { profile } from "@/data/profile";
import "./globals.css";

// Fonts are self-hosted (src/fonts, SIL Open Font License, latin subset), so
// builds never depend on reaching Google Fonts.
// Cormorant Garamond: display headings (500, with italics for emphasis).
// Cinzel: engraved capitals (labels, numerals, the hero motto).
// Manrope: body, navigation and buttons.
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-normal.woff2", weight: "400 600", style: "normal" },
    { path: "../fonts/cormorant-garamond-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const manrope = localFont({
  src: "../fonts/manrope-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
const cinzel = localFont({
  src: "../fonts/cinzel-normal.woff2",
  weight: "400 600",
  variable: "--font-cinzel",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const siteUrl =
  profile.siteUrl ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = `${profile.name} — Developer Portfolio`;
const description = `${profile.tagline} ${profile.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  keywords: ["portfolio", "web developer", "frontend developer", "Next.js", "React", profile.name],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: `${profile.name} Portfolio`,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe5" },
    { media: "(prefers-color-scheme: dark)", color: "#10172b" },
  ],
};

// Runs before paint, so there's no flash:
//  • theme — the visitor's saved choice, otherwise the night sky (dark);
//  • intro — the opening animation plays once per browser session.
const themeScript = `try{var d=document.documentElement,t=localStorage.getItem("theme");d.dataset.theme=t==="light"||t==="dark"?t:"dark";if(sessionStorage.getItem("intro")){d.dataset.intro="off"}else{sessionStorage.setItem("intro","1")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${cormorant.variable} ${manrope.variable} ${cinzel.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <Intro />
        <Providers>
          <SparkleTrail />
          <StarBurst />
          {/* `isolate` keeps the fixed starfield behind content but above the page background. */}
          <div className="relative isolate">
            <Starfield />
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
