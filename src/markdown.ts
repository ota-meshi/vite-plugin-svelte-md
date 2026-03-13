import * as devalue from "devalue";
import { createMarkdownExit } from "markdown-exit";
import * as yaml from "yaml";
import markdownItSvelteTags from "./markdown-it-svelte-tags/index.ts";
import markdownItSvelteCurlyBracesEscape from "./markdown-it-svelte-curly-braces-escape/index.ts";
import { toArray } from "./utils.ts";
import { headObjToTags, preprocessHead } from "./head.ts";
import type { ResolvedOptions } from "./options.ts";

const SCRIPTS_RE = /(<script[^>]*>)([\s\S]*?)<\/script>/gu;
const SVELTE_TAGS_RE = /(<svelte:[a-z][^>]*>)([\s\S]*?)<\/svelte:[a-z]+>/gu;
const GET_SVELTE_TAG_NAME_RE = /^svelte:[a-z]+/u;
const IS_MODULE_CONTEXT_RE = /\bcontext\s*=\s*["']?module["']?/u;
const IS_SVELTE_TAG_NAME_RE = /^svelte:[a-z]+$/u;
const FRONTMATTER_RE =
  /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

/**
 * Adapted from https://github.com/vfile/vfile-matter/blob/20c6193bb118f4c65488e0daaf2e66f5cafc733f/lib/index.js
 * under MIT License: Copyright (c) Titus Wormer <tituswormer@gmail.com>
 */
function grayMatter(input: string) {
  const match = FRONTMATTER_RE.exec(input);
  if (match) {
    return {
      data: yaml.parse(match[1] || "") || {},
      content: input.slice(match[0].length),
    };
  }
  return { data: {}, content: input };
}

class TagContent {
  private startTag = "";

  private readonly contents: string[] = [];

  public readonly tagName: string;

  private readonly defaultAttrs?: string;

  public constructor(tagName: string, defaultAttrs?: string) {
    this.tagName = tagName;
    this.defaultAttrs = defaultAttrs;
  }

  public toTag() {
    if (this.contents.length === 0) {
      return "";
    }
    return `${
      this.startTag ||
      `<${this.tagName}${this.defaultAttrs ? ` ${this.defaultAttrs}` : ""}>`
    }
${this.contents.join("\n")}
</${this.tagName}>`;
  }

  public addTag(startTag: string, content: string) {
    if (!this.startTag) {
      this.startTag = startTag;
    }
    this.contents.push(content);
  }

  public add(content: string) {
    this.contents.push(content);
  }

  public prepend(content: string) {
    this.contents.unshift(content);
  }
}

/** Parse HTML */
function parseHtml(html: string) {
  const moduleContext = new TagContent("script", 'context="module"');
  const instanceScript = new TagContent("script");
  const svelteTags: TagContent[] = [];
  let newHtml = html.replace(SVELTE_TAGS_RE, (_, startTag, inner) => {
    const tagName = GET_SVELTE_TAG_NAME_RE.exec(
      startTag.slice(1),
    )![0].toLowerCase();
    let svelteTag = svelteTags.find((tag) => tag.tagName === tagName);
    if (!svelteTag) {
      svelteTag = new TagContent(tagName);
      svelteTags.push(svelteTag);
    }
    svelteTag.addTag(startTag, inner);
    return "";
  });
  newHtml = newHtml.replace(SCRIPTS_RE, (_, startTag, script: string) => {
    let scriptContent = instanceScript;
    if (IS_MODULE_CONTEXT_RE.test(startTag)) {
      scriptContent = moduleContext;
    }
    scriptContent.addTag(startTag, script);
    return "";
  });

  return { html: newHtml, moduleContext, instanceScript, svelteTags };
}

export type MarkdownProcessor = (id: string, text: string) => Promise<string>;
/**
 * Creates md processor
 */
export function createMarkdownProcessor(
  options: ResolvedOptions,
): MarkdownProcessor {
  const markdownIt = createMarkdownExit({
    html: true,
    linkify: true,
    typographer: true,
    ...options.markdownItOptions,
  });
  markdownIt.linkify.set({ fuzzyLink: false });

  const originalValidateLink = markdownIt.validateLink;
  markdownIt.validateLink = (url) => {
    if (!originalValidateLink(url)) {
      return false;
    }
    return !IS_SVELTE_TAG_NAME_RE.test(url);
  };
  markdownIt.use(markdownItSvelteTags).use(markdownItSvelteCurlyBracesEscape);

  options.use?.(markdownIt);
  options.markdownItUses.forEach((e) => {
    const [plugin, ...opts] = toArray(e);

    markdownIt.use(plugin, ...opts);
  });

  return async (id: string, text: string) => {
    const raw = text.trimEnd();
    const { wrapperClasses, headEnabled } = options;

    const parsedFrontmatter = grayMatter(raw);

    let html = await markdownIt.renderAsync(parsedFrontmatter.content, { id });

    if (wrapperClasses) {
      html = `<div class="${wrapperClasses}">${html}</div>`;
    }

    const parsedHtml = parseHtml(html);

    const { head, frontmatter } = frontmatterPreprocess(
      parsedFrontmatter.data,
      options,
    );
    parsedHtml.moduleContext.prepend(
      `export const frontmatter = ${devalue.uneval(frontmatter)};`,
    );
    if (headEnabled && head) {
      let svelteHead = parsedHtml.svelteTags.find(
        (tag) => tag.tagName === "svelte:head",
      );
      if (!svelteHead) {
        svelteHead = new TagContent("svelte:head");
        parsedHtml.svelteTags.push(svelteHead);
      }
      svelteHead.add(`${headObjToTags(head).join("\n")}`);
    }

    const svelteSfc = `${parsedHtml.moduleContext.toTag()}
${parsedHtml.instanceScript.toTag()}
${parsedHtml.svelteTags.map((tag) => tag.toTag()).join("\n")}
${parsedHtml.html}`;
    return svelteSfc;
  };
}

/** Process frontmatter */
function frontmatterPreprocess(frontmatter: any, options: ResolvedOptions) {
  const head = preprocessHead(frontmatter, options);
  return { head, frontmatter };
}
