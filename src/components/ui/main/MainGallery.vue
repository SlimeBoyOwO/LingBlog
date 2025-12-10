<template>
  <section
    id="gallery"
    class="h-screen w-full flex relative items-center justify-center px-6 snap-start"
  >
    <!-- 背景层 -->
    <div
      class="absolute inset-0 z-[-2] bg-[url('@/assets/backgrounds/gallery_4.jpg')] bg-cover bg-bottom bg-no-repeat"
    ></div>
    <div class="container mx-auto h-[80vh] flex">
      <!-- 左侧信息面板 -->
      <div class="w-[40%] pr-12 flex flex-col justify-center">
        <div class="mb-8">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100/10 border border-cyan-200/30 mb-4"
          >
            <div class="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></div>
            <span class="text-cyan-200 text-sm font-medium">绘画初学者</span>
          </div>

          <h1 class="font-display text-5xl font-bold text-gray-50 mb-4 leading-tight">
            小画师的
            <span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-teal-200">
              奇喵世界
            </span>
          </h1>

          <p class="text-pink-50 text-lg leading-relaxed">
            虽然是一个经常熬夜写代码的码农，但也有想用画笔创作心中所想的小梦想。虽然一直以来只是一个笨蛋萌新，但画画什么的开心就好了嘛！
          </p>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-3 gap-6 mb-10">
          <div class="text-center">
            <div class="text-3xl font-bold text-teal-300 mb-1">{{ galleryImages.length }}</div>
            <div class="text-gray-50 text-sm">展示作品数</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-teal-300 mb-1">2022</div>
            <div class="text-gray-50 text-sm">处女作时间</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-teal-300 mb-1">兽耳娘</div>
            <div class="text-gray-50 text-sm">喜欢的题材</div>
          </div>
        </div>

        <!-- 创作理念 -->
        <div class="glass-card rounded-2xl p-6 border border-white/40 shadow-lg">
          <h3 class="font-display text-xl font-semibold text-teal-300 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-brush-icon lucide-brush mr-2"
            >
              <path d="m11 10 3 3" />
              <path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" />
              <path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" />
            </svg>
            创作偏好
          </h3>
          <p class="text-gray-50 text-base leading-relaxed">
            喜欢画Q版画风和可爱的兽耳萝莉，平时会无偿尝试画一些朋友的oc，最喜欢画自己的oc。喜欢平涂，清新，类BA的风格。
          </p>
        </div>

        <!-- 年份筛选（装饰性） -->
      </div>

      <!-- 右侧作品展示 -->
      <div class="relative w-[60%] flex items-center justify-center">
        <!-- 瀑布流容器：限制高度并允许内部滚动 -->
        <div class="overflow-y-auto no-scrollbar max-h-[78vh] w-full border-b-4 border-cyan-300">
          <!-- columns-2 md:columns-3 lg:columns-4 用于创建瀑布流 -->
          <div class="columns-2 md:columns-2 lg:columns-3 gap-4 space-y-4 mx-auto">
            <div
              v-for="(img, i) in galleryImages"
              :key="i"
              class="break-inside-avoid relative group rounded-xl overflow-hidden glass-panel hover:z-10 transition-transform duration-300"
            >
              <!-- 模拟不同尺寸图片 -->
              <img
                :src="img.src"
                class="w-full h-auto object-cover transform transition duration-400 group-hover:scale-105"
                loading="lazy"
                alt="Gallery Image"
              />

              <div
                class="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-cyan-200 border border-cyan-500/30"
              >
                {{ img.year }}
              </div>

              <!-- 悬停遮罩 -->
              <div
                class="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
              >
                <div class="text-white">
                  <div class="text-cyan-300 font-display font-bold text-lg mb-1">
                    {{ img.title }}
                  </div>
                  <div class="text-gray-300 text-xs">{{ img.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import pic1 from '@/assets/gallery/钦灵.png'
import pic2 from '@/assets/gallery/风雪最终.png'
import pic3 from '@/assets/gallery/成果.png'
import pic4 from '@/assets/gallery/超级大猪.png'
import pic5 from '@/assets/gallery/梦凌汐雾.png'
import pic6 from '@/assets/gallery/钦灵4.0-线稿融合前-最终版本.png'
import pic7 from '@/assets/gallery/鹋立绘.png'
import pic8 from '@/assets/gallery/NOI3.0.png'
import pic9 from '@/assets/gallery/桦.jpg'
import pic10 from '@/assets/gallery/Slime Studio.png'

const galleryImages = [
  { src: pic1, title: '钦灵立绘', desc: '第一次有了完整的样子', year: '2025' },
  { src: pic2, title: '潜兵风雪', desc: '重拾Q版风格', year: '2025' },
  { src: pic3, title: '风雪立绘', desc: '第一次设计人家的oc', year: '2025' },
  { src: pic4, title: '超级大猪', desc: '五周年快乐捏', year: '2024' },
  { src: pic6, title: '我的头像', desc: '尝试新的完整风格', year: '2025' },
  { src: pic5, title: '爱心梦凌汐', desc: '给朋友一个可爱的画', year: '2024' },
  { src: pic7, title: '鹋立绘', desc: '第一次尝试画Q版完整立绘', year: '2023' },
  { src: pic8, title: 'Q版头像', desc: '第一次尝试Q版的头像', year: '2024' },
  { src: pic9, title: '一切的开始', desc: '真正第一次完成的作品', year: '2022' },
  { src: pic10, title: 'Slime Studio', desc: '绘画的启辰', year: '2023' },
]
</script>
