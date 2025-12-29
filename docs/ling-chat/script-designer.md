# 剧本模式编辑器

## 一、系统设计

### 1. 整体剧本文件夹结构设计

目前剧本的结构如下：

```
scripts
├── 剧本一
├── 剧本二
│   ├── Assets
│   │   ├── Backgrounds
│   │   ├── Musics
│   │   ├── Effects
│   │   └── Sounds
│   ├── Characters
│   │   ├── 诺一钦灵
│   │   │   ├── avatar
│   │   │   └── settings.toml
│   │   ├── 风雪
│   │   └── 七辰
│   ├── Charpters
│   │   ├── Charpter_1
│   │   │   ├── 1-1.json
│   │   │   ├── 1-2.json
│   │   │   └── ......
│   │   ├── Charpter_2
│   │   └── Intro
│   └── story_config.yaml
├── 剧本三
└── ......
```

每个剧本由`Assets`, `Characters`, `Charpters`, `story_config.yaml`组成。

- `Assets`：存放剧本中用到的资源，如`Backgrounds`图片背景，`Musics`游戏BGM，`Sounds`环境音，`Effects`特殊音效。
- `Characters`：存放剧本中用到的角色，如`Avatar`存放角色立绘，`settings.toml`存放角色的prompt信息等。
- `Charpters`：存放章节信息，每个章节由多个json文件组成，每个json文件对应一部分剧本内容。子章节之间可以跳转。
- `story_config.yaml`：存放剧本的配置信息，如剧本名称、初始章节、描述、用户信息等。

### 2. 剧本设置文件设计

剧本设置文件`story_config.yaml`用于存放剧本的配置信息，如剧本名称、初始章节、描述、用户信息等。

```
# story_config.yaml
script_name: "A_Simple_Story"
intro_charpter: "Intro/intro"
description: "这是一个简简单单的小剧本"

script_settings:
  user_name: "钦灵"
  user_subtitle: "LingChat Studio"
```

- `script_name`：剧本名称。
- `intro_charpter`：初始章节。
- `description`：剧本描述。
- `script_settings`：剧本设置，包括用户信息，未来可能增添更多设置。

### 3. 章节设计

章节由多个json文件组成，每个json文件对应一部分剧本内容，称为`子章节`。一个`子章节`的示例内容如下：

```json
# 章节所进行事件
events:
  - type: background
    imagePath: "black_scene.png"
    duration: 2

  - type: music
    musicPath: "魁树下的猫.mp3"
    duration: 0

  - type: narration
    text: |
      2025年的10月31日...

  - type: background
    imagePath: "序章-放学后.png"
    duration: 1.5

  - type: narration
    text: |
      今天的天空格外清澈，钦灵难得准时放学。
      风雪的占卜摊今天却异常安静，没有往日的魔法光芒。

  - type: dialogue
    character: "qin_ling"
    text: |
      【厌恶】别打扰我，正在研究能提升智商的高级魔法药水。
      【自信】这可是连大魔导师都难以掌握的秘传配方。
      【鄙视】你这种愚蠢的笨蛋是不会懂的就是了。

  - type: set_variable
    operation: "choice = 1"

  - type: set_variable
    operation: "ai_love = 0; ai_love += 10;"
    condition: "choice = 1"

  - type: set_variable
    operation: "ai_love = 0; ai_love += 5;"
    condition: "choice = 2"

  - type: end_linear
    next: "end"
```

`子章节`由一个个`事件节点`组成，而每个不同类型的事件都有属于自己的不同的属性，其中属性`type`是必须的，`duration`和`condition`是可选项，其他属性根据事件类型不同而不同（必须项或者可选项）。

对于剧本编辑器而言，他需要做到：

1. 可以在一个剧本里面，添加、删除、修改章节。
2. 可以在章节中，添加、删除、修改事件节点。
3. 章节节点在前端展示中，需要提供链接方式，方便章节的跳转，如果是线性跳转则是通过检测`-type: end_linear next: "next_charpter"`实现的，条件跳转则是通过：

```json
  - type: end_linear
    next: "next_charpter"
    condition: "condition"
```

其中`condition`是条件判断，通过检测剧本中的变量来实现，可以有多个`condition`，实现类似于`if-else`的跳转。如果没有`condition`或条件都不满足可以直接通过`end_linear`实现线性跳转。每个事件可以通过`condition`定义是否满足条件才发生。所以事件之间的连线也可以通过检测`condition`是否一致来实现。

### 4. 公共静态资源设计

公共静态资源为剧本所需要使用的图片、音频、音效、BGM等资源，在剧本编辑器中，会自动读取这些资源，并生成列表，方便直接插入到节点内（如修改背景图片事件，播放音频事件等）。这些资源存储可能使用多级文件夹。

- `Backgrounds`图片背景
- `Musics`游戏BGM
- `Sounds`环境音
- `Effects`特殊音效

### 5. 人物资源设计

人物资源为剧本所使用的角色图片，角色prompt，人物id，以及图片显示等信息。他们主要定义在toml文件中（txt文件不考虑），格式如下：

