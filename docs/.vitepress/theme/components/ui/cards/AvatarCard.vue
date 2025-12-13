<template>
  <div class="card-base flex flex-col items-center justify-center gap-4 p-4">
    <div class="avatar">
      <img src="../../../assets/images/NoiQ.png" class="rounded-4xl" alt="avatar" />
    </div>
    <h4 class="text-2xl font-bold">诺一钦灵</h4>

    <p class="text-gray-500 mb-2">随着时间的流逝慢慢成长吧</p>
    <div class="flex justify-between gap-4">
      <div v-for="social in contacts" :key="social.title">
        <a :href="social.link" target="_blank" class="text-base">
          <div
            class="w-6 h-6 hover:text-brand transition-all ease-in-out duration-200"
            v-html="social.icon"
            :title="social.title"
          ></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const contacts = [
  {
    title: 'GitHub',
    content: '@NoiQinling',
    description: '各种奇奇喵喵的代码',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    `,
    link: 'https://github.com/SlimeBoyOwO',
  },
  {
    title: 'Bilibili',
    content: 'Noi_钦灵',
    description: '超级大鸽子up猪',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tv-icon lucide-tv w-full h-full"><path d="m17 2-5 5-5-5"/><rect width="20" height="15" x="2" y="7" rx="2"/></svg>
    `,
    link: 'https://space.bilibili.com/175560946',
  },
  {
    title: '爱发电',
    content: 'id:qinling',
    description: '我很可爱，请给我钱钱',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-charging-icon lucide-battery-charging w-full h-full"><path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/></svg>
    `,
    link: 'https://afdian.com/a/qinling',
  },
  {
    title: 'QQ MC联机群',
    content: '665188287',
    description: '一起玩玩游戏吧！',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paw-print-icon lucide-paw-print w-full h-full"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>
    `,
    link: 'https://qm.qq.com/q/VDhUZW9b6A',
  },
]
</script>
