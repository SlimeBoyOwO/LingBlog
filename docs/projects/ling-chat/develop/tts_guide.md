---
title: 语音使用指南
description: 在 LingChat 使用 TTS 引擎的详细指南
---

# 语音使用指南

## 前言

LingChat 支持非常多的语音引擎，首选下面这两种：

- **Style Bert Vits 2**: 推荐，对日语的效果最好，推理速度快，支持自定义模型，下载链接：https://www.modelscope.cn/models/lingchat-research-studio/Style-Bert-VITS2-CUDA/files
- **GPT-SoVits**: 跨语言，支持中文、英文、日语、韩语等，推理速度较快，支持自定义模型，下载链接：https://github.com/RVC-Boss/GPT-SoVITS
  这两个的生态都非常完善，社区中有很多有关这两个语音引擎的模型。

其他支持的语音引擎包括：`Simple Vits API`, `Style Bert Vits 2 API`, `Bert Vits 2`, `Fish V2`, `OpenTTS`, `aivis`, `indexTTS（可能）`

## 使用方法

### 1. Style Bert Vits 2

1. 在上面的连接中，下载文件，里面有个`01启动 API 服务.bat`，双击运行即可。
2. 在 `LingChat` 中，查看人物设定，在 `语音` 选项卡中，选择 `SBV2`，选择正确的模型名称，在设置中刷新 TTS 即可。
3. 之后启动程序，只要先启动了 `SBV2`，不需要刷新 TTS 即可使用语音。

### 2. GPT-SoVits

1. 下载，放入你的模型
2. 下载下面这个 API：https://github.com/AliceNavigator/GPT-SoVITS-Api-GUI
3. 在 `LingChat` 中，查看人物设定，在 `语音` 选项卡中，选择 `GSV`。
4. 你会看到下面四个字段，按照这个方式填写（参考）：

```md
## gsv_voice_text (gsv_voice_text)

どうしました私があまり可愛いからびっくりしちゃったんですか

## gsv_voice_filename (gsv_voice_filename)

C:\Users\NoiQ\Desktop\小酒狐语音包\塞到GAG里的参考语音与文本\idle50.wav

## gsv_gpt_model_name (gsv_gpt_model_name)

C:\Users\NoiQ\Desktop\GPT-SoVITS-v2pro-20250604-nvidia50\GPT_weights_v2Pro\小酒狐-e10.ckpt

## gsv_sovits_model_name (gsv_sovits_model_name)

C:\Users\NoiQ\Desktop\GPT-SoVITS-v2pro-20250604-nvidia50\SoVITS_weights_v2Pro\小酒狐\_e4_s92.pth
```

5. 第一个填写参考语音文本，第二个填写参考语音文件，第三个填写 GPT 模型，第四个填写 SoVits 模型。
6. 保存，重新选择人物（先选其他人物，再选择这个人物），刷新 TTS 即可。

### 3. Simple Vits 以及其他

由于本人用的不多，其他的语音引擎都是社区贡献的 PR ，如果有需要，可以研究一下（本部分文档欢迎贡献）
