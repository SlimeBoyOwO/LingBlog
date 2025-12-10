// @/composables/useScrollTo.ts
import { useUiStore } from '@/stores/ui'

export function useScrollTo() {
  const uiStore = useUiStore() // 将 store 的获取移到函数外部

  const scrollTo = (id: string) => {
    // 直接使用 store 实例
    uiStore.currentSection = id

    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    return
  }

  return {
    scrollTo,
  }
}
