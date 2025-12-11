<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import NavBar from './components/ui/NavBar.vue'
import SideBar from './components/ui/SideBar.vue'
import WebFooter from './components/ui/WebFooter.vue'
import HomePage from './components/views/HomePage.vue'
import NotFoundPage from './components/views/NotFoundPage.vue'
import ArticlePage from './components/views/ArticlePage.vue'
import RightSidebar from './components/ui/RightSidebar.vue'
import BlogBanner from './components/views/BlogBanner.vue'

const { page, frontmatter } = useData()

// 是否显示左侧边栏
const showSidebar = computed(() => {
  return !page.value.isNotFound && !frontmatter.value.home
})

// 是否显示右侧边栏
const showRightSidebar = computed(() => {
  return !page.value.isNotFound && page.value.headers && page.value.headers.length > 0
})
</script>

<template>
  <div class="min-h-scree page-bg transition-colors duration-300 flex flex-col">
    <!-- 导航栏 -->
    <div
      class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-card-bg backdrop-blur"
    >
      <NavBar />
    </div>

    <!-- 背景 -->
    <BlogBanner />

    <!-- 页面主体容器 -->
    <div class="grow flex w-full max-w-[85%] mx-auto justify-center items-start px-4 py-6 gap-4">
      <!-- 左侧边栏 -->
      <div v-if="showSidebar" class="hidden xl:block w-72 shrink-0 sticky h-fit">
        <SideBar />
      </div>

      <!-- 主内容区 -->
      <main class="flex-1 w-full min-w-[320px] min-h-[500px]">
        <!-- 404 -->
        <NotFoundPage v-if="page.isNotFound" />

        <!-- 首页 -->
        <HomePage v-else-if="frontmatter.home" />

        <!-- 文章页面 -->
        <ArticlePage v-else />
      </main>

      <!-- 右侧边栏 -->
      <aside v-if="showRightSidebar" class="hidden 2xl:block w-72 shrink-0 sticky h-fit">
        <RightSidebar />
      </aside>
    </div>

    <!-- 页脚 -->
    <WebFooter class="border-t bg-card-bg z-10 relative" />
  </div>
</template>
