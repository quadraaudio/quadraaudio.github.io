import type { Metadata } from "next";
import { HydraMicrosite } from "@/components/hydra/HydraMicrosite";
import { HYDRA } from "@/data/hydra.landing";

export const metadata: Metadata = {
  title: {
    absolute: "Hydra — Professional audio routing for Mac",
  },
  description: HYDRA.lede,
  openGraph: {
    title: "Hydra",
    description: HYDRA.lede,
    url: "https://quadraaudio.com/products/hydra/",
    siteName: "Hydra",
    type: "website",
    images: [{ url: "/hydra/hero-studio.png" }],
  },
};

export default function HydraProductPage() {
  return <HydraMicrosite />;
}
