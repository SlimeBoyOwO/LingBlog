# Vue 项目构建教程

## 1. 使用 pnpm 初始化项目

```bash
pnpm create vue@latest
```

配置需要的组件，然后执行以下命令

```bash
cd xxx
pnpm install
pnpm format
pnpm dev
```

这时候就应该启动一个开发服务器了

## 2. 添加实用的依赖库等

考虑到基础依赖库已经用 create vue@latest 初始化好了，这里我们添加一些实用的依赖库

### 2.1 添加 tailwindcss

tailwindcss 是一个实用的 css 框架，可以让我们快速构建样式，这里我们使用 2025.1 刚更新的 v4 版本

```bash
pnpm add tailwindcss @tailwindcss/vite
```

在 vite 配置文件中，添加：

```typescript
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

在 css 文件中添加

```css
@import "tailwindcss";
```

然后启动 run dev 即可，示范代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/src/style.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```
