<template>
  <!-- 导航栏 -->
  <nav
    :class="[
      'fixed w-full z-50 transition-all duration-500',
      isScrolled
        ? 'bg-void/20 backdrop-blur-md border-glass-border py-4'
        : 'bg-transparent border-transparent py-6',
    ]"
  >
    <div class="container mx-auto px-6 flex justify-between items-center">
      <a href="#" class="font-display text-2xl font-bold tracking-tighter group">
        <span class="text-white transition-colors">Nighty </span>
        <span class="text-cyan-400 transition-colors">Wolf</span>
      </a>

      <!-- 桌面菜单 -->
      <div class="hidden md:flex space-x-8 items-center">
        <a
          v-for="item in menuItems"
          :key="item.id"
          @click.prevent="scrollTo(item.id)"
          class="relative text-s font-medium text-gray-400 hover:text-white transition-colors cursor-pointer group py-2"
        >
          {{ item.name }}
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"
          ></span>
        </a>
        <button
          class="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all hover:scale-105 active:scale-95 text-cyan-300"
          @click="scrollTo('contact')"
        >
          联系我
        </button>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        @click="uiStore.mobileMenuOpen = !uiStore.mobileMenuOpen"
        class="md:hidden text-white p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- 移动端菜单面板 -->
    <div
      v-show="uiStore.mobileMenuOpen"
      class="md:hidden absolute top-full left-0 w-full glass-panel border-t border-glass-border"
    >
      <div class="flex flex-col p-4 space-y-4">
        <a
          v-for="item in menuItems"
          :key="item.id"
          @click="scrollTo(item.id)"
          class="text-gray-300 hover:text-cyan-400 block px-4 py-2"
          >{{ item.name }}</a
        >
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const isScrolled = computed(() => uiStore.isScrolled)

const menuItems = [
  { name: '首页', id: 'home' },
  { name: '介绍', id: 'about' },
  { name: '项目', id: 'projects' },
  { name: '画廊', id: 'gallery' },
  { name: '博客', id: 'blog' },
]

// --- 页面逻辑 ---
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    if (id !== 'home') {
      uiStore.isScrolled = true
    } else {
      uiStore.isScrolled = false
    }
    uiStore.currentSection = id
    uiStore.mobileMenuOpen = false
  }
}
</script>
