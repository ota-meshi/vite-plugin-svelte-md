import type { Plugin } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { createMarkdownProcessor } from "./markdown";
import type { Options } from "./options";
import { resolveOptions } from "./options";

export type { Options };
/**
 * Creates vite-plugin-svelte-md
 */
export default function (options: Options = {}): Plugin {
  const resolvedOptions = resolveOptions(options);
  const mdToSvelte = createMarkdownProcessor(resolvedOptions);

  const filter = createFilter(
    resolvedOptions.include || /\.md$/,
    resolvedOptions.exclude
  );

  return {
    name: "vite-plugin-svelte-md",
    enforce: "pre",
    transform(raw, id) {
      if (!filter(id)) return undefined;
      try {
        return mdToSvelte(id, raw);
      } catch (e: any) {
        this.error(e);
      }
      return undefined;
    },
    handleHotUpdate(ctx) {
      if (!filter(ctx.file)) return;

      const defaultRead = ctx.read;
      ctx.read = async function () {
        return mdToSvelte(ctx.file, await defaultRead());
      };
    },
  };
}
