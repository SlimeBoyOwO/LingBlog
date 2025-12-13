# LingChat 后端代码结构

[[toc]]

## 1. 项目结构总览

### 1.1 语言和主要使用库

- 语言：Python 3.13
- 主要使用库：
  - FastAPI：用于构建 API
  - SQLite: 用于存储用户数据
  - OpenAI: 用于与 LLM 进行交互

### 1.2 文件结构

```
ling_chat
├── api
├── core
│   ├── ai_service
│   ├── emotion
│   ├── llm_providers
│   ├── messaging
│   ├── schemas
│   ├── TTS
│   ├── logger.py
│   ├── memory.py
│   ├── pic_analyzer.py
│   └── service_manager.py
├── data
├── database
├── static
├── third_party
├── update
├── utils
└── main.py
```

### 1.3 各模块的职责

- `api`: 负责处理前端请求，提供API接口。
- `core`: 核心模块，包含各种服务、模型、工具等。
- `data`: 动态生成的用户数据，用于存储用户信息，自定义角色等。
- `database`: 数据库相关代码，包括数据库模型、数据库操作等。
- `static`: 存储一些静态文件，如默认的背景图片，前端页面、图片等，用户第一次启动软件会复制static的data目录。
- `third_party`: 存放第三方模型等。
- `update`: 自动更新功能相关代码。
- `utils`: 工具模块，包含一些通用的工具函数。
- `main.py`: 程序入口，启动后端服务。

::: tip 核心模块

- `core`: **重要！**它是主要的逻辑处理模块，这里包含消息处理的流程、AI记忆存储、消息队列等核心功能。
- `service_manager.py`: **重要！**它是管理 AI 服务的主要单例模块。负责初始化、启动、停止 AI 服务。
- `api`: 他是前后端沟通的桥梁，消息从这里传入传出。包括获取后台静态文件（如图片等）逻辑也在这里。
- `database`: 这里的代码决定了如何持久化存储用户信息。
- `data, static, third_party`: 这三个对于开发者来讲无需在乎，就当做资源文件即可。

:::

## 2. 软件运行流程

### 2.1 核心初始化工作

#### 2.1.1 前后端通信初始化

1. 由`main.py`入口进入，首先初始化文件，检查data目录是否存在或缺少文件，如果缺少则从static目录复制。同时建立数据库连接，导入env配置文件（API Key信息等）。

2. 程序等待前端链接。前端会发起Websocket建立请求和http请求:

3. Websocket请求初始建立后，后端会给前端发送 `client_id`，用于唯一识别客户端。

4. http请求（`chat_info.py`, `/init`）用于初始化前端信息，如当前选择的角色信息等。**假如此时AI服务尚未初始化，则会先初始化一个AI服务`ai_service`**

5. **`ai_service`初始化完毕后，前端也接收到相应的信息**，前端会调用其他http请求，比如获取角色对话历史记录（TODO），角色立绘文件等来完整显示前端的内容。

#### 2.1.2 AI服务初始化

1. `service_manager`会调用`init_ai_service`函数，初始化一个`ai_service`对象并启动它。

2. `ai_service`初始化需要传参`settings`，其主要由`service_manager`从数据库中获取用户信息，如角色id，所存放的资源路径。然后使用该路径找到角色的`settings.txt`。

