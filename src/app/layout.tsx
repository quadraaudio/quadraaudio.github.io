import type { Metadata } from "next";
import { Syne, Manrope, IBM_Plex_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { CartProvider } from "@/components/providers/CartProvider";
import { GlobalNav } from "@/components/chrome/GlobalNav";
import { GlobalFooter } from "@/components/chrome/GlobalFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.scss";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quadra — Professional Audio Software",
    template: "%s — Quadra",
  },
  description:
    "Quadra builds professional audio software for studios, producers, and engineers.",
  openGraph: {
    title: "Quadra — Professional Audio Software",
    description:
      "Professional audio software for studios, producers, and engineers.",
    url: "https://quadraaudio.com",
    siteName: "Quadra",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body
        style={
          {
            "--font-display": "var(--font-syne), Syne, sans-serif",
            "--font-body": "var(--font-manrope), Manrope, sans-serif",
            "--font-mono": "var(--font-plex), 'IBM Plex Mono', monospace",
          } as React.CSSProperties
        }
      >
        <Auth0Provider>
          <CartProvider>
            <SmoothScroll>
              <GlobalNav />
              <div className="site-main">{children}</div>
              <GlobalFooter />
            </SmoothScroll>
          </CartProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
