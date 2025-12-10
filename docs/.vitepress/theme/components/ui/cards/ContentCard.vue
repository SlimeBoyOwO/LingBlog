<template>
  <div v-if="page.headers && page.headers.length > 0" class="card-base p-6 order-last">
    <h4 class="font-semibold text-gray-200 mb-2 header-decoration">本页目录</h4>

    <nav class="p-4">
      <ul class="space-y-2 text-sm">
        <li v-for="header in page.headers" :key="header.slug">
          <a
            :href="`#${header.slug}`"
            class="block transition-colors duration-200 border-l-2 pl-3 py-1 rounded-sm"
            :class="[
              // 根据层级缩进
              header.level === 3 ? 'ml-4' : '',
              // 高亮状态样式
              activeId === header.slug
                ? 'border-brand text-brand font-medium'
                : 'border-transparent text-gray-400 hover:text-gray-200',
            ]"
            @click="activeId = header.slug"
          >
            {{ header.title }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- 返回顶部按钮 (可选) -->
    <div class="pt-4 border-t border-gray-700">
      <a
        href="#"
        class="text-xs text-gray-400 hover:text-blue-400 flex items-center gap-1"
        @click="activeId = ''"
      >
        ↑ 返回顶部
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'

const { page } = useData()
const activeId = ref('')

// 滚动监听逻辑：高亮当前可视区域的标题
// 这是一个简化的 IntersectionObserver 实现
let observer: IntersectionObserver | null = null

function initObserver() {
  if (observer) observer.disconnect()

  console.log(page.value.headers)

  // 获取所有标题元素对应的 DOM
  const headers = page.value.headers
    .map((h) => document.getElementById(h.slug))
    .filter(Boolean) as HTMLElement[]

  if (headers.length === 0) {
    console.warn('没有找到标题元素')
    return
  }

  const callback = (entries: IntersectionObserverEntry[]) => {
    // 找出所有正在视口中的标题
    const visible = entries.filter((e) => e.isIntersecting)
    if (visible.length > 0) {
      // 如果有多个，取第一个
      activeId.value = visible[0].target.id
    }
  }

  // 这里的 rootMargin 设置很关键，决定了判定线的位置
  // -100px 0px -60% 0px 表示：顶部偏移100px，底部偏移60%高度（即阅读到页面上半部分时触发）
  observer = new IntersectionObserver(callback, {
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0,
  })

  headers.forEach((h) => observer?.observe(h))
}

// 当页面路径改变或 headers 数据改变时，重新初始化监听
watchEffect(() => {
  // 稍微延迟一下，等待 DOM 渲染完成
  if (typeof window !== 'undefined' && page.value.headers) {
    setTimeout(initObserver, 100)
  }
})

onMounted(() => {
  if (typeof window !== 'undefined' && page.value.headers) {
    initObserver()
  }
})

// 组件销毁时断开监听
onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