3. `ai_service`的构造函数会以`settings`参数初始化各个子模块，代码如下:

   ```python
   class AIService:
    def __init__(self, settings: dict[str, str]):

        """
        初始化AI助手实例

        参数:
            settings: 配置字典，包含各种设置项
        """
        self.memory = []  # 存储对话历史记录的列表
        self.user_id = "1"

        self.config = AIServiceConfig(clients=set(), user_id=self.user_id)

        self.use_rag = os.environ.get("USE_RAG", "False").lower() == "true"
        self.rag_manager = RAGManager() if self.use_rag else None
        self.llm_model = LLMManager()
        self.ai_logger = AILogger()
        self.voice_maker = VoiceMaker()
        self.translator = Translator(self.voice_maker)
        self.message_broker = message_broker
        self.message_processor = MessageProcessor(self.voice_maker)
        self.message_generator = MessageGenerator(self.config,
                                                  self.voice_maker,
                                                  self.message_processor,
                                                  self.translator,
                                                  self.llm_model,
                                                  self.rag_manager,
                                                  self.ai_logger)

        # self.events_scheduler.start_nodification_schedules()        # 之后会通过API设置和处理
        self.input_messages: list[str] = []

        # self.output_queue_name = self.client_id             # WebSocket输出队列
        self.client_tasks: Dict[str, asyncio.Task] = {}
        self.processing_task = asyncio.create_task(self._process_message_loop())
        self.global_task = asyncio.create_task(self._process_global_messages())

        self.events_scheduler = EventsScheduler(self.config)
        self.import_settings(settings)
        self.events_scheduler.start_nodification_schedules()        # TODO: 这个由前端开关控制

        self.scripts_manager = ScriptManager(self.config)

        self.reset_memory()
   ```

   - `RAGManager`: 负责处理RAG（永久记忆）逻辑。
   - `LLMManager`: 负责与LLM的交互逻辑，以env中配置初始化。
   - `AILogger`: 负责日志记录。
   - `VoiceMaker`: 负责与TTS（语言合成）的交互逻辑。
   - `MessageProcessor`: 负责对用户输入和LLM回复的消息后处理，如增加提示词信息，分割句子等。可以理解为一个简单的工具函数。
   - `MessageGenerator`: 负责核心句子处理和生成逻辑，包括情感识别，异步处理，消息队列等。
   - `EventsScheduler`: 负责日程功能，包括提醒，定时发送消息等。
   - `Translator`: 负责提供翻译功能。
   - `ScriptManager`: 负责剧本模式相关功能。

4. `ai_service`初始化私有成员，如`memory`记忆存储，和各种执行任务的`task`消息处理循环任务。
   - `clients`: 数组，用于记录所有链接到该`ai_service`的客户端。
   - `client_tasks`: 数组，存储来自客户端的所有正在处理的消息任务。
   - `processing_task`: 循环处理来自客户端的消息任务的任务。
   - `global_task`: 处理给所有客户端信息的任务。比如发送给所有客户端的消息任务。

### 2.2 消息信息流处理流程

1. 前后端的信息沟通主要由`Websocket通信`的方式完成。

2. 前端发送信息后，会由`api`模块中的`new_chat_main.py`负责接受并处理消息。主要是在`_handle_user_message`函数内处理，会将该客户端的消息入队。核心代码如下：

```python
asyncio.create_task(
    message_broker.enqueue_ai_message(client_id, user_message)
)
```

3. `message_borker`是作为消息的中转站，负责各个模块的消息沟通逻辑。核心代码如下：

```python
class MessageBroker:
    def __init__(self):
        self.queues: Dict[str, asyncio.Queue] = {}

    async def publish(self, client_id: str, message: dict):
        if client_id not in self.queues:
            self.queues[client_id] = asyncio.Queue()
        await self.queues[client_id].put(message)

    async def subscribe(self, client_id: str) -> AsyncGenerator[dict, None]:
        if client_id not in self.queues:
            self.queues[client_id] = asyncio.Queue()
        while True:
            yield await self.queues[client_id].get()
```

> `publish`函数则是将消息放入名为`client_id`的队列中，`subscribe`函数则是从对应`id`队列中取出消息。

4. `ai_service`会监听所有`clients`的消息队列。通过循环任务时刻从队列中取出消息处理。核心代码如下：

```python
async def _process_client_messages(self, client_id: str):
        """处理单个客户端的消息"""
        input_queue_name = f"ai_input_{client_id}"
        try:
            async for message in self.message_broker.subscribe(input_queue_name):
                try:
                    self.is_processing = True

                    user_message = message.get("content", "")
                    if user_message:
                        self.message_generator.memory_init(self.memory)

                        responses = []
                        async for response in self.message_generator.process_message_stream(user_message):
                            await message_broker.publish(client_id, response.model_dump())
                            responses.append(response)

                        logger.debug(f"消息处理完成，共生成 {len(responses)} 个响应片段")

                    self.is_processing = False

                except Exception as e:
                    logger.error(f"处理消息时发生错误: {e}")
                    self.is_processing = False
        except asyncio.CancelledError:
            logger.info(f"客户端 {client_id} 的消息处理任务已被取消")
        except Exception as e:
            logger.error(f"客户端 {client_id} 的消息处理发生严重错误: {e}")
            raise
```

