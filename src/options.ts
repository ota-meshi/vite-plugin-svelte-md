import type { MarkdownExit, MarkdownExitOptions } from "markdown-exit";
import { toArray } from "./utils.ts";

export interface Options {
  /**
   * Enable head support
   *
   * @default true
   */
  headEnabled?: boolean;

  /**
   * Options passed to Markdown Exit
   */
  markdownItOptions?: MarkdownExitOptions;

  /**
   * Plugins for Markdown Exit
   *
   * @example
   *    use: (md) => md.use(plugin1).use(plugin2, options)
   */
  use?: (md: MarkdownExit) => void;

  /**
   * Plugins for Markdown Exit
   *
   * Prefer the `use` option for better type safety
   */
  markdownItUses?: any[];

  /**
   * Class names for wrapper div
   *
   * @default 'markdown-body'
   */
  wrapperClasses?: string | string[];

  /**
   * Path to a Svelte component to import and use as a wrapper for the Markdown content
   *
   * If set, `wrapperClasses` will be ignored
   */
  wrapperComponent?: string;

  include?: (string | RegExp)[] | string | RegExp | undefined;
  exclude?: (string | RegExp)[] | string | RegExp | undefined;
}

type PreservedOptions = "include" | "exclude" | "use" | "wrapperComponent";
export type ResolvedOptions = Required<Omit<Options, PreservedOptions>> &
  Pick<Options, PreservedOptions> & { wrapperClasses: string };

/**
 * Resolve options
 */
export function resolveOptions(userOptions: Options): ResolvedOptions {
  const options: ResolvedOptions = {
    headEnabled: true,
    markdownItOptions: {},
    markdownItUses: [],
    include: undefined,
    exclude: undefined,
    ...userOptions,
    wrapperClasses: toArray(userOptions.wrapperClasses ?? "markdown-body")
      .filter((i) => i)
      .join(" "),
  };

  return options;
}
