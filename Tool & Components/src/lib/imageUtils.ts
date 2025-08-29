/**
 * Remove duplicate image URLs while preserving order.
 */
export function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const url of urls) {
    if (!seen.has(url)) {
      seen.add(url)
      result.push(url)
    }
  }
  return result
}


