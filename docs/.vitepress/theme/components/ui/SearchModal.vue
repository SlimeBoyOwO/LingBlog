<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../data/posts.data'
import {
  buildSearchablePosts,
  searchPosts,
  highlightText,
  type SearchablePost,
  type SearchResult,
} from '../../utils/search'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { site } = useData()

// State
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const resultsContainerRef = ref<HTMLElement | null>(null)
const resultRefs = ref<Map<number, HTMLElement>>(new Map())
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Build searchable index once
const searchablePosts: SearchablePost[] = buildSearchablePosts(
  posts as any[],
)

// Debounced search
const debouncedQuery = ref('')
watch(query, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val
  }, 200)
})

// Results computed from debounced query
const results = computed<SearchResult[]>(() => {
  return searchPosts(searchablePosts, debouncedQuery.value)
})

// Prepend site base to URL
const withSiteBase = (link: string) => {
  if (!link.startsWith('/')) return link
  const base = site.value.base || '/'
  if (base === '/' || link.startsWith(base)) return link
  return `${base.replace(/\/$/, '')}${link}`
}

// Open/close helpers
const open = () => {
  emit('update:modelValue', true)
}

const close = () => {
  emit('update:modelValue', false)
}

// When modal opens: reset state and focus input
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      query.value = ''
      selectedIndex.value = 0
      debouncedQuery.value = ''
      await nextTick()
      inputRef.value?.focus()
    }
  },
)

// Keyboard handling within modal
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (results.value.length > 0) {
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
      scrollToSelected()
    }
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    scrollToSelected()
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    if (results.value.length > 0 && selectedIndex.value >= 0) {
      const item = results.value[selectedIndex.value]
      navigateTo(item.url)
    }
    return
  }
}

const navigateTo = (url: string) => {
  close()
  window.location.href = withSiteBase(url)
}

const setResultRef = (el: any, index: number) => {
  if (el) {
    resultRefs.value.set(index, el as HTMLElement)
  }
}

const scrollToSelected = () => {
  nextTick(() => {
    const el = resultRefs.value.get(selectedIndex.value)
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

// Global Ctrl+K listener
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (props.modelValue) {
      close()
    } else {
      open()
    }
  }
}

// Body scroll lock
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.body.style.overflow = ''
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
        @click.self="close"
      >
        <!-- Modal container -->
        <div
          class="w-[92vw] max-w-xl max-h-[65vh] bg-card-bg/95 backdrop-blur-xl border border-glass-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <!-- Header: search input -->
          <div
            class="flex items-center gap-3 px-5 py-4 border-b border-glass-border shrink-0"
          >
            <!-- Magnifying glass icon -->
            <svg
              class="w-5 h-5 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>

            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="flex-1 bg-transparent text-base text-gray-100 placeholder-gray-500 outline-none"
              placeholder="搜索文章..."
              @keydown="handleKeydown"
            />

            <!-- Ctrl+K badge -->
            <kbd
              class="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-md font-mono"
            >
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M5 2C3.9 2 3 2.9 3 4v4h2V4h14v16H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5zm6.5 4.5c-.3 0-.5.2-.5.5v2H9v-2c0-.3-.2-.5-.5-.5S8 6.7 8 7v2H6.5c-.3 0-.5.2-.5.5s.2.5.5.5H8v2H6.5c-.3 0-.5.2-.5.5s.2.5.5.5H8v2c0 .3.2.5.5.5s.5-.2.5-.5v-2h2v2c0 .3.2.5.5.5s.5-.2.5-.5v-2h1.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H13V9h1.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H13V7c0-.3-.2-.5-.5-.5zM11 9h2v2h-2V9z"
                />
              </svg>
              K
            </kbd>
          </div>

          <!-- Body: results -->
          <div
            ref="resultsContainerRef"
            class="flex-1 overflow-y-auto px-5 py-3"
          >
            <!-- Empty query hint -->
            <div
              v-if="!query.trim()"
              class="flex flex-col items-center justify-center py-16 text-gray-500"
            >
              <svg
                class="w-12 h-12 mb-4 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <span class="text-sm">输入关键词搜索文章...</span>
            </div>

            <!-- No results -->
            <div
              v-else-if="results.length === 0"
              class="flex flex-col items-center justify-center py-16 text-gray-500"
            >
              <svg
                class="w-12 h-12 mb-4 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" stroke-width="1.5" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 21l-4.35-4.35M8 11h6"
                />
              </svg>
              <span class="text-sm">没有找到匹配的文章</span>
            </div>

            <!-- Results list -->
            <div v-else class="space-y-2">
              <a
                v-for="(item, index) in results"
                :key="item.url"
                :ref="(el) => setResultRef(el, index)"
                :href="withSiteBase(item.url)"
                :class="[
                  'block card-base p-4 rounded-xl transition-all duration-150 cursor-pointer',
                  index === selectedIndex
                    ? 'ring-2 ring-brand'
                    : 'hover:bg-card-bg/70',
                ]"
                @click.prevent="navigateTo(item.url)"
                @mouseenter="selectedIndex = index"
              >
                <!-- Title with highlight -->
                <div
                  class="font-semibold text-gray-100 truncate"
                  v-html="highlightText(item.title, item.matchTerms)"
                />

                <!-- Description with highlight -->
                <p
                  v-if="item.description"
                  class="mt-2 text-sm text-gray-400 line-clamp-2"
                  v-html="highlightText(item.description, item.matchTerms)"
                />

                <!-- Tags + date -->
                <div class="mt-3 flex items-center gap-3 flex-wrap">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 text-xs text-gray-300 px-2 py-0.5 rounded-full border border-white/10 bg-white/5"
                  >
                    #{{ tag }}
                  </span>
                  <span class="text-xs text-gray-500">{{ item.updatedLabel }}</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Footer: keyboard hints -->
          <div
            class="flex items-center gap-4 px-5 py-2 border-t border-glass-border text-xs text-gray-500 shrink-0"
          >
            <span class="inline-flex items-center gap-1">
              <kbd
                class="inline-flex items-center px-1.5 py-0.5 text-xs bg-white/5 border border-white/10 rounded"
                >↑↓</kbd
              >
              导航
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd
                class="inline-flex items-center px-1.5 py-0.5 text-xs bg-white/5 border border-white/10 rounded"
                >Enter</kbd
              >
              打开
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd
                class="inline-flex items-center px-1.5 py-0.5 text-xs bg-white/5 border border-white/10 rounded"
                >Esc</kbd
              >
              关闭
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-highlight {
  background-color: color-mix(in oklch, var(--color-brand) 30%, transparent);
  color: var(--color-brand);
  border-radius: 0.25rem;
  padding: 0 0.125rem;
}
</style>
