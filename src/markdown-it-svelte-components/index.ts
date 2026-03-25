import type { MarkdownExit } from "markdown-exit";

// Adapted from https://github.com/sveltejs/svelte/blob/3dbd95075c324304d668d72e0c08ed958173fb8f/packages/svelte/src/compiler/phases/1-parse/state/element.js#L39-L42
// and https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/block/rules/html_block.ts#L16
const SVELTE_BLOCK_RE =
  /^<\/?(?:\p{Lu}[\p{ID_Continue}$.\u200c\u200d]*|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*(?:\.[\p{ID_Continue}$\u200c\u200d]+)+)(?=\s|\/?>|$)/u;
const SVELTE_INLINE_RE =
  /^<(?:\p{Lu}[\p{ID_Continue}$.\u200c\u200d]*|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*(?:\.[\p{ID_Continue}$\u200c\u200d]+)+)(?:\s[^>]*|\/?)>|^<\/(?:\p{Lu}[\p{ID_Continue}$.\u200c\u200d]*|\p{ID_Start}[\p{ID_Continue}$\u200c\u200d]*(?:\.[\p{ID_Continue}$\u200c\u200d]+)+)\s*>/u;

/**
 * Markdown-exit plugin to extend the HTML CommonMark specification to recognize Svelte components as HTML tags, both for block and inline parsing.
 */
export default function plugin(md: MarkdownExit): void {
  /**
   * Adapted from https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/block/rules/html_block.ts#L20-L77
   *
   * Implement the following [CommonMark HTML blocks specification](https://spec.commonmark.org/0.31.2/#html-blocks) extension:
   *
   * 6. Start condition: line begins with the string `<` or `</` followed by one of the strings (case-insensitive) `address`, ..., `ul` **or a valid Svelte component name** followed by a space, a tab, the end of the line, the string `>`, or the string `/>`.
   *    End condition: line is followed by a blank line.
   *
   * The beginning of the rule is already implemented by the original `html_block` rule.
   */
  md.block.ruler.after(
    "html_block",
    "svelte_block",
    (state, startLine, endLine, silent) => {
      // No need to run the rule if HTML is not enabled
      if (!state.md.options.html) return false;

      // Retrieve the current Markdown line
      const lineText = state.src.slice(
        state.bMarks[startLine] + state.tShift[startLine],
        state.eMarks[startLine],
      );

      // Check if the line starts with `<` or `</` followed by a valid Svelte component name
      // followed by a space, the end of the line, the string `>`, or the string `/>`
      if (!SVELTE_BLOCK_RE.test(lineText)) return false;

      // Svelte components can close paragraphs, references and blockquotes
      if (silent) return true;

      // "End condition: line is followed by a blank line."
      // Let's find the next blank line
      do {
        state.line++;
      } while (
        // Break at the end of the document
        state.line < endLine &&
        // Break if the line is under-intended, meaning that a list item ended and the HTML block should end as well
        state.sCount[state.line] >= state.blkIndent &&
        // Break if the line is blank
        state.src.slice(
          state.bMarks[state.line] + state.tShift[state.line],
          state.eMarks[state.line],
        ) !== ""
      );

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
    // List of rules that can be interrupted by a Svelte component
    // (the rule will be called with silent=true to see if the current block should be interrupted)
    { alt: ["paragraph", "reference", "blockquote"] },
  );

  /**
   * Adapted from https://github.com/serkodev/markdown-exit/blob/fe1351070a5841426223ab4a0a5c7874ba2b1257/packages/markdown-exit/src/parser/inline/rules/html_inline.ts#L19-L55
   *
   * Implement the following [CommonMark raw HTML specification](https://spec.commonmark.org/0.31.2/#raw-html) extension:
   *
   * - An HTML tag consists of an open tag, a closing tag, an HTML comment, a processing instruction, a declaration, a CDATA section, **an open Svelte component tag, or a closing Svelte component tag**.
   * - An open Svelte component tag consists of a `<` character, followed by a valid Svelte component name,  optionally followed by whitespace and a string not containing `>`, followed by a `>` character or a `/>` string.
   * - A closing Svelte component tag consists of a `</` character, followed by a valid Svelte component name, optionally followed by whitespace, followed by a `>` character.
   */
  md.inline.ruler.after("html_inline", "svelte_inline", (state, silent) => {
    if (!state.md.options.html) return false;

    const line = state.src.slice(state.pos, state.posMax);

    const match = SVELTE_INLINE_RE.exec(line);

    if (!match) return false;

    if (!silent) {
      const token = state.push("html_inline", "", 0);
      token.content = line.slice(0, match[0].length);
    }

    state.pos += match[0].length;
    return true;
  });
}
