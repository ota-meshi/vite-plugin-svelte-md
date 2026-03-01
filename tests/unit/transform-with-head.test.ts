import { describe, expect, it } from "vitest";
import { createMarkdownProcessor } from "../../src/markdown";
import { resolveOptions } from "../../src/options";

describe("transform with head", () => {
  const options = resolveOptions({ headEnabled: true });
  const mdToSvelte = createMarkdownProcessor(options);

  it("basic", async () => {
    const md = `---
title: Hey
---

# Hello

- A
- B
- C
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("head tag", async () => {
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
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
});
