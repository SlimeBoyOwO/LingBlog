# LingChat 主动对话系统设计

## 一、用户所能存储的信息

目前，用户所能存储的信息包括：

```python
from typing import Dict, List, Optional, Any

from pydantic import BaseModel

class ScheduleItem(BaseModel):
    name: str
    time: str
    content: str

class ScheduleGroup(BaseModel):
    title: str
    description: str
    items: List[ScheduleItem]

class TodoItem(BaseModel):
    id: int
    text: str
    priority: int
    completed: bool
    deadline: Optional[str] = None

class TodoGroup(BaseModel):
    title: str
    description: Optional[str] = None
    todos: List[TodoItem]

class ImportantDay(BaseModel):
    id: str
    date: str
    title: str
    desc: Optional[str] = ""
    cycle: Optional[str] = ""

class UserScheduleSettings(BaseModel):
    scheduleGroups: Optional[Dict[str, ScheduleGroup]] = None
    todoGroups: Optional[Dict[str, TodoGroup]] = None
    importantDays: Optional[List[ImportantDay]] = None

class ScheduleDataPayload(BaseModel):
    scheduleGroups: Optional[Dict[str, Any]] = None # 使用 Any 避免严格校验导致转换麻烦，或者定义严格的 Dict[str, ScheduleGroup]
    todoGroups: Optional[Dict[str, Any]] = None
    importantDays: Optional[List[ImportantDay]] = None
```

解释：

- ScheduleGroup 里包含多个 ScheduleItem，每个 ScheduleItem 包含 name、time 和 content。这些类似于闹铃，提示在特定时间内要AI执行什么样的提醒。
- TodoGroup 里包含多个 TodoItem，每个 TodoItem 包含 id、text、priority、completed 和 deadline。这些类似于待办事项，提示用户还需要完成的任务有哪些。
- ImportantDay 里包含 id、date、title、desc 和 cycle。这些类似于重要日期，提示用户在特定日期需要做什么。比如生日之类的。

此外，还有游戏状态的信息：

```python
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from ling_chat.core.ai_service.type import Player, GameRole, ScriptStatus
from ling_chat.core.ai_service.game_system.role_manager import GameRoleManager

from ling_chat.game_database.models import GameLine, LineBase

@dataclass
class GameStatus:
    """
    存储所有运行时共享的游戏状态。
    """
    player: Player = field(default_factory=Player)

    # 记录台词列表，用于记忆构建和历史记忆
    line_list: list[GameLine] = field(default_factory=list[GameLine])

    # 使用 RoleManager 管理所有角色
    role_manager: GameRoleManager = field(default_factory=GameRoleManager)
    # 记录当前对话角色，此角色将作为LLM传输入的对象，使用本角色的记忆
    current_character: Optional[GameRole] = None
    # 在场角色列表：只有在场的角色才能感知到台词
    present_roles: set[GameRole] = field(default_factory=set)
    # 游戏主角，也就是导入的游戏角色，剧本模式冒险的主角
    main_role: Optional[GameRole] = None

    # 背景信息
    background: str = field(default_factory=str)
    # BGM信息
    background_music: str = field(default_factory=str)
    # 背景特效
    background_effect: str = field(default_factory=str)
    # 全局变量信息
    global_variables: Dict[str, Any] = field(default_factory=dict)
    # 最后一次对话时间记录
    last_dialog_time: Optional[datetime] = None

    # 剧本模式中记录的额外信息
    script_status: Optional[ScriptStatus] = None

    # 当前激活的存档ID（用于 MemoryBank 持久化/载入/自动压缩）
    active_save_id: Optional[int] = None

    def add_line(self, line: LineBase):
        # 转换为GameLine
        game_line = GameLine(
            **line.model_dump(),
            perceived_role_ids=[role.role_id for role in self.present_roles if role.role_id is not None]  # 添加GameLine特有的属性
        )

        # TODO: 根据性能优化台词的更新频率，目前每条台词都更新
        self.line_list.append(game_line)
        self.refresh_memories()

    def refresh_memories(self):
        # 自动压缩只写入运行时缓存，不触发 DB
        self.role_manager.sync_memories(self.line_list)
```

