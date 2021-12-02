import type MarkdownIt from "markdown-it"

export default (md: MarkdownIt): void => {
    const fence = md.renderer.rules.fence!
    md.renderer.rules.fence = (...args) => {
        const rawCode = fence(...args)
        const code = rawCode.slice(
            rawCode.indexOf("<code>"),
            rawCode.indexOf("</code>"),
        )

        const lines = code.split("\n")
        const lineNumbersCode = lines
            .slice(0, -1)
            .map(
                (_line, index) =>
                    `<span class="line-number">${index + 1}</span><br>`,
            )
            .join("")

        const [tokens, idx] = args
        const token = tokens[idx]
        return `<div class="language-${token.info.trim()} line-numbers-mode">
${rawCode}
<div class="line-numbers-wrapper">${lineNumbersCode}</div>
</div>`
    }
}
