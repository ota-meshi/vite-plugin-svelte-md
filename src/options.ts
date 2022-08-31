import type MarkdownIt from "markdown-it";
import type { FilterPattern } from "@rollup/pluginutils";
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

  include?: FilterPattern;
  exclude?: FilterPattern;
}

export interface ResolvedOptions extends Required<Options> {
  wrapperClasses: string;
}

/**
 * Resolve options
 */
export function resolveOptions(userOptions: Options): ResolvedOptions {
  const options: ResolvedOptions = {
    headEnabled: true,
    markdownItOptions: {},
    markdownItUses: [],
    include: null,
    exclude: null,
    ...userOptions,
    wrapperClasses: toArray(userOptions.wrapperClasses ?? "markdown-body")
      .filter((i) => i)
      .join(" "),
  };

  return options;
}