1. 如代码所示，核心处理逻辑是在 `process_message_stream` 方法中，该方法会异步生成响应片段，并通过 `message_broker.publish` 方法将每个响应片段发送到消息队列中。

2. `new_chat_main.py`模块会监听发布消息队列，并通过websocket发送到客户端，核心代码：

```python
async def _send_messages(self, websocket: WebSocket, client_id: str):
    """从消息队列中获取并发送消息"""
    try:
        async for message in message_broker.subscribe(client_id):
            if message:
                logger.info(f"向客户端 {client_id} 发送消息: {message}")
                try:
                    await websocket.send_json(message)
                except (WebSocketDisconnect, RuntimeError):
                    break
                except Exception as e:
                    logger.error(f"发送消息失败: {e}")
                    break
    except Exception as e:
        logger.error(f"消息订阅异常: {e}")
```

## 3. 详细消息处理工作线

消息的整个处理流程，主要由`message_generator`中的`process_message_stream`函数完成。主要分为以下步骤：

### 3.1. 用户信息处理 + 上下文预处理

```python
rag_messages = []
# 1. 设置和预处理
current_context = self.memory.copy() if not memory else memory.copy()

if not memory:
    processed_user_message = self.message_processor.append_user_message(user_message)
    self.memory.append({"role": "user", "content": processed_user_message})
    current_context = self.memory.copy()
    if self.use_rag and self.rag_manager:
        self.rag_manager.rag_append_sys_message(current_context, rag_messages, processed_user_message)

    if logger.should_print_context():
        self.ai_logger.print_debug_message(current_context, rag_messages, self.memory)
```

1. `current_context`是当前上下文，用于存储对话历史。复制以确保RAG内容不会被反复添加。

2. `processed_user_message`是经过预处理后的用户消息。主要由`message_processor.append_user_message`完成。
   - 软件会增加一些系统提示在单次对话中，比如时间感知信息（告知时间），系统提示（提醒模型对话内容多样性）等。
   - 假如包含‘看桌面’等关键词，则会调用`pic_analyzer.py`感知屏幕信息，并添加到本次系统提示中。

3. 根据`use_rag`和`rag_manager`，决定是否将用户消息添加到RAG上下文中。RAG添加消息的逻辑由`rag_manager.rag_append_sys_message`完成。

### 3.2. LLM 流式生成与异步处理

::: warning 提醒
本部分涉及`异步编程`，务必理解Python的异步IO机制，使用了`生产者- 消费者模式`。本部分不会过于详细的讲解设计模式，详细可自行研究代码。
:::

#### 3.2.1. 核心组成部分

`message_system`:

- `message_generator`: 消息生成器，负责接收消息，处理句子，生成任务。
- `response_publisher`: 响应发布器，负责将处理好的消息返回响应。
- `sentence_comsumer`: 句子消费者，负责消费消息，包括分析情绪，翻译日文，生成语音，返回响应等。
- `stream_producer`: 流式生产者，负责调用LLM流式输出，分析响应片段凑成完整的句子，放入待处理任务队列中。

::: tip
核心在于`sentence_comsumer`，`stream_producer`负责拆分LLM句子，其他均可以理解为实现生产者消费者模式的工具类。
:::

#### 3.2.2. 句子消费者主要功能

核心代码：

```python
async def _process_sentence_and_prepare_response(self, sentence: str, user_message: str, is_final: bool) -> Optional[ReplyResponse]:
    """(Helper) Processes a single sentence and prepares the response dictionary."""
    # This logic is identical to your original helper method
    if not sentence:
        return None

    logger.info(f"Consumer {self.consumer_id} processing sentence: {sentence[:30]}...")
    sentence_segments:List[Dict] = self.message_processor.analyze_emotions(sentence)
    if not sentence_segments:
        logger.warning("AI response format error: No emotion or text found.")
        return None

    start_time = time.perf_counter()
    if sentence_segments[0].get("japanese_text") == "":
        await self.translator.translate_ai_response(sentence_segments)
    else:
        await self.voice_maker.generate_voice_files(sentence_segments)
    end_time = time.perf_counter()

    sentence_segments[0]['character'] = self.character

    # Assuming create_response is a method in the orchestrator or a utility class
    response = ResponseFactory.create_reply(sentence_segments[0], user_message, is_final)
    logger.debug(f"Sentence processed in {end_time - start_time:.2f} seconds.")
    return response
```

