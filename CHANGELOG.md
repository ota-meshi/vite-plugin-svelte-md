# vite-plugin-svelte-md

## 0.3.0

### Minor Changes

- `vite-plugin-svelte-md` is now distributed as ESM only. ([#122](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/122))

  Support for Node < 20 was dropped, supported versions are the [active Node versions](https://nodejs.org/en/about/previous-releases): 20, 22 and 24.

## 0.2.0

### Minor Changes

- Declare the transform hook as `pre` to enable compatibility with other Svelte Vite plugins. ([#119](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/119))

  This feature required dropping support for Vite 2. Compatibility now starts at Vite 3, but please note that supported versions are 5 to 7.

- fix(deps): update dependency markdown-it to v14 ([#70](https://github.com/ota-meshi/vite-plugin-svelte-md/pull/70))
