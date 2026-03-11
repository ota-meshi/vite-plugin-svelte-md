---
"vite-plugin-svelte-md": patch
---

Use [`devalue`](https://npmx.dev/package/devalue) to stringify the frontmatter instead of `JSON.stringify`, preventing accidental parse errors and enabling a wider ranger of values.