它主要完成了以下功能：

1. 使用`self.message_processor.analyze_emotions(sentence)`方法来分析输入的句子（切分情感，中日语，动作部分），并返回一个包含情感和文本信息的列表。

2. 假如对话信息有日语部分，则直接生成语音文件；否则，调用翻译器进行翻译。

3. `sentence_segments`在整个过程中会被更新，最后返回一个包含对话信息的字典（`ResponseFactory.create_reply()`）。其定义如下：

```python
class ReplyResponse(BaseResponse):      # setence_segments的内容
    type: str = ResponseType.AI_REPLY
    character: Optional[str] = None
    emotion: str
    originalTag: str
    message: str
    motionText: Optional[str] = None
    audioFile: Optional[str] = None
    originalMessage: str
```

#### 3.3.3. 返回回应并发布消息

```python
responses = []
async for response in self.message_generator.process_message_stream(user_message):
    await message_broker.publish(client_id, response.model_dump())
    responses.append(response)

logger.debug(f"消息处理完成，共生成 {len(responses)} 个响应片段")
```

在`ai_service/core`中，接收到的消息会通过message_broker发布，最终给 Websocket 部分处理并发送给对应客户端。

## 4. 后端通信 api 设计

该部分大多数是关于前端从后端获取静态文件，如图片、音频等，以及从后端获取对话信息。但也有前后端的核心交互部分，如图片列表，对话列表等功能，涉及与数据库交互部分内容。

### 4.1. 初次链接，初始化信息

该代码示范如何从后端通过GET请求获取基本信息等。

```python
router = APIRouter(prefix="/api/v1/chat/info", tags=["Chat Info"])


@router.get("/init")
async def init_web_infos(client_id:str ,user_id: int):
    ai_service = service_manager.ai_service
    try:
        # 假如说ai_service没有被初始化，那么就为它初始化
        if not ai_service:
            ai_service = service_manager.init_ai_service()

        await service_manager.add_client(client_id)

        result = {
            "ai_name": ai_service.ai_name,
            "ai_subtitle": ai_service.ai_subtitle,
            "user_name": ai_service.user_name,
            "user_subtitle": ai_service.user_subtitle,
            "character_id": ai_service.character_id,
            "thinking_message": ai_service.settings.get("thinking_message", "灵灵正在思考中..."),
            "scale": ai_service.settings.get("scale", 1.0),
            "offset": ai_service.settings.get("offset", 0),
            "bubble_top": ai_service.settings.get("bubble_top", 5),
            "bubble_left": ai_service.settings.get("bubble_left", 20)
        }
        return {
            "code": 200,
            "data": result
        }
    except Exception as e:
        print("出错了,")
        print(e)
        traceback.print_exc()  # 这会打印完整的错误堆栈到控制台
        return {
            "code": 500,
            "msg": "Failed to fetch user info",
            "error": str(e)
        }
```

- 这个函数会返回一个包含用户信息的字典，只要是通过获取ai_service的属性来构建的，而ai_service的属性则来自于选择的角色的`settings.txt`。
- 前端获取到这些信息后，就可以初始化角色的图片（包括位置偏移和大小设定），以及角色的名字和标题。

### 4.2. 获取列表信息

该代码示范如何通过编写函数实现GET请求获取列表信息的功能。

```python
@router.get("/list")
async def list_all_backgrounds():
    try:
        if not os.path.exists(BACKGROUND_DIR):
            return {"data": [], "message": "背景图片的目录没有找到"}

        background_files = []
        for f in BACKGROUND_DIR.iterdir():
            filename = f.name
            if f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.bmp'):
                file_path = BACKGROUND_DIR / filename
                stat = f.stat()

                title = f.stem  # 使用文件名作为标题

                background_files.append({
                    "title": title,
                    "url": filename,
                    "time": str(stat.st_mtime)
                })

        background_files.sort(key=lambda x: x["time"], reverse=True)

        if not background_files:
            return {"data": [], "message": "背景图片一个都没找到"}

        return {"data": background_files}

    except Exception as e:
        logger.error(f"获取背景列表失败: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "获取背景列表失败"})
```

