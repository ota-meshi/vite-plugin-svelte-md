import type { MarkdownExit } from "markdown-exit";

// https://github.com/sveltejs/svelte/blob/3dbd95075c324304d668d72e0c08ed958173fb8f/packages/svelte/src/compiler/phases/1-parse/state/element.js#L39-L42
const SVELTE_COMPONENT_RE =
  /^<(?:\p{Lu}[\p{ID_Continue}$.\u200c\u200d]*|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*(?:\.[\p{ID_Continue}$\u200c\u200d]+)+)/u;

/**
 * Parse Svelte components as html_block and html_inline tokens
 */
export default function plugin(md: MarkdownExit): void {
  md.block.ruler.after(
    "html_block",
    "svelte_tag",
    (state, startLine, endLine) => {
      if (!state.md.options.html) return false;

      const lineText = state.src.slice(
        state.bMarks[startLine] + state.tShift[startLine],
        state.eMarks[startLine],
      );

      if (!SVELTE_COMPONENT_RE.test(lineText)) return false;

      // We found `<Something` starting a line, let's find a `>` that ends a line
      let nextLine = startLine;

      while (nextLine < endLine) {
        const nextLineText = state.src.slice(
          state.bMarks[nextLine] + state.tShift[nextLine],
          state.eMarks[nextLine],
        );
        nextLine++; // Make `nextLine` always point to the next line
        if (nextLineText.trimEnd().endsWith(">")) break;
      }

      // Update the line pointer
      state.line = nextLine;

      const token = state.push("html_block", "", 0);
      token.map = [startLine, nextLine];
      token.content = state.getLines(
        startLine,
        nextLine,
        state.blkIndent,
        true,
      );

      return true;
    },
  );

  // Same logic as above, find `<Something` then `>` in inline text
  md.inline.ruler.after("html_inline", "svelte_tag_inline", (state) => {
    if (!state.md.options.html) return false;

    const line = state.src.slice(state.pos, state.posMax);
    const match = SVELTE_COMPONENT_RE.exec(line);

    if (!match) return false;

    const end = line.indexOf(">", match[0].length);

    if (end === -1) return false;

    state.pos += end + 1;

    const token = state.push("html_inline", "", 0);
    token.content = line.slice(match.index, end + 1);

    return true;
  });
}
