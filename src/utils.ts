/** Normalize array */
export function toArray<T>(n: T | T[]): T[] {
    if (!Array.isArray(n)) return [n]
    return n
}

/** Escape */
export function escapeBraces(test: string): string {
    return test.replace(/[{}]/g, (c) => (c === "{" ? "&#123;" : "&#125;"))
}
