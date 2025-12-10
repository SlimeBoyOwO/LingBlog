<template>
  <canvas ref="canvasRef" class="starfield-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'

// 定义Star类型
interface Star {
  x: number
  y: number
  v: number
  color: string
}

// 定义StarFieldConfig类型
interface StarFieldConfig {
  starCount: number
  scrollSpeed: number
  colors: string[]
}

// 定义Props类型
interface Props {
  enabled?: boolean
  starCount?: number
  scrollSpeed?: number
  colors?: string[]
}

// 定义StarFieldRenderer类型
class StarFieldRenderer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  stars: Star[]
  config: {
    starCount: number
    starSize: number
    attractorSize: number
    scrollSpeed: number
    directionChangeRate: number
    colors: string[]
  }
  pointer: { x: number; y: number }
  dir: number
  w: number
  h: number
  fpsLimit: number
  lastFrameTime: number
  frameInterval: number
  animationId: number | null

  constructor(canvas: HTMLCanvasElement, config: StarFieldConfig) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not get canvas context')
    this.ctx = context

    this.stars = []
    this.config = {
      starCount: config.starCount,
      starSize: 3,
      attractorSize: 100,
      scrollSpeed: config.scrollSpeed,
      directionChangeRate: 0.2,
      colors: config.colors,
    }

    this.pointer = { x: 0, y: 0 }
    this.dir = Math.PI
    this.w = 0
    this.h = 0

    this.fpsLimit = 30 // 限制为30fps
    this.lastFrameTime = 0
    this.frameInterval = 1000 / this.fpsLimit
    this.animationId = null

    this.init()
  }

  init(): void {
    this.setupCanvas()
    this.createStars()
    this.addEventListeners()
    this.startAnimation()
  }

  setupCanvas(): void {
    this.w = this.canvas.width = window.innerWidth
    this.h = this.canvas.height = window.innerHeight
    this.pointer.x = this.w / 2
    this.pointer.y = this.h / 2
  }

  createStars(): void {
    for (let i = 0; i < this.config.starCount; i++) {
      const z = this.randomG()
      const color =
        this.config.colors[Math.floor(Math.random() * this.config.colors.length)] ||
        'rgb(173, 216, 230)'

      this.stars.push({
        x: this.randomInt(this.w * 1000),
        y: this.randomInt(this.h * 1000),
        v: z + 0.5,
        color,
      })
    }

    this.stars.sort((a, b) => a.v - b.v)
  }

  update = (timestamp: number): void => {
    // 帧率控制：如果距离上一帧时间太短，跳过此帧
    if (timestamp - this.lastFrameTime < this.frameInterval) {
      this.animationId = requestAnimationFrame(this.update)
      return
    }

    this.lastFrameTime = timestamp
    if (this.w !== window.innerWidth || this.h !== window.innerHeight) {
      this.setupCanvas()
    }

    this.dir = Math.sin((timestamp / 13289) * this.config.directionChangeRate) * Math.PI
    this.ctx.clearRect(0, 0, this.w, this.h)
    this.ctx.globalCompositeOperation = 'lighter'

    const dx = Math.cos(this.dir) * this.config.scrollSpeed
    const dy = Math.sin(this.dir) * this.config.scrollSpeed

    this.stars.forEach((star) => {
      star.x += star.v * dx
      star.y += star.v * dy

      const x =
        this.modulo(star.x, this.w + this.config.starSize + this.config.attractorSize) -
        (this.config.starSize / 2 + this.config.attractorSize / 2)
      const y =
        this.modulo(star.y, this.h + this.config.starSize + this.config.attractorSize) -
        (this.config.starSize / 2 + this.config.attractorSize / 2)

      this.ctx.fillStyle = star.color
      this.ctx.fillRect(x, y, this.config.starSize * star.v, this.config.starSize * star.v)
    })

    this.ctx.globalCompositeOperation = 'source-over'
    this.animationId = requestAnimationFrame(this.update)
  }

  addEventListeners(): void {
    window.addEventListener('resize', this.handleResize)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
  }

  handleResize = (): void => {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.setupCanvas()
    this.startAnimation()
  }

  handleMouseMove = (e: MouseEvent): void => {
    this.pointer.x = e.clientX
    this.pointer.y = e.clientY
  }

  startAnimation(): void {
    this.animationId = requestAnimationFrame(this.update)
  }

  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  destroy(): void {
    this.stopAnimation()
    window.removeEventListener('resize', this.handleResize)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
  }

  // Helper methods
  randomInt(min: number, max?: number): number {
    if (max === undefined) {
      max = min
      min = 0
    }
    return Math.floor(Math.random() * (max - min) + min)
  }

  randomG(): number {
    return Math.random() * Math.random() * Math.random()
  }

  modulo(value: number, mod: number): number {
    return ((value % mod) + mod) % mod
  }
}

// 定义Props默认值
const props = withDefaults(defineProps<Props>(), {
  enabled: true,
  starCount: 200,
  scrollSpeed: 0.2,
  colors: () => [
    'rgb(173, 216, 230)',
    'rgb(176, 224, 230)',
    'rgb(241, 141, 252)',
    'rgb(176, 230, 224)',
    'rgb(173, 230, 216)',
  ],
})

// 定义Emits类型
const emit = defineEmits<{
  (e: 'ready', starField: StarFieldRenderer): void
}>()

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
const starField: Ref<StarFieldRenderer | null> = ref(null)

// 组件逻辑
onMounted(() => {
  if (canvasRef.value && props.enabled) {
    starField.value = new StarFieldRenderer(canvasRef.value, {
      starCount: props.starCount,
      scrollSpeed: props.scrollSpeed,
      colors: props.colors,
    })
    emit('ready', starField.value)
  }
})

onUnmounted(() => {
  if (starField.value) {
    starField.value.destroy()
  }
})

// 监听启用状态变化
watch(
  () => props.enabled,
  (newVal) => {
    if (newVal && canvasRef.value && !starField.value) {
      starField.value = new StarFieldRenderer(canvasRef.value, {
        starCount: props.starCount,
        scrollSpeed: props.scrollSpeed,
        colors: props.colors,
      })
      emit('ready', starField.value)
    } else if (!newVal && starField.value) {
      starField.value.destroy()
      starField.value = null
    }
  },
)

// 监听配置变化
watch(
  () => props.starCount,
  (newVal) => {
    if (starField.value && newVal !== undefined) {
      starField.value.destroy()
      starField.value = new StarFieldRenderer(canvasRef.value!, {
        starCount: newVal,
        scrollSpeed: props.scrollSpeed,
        colors: props.colors,
      })
      emit('ready', starField.value)
    }
  },
)

watch(
  () => props.scrollSpeed,
  (newVal) => {
    if (starField.value && newVal !== undefined) {
      starField.value.config.scrollSpeed = newVal
    }
  },
)

watch(
  () => props.colors,
  (newVal) => {
    if (starField.value && newVal) {
      starField.value.config.colors = newVal
    }
  },
)
</script>

<style scoped>
.starfield-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
