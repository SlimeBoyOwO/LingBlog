# LingBlog - 一款以二次元、圆润风格为主的个人主页 + 博客

因为感觉博客模版太多，还是想自己开发一个来玩玩，于是就有了这个项目。

## 博客特点

- [x] 二次元风格
- [x] 主页与博客分离（Vue 3 主页 + VitePress 博客）
- [x] 星空样式，青色主题
- [x] 卡片式博客展示
- [x] 个人项目、绘画作品展示
- [x] 响应式布局

## 技术栈

- Vue 3
- Vue Router
- Pinia
- VitePress
- Tailwind CSS
- TypeScript
- Vite
- ESLint
- Prettier

## 项目结构

```
LingBlog/
├── src/                  # Vue 3 个人主页源码
├── docs/                 # VitePress 博客/文档源码
│   ├── .vitepress/       # VitePress 主题与配置
│   ├── articles/         # 文章
│   ├── drawings/         # 绘画作品
│   ├── intro/            # 个人介绍
│   ├── others/           # 其他内容
│   ├── projects/         # 项目文档（如 LingChat）
│   ├── public/           # 博客静态资源
│   └── tutorial/         # 教程笔记
├── public/               # 主页静态资源
├── index.html
├── package.json
└── vite.config.ts
```

## 在线预览

[Github Pages](https://slimeboyowo.github.io/LingBlog/)

## 本地开发

1. 克隆项目

```sh
git clone https://github.com/SlimeBoyOwO/LingBlog.git
```

2. 安装依赖

```sh
npm install
```

3. 运行个人主页

```sh
npm run dev
```

4. 运行博客

```sh
npm run docs:dev
```

## 构建与部署

```sh
# 仅构建主页
npm run build-only

# 仅构建博客
npm run docs:build

# 构建主页 + 博客并合并输出到 dist/
npm run build:all

# 预览构建产物
npm run preview

# 构建并预览全部
npm run preview:all
```

## 感谢

本项目的发展离不开以下成员与社区伙伴的支持，在此致以衷心感谢：

| 名字 | 角色 | 说明 |
|------|------|------|
| 诺一钦灵 | 项目发起 & 核心开发 | LingBlog 与 LingChat 的创始开发者 |
| 风雪 | 创意顾问 | 提供了大量角色设定与剧情创作灵感 |
| 七辰 | UI 设计支持 | 协助绘制了部分界面素材与角色立绘 |
| 开源社区贡献者 | 代码贡献 | 感谢所有提交 Issue 和 PR 的开发者 |
| 测试群友 | 测试反馈 | 感谢参与内测、提交 Bug 反馈的每一位用户 |
| 爱发电赞助者 | 资金支持 | 感谢通过爱发电支持项目的朋友们 |

## 额外注明

1. 本博客使用的背景资源来自网络，请勿商用，如有侵权删。
2. 字体使用的是 Blueaka，来自[基沃托斯图书馆](https://kivo.fun/)。
3. 本开源项目展示的画作为本人画作，勿商 QwQ。
4. 样式整体模仿了 [Mizuki UI](https://mizuki.mysqil.com/) 的设计，感谢原作者的精彩设计。
