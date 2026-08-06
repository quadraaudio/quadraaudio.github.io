import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — Quadra",
  description:
    "MATRIX support: install, authorize, patch routing, Matrix Bridge devices, monitor control, and troubleshooting.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
