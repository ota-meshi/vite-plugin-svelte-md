import { createMarkdownProcessor } from "../src/markdown"
import { resolveOptions } from "../src/options"
import chai from "chai"
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot"
import highlight from "./highlight-tools/highlight"
import lineNumbersPlugin from "./highlight-tools/line-numbers-plugin"

chai.use(jestSnapshotPlugin())

describe("transform with highlight", () => {
    const options = resolveOptions({
        headEnabled: true,
        markdownItOptions: { highlight },
    })
    const mdToSvelte = createMarkdownProcessor(options)

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
`
        chai.expect(mdToSvelte("", md)).toMatchSnapshot()
    })
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
`
        chai.expect(mdToSvelte("", md)).toMatchSnapshot()
    })

    it("highlight svelte with line numbers", () => {
        const options = resolveOptions({
            headEnabled: true,
            markdownItOptions: { highlight },
            markdownItUses: [lineNumbersPlugin],
        })
        const mdToSvelte = createMarkdownProcessor(options)
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
`
        chai.expect(mdToSvelte("", md)).toMatchSnapshot()
    })
})
