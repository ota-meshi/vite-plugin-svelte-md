import type MarkdownIt from "markdown-it";
import { escapeBraces } from "../utils.ts";

/**
 * Escape curly braces in code block plugin
 */
export default function plugin(md: MarkdownIt): void {
  const originalCodeBlock = md.renderer.rules.code_block!;
  md.renderer.rules.code_block = (...args) => {
    return escapeBraces(originalCodeBlock(...args));
  };
  const originalCodeInline = md.renderer.rules.code_inline!;
  md.renderer.rules.code_inline = (...args) => {
    return escapeBraces(originalCodeInline(...args));
  };
  const originalFence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    return escapeBraces(originalFence(...args));
  };
}
