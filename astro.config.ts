import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightVideos from "starlight-videos";

const site = "https://videos.felixs.dev";

export default defineConfig({
  integrations: [
    starlight({
      head: [
        {
          attrs: { content: `${site}/og-image.png`, property: "og:image" },
          tag: "meta",
        },
        { attrs: { content: "1200", property: "og:image:width" }, tag: "meta" },
        { attrs: { content: "630", property: "og:image:height" }, tag: "meta" },
        {
          attrs: {
            content: "Videos: Videos from my YouTube channel.",
            property: "og:image:alt",
          },
          tag: "meta",
        },
        {
          attrs: { content: "summary_large_image", name: "twitter:card" },
          tag: "meta",
        },
        {
          attrs: { content: `${site}/og-image.png`, name: "twitter:image" },
          tag: "meta",
        },
      ],
      plugins: [starlightVideos()],
      sidebar: [
        { items: [{ autogenerate: { directory: "videos" } }], label: "Videos" },
      ],
      social: [
        {
          href: "https://bsky.app/profile/trueberryless.org",
          icon: "blueSky",
          label: "BlueSky",
        },
        {
          href: "https://github.com/trueberryless-org/videos",
          icon: "github",
          label: "GitHub",
        },
      ],
      title: "Videos",
    }),
  ],
  site,
});