- 从后端获取背景图片列表的API接口示范，其他获取静态资源列表的代码大差不差。

### 4.3. 涉及修改的POST请求

该代码示范如何通过POST请求向后端发起修改请求的功能。

```python
@router.post("/select_character")
async def select_character(
        user_id: int = Body(..., embed=True),
        character_id: int = Body(..., embed=True)
):
    try:
        # 1. 验证角色是否存在
        character = CharacterModel.get_character_by_id(character_id=character_id)
        if not character:
            raise HTTPException(status_code=404, detail="角色不存在")

        # 2. 切换AI服务角色
        character_settings = CharacterModel.get_character_settings_by_id(character_id=character_id)
        if character_settings is None: return HTTPException(status_code=500, detail="角色不存在")

        character_settings["character_id"] = character_id
        service_manager.ai_service.import_settings(settings=character_settings)
        service_manager.ai_service.reset_memory()

        # 2.5 更新用户的最后一次对话角色
        UserModel.update_user_character(
            user_id=user_id,
            character_id=character_id
        )

        # 3. 可以返回切换后的角色信息
        return {
            "success": True,
            "character": {
                "id": character.get("id"),
                "title": character.get("title")
            }
        }
    except Exception as e:
        logger.error(f"切换角色失败: {str(e)}")
        raise HTTPException(status_code=500, detail="切换角色失败")
```

- 有关修改部分，一般为文件上传（保存在本地文件）和修改数据库内容等操作，包括存档，更改角色等功能。
- 修改部分一般会用到数据库的相关操作函数，详情请阅读关于`数据库设计`的部分

## 5. 数据库设计

数据库的相关逻辑主要在`database`目录中。最终存储的`db`文件在`data`目录下。

- **数据库类型**: SQLite 3
- **存储位置**: `{user_data_path}/chat_system.db`
- **外键支持**: 已启用 (`PRAGMA foreign_keys = ON`)

### 5.1. 表设计

#### 1. users (用户表)

存储系统用户信息。

| 字段名              | 类型      | 约束                      | 说明                 |
| ------------------- | --------- | ------------------------- | -------------------- |
| id                  | INTEGER   | PRIMARY KEY AUTOINCREMENT | 用户唯一标识         |
| username            | TEXT      | UNIQUE NOT NULL           | 用户名（唯一）       |
| password            | TEXT      | NOT NULL                  | 用户密码             |
| last_chat_character | INTEGER   | DEFAULT 1                 | 上次聊天使用的角色ID |
| created_at          | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间             |

**外键约束**:

- `last_chat_character` 引用 `characters(id)`，删除时设置为默认值

#### 2. characters (角色表)

存储聊天角色配置。

| 字段名        | 类型    | 约束                                            | 说明         |
| ------------- | ------- | ----------------------------------------------- | ------------ |
| id            | INTEGER | PRIMARY KEY AUTOINCREMENT                       | 角色唯一标识 |
| title         | TEXT    | NOT NULL DEFAULT '默认'                         | 角色名称     |
| resource_path | TEXT    | NOT NULL DEFAULT 'game_data/characters/default' | 角色资源路径 |

#### 3. conversations (对话表)

存储用户的对话会话。

| 字段名          | 类型      | 约束                                | 说明           |
| --------------- | --------- | ----------------------------------- | -------------- |
| id              | INTEGER   | PRIMARY KEY AUTOINCREMENT           | 对话唯一标识   |
| title           | TEXT      | NOT NULL DEFAULT 'New Conversation' | 对话标题       |
| last_message_id | INTEGER   | -                                   | 最后一条消息ID |
| owned_user      | INTEGER   | NOT NULL                            | 所属用户ID     |
| character       | INTEGER   | -                                   | 使用的角色ID   |
| created_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP           | 创建时间       |
| updated_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP           | 最后更新时间   |

**外键约束**:

- `character` 引用 `characters(id)`，删除时级联
- `owned_user` 引用 `users(id)`，删除时级联
- `last_message_id` 引用 `messages(id)`，删除时设为NULL

