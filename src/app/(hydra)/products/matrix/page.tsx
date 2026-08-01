import type { Metadata } from "next";
import { HydraMicrosite } from "@/components/hydra/HydraMicrosite";
import { HYDRA } from "@/data/hydra.landing";

export const metadata: Metadata = {
  title: {
    absolute: "MATRIX — Professional audio routing for Mac",
  },
  description: HYDRA.lede,
  openGraph: {
    title: "MATRIX",
    description: HYDRA.lede,
    url: "https://quadraaudio.com/products/matrix/",
    siteName: "MATRIX",
    type: "website",
    images: [{ url: "/hydra/hero-studio.png" }],
  },
};

export default function MatrixProductPage() {
  return <HydraMicrosite />;
}
