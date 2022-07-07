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

This plugin converts markdown files to Svelte component templates.  
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
import { sveltekit } from "@sveltejs/kit/vite"
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

## :beers: Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
