import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import ScrollPositionMemory from "@/components/ui/scroll-position-memory";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600", "900"],
});

const SITE_NAME = "POCCO Club";
const SITE_DESCRIPTION =
  "POCCO Club — la discoteca de Alzira. Eventos cada fin de semana, reservados VIP y la mejor noche de la Ribera. Consulta el calendario y compra tu entrada.";

// Required so every relative OG/Twitter image URL below (and in per-page
// metadata) resolves to an absolute pocco.club URL in production instead of
// silently resolving against whatever host actually served the request.
export const metadata: Metadata = {
  metadataBase: new URL("https://pocco.club"),
  title: {
    default: `${SITE_NAME} — Alzira`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "POCCO Club",
    "discoteca Alzira",
    "club Alzira",
    "eventos Alzira",
    "reservados VIP Alzira",
    "ocio nocturno Valencia",
  ],
  authors: [{ name: "POCCOCLUB, S.L." }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://pocco.club",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Alzira`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/og/pocco-club-og.jpg",
        width: 1200,
        height: 630,
        alt: "POCCO Club — Alzira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Alzira`,
    description: SITE_DESCRIPTION,
    images: ["/assets/og/pocco-club-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Strips a stale "#" left in the URL by the Fourvenues events widget
            (it rewrites window.location.hash for its own in-widget routing,
            and can leave it dangling as just "#" after navigating back).

            Scroll restoration is handled ourselves instead of trusting
            Chrome's own scroll-history restoration, which was confirmed
            unreliable here (same restored position regardless of what runs
            beforeInteractive, and never triggered by any interceptable JS
            API) — 'manual' turns that native mechanism off entirely so it
            can't fight with the sessionStorage-based restore below.

            On a genuine reload (not a same-tab in-page navigation, and not
            arriving with a stale Fourvenues hash — that case still needs
            the old force-to-top behavior, since a dangling hash means the
            saved position is meaningless), the last scroll position for
            this path is read from sessionStorage and restored. It's saved
            continuously as the user scrolls (see the scroll listener added
            by ScrollPositionMemory below, not here) rather than only on
            unload, since unload/beforeunload/pagehide are unreliable for
            this on mobile Safari (backgrounding/switching tabs doesn't
            reliably fire them) — a page reopened from the background can
            skip straight to a fresh load without ever running an unload
            handler.

            A plain <script> tag here doesn't work — Next.js (App Router)
            strips/ignores raw <script> elements rendered by a component
            ("Scripts inside React components are never executed when
            rendering on the client"); next/script's beforeInteractive
            strategy is the supported way to inject a script that runs
            during initial HTML parsing, before hydration. */}
        <Script id="restore-scroll" strategy="beforeInteractive">
          {`
            if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
            if (window.location.hash) {
              history.replaceState(null, "", window.location.pathname + window.location.search);
              window.scrollTo(0, 0);
            } else {
              try {
                var saved = sessionStorage.getItem('scrollY:' + window.location.pathname);
                if (saved) { window.scrollTo(0, parseInt(saved, 10) || 0); }
              } catch (e) {}
            }
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollPositionMemory />
        {children}
      </body>
    </html>
  );
}
