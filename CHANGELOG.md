# vite-plugin-svelte-md

## 0.4.0

### Minor Changes

- Replace [`markdown-it`](https://github.com/markdown-it/markdown-it) with [`markdown-exit`](https://markdown-exit.pages.dev/guide/introduction.html). ([#130](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/130))

  You can now use async plugins as well as async syntax highlighers with `vite-plugin-svelte-md`, with complete compatibility with the `markdown-it` ecostystem! See [`markdown-exit` documentation](https://markdown-exit.pages.dev/guide/migrate-from-markdown-it.html#plugin-compatibility) for more details.

### Patch Changes

- New [`use` configuration option](https://github.com/ota-meshi/vite-plugin-svelte-md/#use) to register `markdown-it` and `markdown-exit` plugins in a type-safe way. ([#130](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/130))

## 0.3.0

### Minor Changes

- `vite-plugin-svelte-md` is now distributed as ESM only. ([#122](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/122))

  Support for Node < 20 was dropped, supported versions are the [active Node versions](https://nodejs.org/en/about/previous-releases): 20, 22 and 24.

## 0.2.0

### Minor Changes

- Declare the transform hook as `pre` to enable compatibility with other Svelte Vite plugins. ([#119](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/119))

  This feature required dropping support for Vite 2. Compatibility now starts at Vite 3, but please note that supported versions are 5 to 7.

- fix(deps): update dependency markdown-it to v14 ([#70](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/70))
