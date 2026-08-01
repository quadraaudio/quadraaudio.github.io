import type { Metadata } from "next";
import { HydraMicrosite } from "@/components/hydra/HydraMicrosite";
import { HYDRA } from "@/data/hydra.landing";

export const metadata: Metadata = {
  title: {
    absolute: "MATRIX — Patch matrix + monitor for Mac",
  },
  description: HYDRA.lede,
  openGraph: {
    title: "QUADRA MATRIX",
    description: HYDRA.lede,
    url: "https://quadraaudio.com/products/matrix/",
    siteName: "Quadra",
    type: "website",
    images: [{ url: "/matrix/brand-mark.png" }],
  },
};

export default function MatrixProductPage() {
  return <HydraMicrosite />;
}
