<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <footer class="mt-20 border-t border-gray-200 dark:border-gray-800">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p class="text-center text-gray-600 dark:text-gray-400">
        © {{ new Date().getFullYear() }} {{ site.title }}. All rights reserved.
      </p>
    </div>
  </footer>
</template>
