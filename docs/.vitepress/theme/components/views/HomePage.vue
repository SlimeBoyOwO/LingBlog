<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useData } from 'vitepress'
import AvatarCard from '../ui/cards/AvatarCard.vue'
import ClockCard from '../ui/cards/ClockCard.vue'
import { data as posts } from '../../data/posts.data'

const { site, theme } = useData()

type PostEntry = {
  url: string
  title: string
  updated: number
  wordCount: number
  readingTime: number
  frontmatter?: Record<string, unknown>
}

const pageSize = 10
const currentPage = ref(1)
const mainTags = ['编程', '绘画', '生活', '资源', '前端', '后端', 'Python', 'Vue', '设计文档']

const withSiteBase = (link: string) => {
  if (!link.startsWith('/')) return link
  const base = site.value.base || '/'
  if (base === '/' || link.startsWith(base)) return link
  return `${base.replace(/\/$/, '')}${link}`
}

const formatDate = (value: number) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const descriptionText = (value: unknown) => (value ? String(value) : '')

const categoryStats = computed(() => {
  const sidebar = theme.value.sidebar
  if (!Array.isArray(sidebar)) return []
  return sidebar.map((group) => ({
    name: group.text || '未命名',
    count: Array.isArray(group.items) ? group.items.length : 0,
    href: Array.isArray(group.items) && group.items.length > 0 ? group.items[0].link : '',
  }))
})

const allArticles = computed(() => {
  const postList = Array.isArray(posts) ? (posts as PostEntry[]) : []
  const result = [] as {
    href: string
    title: string
    updated: number
    updatedLabel: string
    wordCount: number
    readingTime: number
    tags: string[]
    description: string
  }[]

  for (const post of postList) {
    const updatedLabel = formatDate(post.updated)
    const rawTags = post.frontmatter?.tags ?? post.frontmatter?.tag
    const description = descriptionText(
      post.frontmatter?.description ?? post.frontmatter?.desc ?? post.frontmatter?.summary ?? '',
    )
    const tags = Array.isArray(rawTags)
      ? rawTags.map((tag) => String(tag))
      : rawTags
        ? [String(rawTags)]
        : []

    result.push({
      href: withSiteBase(post.url),
      title: post.title || '未命名',
      updated: post.updated,
      updatedLabel,
      wordCount: post.wordCount || 0,
      readingTime: post.readingTime || 0,
      tags,
      description,
    })
  }

  return result.sort((a, b) => b.updated - a.updated)
})

const totalPages = computed(() => Math.max(1, Math.ceil(allArticles.value.length / pageSize)))

watchEffect(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allArticles.value.slice(start, start + pageSize)
})
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <div class="w-full lg:w-72 shrink-0 flex flex-col gap-6">
      <AvatarCard />
      <div class="card-base p-4">
        <div class="mb-3">
          <h4 class="header-decoration">分类统计</h4>
        </div>
        <ul class="space-y-4 text-sm text-gray-300 mt-6">
          <li v-for="category in categoryStats" :key="category.name">
            <a
              v-if="category.href"
              :href="withSiteBase(category.href)"
              class="flex items-center justify-between gap-3 text-gray-300 hover:text-brand transition-colors"
            >
              <span class="inline-flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-brand"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 7h5l2 2h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                  <path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h9a2 2 0 0 1 2 2v2" />
                </svg>
                {{ category.name }}
              </span>
              <span class="text-xs text-gray-400">{{ category.count }} 篇</span>
            </a>
            <div v-else class="flex items-center justify-between gap-3 text-gray-300">
              <span class="inline-flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-brand"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 7h5l2 2h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                  <path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h9a2 2 0 0 1 2 2v2" />
                </svg>
                {{ category.name }}
              </span>
              <span class="text-xs text-gray-400">{{ category.count }} 篇</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="card-base">
        <div class="mb-4">
          <h2 class="header-decoration">文章一览（按照时间更新排序）</h2>
        </div>
        <div class="space-y-4">
          <a
            v-for="article in pagedArticles"
            :key="article.href"
            :href="article.href"
            class="group block card-base p-4 transition-colors duration-200 hover:bg-card-bg/70"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-brand shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
                  </svg>
                  <div class="text-lg font-semibold text-gray-100 truncate">
                    {{ article.title }}
                  </div>
                </div>
                <p v-if="article.description" class="mt-3 text-sm text-gray-400 line-clamp-2">
                  {{ article.description }}
                </p>
                <div
                  class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400"
                  v-if="article.updatedLabel || article.wordCount || article.readingTime"
                >
                  <span v-if="article.updatedLabel" class="inline-flex items-center gap-1">
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {{ article.updatedLabel }}
                  </span>
                  <span v-if="article.wordCount" class="inline-flex items-center gap-1">
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 6h16" />
                      <path d="M4 12h12" />
                      <path d="M4 18h8" />
                    </svg>
                    {{ article.wordCount }} 字
                  </span>
                  <span v-if="article.readingTime" class="inline-flex items-center gap-1">
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v6l3.5 2" />
                    </svg>
                    {{ article.readingTime }} 分钟
                  </span>
                </div>

                <div v-if="article.tags.length" class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 text-xs text-gray-300 px-2 py-1 rounded-full border border-white/10 bg-white/5"
                  >
                    <svg
                      class="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M20.59 13.41 12 22 2 12l8.59-8.59A2 2 0 0 1 12 2h8v8a2 2 0 0 1-.59 1.41Z"
                      />
                      <circle cx="17" cy="7" r="1.5" />
                    </svg>
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="pt-1 text-gray-500 group-hover:text-brand transition-colors">
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
          <div v-if="allArticles.length === 0" class="text-sm text-gray-400">
            暂无可显示的文章。
          </div>
        </div>
        <div
          v-if="totalPages > 1"
          class="mt-6 flex items-center justify-between text-sm text-gray-400"
        >
          <button
            class="px-3 py-1 rounded-md border border-white/10 hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:hover:text-gray-400"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            上一页
          </button>
          <div>第 {{ currentPage }} / {{ totalPages }} 页</div>
          <button
            class="px-3 py-1 rounded-md border border-white/10 hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:hover:text-gray-400"
            :disabled="currentPage === totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-72 shrink-0">
      <ClockCard></ClockCard>
      <div class="card-base p-4 mt-6 mb-4">
        <div class="mb-3">
          <h4 class="header-decoration">博客标签</h4>
        </div>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="tag in mainTags"
            :key="tag"
            class="inline-flex items-center gap-1 text-xs text-gray-300 px-2 py-1 rounded-full border border-white/10 bg-white/5"
          >
            <svg
              class="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20.59 13.41 12 22 2 12l8.59-8.59A2 2 0 0 1 12 2h8v8a2 2 0 0 1-.59 1.41Z" />
              <circle cx="17" cy="7" r="1.5" />
            </svg>
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
