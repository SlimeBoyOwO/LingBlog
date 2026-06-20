export interface SearchablePost {
  url: string
  title: string
  description: string
  tags: string[]
  plainText: string
  updated: number
  updatedLabel: string
  wordCount: number
  readingTime: number
}

export interface SearchResult extends SearchablePost {
  score: number
  matchTerms: string[]
}

export interface PostDataRaw {
  url: string
  title: string
  frontmatter: Record<string, any>
  updated: number
  wordCount: number
  readingTime: number
  plainText: string
}

const formatDate = (value: number): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const descriptionText = (value: unknown): string =>
  value ? String(value) : ''

const normalizeTags = (frontmatter: Record<string, any>): string[] => {
  const raw = frontmatter.tags ?? frontmatter.tag
  if (Array.isArray(raw)) return raw.map((t) => String(t))
  if (raw) return [String(raw)]
  return []
}

/** Transform raw PostData into search-ready shaped objects */
export function buildSearchablePosts(posts: PostDataRaw[]): SearchablePost[] {
  return posts.map((post) => ({
    url: post.url,
    title: post.title || '未命名',
    description: descriptionText(
      post.frontmatter?.description ??
        post.frontmatter?.desc ??
        post.frontmatter?.summary ??
        '',
    ),
    tags: normalizeTags(post.frontmatter),
    plainText: post.plainText || '',
    updated: post.updated,
    updatedLabel: formatDate(post.updated),
    wordCount: post.wordCount || 0,
    readingTime: post.readingTime || 0,
  }))
}

// Escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Score a single field against a query.
 * - Full query substring match → weight × 2 per occurrence
 * - Individual term matches (space-separated) → weight per occurrence
 * - CJK individual char matches (bonus when query is multi-char CJK) → weight × 0.5
 */
function scoreField(field: string, query: string, weight: number): number {
  const lowerField = field.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return 0

  let score = 0

  // Full query substring match
  const escaped = escapeRegex(lowerQuery)
  const fullMatches = (lowerField.match(new RegExp(escaped, 'g')) || []).length
  score += fullMatches * weight * 2

  // Individual space-separated term matches
  const terms = lowerQuery.split(/\s+/).filter((t) => t.length > 0)
  for (const term of terms) {
    if (term === lowerQuery) continue // already counted as full match
    const count = (lowerField.match(new RegExp(escapeRegex(term), 'g')) || []).length
    score += count * weight
  }

  // CJK: individual character bonus for multi-char CJK queries
  const cjkChars = lowerQuery.replace(/\s/g, '').split('').filter((c) =>
    /[一-鿿㐀-䶿]/.test(c),
  )
  if (cjkChars.length > 1) {
    for (const char of cjkChars) {
      if (lowerField.includes(char)) {
        score += weight * 0.5
      }
    }
  }

  return score
}

/** Collect unique match terms from the query — used for highlighting */
function collectMatchTerms(text: string, query: string): string[] {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  const terms: string[] = []

  // Full query as a term if present
  if (lowerText.includes(lowerQuery)) {
    terms.push(query.trim())
  }

  // Individual space-separated terms
  const spaceTerms = lowerQuery.split(/\s+/).filter((t) => t.length > 0)
  for (const term of spaceTerms) {
    if (lowerText.includes(term)) {
      terms.push(term)
    }
  }

  // CJK characters
  const cjkChars = lowerQuery.replace(/\s/g, '').split('').filter((c) =>
    /[一-鿿㐀-䶿]/.test(c),
  )
  for (const char of cjkChars) {
    if (lowerText.includes(char)) {
      terms.push(char)
    }
  }

  return [...new Set(terms)]
}

const FIELD_WEIGHTS = {
  title: 4,
  tags: 3,
  description: 2,
  plainText: 1,
}

/** Search posts and return scored/sorted results */
export function searchPosts(
  posts: SearchablePost[],
  query: string,
): SearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const results: SearchResult[] = []

  for (const post of posts) {
    const titleScore = scoreField(post.title, trimmed, FIELD_WEIGHTS.title)
    const tagStr = post.tags.join(' ')
    const tagScore = scoreField(tagStr, trimmed, FIELD_WEIGHTS.tags)
    const descScore = scoreField(post.description, trimmed, FIELD_WEIGHTS.description)
    const bodyScore = scoreField(post.plainText, trimmed, FIELD_WEIGHTS.plainText)
    const totalScore = titleScore + tagScore + descScore + bodyScore

    if (totalScore <= 0) continue

    // Collect match terms from all fields
    const matchTerms = collectMatchTerms(
      [post.title, post.description, tagStr, post.plainText].join(' '),
      trimmed,
    )

    results.push({ ...post, score: totalScore, matchTerms })
  }

  results.sort((a, b) => b.score - a.score)
  return results
}

/** Escape HTML special characters */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/** Wrap matched terms in <mark> tags, with HTML escaping */
export function highlightText(
  text: string,
  matchTerms: string[],
  maxLength?: number,
): string {
  if (!text) return ''
  if (!matchTerms.length) return escapeHtml(truncate(text, maxLength))

  // Sort terms by length descending so longer matches take priority
  const sorted = [...matchTerms].sort((a, b) => b.length - a.length)

  // Build a regex that matches any of the terms (case-insensitive)
  const escaped = sorted.map((t) => escapeRegex(escapeHtml(t)))
  const pattern = escaped.join('|')
  if (!pattern) return escapeHtml(truncate(text, maxLength))

  const regex = new RegExp(`(${pattern})`, 'gi')

  const result = escapeHtml(text).replace(regex, (match) => {
    return `<mark class="search-highlight">${match}</mark>`
  })

  return truncate(result, maxLength)
}

function truncate(text: string, maxLength?: number): string {
  if (!maxLength || text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}
