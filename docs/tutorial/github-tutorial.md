---
title: GitHub 仓库管理教程
description: 教你如何创建、管理 GitHub 仓库
tags:
  - 学习
  - Github
  - 开源
---

# GitHub 仓库管理教程

## 一、初始化工作

### 1. 安装 Git

- Windows: 下载 Git for Windows
- Mac: brew install git 或从官网下载
- Linux: sudo apt install git (Ubuntu/Debian) 或 sudo yum install git (CentOS)

### 2. 配置 Git

```bash
# 设置用户名和邮箱（与GitHub一致）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 查看配置
git config --list
```

### 3. 创建 Github 仓库

1. 登录 GitHub
2. 点击右上角 + → New repository
3. 填写信息：

- Repository name: 仓库名称
- Description: 描述（可选）
- Public/Private: 选择公开或私有
- 不要勾选 "Add a README file"（已有项目的情况）

4. 点击 Create repository

### 4. 上传推送本地仓库

```bash
# 1. 进入你的项目目录
cd /path/to/your/project

# 2. 初始化本地仓库
git init

# 3. 添加所有文件到暂存区
git add .
# 或添加特定文件：git add 文件名

# 4. 提交到本地仓库
git commit -m "first commit"

# 5. 添加远程仓库地址（从GitHub复制）
git remote add origin https://github.com/你的用户名/仓库名.git

# 6. 推送到GitHub
git branch -M main  # 重命名分支为main（可选）
git push -u origin main
```

### 5. 常见问题解决

#### 1. 推送时出现错误

```bash
# 如果远程仓库已有内容（如README）
git pull origin main --allow-unrelated-histories
# 解决冲突后再推送
git push -u origin main
```

#### 2. 忽略不需要上传的文件

创建 .gitignore 文件：

```gitignore
# 依赖文件夹
node_modules/
venv/
__pycache__/

# 环境变量文件
.env
.env.local

# 系统文件
.DS_Store
Thumbs.db

# IDE文件
.vscode/
.idea/
*.swp
```

#### 3. 添加已有仓库的不同分支

```bash
# 查看当前分支
git branch

# 创建并切换到新分支
git checkout -b feature-branch

# 推送到远程
git push -u origin feature-branch
```

## 二、日常 Github 操作

### 1. 日常提交与更新操作

```bash
# 日常更新流程
git add .
git commit -m "更新描述"
git push

# 拉取远程更新
git pull origin main

# 查看状态
git status

# 查看提交历史
git log --oneline
```

### 2. 合并 develop 分支到 main 分支

```bash
# 保证分支是最新的
git checkout develop
git pull origin develop

git checkout main
git pull origin main

# 合并 develop 分支到 main 分支
git merge develop

# 检查是否有冲突
git status

# 解决冲突后提交（这部分可以直接在VSC里操作）
git add .
git commit -m "合并 develop 分支到 main 分支"

# 推送到远程
git push origin main
```

### 3. 删除远程分支

```bash
# 删除远程分支
git push origin --delete feature-branch

# 推送
git push origin main
```

## 三、接受 Pull Request，本地测试

```bash
# 1. 获取PR的远程分支
git fetch origin pull/<PR编号>/head:pr-<PR编号>

# 示例：PR #123
git fetch origin pull/123/head:pr-123

# 2. 切换到该分支
git checkout pr-123

# 3. 与目标分支（如main）合并测试
git checkout main
git merge pr-123 --no-commit  # 先不提交，只合并

# 4. 运行测试/编译/调试
npm test  # 或 make test, pytest等

# 5. 如果没问题，可以提交合并
git commit -m "Merge PR #123"

# 6. 如果有问题，取消合并
git merge --abort
```
