import type { Metadata } from "next";
import "./globals.scss";
import GlobalNav from "@/components/GlobalNav";
import GlobalFooter from "@/components/GlobalFooter";
import { ThemeProvider } from "@/components/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { SiteContentProvider } from "@/contexts/SiteContentContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Quadra",
    template: "%s — Quadra",
  },
  description: "Official website of Quadra Audio (quadraaudio.com)",
  applicationName: "Quadra",
  icons: {
    icon: [
      { url: "/icon.png?v=quadra2", type: "image/png", sizes: "64x64" },
      { url: "/icon.svg?v=quadra2", type: "image/svg+xml" },
      { url: "/favicon.ico?v=quadra2" },
    ],
    shortcut: "/icon.png?v=quadra2",
    apple: "/apple-touch-icon.png?v=quadra2",
  },
  appleWebApp: {
    title: "Quadra",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Quadra — Advanced Audio Routing",
    description: "Official website of Quadra Audio (quadraaudio.com)",
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
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteContentProvider>
            <ProductProvider>
              <CartProvider>
                <ThemeProvider>
                  <GlobalNav />
                  <main style={{ paddingTop: "44px" }}>{children}</main>
                  <GlobalFooter />
                </ThemeProvider>
              </CartProvider>
            </ProductProvider>
          </SiteContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
