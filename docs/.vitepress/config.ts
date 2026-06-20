import { defineConfig } from 'vitepress'

import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { computeWordStats } from './theme/utils/text'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/LingBlog/blog/',
  cleanUrls: true,
  title: 'Ling Blog',
  description: '钦灵的个人博客喵~',
  lastUpdated: true,
  transformPageData(pageData, ctx) {
    const content = (ctx as { content?: string }).content
    if (!content) return
    const { wordCount, readingTime } = computeWordStats(content)
    return {
      wordCount,
      readingTime,
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/LingBlog/' },
      { text: '档案', link: '/intro/personal-intro' },
      { text: '项目', link: '/projects/overview' },
      { text: '笔记', link: '/tutorial/github-tutorial' },
      { text: '生活', link: '/drawings/drawing-tutorial' },
      { text: '其他', link: '/others/great-resources' },
    ],

    sidebar: [
      {
        text: '小灵の档案',
        items: [
          { text: '公开资料', link: '/intro/personal-intro' },
          { text: '成分展示', link: '/intro/personal-interests' },
          { text: '东方系列', link: '/intro/touhou-projects' },
        ],
      },
      {
        text: '项目の家',
        items: [{ text: '项目一览', link: '/projects/overview' }],
      },
      {
        text: 'LingChat',
        items: [
          { text: '后端结构', link: '/projects/ling-chat/backend' },
          { text: '前端结构', link: '/projects/ling-chat/frontend' },
          { text: '数据库设计', link: '/projects/ling-chat/database-designer' },
          { text: '记忆构建器', link: '/projects/ling-chat/memory-builder-design' },
          { text: '剧本设计', link: '/projects/ling-chat/script-designer' },
          { text: '剧本创作指南', link: '/projects/ling-chat/script-guide' },
          { text: '剧本事件总览', link: '/projects/ling-chat/script-events' },
          { text: '日程设计', link: '/projects/ling-chat/todo-designer' },
          { text: '主动对话设计', link: '/projects/ling-chat/proactive-design' },
        ],
      },
      {
        text: '灵の笔记',
        items: [
          { text: 'Vibe Coding教程', link: '/tutorial/vibe-coding-tutorial' },
          { text: '新建Github项目', link: '/tutorial/github-tutorial' },
          { text: 'Python项目管理', link: '/tutorial/python-manage' },
          { text: '创建Vue项目', link: '/tutorial/vue-project-create' },
          { text: 'Tauri项目踩坑', link: '/tutorial/tauri-tutorial' },
          { text: '程序员缩写词', link: '/tutorial/programers-words' },
          { text: 'RESTful API设计', link: '/tutorial/restful-api-design' },
        ],
      },
      {
        text: '绘画小角落',
        items: [{ text: '绘画笔记', link: '/drawings/drawing-tutorial' }],
      },
      {
        text: '书和远方',
        items: [{ text: '同人文', link: '/articles/summer-light' }],
      },
      {
        text: '其他奇喵',
        items: [
          { text: 'LingChat激励', link: '/projects/ling-chat/developers-award' },
          { text: '互联网资源', link: '/others/great-resources' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/SlimeBoyOwO' }],
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
