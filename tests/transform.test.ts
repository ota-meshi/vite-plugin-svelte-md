import { createMarkdownProcessor } from "../src/markdown";
import { resolveOptions } from "../src/options";
import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";

chai.use(jestSnapshotPlugin());

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
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("style", () => {
    const md = `
# Hello

<style>h1 { color: red }</style>
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("script", () => {
    const md = `
# Hello

<script lang="ts">
import Foo from './Foo.vue'
</script>
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("exposes frontmatter", () => {
    const md = `---
title: Hey
---

# Hello`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("escapeCodeTagInterpolation", () => {
    const md = `
<div>{hello}</div>

\`\`\`svelte
<div>{hello}</div>
\`\`\`
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("scriptInsideSvelte", () => {
    const md = `
<svelte:head><script async src="foo.js"></script></svelte:head>

\`\`\`svelte
<svelte:head><script async src="foo.js"></script></svelte:head>
\`\`\`
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });

  it("frontmatter interpolation", () => {
    const md = `
---
name: 'My Cool App'
---

# Hello World

This is {frontmatter.name}
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
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
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in fence", () => {
    const md = `
\`\`\`js
function test() {
 return foo
}
\`\`\`
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in code inline", () => {
    const md = `
\`{...}\`
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in code block", () => {
    const md = `
    function test() {
        return foo
    }
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });
  it("escape curly braces in header", () => {
    const md = `---
title: "\`{#if}\`"
---
`;
    chai.expect(mdToSvelte("", md)).toMatchSnapshot();
  });
});
