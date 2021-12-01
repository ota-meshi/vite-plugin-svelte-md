import { createMarkdownProcessor } from "../src/markdown"
import { resolveOptions } from "../src/options"
import chai from "chai"
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot"

chai.use(jestSnapshotPlugin())

describe("transform with head", () => {
    const options = resolveOptions({ headEnabled: true })
    const mdToSvelte = createMarkdownProcessor(options)

    it("basic", () => {
        const md = `---
title: Hey
---

# Hello

- A
- B
- C
`
        chai.expect(mdToSvelte("", md)).toMatchSnapshot()
    })

    it("head tag", () => {
        const md = `---
title: Hey
---

# Hello

- A
- B
- C

<script>
	import MyComponent from '$lib/MyComponent.svelte';
</script>

<svelte:head>
	<meta name="description" content="Bar" />
</svelte:head>

<MyComponent />
`
        chai.expect(mdToSvelte("", md)).toMatchSnapshot()
    })
})
