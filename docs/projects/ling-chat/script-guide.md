---
title: LingChat 剧本创作指南
description: 本文章将介绍 LingChat 剧本模式的创作方法总览
tags:
  - LingChat
  - 剧本模式
---

# LingChat 剧本创作指南

## 一、剧本模式简介

你是否厌倦了和 AI 一聊一答的对话模式？你是否想要体验一场充满惊喜，深入的对话？剧本模式的诞生就是为了解决这个问题！

1. 剧本模式下，AI 和你将会沉浸式进入一个故事中，而故事的走向完全由你们的对话决定。
2. 在剧本模式下会充满各种事件，场景，对话，人物可以随着剧本的演绎自动运行。
3. 你可以编辑剧本模式！任由你发挥创意，创作出属于你自己的剧本。
4. 剧本还可以变为羁绊剧情，在日常对话中进入羁绊剧情。

## 二、开始创作剧本吧？

### 1. 剧本模式的基础结构

为了创建一个剧本，我们需要一个剧本文件。一个剧本文件由多个部分组成，一个典型的剧本文件结构如下：

```
XX剧本
├── Assets
│   ├── Backgrounds
│   ├── Musics
│   ├── Pics
│   └── Sounds
├── Chapters
│   ├── Charpter_1
│   ├──   ├── 01.yaml
│   ├──   ├── 02.yaml
│   ├──   ├── 03.yaml
│   ├──   └── ...
│   ├── Charpter_2
│   ├── Charpter_3
│   └── ...
├── Characters
│   ├── 某个角色1
│   ├── 某个角色2
│   └── ...
└── story_config.yaml
```

以下是各个部分的详细说明：

- `Assets`：存放剧本中使用的资源文件，包括背景音乐、背景图片、音效等。
- `Chapters`：存放剧本的章节，每个章节由多个片段组成。
- `Characters`：存放剧本中的人物角色，往往是只出现在剧本中的 NPC 角色。
- `story_config.yaml`：剧本的配置文件，用于定义剧本的基本信息。

::: tip 最小实现
当你想创建简单的剧本的时候，你可以只包含 `Chapters` 和 `story_config.yaml` 两个部分，其他部分基本都是锦上添花的东西哦！
:::

### 2. 创建你的第一个剧本

#### 2.1. 创建 `story_config.yaml`

首先，我们需要创建一个 `story_config.yaml` 文件，用于定义剧本的基本信息。一个简单的 `story_config.yaml` 文件如下：

```yaml
script_name: 'Hello Script Wolrd!'
intro_chapter: '01.yaml'
description: '这是我的第一个剧本！你好呀剧本世界！'
```

- `script_name`：剧本的名称。
- `intro_chapter`：剧本的入口章节。
- `description`：剧本的描述。

::: error 注意！
`script_name` 一定要和 `本剧文件夹的名字` 保持一致！
:::

#### 2.2. 创建 `Chapters`

接下来，我们需要创建一个 `Chapters` 文件夹，并在其中创建一个章节。一个简单的章节文件结构如下：

```
Charpters
├── 01.yaml
├── 02.yaml
└── ...
```

每个章节由多个片段组成，每个片段对应一个 `yaml` 文件。一个简单的片段文件一般包含`name`章节名称和`events`章节内的事件，示范如下：

```yaml
name: Charpter 1-1
events:
  # 1. 旁白事件
  - type: narration
    text: |
      今天真是美好的一天！
      鸟儿在歌唱，花儿在绽放。
      在这样的一天，像大家的孩子...
      就应该好好玩玩，放松一下！

  - type: chapter_end
    end_type: linear
    next_chapter: 'end'
```

如你所见，每个章节的片段都是由一系列事件组成的。每个事件都有其特定的类型和属性，用于描述事件的具体内容和效果。

每个事件都包含一个 `type` 属性，用于描述事件的类型。不同`type`类型的事件都有自己的`属性`，也就是后面的参数，比如`narration`事件包含`text`属性，用于描述旁白的内容。而`chapter_end`事件包含`end_type`和`next_chapter`属性，用于描述章节的结束方式和下一章节的名称。以后所有的事件，都遵循这个格式，所以一定要记住哦！

在这里，我们引入了旁白事件和章节结束事件：

- `narration`：旁白事件，用于描述剧本中的旁白内容。
- `chapter_end`：章节结束事件，用于描述章节的结束方式和下一章节的名称。特殊的，当`next_chapter`为`end`时，表示剧本结束。会恢复自由对话模式。

