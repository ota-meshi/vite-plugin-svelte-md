import type { MarkdownExit } from "markdown-exit";
import { escapeBraces } from "../utils.ts";

/**
 * Escape curly braces in code block plugin
 */
export default function plugin(md: MarkdownExit): void {
  const originalCodeBlock = md.renderer.rules.code_block!;
  md.renderer.rules.code_block = async (...args) => {
    return escapeBraces(await originalCodeBlock(...args));
  };
  const originalCodeInline = md.renderer.rules.code_inline!;
  md.renderer.rules.code_inline = async (...args) => {
    return escapeBraces(await originalCodeInline(...args));
  };
  const originalFence = md.renderer.rules.fence!;
  md.renderer.rules.fence = async (...args) => {
    return escapeBraces(await originalFence(...args));
  };
}
