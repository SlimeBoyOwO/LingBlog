export type WordStats = {
  wordCount: number
  readingTime: number
}

const stripFrontmatter = (raw: string) => raw.replace(/^---[\s\S]*?---\s*/m, '')

export const computeWordStats = (raw: string): WordStats => {
  if (!raw) {
    return { wordCount: 0, readingTime: 0 }
  }

  let text = stripFrontmatter(raw)
  text = text.replace(/```[\s\S]*?```/g, ' ')
  text = text.replace(/`[^`]*`/g, ' ')
  text = text.replace(/<[^>]*>/g, ' ')
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
  text = text.replace(/\[[^\]]*]\([^)]*\)/g, '$1')
  text = text.replace(/\[\[toc]]/gi, ' ')
  text = text.replace(/[#>*_~\-+=]+/g, ' ')
  text = text.replace(/\r?\n/g, ' ')

  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const wordCount = text
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  const total = cjkCount + wordCount
  const readingTime = total > 0 ? Math.ceil(total / 300) : 0

  return { wordCount: total, readingTime }
}

export const extractTitle = (raw: string) => {
  const text = stripFrontmatter(raw)
  const match = text.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : ''
}