::: tip 第一教程结束！
你已经学会了剧本的结构和最基本剧本的创建，你可以尝试导入到游戏里`data/game_data/scripts/standalone`，重启游戏并看到自己编写的剧本并体验一下啦！之后的更改改完之后就可以直接在游戏中运行测试，非常方便！
:::

### 2.3. 更多Galgame事件，更多演出

刚刚，你学会了最基本的剧本结构和事件，接下来让我们让剧本的演出更加精彩！

#### 2.3.1. 基础场景变更事件

为了让我们对话更有沉浸感，你可以自由设定游戏中的音乐，环境音，背景，展示的图片等。

**以背景事件为例**:

背景事件用于修改当前场景的背景，本事件只更改背景的图片，在感知上如果想要改变，建议搭配旁白台词或场景事件。

```yaml
name: 背景切换
events:
  - type: background
    imagePath: '便利店.png'
    transition: 0.5
    duration: 2
```

`background`事件包含`imagePath`和`duration`属性，分别用于描述背景图片的路径和转场时间。

- 其中，`imagePath`为背景图片的路径，图片的路径在`Assets/Backgrounds`中。比如，`便利店.png`在实际的存储中为`Assets/Backgrounds/便利店.png`。
- `transition`为转场时间，默认为0.5秒，`duration`为下一个事件之前的`CD`，默认为2秒，可以自行调整，这两个也可以省略不写。

**诸如此类事件的还有很多，统一写在下方展示**

```yaml
name: 游戏场景变化事件们
events:
  # 背景音乐事件
  - type: music
    musicPath: '今日的一天.mp3'
    duration: 3

  # 音效事件
  - type: sound
    soundPath: 'smash1.wav'
    duration: 0

  # 环境音事件
  - type: ambient
    ambientPath: '蝉鸣.mp3'
    duration: 3

  # 背景特效事件
  - type: backgroundEffect
    effect: 'Sakura'
    duration: 3

  # Gal 同款小窗口图片事件
  - type: present_pic
    imagePath: 'Q版动画.png'
    scale: 1
    duration: 1
```

特殊的，对于`present_pic`、`music`、`sound`事件，如果设置为`none`或者 ` `（空字符串），则会中断图片展示或音乐，音效等。

> 这里不多赘述事件类型参数，其实看一眼基本上就能知道，更详细的介绍在剧本事件介绍大全文档中。

#### 2.3.2. 玩家对话事件

玩家对话事件用于固定玩家台词，示例如下：

```yaml
name: 玩家对话
events:
  - type: player
    text: 哎呀，好不容易有零花钱啦！

  - type: player
    text: |
      今天我要买一堆泡面犒劳一下我自己才行！
      亏谁不能亏自己的嘴啊！
```

`player`事件包含`text`属性，用于描述玩家的台词。`text`属性可以包含多行文本，使用`|`表示多行文本的开始。

> 其他所有的事件，只要包含 `text` 属性，一般都是可以单行或者多行输入的。比如前文的`narration`事件。

#### 2.3.3. 角色对话事件

角色对话事件用于固定某些角色台词，示例如下：

```yaml
name: 角色对话
events:
  - type: dialogue
    character: MAIN
    text: |
      【生气】喂！能不能不要什么时候都想着吃那种垃圾食品啊！
      【尴尬】虽然我也没吃少就是了...
```

`dialogue`事件包含`character`和`text`属性，分别用于描述角色的名字和台词。`character`属性为角色的id，`text`属性为角色的台词。

> 特殊的，当`character`属性为`MAIN`时，表示自由对话中选择的主对话角色。而`角色id`这一概念会在后面的`剧本角色`章节详细说明。

#### 2.3.4. 修改角色事件

修改角色事件用于修改角色的属性，示例如下：

```yaml
name: 修改角色
events:
  - type: modify_character
    action: show_character
    character: MAIN
    emotion: 伤心
    duration: 1.5
```

本事件的参数有很多，具体如下：

- `action`: 表示本次修改的行为，常用参数是`show_character`和`hide_character`，分别表示显示和隐藏角色。
- `character`: 表示角色的id，与`dialogue`事件中的`character`属性相同。
- `emotion`: 修改角色的立绘表情，这里你可以填任何情绪，最后都会由深度推理模型自动推理出相应的立绘。
- `duration`: 表示本事件持续时间（也就是下一次时间到来前的等待时间)

> - `perceive`: 表示修改角色的感知，当为 false 的时候，角色不会感知到接下来的上下文，true则会感知到。这个功能比较高级，会在日后章节介绍。

本事件必填的参数为`character`，其他参数只需要根据自己的更改角色状态需求填写即可。

#### 2.3.5. 融合在一起！

那么把以上事件融合在一起，我们就可以得到一个完整的剧本：

