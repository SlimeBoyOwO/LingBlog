// https://vitepress.dev/guide/custom-theme
import Layout from './MyLayout.vue'
import type { Theme } from 'vitepress'
import { createPinia } from 'pinia'

import './styles/vars.css'
import './styles/base.css'
import './styles/components/custom-block.css'
import './styles/components/vp-code.css'
import './styles/components/vp-code-group.css'
import './styles/components/vp-doc.css'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.provide('theme', 'custom')
    app.use(createPinia())
  },
} satisfies Theme
