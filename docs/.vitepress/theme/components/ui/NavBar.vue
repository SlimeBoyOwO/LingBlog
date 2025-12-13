<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import { useData } from 'vitepress'

const { theme } = useData()
const navs = theme.value.nav

// --- 原有逻辑 ---
const isScrolled = ref(false)
const isHidden = ref(false)

const handleScroll = () => {
  const currentScrollY = window.scrollY
  isScrolled.value = currentScrollY > 50

  // 如果移动端菜单打开，不要隐藏导航栏，否则用户体验不好
  if (isMobileMenuOpen.value) {
    isHidden.value = false
    return
  }

  isHidden.value = currentScrollY > 0.3 * window.innerHeight
}

// --- 新增：移动端逻辑 ---
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // 打开菜单时，如果背景没有滚动颜色，强制加上背景色
  if (isMobileMenuOpen.value && !isScrolled.value) {
    isScrolled.value = true
  }
}

// 简单的搜索占位函数（原代码中未提供，防止报错）
const handleSearchClick = () => {
  console.log('Search clicked')
}

// 监听窗口大小变化，如果切换回桌面宽，关闭移动菜单
const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav
    :class="[
      'fixed w-full z-50 transition-all duration-500',
      // 如果菜单打开，强制显示背景色，否则文字可能看不清
      isScrolled || isMobileMenuOpen ? 'bg-card-bg/95 backdrop-blur-md' : 'bg-card-bg/95',
      isScrolled ? 'py-2' : 'py-3',
      isHidden ? '-translate-y-full' : 'translate-y-0',
    ]"
  >
    <div class="container mx-auto w-[90%] md:w-[83%] flex justify-between items-center relative">
      <!-- Logo -->
      <a href="#" class="font-display text-2xl font-bold tracking-tighter group z-50">
        <span>Nighty </span>
        <span class="text-brand transition-colors">Wolf</span>
      </a>

      <!-- 桌面端导航链接 (添加 hidden md:flex) -->
      <div class="hidden md:flex items-center gap-12">
        <a
          v-for="item in navs"
          :key="item.text"
          :href="item.link"
          class="relative text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer group py-2"
        >
          {{ item.text }}
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"
          ></span>
        </a>
      </div>

      <!-- 桌面端右侧功能区 (添加 hidden md:flex) -->
      <div class="hidden md:flex space-x-8 items-center">
        <!-- 搜索栏 -->
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            class="w-48 py-2 pl-10 pr-4 text-sm text-gray-300 bg-card-bg/50 border border-gray-700 rounded-full focus:outline-none focus:border-brand focus:bg-card-bg/70 transition-all"
            placeholder="搜索文章..."
            @click="handleSearchClick"
          />
        </div>
        <ThemeToggle></ThemeToggle>
      </div>

      <!-- 移动端：汉堡按钮 (仅在 md 以下显示) -->
      <button class="md:hidden z-50 p-2 text-gray-300 focus:outline-none" @click="toggleMobileMenu">
        <div class="w-6 h-5 relative flex flex-col justify-between overflow-hidden">
          <!-- 汉堡图标动画 -->
          <span
            :class="[
              'w-full h-0.5 bg-current transition-all duration-300',
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : '',
            ]"
          ></span>
          <span
            :class="[
              'w-full h-0.5 bg-current transition-all duration-300',
              isMobileMenuOpen ? 'opacity-0 translate-x-full' : '',
            ]"
          ></span>
          <span
            :class="[
              'w-full h-0.5 bg-current transition-all duration-300',
              isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : '',
            ]"
          ></span>
        </div>
      </button>
    </div>

    <!-- 移动端菜单下拉层 -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-10 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 w-full bg-card-bg/95 backdrop-blur-xl border-b border-glass-border shadow-2xl overflow-hidden"
      >
        <div class="flex flex-col px-6 py-6 space-y-4">
          <!-- 移动端链接 -->
          <a
            v-for="item in navs"
            :key="item.text"
            :href="item.link"
            class="text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all"
            @click="isMobileMenuOpen = false"
          >
            {{ item.text }}
          </a>

          <div class="h-px bg-gray-700/50 my-2"></div>

          <!-- 移动端搜索和主题切换 -->
          <div class="flex items-center justify-between px-2">
            <!-- 移动端搜索框 (简化版) -->
            <div class="relative flex-1 mr-4">
              <input
                type="text"
                class="w-full py-2 pl-4 pr-4 text-sm text-gray-300 bg-black/20 border border-gray-700 rounded-lg focus:outline-none focus:border-brand"
                placeholder="搜索..."
                @click="handleSearchClick"
              />
            </div>
            <!-- 移动端主题切换 -->
            <ThemeToggle></ThemeToggle>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>
