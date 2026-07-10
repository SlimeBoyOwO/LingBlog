---
title: 各版本介绍与下载指南
description: LingChat版本列举，并详细介绍各版本的不同之处，便于下载
outline:
  level: [1, 5]
---

## [0.4.1] - 2026-05-01

## 🐈 更新主题：可游玩羁绊剧情，桌宠，场景功能，优化与 Bug 修复

### 🎉 更新内容详解

#### ✨️ Part 1: 对 Deepseek V4 的专门提示词优化 && 实装人物羁绊剧情

- **恭迎DSv4**：我们注意到老的提示词对于新版本的人物扮演模型不太给力，于是在测试一段时间之后优化了更好的系统提示词~如果老版本deepseek回复总是抽风，可以用这个新版本的哦
- **实装人物羁绊系统**：现在可以直接游玩人物的羁绊剧情了哦，你将和AI在剧情下进行冒险，使用公开/ai素材的官方羁绊剧情示例，感兴趣之后可以自己做自己喜欢的剧情~

<img width="1797" height="1194" alt="image" src="https://github.com/user-attachments/assets/77a655b7-517d-4e34-933e-5ecb8cafcc80" />
<img width="2559" height="1332" alt="cacaf8132915dda95e236f8b4e084b5e" src="https://github.com/user-attachments/assets/b3918de5-1d28-4390-8bff-e58882fc5a5f" />

> [!NOTE]
> 由于此次deepseek更新之后默认启动思考，会导致回复稍微慢个一两秒，如果你介意的话可以在`.env`中添加（或修改）这一行：
> `ENABLE_THINKING="false"    # （选填）控制模型思考，如果用的是kimi，glm，deepseek等改成false可以取消思考。可以填写none，false，true，不需要调整时请填写none`

#### 🧀 Part 2: 便捷版本，桌宠

每个包都附带了 `LingChat-Pal` ，这是全新重置的桌宠项目，可以搭配 LingChat 使用

- **黏在电脑上的小帮手**： 小桌宠使得自主对话和轻度对话场景下更加灵活，主要服务于以下功能
- **多样的自主对话**：现在 ai 可以随机在`继续对话`，`代办提醒`和`屏幕视奸`几个模式中随机选择自由对话，主动与玩家沟通联系啦
- **自动分析玩家状态**：程序支持通过键盘习惯和屏幕分析，实现游戏状态监测和工作，待机场景检测，不同的场景 ai 会更加倾向选择不同的对话频率和策略~
- **日程闹钟功能**：可以通过设置`日程`，让 ai 在特定时间主动发起相关对话 ，可以用于作为类似闹钟功能的提醒
- **代办记录功能**：可以通过设置`代办`，在程序内随时记录自己的工作，并且 ai 还会时不时提醒你相关内容哦！
- **重要日子提醒**：除此之外，你还可以设置`重要日子`，那个时候 ai 会主动提醒你哦！
- **支持自定义设置**：可以自定义设置桌宠的大小，并且查看聊天记录，更改粒子，和自主对话的功能

<img width="1650" height="1140" alt="image" src="https://github.com/user-attachments/assets/5030b187-e44b-4025-b3d4-f02c5af38a9e" />

#### 🌈 Part 3: 场景选择+创建人物功能，沉浸式对话体验

- **沉浸式场景**：与其单纯切换背景，你可以为背景做详细的描述后再切换，可以一键让角色和自己沉浸进入喜欢的场景！
- **快速创建人物**：现在可以通过直接网页端直接创建人物了哦，可以随时导入自己喜欢的角色
- **语音输入功能**：在现代浏览器中可以点击麦克风语音输入沉浸对话~

<img width="2537" height="1321" alt="image" src="https://github.com/user-attachments/assets/5f48bcea-9119-4df5-9c87-d2a0c1769a9c" />
<img width="1798" height="1236" alt="image" src="https://github.com/user-attachments/assets/c2252959-e369-4c9c-864f-1a1b678a123a" />

### 🔧 Bug 修复与改进

- **Pre 版本中提到的 Bug均已修复**：我们收集了用户群的反馈并且修复了已知的问题

### 💡 特别声明

本次更新为对 v0.4.0 Pre 的补充与新功能扩展，如果你没有玩过 0.4.0，推荐查看之前的 Release 以了解更多新功能！（当然还是记得下载最新的 v0.4.1 版本哦）

