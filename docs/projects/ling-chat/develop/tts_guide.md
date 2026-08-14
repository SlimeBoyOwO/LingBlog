---
title: 语音使用指南
description: 在 LingChat 使用 TTS 引擎的详细指南
---

# 语音使用指南

## 前言

LingChat 支持非常多的语音引擎。`内置 TTS（本地引擎）`是现在的首选推荐：不需要启动任何外部程序，直接在应用内完成语音合成，无须API可用，并且多平台兼容；详细说明见下文「内置 TTS」章节。

如果你需要其他语言或更多自定义空间，也可以使用下面这两个外部引擎：

- `Style Bert Vits 2`：推荐，对日语的效果最好，推理速度快，支持自定义模型，下载链接：https://www.modelscope.cn/models/lingchat-research-studio/Style-Bert-VITS2-CUDA/files
- `GPT-SoVits`：跨语言，支持中文、英文、日语、韩语等，推理速度较快，支持自定义模型，下载链接：https://github.com/RVC-Boss/GPT-SoVITS

这两个的生态都非常完善，社区中有很多有关这两个语音引擎的模型。

其他支持的语音引擎包括：`Simple Vits API`，`Style Bert Vits 2 API`，`Bert Vits 2`，`Fish V2`，`OpenTTS`，`aivis`，`indexTTS（可能）`

