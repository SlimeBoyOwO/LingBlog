<template>
  <section id="home" class="h-screen w-full flex relative items-center justify-center px-6 snap-start">
    <!-- 背景层 -->
    <div
      class="absolute inset-0 z-[-2] bg-[url('@/assets/backgrounds/homepage_bg.jpg')] bg-cover bg-bottom bg-no-repeat">
    </div>
    <!-- 星空层 -->
    <HomeBackground></HomeBackground>

    <div class="text-center max-w-4xl mx-auto">
      <div
        class="inline-block mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-wider uppercase animate-fade-in-up">
        Welcome to Ling's Scholarly House
      </div>
      <h1
        class="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight animate-fade-in-up"
        style="animation-delay: 0.1s">
        <span class="block text-white">与你一同邀约</span>
        <span class="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 text-glow">
          在辽原与星空之中
        </span>
      </h1>
      <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
        style="animation-delay: 0.2s">
        呀？新的伙伴！<span class="text-white font-semibold">(*^▽^*)</span>。
        我是一只来自星空的雪狼哦~要和我一起坐下来眺望一下星空吗？祝你有美好的一天~
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.3s">
        <button @click="scrollTo('about')"
          class="px-8 py-4 rounded-full bg-cyan-500 text-gray-800 font-bold hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] hover:-translate-y-1">
          了解我 ⩌⩊⩌
        </button>
        <!-- 修改：点击触发友情链接弹窗 -->
        <button @click="showFriendLinks = true"
          class="px-8 py-4 rounded-full glass-panel hover:bg-white/10 transition-all hover:-translate-y-1 text-white border border-white/20">
          友情链接❤
        </button>
      </div>
    </div>

    <!-- 底部箭头 -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
      <div class="animate-bounce opacity-50">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>

    <div v-if="showFriendLinks">
      <!-- 1. 背景模糊遮罩层 -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500"
        @click="showFriendLinks = false"></div>
    </div>

    <!-- 友情链接 -->
    <Transition name="modal">
      <div v-if="showFriendLinks" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 2. 液态毛玻璃窗口 -->
        <div
          class="relative w-full max-w-3xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden transform transition-all">
          <!-- 装饰：背景光晕 -->
          <div
            class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none">
          </div>
          <div
            class="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none">
          </div>

          <!-- 关闭按钮 -->
          <button @click="showFriendLinks = false"
            class="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- 标题区域 -->
          <div class="relative z-10 mb-6 text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
              一同旅行 <span class="text-cyan-400">Links</span>
            </h2>
            <p class="text-gray-400 text-sm md:text-base">
              她们是我在漫长的银河里遇到的可爱的小朋友们捏，快去骚扰 =⩌⩊⩌=
            </p>
          </div>

          <!-- 链接卡片列表 -->
          <div
            class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2 pr-2">
            <a v-for="(friend, index) in friendsList" :key="index" :href="friend.url" target="_blank"
              class="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
              <!-- 左边：圆形头像 -->
              <div class="relative shrink-0">
                <div
                  class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-400 transition-colors">
                  <img :src="friend.avatar" :alt="friend.name" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- 右边：标题和介绍 -->
              <div class="flex flex-col min-w-0">
                <h3 class="text-white font-bold text-base truncate group-hover:text-cyan-300 transition-colors">
                  {{ friend.name }}
                </h3>
                <p class="text-gray-400 text-xs sm:text-sm line-clamp-2 mt-0.5 group-hover:text-gray-300">
                  {{ friend.desc }}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollTo } from '@/composables/useScrollTo'
import HomeBackground from '../HomeBackground.vue'

import xiaoPingGuo from '@/assets/friends/小苹果.jpg'
import laoZhang from '@/assets/friends/臭老张.jpg'
import mengLinXi from '@/assets/friends/MeowLynxSea.webp'
import luoYi from '@/assets/friends/罗伊.jpg'
import uwa from '@/assets/friends/uwa.jpg'

const { scrollTo } = useScrollTo()

// --- 友情链接逻辑 ---

// 控制弹窗显示
const showFriendLinks = ref(false)

// 友链数据接口定义
interface Friend {
  name: string
  desc: string
  avatar: string
  url: string
}

// 模拟数据 (你可以替换为真实的API请求或静态数据)
const friendsList = ref<Friend[]>([
  {
    name: '七毛钱的苹果🍏',
    desc: '这是一只会写Minecraft插件的，特别可爱的小苹果=w=',
    avatar: xiaoPingGuo,
    url: 'https://70centsapple.top/#',
  },
  {
    name: '罗伊(>^ω^<)',
    desc: '欠草小猫，说帮我做LC咕了大半天，草丝！',
    avatar: luoYi,
    url: 'https://www.roysgensokyo.space/',
  },
  {
    name: 'UWA',
    desc: '超天才少女初中生，耶~',
    avatar: uwa,
    url: 'https://uwaspace.work/',
  },
  {
    name: 'WalkCat 走猫',
    desc: '一只特别懒，特别憨，特别八嘎呀路的猫',
    avatar: laoZhang,
    url: '#',
  },
  {
    name: '梦凌汐',
    desc: '超聪明全功能的灰色可爱猫娘，超级项目生产妈妈',
    avatar: mengLinXi,
    url: 'https://www.meowdream.cn/',
  },
])
</script>

<style scoped>
/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

/* 自定义滚动条 (针对卡片列表区域) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 确保文字发光效果复用 */
.text-glow {
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}
</style>
