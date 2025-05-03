// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightVideos from "starlight-videos";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Videos",
      social: [
        {
          icon: "blueSky",
          label: "BlueSky",
          href: "https://bsky.app/profile/trueberryless.org",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/trueberryless-org/videos",
        },
      ],
      sidebar: [
        {
          label: "Videos",
          autogenerate: { directory: "videos" },
        },
      ],
      plugins: [starlightVideos()],
      customCss: ["./src/styles/landing.css"],
    }),
  ],
});
