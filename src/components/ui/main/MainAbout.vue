<template>
  <!-- 关于 / 技术栈 -->
  <section
    id="about"
    class="h-screen w-full flex items-center justify-center py-24 relative snap-start"
  >
    <!-- 背景层 -->
    <div
      class="absolute inset-0 z-[-2] bg-[url('@/assets/backgrounds/section_1.jpg')] bg-cover bg-center bg-no-repeat"
    ></div>
    <HomeBackground />

    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-16 items-center">
        <div class="order-1 md:order-2 relative group">
          <!-- 装饰背景 -->
          <div class="p-8 rounded-2xl">
            <h2 class="text-4xl font-bold mb-6 border-l-4 border-cyan-500 pl-4">
              <span class="text-gray-50"> 品种 介绍 </span>
            </h2>
            <p class="text-lg text-gray-50 leading-relaxed mb-22">
              一只热爱创作的小白狼，喜欢做一些自己个性化的东西。时不时用代码和画笔构筑属于自己的小宇宙。同时也是个超级大懒狗，喜欢玩游戏也喜欢看B站视频捏，不摸鱼的人生不是完整的人生啊Kora！
            </p>

            <h2 class="text-4xl font-bold mb-6 border-l-4 border-cyan-500 pl-4">
              <span class="text-gray-50"> 超能力 一览 </span>
            </h2>
            <p class="text-lg text-gray-50 leading-relaxed mb-4">
              主打一个什么都会但会的不多，兴趣爱好也是多的和路边的野狗一样多呢~
            </p>
            <div class="mt-8 flex flex-wrap gap-2">
              <span
                v-for="tech in techStack"
                :key="tech.name"
                class="px-4 py-2 rounded-lg text-xs backdrop-blur-sm"
                :style="{ backgroundColor: 'rgba(31, 41, 55, 0.6)' }"
                :class="tech.color"
              >
                {{ tech.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="order-2 max-w-xl mx-auto md:order-1">
          <div
            class="glass-card p-8 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-white/5"
          >
            <div class="flex items-center justify-between text-2xl">
              <h4>◈</h4>
              <h4 class="mx-auto font-bold">资料卡</h4>
              <h4>◈</h4>
            </div>
            <div
              class="my-4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
            ></div>
            <!-- 主要内容区域 -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
              <!-- 左侧：圆形头像 -->
              <div class="shrink-0">
                <div class="relative w-40 h-40 mb-3">
                  <!-- 圆形头像容器 -->
                  <div class="w-full h-full rounded-full overflow-hidden border-4 border-white/10">
                    <img
                      src="@/assets/pics/NoiQ.png"
                      alt="夜煞白狼 钦灵"
                      class="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <!-- 英文名 -->
                <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full">
                  <div class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span
                    class="text-sm text-gray-300 font-mono tracking-wider from-cyan-400 via-cyan-200 to-cyan-50"
                    >Noi_QingLing</span
                  >
                  <div
                    class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                    style="animation-delay: 0.3s"
                  ></div>
                </div>
              </div>

              <!-- 右侧：基本信息 -->
              <div class="flex-1">
                <!-- 名字部分 -->
                <div class="text-center md:text-left space-y-3 border-l-4 border-cyan-500 pl-4">
                  <!-- 中文名 -->
                  <h2
                    class="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-100 via-cyan-50 to-pink-50 text-glow"
                  >
                    夜煞白狼 · 钦灵
                  </h2>
                </div>

                <!-- 基本信息 -->
                <div class="mt-6">
                  <div class="mb-1.5">
                    <span class="text-gray-300 font-extrabold">昵称： </span><span>钦灵</span>
                  </div>
                  <div class="mb-1.5">
                    <span class="text-gray-300 font-extrabold">网名： </span><span>诺一 钦灵</span>
                  </div>
                  <div class="mb-1.5">
                    <span class="text-gray-300 font-extrabold">种族： </span><span>白狼</span>
                  </div>
                  <div class="mb-1.5">
                    <span class="text-gray-300 font-extrabold">本体生日： </span
                    ><span>2004.11.09</span>
                  </div>
                  <div class="mb-1.5">
                    <span class="text-gray-300 font-extrabold">狩猎领域： </span
                    ><span>游戏，编程，绘画</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分隔线 -->
            <div
              class="my-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
            ></div>

            <!-- 介绍文字 -->
            <div class="text-center space-y-4 mb-4">
              <p class="text-gray-300 text-lg leading-relaxed font-light">
                曾经毁灭世界的幻世魔狼，在摩登生活重新寻找新的生活。
                是个喜欢到处探索新的东西冒险家，也是喜欢到处创作新东西的魔法师。
                抛开过去的一切，在新的世界书写新的篇章。
              </p>
            </div>

            <!-- 分隔线 -->
            <div
              class="my-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
            ></div>

            <!-- 状态指示器 -->
            <div class="flex items-center justify-center gap-4 text-xs text-gray-400">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span>在线</span>
              </div>
              <span>•</span>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span>摸鱼中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import HomeBackground from '../HomeBackground.vue'

const techStack = [
  { name: 'C++', color: 'text-purple-400' },
  { name: 'Java', color: 'text-orange-400' },
  { name: 'Python', color: 'text-blue-400' },
  { name: 'SAI2', color: 'text-pink-200' },
  { name: 'HTML', color: 'text-pink-400' },
  { name: 'JavaScript', color: 'text-yellow-400' },
  { name: 'CSS', color: 'text-amber-400' },
  { name: 'PR', color: 'text-purple-600' },
  { name: 'Tailwind CSS', color: 'text-teal-400' },
  { name: 'Typescript', color: 'text-cyan-400' },
  { name: 'Mc Function', color: 'text-green-400' },
  { name: 'Unity', color: 'text-gray-400' },
  { name: 'Live2D Cubism', color: 'text-orange-300' },
  { name: 'Cooking', color: 'text-zinc-300' },
  { name: 'Eat Snacks', color: 'text-yellow-300' },
  { name: 'Sleep', color: 'text-sky-400' },
]
</script>
