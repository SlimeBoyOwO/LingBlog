---
title: Rust - Tauri 开发中的疑难杂症解决
description: 解决 Tauri 开发中遇到的各种奇怪的问题以及基础配置
tags:
  - 学习
  - Rust
  - Vue
---

# Rust - Tauri 开发中的疑难杂症解决

## 前言：基础配置

```bash
pnpm create tauri-app
```

## 一、Rust 开发部分的问题

### 1. Tauri 无法访问本地文件

本问题通过 Issue 查找后，得以解决，要在`tauri.config.json`中配置`security`，并设置`allowlist`，允许访问本地文件，这里`enable`一定要设置为`true`，弱智 AI 会在这卡个大半天不知道怎么修。

```json
"app": {
    "windows": [
      {
        "title": "ling-chat",
        "width": 800,
        "height": 600
      }
    ],
    "security": {
      "csp": null,
      "assetProtocol": {
        "enable": true,
        "scope": ["**"]
      }
    }
  },
```

## 二、Vue 开发部分的问题

### 1. Tauri 初始化为 Vue 项目配置必须的依赖

```bash
pnpm add lucide-vue-next
pnpm add -D vite-plugin-vue-devtools
pnpm add -D prettier
pnpm add tailwindcss @tailwindcss/vite
pnpm add axios
# pnpm i --save-dev @types/node
pnpm add vue-router
pnpm add pinia
```

> 分别是：图标库、Vue DevTools、代码格式化、CSS 框架、网络请求库、路由、状态管理

### 2. 关于路径 @ 别名的配置

文件：`vite.config.ts`，包含resolve部分即可，主要是给程序运行使用的。

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

文件`tsconfig.json`，包含这一点即可，主要是给编译器看的。

```json
"compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    "paths": {
      "@/*": ["./src/*"]
    }
  }
```
