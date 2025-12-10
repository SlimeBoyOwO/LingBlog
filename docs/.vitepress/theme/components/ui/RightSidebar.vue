<script setup lang="ts">
import ContentCard from './cards/ContentCard.vue'
import ClockCard from './cards/ClockCard.vue'
</script>

<template>
  <aside class="flex flex-col justify-center items-start gap-6 w-full shrink-0">
    <ClockCard></ClockCard>
    <ContentCard></ContentCard>
  </aside>
</template>
