import type { Metadata } from "next";
import { Syne, Manrope, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.scss";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
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
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
