import { createMarkdownProcessor } from "../src/markdown";
import { resolveOptions } from "../src/options";
import { expect } from "@ota-meshi/test-snapshot";

describe("transform", () => {
  const options = resolveOptions({});
  const mdToSvelte = createMarkdownProcessor(options);

  it("basic", () => {
    const md = `---
title: Hey
---

# Hello

- A
- B
- C
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("style", () => {
    const md = `
# Hello

<style>h1 { color: red }</style>
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("script", () => {
    const md = `
# Hello

<script lang="ts">
import Foo from './Foo.vue'
</script>
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("exposes frontmatter", () => {
    const md = `---
title: Hey
---

# Hello`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("escapeCodeTagInterpolation", () => {
    const md = `
<div>{hello}</div>

\`\`\`svelte
<div>{hello}</div>
\`\`\`
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("scriptInsideSvelte", () => {
    const md = `
<svelte:head><script async src="foo.js"></script></svelte:head>

\`\`\`svelte
<svelte:head><script async src="foo.js"></script></svelte:head>
\`\`\`
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("frontmatter interpolation", () => {
    const md = `
---
name: 'My Cool App'
---

# Hello World

This is {frontmatter.name}
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("use component", () => {
    const md = `---
title: Markdown to Svelte
---

# Convert Markdown to Svelte Component

- List
- List
- List

<script>
    import MyComponent from './MyComponent.svelte'
</script>
<MyComponent>You can use Svelte components in Markdown</MyComponent>
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in fence", () => {
    const md = `
\`\`\`js
function test() {
 return foo
}
\`\`\`
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in code inline", () => {
    const md = `
\`{...}\`
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in code block", () => {
    const md = `
    function test() {
        return foo
    }
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in header", () => {
    const md = `---
title: "\`{#if}\`"
---
`;
    expect(mdToSvelte("", md)).toMatchSnapshot();
  });
});
