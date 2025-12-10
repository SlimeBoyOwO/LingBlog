import { defineConfig } from 'vitepress'

import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Ling Blog',
  description: '小灵の小文仓库',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '档案', link: 'intro/personal-intro' },
      { text: '项目', link: 'projects/overview' },
    ],

    sidebar: [
      {
        text: '小灵の档案',
        items: [
          { text: '公开资料', link: '/intro/personal-intro' },
          { text: '成分展示', link: '/intro/personal-interests' },
        ],
      },
      {
        text: '项目の家',
        items: [{ text: '项目一览', link: '/projects/overview' }],
      },
      {
        text: '灵の笔记',
        items: [
          { text: '新建Github项目', link: '/tutorial/github-tutorial' },
          { text: '创建Vue项目', link: '/tutorial/vue-project-create' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  markdown: {
    headers: {
      level: [2, 3, 4],
    },
  },
  vite: {
    plugins: [vueJsx(), vueDevTools(), tailwindcss()],
  },
})
