/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.data' {
  export const data: any
}

declare module 'aplayer' {
  interface APlayerOptions {
    container: HTMLElement | null
    audio: Array<{
      name?: string
      artist?: string
      url: string
      cover?: string
      lrc?: string
      theme?: string
      type?: 'auto' | 'hls' | 'normal'
    }>
    mini?: boolean
    autoplay?: boolean
    theme?: string
    loop?: 'all' | 'one' | 'none'
    order?: 'list' | 'random'
    preload?: 'auto' | 'metadata' | 'none'
    volume?: number
    mutex?: boolean
    lrcType?: number
    listFolded?: boolean
    listMaxHeight?: string
    storageName?: string
  }

  class APlayer {
    constructor(options: APlayerOptions)
    play(): void
    pause(): void
    seek(time: number): void
    toggle(): void
    on(event: string, handler: () => void): void
    destroy(): void
    list: {
      add(audio: APlayerOptions['audio'][number]): void
      remove(index: number): void
      clear(): void
      show(): void
    }
  }

  export default APlayer
}
