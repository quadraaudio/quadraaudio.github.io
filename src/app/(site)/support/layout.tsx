import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — Quadra",
  description:
    "MATRIX support: activation, Matrix Grid, audio bridges, AES67/NDI, Control Room, VST hosting, and troubleshooting.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