```yaml
name: 便利店的一天
events:
  # 首先隐藏自由对话里的角色
  - type: modify_character
    action: hide_character
    character: MAIN
    duration: 1.5

  # 修改场景，添加旁白，让故事开始（便利店的图片需要添加到资源文件夹的Backgrounds里）
  - type: background
    imagePath: '便利店.png'
    transition: 0.5
    duration: 2

  - type: player
    text: |
      哎呀，好不容易有零花钱啦！
      今天我要买一堆泡面犒劳一下我自己才行！
      亏谁不能亏自己的嘴啊！

  # 再次让角色出现，更灵性
  - type: modify_character
    action: show_character
    character: MAIN
    emotion: 生气
    duration: 1.5

  - type: dialogue
    character: MAIN
    text: |
      【生气】喂！能不能不要什么时候都想着吃那种垃圾食品啊！
      【尴尬】虽然我也没吃少就是了...

  - type: player
    text: |
      嘛，又不是天天吃。
      既然一起来了，我给你顺便也整份吧！

  - type: dialogue
    character: MAIN
    text: |
      【惊讶】哎？请别人吃饭就只请泡面吗？
      【傲娇】真拿你没办法，那我就勉为其难吃一次吧。

  - type: charpter_end
    end_type: linear
    next_chapter: 'end'
```

运行后，你会惊奇的发现，角色的立绘所对应的表情，对应的语音，对应的翻译，全部都会在运行过程中自动解决！这就是我们打大新时代 galgame 的力量啊！（感叹）

### 2.4. AI-Galgame 事件类型，赋予 AI 的力量

以上，我们实现了对传统 galgame 的自动配音，自动立绘，自动翻译。但，既然 LingChat 是一款 AI 对话软件，我们自然也做了让 AI 进入 galgame 角色和剧情的能力！

接下来，让我们开始介绍有关使用 ai 的事件类型！

#### 2.4.1. 玩家输入事件

```yaml
name: 玩家输入
events:
  - type: input
    hint: '面对可爱的她，你提议要？'
```

当想让玩家输入自己的台词的时候，只要用 `input` 事件类型即可！当然，你可以通过 `hint` 属性，来给玩家一些提示，让玩家知道接下来应该输入什么。方便玩家顺着剧本大纲走，也允许他自由发挥。

```yaml
name: 玩家选择
events:
  - type: choices
    options:
      - text: '要不要一起吃红烧牛肉面！'
        actions:
          - type: add_line
            content: 要不要一起吃红烧牛肉面！
      - text: 要不要一起吃香菇肉鸡面！
        actions:
          - type: add_line
            content: 要不要一起吃香菇肉鸡面！
      - text: 要不要一起吃鲜虾鱼板面！
        actions:
          - type: add_line
            content: 要不要一起吃鲜虾鱼板面！
    allow_free: true
```

和传统的 galgame 一样，我们也可以让玩家做出选择。通过 `choices` 事件类型，我们可以让玩家做出选择。当然也可以通过 `allow_free` 属性，来让玩家自由发挥，输入自己的台词。

这里，`actions` 代表每个选项所导致的行为，你可以通过 `add_line` 来作为玩家输入的台词。在日后的高级教程中，选择还可以用来触发其他行为，比如进入分支，改变变量，等等。目前只需要掌握这个即可。

#### 2.4.2. AI 对话事件

AI 对话事件可以根据剧本的上下文和角色的性格做出 galgame 台词的自动生成，让玩家体验什么叫真正的开放世界剧本游戏！

```yaml
name: AI 回复
events:
  - type: ai_dialogue
    character: MAIN
    prompt: '虽然是个斯文的美少女，但是她泡面却喜欢重口的呢，希望%player%能挑个好的'
```

通过 `prompt` 属性，我们可以指定 AI 的提示，让 AI 根据提示生成台词。

新概念！当你希望指定特殊的角色的名字，你需要用占位符的写法，比如 `%player%`，代表玩家的名字。当然，你也可以用 `%main%` 代表主角的名字等。

```yaml
name: 自由对话（多轮）
events:
  - type: free_dialogue
    character: MAIN
    hint: 你们开始煮起了泡面...
    end_line: 泡面做出来啦！
    end_prompt: 新鲜的泡面咕噜噜炖出来了~
```

自由对话模式下，玩家可以和 AI 进行多轮对话，每一轮相当于由前文的 `input` 和 `ai_dailogue` 事件组成。当玩家输入的台词包含 `end_line` 的部分的时候，会发生最后一场对话结束。

最后一场对话会触发 `end_prompt` 的 AI 对话。

