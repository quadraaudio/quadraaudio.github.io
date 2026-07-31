import type { Metadata } from "next";
import GlobalNav from "@/components/GlobalNav";
import GlobalFooter from "@/components/GlobalFooter";
import { ThemeProvider } from "@/components/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Quadra Audio",
  description:
    "Quadra Audio builds professional macOS audio software — Hydra, the virtual audio patchbay for studios and broadcast.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
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
        <ThemeProvider>
          <AuthProvider>
            <GlobalNav />
            {children}
            <GlobalFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
