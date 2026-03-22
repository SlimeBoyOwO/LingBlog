---
title: LingChat 剧本模式事件大全
description: 本文章将介绍 LingChat 剧本模式中所有事件及其用法。
tags:
  - LingChat
  - 剧本模式
---

# LingChat 剧本模式事件大全

## 一、对话事件

有关`text`属性，可以单行也可以多行

### 1. 旁白称述

```yaml
- type: narration
  text: |
    钦灵和莱姆一起走到了一个阴森又偏僻的地方。
    只见一颗老魁树下面，有一个摇摇欲坠的小占卜摊。
    小摊主手中握着一个小茶杯，淡淡地看着眼前吹下的落叶。
```

### 2. 玩家固定台词

```yaml
- type: player
  text: 哎？原来钦灵在外面一直有找小三吗？
```

### 3. AI角色固定台词

```yaml
- type: dialogue
  character: qin_ling # 剧本角色唯一id
  text: |
    【生气】怎么说的我和偷腥狼一样！
    【无奈】人家是猫娘啦，我又不是同的说...
    【打起精神】走吧，我带你去那边看看。
```

## 二、环境变化事件

### 1. 设定背景

```yaml
- type: background # 设定背景
  imagePath: 'black_scene.png' # 背景图片路径
  duration: 2 # 自动过度时间
```

### 2. 设定背景特效

```yaml
- type: background_effect # 设定背景特效
  effect: None # 特效类型
  duration: 0 # 自动过度时间
```

### 3. 设定背景音乐

```yaml
- type: background_music # 设定背景音乐
  musicPath: 'bgm.mp3' # 音乐路径
  duration: 0 # 自动过度时间
```

## 三、人物相关事件

```yaml
- type: modify_character
  action: hide_character # 包含 show_character, hide_character
  character: MAIN # 剧本角色唯一id，MAIN表示存档主角AI
  perceive: true # 这决定了AI是否能看到上下文，当为true期间可以感知上下文，false则期间台词不会进入上下文
  emotion: 开心 # 表情，会被情感识别系统自动归类
  duration: 1.5
```

## 四、AI 对话控制相关

### 1. 玩家输入

```yaml
- type: input
  hint: '尝试对着风雪打个招呼吧！' # 输入提示信息
```

### 2. AI 回答

```yaml
- type: ai_dialogue
  character: snow_wind # 剧本角色唯一id
  prompt: 风雪打算开心点回答 # AI回复前，给AI的剧本提示信息
```

### 3. 自由对话事件（多轮玩家与AI对话）

```yaml
- type: free_dialogue
  character: MAIN
  max_rounds: 3 # 最大对话轮数
  hint: 试着安慰钦灵吧，输入结束结束对话 # 玩家提示信息
  dialog_prompt: 莱姆似乎尝试安慰你 # 给 AI 的提示信息
  end_line: 结束 # 结束对话的台词
  end_prompt: 莱姆安慰好你啦，你很感谢他 # 结束对话的时候，给AI的提示信息（最后一轮对话）
```

## 五、Galgame 机制相关

### 1. 章节切换

```yaml
- type: chapter_end
  end_type: linear # 章节结束类型，linear表示线性结束
  next_chapter: 'end' # 下一个章节路径，end表示结束
```

### 2. 玩家选项事件

```yaml
- type: choices
  options:          # 选项列表，以及每个选项执行的行动
    - text: 钦灵？！你在干嘛啊！！！
    actions:
        - type: add_line
        content: 钦灵？！你在干嘛啊！！！
    - text: 嘿嘿嘿，小钦灵玩黄油给我逮到了吧~
    actions:
        - type: add_line
        content: 嘿嘿嘿，小钦灵玩黄油给我逮到了吧~
    - text: 钦灵...地上内衣不收拾，等着我帮你洗吗？
    actions:
        - type: add_line
        content: 钦灵...地上内衣不收拾，等着我帮你洗吗？
  allow_free: true
```
