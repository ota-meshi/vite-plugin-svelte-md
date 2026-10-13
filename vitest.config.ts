import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    // Tests write to these on every run, watching them causes an infinite loop
    watch: { ignored: ["**/.test-output/**"] },
  },
  test: {
    globalSetup: ["tests/sv/global.js"],
  },
});
