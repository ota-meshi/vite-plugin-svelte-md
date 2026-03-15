import { describe, expect, it } from "vitest";
import { createMarkdownProcessor } from "../../src/markdown";
import { resolveOptions } from "../../src/options";

describe("transform", () => {
  const options = resolveOptions({});
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

  it("style", async () => {
    const md = `
# Hello

<style>h1 { color: red }</style>
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("script", async () => {
    const md = `
# Hello

<script lang="ts">
import Foo from './Foo.vue'
</script>
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("exposes frontmatter", async () => {
    const md = `---
title: Hey
---

# Hello`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("escapeCodeTagInterpolation", async () => {
    const md = `
<div>{hello}</div>

\`\`\`svelte
<div>{hello}</div>
\`\`\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("scriptInsideSvelte", async () => {
    const md = `
<svelte:head><script async src="foo.js"></script></svelte:head>

\`\`\`svelte
<svelte:head><script async src="foo.js"></script></svelte:head>
\`\`\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("frontmatter interpolation", async () => {
    const md = `
---
name: 'My Cool App'
---

# Hello World

This is {frontmatter.name}
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("use component", async () => {
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
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in fence", async () => {
    const md = `
\`\`\`js
function test() {
 return foo
}
\`\`\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in code inline", async () => {
    const md = `
\`{...}\`
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in code block", async () => {
    const md = `
    function test() {
        return foo
    }
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in header", async () => {
    const md = `---
title: "\`{#if}\`"
---
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });

  it("parses Svelte components as HTML", async () => {
    const md = `Basic

<Component foo="foo" bar={"bar"} />

Multi-line

<Component
  foo="foo"
  bar={"bar"}
/>

With children

<Component foo="foo" bar={"bar"}>
  I'm **not** markdown
</Component>

With markdown children

<Component foo="foo" bar={"bar"}>

# Heading

I'm **markdown** inside a component

</Component>

Works in lists too

- <Component
    foo="foo"
    bar={"bar"}
  />

Does not break indent-based code blocks

    <Component
      foo="foo"
      bar={"bar"}
    />

Inline component <Comp foo="foo" bar={"bar"} /> also works

Even multiline <Comp
  foo="foo"
  bar={"bar"}
/> works

A component will close the current paragraph
<Component />
`;
    expect(await mdToSvelte("", md)).toMatchSnapshot();
  });
});
