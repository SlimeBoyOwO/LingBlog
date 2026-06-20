<template>
  <div ref="playerContainer" class="aplayer-wrapper" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import 'aplayer/dist/APlayer.min.css'

const props = defineProps({
  audio: {
    type: Object,
    required: true,
  },
})

const playerContainer = ref(null)
let player: any = null

onMounted(async () => {
  const { default: APlayer } = await import('aplayer')
  player = new APlayer({
    container: playerContainer.value,
    audio: [props.audio],
    mini: false,
    autoplay: false,
    theme: '#4dd8ff',
    loop: 'all',
    order: 'list',
  })
})

watch(
  () => props.audio,
  (newAudio) => {
    if (player) {
      player.list.clear()
      player.list.add(newAudio)
    }
  },
)
</script>

<style scoped>
.aplayer-wrapper {
  margin: 1.5rem 0;
}

/* ===== APlayer 全局主题覆盖 =====
  每条规则都添加  前缀，精确匹配 APlayer 原有的选择器路径，
  确保特异性始终比 APlayer 默认样式高 1 级。*/

/* --- 容器 & 布局 --- */
/* APlayer: .aplayer { background:#fff; border-radius:2px; ... } */
.aplayer {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 0.75rem;
  box-shadow: var(--vp-shadow-1);
  font-family: var(--vp-font-family-base);
  overflow: hidden;
}

/* --- 封面图：放大至 88px --- */
/* APlayer: .aplayer .aplayer-pic { height:66px; width:66px; } */
.aplayer .aplayer-pic {
  width: 88px;
  height: 88px;
  border-radius: 0.5rem 0 0 0.5rem;
  flex-shrink: 0;
}

.aplayer-wrapper .aplayer .aplayer-pic {
  position: relative;
  float: left;
  height: 100px;
  width: 100px;
  background-size: cover;
  background-position: 50%;
  transition: all .3s ease;
  cursor: pointer;
}

/* --- 信息区左偏移（跟随封面宽度）--- */
/* APlayer: .aplayer .aplayer-info { margin-left:66px; height:66px; } */
.aplayer .aplayer-info {
  margin-left: 88px;
  height: 88px;
  padding: 10px 7px 0 10px;
  border-radius: 0 0.75rem 0.75rem 0;
}

/* --- 标题（4 级特异性，原为 4 级）--- */
/* APlayer: .aplayer .aplayer-info .aplayer-music .aplayer-title { font-size:14px } */
.aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: var(--vp-c-text-1);
  font-size: 14px;
}

/* APlayer: .aplayer .aplayer-info .aplayer-music .aplayer-author { color:#666; font-size:12px } */
.aplayer .aplayer-info .aplayer-music .aplayer-author {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

/* --- 图标默认色 --- */
/* APlayer: .aplayer svg circle, .aplayer svg path { fill:#fff } */
.aplayer svg circle,
.aplayer svg path {
  fill: var(--vp-c-text-2);
}

/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon path { fill:#666 } */
.aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon path {
  fill: var(--vp-c-text-2);
}

/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon:hover path { fill:#000 } */
.aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon:hover path {
  fill: var(--vp-c-brand-1);
}

/* --- 进度条 --- */
/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap { margin:0 0 0 5px; } */
.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap {
  margin: 0 12px;
}

/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar { background:#cdcdcd; height:2px } */
.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
  background: var(--vp-c-divider);
  height: 4px;
  border-radius: 2px;
}

/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded { background:#aaa; height:2px } */

.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
  background: var(--vp-c-text-3);
  height: 4px;
  border-radius: 2px;
}

/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played { height:2px } */

.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
  background: var(--vp-c-brand-1);
  height: 4px;
  border-radius: 2px;
}

/* APlayer: .aplayer ... .aplayer-bar .aplayer-played .aplayer-thumb（7 级） */

.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  width: 12px;
  height: 12px;
  margin-top: -4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

/* --- 时间 --- */
/* APlayer: .aplayer .aplayer-info .aplayer-controller .aplayer-time { color:#999; font-size:11px } */
.aplayer .aplayer-info .aplayer-controller .aplayer-time {
  color: var(--vp-c-text-3);
}

/* --- 音量 --- */
/* APlayer: .aplayer ... .aplayer-volume-bar { background:#aaa } */

.aplayer .aplayer-info .aplayer-controller .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar {
  background: var(--vp-c-divider);
  border-radius: 2.5px;
}

/* APlayer: .aplayer ... .aplayer-volume-bar .aplayer-volume */

.aplayer .aplayer-info .aplayer-controller .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar .aplayer-volume {
  background: var(--vp-c-brand-1);
}

/* --- Playlist 下拉 --- */
/* APlayer: .aplayer .aplayer-list { ... } */
.aplayer .aplayer-list {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 0 0 0.75rem 0.75rem;
  box-shadow: var(--vp-shadow-3);
}

/* APlayer: .aplayer .aplayer-list ol::-webkit-scrollbar-thumb { background-color:#eee } */
.aplayer .aplayer-list ol::-webkit-scrollbar-thumb {
  background: var(--vp-c-text-3);
  border-radius: 3px;
}

/* APlayer: .aplayer .aplayer-list ol li { border-top:1px solid #e9e9e9; font-size:12px } */
.aplayer .aplayer-list ol li {
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
}

/* APlayer: .aplayer .aplayer-list ol li:hover { background:#efefef } */
.aplayer .aplayer-list ol li:hover {
  background: var(--vp-c-default-soft);
}

/* APlayer: .aplayer .aplayer-list ol li.aplayer-list-light { background:#e9e9e9 } */
.aplayer .aplayer-list ol li.aplayer-list-light {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}

/* APlayer: .aplayer .aplayer-list ol li .aplayer-list-index { color:#666 } */
.aplayer .aplayer-list ol li .aplayer-list-index {
  color: var(--vp-c-text-3);
}

/* APlayer: .aplayer .aplayer-list ol li .aplayer-list-author { color:#666 } */
.aplayer .aplayer-list ol li .aplayer-list-author {
  color: var(--vp-c-text-3);
}

/* --- Lrc 歌词 --- */
/* APlayer: .aplayer .aplayer-lrc:before { background:linear-gradient(...#fff...) } */
.aplayer .aplayer-lrc::before,
.aplayer .aplayer-lrc::after {
  background: transparent !important;
}

/* APlayer: .aplayer .aplayer-lrc p { color:#666 } */
.aplayer .aplayer-lrc p {
  color: var(--vp-c-text-2);
}

/* APlayer: .aplayer .aplayer-lrc p.aplayer-lrc-current { ... } */
.aplayer .aplayer-lrc p.aplayer-lrc-current {
  color: var(--vp-c-brand-1);
}

/* --- 迷你模式分隔线 --- */
/* APlayer: .aplayer.aplayer-withlist .aplayer-info { border-bottom:1px solid #e9e9e9 } */
.aplayer.aplayer-withlist .aplayer-info {
  border-bottom: 1px solid var(--vp-c-divider);
}

/* --- 加载图标 --- */
.aplayer .aplayer-info .aplayer-controller .aplayer-loading-icon svg circle {
  stroke: var(--vp-c-brand-1);
}

/* ===== 暗色模式微调 ===== */
.dark .aplayer {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}

.dark .aplayer .aplayer-list {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.dark .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
