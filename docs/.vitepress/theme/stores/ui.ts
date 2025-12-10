import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    currentSection: 'home',
    mobileMenuOpen: false,
    isScrolled: false,
  }),

  actions: {},
})
