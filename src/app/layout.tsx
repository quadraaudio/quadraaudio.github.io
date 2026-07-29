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
  title: "Quadra — Advanced Audio Routing",
  description: "Official website of Quadra Audio (quadraaudio.com)",
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
