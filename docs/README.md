# LingBlog Docs

本目录是博客站点的源码目录，基于 [VitePress](https://vitepress.dev/) 构建。

## 目录结构

```
docs/
├── .vitepress/           # VitePress 配置与自定义主题
│   ├── theme/            # 自定义主题组件、样式、工具
│   └── config.ts         # 站点配置（导航栏、侧边栏、标题等）
├── articles/             # 长篇文章（如同人文）
├── drawings/             # 绘画作品与教程
├── intro/                # 个人介绍、兴趣爱好、东方系列等
├── others/               # 其他杂项内容
├── projects/            # 项目文档
│   └── ling-chat/        # LingChat 项目的完整文档
│       ├── manual/       # 用户手册
│       ├── develop/      # 开发文档
│       ├── faq/          # 常见问题
│       └── devlist/      # 开发日志
├── public/               # 静态资源（图片、音频、图标等）
├── tutorial/             # 技术笔记与教程
└── index.md              # 博客首页
```

## 本地开发

```sh
# 启动开发服务器
npm run docs:dev

# 构建博客
npm run docs:build

# 预览构建产物
npm run docs:preview
```

## 如何新增一篇文章

1. 在对应目录下创建 `.md` 文件（如 `tutorial/my-post.md`）
2. 在 [config.ts](./.vitepress/config.ts) 的 `sidebar` 中添加对应的侧边栏链接
3. 提交代码即可

## Front Matter 说明

每篇文章开头可添加以下元信息：

```yaml
---
title: 文章标题
description: 文章摘要
tags: [标签1, 标签2]
---
```
