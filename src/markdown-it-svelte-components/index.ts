import type { MarkdownExit } from "markdown-exit";

// Adapted from https://github.com/sveltejs/svelte/blob/3dbd95075c324304d668d72e0c08ed958173fb8f/packages/svelte/src/compiler/phases/1-parse/state/element.js#L39-L42
// and https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/block/rules/html_block.ts#L16
const SVELTE_COMPONENT_BLOCK_RE =
  /^<\/?(?:\p{Lu}[\p{ID_Continue}$.\u200c\u200d]*|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*(?:\.[\p{ID_Continue}$\u200c\u200d]+)+)(?=\s|\/?>|$)/u;
const SVELTE_COMPONENT_INLINE_RE =
  /^<\/?(?:\p{Lu}|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*\.[\p{ID_Continue}$\u200c\u200d])[^>]+>/u;

/**
 * Markdown-exit plugin to extend the HTML CommonMark specification to recognize Svelte components as HTML tags, both for block and inline parsing.
 */
export default function plugin(md: MarkdownExit): void {
  /**
   * Adapted from https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/block/rules/html_block.ts#L20-L77
   *
   * Implement the following [CommonMark HTML blocks specification](https://spec.commonmark.org/0.30/#html-blocks) extension:
   *
   * 6. Start condition: line begins the string `<` or `</` followed by one of the strings (case-insensitive) `address`, ..., `ul` **or a valid Svelte component name** followed by a space, a tab, the end of the line, the string `>`, or the string `/>`.
   *    End condition: line is followed by a blank line.
   *
   * The beginning of the rule is already implemented by the original `html_block` rule.
   */
  md.block.ruler.after(
    "html_block",
    "svelte_block",
    (state, startLine, endLine) => {
      // No need to run the rule if HTML is not enabled
      if (!state.md.options.html) return false;

      // Retrieve the current Markdown line
      const lineText = state.src.slice(
        state.bMarks[startLine] + state.tShift[startLine],
        state.eMarks[startLine],
      );

      // Check if the line starts with `<` or `</` followed by a valid Svelte component name
      // followed by a space, the end of the line, the string `>`, or the string `/>`
      if (!SVELTE_COMPONENT_BLOCK_RE.test(lineText)) return false;

      // "End condition: line is followed by a blank line."
      // Let's find the next blank line
      state.line++;

      while (
        // Break at the end of the document
        state.line < endLine &&
        // Break if the line is under-intended, it means that a list item or a blockquote ended and the HTML block should end as well
        state.sCount[state.line] >= state.blkIndent &&
        // Break if the line is blank
        state.src.slice(
          state.bMarks[state.line] + state.tShift[state.line],
          state.eMarks[state.line],
        ) !== ""
      ) {
        state.line++;
      }

      const token = state.push("html_block", "", 0);
      token.map = [startLine, state.line];
      token.content = state.getLines(
        startLine,
        state.line,
        state.blkIndent,
        true,
      );

      return true;
    },
  );

  // Extend https://spec.commonmark.org/0.30/#tag-name for Svelte components
  // Adapted from https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/inline/rules/html_inline.ts#L19-L55
  md.inline.ruler.after("html_inline", "svelte_inline", (state) => {
    if (!state.md.options.html) return false;

    const line = state.src.slice(state.pos, state.posMax);

    // `<` or `</` followed by a valid Svelte component name until the next `>`
    const match = SVELTE_COMPONENT_INLINE_RE.exec(line);

    if (!match) return false;

    state.pos += match[0].length;
    const token = state.push("html_inline", "", 0);
    token.content = line.slice(0, match[0].length);

    return true;
  });
}
