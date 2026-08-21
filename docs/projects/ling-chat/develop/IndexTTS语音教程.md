---
title: IndexTTS 语音合成
description: 在 LingChat 中使用 IndexTTS-2.5 的教程（AMD 与非 AMD 显卡）
---

# IndexTTS 语音合成

## 前言

[IndexTTS](https://github.com/index-tts/index-tts) 是 B 站开源的零样本语音合成模型，最新的 **IndexTTS-2.5** 支持中文、英语、日语、西班牙语、阿拉伯语，只需要一段十几秒的参考音频即可克隆音色，并支持细粒度的情绪控制。

LingChat 通过内置的 `indextts2` HTTP 适配器对接一个本地运行的 IndexTTS 服务器（`127.0.0.1` 回环地址，不经过云端），对话时的情绪标签会自动映射为语音情绪。

根据你的显卡选择对应的安装方式：

| 你的显卡 | 安装方式 | 难度 |
| --- | --- | --- |
| AMD Radeon（Windows） | [一键安装器](#amd)（自动装 ROCm 运行时 + 模型 + 服务端） | ⭐ 简单 |
| NVIDIA / 其他 | [官方源码 + 服务端脚本](#non-amd) | ⭐⭐ 中等 |

## AMD 显卡（Windows） {#amd}

AMD 显卡使用社区维护的一键安装器：[LingChat-IndexTTS-AMD-Installer](https://github.com/sdfsfsk/LingChat-IndexTTS-AMD-Installer)

它会在 LingChat 目录下部署一套**自包含的独立服务器**：嵌入式 Python 3.10 + AMD ROCm 7.13 PyTorch + IndexTTS-2.5 官方权重 + 服务端脚本，已在 Radeon RX 9070 XT（RDNA4 / gfx1201）上验证。

### 安装步骤

1. 安装 LingChat（0.5.0 及以上）。
2. 下载安装器仓库（Code → Download ZIP，或 `git clone`）。
3. 双击 `完整安装-AMD.bat`，按提示选择 LingChat 的安装目录。
4. 等待下载完成：模型约 5.5 GB，运行时约 6 GB，请预留至少 25 GB 空间；下载中断后重新运行同一脚本即可断点续传。
5. 安装产物位于 `LingChat\bin\data\third_party\IndexTTS-AMD\`，双击其中的 `启动-IndexTTS-AMD.bat` 启动服务器。
6. 首次启动会自动下载辅助模型（BigVGAN、w2v-bert 等，约 2~3 GB），耐心等一次即可。

### 验证

浏览器打开 `http://127.0.0.1:9880/health`，返回 `status: ok` 即服务器就绪；响应还会列出当前模型版本、情绪模式与按 `id` 排序的音色文件。

### 其他说明

- 其他 AMD 架构（如 gfx110X）可在安装时传入对应的 AMD 官方 wheel 索引，详见安装器 README。
- 如需旧版 IndexTTS-2 回退：`仅下载模型.bat "LingChat目录" 2`，启动前 `set INDEXTTS_VERSION=2`。
- 更多选项（情绪模式、推理步数、显存精度）见[安装器仓库](https://github.com/sdfsfsk/LingChat-IndexTTS-AMD-Installer)的 README。

## 非 AMD 显卡（NVIDIA 等） {#non-amd}

非 AMD 显卡走[官方仓库](https://github.com/index-tts/index-tts)的标准安装流程：

### 1. 安装官方环境

```bash
git clone https://github.com/index-tts/index-tts.git
cd index-tts
uv sync   # 或按官方 README 使用其他包管理器
```

### 2. 下载 IndexTTS-2.5 模型

HuggingFace（国际网络）：

```bash
hf download IndexTeam/IndexTTS-2.5 --local-dir=checkpoints-2.5
```

ModelScope（国内网络）：

```bash
modelscope download --model IndexTeam/IndexTTS-2.5 --local_dir checkpoints-2.5
```

模型地址：[HuggingFace](https://huggingface.co/IndexTeam/IndexTTS-2.5) / [ModelScope](https://modelscope.cn/models/IndexTeam/IndexTTS-2.5)

### 3. 启动服务

- 只想本地体验：运行 `uv run webui.py --version 2.5 --model_dir checkpoints-2.5` 即可，与 LingChat 无关。
- 要对接 LingChat：从[安装器仓库](https://github.com/sdfsfsk/LingChat-IndexTTS-AMD-Installer)复制 `server/server_indextts.py` 到 index-tts 源码根目录。服务端会自动检测是否存在安装器的 AMD 性能补丁；未打补丁时使用 IndexTTS 官方默认推理参数，不影响基本合成。

```bash
uv pip install fastapi uvicorn soundfile
uv run python server_indextts.py
```

> 注：该服务端脚本与 AMD 安装器共用同一份代码，模型版本通过环境变量 `INDEXTTS_VERSION` 切换（默认 `2.5`），默认读取 `checkpoints-2.5` 并监听 `127.0.0.1:23987`，可用 `INDEXTTS_CHECKPOINTS` 与 `INDEXTTS_PORT` 覆盖。安装器的可调扩散步数、单 beam 和 BigVGAN FP16 属于可选性能补丁；非 AMD 路径目前未经广泛验证，遇到问题欢迎到仓库提 issue。

## 与 LingChat 对接（两种方式通用）

1. 打开 LingChat **全局设置**，确认 `tts.indextts_api_url` 为**包含路径的完整地址**：
   `http://127.0.0.1:9880/voice/indextts/presets`（端口与你的服务器一致，NVIDIA 路径默认是 `23987`）。
2. 打开 **设置 → 角色 → 语音设置**：
   - `TTS 类型`选择 `indextts2`
   - `语音语言`按内容选择：`zh` 中文 / `ja` 日语 / `en` 英语等（2.5 起支持多语言）
3. 把参考音频（wav/mp3/flac/ogg，建议 15 秒以内、干净单人说话）放进服务器的 `voices` 目录即成为音色预设，按文件名排序，序号即预设 `id`（从 0 开始）；在角色语音设置的 `IndexTTS 说话人 ID`（配置键 `voice_models.indextts_speaker_id`）中选择对应编号。
4. 保存后回到聊天界面，角色就会用克隆的音色说话了；对话情绪会自动映射到语音语气。

## 音色隐私与许可

请只使用你拥有授权的参考音频。IndexTTS 模型权重受 IndexTTS 独立模型协议约束，安装与使用即表示你同意其条款；详见各官方仓库的许可证文件。

## 链接汇总

- LingChat：<https://github.com/SlimeBoyOwO/LingChat>
- IndexTTS 官方仓库：<https://github.com/index-tts/index-tts>
- AMD 一键安装器：<https://github.com/sdfsfsk/LingChat-IndexTTS-AMD-Installer>
- IndexTTS-2.5 模型：[HuggingFace](https://huggingface.co/IndexTeam/IndexTTS-2.5) / [ModelScope](https://modelscope.cn/models/IndexTeam/IndexTTS-2.5)

