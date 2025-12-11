<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import bgImage from '../../assets/backgrounds/bg1.jpg'
import niang22 from '../../assets/images/22娘.png'
import niang33 from '../../assets/images/33娘.png'

/**
 * 波浪粒子动画脚本
 * 效果：爱心和星星波浪动画，带旋转效果
 */

// 粒子类型
enum ParticleType {
  HEART = 'heart',
  STAR = 'star',
}

// 粒子接口
interface Particle {
  x: number
  y: number
  size: number
  type: ParticleType
  rotation: number
  rotationSpeed: number
  index: number
}

// 配置参数
const config = {
  particleCount: 14, // 粒子总数
  amplitude: 10, // 波浪起伏高度
  speed: 0.01, // 波动速度
  baseSize: 11, // 基础粒子大小
  heartColor: '#FF69B4', // 粉色
  starColor: '#FFD700', // 黄色
  waveCycles: 2, // 波浪周期数量
  marginRatio: 0.15, // 左右边距比例，防止粒子消失
}

// 使用ref存储canvas元素
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let width: number = 0
let height: number = 0
let time: number = 0
let particles: Particle[] = []
let animationId: number | null = null

// 调整画布大小
function resize() {
  if (!canvasRef.value) return

  // 获取canvas容器的实际尺寸
  const containerWidth = canvasRef.value.offsetWidth
  const containerHeight = canvasRef.value.offsetHeight

  // 设置canvas内部尺寸，确保比例正确
  width = canvasRef.value.width = containerWidth
  height = canvasRef.value.height = containerHeight

  // 设置canvas显示尺寸，与容器保持一致
  canvasRef.value.style.width = containerWidth + 'px'
  canvasRef.value.style.height = containerHeight + 'px'
}

// 初始化粒子
function initParticles() {
  particles = []
  for (let i = 0; i < config.particleCount; i++) {
    // 前7个为爱心，后7个为星星
    const type = i < 7 ? ParticleType.HEART : ParticleType.STAR

    // 计算粒子大小，越靠中间的粒子越大
    const distanceFromCenter = Math.abs(i - config.particleCount / 2)
    const sizeFactor = 1 - (distanceFromCenter / (config.particleCount / 2)) * 0.5
    const size = config.baseSize * sizeFactor

    // 随机旋转速度
    const rotationSpeed = 0.005 + Math.random() * 0.01

    particles.push({
      x: 0,
      y: 0,
      size,
      type,
      rotation: 0,
      rotationSpeed,
      index: i,
    })
  }
}

// 绘制爱心
function drawHeart(x: number, y: number, size: number, rotation: number) {
  if (!ctx) return

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = config.heartColor
  ctx.beginPath()

  // 爱心形状
  const width = size
  const height = size
  ctx.moveTo(0, height / 4)
  ctx.bezierCurveTo(-width / 2, -height / 2, -width, height / 3, 0, height)
  ctx.bezierCurveTo(width, height / 3, width / 2, -height / 2, 0, height / 4)

  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// 绘制星星
function drawStar(x: number, y: number, size: number, rotation: number) {
  if (!ctx) return

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = config.starColor
  ctx.beginPath()

  // 星星形状
  const spikes = 5
  const outerRadius = size
  const innerRadius = size / 2

  let rot = (Math.PI / 2) * 3
  const step = Math.PI / spikes

  ctx.moveTo(0, -outerRadius)

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius)
    rot += step
    ctx.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius)
    rot += step
  }

  ctx.lineTo(0, -outerRadius)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// 绘制波浪动画
function draw() {
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 计算有效绘制区域，避免粒子在边缘消失
  const margin = width * config.marginRatio
  const effectiveWidth = width - 2 * margin

  // 更新和绘制每个粒子
  particles.forEach((particle, index) => {
    // 计算粒子在波浪中的位置，考虑边距
    const x = margin + (effectiveWidth / (config.particleCount - 1)) * index

    // 计算波浪偏移量，增加周期数量
    // 使用 config.waveCycles 控制波浪周期数
    const waveOffset =
      Math.sin((index / config.particleCount) * Math.PI * 2 * config.waveCycles + time) *
      config.amplitude

    // 叠加第二个正弦波，让波动看起来更自然
    const complexOffset =
      Math.cos((index / config.particleCount) * Math.PI * config.waveCycles - time * 0.5) *
      (config.amplitude * 0.5)

    // 计算Y坐标
    const y = height / 2 + waveOffset + complexOffset

    // 更新粒子位置和旋转
    particle.x = x
    particle.y = y
    particle.rotation += particle.rotationSpeed

    // 根据粒子类型绘制
    if (particle.type === ParticleType.HEART) {
      drawHeart(particle.x, particle.y, particle.size, particle.rotation)
    } else {
      drawStar(particle.x, particle.y, particle.size, particle.rotation)
    }
  })

  // 更新时间
  time += config.speed

  // 继续动画
  animationId = requestAnimationFrame(draw)
}

// 组件挂载后初始化canvas
onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    initParticles()
    window.addEventListener('resize', resize)
    draw()
  }
})

// 组件卸载前清理资源
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <!-- 背景 -->
  <div class="w-full h-[calc(40vh-4rem)]">
    <div
      :style="{ backgroundImage: `url(${bgImage})` }"
      class="bg-cover bg-center bg-no-repeat w-full h-full"
    ></div>
    <div class="relative -mt-16 w-full h-16 bg-linear-to-b from-transparent to-page-bg"></div>
  </div>

  <div class="w-full h-[11vh] bg-page-bg relative flex items-end justify-center overflow-hidden">
    <img
      :src="niang22"
      class="w-24 h-24"
      style="animation: gentleFloat 3s ease-in-out 0s infinite"
    />
    <canvas ref="canvasRef" class="w-[50%] h-full"></canvas>
    <img
      :src="niang33"
      class="w-24 h-24"
      style="animation: gentleFloat 3s ease-in-out 1.5s infinite"
    />
  </div>
</template>

<style>
@keyframes gentleFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
