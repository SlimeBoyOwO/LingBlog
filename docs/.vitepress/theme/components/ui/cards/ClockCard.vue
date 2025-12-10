<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 定义问候语对象，包含问候语、内容和颜表情
const greetings = {
  earlyMorning: {
    greeting: '凌晨好',
    content: '夜深了，注意休息哦~',
    emoji: '(:[___]',
  },
  morning: {
    greeting: '早上好',
    content: '早起的鸟儿有虫吃！',
    emoji: '(*^▽^*)',
  },
  noon: {
    greeting: '中午好',
    content: '不要忘记干饭的说！',
    emoji: '(・∀・)',
  },
  afternoon: {
    greeting: '下午好',
    content: '喝杯下午茶继续加油！',
    emoji: '(。＾▽＾)',
  },
  evening: {
    greeting: '晚上好',
    content: '今天辛苦了，放松一下吧~',
    emoji: '(｡･ω･｡)',
  },
  night: {
    greeting: '夜深了',
    content: '早点休息，明天又是新的一天~',
    emoji: '_(:з」∠)_',
  },
}

// 响应式时间
const currentTime = ref(new Date())

// 根据当前时间获取问候语
const currentGreeting = computed(() => {
  const hour = currentTime.value.getHours()

  if (hour >= 0 && hour < 6) {
    return greetings.earlyMorning
  } else if (hour >= 6 && hour < 11) {
    return greetings.morning
  } else if (hour >= 11 && hour < 13) {
    return greetings.noon
  } else if (hour >= 13 && hour < 18) {
    return greetings.afternoon
  } else if (hour >= 18 && hour < 22) {
    return greetings.evening
  } else {
    return greetings.night
  }
})

// 格式化时间（两位数）
const formatTime = (num: number) => num.toString().padStart(2, '0')

// 计算显示的时间
const displayTime = computed(() => {
  const date = currentTime.value
  const hours = formatTime(date.getHours())
  const minutes = formatTime(date.getMinutes())
  const seconds = formatTime(date.getSeconds())
  return `${hours}:${minutes}:${seconds}`
})

// 计算显示的日期
const displayDate = computed(() => {
  const date = currentTime.value
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[date.getDay()]

  return `${year}年${month}月${day}日 ${weekday}`
})

// 定时器更新
let timer: number | null = null

onMounted(() => {
  // 每秒更新一次时间
  timer = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="card-base">
    <div class="header-decoration mb-4"><h4>滴答时钟</h4></div>
    <div class="relative p-2">
      <!-- 时间显示 -->
      <div class="text-center mb-4">
        <div class="text-4xl tracking-wider mb-2 text-brand">
          {{ displayTime }}
        </div>
        <div class="text-sm text-gray-400 font-medium">
          {{ displayDate }}
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="my-4 border-t border-white/10"></div>

      <!-- 时间问候语 -->
      <div class="text-center text-sm font-medium text-brand mb-2">
        {{ currentGreeting.greeting }}！
      </div>
      <div class="text-center">
        <span class="text-sm text-gray-400">{{ currentGreeting.content }}</span>
        <span class="text-sm text-gray-400">{{ currentGreeting.emoji }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
