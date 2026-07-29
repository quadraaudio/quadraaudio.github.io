import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "3j22tk8p",
  dataset: "production",
  apiVersion: "2026-07-29",
  useCdn: false,
  token: process.env.SANITY_TOKEN || "", // Optional token if dataset requires write auth
});

const pages = [
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

async function seed() {
  console.log("Seeding Sanity project 3j22tk8p...");
  try {
    const transaction = client.transaction();
    pages.forEach((page) => transaction.createOrReplace(page));
    await transaction.commit();
    console.log("SUCCESS! All pages seeded into Sanity.");
  } catch (err) {
    console.error("Error seeding Sanity:", err.message);
  }
}

seed();
