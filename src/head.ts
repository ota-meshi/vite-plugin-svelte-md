import type { ResolvedOptions } from "./options"

export const headProperties = [
    "title",
    "meta",
    "link",
    "base",
    "style",
    "script",
    "htmlAttrs",
    "bodyAttrs",
]

export type HeadObject = Record<string, any>

/**
 * Preprocess head in frontmatter.
 */
export function preprocessHead(
    frontmatter: any,
    options: ResolvedOptions,
): HeadObject | null {
    if (!options.headEnabled) return frontmatter

    const head = frontmatter

    const meta = Array.isArray(head.meta) ? [...head.meta] : []

    if (head.title) {
        if (!meta.find((i: any) => i.property === "og:title"))
            meta.push({ property: "og:title", content: head.title })
    }

    if (head.description) {
        if (!meta.find((i: any) => i.property === "og:description"))
            meta.push({
                property: "og:description",
                content: head.description,
            })

        if (!meta.find((i: any) => i.name === "description"))
            meta.push({ name: "description", content: head.description })
    }

    if (head.image) {
        if (!meta.find((i: any) => i.property === "og:image"))
            meta.push({ property: "og:image", content: head.image })

        if (!meta.find((i: any) => i.property === "twitter:card"))
            meta.push({
                name: "twitter:card",
                content: "summary_large_image",
            })
    }

    const result: HeadObject = {}

    for (const [key, value] of Object.entries(head)) {
        if (headProperties.includes(key)) result[key] = value
    }
    if (meta.length > 0) {
        result.meta = meta
    }

    return Object.entries(result).length === 0 ? null : result
}

/**
 * Converts the header object to tags.
 */
export function headObjToTags(obj: HeadObject): string[] {
    const tags = []

    for (const key of Object.keys(obj)) {
        if (obj[key] == null) continue

        if (key === "title") {
            tags.push(`<title>${obj[key]}</title>`)
        } else if (key === "base") {
            tags.push(`<base ${attrs({ key: "default", ...obj[key] })}>`)
        } else if (headProperties.includes(key)) {
            const value = obj[key]
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    tags.push(`<${key} ${attrs(item)}>`)
                })
            } else if (value) {
                tags.push(`<${key} ${attrs(value)}>`)
            }
        }
    }

    return tags

    /**
     * Convert to attributes string
     */
    function attrs(o: Record<string, string>) {
        return Object.entries(o)
            .map(([k, v]) => `${k}="${`${v}`.replace(/"/gu, "&quot;")}"`)
            .join(" ")
    }
}