## 二、主动对话所需要的设计

首先是关于 `Schedule` 的基础提醒。这些是用户指定了时间的提醒。程序需要做的很简单就是，在指定的时间点，通过 `schedule` 的 `content` 字段，来触发一个对话。

其次是关于 `Todo` 的基础提醒。当 AI 想要发起主动对话的时候，她可以通过查看随机几个 `Todo` 来决定是否需要提醒用户。如果用户有未完成的 `Todo`，那么 AI 就可以提醒用户。

最后是关于 `ImportantDay` 的基础提醒。这个主要用于第一天打开并对话的时候，再决定是否触发。如果提示过了则不再提示。

关于主动对话的频率和规则，我们设计如下：

### Part 1 随机对话：

1. 随机对话遵循一套规则，假如 `game_status` 中，`last_dialog_time`不是今天，则主动对话会优先先查看今天是否有 `ImportantDay`，作为主动对话的`prompt`。如果今天没有 `ImportantDay`，则进入随机主动对话模式选择，包含以下模式：
   1. `Todo`模式：随机选择 1-3 个 `Todo`，随机选择是通过判断`deadline`是否接近，重要性是否足够高决定的，作为主动对话的`prompt`。
   2. `场景对话`模式：可以用一个专门的辅助工作`LLM`，结合 AI 的上下文记忆，创造几个 AI 可以聊的话题，而不是瞎几把聊。作为提示词传入到`pending_topics`列表中。当 AI 主动聊天，可以从`pending_topics`中随机选择一个话题进行聊天。当`pending_topics`不足时，则重新生成补充。
   3. `屏幕观察`模式：调用视觉模型，将输出返回给ai，作为主动对话的`prompt`。
   4. `随机剧本`模式：从剧本库中随机选择一个剧本，并让程序运行这个剧本。本剧本必须信息是满足人物，并且属性为可以随机触发，并且通过`global_variables`确定没有执行过这个剧本才触发（和剧本模式融合，工作量较大，暂时不实现）。

2. 是否触发随机对话，可以通过一个`ai_interest`的概念，这是一个动态变化的值，范围为（0~100），由多方面因素决定（计算机视觉判断用户信息变化量是否够大，时间过去是否够久等）。现具体设定规则如下：
   1. `ai_interest`初始值为0，每过1mins，`ai_interest`+5~10。
   2. `ai_interest`也可以被其他因素影响。比如在计算机视觉任务中，通过哈希对比和OCR信息变化量识别。假如说超过阈值了，则`ai_interest`+5~10。
   3. 每过随机的`30s~2mins`，检测一次`ai_interest`，如果`ai_interest`>=50，则根据随机数公式，50的触发概率为0,100的触发概率为1，触发公式为：`proactive_talk = ( ai_interest - 50 ) / 50 > random.random()`。
   4. 触发主动对话后，`ai_interest`重置为0。
   5. 由于`ai_interest`会不断变化，所以主动对话的频率也会不断变化。程序允许用户最多进行N次主动对话，用户越不和AI聊天，`ai_interest`的`max`值就会降低，也就是触发主动对话的频率就会降低。每当`ai`进行一次自主对话，则降低`ai_interest`的`max`值`50/N`点，如果经过N次主动对话后，`ai_interest`的`max`值会降低到50以下，那么也意味着主动对话就会停止。以防止记忆污染和token浪费。
   6. 当然，如果用户主动对话了，`ai_interest`的`max`值也会直接恢复到100。