内置 TTS 与外部 TTS 引擎可以同时使用，详细说明见下文 [角色语音设置](#role-voice) 章节。

## 内置 TTS（本地引擎）

**LingChat 内置的本地 TTS 引擎**（角色 TTS 类型中的「本地 SBV2 API」），它不需要启动任何外部程序，直接在应用内完成语音合成，并且多平台兼容。
内置 TTS 目前只能合成日语。

### 1. 快速上手

1. 打开 **主界面 → 设置 → 高级设置 → 本地 TTS**，开启顶部的「全局本地 TTS」开关
2. 在「模型下载」区域下载 **DeBERTa-v3-base**（自动附带分词器）和 **Ling-v2**（自动附带风格向量），模型就齐了
3. 打开 **设置 → 角色**，点击角色卡片右上角的齿轮按钮，切换到「语音设置」tab
4. **TTS 类型**选择「本地 SBV2 API」，**本地语音 ID** 选择 Ling-v2
5. 保存，回到聊天界面——角色就会开口说话了

> 提示：模型未装好时页面顶部会有红色警示条；想了解模型细节、外部导入或推理硬件，见下方[进阶](#advanced)章节。

### 2. 进阶 {#advanced}

- [模型文件说明](#model-files) — 四类文件的作用、风格向量、安装位置
- [模型导入详解](#import-models) — 外部导入、补齐 style_vectors、管理已安装语音、试听
- [推理硬件选择](#hardware) — GPU / CPU 切换
- [角色语音设置](#role-voice) — 字段详解、云端备用模型
- [常见问题（FAQ）](#faq)

### 3. 模型文件说明 {#model-files}

内置 TTS 需要两类模型文件：

| 类别 | 文件 | 作用 | 备注 |
| --- | --- | --- | --- |
| 共享模型 | `DeBERTa 模型`（deberta.onnx，约 278MB） | 日文 BERT，负责理解文本内容 | 一次安装，`所有语音通用` |
| 共享模型 | `分词器`（tokenizer.json，约 2.1MB） | DeBERTa 的配套文本处理文件 | 与 DeBERTa 成对出现，缺一不可 |
| 语音模型 | `语音模型`（model.onnx 或 model.sbv2，约 249MB） | 决定"用谁的声音说话"，每个语音一个 | 可安装多个，不同角色用不同声音 |
| 语音模型 | `风格向量`（style_vectors.json，约 7.4KB） | ONNX 语音的配套风格文件 | 见下方说明 |

#### 关于风格向量

- 语音模型有两种格式：`ONNX（.onnx 文件）`和 `SBV2（.sbv2 单文件）`
- `.sbv2` 格式`已内嵌风格向量`，不需要额外文件
- `.onnx` 格式必须搭配同名的`style_vectors.json`，否则无法启用——应用里会标注「缺 style_vectors」，也可以手动补装（见第 4 章）

#### 安装位置

模型安装后存放在应用的数据目录下（Windows 上位于程序目录的 `data\models\tts-local` 文件夹内，Android 位于`/storage/emulated/0/Android/data/com.noiq.lingchat/files/models/tts-local`文件夹内），不需要手动管理，在设置页即可查看、删除。
- Android 端如需更改文件请使用`MT管理器`。

### 4. 模型导入（内置下载 / 外部导入）{#import-models}

打开路径：`主界面 → 设置 → 高级设置 → 本地 TTS`

#### 4.1 打开全局开关

进入「本地 TTS」页面后，先打开顶部的 `「全局本地 TTS」` 开关。开启后引擎开始加载，状态从「加载中」变为「已就绪」；若模型缺失则会停在「未就绪」并提示缺少 DeBERTa。

#### 4.2 内置下载（推荐，一键获取官方模型）

「模型下载」区域列出官方托管在 ModelScope 的全部文件，点击右侧「下载」按钮即可：

| 下载项 | 说明 | 大小 |
| --- | --- | --- |
| DeBERTa-v3-base (Japanese BERT) | 下载时自动附带分词器 | 约 278MB |
| Ling-v2 (Japanese) | 官方日语语音，下载时自动附带风格向量 | 约 249MB |

> 提示：页面顶部「DeBERTa 与分词器」和「人物语音」两个指示会同步更新，全部变成绿色就绪状态即可继续。

#### 4.3 外部导入（导入自己的模型）

如果你想用自己的模型（比如社区训练的音色），使用「本地导入」区域：

- `导入语音`：先填写「语音 ID」（可选，不填则根据文件名自动生成，只能使用英文字母、数字、`-` 和 `_` 符号），再选择语音文件。

支持的文件格式：原始 `.sbv2` / `.onnx` 文件，以及 `ZIP / 7z 压缩包`（压缩包内需包含模型文件）。

#### 4.4 补齐 style_vectors

导入的 ONNX 语音如果缺少风格向量，「补齐 style_vectors」区域会出现：选择需要补齐的语音，导入对应的 `style_vectors.json` 即可。`.sbv2` 格式语音不需要此步骤。

#### 4.5 管理已安装语音

「已安装语音」列表展示所有已安装的语音模型（显示格式、大小、风格向量状态），右侧垃圾桶按钮可删除语音。

#### 4.6 试听

「试听」区域可以先用一段文本 + 已安装语音试生成：输入文本、选择语音模型，调节`长度倍率`（语速）和`随机度`（SDP 噪声），点击「生成试听」播放。建议在配置角色之前先试听确认效果。试听需要引擎已就绪（DeBERTa 已加载）。

### 5. 推理硬件选择 {#hardware}

本地 TTS 使用 ONNX Runtime 进行推理，在「本地 TTS」页面可切换`推理设备`：

| 平台 | 可选项 | 说明 |
| --- | --- | --- |
| Windows | CPU / GPU（DirectML）/ 指定显卡 | 显卡下拉框自动枚举你电脑上的显卡型号 |
| Linux（x86_64） | CPU / GPU（WebGPU）/ 指定显卡 | 走 Vulkan，同样可枚举显卡 |
| **macOS** | ❌ 无选择项 | **暂不支持**手动选择，固定 CPU 推理 |
| **Android** | ❌ 无选择项 | **暂不支持**手动选择，固定 CPU 推理 |

- 有 NVIDIA / AMD / Intel 显卡的 Windows 用户建议选 GPU（DirectML），合成速度明显提升
- 切换后立即生效（引擎会按新设备重新加载，语音模型首次合成会稍慢）

### 6. 角色语音设置（让角色开口说话）{#role-voice}

模型装好之后，还需要告诉某个角色"用哪个声音说话"：

1. 打开 `设置 → 角色`，找到目标角色
2. 点击角色卡片右上角的`齿轮按钮`，打开「配置编辑」窗口
3. 切换到 `「语音设置」`
4. `TTS 类型`：选择 `「本地 SBV2 API」`
5. 按下表填写字段：

| 字段 | 说明 | 默认值 |
| --- | --- | --- |
| 语音语言 | 语音对应的语言（官方模型为日语，选 ja） | 按模型选择 |
| 本地语音 ID | 选择已安装的语音模型（下拉列表直接来自「已安装语音」） | 必填 |
| 说话人 ID | 多说话人模型中的角色编号 | 0 |
| 风格 ID | 语音风格编号 | 0 |
| 长度缩放 | 语速，越大越慢 | 1.0 |
| SDP 噪声比 | 声音随机度，越大越不稳定 | 0.0 |
| 本地 TTS 云端备用模型 | 全局本地 TTS 关闭时改用的云端模型（可留空） | 留空 |
| 本地 TTS 云端备用说话人 ID | 备用模型的说话人 ID（可留空） | 留空 |

6. `保存`，回到聊天界面后角色的语音立即生效（无需重启应用）

> 如果「本地语音 ID」下拉是空的，说明还没导入语音模型——回到第 4 章先装模型。
>
> 「本地 TTS 云端备用模型」是可选容错：当你把「全局本地 TTS」开关关掉后，配置了本地语音的角色会自动改用你填写的云端模型继续说话。
>
> 与其他类型的 TTS 一起使用：只需相应角色选择对应的 TTS 即可（不同角色可分别选不同引擎，内置与外部可共存）。

### 7. 常见问题（FAQ）{#faq}

Q：页面显示`「本地引擎：未就绪」`/ 红色警示`「缺少 DeBERTa 模型或分词器」`？

A：`DeBERTa` 与分词器未安装或只装了一半。到「模型下载」区域下载 `DeBERTa`（会自动附带分词器），或通过`「本地导入」`分别导入两个文件。

Q：试听失败，提示找不到语音 / `「voice not installed」`？

A：语音模型`未安装`或未安装成功。确认`「已安装语音」`列表里有模型，并核对`「人物语音」`计数 ≥1；外部导入时检查`语音 ID`是否为合法命名。

Q：已安装语音列表里显示`「缺 style_vectors」`？

A：该语音是`ONNX`格式但缺少 `style_vectors.json`。用`「补齐 style_vectors」`区域导入对应文件；或改用 `.sbv2` 格式的模型（内嵌风格向量，无需此文件）。

Q：下载失败（如 HTTP 403）？

A：模型托管服务拒绝请求或链接失效。稍后重试；若持续失败，可改用「本地导入」从其他渠道获取模型文件。

Q：角色聊天时没有声音？

A：按顺序检查：① 角色「配置编辑 → 语音设置」的 TTS 类型是否为「本地 SBV2 API」，且本地语音 ID 已选择；② 「全局本地 TTS」开关是否打开（关闭时走云端备用模型，需备用模型字段已填写）；③ 「本地引擎」状态是否为「已就绪」；④ 语音语言是否与模型匹配。

Q：合成报 `FP16 / Gelu` 相关错误？

A：当前 CPU/GPU 推理不支持某些 `FP16 算子`。使用官方下载的`模型（FP32）`即可，或切换推理设备为 CPU/GPU 后再试。

Q：`Android / macOS` 上为什么没有「推理设备」下拉框？

A：这两个平台暂不支持手动选择推理设备，固定使用 CPU，这是正常现象，不影响使用。

Q：为什么我的显卡无法使用硬件推理？

A：可能你的显卡不支持`DirectML`或者驱动版本过低。你可以尝试下载最新的显卡驱动或者采用 CPU 推理解决此问题。

Q：使用内置 TTS 时遇到 Bug，如何反馈？

A：可以在用户群咨询或 GitHub 上反馈：https://github.com/SlimeBoyOwO/LingChat/issues
反馈时请尽量附上：① 复现步骤；② 截图或录屏；③ 应用版本与系统平台（Windows / Android / macOS / Linux）；④ 「本地 TTS」页面的引擎状态（是否「已就绪」）；⑤ 报错信息。

## 其他类型 TTS 使用方法（外部引擎）

### 1. Style Bert Vits 2

1. 在上面的链接中，下载文件，里面有个`01启动 API 服务.bat`，双击运行即可。
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

由于本人用的不多，其他的语音引擎都是社区贡献的 PR，如果有需要，可以研究一下（本部分文档欢迎贡献）

## 模型下载和社区贡献

- 官方模型下载地址：https://www.modelscope.cn/organization/lingchat-research-studio
（我们未来会添加更多的人物语音）
- 模型训练教程：https://slimeboyowo.github.io/LingBlog/blog/projects/ling-chat/develop/Style-Bert-VITS2%E6%A8%A1%E5%9E%8B%E8%AE%AD%E7%BB%83%E6%95%99%E7%A8%8B
- 社区模型分享：https://github.com/SlimeBoyOwO/LingChat/discussions

将训练好的`safetensors模型和style_vectors.npy`转换为`ONNX模型和json格式的风格向量`或`sbv2模型`即可给内置 TTS 使用。