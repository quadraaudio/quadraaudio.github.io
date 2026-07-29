import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityCms";

interface PageDocument {
  _id: string;
  _type: string;
  title: string;
  slug: { _type: string; current: string };
  heroHeadline: string;
  heroSubheadline: string;
  carouselItems?: Array<{
    _key: string;
    title: string;
    subtitle: string;
    category: string;
  }>;
}

export async function GET() {
  const pages: PageDocument[] = [
    {
      _id: "page-home",
      _type: "page",
      title: "Home Page",
      slug: { _type: "slug", current: "home" },
      heroHeadline: "Quadra",
      heroSubheadline: "The new standard in virtual audio routing.",
      carouselItems: [
        {
          _key: "c1",
          title: "Hydra Pro",
          subtitle: "128-channel spatial matrix routing for macOS.",
          category: "Software",
        },
        {
          _key: "c2",
          title: "Quadra Core I/O",
          subtitle: "Hardware rack with 32-bit float AD/DA converters.",
          category: "Hardware",
        },
      ],
    },
    {
      _id: "page-hydra",
      _type: "page",
      title: "Hydra Pro Page",
      slug: { _type: "slug", current: "hydra" },
      heroHeadline: "Hydra Pro",
      heroSubheadline: "The premier 128-channel virtual audio router engineered for macOS.",
      carouselItems: [
        {
          _key: "h1",
          title: "Ultra-Low Latency",
          subtitle: "Sub-millisecond buffer speeds with Quadra Silicon engine.",
          category: "Performance",
        },
        {
          _key: "h2",
          title: "DAW Matrix Sync",
          subtitle: "Seamless integration across Logic Pro, Pro Tools & Ableton.",
          category: "Workflow",
        },
      ],
    },
    {
      _id: "page-store",
      _type: "page",
      title: "Store Page",
      slug: { _type: "slug", current: "store" },
      heroHeadline: "Quadra Store",
      heroSubheadline: "Explore pro audio software, hardware interfaces, and accessories.",
      carouselItems: [],
    },
    {
      _id: "page-support",
      _type: "page",
      title: "Support Page",
      slug: { _type: "slug", current: "support" },
      heroHeadline: "Quadra Support",
      heroSubheadline: "Expert assistance and documentation for your studio setup.",
      carouselItems: [],
    },
  ];

  try {
    const transaction = sanityClient.transaction();
    pages.forEach((page) => transaction.createOrReplace(page as any));
    await transaction.commit();

    return NextResponse.json({ success: true, message: "Sanity pages seeded successfully!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
