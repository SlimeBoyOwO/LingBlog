<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter } = useData()

const formatDate = (value: unknown) => {
  if (!value) return ''
  const date =
    value instanceof Date ? value : new Date(typeof value === 'number' ? value : String(value))
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const updatedDate = computed(() => {
  const raw = frontmatter.value.updated ?? frontmatter.value.date ?? page.value.lastUpdated
  return formatDate(raw)
})
</script>

<template>
  <div class="flex justify-center lg:justify-between">
    <article
      class="prose prose-lg dark:prose-invert w-full shrink-0 vp-doc bg-card-bg rounded-lg px-9 py-6 shadow-lg"
    >
      <div class="mb-4 text-sm text-gray-400">
        <a href="/" class="hover:text-blue-600 hover:underline">首页</a>
        <span class="mx-2">/</span>
        <span>{{ page.title }}</span>
      </div>
      <div v-if="updatedDate" class="mb-8 text-sm text-gray-400">更新于：{{ updatedDate }}</div>

      <Content />
    </article>
  </div>
</template>
