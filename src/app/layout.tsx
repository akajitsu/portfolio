import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Intro from "@/components/celestial/Intro";
import SparkleTrail from "@/components/celestial/SparkleTrail";
import PauseOffscreen from "@/components/celestial/PauseOffscreen";
import StarBurst from "@/components/celestial/StarBurst";
import Starfield from "@/components/celestial/Starfield";
import BackToTop from "@/components/ui/BackToTop";
import { profile } from "@/data/profile";
import "./globals.css";

// Montserrat, self-hosted (src/fonts, SIL Open Font License, latin subset), so
// builds never depend on reaching Google Fonts. One variable font (weights
// 100–900, upright and italic) sets every role: headings, body and the small
// engraved capitals (see the font tokens in globals.css).
const montserrat = localFont({
  src: [
    { path: "../fonts/montserrat-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/montserrat-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
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
    <html lang="en" data-theme="dark" suppressHydrationWarning className={montserrat.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <Intro />
        <Providers>
          <SparkleTrail />
          <StarBurst />
          <PauseOffscreen />
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
