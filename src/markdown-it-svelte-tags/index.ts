import type MarkdownIt from "markdown-it";

const SVELTE_TAGS_RE = /^(?:<svelte:[a-z][^>]*>|<\/svelte:[a-z]+>)/u;
/**
 * Svelte tags (e.g. `<svelte:head>`) plugin
 */
export default function plugin(md: MarkdownIt): void {
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
