---
title: LingChat 前端代码结构
description: 本文档介绍了 LingChat 前端项目的代码结构，包括主要技术栈、项目结构、组件结构等。
tags:
  - 编程
  - Vue
  - 前端
---

# LingChat 前端代码结构

[[toc]]

## 1. 项目结构总览

### 1.1 语言和主要使用技术栈

- 语言：Vue 3 + TypeScript + Vite + TailwindCSS
- 主要使用技术栈：
  - Vue 3: 组件化开发，状态管理，路由管理
  - TypeScript: 类型检查，代码提示
  - Vite: 快速构建，热更新
  - TailwindCSS: 响应式布局，样式管理
  - Pinia: 状态管理
  - Vue Router: 路由管理
  - Axios: 网络请求
  - VueUse: 常用工具函数（在添加中）

### 1.2 文件结构

```
frontend_vue/src
├── api
├── assets
├── components
│   ├── base
│   ├── effects
│   ├── game
│   ├── settings
│   ├── ui
│   └── views
├── composables
├── controllers
├── core/events
│   ├── processors
│   ├── event-procressor.ts
│   ├── event-queue.ts
│   └── index.ts
├── plugins
├── router
├── stores
│   ├── modules
│   │   ├── game
│   │   ├── ui
│   │   └── user
│   ├── types.ts
│   └── index.ts
├── types
└── utils
```

### 1.3 各模块的职责

- `api`: 提供与后端通信的接口，包括获取 AI 服务、发送消息、获取图片等。
- `assets`: 存放静态资源文件，如图片、音频、CSS样式等。
- `components`: 存放 Vue 组件，用于构建页面。
- `composables`: 存放 Vue 组合式 API，用于封装可复用的逻辑。
- `controllers`: 存放控制器，用于处理用户输入和输出。（已重构，等待删除）
- `core`: 存放核心事件处理逻辑，用于处理websocket传输的消息，实现AI对话逻辑处理以及其他舞台演出记忆存储等逻辑功能处理。
- `plugins`: 存放`影空`实现的 Vue 插件，用于扩展 Vue 的功能。
- `router`: 存放路由配置，用于管理页面跳转。实现多页面逻辑。
- `stores`: 存放 Pinia 状态管理，用于管理全局状态，存储游戏核心信息。（重要）
- `types`: 存放 TypeScript 类型定义，用于类型检查。
- `utils`: 存放工具函数，用于处理一些通用逻辑（如打字机）。

::: tip 核心模块

- `core`: **重要！**它是主要的逻辑处理模块，后端发送的消息都会在这里处理，包括基本的对话，以及各种舞台演出逻辑。
- `stores`: **重要！**它是状态管理模块，用于存储游戏核心信息，如用户信息、对话历史、舞台演出记忆等。
- `components`: **重要！**它是组件模块，你所见到的所有页面元素都是在这里定义的，也包括它内部的控制逻辑和样式信息等。

## 2. 前端初始化流程

> 等待更新...
