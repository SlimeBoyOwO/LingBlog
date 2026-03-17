---
title: Vibe Coding 教程与推荐
description: 本文章讲述如何选择各大模型，如何正确的白嫖使用 AI 编程。
tags:
  - 编程
  - Vibe Coding
---

# 如何正确的使用 Vibe Coding

## 一、总体介绍

现在用 ai 编程一共就几种方式：

- 传统 AI 在 web 面板交互（DeepSeek，AI Studio）
- 集合到 IDE 里面作为插件交互（CodeGeeX）
- 直接下载 AI IDE 交互（Antigravity，Trae）
- 专门的 APP 交互（Codex APP）
- 作为库在终端交互（Claude Code，Codex）

小白适合 Web，APP，熟悉的就可以用插件，AI IDE 这种比较专业的，特殊需求或者老手可以用终端（个人使用下来感觉很差）。

## 二、编程中如何选择当代模型？

### 1. tab补全，bug修复，模块化，代码解释，脚本编写

首选：`CodeGeeX`，作为`VSCode`插件内使用

- 优点：速度快、无费用、无限额、有 Agent 功能、使用`GLM`模型
- 缺点：智障，无法处理复杂任务，但非常适合修复bug和模块化等基础任务

### 2. 前端设计，算法设计，精细代码优化与重构，深度学习建模

首选：`AIStudio Gemini 3/3.1 pro`，作为`Web`端使用

- 优点：面相科研，智商`Top1`，在算法架构和深度学习AI领域明显强于其他模型，前端UI设计审美最高，如果代码出现难以解决的问题，可以从这里获得完美的解答。限额极高基本上可以足够用。
- 缺点：不够方便，在整体软件建模上不算太强，有限额但基本不可能不够用。

### 3. 整体软件功能设计，新功能开发，大型需求，复杂任务

首选：`Claude Code Opus 4.6` 或 `Codex`，作为`VSCode`插件或者`App`内使用
备选：`Antigravity`，作为`AI IDE`使用

先说`Claude Code Opus 4.6`或者`Sonnet`系列

- 优点：编程の大王，软件架构能力和优雅度绝对的顶级，速度也贼你妈快，无需多言
- 缺点：死妈的贵，跑起来把烧钱和烧冥币似的

然后是`Codex 5.2`，在`App`内使用

- 优点：编程の小王，在任务理解，规划，代码编写上都非常优秀，额度也慷慨，虽然肯定不够用
- 缺点：死妈的慢，等一次任务10~20分钟起步，纯挂机产品

### 4. 杂项，需求分析，软件设计（如 CMD 指令，Git 管理等）

首选：`DeepSeek`，作为`Web`端使用

- 优点：不会和`Gemini`一样恭维，沟通效率高，无需担心限额，能力也不错
- 缺点：平均选手，能力都不错但总有人在某领域比他强，适合综合性对话

## 三、如何使用上述提及的工具?

1. `CodeGeeX`，作为`VSCode`插件使用，插件搜索就行了
2. `AIStudio Gemini 3/3.1 pro`，作为`Web`端使用，直接在官网注册，网站：[AISTUDIO](https://aistudio.google.com/)
3. `CodeX`的`App`下载：[CodeX](https://apps.microsoft.com/detail/9plm9xgg6vks?hl=en-US&gl=US)
4. `DeepSeek`，网站：[DeepSeek](https://chat.deepseek.com/)
5. `Claude Code`，安装教程：[B站教程](https://www.bilibili.com/video/BV19vc5zUEeQ)
   > CC-Swtich是必须的，地址：[CC-Switch](https://github.com/farion1231/cc-switch/releases)
6. `Claude Code Opus/Sonnet`接入教程：[B站教程](https://www.bilibili.com/video/BV1PRcqzNE8G)
   > 推荐 OpenRounter 或者 0011 都行。
7. `Antigravity`，下载链接：[Antigravity](https://antigravity.google/)

## 四、综合的各大工具评分（满分5分）

| 工具名称                  | 模型能力 | 工作速度 | 经济便宜 | 使用频率 | 综合评价 |
| ------------------------- | -------- | -------- | -------- | -------- | -------- |
| CodeGeeX（GLM 4.7）       | 2        | 5        | 5        | 5        | 3        |
| AIStudio Gemini 3/3.1 pro | 5        | 4        | 4        | 5        | 5        |
| CodeX                     | 4        | 1        | 4        | 2        | 3        |
| DeepSeek                  | 3        | 4        | 5        | 3        | 4        |
| Claude Code Opus 4.6      | 5        | 5        | 0        | 3        | 4        |
| Antigravity               | 5        | 5        | 2        | 2        | 3        |
| Claude Code Sonnet        | 4        | 5        | 1        | 3        | 3        |

## 五、其他还没尝试的 / 不选用的理由

1. MiniMax: 不免费送余额，还要实名，暂时没尝试，感觉好像不错
2. Cursor：国内配置有点麻烦，感觉 Antigravity 完全足够了
3. Kimi：更适合文学工作
4. Copliot：一坨狗史，连最基本的 tab，修复 bug 都做不好
5. Tare：不如国外，性能太狗屎，pass
6. Qwen：更适合图像识别工作