3. `工作/游戏/挂机`状态检测，用户并不希望自己在工作的时候还被打扰，如果是游戏的话用户反而会希望AI看到并参与。所以额外进行一下设计：
   1. `工作`状态：工作状态通过ARM检测，假如ARM高，且分布不是集中在 WASD，方向键，则判定为工作状态。工作状态下，`ai_interest`每次判定时会以减少25点的状态计算。
   2. `游戏`状态：游戏状态通过ARM检测，假如ARM高，且分布集中在 WASD，方向键，则判定为游戏状态。`ai_interest`每次判定时会以增加10点的状态计算。
   3. `挂机`状态：挂机状态通过ARM检测，假如ARM低，屏幕变化不大，则判定为挂机状态。
   4. 这些状态可以被传入到屏幕观察，场景对话中作为辅助LLM的prompt，也可以为以后未来的设计做扩展。

### Part 2 固定对话：

1. 假如到`Schedule`的提示时间了，则直接用`Schedule`的`content`作为主动对话的`prompt`即可。

## 三、现有 PoC 代码整合：

### 1. 哈希对比和OCR信息变化量识别

```python
import time
import winsound
import numpy as np
from mss import mss
from PIL import Image
import imagehash
import easyocr
import difflib

# --- 配置区域 ---
CHECK_INTERVAL = 1
HASH_THRESHOLD = 20
TEXT_SIM_THRESHOLD = 0.6

# 初始化 OCR
# 如果依然显示 CUDA not available，请看下方的“修复 GPU 步骤”
print("正在初始化 OCR 模型...")
reader = easyocr.Reader(['ch_sim', 'en'], gpu=True)

def get_text_similarity(str1, str2):
    if not str1 and not str2: return 1.0
    if not str1 or not str2: return 0.0
    return difflib.SequenceMatcher(None, str1, str2).ratio()

def monitor_smart_screen():
    with mss() as sct:
        prev_hash = None
        prev_text = ""

        print(f"智能监控启动... 视觉阈值:{HASH_THRESHOLD}, 文本相似度门槛:{TEXT_SIM_THRESHOLD}")

        while True:
            screenshot = sct.grab(sct.monitors[1])
            # 1. 转换为 PIL Image 计算哈希
            img = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
            curr_hash = imagehash.dhash(img)

            if prev_hash is not None:
                hash_diff = curr_hash - prev_hash

                timestamp = time.strftime("%H:%M:%S", time.localtime())

                if hash_diff >= HASH_THRESHOLD:
                    # --- 核心修复：转换为 Numpy 数组并进行简单的预处理 ---
                    # EasyOCR 喜欢 Numpy 格式 (OpenCV 风格)
                    img_np = np.array(img)

                    # 运行 OCR
                    # 图像优化：将图像尺寸缩小为一半以提高处理速度
                    height, width = img_np.shape[:2]
                    new_width = width // 2
                    new_height = height // 2
                    img_resized = np.array(Image.fromarray(img_np).resize((new_width, new_height), Image.LANCZOS))

                    # 运行 OCR
                    results = reader.readtext(img_resized, detail=0)
                    curr_text = " ".join(results).strip()

                    sim_score = get_text_similarity(prev_text, curr_text)


                    print(f"[{timestamp}] 视觉差异:{hash_diff} | 文本相似度:{sim_score:.2f}")

                    if sim_score < TEXT_SIM_THRESHOLD:
                        print(f"🔔 检测到关键变化！文本：{curr_text[:50]}")
                        winsound.Beep(1200, 600)
                        prev_text = curr_text
                else:
                    # 即使视觉差异小，为了保持文本对比的准确性，
                    print(f"[{timestamp}] 视觉差异:{hash_diff}")
                    # 也可以选择不更新 prev_text，让它保持为上一个“大变动”时的文本
                    pass

            prev_hash = curr_hash
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    try:
        monitor_smart_screen()
    except KeyboardInterrupt:
        print("\n监控已停止。")
```

### 2. APM 用户输入状态检测