[v0.4.0 大版本更新内容](https://github.com/SlimeBoyOwO/LingChat/releases/tag/v0.4.0-Pre)

感谢本项目所有的 contributors，没有你们本项目没有今天的坚持更新❤

## 使用注意事项（一定要看！！）

### 一、如果你是从 0.4 版本更新到 0.4.1 的

1. 为了迁移存档（记忆），直接复制老版本的 ling_chat/data/game_database.db 到同一个目录即可（覆盖）
2. 同样的道理可以迁移人物，背景，音乐等。不建议 **直接覆盖钦灵，风雪人物** ，因为这个版本我们为他们新增了更多参数和功能，可以通过修改人物提示词的方式继承你的定制化人物。
3. **ling_chat/data/scripts** 内包含剧本文件。如果你迁移存档导致剧本文件没了，可以尝试复制 **ling_chat/static下面的同名文件夹** 复原一下。
4. 0.4 之前的用户不要这么做！

### 二、默认启动的游戏界面不是 **最推荐的使用方式** ，我们强烈推荐在启动程序后，通过 **在浏览器访问地址：localhost:8756（或者localhost:8765）**  进行游玩！它可以解决以下问题

1. 如果自动启动的界面出现画面变灰的情况，在部分浏览器是没问题的。
2. 出现了一些bug，导致对话卡住的问题，可以通过F5刷新页面修复。
3. 如果羁绊剧情条件完成了，但是没有解锁，按F5刷新可以修复。
4. 网页端和游戏端是完全一致的
5. Legacy CPU版本引入SDE所以无法正常启动前端页面

### 三、此外，在程序运行的过程中，假如出现了 **卡住** 的情况，很大概率是网络抽风导致大模型输出有问题或者本身使用模型不太聪明，导致输出格式出错，这个时候

1. 即时存档，免得人物丢失记忆
2. 重启软件，读取存档即可

### 四、关于桌宠

1. 在 **主程序启动之后再启动桌宠** ，桌宠是依赖主程序运行的！（否则会报错）
2. 桌宠的记忆，对话，人物和主程序是保持一致的，想要同步进度可以用 F5 刷新（仅限 桌宠 和 网页端，但不支持直接启动弹出的游戏端）

### 五、关于新的羁绊剧情

1. 你需要填入这两个东西才兼容所有的剧本模式对话。

```text
TRANSLATE_LLM_PROVIDER="webllm" # 翻译模型提供者
TRANSLATE_API_KEY="sk-xxxx" # 翻译模型的 API Key
```

你也可以不用阿里云qwen那边的翻译，写个 `none` 即可

1. 不推荐在剧本进行的情况下存档，暂时没做过太多测试不保证不会出bug

## 怎么挑选版本？


| 文件名 | 介绍 | 下载链接 |
|--------|------|----------|
| LingChat-v0.4.1.7z（打包版） | 钦灵（[SlimeBoyOwO](https://github.com/SlimeBoyOwO)）本人手工打包，品质有保障！（就是缺了一小点东西） | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1.7z)<br>[gh-proxy 镜像（更快）](https://gh-proxy.org/github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1.7z) |
| LingChat.v0.4.1._setup.1.0.0.3.exe（安装版） | uwa（[myh1011](https://github.com/myh1011)）基于 打包版 做的安装版本，使用更省心（缺点也顺承了） | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat.v0.4.1._setup.1.0.0.3.exe)<br>[gh-proxy 镜像（更快）](https://gh-proxy.org/github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat.v0.4.1._setup.1.0.0.3.exe) |
| LingChat-v0.4.1-windows.7z（编译版） | 影空（[shadow01a](https://github.com/shadow01a)）的工作流全自动编译打包的版本，启动更快，空间占用更小 ~~力图干翻钦灵版本~~ （缺点：绝对绝对**不可以放在有中文文件夹的目录下面运行！！！！**） | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1-windows.7z)<br>[gh-proxy 镜像（更快）](https://gh-proxy.org/github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1-windows.7z) <br>[ModelScope下载（最快，国内优先选）](https://www.modelscope.cn/models/lingchat-research-studio/LingChat-release-mirror/resolve/master/v0.4.1/artifacts/LingChat-v0.4.1-windows.7z) |
| LingChat-v0.4.1-linux-amd64.tar.xz（编译版） | 同上，但是是给linux（amd64）用的 | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1-linux-amd64.tar.xz)<br>[gh-proxy 镜像（更快）](https://gh-proxy.org/github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1-linux-amd64.tar.xz) <br>[ModelScope下载（最快，国内优先选）](https://www.modelscope.cn/models/lingchat-research-studio/LingChat-release-mirror/resolve/master/v0.4.1/artifacts/LingChat-v0.4.1-linux-amd64.tar.xz) |
| LingChat-v0.4.1-linux-aarch64.tar.xz（编译版） | 同上，但是是给linux（aarch64）用的 | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1-linux-aarch64.tar.xz)<br>[gh-proxy 镜像（更快）](https://gh-proxy.org/github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat-v0.4.1-linux-aarch64.tar.xz) <br>[ModelScope下载（最快，国内优先选）](https://www.modelscope.cn/models/lingchat-research-studio/LingChat-release-mirror/resolve/master/v0.4.1/artifacts/LingChat-v0.4.1-linux-aarch64.tar.xz) |
| LingChat v0.4.1-Release Python3.8 win32.7z  (Win32 支持版) | Heiyaha（[Heiyahand](https://github.com/Heiyahand)）基于Python 3.8.10 32Bit Win32兼容版本的版本（64位系统也可用），启动器更换为了C++98启动器，支持Windows 7及以上的系统，启动时间吊打官方原版，缺点是CPU必须支持SSE4.2/AVX。另：桌宠不是由[Heiyahand](https://github.com/Heiyahand)制作，所以无法确认在32位系统正常运行 | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat.v0.4.1-Release.Python3.8.win32.7z) |
| LingChat v0.4.1-Release Python3.8 win32 support Legacy CPUs  (牢CPU支持版) | 同上，但把C++98启动器更换为了C启动器，并引入了Intel SDE 8.59模拟指令集来兼容更老的设备，缺点是启动时间极其缓慢（Intel Atom Z540启动时间要7~9分钟），但这个版本你甚至可以用奔腾3来玩（只要您可以装上Win 7或者给XP/Vista打上扩展内核） | [Github（可能慢）](https://github.com/SlimeBoyOwO/LingChat/releases/download/v0.4.1/LingChat.v0.4.1-Release.Python3.8.win32.support.Legacy.CPUs.7z) |