自由对话也有非常多的参数可以选择，你还可以通过 `max_rounds` 来指定最多对话几轮。

#### 2.4.3. 融合在一起，再一次！

让我们看看赋予了 AI 对话后的剧本是什么样的：

```yaml
name: 便利店的一天
events:
  # 首先隐藏自由对话里的角色
  - type: modify_character
    action: hide_character
    character: MAIN
    duration: 1.5

  # 修改场景，添加旁白，让故事开始（便利店的图片需要添加到资源文件夹的Backgrounds里）
  - type: background
    imagePath: '便利店.png'
    transition: 0.5
    duration: 2

  - type: player
    text: |
      哎呀，好不容易有零花钱啦！
      今天我要买一堆泡面犒劳一下我自己才行！
      亏谁不能亏自己的嘴啊！

  # 再次让角色出现，更灵性
  - type: modify_character
    action: show_character
    character: MAIN
    emotion: 生气
    duration: 1.5

  - type: dialogue
    character: MAIN
    text: |
      【生气】喂！能不能不要什么时候都想着吃那种垃圾食品啊！
      【尴尬】虽然我也没吃少就是了...

  - type: player
    text: |
      嘛，又不是天天吃。
      既然一起来了，我给你顺便也整份吧！

  - type: dialogue
    character: MAIN
    text: |
      【惊讶】哎？请别人吃饭就只请泡面吗？
      【傲娇】真拿你没办法，那我就勉为其难吃一次吧。

  # 让玩家自由选择，或者自由发挥
  - type: choices
    options:
      - text: '要不要一起吃红烧牛肉面！'
        actions:
          - type: add_line
            content: 要不要一起吃红烧牛肉面！
      - text: 要不要一起吃香菇肉鸡面！
        actions:
          - type: add_line
            content: 要不要一起吃香菇肉鸡面！
      - text: 要不要一起吃鲜虾鱼板面！
        actions:
          - type: add_line
            content: 要不要一起吃鲜虾鱼板面！
    allow_free: true

  # 根据玩家的选择，并且剧本暗示剧情她喜欢吃重口一点的，所以这里要引导玩家选择重口面。当然玩家也可以不选重口，自由发展后面的剧情，让AI撒娇一下。
  - type: ai_dialogue
    character: MAIN
    prompt: '虽然是个斯文的美少女，但是她泡面却喜欢重口的呢，希望%player%能挑个好的'

  - type: input
    hint: '于是你打算买什么口味的泡面呢？'

  - type: ai_dialogue
    character: MAIN

  - type: modify_character
    action: hide_character
    character: MAIN
    duration: 1.5

  - type: background
    imagePath: '家.png'
    transition: 0.5
    duration: 2

  - type: narration
    text: |
      %player%和%main%带着刚买的泡面回到了家里...

  - type: modify_character
    action: show_character
    character: MAIN
    duration: 1.5

  - type: ai_dialogue
    character: MAIN

  - type: free_dialogue
    character: MAIN
    hint: 你们开始煮起了泡面...
    end_line: 泡面做出来啦！
    end_prompt: 新鲜的泡面咕噜噜炖出来了~

  - type: charpter_end
    end_type: linear
    next_chapter: 'end'
```

这样一来，我们就实现了让 AI 带入到剧情里，让玩家自由选择故事的分支的功能啦！

### 2.5 NPC 角色设定

在上面的介绍中，我们始终都在用 `MAIN` 这个角色来代表 AI，但是实际上，剧本模式也可以有专属角色，并让多个角色参与到舞台中。

剧本中的角色定义在 `Characters` 目录。其中所有的字段和普通的游戏角色都一模一样，唯独多了一个标签，叫`script_role_key`。

这个标签是用于在剧本中作为唯一 `id` 用的。如果想在剧本模式中调用这个角色，只需要通过 `script_role_key` 来调用即可。示例如下：

首先，我们在角色目录中创建一个角色，你可以直接复制已有的角色，然后只要加一个字段即可：

```yaml
ai_name: 风雪
ai_subtitle: LingChat Studio
body_part: null
bubble_left: 25
bubble_top: 5
character_folder: 风雪

# 随便在什么地方加一个这样的字段：
script_role_key: snow_wind
```

接下来，在剧本中，我们就可以通过 `script_role_key` 来调用这个角色了：

```yaml
name: 调用示例
events:
  - type: modify_character
    action: show_character
    character: snow_wind
    emotion: 认真
    duration: 1.5

  - type: ai_dialogue
    character: snow_wind
    prompt: 风雪闻到隔壁传来的泡面味，影响到她实验瓶的调配了。

  - type: narration
    text: |
      这时，风雪的肚子也忍不住咕噜咕噜叫了起来。
      这时候风雪好像也想起来，自己一整天还没吃饭来着。
```

