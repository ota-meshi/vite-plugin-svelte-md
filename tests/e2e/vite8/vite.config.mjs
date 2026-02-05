import { defineConfig } from "vite";
import svelteMd from "vite-plugin-svelte-md";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelteMd(), svelte({ extensions: [".svelte", ".md"] })],
  build: {
    ssr: true,
    rolldownOptions: {
      input: "../example.md",
      output: { entryFileNames: "index.js" },
    },
  },
});
