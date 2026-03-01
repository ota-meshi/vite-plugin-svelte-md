import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { createMarkdownProcessor } from "../../src/markdown";
import { resolveOptions } from "../../src/options";
import { highlight, asyncHighlight } from "./highlight-tools/highlight";
import lineNumbersPlugin from "./highlight-tools/line-numbers-plugin";

describe("transform with highlight", () => {
  const options = resolveOptions({
    headEnabled: true,
    markdownItOptions: { highlight },
  });
  const mdToSvelte = createMarkdownProcessor(options);

  it("highlight", async () => {
    const md = `---
title: Hey
---

# Hello

- A
- B
- C

\`\`\`js
function test() {
 return foo
}
\`\`\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
  it("highlight svelte", async () => {
    const md = `---
title: Hello Svelte
---

# Hello Svelte

\`\`\`svelte
<script>
	let name = 'world';

	let cats = [
		{ id: 'J---aiyznGQ', name: 'Keyboard Cat' },
		{ id: 'z_AbfPXTKms', name: 'Maru' },
		{ id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
	];
</script>

<h1>Hello {name}!</h1>

<ul>
	{#each cats as { id, name }, i}
		<li><a target="_blank" href="https://www.youtube.com/watch?v={id}">
			{i + 1}: {name}
		</a></li>
	{/each}
</ul>
\`\`\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("highlight svelte with line numbers", async () => {
    const options = resolveOptions({
      headEnabled: true,
      markdownItOptions: { highlight },
      markdownItUses: [lineNumbersPlugin],
    });
    const mdToSvelte = createMarkdownProcessor(options);
    const md = `---
title: Hello Svelte
---

# Hello Svelte

\`\`\`svelte
<script>
	let name = 'world';

	let cats = [
		{ id: 'J---aiyznGQ', name: 'Keyboard Cat' },
		{ id: 'z_AbfPXTKms', name: 'Maru' },
		{ id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
	];
</script>

<h1>Hello {name}!</h1>

<ul>
	{#each cats as { id, name }, i}
		<li><a target="_blank" href="https://www.youtube.com/watch?v={id}">
			{i + 1}: {name}
		</a></li>
	{/each}
</ul>
\`\`\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  describe.each([highlight, asyncHighlight])(
    "highlight with fixtures",
    (highlight) => {
      const options = resolveOptions({
        headEnabled: true,
        markdownItOptions: { highlight },
        markdownItUses: [lineNumbersPlugin],
      });
      const mdToSvelte = createMarkdownProcessor(options);
      for (const fixture of iterateFiles(
        path.resolve(__dirname, "./fixtures"),
      )) {
        it(fixture.name, async () => {
          const sfc = await mdToSvelte(fixture.name, fixture.content);
          if (process.argv.includes("--update")) {
            fs.writeFileSync(`${fixture.path}.svelte`, sfc, "utf-8");
          }
          expect(sfc).toBe(fs.readFileSync(`${fixture.path}.svelte`, "utf-8"));
        });
      }
    },
  );
});

function* iterateFiles(rootDir: string): IterableIterator<{
  content: string;
  name: string;
  path: string;
}> {
  for (const filename of fs.readdirSync(rootDir)) {
    if (filename.startsWith("_")) {
      // ignore
      continue;
    }
    const abs = path.join(rootDir, filename);
    if (fs.statSync(abs).isDirectory()) {
      yield* iterateFiles(abs);
    } else {
      if (filename.endsWith(".md")) {
        yield {
          content: fs.readFileSync(abs, "utf-8"),
          name: filename,
          path: abs,
        };
      }
    }
  }
}