剧本角色会自动加入到舞台中演出，并且会自动根据对话内容来调整角色的表情和位置哦。

### 三、上传到创意工坊

完成剧本后，如果觉得不错的话，欢迎上传到创意工坊，让更多的人来体验你的剧本哦！你也可以在创意工坊上下载别人的剧本游玩！

创意工坊就是 LingChat 项目的 Discusison 区域，链接：[LingChat创意工坊](https://github.com/SlimeBoyOwO/LingChat/discussions)

点击右上角的 `New Discussion`，上传剧本文件（太大的话可以通过网盘）和自己的介绍即可。

### 四、剧本 DLC 包：下载、安装与打包

除了创意工坊的文件夹形式，剧本还可以打包成 **DLC 包**（一个 zip 文件）分发——玩家不需要手动解压拷贝，游戏内一键导入即可游玩。

> [!NOTE] 引擎版本要求
> DLC 识别功能由 [LingChat#677](https://github.com/SlimeBoyOwO/LingChat/pull/677) 引入。在该 PR 合并发版之前，需要使用包含该功能的构建才能看到「DLC 管理」入口。

#### 4.1 安装 DLC 包

1. 下载作者发布的 DLC zip（**无需解压**）。
2. 打开 **游戏配置 → 高级设置 → DLC 管理**。
3. 点击「添加 DLC 包（zip）」，选择下载的 zip 文件。
4. 识别成功后即刻可玩：剧本会直接出现在剧本列表中，主菜单右下角也会显示「已识别 DLC」小字提示。
5. 在 DLC 管理页可以一键「卸载」（内置剧本不受影响，只有 DLC 包能被卸载）。

> [!WARNING] 安全提示
> DLC 是第三方剧本包，内容未经审核，可能包含恐怖、惊吓或令人不适的演出。请只安装来自可信来源的 DLC 包。

#### 4.2 示例 DLC：《第七个测试剧本》

一个原创 meta 恐怖剧本 DLC（四幕、29 章、双结局，含 DDLC 风格崩坏演出），可以直接拿来体验或作为打包参考：

- 仓库：<https://github.com/sdfsfsk/LingChat-DLC-seventh-test-script>
- 下载：[最新发布版](https://github.com/sdfsfsk/LingChat-DLC-seventh-test-script/releases/latest)
- ⚠️ 强烈恐怖演出，含突脸惊吓与自杀暗示内容，建议 18 岁以上游玩

#### 4.3 把你的剧本打包成 DLC

1. 确保剧本目录里有 `story_config.yaml`。
2. 可选：在目录里放一份 `dlc.json` 清单（缺省时导入会自动补写）：

```json
{
  "name": "我的剧本",
  "version": "1.0.0",
  "author": "你的名字",
  "description": "一句话介绍",
  "min_engine": "0.5.0",
  "homepage": "https://你的仓库地址"
}
```

3. 把整个剧本目录打成 zip（zip 里可以是平铺的文件，也可以包一层同名文件夹）。
4. 发布 zip（Release / 网盘均可），玩家按 4.1 导入即可。

其他实用声明（写在 `story_config.yaml` 里）：

- `editor_locked: true`：剧本在剧本编辑器中锁定不可编辑（适合含有编辑器尚不支持的特殊事件的剧本）。
- `content_warning: horror`：进入前弹出内容警告确认框。
- `persistent_vars`：声明跨局记忆变量后，剧本列表会自动出现「重置记忆」按钮。

#### 4.4 高级写诗事件兼容性

[#677](https://github.com/SlimeBoyOwO/LingChat/pull/677) 的 `poem_game` 事件支持显式 `mode`，DLC 不再需要根据 `playthrough` 猜测界面状态：

```yaml
- type: poem_game
  rounds: 20
  wordListPath: poem_words.yaml
  resultVar: poem_tone
  mode: act2
  glitch: true
```

- `mode: normal`：普通三倾向写诗界面。
- `mode: act2`：隐藏已退场角色的贴纸，并在结算时排除对应倾向。
- `mode: act2_final`：在 `act2` 基础上启用损坏计数器与屏外异常贴纸演出。
- `glitch: true`：允许写诗词位按引擎规则出现污染词；建议在词库中提供 `glitch_words`。
- 普通词在一局内按“已展示即移出”处理；20 轮、每轮 10 个选项时，建议准备 **200 个唯一普通词**，避免小词库耗尽后回填。

使用这些扩展字段时，请在 `dlc.json` 的 `min_engine` 中填写实际需要的 LingChat 最低版本。
