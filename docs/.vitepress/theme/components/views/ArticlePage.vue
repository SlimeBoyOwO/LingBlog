<script setup lang="ts">
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <div class="flex justify-center lg:justify-between">
    <article
      class="prose prose-lg dark:prose-invert w-full shrink-0 vp-doc bg-card-bg rounded-lg px-9 py-6 shadow-lg"
    >
      <div class="mb-8 text-sm text-gray-400">
        <a href="/" class="hover:text-blue-600 hover:underline">首页</a>
        <span class="mx-2">/</span>
        <span>{{ page.title }}</span>
      </div>

      <Content />
    </article>
  </div>
</template>