```toml
[role]
id = "qin_ling"
title = "可爱的小狼娘"
info = """
这是一只可爱的小狼娘。
喜欢粘你，傲娇又可爱的小程序员。
喜欢变态的玩法，是你的好助手~
"""

ai_name = "钦灵"
ai_subtitle = "Slime Studio"
user_name = "莱姆"
user_subtitle = "Bilibili"
thinking_message = "灵灵正在思考中..."

# 省略更多设置信息......
```

剧本编辑器会读取所有的人物id和基础信息（比如名字），并生成列表，方便直接插入到节点内（如修改角色图片事件，修改角色prompt事件等）。

### 6. 事件列表（部分，未来需要极大扩展）

以下显示部分事件列表，由于事件未来扩展需要性太高了，只列出部分事件，前端应该提供方便添加事件类型的代码接口。以便未来扩展更多事件类型。

#### Events 设定

- Events 由唯一 type 指定事件类型
- 添加一个 Event 事件，就是先选定一个type，然后设定他的特有的参数即可
- 在剧本编辑器中，只需要先选择你要添加的事件类型，然后提供需要的参数即可

#### 基类，所有Events共有的属性

```
type: string;
duration: number;
condition?: string;
isFinal?: boolean;
```

`type`: 表示这个事件的类型，不同类型的事件有不同的参数
`duration`: 持续时间，当这个值为负数的时候，则表示需要玩家主动enter推进，有duration则是过去这段时间后自动推进，单位秒，假如事件中没写，默认为0。
`condition`: 用于标记是否满足条件，满足条件则执行，不满足则跳过，可选参数
`isFinal`: 用于标记是否终止，轮到玩家输入或剧本结束的信号，可选参数

#### 旁白事件，玩家事件

```
- type: narration
    text: |
      药水入口的瞬间，风雪的眼神突然变得迷茫。
      她眨了眨眼，直勾勾地盯着钦灵。

- type: player
    text: 奇怪，小雪今天怎么这么安静...
```

text: 表示旁白输出的信息

#### 预设AI回复事件

```
- type: dialogue
    character: 风雪
    text: |
      【迷离】妈...妈妈？
      【撒娇】妈妈！你终于来了！
      【哭泣】呜呜呜呜，妈妈我好想你...
```

character: 选定的发言人物
text: 支持多行输入的文本，每一行代表一次对话

#### AI智能回复事件

```
- type: ai_dialogue
    character: 风雪
    prompt: "风雪因为药效完全变成了黏人的小猫性格，把钦灵当成了妈妈，不断撒娇求关注"
```

character: 选定的发言人物
prompt: 可选参数，作为ai本次回复的提示

#### 自由对话AI回复

```
- type: free_dialogue
    character: 风雪
    hint: "和可爱的风雪聊聊天吧，或者通过“求求你快复原啊！”来尝试唤醒她"
    prompt: "药效还在持续发作，你不断地找钦灵撒娇"
    end_line: "求求你快复原啊！"
    end_prompt: "风雪的药效开始逐渐消退，意识到自己刚才的失态"
```

character: 选定的发言人物
hint: 显示给玩家的对话提示，可选项
prompt: 在非最后一次对话的时候的提示词，可选项
end_line: 包含这一行的对话则表示对话结束，可选项
end_prompt: 结束的时候，给AI的提示词，可选项
max_rounds: 最大对话轮次，结束后强制退出，可选项

#### 修改人物状态

```
- type: modify_character
    action: show_character
    character: 风雪
    emotion: 正常
    duration: 1.5
```

action: 行为，可以扩展不同的参数，表示在前端的行为（出现人物，退场人物，人物动作等），可选项
character: 选定角色，可选项
emotion: 更改角色的表情，可选项

#### 游戏资源相关

```
- type: music
    musicPath: "啊哦.mp3"
    duration: 0

- type: background
    imagePath: "black_scene.png"
    duration: 2

- type: background_effect
    effect: "none"
    duration: 0
```

懒得解释了（）

#### 玩家输入事件（目前仅包含input，之后会做选项这种）

```
- type: input
    hint: "面对突然撒娇的风雪，你会怎么做？"
```

hint: 提示玩家的输入

#### 剧本编辑器要求

- 添加事件时候，对于同一类型的，提供二级或多级菜单选择，比如ai对话类，可以先选择是人物对话，然后细致的选择是`dialogue`还是`ai_dialogue`还是`free_dialogue`。
- 添加事件后，对于可选参数可以不显示，在`+`号里动态选择添加。必选参数默认提供且必须填写。

## 二、前后端总体设计

### 1. 前端

使用`vue3 + ts + tailwindcss + pinia + vueuse + 任何你觉得方便的技术栈`构建。要求：

- 前端界面美观，简洁，符合现代审美，默认使用暗色主题，使用`tailwindcss`，背景带有淡淡的网格线，提供专业感。
- 前端可以选择需要导入的剧本，然后可以进行章节节点编辑和事件编辑。首先进入章节节点编辑，然后进入事件编辑。
- 前端需要提供保存功能。

### 2. 后端

使用`python + fastapi + 任何你觉得方便的技术`构建。要求：

- 后端能读取剧本所在的目录，并向前端返回剧本列表。
- 后端需要提供保存功能，将前端传来的剧本保存到对应的目录下。
- 后端需要提供给前端的读取功能，当前端选择好剧本后，读取对应的章节。选择章节后，读取对应章节的事件。
