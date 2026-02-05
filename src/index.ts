import { createFilter, type Plugin, version } from "vite";
import { createMarkdownProcessor } from "./markdown.ts";
import { resolveOptions, type Options } from "./options.ts";

const preVite6 = Number(version.split(".")[0]) < 6;

export type { Options };
/**
 * Creates vite-plugin-svelte-md
 */
export default function (options: Options = {}): Plugin {
  const resolvedOptions = resolveOptions(options);
  const mdToSvelte = createMarkdownProcessor(resolvedOptions);

  const filter = createFilter(
    resolvedOptions.include || /\.md$/,
    resolvedOptions.exclude,
  );

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
      handler(raw, id) {
        // "filter" is a Vite 6+ feature, filter here for older versions
        if (preVite6 && !filter(id)) return null;
        try {
          return mdToSvelte(id, raw);
        } catch (e: any) {
          return this.error(e);
        }
      },
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
