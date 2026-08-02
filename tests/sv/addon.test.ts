import fs from "node:fs";
import path from "node:path";
import addon from "../../src/sv/index.js";
import { createSetupTest, prepareServer } from "sv/testing";
import * as vitest from "vitest";

const setupTest = createSetupTest(vitest);

const { test, testCases } = setupTest(
  { addon },
  {
    kinds: [{ type: "default", options: { "vite-plugin-svelte-md": {} } }],
    browser: true,
    filter: () => true,
  },
);

test.for(testCases)(
  "vite-plugin-svelte-md $kind.type $variant",
  { timeout: 15_000, concurrent: true },
  async (testCase, { expect, page, ...ctx }) => {
    const cwd = ctx.cwd(testCase);

    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(cwd, "package.json"), "utf8"),
    );
    expect(pkg.devDependencies).toHaveProperty("vite-plugin-svelte-md");

    if (testCase.variant.includes("kit")) {
      const { close, url } = await prepareServer({
        cwd,
        page,
        buildCommand: "npm run build",
        previewCommand: "npm run preview",
      });
      // kill server process when we're done
      ctx.onTestFinished(close);

      await page.goto(new URL("markdown", url).toString());

      const snapshot = await page.locator("article").ariaSnapshot();
      expect(snapshot).toMatchInlineSnapshot(`
        "- article:
          - heading "Markdown Page" [level=1]
          - paragraph:
            - text: Thank you for using
            - code: vite-plugin-svelte-md
            - text: "!"
          - paragraph:
            - text: You can now import
            - code: .md
            - text: files and use them as Svelte components in your SvelteKit project, and you can also create
            - code: +page.md
            - text: files directly.
          - paragraph:
            - link "Read the documentation":
              - /url: https://github.com/ota-meshi/vite-plugin-svelte-md"
      `);

      const maxWidth = await page
        .locator("article")
        .evaluate((el) => el.computedStyleMap().get("max-width")?.toString());
      expect(maxWidth).toBe("640px");
    }
  },
);
