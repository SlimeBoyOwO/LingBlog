---
title: 语音功能使用说明
description: 了解如何配置和使用LingChat的语音生成功能，包括多种语音合成方案。
---

#  🎙️ 语音功能使用说明

LingChat 适配了多种语音合成项目，您可以自己挑选合适的使用：

> [!IMPORTANT]
> 标注 `dev` 的语音项目表示该项目 **只存在于开发版，即暂未正式发布** ，标注 `all` 的语音项目表示该项目 **可用于旧版 LingChat**

> [!NOTE]
> 括号内为 LingChat 中对此语音项目的 **代号**。
> 代号前缀为 `sva` 的，说明该项目使用 [vits-simple-api](https://github.com/Artrajz/vits-simple-api)作为合成项目。此项目为一个大型整合项目，汇聚了多个语音项目，并提供统一的语音合成服务（人话：一次安装享受多个语音项目）

 - `all` [Vits (sva-vits)](#sva)：一个传统但是好用的语音项目
 - `all` [Style-Bert-Vits2 (sbv2)](#sbv2)：提供较高质量且快速的日语语音
 - [sbv2api (sbv2api)](#sbv2api)：sbv2的仅推理版本，如果不需要训练模型 **强烈推荐使用此项目代替sbv2** 
 - [Bert-Vits2 (sva-bv2)](#sva)：提供较高质量且快速的中文语音
 - `dev` [GPT-SoVITS (gsv)](#gsv)：高质量且可以不需要模型，只需一个角色的语音就可以合成音频，速度堪忧
 - `dev` [Index TTS (indextts)](#indextts)：提供最高质量且无需模型的语音合成，代价是对电脑要求很高

## VITS 和 bv2 {#sva}

### 简易安装

如果使用开发版，直接在 `main.py`后面 附加 `install sva` 即可安装

### 手动安装

- 若要使用 `Vits` 和 `bv2`语音功能，Windows 用户请下载链接程序[simple-vits-api](https://github.com/Artrajz/vits-simple-api/releases)，Linux 用户请见[官方文档](https://github.com/Artrajz/vits-simple-api/blob/main/README_zh.md)，安卓用户......别想了性能太差基本用不了。

- 该项目实现了基于 `Vits` 的简单语音合成 API。如果你是核显只能下载CPU版本。如果有独显建议下载 GPU 版本，速度快。

- 程序默认监听 23456 语音端口，程序默认导入的模型（vits）是 [ZcChat 地址](https://github.com/Zao-chen/ZcChat) -&gt; 讨论区 -&gt; 角色示范（丛雨）-&gt; [YuzuSoft_Vits.zip](https://github.com/Zao-chen/zao-chen.github.io/releases/download/%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD/YuzuSoft_Vits.zip)

- 模型下载好之后将压缩包 `YuzuSoft_Vits.zip` 解压到 simple-vits-api 的/data/models 目录下，再双击根目录下的 `start.bat` 启动就 ok 了

- 如果需要使用其他角色声线，请在 `ling_chat/data/game_data/characters/角色名/settings.txt` 中修改 `speaker_id` 这个属性（0~6可选）

> [!NOTE]
>
> 1. 视频演示中的灵灵，语音使用的是Style-Bert-Vits2，不过图方便也可以先用Simple-Vits-API，效果差不多。
> 2. 视频中的音理，请在Discussions区下载人物包，语音请使用Style-Bert-Vits2
> 3. 建议先使用Simple-Vits-API玩玩，国人开发下载方便，需要扩展再用Style-Bert-Vits2
> 4. 经过反映，如果你的电脑是核显或者太久以前的电脑，单个语音可能要一分钟才能生成，而GPU可以1秒内生成，而且会有大量报错可能，核显用户大可能只能放弃语音功能了（哭哭）（其实可以试试，现在应该只需5秒左右一句话）

## Style-Bert-Vits2 {#sbv2}

Style-Bert-Vits2 语音合成更好，还可以自定义训练，详见[Style-Bert-VITS2模型训练教程](../../develop/Style-Bert-VITS2模型训练教程.md)

### Windows

#### 简易安装

如果使用开发版，直接在 `main.py`后面 附加 `install sbv2` 即可安装

#### 手动安装

- 从下方相关链接中，下载Style-Bert-Vits2的 [Release](https://github.com/litagin02/Style-Bert-VITS2/releases) 的 **最新版本** ，解压

- 先决定这个软件（安装后12GB）的安装位置，然后启动里面的 `Install-Style-Bert-VITS2.bat` 文件（如果之后更改这个软件的位置会有Bug）

- 耐心等待很长时间后，这个软件会安装好。由于这个项目庞大，所以等待时间非常长

- 下载完毕后，在 `model_assests` 目录中，把下载好的Style-Bert-Vits2模型解压进去

- 打开程序的目录，里面有个 `server.bat` ，启动它即可使用

> [!TIP]
> 要是想使用这个功能，需要在 `game_data/characters/<角色名>/settings.txt` 中设定 `model_name` 的参数为导入的模型的名字
> 模型的名字可以通过启动`app.bat`中的人物列表中查看

### Linux

运行以下命令安装：

```bash
# 首先安装uv，已经安装请跳过
pip install uv

# 这里使用了 github 加速站
git clone --depth 1 https://ghfast.top/github.com/litagin02/Style-Bert-VITS2.git
cd Style-Bert-VITS2
uv venv
source .venv/bin/activate
uv pip install "torch<2.4" "torchaudio<2.4" --index-url https://download.pytorch.org/whl/cu118 #用于GPU合成，CPU请把后面的 cu118 换成 cpu
uv pip install -r requirements.txt
python initialize.py
```

下载完毕后，在 `model_assests` 目录中，把下载好的Style-Bert-Vits2模型解压进去

运行以下命令启动：

```bash
python server_fastapi.py
```

> [!TIP]
> 要是想使用这个功能，需要在 `game_data/characters/<角色名>/settings.txt` 中设定 `model_name` 的参数为导入的模型的名字
> 模型的名字可以通过启动`app.bat`中的人物列表中查看

## GPT-SoVITS {#gsv}

摸鱼中……

## sbv2api {#sbv2api}

摸鱼中……

## IndexTTS {#indextts}

摸鱼中……

