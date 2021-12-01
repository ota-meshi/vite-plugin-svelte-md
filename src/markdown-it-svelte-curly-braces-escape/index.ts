import type MarkdownIt from "markdown-it"

/**
 * Escape curly braces in code block plugin
 */
export default function plugin(md: MarkdownIt): void {
    const originalCodeBlock = md.renderer.rules.code_block!
    md.renderer.rules.code_block = (...args) => {
        return escape(originalCodeBlock(...args))
    }
    const originalCodeInline = md.renderer.rules.code_inline!
    md.renderer.rules.code_inline = (...args) => {
        return escape(originalCodeInline(...args))
    }
    const originalFence = md.renderer.rules.fence!
    md.renderer.rules.fence = (...args) => {
        return escape(originalFence(...args))
    }

    /** Escape */
    function escape(test: string) {
        return test.replace(/[{}]/g, (c) => (c === "{" ? "&#123;" : "&#125;"))
    }
}
