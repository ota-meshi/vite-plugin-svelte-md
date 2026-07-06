import type { MarkdownExit } from "markdown-exit";

export const TAG_NAME_RE = /(?:svelte:[a-z]+|enhanced:img)/u;
const OPEN_TAG_RE = new RegExp(
  String.raw`<${TAG_NAME_RE.source}(?:\s[^>]*)?/?>`,
  "u",
);
const CLOSE_TAG_RE = new RegExp(String.raw`</${TAG_NAME_RE.source}\s*>`, "u");
const SVELTE_TAGS_RE = new RegExp(
  `^(?:${OPEN_TAG_RE.source}|${CLOSE_TAG_RE.source})`,
  "u",
);
/**
 * Svelte tags (e.g. `<svelte:head>`) plugin
 */
export default function plugin(md: MarkdownExit): void {
  md.inline.ruler.push("svelte-tags", (state) => {
    if (!state.md.options.html) {
      return false;
    }
    const pos: number = state.pos;

    const text: string = state.src.slice(pos);

    const match = SVELTE_TAGS_RE.exec(text);
    if (!match) {
      return false;
    }
    const token = state.push("html_inline", "", 0);
    token.content = state.src.slice(pos, pos + match[0].length);
    state.pos += match[0].length;
    return true;
  });
}
