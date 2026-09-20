import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import rehypeCitation from "rehype-citation";
import rehypeCitationSection from "./src/lib/rehype-citation-section.mjs";

export default defineConfig({
  site: "https://iibrahimli.github.io",
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          rehypeCitation,
          {
            bibliography: "src/data/references.json",
            csl: "apa",
            inlineClass: ["citation"],
            linkCitations: true,
          },
        ],
        rehypeCitationSection,
      ],
    }),
  },
});
