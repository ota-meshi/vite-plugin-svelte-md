import type MarkdownIt from "markdown-it";
import { toArray } from "./utils";

export interface Options {
  /**
   * Enable head support
   *
   * @default true
   */
  headEnabled?: boolean;

  /**
   * Options passed to Markdown It
   */
  markdownItOptions?: MarkdownIt.Options;

  /**
   * Plugins for Markdown It
   */
  markdownItUses?: (
    | MarkdownIt.PluginSimple
    | [MarkdownIt.PluginSimple | MarkdownIt.PluginWithOptions, any]
    | any
  )[];

  /**
   * Class names for wrapper div
   *
   * @default 'markdown-body'
   */
  wrapperClasses?: string | string[];

  include?: (string | RegExp)[] | string | RegExp | undefined;
  exclude?: (string | RegExp)[] | string | RegExp | undefined;
}

export type ResolvedOptions = Required<Omit<Options, "include" | "exclude">> &
  Pick<Options, "include" | "exclude"> & { wrapperClasses: string };

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
