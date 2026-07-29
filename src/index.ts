import type { Plugin } from "vite";
import { createMarkdownProcessor } from "./markdown.ts";
import { resolveOptions, type Options } from "./options.ts";

export type { Options };
/**
 * Creates vite-plugin-svelte-md
 */
export default function svelteMd(options: Options = {}): Plugin {
  const resolvedOptions = resolveOptions(options);
  const mdToSvelte = createMarkdownProcessor(resolvedOptions);

  return {
    name: "vite-plugin-svelte-md",
    enforce: "pre",
    transform: {
      order: "pre",
      filter: {
        id: {
          include: resolvedOptions.include || /\.md$/,
          exclude: resolvedOptions.exclude,
        },
      },
      handler: (raw, id) => mdToSvelte(id, raw),
    },
  };
}