```python
import time
import threading
import math
from collections import deque
from typing import Literal, Dict, Any

from pynput import keyboard, mouse

# 状态定义增加 BROWSING (浏览/轻度使用)
StateType = Literal["IDLE", "WORK", "GAME", "BROWSING"]

class UserActivityMonitor:
    def __init__(self,
                 window_seconds: int = 20,     # PoC改为20秒检测一次
                 idle_threshold: int = 5,      # 20秒内操作数少于5且鼠标不动 -> 挂机
                 game_key_ratio: float = 0.6,  # 游戏键占比阈值
                 high_click_rate: int = 30     # 20秒内点击超过30次 -> 可能是在打MOBA/FPS
                 ):
        self.window_seconds = window_seconds
        self.idle_threshold = idle_threshold
        self.game_key_ratio = game_key_ratio
        self.high_click_rate = high_click_rate

        # 事件队列：存储 (timestamp, type, value)
        # type: 'key', 'click'
        self.event_queue = deque()

        # 鼠标移动统计
        self.mouse_distance = 0.0
        self.last_mouse_pos = None

        self.lock = threading.Lock()
        self.running = False

        # 监听器
        self.keyboard_listener = None
        self.mouse_listener = None

        # 游戏键位定义 (WASD + 常用功能键)
        self.game_keys = {
            'w', 'a', 's', 'd',
            'up', 'down', 'left', 'right',
            'space', 'shift', 'ctrl_l', 'ctrl_r',
            '1', '2', '3', '4', 'q', 'e', 'r', 'f'
        }

    def start(self):
        self.running = True
        # 监听键盘
        self.keyboard_listener = keyboard.Listener(on_press=self._on_key_press)
        # 监听鼠标 (移动 + 点击)
        self.mouse_listener = mouse.Listener(
            on_click=self._on_click,
            on_move=self._on_move
        )

        self.keyboard_listener.start()
        self.mouse_listener.start()
        print(f">>> 行为监测已启动 (窗口: {self.window_seconds}s)")

    def stop(self):
        self.running = False
        if self.keyboard_listener: self.keyboard_listener.stop()
        if self.mouse_listener: self.mouse_listener.stop()

    def _on_key_press(self, key):
        if not self.running: return
        try:
            k_val = key.char.lower() if hasattr(key, 'char') and key.char else None
        except:
            k_val = None

        if k_val is None:
            k_val = str(key).replace('Key.', '')

        with self.lock:
            self.event_queue.append((time.time(), 'key', k_val))

    def _on_click(self, x, y, button, pressed):
        if not self.running or not pressed: return
        with self.lock:
            self.event_queue.append((time.time(), 'click', None))

    def _on_move(self, x, y):
        if not self.running: return
        with self.lock:
            if self.last_mouse_pos:
                # 使用曼哈顿距离 (abs(dx)+abs(dy)) 计算，比欧几里得距离更快，作为活跃度检测足够了
                dist = abs(x - self.last_mouse_pos[0]) + abs(y - self.last_mouse_pos[1])
                self.mouse_distance += dist
            self.last_mouse_pos = (x, y)

    def get_analysis(self) -> Dict[str, Any]:
        """每调用一次，清空一次累积的统计数据（针对PoC的轮询模式）"""
        current_time = time.time()

        with self.lock:
            # 1. 提取当前窗口内的事件
            # 注意：这里我们简单地把队列里所有旧的都当做“本次窗口外”的数据清洗掉
            # 实际上如果轮询间隔=窗口时间，直接清空队列也是可以的。
            # 这里为了严谨，还是保留一下时间过滤逻辑
            while self.event_queue and current_time - self.event_queue[0][0] > self.window_seconds:
                self.event_queue.popleft()

            events = list(self.event_queue)

            # 2. 获取并重置鼠标距离 (重置是为了下一个20s周期重新计算)
            total_mouse_dist = self.mouse_distance
            self.mouse_distance = 0.0

        # --- 统计分析 ---
        key_events = [e for e in events if e[1] == 'key']
        click_events = [e for e in events if e[1] == 'click']

        total_keys = len(key_events)
        total_clicks = len(click_events)
        total_actions = total_keys + total_clicks

        # 计算每分钟操作数 (APM)
        apm = total_actions * (60 / self.window_seconds)

        # 默认为空闲
        status = "IDLE"
        interest_mod = 0
        desc = "检测到极低活跃度"

        # 判定逻辑树

        # 1. IDLE 判定：不仅按键少，鼠标移动也要少
        # 20秒内移动小于500像素视作微小抖动
        if total_actions < self.idle_threshold and total_mouse_dist < 500:
            status = "IDLE"
            interest_mod = 0 # 挂机
            desc = "用户可能离开了，键鼠均无显著活动"

        # 2. BROWSING 判定：按键很少，但是鼠标在动/在点
        elif total_keys < 5 and (total_mouse_dist > 2000 or total_clicks > 2):
            status = "BROWSING"
            interest_mod = -5 # 浏览时轻微打扰是可以的，或者不增不减
            desc = "鼠标活跃但键盘安静，判定为浏览网页/阅读"

        else:
            # 3. GAME vs WORK 判定 (高活跃度)

            # 统计游戏键
            game_key_count = 0
            for _, _, k in key_events:
                if k in self.game_keys:
                    game_key_count += 1

            key_ratio = game_key_count / total_keys if total_keys > 0 else 0

            # 游戏判定：
            # A. 游戏键占比高 (WASD移动)
            # B. 或者是“鼠标流”游戏 (点击极其频繁，如MOBA/RTS)
            is_game = False
            if total_keys > 0 and key_ratio >= self.game_key_ratio:
                is_game = True
                desc = f"WASD键位密集 (占比{key_ratio:.1%})"
            elif total_clicks > self.high_click_rate:
                is_game = True
                desc = f"高频鼠标点击 (20s内{total_clicks}次)"

            if is_game:
                status = "GAME"
                interest_mod = 10
            else:
                status = "WORK"
                interest_mod = -25
                desc = "键盘输入分散且点击频率正常"

        return {
            "status": status,
            "apm": round(apm, 1),
            "mouse_dist_px": int(total_mouse_dist),
            "clicks": total_clicks,
            "interest_modifier": interest_mod,
            "desc": desc
        }

# --- PoC 运行部分 ---
if __name__ == "__main__":
    monitor = UserActivityMonitor(window_seconds=20)
    monitor.start()

    print(">>> 正在进行 20秒 的数据采集，请随意操作...")
    print(">>> (尝试：1. 不动 2. 只有鼠标乱晃 3. 疯狂点击 4. 打字)")

    try:
        while True:
            # 这里设置 sleep 20s，配合 monitor 的 window_seconds
            time.sleep(20)

            result = monitor.get_analysis()

            print("\n" + "="*40)
            print(f"[{time.strftime('%H:%M:%S')}] 周期报告")
            print(f"状态: 【{result['status']}】 (修正: {result['interest_modifier']})")
            print(f"数据: APM={result['apm']} | 鼠标里程={result['mouse_dist_px']}px | 点击={result['clicks']}")
            print(f"描述: {result['desc']}")
            print("="*40)

    except KeyboardInterrupt:
        monitor.stop()
        print("\n监测结束")
```

