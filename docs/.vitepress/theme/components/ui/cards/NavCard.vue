<script setup lang="ts">
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'

const { theme, site } = useData()
const route = useRoute()

const normalizePath = (path: string) => {
  const strip = (value: string) => value.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '')
  const base = strip(site.value.base || '/')
  let normalized = strip(path)
  if (base && normalized.startsWith(base)) {
    normalized = strip(normalized.slice(base.length))
  }
  return normalized
}

const getSection = (path: string) => {
  const normalized = normalizePath(path)
  const parts = normalized.split('/').filter(Boolean)
  return parts[0] || ''
}

const sidebarGroups = computed(() => {
  const sidebar = theme.value.sidebar
  if (!Array.isArray(sidebar)) {
    return []
  }

  const currentSection = getSection(route.path)
  if (!currentSection) {
    return sidebar
  }

  const matched = sidebar.filter((group) => {
    const items = Array.isArray(group.items) ? group.items : []
    return items.some((item) => getSection(item.link) === currentSection)
  })

  return matched.length > 0 ? matched : sidebar
})

function isActive(link: string) {
  const normalize = (path: string) => path.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '')
  return normalize(route.path) === normalize(withBase(link))
}
</script>

<template>
  <div class="card-base">
    <div class="mb-2">
      <h4 class="header-decoration">文章目录</h4>
    </div>
    <nav class="overflow-y-auto max-h-[calc(100vh-120px)] p-4">
      <div v-for="(group, index) in sidebarGroups" :key="index" class="mb-6">
        <!-- 鍒嗙粍鏍囬 -->
        <h3 v-if="group.text" class="mb-3 text-sm font-bold uppercase tracking-wider">
          {{ group.text }}
        </h3>

        <!-- 鍒嗙粍鍐呯殑閾炬帴 -->
        <ul class="space-y-2">
          <li v-for="item in group.items" :key="item.link">
            <a
              :href="item.link"
              class="block px-3 py-2 rounded-md text-sm transition-colors duration-200"
              :class="[
                isActive(item.link) ? 'text-brand font-medium' : 'text-gray-400 hover:text-brand',
              ]"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
