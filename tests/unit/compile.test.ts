import { describe, expect, it } from "vitest";
import { createMarkdownProcessor } from "../../src/markdown.ts";
import { resolveOptions } from "../../src/options.ts";
import { compile } from "svelte/compiler";

describe("ensure svelte compilation succeeds", () => {
  it("complex frontmatter", async () => {
    const mdToSvelte = createMarkdownProcessor(resolveOptions({}));
    const input = `---
# Would cause "Unterminated string constant" if not properly escaped
xss: <script>, </script>, <style> and </style>
# Not a valid JSON value (circular structure)
recursive: &anchor
  self: *anchor
# Not a valid JSON value
infinity: -.inf
---

# Does it work?
`;

    const svelte = await mdToSvelte("", input);

    // Compile and evaluate the resulting JS code
    const { js } = compile(svelte, {});
    const code = js.code.replaceAll(
      /(import.+?["'])(.+?)(["'])/g,
      (_, start, id, close) => start + import.meta.resolve(id) + close,
    );
    const { frontmatter } = await import(
      `data:application/javascript;base64,${Buffer.from(code).toString("base64")}`
    );

    // Instead of taking a snapshot, we check the actual values after evaluation
    expect(frontmatter.xss).toBe("<script>, </script>, <style> and </style>");
    expect(frontmatter.recursive.self).toBe(frontmatter.recursive);
    expect(frontmatter.infinity).toBe(-Infinity);
  });
});
