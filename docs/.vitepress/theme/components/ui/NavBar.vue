<script setup lang="ts">
import { useData } from 'vitepress'
import ThemeToggle from './ThemeToggle.vue'

const { site } = useData()
</script>

<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
  >
    <div class="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo和标题 -->
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-gray-800 dark:text-white">
            Ling <span class="text-brand">Blog</span>
          </a>
        </div>

        <!-- 导航链接 -->
        <div class="hidden md:flex space-x-8">
          <a
            href="/"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            首页
          </a>
          <a
            href="/posts"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            文章
          </a>
          <a
            href="/about"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            关于
          </a>
        </div>

        <!-- 主题切换按钮 -->
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>
