import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "default",
  title: "Quadra Audio Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "3j22tk8p",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content Editor")
          .items([
            S.listItem()
              .title("🏠 Home Page")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),

            S.listItem()
              .title("🐍 Hydra Pro Page")
              .id("hydraPage")
              .child(S.document().schemaType("hydraPage").documentId("hydraPage")),

            S.listItem()
              .title("🛍️ Store Page")
              .id("storePage")
              .child(S.document().schemaType("storePage").documentId("storePage")),

            S.listItem()
              .title("🎧 Support Page")
              .id("supportPage")
              .child(S.document().schemaType("supportPage").documentId("supportPage")),
          ]),
    }),
  ],

  schema: {
    types: [
      // 1. Home Page Schema
      {
        name: "homePage",
        title: "Home Page",
        type: "document",
        initialValue: {
          title: "Home Page",
          heroHeadline: "Quadra",
          heroSubheadline: "The new standard in virtual audio routing.",
          storeBoxHeadline: "Store",
          storeBoxSubheadline: "Get Hydra today and revolutionize your workflow.",
          supportBoxHeadline: "Quadra Support",
          supportBoxSubheadline: "Expert help for your professional audio setup.",
        },
        fields: [
          { name: "title", title: "Internal Name", type: "string" },
          { name: "heroHeadline", title: "Main Hero Title", type: "string" },
          { name: "heroSubheadline", title: "Main Hero Subtitle", type: "text" },
          { name: "storeBoxHeadline", title: "Store Bento Box Title", type: "string" },
          { name: "storeBoxSubheadline", title: "Store Bento Box Subtitle", type: "text" },
          { name: "supportBoxHeadline", title: "Support Bento Box Title", type: "string" },
          { name: "supportBoxSubheadline", title: "Support Bento Box Subtitle", type: "text" },
        ],
      },

      // 2. Hydra Pro Page Schema
      {
        name: "hydraPage",
        title: "Hydra Pro Page",
        type: "document",
        initialValue: {
          title: "Hydra Pro Page",
          heroHeadline: "Hydra Pro",
          heroSubheadline: "The premier 128-channel virtual audio router engineered for macOS.",
          siliconSectionTitle: "Designed for Quadra Silicon.",
          siliconSectionSub: "Engineered to harness full multi-core performance for sub-millisecond roundtrip buffer speeds.",
        },
        fields: [
          { name: "title", title: "Internal Name", type: "string" },
          { name: "heroHeadline", title: "Hydra Page Title", type: "string" },
          { name: "heroSubheadline", title: "Hydra Page Subtitle", type: "text" },
          { name: "siliconSectionTitle", title: "Silicon Section Title", type: "string" },
          { name: "siliconSectionSub", title: "Silicon Section Subtitle", type: "text" },
        ],
      },

      // 3. Store Page Schema
      {
        name: "storePage",
        title: "Store Page",
        type: "document",
        initialValue: {
          title: "Store Page",
          heroHeadline: "Store. The best way to buy the products you love.",
          helpShelfTitle: "Need shopping help?",
        },
        fields: [
          { name: "title", title: "Internal Name", type: "string" },
          { name: "heroHeadline", title: "Store Banner Title", type: "string" },
          { name: "helpShelfTitle", title: "Shopping Help Shelf Title", type: "string" },
        ],
      },

      // 4. Support Page Schema
      {
        name: "supportPage",
        title: "Support Page",
        type: "document",
        initialValue: {
          title: "Support Page",
          heroHeadline: "Quadra Support",
          searchPlaceholder: "Search for topics, articles, or guides...",
        },
        fields: [
          { name: "title", title: "Internal Name", type: "string" },
          { name: "heroHeadline", title: "Support Page Title", type: "string" },
          { name: "searchPlaceholder", title: "Search Box Placeholder", type: "string" },
        ],
      },
    ],
  },
});
