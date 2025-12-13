<script setup lang="ts">
import ContentCard from './cards/ContentCard.vue'
import ClockCard from './cards/ClockCard.vue'

import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()
// 是否显示右侧边栏
const showRightSidebar = computed(() => {
  return !page.value.isNotFound && page.value.headers && page.value.headers.length > 0
})
</script>

<template>
  <aside class="flex flex-col gap-6 w-72" v-if="showRightSidebar">
    <ClockCard></ClockCard>
    <ContentCard></ContentCard>
  </aside>
</template>
