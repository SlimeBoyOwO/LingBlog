<template>
  <!-- 项目展示 -->
  <section
    id="projects"
    class="h-screen w-full flex relative items-center justify-center px-6 snap-start"
  >
    <!-- 背景层 -->
    <div
      class="absolute inset-0 z-[-2] bg-[url('@/assets/backgrounds/project.webp')] bg-cover bg-bottom bg-no-repeat"
    ></div>
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-end mb-6">
        <div class="flex justify-between items-end">
          <h2 class="font-display text-4xl font-bold text-gray-50 mr-4">灵の项目</h2>
          <p class="text-gray-400">自己叽里咕噜出来的小玩意们 (｀・ω・´)</p>
        </div>
        <a
          href="#"
          class="hidden md:flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          查看更多
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            ></path>
          </svg>
        </a>
      </div>

      <div class="my-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="group relative rounded-xl transition-all duration-300 hover:-translate-y-2"
        >
          <!-- 卡片光晕 -->
          <div class="relative h-full glass-panel rounded-xl overflow-hidden flex flex-col">
            <!-- 图片占位 -->
            <div
              class="h-60 bg-linear-to-br from-gray-800 to-black relative overflow-hidden group-hover:scale-105 transition-transform duration-700"
            >
              <img
                :src="project.imageUrl"
                :alt="project.title"
                class="w-full max-h-60 object-cover object-center"
              />
            </div>
            <div
              class="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-cyan-300 border border-cyan-500/30"
            >
              {{ project.year }}
            </div>

            <div class="p-6 flex flex-col grow">
              <h3
                class="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors"
              >
                {{ project.title }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 grow">{{ project.desc }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded"
                  >#{{ tag }}</span
                >
              </div>
              <a
                href="#"
                class="inline-flex items-center justify-center w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors text-white"
              >
                查看详情
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import xiaoQinLing from '@/assets/pics/小钦灵.png'
import lingChat from '@/assets/pics/LingChat.png'
import qinKitPVP from '@/assets/pics/qinkitpvps.png'

const projects = [
  {
    title: 'LingChat',
    desc: '本人最火热的项目，基于 LLM 的模拟 Galgame 对话项目，搭配深度学习BERT微调模型，结合前后端技术开发，大受好评中。',
    imageUrl: lingChat,
    year: '2023',
    tags: ['Python', 'LLM', 'Deep Learning', 'Vue'],
  },
  {
    title: 'QinKitPVP 2',
    desc: '我的MC服务器插件项目，内含非常多自主原创的全新玩法。包含PVP，PVE,RTS，创造等玩法。',
    imageUrl: qinKitPVP,
    year: '2024',
    tags: ['Minecraft Bukkit Development', 'Java Plugin'],
  },
  {
    title: '钦灵的奇妙图库',
    desc: '一些自己画画的笨蛋图片，还有一些传入自己图片后用Banana做的AI图，满足自己的绘画欲望。',
    imageUrl: xiaoQinLing,
    year: '2024',
    tags: ['Q 版绘画', '立绘绘画', 'AI 绘画'],
  },
]
</script>
