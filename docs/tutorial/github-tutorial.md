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

## 二、GitHub 上创建仓库

1. 登录 GitHub
2. 点击右上角 + → New repository
3. 填写信息：

- Repository name: 仓库名称
- Description: 描述（可选）
- Public/Private: 选择公开或私有
- 不要勾选 "Add a README file"（已有项目的情况）

4. 点击 Create repository

## 三、本地项目上传步骤

### 使用命令行

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

## 四、常见问题解决

### 1. 推送时出现错误

```bash
# 如果远程仓库已有内容（如README）
git pull origin main --allow-unrelated-histories
# 解决冲突后再推送
git push -u origin main
```

### 2. 忽略不需要上传的文件

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

### 3. 添加已有仓库的不同分支

```bash
# 查看当前分支
git branch

# 创建并切换到新分支
git checkout -b feature-branch

# 推送到远程
git push -u origin feature-branch
```

## 五、后续日常操作

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

## 六、最佳实践建议

1. 提交信息要清晰：使用英文或中文明确描述更改内容
2. 频繁提交：小步提交，不要积累大量更改
3. 使用分支：新功能在单独分支开发
4. 定期同步：开始工作前先 git pull
5. 先测试再推送：确保代码能正常运行
