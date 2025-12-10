<template>
  <!-- 最外层容器：固定高度，禁止溢出，无滚动条 -->
  <main
    ref="contentContainerRef"
    class="relative w-full h-screen overflow-hidden"
    @wheel="handleWheel"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <section class="w-full h-full relative overflow-hidden">
      <main-display />
    </section>

    <section class="w-full h-full relative overflow-hidden">
      <main-about />
    </section>

    <section class="w-full h-full relative overflow-hidden">
      <main-project />
    </section>

    <section class="w-full h-full relative overflow-hidden">
      <main-gallery />
    </section>

    <section class="w-full h-full relative overflow-hidden">
      <main-contact />
    </section>

    <!-- 右侧指示器 -->
    <nav class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
      <button
        v-for="(item, index) in navItems"
        :key="index"
        @click="goToSection(index)"
        class="group relative flex items-center justify-center w-4 h-4"
      >
        <!-- 悬停提示文字 -->
        <span
          class="absolute right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 text-sm text-white font-medium tracking-wide drop-shadow-md whitespace-nowrap"
        >
          {{ navItemsChinese[index] }}
        </span>

        <!-- 外部光圈 (激活时显示) -->
        <span
          class="absolute rounded-full border border-teal-300/30 transition-all duration-500"
          :class="currentSection === index ? 'w-8 h-8 opacity-100' : 'w-0 h-0 opacity-0'"
        ></span>

        <!-- 中心圆点 -->
        <span
          class="block rounded-full transition-all duration-500 shadow-lg"
          :class="[
            currentSection === index
              ? 'w-3 h-3 bg-teal-300'
              : 'w-1.5 h-1.5 bg-teal-300/50 group-hover:bg-teal-300 group-hover:w-2 group-hover:h-2',
          ]"
        ></span>
      </button>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollTo } from '@/composables/useScrollTo'

import MainAbout from './main/MainAbout.vue'
import MainDisplay from './main/MainDisplay.vue'
import MainProject from './main/MainProject.vue'
import MainGallery from './main/MainGallery.vue'
import MainContact from './main/MainContact.vue'

import { useUiStore } from '@/stores/ui'

const { scrollTo } = useScrollTo()

const navItems = ['home', 'about', 'projects', 'gallery', 'contact']
const navItemsChinese = ['首页', '关于', '项目', '画廊', '联系']
const totalSections = navItems.length

const currentSection = computed(() => {
  return navItems.indexOf(uiStore.currentSection)
})

const isAnimating = ref(false)
const uiStore = useUiStore()

const goToSection = (index: number) => {
  if (isAnimating.value || index < 0 || index >= totalSections) return
  if (index === currentSection.value) return
  // 设置动画锁
  isAnimating.value = true
  uiStore.currentSection = navItems[index] || 'home'
  if (index > 0) uiStore.isScrolled = true
  else uiStore.isScrolled = false

  const section = navItems[index]
  scrollTo(section ? section : 'home')

  setTimeout(() => {
    isAnimating.value = false
  }, 1100)
}

// 滚轮事件处理
const handleWheel = (e: WheelEvent) => {
  // 阻止默认滚动行为（虽然 overflow: hidden 已经阻止了，但为了保险）
  e.preventDefault()
  // 注意：在 Vue @wheel 中，如果不加 .prevent 修饰符，可能无法完全阻止浏览器默认行为，

  if (isAnimating.value) return

  // deltaY > 0 代表向下滚动， < 0 代表向上滚动
  if (e.deltaY > 0) {
    goToSection(currentSection.value + 1)
  } else if (e.deltaY < 0) {
    goToSection(currentSection.value - 1)
  }
}

// --- 移动端触摸支持 (简单的上下滑动手势) ---
let touchStartY = 0

const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0]?.clientY || 0
}

const handleTouchEnd = (e: TouchEvent) => {
  if (isAnimating.value) return

  const touchEndY = e.changedTouches[0]?.clientY || 0
  const diff = touchStartY - touchEndY

  // 滑动距离超过 50px 才触发，防止误触
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // 向上滑动 -> 下一页
      goToSection(currentSection.value + 1)
    } else {
      // 向下滑动 -> 上一页
      goToSection(currentSection.value - 1)
    }
  }
}
</script>

<style scoped>
:global(.starfield-container) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: -10 !important;
}
</style>
