import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { createMarkdownProcessor } from "../../src/markdown";
import { resolveOptions } from "../../src/options";
import highlight from "./highlight-tools/highlight";
import lineNumbersPlugin from "./highlight-tools/line-numbers-plugin";

describe("transform with highlight", () => {
  const options = resolveOptions({
    headEnabled: true,
    markdownItOptions: { highlight },
  });
  const mdToSvelte = createMarkdownProcessor(options);

  it("highlight", () => {
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
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("highlight svelte", () => {
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
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("highlight svelte with line numbers", () => {
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
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  describe("highlight with fixtures", () => {
    const options = resolveOptions({
      headEnabled: true,
      markdownItOptions: { highlight },
      markdownItUses: [lineNumbersPlugin],
    });
    const mdToSvelte = createMarkdownProcessor(options);
    for (const fixture of iterateFiles(path.resolve(__dirname, "./fixtures"))) {
      it(fixture.name, () => {
        const sfc = mdToSvelte(fixture.name, fixture.content);
        if (process.argv.includes("--update")) {
          fs.writeFileSync(`${fixture.path}.svelte`, sfc, "utf-8");
        }
        expect(sfc).toMatchSnapshot();
      });
    }
  });
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
