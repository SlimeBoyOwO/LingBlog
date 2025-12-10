<template>
  <section
    id="contact"
    class="h-screen w-full flex relative items-center justify-center px-6 snap-start"
  >
    <!-- 背景层 -->
    <div
      class="absolute inset-0 z-[-2] bg-[url('@/assets/backgrounds/contact.jpg')] bg-cover bg-bottom bg-no-repeat"
    ></div>
    <div class="text-center max-w-4xl mx-auto">
      <div
        class="inline-block px-4 py-1.5 text-cyan-300 text-glow text-3xl font-semibold tracking-wider animate-fade-in-up"
      >
        Join me
      </div>

      <div class="my-4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

      <h1
        class="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight animate-fade-in-up"
        style="animation-delay: 0.1s"
      >
        <span
          class="block font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-50 via-cyan-100 to-pink-50 text-glow"
          >和我一同书写宇宙的奇迹</span
        >
      </h1>

      <span class="font-display tracking-tight text-base text-glow">
        享受每个深夜的咖啡，猫，蝉鸣与代码
      </span>

      <div class="my-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

      <div
        class="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up"
        style="animation-delay: 0.3s"
      >
        <div
          class="p-8 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-cyan-100/20 border border-transparent hover:border-cyan-400/50 hover:-translate-y-1 transform"
          v-for="contact in contacts"
          :key="contact.title"
        >
          <!-- 图标部分 -->
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 flex items-center justify-center" v-html="contact.icon"></div>
          </div>

          <div class="my-6 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"></div>

          <!-- 内容部分 -->
          <div class="font-bold text-cyan-300 font-display text-xl mb-2 text-center">
            {{ contact.title }}
          </div>

          <p class="font-bold text-white text-center mb-3 text-lg">
            {{ contact.content }}
          </p>

          <!-- 描述部分 -->
          <p class="text-gray-300 text-base text-center">
            {{ contact.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
  <MainFooter />
</template>

<script setup lang="ts">
import MainFooter from './MainFooter.vue'

const contacts = [
  {
    title: 'Bilibili',
    content: 'Noi_钦灵',
    description: '超级大鸽子up猪',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tv-icon lucide-tv w-full h-full"><path d="m17 2-5 5-5-5"/><rect width="20" height="15" x="2" y="7" rx="2"/></svg>
    `,
  },
  {
    title: '爱发电',
    content: 'id:qinling',
    description: '我很可爱，请给我钱钱',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart-icon lucide-message-circle-heart w-full h-full"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z"/></svg>
    `,
  },
  {
    title: 'GitHub',
    content: '@NoiQinling',
    description: '各种奇奇喵喵的代码',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    `,
  },
  {
    title: 'QQ MC联机群',
    content: '665188287',
    description: '一起玩玩游戏吧！',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paw-print-icon lucide-paw-print w-full h-full"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>
    `,
  },
]
</script>