### 3. 现有程序对主动对话的相关代码

```python
import asyncio
import os
import json
from pathlib import Path
from typing import Dict

from ling_chat.core.ai_service.config import AIServiceConfig
from ling_chat.core.ai_service.game_system.game_status import GameStatus
from ling_chat.core.logger import logger
from ling_chat.core.messaging.broker import message_broker
from ling_chat.utils.function import Function
from ling_chat.utils.runtime_path import user_data_path

from ling_chat.schemas.schedule_settings import *

class ProactiveSystem:
    def __init__(self, config: AIServiceConfig, game_status: GameStatus):
        self.config = config
        self.schedule_tasks: list[ScheduleItem] = []
        self.user_schedule_settings: Optional[UserScheduleSettings] = None
        self.game_status = game_status

        # TODO 暂时用环境变量管理日程功能的启动，以后可以考虑更换（或者干脆别换了）
        # 检查环境变量是否启用日程功能
        self.enabled = os.getenv("ENABLE_SCHEDULE", "true").lower() == "true"
        if not self.enabled:
            logger.info("日程功能已通过环境变量禁用")

            return

        schedule_data_path = user_data_path / "game_data" / "schedules.json"

        self._read_schedule_data(schedule_data_path)

    def start_nodification_schedules(self):
        # 检查是否启用日程功能
        if not self.enabled:
            return
        self.proceed_next_nodification()
        logger.info("日程功能已经启动")

    def proceed_next_nodification(self):
        if hasattr(self, 'schedule_task') and self.schedule_task:
            self.schedule_task.cancel()
        self.schedule_task = asyncio.create_task(self.send_nodification_by_schedule())

    async def send_nodification_by_schedule(self):
        """定义好的函数，在特定时间发送提醒用户日程"""
        # 检查是否启用日程功能
        if not self.enabled:
            return

        for schedule in self.schedule_tasks:
            schedule_times:list = list(schedule.time)
            seconds:float = Function.calculate_time_to_next_reminder(schedule_times)
            logger.info("距离下一次提醒还有"+Function.format_seconds(seconds))
            next_time:str = Function.find_next_time(schedule_times)
            await asyncio.sleep(seconds)
            user_message:str = "{时间差不多到啦，" + self.game_status.player.user_name + "之前拜托你提醒他:\"" + schedule.content + "\"，和" + self.game_status.player.user_name + "主动搭话一下吧~}"
            await message_broker.enqueue_ai_message("global", user_message)

        for schedule_task in self.schedule_tasks:
            schedule_task.time

        self.proceed_next_nodification()

    async def cleanup(self):
        """简单的清理方法"""
        if hasattr(self, 'schedule_task') and self.schedule_task:
            self.schedule_task.cancel()

    def _read_schedule_data(self, schedule_data_path: Path):
        """从 JSON 文件中读取并解析日程数据"""
        try:
            # 检查文件是否存在
            if not schedule_data_path.exists():
                logger.warning(f"日程数据文件不存在: {schedule_data_path}")
                self.user_schedule_settings = UserScheduleSettings()
                return

            # 读取 JSON 文件
            with open(schedule_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 使用 Pydantic 模型解析数据
            self.user_schedule_settings = UserScheduleSettings(**data)

            # 更新 schedule_tasks 列表
            self.schedule_tasks = []
            if self.user_schedule_settings.scheduleGroups:
                for group_name, schedule_group in self.user_schedule_settings.scheduleGroups.items():
                    for item in schedule_group.items:
                        self.schedule_tasks.append(item)
                    logger.info(f"已加载日程组: {schedule_group.title}，包含 {len(schedule_group.items)} 个日程项")

            # 记录待办事项组和重要日期
            if self.user_schedule_settings.todoGroups:
                logger.info(f"已加载 {len(self.user_schedule_settings.todoGroups)} 个待办事项组")

            if self.user_schedule_settings.importantDays:
                logger.info(f"已加载 {len(self.user_schedule_settings.importantDays)} 个重要日期")

            logger.info(f"总共加载了 {len(self.schedule_tasks)} 个日程项")

        except json.JSONDecodeError as e:
            logger.error(f"解析日程数据 JSON 文件失败: {e}")
            self.user_schedule_settings = UserScheduleSettings()
        except Exception as e:
            logger.error(f"读取日程数据时发生错误: {e}")
            self.user_schedule_settings = UserScheduleSettings()
```

## 四、总结

请你根据以上信息，完成ProactiveSystem类的完整设计，包括但不限于以下内容：

- 代码逻辑解耦，将不同功能模块的代码分离到不同的类和方法中，模块化完整
- 代码可读性高，注释清晰，逻辑清晰，便于维护和扩展
- 尽可能完成以上的设计要求。
