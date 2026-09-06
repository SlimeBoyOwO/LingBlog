---
title: 网站部署教程二：HTTPS 协议以及 CI/CD 工作流
description: 教你如何为网站配置 HTTPS 协议，以及如何使用 CI/CD 工作流自动部署网站。
tags:
  - 学习
  - 网站部署
---

# 网页中级教程：HTTPS 协议以及 CI/CD 工作流

## 一、配置 HTTPS 协议

部署网站后发现是 `http` 而不是 `https`，这会导致网站在浏览器中显示不安全，并且部分浏览器输入网址直接就进不去了显示 `CONNECTION_CLOSED`，所以我们需要配置 HTTPS 协议。

### 1. 方案：Let's Encrypt + Certbot

```bash
# 安装 certbot 和 nginx 插件
apt update
apt install certbot python3-certbot-nginx -y

# 注意，更新一下系统时间，否则申请不了证书
apt install ntpdate -y && ntpdate ntp.aliyun.com

# 申请一下之后自动就配置好了，牛逼吧
certbot --nginx -d docs.lingchat.work -d lingchat.work

# 需要输入邮箱用于通知续期（其实会自己续期所以不用管）然后两次 y 同意条款就行
```

### 2. 假如出现报错

有时候会出现 JWS 无法验证问题，不是因为邮箱重复注册也不是因为 `ping` 不到 `api.letsencrypt.org` 导致的（煞笔AI瞎几把意淫出来的解决方案），就是因为系统时间信息没同步 `date` 指令就算显示是正确的也要同步（踩坑）

```bash
root@VM-aB9m29Sj:~# certbot --nginx -d docs.lingchat.work -d lingchat.work
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel): xxxxxxxxxx@qq.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.8-July-06-2026.pdf. You must agree in
order to register with the ACME server. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: y
Unable to register an account with ACME server. Error returned by the ACME server: Unable to validate JWS
Ask for help or search for solutions at https://community.letsencrypt.org. See the logfile /var/log/letsencrypt/letsencrypt.log or re-run Certbot with -v for more details.
root@VM-aB9m29Sj:~#
```

解决方案：`apt install ntpdate -y && ntpdate ntp.aliyun.com`

## 二、CI/CD 工作流（待更新，因为我没仓管，暂时无法集成测试）

为了让远程 `Github` 代码更新之后本地服务器内容自动更新，这里简单进行一个自动化 `CI/CD` 工作流部署.

教程（AI原版，等人工测试后更新人工版本+踩坑经验）

### 1. GitHub Webhook + 脚本

### 第一步：创建自动部署脚本

```bash
nano /usr/local/bin/deploy-wiki.sh
```

粘贴以下内容：

```bash
#!/bin/bash

# 配置
REPO_PATH="/var/www/wiki"
BRANCH="main"  # 如果是 master，改成 master
LOG_FILE="/var/log/deploy-wiki.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# 开始部署
log "========== 开始部署 =========="

# 进入项目目录
cd $REPO_PATH || exit 1

# 拉取最新代码
log "正在拉取最新代码..."
git pull origin $BRANCH >> $LOG_FILE 2>&1

if [ $? -ne 0 ]; then
    log "❌ Git pull 失败！"
    exit 1
fi

# 安装依赖（如果 package.json 有变化）
log "正在安装依赖..."
npm install >> $LOG_FILE 2>&1

# 构建
log "正在构建..."
npm run docs:build >> $LOG_FILE 2>&1

if [ $? -ne 0 ]; then
    log "❌ 构建失败！"
    exit 1
fi

# 重载 Nginx（可选，刷新缓存）
systemctl reload nginx

log "✅ 部署完成！"
log "========== 部署结束 =========="

# 返回成功
echo "✅ 部署成功！"
```

### 第二步：赋予执行权限

```bash
chmod +x /usr/local/bin/deploy-wiki.sh

# 测试运行
/usr/local/bin/deploy-wiki.sh
```

### 第三步：创建 Webhook 接收器

安装 Node.js 的 Webhook 服务：

```bash
cd /var/www
npm install -g webhook

# 或者用 Python 简单版本
```

用 Python 简单版（推荐，无需额外安装）：

```bash
nano /usr/local/bin/webhook-server.py
python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import os

# 配置
SECRET = "your-secret-token-here"  # 请修改为随机字符串
WEBHOOK_PORT = 9000

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 只接受 /webhook 路径
        if self.path != '/webhook':
            self.send_response(404)
            self.end_headers()
            return

        # 获取请求头验证（可选）
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data.decode('utf-8'))

            # 验证 Secret（可选）
            # github_signature = self.headers.get('X-Hub-Signature-256', '')

            # 执行部署脚本
            result = subprocess.run(
                ['/usr/local/bin/deploy-wiki.sh'],
                capture_output=True,
                text=True
            )

            # 返回成功
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"success"}')

            print(f"✅ Webhook 触发成功")

        except Exception as e:
            print(f"❌ 错误: {e}")
            self.send_response(500)
            self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Webhook Server Running')

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', WEBHOOK_PORT), WebhookHandler)
    print(f"🚀 Webhook 服务已启动，端口: {WEBHOOK_PORT}")
    server.serve_forever()
```

赋予权限并运行：

```bash
chmod +x /usr/local/bin/webhook-server.py

# 后台运行
nohup python3 /usr/local/bin/webhook-server.py > /var/log/webhook.log 2>&1 &
```

### 第四步：配置 GitHub Webhook

1. 进入您的 GitHub 仓库
2. Settings → Webhooks → Add webhook
3. 填写：
   - Payload URL: http://154.82.20.106:9000/webhook
   - Content type: application/json
   - Secret: 留空或填写上面脚本中的 your-secret-token-here
   - Which events: 选择 Just the push event
   - 点击 Add webhook

### 第五步：设置开机自启

创建 systemd 服务：

```bash
nano /etc/systemd/system/webhook.service
```

```ini
[Unit]
Description=GitHub Webhook Server
After=network.target

[Service]
ExecStart=/usr/bin/python3 /usr/local/bin/webhook-server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
systemctl daemon-reload
systemctl enable webhook.service
systemctl start webhook.service
systemctl status webhook.service
```

### 第六步：测试自动部署

1. 在本地修改 Wiki 内容
2. 提交并推送：

```bash
git add .
git commit -m "测试自动部署"
git push
```

查看日志：

```bash
tail -f /var/log/deploy-wiki.log
tail -f /var/log/webhook.log
```

### 安全建议（重要！）

#### 添加 Secret 验证：

修改 Python 脚本，添加验证：

```python
# 验证 GitHub 签名
import hashlib
import hmac

github_signature = self.headers.get('X-Hub-Signature-256', '')
expected_signature = 'sha256=' + hmac.new(
    SECRET.encode('utf-8'),
    post_data,
    hashlib.sha256
).hexdigest()

if not hmac.compare_digest(github_signature, expected_signature):
    self.send_response(401)
    self.end_headers()
    return
```