#### 4. messages (消息表)

存储对话中的具体消息内容。

| 字段名             | 类型      | 约束                                                    | 说明         |
| ------------------ | --------- | ------------------------------------------------------- | ------------ |
| id                 | INTEGER   | PRIMARY KEY AUTOINCREMENT                               | 消息唯一标识 |
| role               | TEXT      | NOT NULL CHECK(role IN ('system', 'user', 'assistant')) | 消息角色     |
| content            | TEXT      | NOT NULL                                                | 消息内容     |
| owned_conversation | INTEGER   | NOT NULL                                                | 所属对话ID   |
| created_at         | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP                               | 创建时间     |

**枚举值**:

- `system`: 系统消息
- `user`: 用户消息
- `assistant`: 助手消息

**外键约束**:

- `owned_conversation` 引用 `conversations(id)`，删除时级联

#### 5. message_relations (消息关系表)

存储消息之间的父子关系，用于构建对话树。

| 字段名    | 类型    | 约束     | 说明     |
| --------- | ------- | -------- | -------- |
| parent_id | INTEGER | NOT NULL | 父消息ID |
| child_id  | INTEGER | NOT NULL | 子消息ID |

**复合主键**: `(parent_id, child_id)`

**外键约束**:

- `parent_id` 引用 `messages(id)`，删除时级联
- `child_id` 引用 `messages(id)`，删除时级联

### 5.2. 交互设计（如果需要操作数据库，查阅此处）

数据模型层提供了对用户、对话和角色的操作接口。所有方法都封装在静态类中，无需实例化。

#### 1. UserModel（用户模型）

1. `create_user(username, password)`

   创建新用户。

2. `get_user_by_id(user_id)`

   根据ID获取用户信息。

3. `update_user_character(user_id, character_id)`

   更新用户最后使用的角色ID。

---

#### 2. UserConversationModel（用户对话模型）

1. `get_user_conversations(user_id, page=1, page_size=10)`

   分页获取用户的所有对话。

---

#### 3. ConversationModel（对话模型）

1. `create_conversation(user_id, messages, character_id, title=None)`

   创建新对话并插入完整消息链。

2. `append_messages_to_conversation(conversation_id, messages)`

   向已有对话追加新消息。

3. `change_conversation_messages(conversation_id, messages)`

   完全替换对话中的消息。

4. `get_conversation_messages(conversation_id)`

   获取对话的完整消息链。

5. `update_conversation_title(conversation_id, title)`

   更新对话标题。

6. `get_conversation_character(conversation_id)`

   获取对话使用的角色ID。

7. `delete_conversation(conversation_id)`

   删除对话及其关联消息。

---

#### 4. CharacterModel（角色模型）

1. `create_character(title, resource_path)`

   创建新角色。

2. `get_character_by_id(character_id)`

   根据ID获取角色信息。

3. `get_character_settings_by_id(character_id)`

   获取角色的配置设置。

4. `get_all_characters()`

   获取所有角色信息。

5. `get_character_by_resource_path(resource_path)`

   根据资源路径获取角色信息。

6. `update_character_title(character_id, title)`

   更新角色标题。

7. `delete_character(character_id)`

   删除角色。

8. `sync_characters_from_game_data(game_data_path)`

   从游戏数据目录同步角色信息。

## 6. 剧本模式设计（0.4.0新版本内容）

::: danger 必要说明
剧本模式的设计非常复杂，涉及一整套Galgame的游戏系统，并且在其基础上我们还要进行ai的相关扩展。由于系统过于庞大，请到专门的文档中详细查看，这里仅做简要介绍。
:::

### 6.1 基本设计思想

本剧本模式旨在通过“剧本”的方式为ai的对话添加非玩家自主控制的事件。也就是在对话，不光光只有AI和玩家两者。而是添加NPC，旁白，等更多【非可控制因素】来影响对话。

在剧本模式的设计中，我们需要完成一个普通的galgame的所有要素，并且在此基础上加入ai的相关逻辑功能。剧本模式的核心设计思想如下：

