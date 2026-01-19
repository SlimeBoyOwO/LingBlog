# Python 项目管理环境配置

## 1. 使用uv创建虚拟环境

```cmd
uv venv --python 3.10
.venv\Scripts\activate
```

## 2. 安装依赖

### 2.1 兼容老项目，使用pip安装依赖

```cmd
uv pip install -r requirements.txt
```

### 2.2 直接uv初始化，用add添加依赖

```cmd
uv init
uv add xxx
```

## 3. 推荐的一些现代开发python库

### Ruff

Python 代码质量工具，可以检查代码风格、类型检查、代码规范，可以自动格式化代码，优化代码，非常好用。

```cmd
uv add ruff
```
