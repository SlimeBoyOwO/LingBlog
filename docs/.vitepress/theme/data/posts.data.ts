import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { defineLoader, getGitTimestamp } from 'vitepress'
import { computeWordStats, extractTitle } from '../utils/text'

type PostData = {
  url: string
  title: string
  frontmatter: Record<string, any>
  updated: number
  wordCount: number
  readingTime: number
}

const normalizePath = (value: string) => value.split(path.sep).join('/')

const parseDate = (value: unknown) => {
  if (!value) return 0
  if (typeof value === 'number') return value
  const date = value instanceof Date ? value : new Date(String(value))
  const time = date.getTime()
  return Number.isNaN(time) ? 0 : time
}

const resolveUpdated = async (file: string, frontmatter: Record<string, any>) => {
  const frontmatterDate = parseDate(frontmatter.updated ?? frontmatter.date)
  if (frontmatterDate) return frontmatterDate
  const gitTime = await getGitTimestamp(file).catch(() => 0)
  if (gitTime) return gitTime
  return fs.statSync(file).mtimeMs
}

const buildUrl = (file: string, srcDir: string, cleanUrls: boolean) => {
  const rel = normalizePath(path.relative(srcDir, file))
  return (
    '/' +
    rel
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, cleanUrls ? '' : '.html')
  )
}

const collectMarkdownFiles = (dir: string) => {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (
        entry.name === '.vitepress' ||
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === 'cache'
      ) {
        continue
      }
      results.push(...collectMarkdownFiles(fullPath))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

export default defineLoader<PostData[]>({
  watch: ['**/*.md'],
  async load(files) {
    const rootDir = process.cwd()
    const docsDir = path.join(rootDir, 'docs')
    const srcDir = fs.existsSync(path.join(docsDir, '.vitepress')) ? docsDir : rootDir
    const cleanUrls = true

    const inputFiles = files && files.length > 0 ? files : collectMarkdownFiles(srcDir)

    const results = await Promise.all(
      inputFiles.map(async (file) => {
        if (!file.endsWith('.md')) return null
        if (file.includes(`${path.sep}.vitepress${path.sep}`)) return null

        const src = fs.readFileSync(file, 'utf-8')
        const { data: frontmatter } = matter(src)
        const { wordCount, readingTime } = computeWordStats(src)
        const updated = await resolveUpdated(file, frontmatter)
        const title = frontmatter.title || extractTitle(src) || ''
        const url = buildUrl(file, srcDir, cleanUrls)

        return {
          url,
          title,
          frontmatter,
          updated,
          wordCount,
          readingTime,
        }
      })
    )

    return results.filter(Boolean) as PostData[]
  },
})