- `事件驱动`：即无论是对话，切换背景或人物演出，还是任何其他操作，都是由`事件`驱动的。这是驱动整个剧本的最小单位。
- `上下文管理`：这是对剧本模式的核心存储逻辑。每一次事件造成的结果都会记录在`上下文`中，上下文包括`角色记忆`,`剧本变量`,`分支选择`等信息，通过保存上下文即可实现对整个剧本的存储。
- `章节跳转`：每一段对话都被设计为一个`章节`，章节之间可以通过`结束条件`跳转，并且每次章节结束都可以对`上下文`进行逻辑优化，比如记忆压缩或变量重置等。

### 6.2 剧本运作流程

#### 1. 剧本管理器核心代码逻辑

剧本模式的核心代码如下:

```python
class ScriptManager:
    def __init__(self, config:AIServiceConfig):
        # 全局设定，确定剧本状态
        self.config = config
        self.scripts_dir = user_data_path / "game_data" / "scripts"

        # 全部剧本管理
        self.all_scripts:list[str] = []
        self.get_all_scripts()

        self.current_script = None
        self.game_context: GameContext = GameContext()          # 创建一个空的上下文
        self.current_chartper:Charpter|None = None
        self.is_running = False

        # 记忆，状态管理
        if not self.all_scripts:
            logger.warning("剧本文件不存在，正在从static目录复制默认剧本...")
            self._copy_default_scripts()
            self.get_all_scripts()

        if not self.all_scripts:
            logger.error("没有可用的剧本文件")
            return

        self.current_script_name = self.all_scripts[0]          # 默认导入第一个剧本

        self.init_script()
```

#### 2. 剧本文件结构和内容

`ScriptManager`管理了剧本的导入、上下文存储、章节跳转等所有核心功能。一个剧本基本包含的文件如下:

```yaml
# script_config.yaml
script_name: 'A_Simple_Story'
intro_charpter: 'Intro/intro'
description: '这是一个简简单单的小剧本'

script_settings:
  user_name: '钦灵'
  user_subtitle: 'LingChat Studio'
```

- `script_name`是剧本的名称，用于识别。
- `intro_charpter`是剧本的入口章节。当剧本开始的时候，会以这一章节为起点。
- `description`是剧本的描述，用于展示。
- `script_settings`是剧本的设置，包括用户名信息以及其他。

其中，具体的章节文件的例子如下：

```yaml
# intro/intro.yaml
events:
  # 1. 背景设置事件
  - type: background
    imagePath: 'black_scene.png'
    duration: 2

  - type: music
    musicPath: '魁树下的猫.mp3'
    duration: 0

  - type: narration
    text: |
      2025年的10月31日...

  - type: background
    imagePath: '序章-放学后.png'
    duration: 1.5

  - type: narration
    text: |
      今天的天空格外清澈，钦灵难得准时放学。
      风雪的占卜摊今天却异常安静，没有往日的魔法光芒。

  - type: player
    text: 奇怪，小雪今天怎么这么安静...

  - type: modify_character
    action: show_character
    character: 风雪
    emotion: 正常
    duration: 1.5

  - type: narration
    text: |
      钦灵走近一看，发现风雪正专注地调配着一瓶闪着奇异蓝光的药剂。
      桌上散落着各种魔法材料和古籍。

  - type: dialogue
    character: 风雪
    text: |
      【厌恶】别打扰我，正在研究能提升智商的高级魔法药水。
      【自信】这可是连大魔导师都难以掌握的秘传配方。
      【鄙视】你这种愚蠢的笨蛋是不会懂的就是了。

  - type: player
    text: 提升智商？你不是已经很聪明了吗？

  - type: dialogue
    character: 风雪
    text: |
      【轻哼】学无止境懂不懂？

# 章节结束处理
end:
  type: linear
  next: 'end'
```

::: tip
有关type的具体定义和参数，请参考`ai_service/script_engine`内的`events`文件夹中。对每个事件都会选择不同的处理器处理。
:::

- `events`是具体的剧本事件，包括背景设置、音乐播放、旁白、角色展示、对话等。每个事件对应唯一的`type`名称，并包含可选或必填的相应参数。
- `end`是章节结束的处理，指定了章节的结束方式，如线性结束或跳转到其他章节。

> 如果想开发新的剧本功能，比如自定义CG展示，从原理来讲就是扩展`events`事件类型即可。对于开发者而言则是需要重点关注这个。
