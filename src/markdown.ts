import MarkdownIt from "markdown-it";
import grayMatter from "gray-matter";
import svelteTags from "./markdown-it-svelte-tags";
import svelteCurlyBracesEscape from "./markdown-it-svelte-curly-braces-escape";
import { toArray } from "./utils";
import { headObjToTags, preprocessHead } from "./head";
import type { ResolvedOptions } from "./options";

const SCRIPTS_RE = /(<script[^>]*>)([\s\S]*?)<\/script>/gu;
const SVELTE_TAGS_RE = /(<svelte:[a-z][^>]*>)([\s\S]*?)<\/svelte:[a-z]+>/gu;
const GET_SVELTE_TAG_NAME_RE = /^svelte:[a-z]+/u;
const IS_MODULE_CONTEXT_RE = /\bcontext\s*=\s*["']?module["']?/u;

const IS_SVELTE_TAG_NAME_RE = /^svelte:[a-z]+$/u;

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
  let newHtml = html.replace(SCRIPTS_RE, (_, startTag, script: string) => {
    let scriptContent = instanceScript;
    if (IS_MODULE_CONTEXT_RE.test(startTag)) {
      scriptContent = moduleContext;
    }
    scriptContent.addTag(startTag, script);
    return "";
  });
  newHtml = newHtml.replace(SVELTE_TAGS_RE, (_, startTag, inner) => {
    const tagName = GET_SVELTE_TAG_NAME_RE.exec(
      startTag.slice(1)
    )![0].toLowerCase();
    let svelteTag = svelteTags.find((tag) => tag.tagName === tagName);
    if (!svelteTag) {
      svelteTag = new TagContent(tagName);
      svelteTags.push(svelteTag);
    }
    svelteTag.addTag(startTag, inner);
    return "";
  });
  return { html: newHtml, moduleContext, instanceScript, svelteTags };
}

export type MarkdownProcessor = (id: string, text: string) => string;
/**
 * Creates md processor
 */
export function createMarkdownProcessor(
  options: ResolvedOptions
): MarkdownProcessor {
  const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    ...options.markdownItOptions,
  });
  markdownIt.linkify.set({ fuzzyLink: false });
  // eslint-disable-next-line @typescript-eslint/unbound-method -- ignore
  const originalValidateLink = markdownIt.validateLink;
  markdownIt.validateLink = (url) => {
    if (!originalValidateLink(url)) {
      return false;
    }
    return !IS_SVELTE_TAG_NAME_RE.test(url);
  };
  markdownIt.use(svelteTags).use(svelteCurlyBracesEscape);

  options.markdownItUses.forEach((e) => {
    const [plugin, ...options] = toArray(e);

    markdownIt.use(plugin, ...options);
  });

  return (id: string, text: string) => {
    const raw = text.trimEnd();
    const { wrapperClasses, headEnabled } = options;

    const parsedFrontmatter = grayMatter(raw);

    const plainMarkdown = parsedFrontmatter?.content ?? raw;
    let html = markdownIt.render(plainMarkdown, { id });

    if (wrapperClasses) {
      html = `<div class="${wrapperClasses}">${html}</div>`;
    }

    const parsedHtml = parseHtml(html);

    const { head, frontmatter } = frontmatterPreprocess(
      parsedFrontmatter?.data ?? {},
      options
    );
    parsedHtml.moduleContext.prepend(
      `export const frontmatter = ${JSON.stringify(frontmatter)}`
    );
    if (headEnabled && head) {
      let svelteHead = parsedHtml.svelteTags.find(
        (tag) => tag.tagName === "svelte:head"
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
