# vite-plugin-svelte-md

Markdown with Svelte for Vite

_`vite-plugin-svelte-md` is heavily inspired by [vite-plugin-md](https://github.com/antfu/vite-plugin-md) package._

[![NPM license](https://img.shields.io/npm/l/vite-plugin-svelte-md.svg)](https://www.npmjs.com/package/vite-plugin-svelte-md)
[![NPM version](https://img.shields.io/npm/v/vite-plugin-svelte-md.svg)](https://www.npmjs.com/package/vite-plugin-svelte-md)
[![NPM downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/vite-plugin-svelte-md&maxAge=3600)](http://www.npmtrends.com/vite-plugin-svelte-md)
[![NPM downloads](https://img.shields.io/npm/dw/vite-plugin-svelte-md.svg)](http://www.npmtrends.com/vite-plugin-svelte-md)
[![NPM downloads](https://img.shields.io/npm/dm/vite-plugin-svelte-md.svg)](http://www.npmtrends.com/vite-plugin-svelte-md)
[![NPM downloads](https://img.shields.io/npm/dy/vite-plugin-svelte-md.svg)](http://www.npmtrends.com/vite-plugin-svelte-md)
[![NPM downloads](https://img.shields.io/npm/dt/vite-plugin-svelte-md.svg)](http://www.npmtrends.com/vite-plugin-svelte-md)
[![Build Status](https://github.com/ota-meshi/vite-plugin-svelte-md/workflows/CI/badge.svg?branch=main)](https://github.com/ota-meshi/vite-plugin-svelte-md/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/ota-meshi/vite-plugin-svelte-md/badge.svg?branch=main)](https://coveralls.io/github/ota-meshi/vite-plugin-svelte-md?branch=main)

## 📛 Features

This plugin converts markdown files to Svelte component templates.<br>
Combined with [the Svelte plugin](https://github.com/sveltejs/vite-plugin-svelte), you can convert markdown files to Svelte components.

For example, Input:

```md
---
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
```

Output:

```svelte
<script context="module">
  export const frontmatter = { title: "Markdown to Svelte" };
</script>

<script>
  import MyComponent from "./MyComponent.svelte";
</script>

<svelte:head>
  <title>Markdown to Svelte</title>
  <meta property="og:title" content="Markdown to Svelte" />
</svelte:head>

<div class="markdown-body">
  <h1>Convert Markdown to Svelte Component</h1>
  <ul>
    <li>List</li>
    <li>List</li>
    <li>List</li>
  </ul>

  <p>
    <MyComponent>You can use Svelte components in Markdown</MyComponent>
  </p>
</div>
```

## 💿 Installation

```bash
npm install --save-dev vite-plugin-svelte-md
```

## 📖 Usage

### with [Vite]

Add it to `vite.config.js`

```ts
// vite.config.js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import svelteMd from "vite-plugin-svelte-md";

export default defineConfig({
  plugins: [
    svelteMd(), // <--
    svelte({
      extensions: [".svelte", ".md"], // <--
    }),
  ],
});
```

### with [SvelteKit]

Edit `svelte.config.js`

```js
// svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"], // <--
};
```

Add it to `vite.config.js`

```ts
// vite.config.js
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import svelteMd from "vite-plugin-svelte-md";

export default defineConfig({
  plugins: [
    svelteMd(), // <--
    sveltekit(),
  ],
});
```

[sveltekit]: https://kit.svelte.dev/
[vite]: https://vitejs.dev/

### Options

```js
import svelteMd from "vite-plugin-svelte-md";
svelteMd({
  headEnabled: true,
  markdownItOptions: {},
  markdownItUses: [],
  wrapperClasses: "markdown-body",
});
```

#### `headEnabled`

Enables head tag generation from frontmatter. The default is `true`.

#### `markdownItOptions`

[markdown-it](https://github.com/markdown-it/markdown-it)'s option.
See [markdown-it's docs](https://markdown-it.github.io/markdown-it/) for more details.

#### `markdownItUses`

An array of [markdown-it](https://github.com/markdown-it/markdown-it)'s plugins.

Example:

```js
svelteMd({
  markdownItUses: [require("markdown-it-anchor"), require("markdown-it-prism")],
});
```

#### `wrapperClasses`

The class name of the div that wraps the content.

## 🎏 Comparison

`vite-plugin-svelte-md` is not the only library that converts markdown to Svelte components:

<table>
  <tr>
    <th></th>
    <th>
      <a href="https://github.com/ota-meshi/vite-plugin-svelte-md">ota-meshi/vite-plugin-svelte-md</a>
    </th>
    <th>
      <a href="https://github.com/pngwn/MDsveX">pngwn/MDsveX</a>
    </th>
  </tr>
  <tr>
    <td>Popularity</td>
    <td><a href="https://npmx.dev/package/vite-plugin-svelte-md"><img alt="NPM Downloads" src="https://img.shields.io/npm/dw/vite-plugin-svelte-md?style=flat-square&color=d73d36"></a> <a href="https://github.com/ota-meshi/vite-plugin-svelte-md"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ota-meshi/vite-plugin-svelte-md?style=flat-square&color=eac54f"></a></td>
    <td><a href="https://npmx.dev/package/mdsvex"><img alt="NPM Downloads" src="https://img.shields.io/npm/dw/mdsvex?style=flat-square&color=d73d36"></a> <a href="https://github.com/pngwn/MDsveX"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/pngwn/MDsveX?style=flat-square&color=eac54f"></a></td>
  </tr>
  <tr>
    <td>License</td>
    <td><a href="https://github.com/ota-meshi/vite-plugin-svelte-md/blob/main/LICENSE">MIT</a></td>
    <td><a href="https://github.com/pngwn/MDsveX/blob/main/LICENSE">MIT</a></td>
  </tr>
  <tr>
    <th colspan="3">Architecture</th>
  </tr>
  <tr>
    <td>Markdown parser</td>
    <td><a href="https://npmx.dev/package/markdown-it">markdown-it</a> (supports plugins)</td>
    <td><a href="https://npmx.dev/package/remark">remark</a> + <a href="https://npmx.dev/package/rehype">rehype</a>  (supports plugins)</td>
  </tr>
  <tr>
    <td>Transformation step</td>
    <td>Vite plugin (compatible with other Vite plugins, e.g. <a href="https://svelte.dev/docs/kit/images#sveltejs-enhanced-img"><code>@sveltejs/enhanced-img</code></a>)</td>
    <td>Svelte preprocessor</td>
  </tr>
  <tr>
    <th colspan="3">Features</th>
  </tr>
  <tr>
    <td>Frontmatter</td>
    <td><a href="https://npmx.dev/package/gray-matter">✅ (YAML, JSON or JS)</a><br>
    Accessible through <code>{frontmatter.variable}</code></td>
    <td>✅ (YAML, <a href="https://mdsvex.pngwn.io/docs#frontmatter">can be changed</a>)<br>
    Accessible through <code>{variable}</code>
    </td>
  </tr>
  <tr>
    <td><code>&lt;head></code> tag generation</td>
    <td>✅ (from frontmatter, <a href="#headenabled">can be disabled</a>)</td>
    <td>❌ (manual)</td>
  </tr>
  <tr>
    <td>Syntax highlighting</td>
    <td>⚙️ (bring your own in <a href="https://github.com/markdown-it/markdown-it#syntax-highlighting"><code>markdownItOptions.highlight</code></a>)</td>
    <td>✅ (defaults to <a href="https://github.com/PrismJS/prism/">Prism</a>, <a href="https://mdsvex.pngwn.io/docs#highlight">can be changed</a>)</td>
  </tr>
  <tr>
    <td>Replace any HTML tag after Markdown processing</td>
    <td>❌</td>
    <td><a href="https://mdsvex.pngwn.io/docs#custom-components">✅</a></td>
  </tr>
  <tr>
    <td>Layout</td>
    <td>Optional wrapper <code>&lt;div></code> with classes</td>
    <td>Svelte components, configurable in frontmatter</td>
  </td>
  <tr>
    <td>Fancy typography replacements<br>(e.g. <code>...</code> → <code>…</code>)</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>+page.md (in SvelteKit)</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
</table>

## :beers: Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
