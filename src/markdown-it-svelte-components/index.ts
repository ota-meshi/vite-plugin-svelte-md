import type { MarkdownExit } from "markdown-exit";

// Adapted from
// https://github.com/sveltejs/svelte/blob/3dbd95075c324304d668d72e0c08ed958173fb8f/packages/svelte/src/compiler/phases/1-parse/state/element.js#L39-L42
// and
// https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/block/rules/html_block.ts#L16
const SVELTE_COMPONENT_BLOCK_RE =
  /^<\/?(?:\p{Lu}[\p{ID_Continue}$.\u200c\u200d]*|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*(?:\.[\p{ID_Continue}$\u200c\u200d]+)+)(?=\s|\/?>|$)/u;
const SVELTE_COMPONENT_INLINE_RE =
  /^<\/?(?:\p{Lu}|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*\.[\p{ID_Continue}$\u200c\u200d])[^>]+>/u;

/**
 * Parse Svelte components as html_block and html_inline tokens
 */
export default function plugin(md: MarkdownExit): void {
  // Find lines starting with `<Something` and apply the same logic as for https://spec.commonmark.org/0.30/#html-blocks, #6
  // Adapted from https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/block/rules/html_block.ts#L20-L77
  md.block.ruler.after(
    "html_block",
    "svelte_tag",
    (state, startLine, endLine) => {
      if (!state.md.options.html) return false;

      const lineText = state.src.slice(
        state.bMarks[startLine] + state.tShift[startLine],
        state.eMarks[startLine],
      );

      if (!SVELTE_COMPONENT_BLOCK_RE.test(lineText)) return false;

      // We found `<Something` starting a line, let's find a `>` that ends a line
      let nextLine = startLine + 1;

      while (nextLine < endLine && state.sCount[nextLine] >= state.blkIndent) {
        const nextLineText = state.src.slice(
          state.bMarks[nextLine] + state.tShift[nextLine],
          state.eMarks[nextLine],
        );
        if (nextLineText === "") break;
        nextLine++; // Make `nextLine` always point to the next line
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

  // Implement https://spec.commonmark.org/0.30/#tag-name for Svelte components
  // Adapted from https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/inline/rules/html_inline.ts#L19-L55
  md.inline.ruler.after("html_inline", "svelte_tag_inline", (state) => {
    if (!state.md.options.html) return false;

    const line = state.src.slice(state.pos, state.posMax);
    const match = SVELTE_COMPONENT_INLINE_RE.exec(line);

    if (!match) return false;

    state.pos += match[0].length;
    const token = state.push("html_inline", "", 0);
    token.content = line.slice(0, match[0].length);

    return true;
  });
}
