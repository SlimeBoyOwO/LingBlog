<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import { useData } from 'vitepress'

const { theme } = useData()
const navs = theme.value.nav

// navs是一个数组，包含text和link

// 实现 isScrolled 的逻辑，检测网页是否有滑动
const isScrolled = ref(false)
// 导航栏是否隐藏
const isHidden = ref(false)

// 滚动检测函数
const handleScroll = () => {
  // 当页面滚动超过50px时，设置isScrolled为true
  isScrolled.value = window.scrollY > 50

  // 当滚动超过70%时，导航栏向上消失
  isHidden.value = window.scrollY > 0.3 * window.innerHeight
}

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  console.log(theme.value.nav)
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 不再需要menuItems，直接使用navs
</script>

<template>
  <nav
    :class="[
      'fixed w-full z-50 transition-all duration-500',
      'bg-card-bg/80 backdrop-blur-md border-glass-border',
      isScrolled ? 'py-2' : 'py-3',
      isHidden ? '-translate-y-full' : 'translate-y-0',
    ]"
  >
    <div class="container mx-auto w-[83%] flex justify-between items-center">
      <a href="#" class="font-display text-2xl font-bold tracking-tighter group">
        <span class="text-white transition-colors">Nighty </span>
        <span class="text-cyan-400 transition-colors">Wolf</span>
      </a>

      <div class="flex items-center gap-12">
        <a
          v-for="item in navs"
          :key="item.text"
          :href="item.link"
          class="relative text-s font-medium text-gray-400 hover:text-white transition-colors cursor-pointer group py-2"
        >
          {{ item.text }}
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"
          ></span>
        </a>
      </div>

      <!-- 桌面菜单 -->
      <div class="hidden md:flex space-x-8 items-center">
        <!-- 搜索栏 -->
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <!-- 放大镜图标 -->
            <svg
              class="w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            class="w-48 py-2 pl-10 pr-4 text-sm text-gray-300 bg-gray-800/50 border border-gray-700 rounded-full focus:outline-none focus:border-brand focus:bg-gray-800/70 transition-all"
            placeholder="搜索文章..."
            @click="handleSearchClick"
          />
        </div>
        <ThemeToggle></ThemeToggle>
      </div>
    </div>
  </nav>
</template>
