<script setup lang="ts">
import { contributors } from '../../../../projects/ling-chat/contributors'
import type { Contributor } from '../../../../projects/ling-chat/contributors'

const list: Contributor[] = contributors
</script>

<template>
  <div class="contributors-panel card-base mt-8">
    <h2 class="text-2xl font-bold mb-6">感谢名单</h2>
    <p class="text-sm text-gray-500 mb-6">
      LingChat 的发展离不开以下成员与社区伙伴的支持，在此致以衷心感谢。
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in list"
        :key="c.name"
        class="rounded-lg border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] p-4 transition-all duration-200 hover:shadow-md hover:border-[var(--vp-c-brand-2)]"
      >
        <div class="flex items-center justify-between mb-2">
          <a
            v-if="c.link"
            :href="c.link"
            target="_blank"
            class="text-lg font-bold text-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-2)] transition-colors no-underline"
          >
            {{ c.name }}
          </a>
          <span v-else class="text-lg font-bold text-[var(--vp-c-text-1)]">
            {{ c.name }}
          </span>
          <span
            class="text-xs px-2 py-1 rounded-full border border-[var(--vp-c-brand-soft)] bg-[var(--vp-c-brand-soft)] text-[var(--vp-c-brand-1)] whitespace-nowrap ml-2"
          >
            {{ c.role }}
          </span>
        </div>
        <p class="text-sm text-[var(--vp-c-text-2)] leading-relaxed">
          {{ c.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.contributors-panel a {
  text-decoration: none !important;
}
</style>
