import { defineConfig } from 'vitepress'

import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { computeWordStats } from './theme/utils/text'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [['link', { rel: 'icon', href: '/LingBlog/blog/favicon.ico' }]],
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
      { text: '档案', link: '/LingBlog/blog/intro/personal-intro' },
      { text: '项目', link: '/LingBlog/blog/projects/overview' },
      { text: 'LingChat文档', link: '/LingBlog/blog/projects/ling-chat/' },
      { text: '笔记', link: '/LingBlog/blog/tutorial/github-tutorial' },
      { text: '生活', link: '/LingBlog/blog/drawings/drawing-tutorial' },
      { text: '其他', link: '/LingBlog/blog/others/great-resources' },
    ],

    sidebar: [
      {
        text: '小灵の档案',
        items: [
          { text: '公开资料', link: '/LingBlog/blog/intro/personal-intro' },
          { text: '成分展示', link: '/LingBlog/blog/intro/personal-interests' },
          { text: '东方系列', link: '/LingBlog/blog/intro/touhou-projects' },
        ],
      },
      {
        text: '项目の家',
        items: [{ text: '项目一览', link: '/LingBlog/blog/projects/overview' }],
      },
      {
        text: 'LingChat文档',
        items: [{ text: '文档首页', link: '/LingBlog/blog/projects/ling-chat/' }],
      },
      {
        text: '开发文档',
        items: [
          { text: '开发流程', link: '/LingBlog/blog/projects/ling-chat/develop/dev_process' },
          {
            text: 'Style-Bert-VITS2训练',
            link: '/LingBlog/blog/projects/ling-chat/develop/Style-Bert-VITS2模型训练教程',
          },
          {
            text: '人物创建指南',
            link: '/LingBlog/blog/projects/ling-chat/develop/character_guide',
          },
          {
            text: 'TTS 使用指南',
            link: '/LingBlog/blog/projects/ling-chat/develop/tts_guide',
          },
          {
            text: 'IndexTTS 教程',
            link: '/LingBlog/blog/projects/ling-chat/develop/IndexTTS语音教程',
          },
          {
            text: '创意工坊指南',
            link: '/LingBlog/blog/projects/ling-chat/develop/creative_factory',
          },
        ],
      },
      {
        text: 'LingChat设计',
        items: [
          { text: '后端结构', link: '/LingBlog/blog/projects/ling-chat/backend' },
          { text: '前端结构', link: '/LingBlog/blog/projects/ling-chat/frontend' },
          { text: '数据库设计', link: '/LingBlog/blog/projects/ling-chat/database-designer' },
          { text: '记忆构建器', link: '/LingBlog/blog/projects/ling-chat/memory-builder-design' },
          { text: '剧本设计', link: '/LingBlog/blog/projects/ling-chat/script-designer' },
          { text: '剧本创作指南', link: '/LingBlog/blog/projects/ling-chat/script-guide' },
          { text: '剧本事件总览', link: '/LingBlog/blog/projects/ling-chat/script-events' },
          { text: '日程设计', link: '/LingBlog/blog/projects/ling-chat/todo-designer' },
          { text: '主动对话设计', link: '/LingBlog/blog/projects/ling-chat/proactive-design' },
          { text: '新系统设计', link: '/LingBlog/blog/projects/ling-chat/new-system-designer' },
          { text: '更新记录', link: '/LingBlog/blog/projects/ling-chat/update' },
        ],
      },
      {
        text: '灵の笔记',
        items: [
          { text: 'Vibe Coding教程', link: '/LingBlog/blog/tutorial/vibe-coding-tutorial' },
          { text: '新建Github项目', link: '/LingBlog/blog/tutorial/github-tutorial' },
          { text: 'Python项目管理', link: '/LingBlog/blog/tutorial/python-manage' },
          { text: '创建Vue项目', link: '/LingBlog/blog/tutorial/vue-project-create' },
          { text: 'Tauri项目踩坑', link: '/LingBlog/blog/tutorial/tauri-tutorial' },
          { text: '程序员缩写词', link: '/LingBlog/blog/tutorial/programers-words' },
          { text: 'RESTful API设计', link: '/LingBlog/blog/tutorial/restful-api-design' },
        ],
      },
      {
        text: '绘画小角落',
        items: [{ text: '绘画笔记', link: '/LingBlog/blog/drawings/drawing-tutorial' }],
      },
      {
        text: '书和远方',
        items: [{ text: '同人文', link: '/LingBlog/blog/articles/summer-light' }],
      },
      {
        text: '其他奇喵',
        items: [
          { text: 'LingChat激励', link: '/LingBlog/blog/projects/ling-chat/developers-award' },
          { text: '互联网资源', link: '/LingBlog/blog/others/great-resources' },
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
