<template>
  <!-- 背景层 -->
  <div class="fixed inset-0 z-[-1]">
    <!-- 星空背景 - 固定在窗口 -->
    <StarField
      ref="starfieldRef"
      :enabled="true"
      :star-count="200"
      :scroll-speed="1"
      class="w-screen h-screen"
    />
  </div>
</template>

<script setup lang="ts">
import StarField from './particles/StarField.vue'
</script>

<style scoped></style>
