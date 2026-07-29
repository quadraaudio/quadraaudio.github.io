import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "default",
  title: "Quadra Audio Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "3j22tk8p",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  plugins: [structureTool()],

  schema: {
    types: [
      {
        name: "page",
        title: "Site Pages",
        type: "document",
        initialValue: {
          title: "Home Page",
          heroHeadline: "Quadra",
          heroSubheadline: "The new standard in virtual audio routing.",
          carouselItems: [
            {
              title: "Hydra Pro",
              subtitle: "128-channel spatial matrix routing for macOS.",
              category: "Software",
            },
            {
              title: "Quadra Core I/O",
              subtitle: "Hardware rack with 32-bit float AD/DA converters.",
              category: "Hardware",
            },
          ],
        },
        fields: [
          { name: "title", title: "Page Title", type: "string" },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
          },
          { name: "heroHeadline", title: "Hero Main Headline", type: "string" },
          { name: "heroSubheadline", title: "Hero Subheadline", type: "text" },
          {
            name: "carouselItems",
            title: "Carousel Cards",
            type: "array",
            of: [
              {
                type: "object",
                fields: [
                  { name: "title", title: "Card Title", type: "string" },
                  { name: "subtitle", title: "Card Subtitle", type: "string" },
                  { name: "category", title: "Category", type: "string" },
                  { name: "image", title: "Image", type: "image" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
