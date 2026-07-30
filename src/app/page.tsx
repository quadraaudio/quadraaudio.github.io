import { PublishedPage } from "@/components/PublishedPage";

export const metadata = {
  title: "Quadra Audio",
  description:
    "Professional virtual audio routing and spatial monitoring for macOS — built around Hydra.",
};

export default function HomePage() {
  return <PublishedPage slug="home" />;
}
