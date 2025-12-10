<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <div class="text-center py-20">
    <h1 class="text-5xl font-bold text-gray-800 dark:text-white mb-6">
      {{ site.title }}
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
      {{ site.description }}
    </p>
    <div class="flex justify-center space-x-4">
      <a
        href="/intro/personal-intro"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        开始阅读
      </a>
      <a
        href="/about"
        class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        关于我
      </a>
    </div>
  </div>
</template>
