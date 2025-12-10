<script setup lang="ts">
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()
const route = useRoute()

// 获取侧边栏配置
const sidebarGroups = computed(() => {
  const sidebar = theme.value.sidebar
  if (Array.isArray(sidebar)) {
    return sidebar
  }
  // TODO: 支持多路径侧边栏，之后可以扩展
  return []
})

// 判断链接是否激活
function isActive(link: string) {
  const normalize = (path: string) => path.replace(/^\/|\/$/g, '').replace(/\.html$/, '')
  return normalize(route.path) === normalize(withBase(link))
}
</script>

<template>
  <div class="card-base">
    <div class="mb-2">
      <h4 class="header-decoration">文章总览</h4>
    </div>
    <nav class="overflow-y-auto max-h-[calc(100vh-120px)] p-4">
      <div v-for="(group, index) in sidebarGroups" :key="index" class="mb-6">
        <!-- 分组标题 -->
        <h3 v-if="group.text" class="mb-3 text-sm font-bold text-gray-200 uppercase tracking-wider">
          {{ group.text }}
        </h3>

        <!-- 分组内的链接 -->
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
