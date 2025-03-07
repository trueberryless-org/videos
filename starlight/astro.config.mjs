// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightVideos from "starlight-videos";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Videos",
      social: {
        github: "https://github.com/trueberryless-org/videos",
      },
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
