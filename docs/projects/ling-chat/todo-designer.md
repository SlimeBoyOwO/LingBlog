---
title: 【已过时】日程设计器
description: 一份关于古早的日程设计器的文档
tags:
  - 主动对话
  - 过时
---

# 日程功能完善

## 一、需求分析

### 1.1 日程（或闹铃）功能，固定时间提醒

- 久坐提醒，设置例如每x分钟提醒一次，比如喝水，活动，休息等，控制工作时间。本部分不牵扯AI记忆。
- 日程记录，记录一天所需要做的事情TODO，比如学日语，写代码，画画等。这些可以以 `天，周，年` 为单位记录。当AI发起主动对话的时候，会以此为依据，根据时间和内容和已完成内容，给出提醒。
- 例如，假如我每天设定的日程是这样的，那么达到对应时间，就会触发主动提醒（txt演示，实际上需要更复杂的比如json）：

```
title = 每天の日常计划~
type = daily
character = 钦灵

content = """
12:00: "问候一下莱姆有没有起床，一直都是中午才起来的懒虫。"
14:00: "提醒莱姆午休差不多结束了，赶紧起床写代码啦！"
17:10: "莱姆工作很久啦，提醒他该吃晚饭了。"
19:20: "好啦，该提醒莱姆继续工作了哦，加油更新代码！"
21:20: "提醒一下莱姆这会可以找朋友一起玩游戏了哦。"
23:00: "提醒一下莱姆，他有个朋友叫老张要督促他学习准备12月的考试，不然就要抽死他"
00:00: "提醒一下莱姆，这个时候可以画画或者聊天了呢。"
02:00: "这时候是程序员该睡觉的时间啦，提醒莱姆去睡觉吧。"
"""
```

- 最后，每年的设定，可以作为优先级更高的提醒，作为新的一天第一次主动对话的话题等，因为这部分记忆应该是关于生日或重要日子，节日（可以通过系统直接调用获取）等方面。关于这个，全局只要设定一个就行了。

```
content = """
"11.09"： "今天是莱姆的生日"
"01.04"： "今天是Slary要过生日的日子"
"""
```

### 1.2 TODO 事项功能，作为AI主动对话的话题等。

- 和日程一样，可以通过添加一个列表主题，然后在内容中添加TODO事项，当AI发起主动对话的时候，会以此为依据，根据时间和内容和已完成内容，给出提醒。

```
title = LingChatのTODO事项~
type = todo
character = 钦灵

content = """
1： "今天要出门运动一下哦"
2： "今天记得Apex马上要更新了"
3： "今天可以画画"
4： "今天可以写代码"
5： "今天可以学习日语"
"""
```

- 每个TODO事项，拥有一个完成的状态或截止日期，重要性等。（所以要使用json存储）

## 二、系统设计

### 1.1 日程功能存储逻辑（初级，非数据库版本）

- 使用json存储，每个主题对应一个json文件，文件中存储主题的名称、类型、角色、内容等。
- 在此，我们定义每个主题列表为`ScheduleList`，每个日程为`Schedule`，`ScheduleList`拥有一下属性：

```yaml
title: string // 日程主题名称
type: string // 日程主题类型，如daily或以后的其他类型
character?: string // 日程主题角色（如果没有则全都提醒）
avalibaleWeeks?: int[] // 可选项，表示该日程主题在周的哪几天提醒，默认全部
scheduleList: Schedule[] // 主题对应的日程列表
```

- 对于每个`Schedule`，拥有以下属性：

```yaml
title: string // 日程名称
time: string // 日程时间
content: string // 日程内容
prompt?: string // 可选项，可以作为替代content的给ai更详细的提示词
```

- 特别的，对于年日历的设定，可以单独设定一个文件，存储在`schedule`文件夹下，文件名为`year.json`，属性如下：

```yaml
contents: Schedule[] // 年日历内容
```

这里的`Schedule`和上面的一样，但从一天的时间变成了日期（或日期+时间）。

### 1.2 TODO 事项功能存储逻辑（初级，非数据库版本）

- 使用json存储，每个主题对应一个json文件，文件中存储主题的名称、类型、角色（这里作为可选）、内容等。
- 在此，我们定义每个主题列表为`TodoList`，每个TODO事项为`Todo`，`TodoList`拥有一下属性：

```yaml
title: string // 待办事项主题名称
character?: string // 待办事项主题角色（可选）
todoList: Todo[] // 主题对应的日程列表
```

- 对于每个`Todo`，拥有以下属性：

```yaml
content: string // 待办事项内容
completed: boolean // 是否完成
deadline?: string // 可选项，表示该待办事项的截止日期
importance: int // 重要性，0-10，0表示不重要，10表示非常重要
```

## 额外、废弃思路

### 似乎不太需要的需求

- 然后，每周上的设定可以如下，每周的设定上，可以作为仅提醒AI一次的（新的一天第一次主动对话的话题）：
- 感觉这个不太需要，可以考虑最后再做，直接通过下面的年（可以通过月查看）来设定似乎更靠谱，一般人也不需要一周固定安排。

```
title = 每周の日常计划~
type = weekly
character = 钦灵

content = """
1： "今天要出门运动一下哦"
2： "今天记得Apex马上要更新了"
3： "今天可以去打羽毛球啦"
4： "明天可以睡大觉了"
```

## 三、前后端通信机制

### 1. 前端各组件信息存储机制

目前，前端先采用硬编码的形式，存储数据和展示数据内容如下：

```vue
// SchedulePage.vue
<template>
  <!-- 视图：日程主题列表 -->
  <div
    v-if="uiStore.scheduleView === 'schedule_groups'"
    class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6"
  >
    <div
      v-for="(group, id) in scheduleGroups"
      :key="id"
      @click="selectGroup(id)"
      class="group glass-effect p-6 rounded-3xl border border-brand shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
    >
      <div
        class="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-cyan-50 mb-4 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-colors"
      >
        <FolderKanban></FolderKanban>
      </div>
      <h3 class="font-bold text-lg text-brand">
        {{ group.title }}
      </h3>
      <p class="text-sm text-white mt-2 line-clamp-2">
        {{ group.description }}
      </p>
      <div
        class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-brand"
      >
        <span>{{ group.items.length }} 个日程</span>
        <ArrowRight :size="16" />
      </div>
    </div>
  </div>

  <!-- 视图：日程详情列表 -->
  <div v-if="uiStore.scheduleView === 'schedule_detail'" class="max-w-3xl mx-auto space-y-4">
    <div
      v-for="(item, idx) in activeGroup.items"
      :key="idx"
      class="glass-effect p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4"
    >
      <div class="bg-cyan-500 text-white px-3 py-1 rounded-lg text-xs font-bold self-center">
        {{ item.time }}
      </div>
      <div class="flex-1">
        <h4 class="font-bold text-brand text-lg">{{ item.name }}</h4>
        <p class="text-sm text-white mt-1">{{ item.content }}</p>
      </div>
      <button @click="removeScheduleItem(idx)" class="text-slate-300 hover:text-red-400 p-1">
        <Trash2 />
      </button>
    </div>
  </div>

  <!-- 引入通用模态框 -->
  <BaseModal
    :show="showModal"
    :title="modalTitle"
    @close="showModal = false"
    @confirm="confirmCreate"
  >
    <!-- 场景1：新建日程组 -->
    <template v-if="uiStore.scheduleView === 'schedule_groups'">
      <input
        v-model="formData.groupTitle"
        placeholder="主题名称"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      />
      <textarea
        v-model="formData.groupDesc"
        placeholder="描述..."
        rows="3"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none resize-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      ></textarea>
    </template>

    <!-- 场景2：新建日程项 -->
    <template v-else>
      <input
        v-model="formData.itemName"
        placeholder="活动名称"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      />
      <input
        v-model="formData.itemTime"
        type="time"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      />
      <textarea
        v-model="formData.itemContent"
        placeholder="指令详情..."
        rows="2"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none resize-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      ></textarea>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useUIStore } from '@/stores/modules/ui/ui'
import { ArrowRight, Trash2, FolderKanban } from 'lucide-vue-next'

import BaseModal from '@/components/ui/BaseModal.vue'

const uiStore = useUIStore()

// 数据存储
interface ScheduleItem {
  name: string
  time: string
  content: string
}

interface ScheduleGroup {
  title: string
  description: string
  items: ScheduleItem[]
}

const scheduleGroups = ref<Record<string, ScheduleGroup>>({
  g1: {
    title: '莱姆的日常生活',
    description: '涵盖了每日的起床、工作、休息提醒。',
    items: [
      { name: '早起问候', time: '12:00', content: '问候莱姆起床' },
      { name: '午休结束', time: '14:00', content: '提醒写代码' },
    ],
  },
  g2: {
    title: '期末复习周',
    description: '12月考试冲刺期间的特殊时间分配。',
    items: [],
  },
})

const activeGroup = computed(() => {
  if (!selectedGroupId.value) {
    return { items: [] }
  }
  return scheduleGroups.value[selectedGroupId.value] || { items: [] }
})

const removeScheduleItem = (idx: number) => {
  activeGroup.value.items.splice(idx, 1)
}

const selectedGroupId = ref<string | null>(null)

const selectGroup = (id: string) => {
  selectedGroupId.value = id
  uiStore.scheduleView = 'schedule_detail'
}

// 模态框状态
const showModal = ref(false)
const formData = reactive({
  groupTitle: '',
  groupDesc: '',
  itemName: '',
  itemTime: '',
  itemContent: '',
})

// 动态标题
const modalTitle = computed(() => {
  return uiStore.scheduleView === 'schedule_groups' ? '新建日程主题' : '新建具体日程'
})

// 父组件调用的方法
const handleCreate = () => {
  // 重置表单
  formData.groupTitle = ''
  formData.groupDesc = ''
  formData.itemName = ''
  formData.itemTime = ''
  formData.itemContent = ''

  showModal.value = true
}

// 确认创建逻辑
const confirmCreate = () => {
  if (uiStore.scheduleView === 'schedule_groups') {
    // 创建主题逻辑
    const newId = 'g' + Date.now()
    scheduleGroups.value[newId] = {
      title: formData.groupTitle,
      description: formData.groupDesc,
      items: [],
    }
  } else if (selectedGroupId.value) {
    // 创建日程项逻辑
    const group = scheduleGroups.value[selectedGroupId.value]
    if (group) {
      group.items.push({
        name: formData.itemName,
        time: formData.itemTime,
        content: formData.itemContent,
      })
    }
  }
  showModal.value = false
}

defineExpose({ handleCreate })
</script>
```

```vue
// TodoPage.vue
<template>
  <div v-if="uiStore.scheduleView === 'todo_groups'" class="space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="(group, id) in todoGroups"
        :key="'group-' + id"
        @click="selectTodoGroup(id)"
        class="glass-effect p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-cyan-200 cursor-pointer flex items-center justify-between group transition-all"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-cyan-50 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-all"
          >
            <Folder />
          </div>
          <div>
            <h4 class="font-bold text-brand">
              {{ group.title }}
            </h4>
            <p class="text-[10px] text-white uppercase font-bold">
              {{ group.todos.length }} 项任务
            </p>
          </div>
        </div>
        <ChevronRight class="text-slate-200 group-hover:text-cyan-500" />
      </div>
    </div>

    <!-- High Priority Global Tasks -->
    <div class="space-y-4">
      <h3 class="text-xs font-black text-slate-50 uppercase tracking-[0.2em] flex items-center">
        <Zap class="w-3 h-3 mr-2 text-amber-400" />
        全局进行中 (按优先级)
      </h3>
      <div
        v-if="globalPendingTodos.length === 0"
        class="text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm"
      >
        暂时没有进行中的任务
      </div>
      <div
        v-for="todo in globalPendingTodos"
        :key="'global-' + todo.id"
        class="glass-effect p-4 rounded-2xl border-l-4 border-l-cyan-500 shadow-sm flex items-center space-x-4"
      >
        <button
          @click.stop="completeTodo(todo)"
          class="w-6 h-6 border-2 border-cyan-100 rounded-lg hover:border-cyan-500 transition-all"
        ></button>

        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="text-[11px] bg-white/80 text-cyan-500 px-1.5 py-0.5 rounded font-bold">{{
              todo.groupTitle
            }}</span>
            <p class="font-bold text-cyan-50">{{ todo.text }}</p>
          </div>
          <div class="flex items-center mt-1">
            <Star
              v-for="s in 5"
              :key="'star-global-' + todo.id + '-' + s"
              :class="[
                'w-3 h-3',
                s <= todo.priority ? 'text-amber-400 fill-amber-400' : 'text-slate-100',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Global Completed History -->
    <div v-if="globalCompletedTodos.length > 0" class="space-y-3">
      <button
        @click="showCompleted = !showCompleted"
        class="flex items-center space-x-2 text-slate-400 hover:text-cyan-600 transition-colors px-1"
      >
        <component :is="showCompleted ? ChevronDown : ChevronRight" class="w-4 h-4" />
        <span class="text-[10px] font-black uppercase tracking-widest"
          >已完成历史 ({{ globalCompletedTodos.length }})</span
        >
      </button>
      <div v-if="showCompleted" class="space-y-2">
        <div
          v-for="todo in globalCompletedTodos"
          :key="'done-' + todo.id"
          class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4 opacity-50"
        >
          <CheckCircle class="text-cyan-500 w-5 h-5" />
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <span class="text-[9px] border border-slate-200 text-brand px-1.5 py-0.5 rounded">{{
                todo.groupTitle
              }}</span>
              <p class="text-gray-200 line-through text-sm">
                {{ todo.text }}
              </p>
            </div>
          </div>
          <button
            @click.stop="undoComplete(todo)"
            class="text-[10px] text-cyan-600 font-bold hover:underline"
          >
            撤回
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Todo Detail View -->
  <div v-if="uiStore.scheduleView === 'todo_detail'" class="max-w-2xl mx-auto space-y-4">
    <div v-if="activeTodoGroup.todos.length === 0" class="text-center py-20 text-slate-300">
      <Inbox class="w-10 h-10 mx-auto mb-4 opacity-20" />
      <p>还没有任务，点击右上角新建一个吧</p>
    </div>
    <div
      v-for="(todo, idx) in activeTodoGroup.todos"
      :key="'detail-todo-' + todo.id"
      class="glass-effect p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 transition-all"
      :class="todo.completed ? 'opacity-50' : ''"
    >
      <button
        @click.stop="todo.completed ? undoComplete(todo) : completeTodo(todo)"
        class="w-6 h-6 border-2 rounded-lg transition-all"
        :class="
          todo.completed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-100 hover:border-cyan-500'
        "
      >
        <Check v-if="todo.completed" class="text-white w-4 h-4" />
      </button>
      <div class="flex-1">
        <p :class="['font-medium text-white', todo.completed ? 'line-through ' : '']">
          {{ todo.text }}
        </p>
        <div class="flex items-center mt-1">
          <Star
            v-for="s in 5"
            :key="'star-detail-' + todo.id + '-' + s"
            :class="[
              'w-3 h-3',
              s <= todo.priority ? 'text-amber-400 fill-amber-400' : 'text-slate-100',
            ]"
          />
        </div>
      </div>
      <button @click.stop="removeItem(idx)" class="text-slate-200 hover:text-red-400 p-2">
        <Trash2 />
      </button>
    </div>
  </div>

  <BaseModal
    :show="showModal"
    :title="modalTitle"
    @close="showModal = false"
    @confirm="confirmCreate"
  >
    <!-- 场景1：新建待办分组 -->
    <template v-if="uiStore.scheduleView === 'todo_groups'">
      <input
        v-model="formData.groupTitle"
        placeholder="项目名称 (例如: 学校任务)"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      />
    </template>

    <!-- 场景2：新建具体任务 -->
    <template v-else>
      <input
        v-model="formData.todoText"
        placeholder="任务内容"
        class="w-full px-5 py-4 rounded-2xl border-none bg-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      />
      <div class="flex items-center space-x-3 p-2 bg-slate-50 rounded-2xl">
        <span class="text-xs font-bold text-slate-400 uppercase pl-2">优先级:</span>
        <button
          v-for="s in 5"
          :key="'prio-' + s"
          @click="formData.priority = s"
          class="focus:outline-none transform active:scale-125 transition-transform"
        >
          <Star
            :size="24"
            :class="[s <= formData.priority ? 'text-amber-400 fill-amber-400' : 'text-slate-200']"
          />
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useUIStore } from '@/stores/modules/ui/ui'
import {
  Trash2,
  Star,
  Folder,
  ChevronRight,
  Zap,
  CheckCircle,
  ChevronDown,
  Inbox,
  Check,
} from 'lucide-vue-next'

import BaseModal from '@/components/ui/BaseModal.vue'

const uiStore = useUIStore()

const showCompleted = ref(false)
const selectedTodoGroupId = ref<string | null>(null)

interface TodoItem {
  id: number
  text: string
  deadline?: string
  priority: number
  completed: boolean
}

interface TodoGroup {
  title: string
  description?: string
  todos: TodoItem[]
}

interface TodoItemWithGroup extends TodoItem {
  groupTitle: string
  gid: string
}

const todoGroups = ref<Record<string, TodoGroup>>({
  t1: {
    title: '绘图任务',
    todos: [
      {
        id: 101,
        text: '完成灵灵多立绘绘图',
        priority: 5,
        completed: true,
      },
      {
        id: 102,
        text: '记得找 LingChat 动画',
        priority: 4,
        completed: false,
      },
    ],
  },
  t2: {
    title: 'LingChat 0.4.0',
    todos: [
      {
        id: 201,
        text: '使用localStorage修复信息无法保存bug',
        priority: 5,
        completed: true,
      },
      {
        id: 202,
        text: '完成日程管理前端功能',
        priority: 5,
        completed: true,
      },
      {
        id: 203,
        text: '完成日程管理后端逻辑',
        priority: 5,
        completed: false,
      },
      {
        id: 204,
        text: '修复番茄钟显示 bug 问题',
        priority: 2,
        completed: false,
      },
      {
        id: 205,
        text: '切换角色服装有prompt提示功能',
        priority: 4,
        completed: false,
      },
      {
        id: 206,
        text: '测试新的永久记忆方案',
        priority: 1,
        completed: false,
      },
      {
        id: 207,
        text: '主动聊天功能实装',
        priority: 5,
        completed: false,
      },
      {
        id: 207,
        text: '重构数据库使其支持载入对话和多信息记录',
        priority: 5,
        completed: false,
      },
      {
        id: 207,
        text: '点击人物也可以进入下一段话',
        priority: 1,
        completed: false,
      },
      {
        id: 207,
        text: '剧本模式演示和基础功能实现',
        priority: 4,
        completed: false,
      },
      {
        id: 207,
        text: '开始启动界面实装',
        priority: 2,
        completed: false,
      },
      {
        id: 207,
        text: 'Credits页面实装？（可选）',
        priority: 1,
        completed: false,
      },
    ],
  },
})

const activeTodoGroup = computed(() => {
  if (!selectedTodoGroupId.value) {
    return { todos: [] }
  }
  return todoGroups.value[selectedTodoGroupId.value] || { todos: [] }
})

const globalPendingTodos = computed(() => {
  const list: TodoItemWithGroup[] = []
  Object.keys(todoGroups.value).forEach((gid) => {
    const group = todoGroups.value[gid]
    if (group) {
      group.todos.forEach((t) => {
        if (!t.completed)
          list.push({
            ...t,
            groupTitle: group.title,
            gid,
          })
      })
    }
  })
  return list.sort((a, b) => b.priority - a.priority)
})

const globalCompletedTodos = computed(() => {
  const list: TodoItemWithGroup[] = []
  Object.keys(todoGroups.value).forEach((gid) => {
    const group = todoGroups.value[gid]
    if (group) {
      group.todos.forEach((t) => {
        if (t.completed)
          list.push({
            ...t,
            groupTitle: group.title,
            gid,
          })
      })
    }
  })
  return list
})

const completeTodo = (todo: TodoItem) => {
  todo.completed = true
}
const undoComplete = (todo: TodoItem) => {
  todo.completed = false
}

const removeItem = (idx: number) => {
  activeTodoGroup.value.todos.splice(idx, 1)
}

const selectTodoGroup = (id: string) => {
  selectedTodoGroupId.value = id
  uiStore.scheduleView = 'todo_detail'
}
const showModal = ref(false)
const formData = reactive({
  groupTitle: '',
  todoText: '',
  priority: 1,
})

const modalTitle = computed(() => {
  return uiStore.scheduleView === 'todo_groups' ? '新建任务组' : '新建待办任务'
})

const handleCreate = () => {
  formData.groupTitle = ''
  formData.todoText = ''
  formData.priority = 1
  showModal.value = true
}

const confirmCreate = () => {
  if (uiStore.scheduleView === 'todo_groups') {
    // 新建组
    const newId = 't' + Date.now()
    todoGroups.value[newId] = {
      title: formData.groupTitle,
      todos: [],
    }
  } else {
    // 新建任务
    if (selectedTodoGroupId.value) {
      const group = todoGroups.value[selectedTodoGroupId.value]
      if (group) {
        group.todos.push({
          id: Date.now(),
          text: formData.todoText,
          priority: formData.priority,
          completed: false,
        })
      }
    }
  }
  showModal.value = false
}

defineExpose({ handleCreate })
</script>
```

```vue
// CalendarPage.vue
<template>
  <!-- Calendar View -->
  <div v-if="uiStore.scheduleView === 'calendar'" class="h-full flex items-center justify-center">
    <div
      class="w-2/3 glass-effect rounded-xl border border-cyan-500 shadow-sm overflow-hidden flex flex-col"
    >
      <div class="p-4 flex justify-between items-center border-b border-cyan-500">
        <div class="flex w-full justify-around items-center">
          <button
            @click="changeMonth(-1)"
            class="p-2 hover:bg-cyan-50 rounded-lg text-cyan-500 transition-all duration-300"
          >
            <ChevronLeft />
          </button>
          <h3 class="text-lg font-bold text-brand">
            {{ calendarYear }}年 {{ calendarMonth + 1 }}月
          </h3>
          <button
            @click="changeMonth(1)"
            class="p-2 hover:bg-cyan-50 rounded-lg text-cyan-500 transition-all duration-300"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <div
          class="calendar-grid border-b border-cyan-500 bg-slate-50/30 font-bold text-[10px] text-white text-center py-3 tracking-widest"
        >
          <div v-for="d in ['日', '一', '二', '三', '四', '五', '六']" :key="d">
            {{ d }}
          </div>
        </div>
        <div class="calendar-grid flex-1">
          <div
            v-for="(day, idx) in calendarDays"
            :key="'day-' + idx"
            @click="selectDate(day)"
            :class="[
              'day-cell p-2 border-r border-b border-cyan-500 transition-all cursor-pointer relative hover:bg-cyan-50/30',
              !day.currentMonth ? 'bg-slate-50/20 opacity-30' : '',
            ]"
          >
            <span
              :class="[
                'text-sm font-medium',
                day.today
                  ? 'w-7 h-7 bg-cyan-500 text-white rounded-full flex items-center justify-center'
                  : 'text-white',
              ]"
              >{{ day.date }}</span
            >
            <div class="mt-1 space-y-1">
              <div
                v-for="event in getEvents(day)"
                :key="'event-' + event.id"
                class="text-[9px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded truncate font-bold"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-full w-1/3 pl-4">
      <div
        class="glass-effect rounded-xl border border-cyan-500 shadow-sm p-4 h-full flex flex-col"
      >
        <h3 class="text-lg font-bold text-brand mb-4">重要日子</h3>

        <!-- 添加新事件按钮 -->
        <button
          @click="showAddEventModal = true"
          class="w-full bg-cyan-500 text-white rounded-lg py-2 px-4 mb-4 hover:bg-cyan-600 transition-all duration-300 flex items-center justify-center"
        >
          <span class="mr-2">+</span> 添加重要日子
        </button>

        <!-- 事件列表 -->
        <div class="flex-1 overflow-y-auto space-y-2">
          <div
            v-for="event in sortedEvents"
            :key="event.id"
            class="p-3 bg-slate-50/30 rounded-lg border border-cyan-500/30 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer"
            @click="selectEvent(event)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-brand">{{ event.title }}</h4>
                <p class="text-xs text-white mt-1">{{ formatDate(event.date) }}</p>
                <p v-if="event.desc" class="text-xs text-white mt-1">{{ event.desc }}</p>
              </div>
              <button
                @click.stop="deleteEvent(event.id)"
                class="text-red-500 hover:text-red-700 ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="sortedEvents.length === 0" class="text-center py-8 text-gray-500">
            暂无重要日子
          </div>
        </div>

        <!-- 添加事件模态框 -->
        <div
          v-if="showAddEventModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          @click.self="showAddEventModal = false"
        >
          <div class="glass-effect rounded-xl border border-cyan-500 shadow-sm p-6 w-96">
            <h3 class="text-lg font-bold text-brand mb-4">添加重要日子</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  v-model="newEvent.title"
                  type="text"
                  class="w-full px-3 py-2 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="输入标题"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  v-model="newEvent.date"
                  type="date"
                  class="w-full px-3 py-2 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">描述 (可选)</label>
                <textarea
                  v-model="newEvent.desc"
                  class="w-full px-3 py-2 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="3"
                  placeholder="输入描述"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">周期 (可选)</label>
                <select
                  v-model="newEvent.cycle"
                  class="w-full px-3 py-2 border border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">无</option>
                  <option value="yearly">每年</option>
                  <option value="monthly">每月</option>
                  <option value="weekly">每周</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end space-x-2 mt-6">
              <button
                @click="showAddEventModal = false"
                class="px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-all duration-300"
              >
                取消
              </button>
              <button
                @click="addEvent"
                class="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-300"
              >
                添加
              </button>
            </div>
          </div>
        </div>

        <!-- 事件详情模态框 -->
        <div
          v-if="selectedEvent"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          @click.self="selectedEvent = null"
        >
          <div class="glass-effect rounded-xl border border-cyan-500 shadow-sm p-6 w-96">
            <h3 class="text-lg font-bold text-brand mb-4">{{ selectedEvent.title }}</h3>

            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium text-gray-700">日期：</span>
                <span class="text-sm">{{ formatDate(selectedEvent.date) }}</span>
              </div>

              <div v-if="selectedEvent.desc">
                <span class="text-sm font-medium text-gray-700">描述：</span>
                <p class="text-sm mt-1">{{ selectedEvent.desc }}</p>
              </div>

              <div v-if="selectedEvent.cycle">
                <span class="text-sm font-medium text-gray-700">周期：</span>
                <span class="text-sm">{{ getCycleText(selectedEvent.cycle) }}</span>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button
                @click="selectedEvent = null"
                class="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/modules/ui/ui'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'

const uiStore = useUIStore()

// 数据存储
interface ImportantDay {
  id: string
  date: string
  title: string
  desc?: string
  cycle?: string // 日期周期
}
interface Day {
  date: number
  month: number
  year: number
  currentMonth: boolean
}

const importantDays = ref<ImportantDay[]>([{ id: 'e1', date: '2025-11-09', title: '莱姆生日' }])

// Calendar Logic
const calendarDate = ref(new Date())
const calendarYear = computed(() => calendarDate.value.getFullYear())
const calendarMonth = computed(() => calendarDate.value.getMonth())
const selectedDate = ref<Day | null>(null)

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)
  const prevLastDay = new Date(calendarYear.value, calendarMonth.value, 0).getDate()

  for (let i = firstDay.getDay(); i > 0; i--) {
    days.push({
      date: prevLastDay - i + 1,
      month: calendarMonth.value - 1,
      year: calendarYear.value,
      currentMonth: false,
    })
  }
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: i,
      month: calendarMonth.value,
      year: calendarYear.value,
      currentMonth: true,
      today:
        today.getDate() === i &&
        today.getMonth() === calendarMonth.value &&
        today.getFullYear() === calendarYear.value,
    })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      month: calendarMonth.value + 1,
      year: calendarYear.value,
      currentMonth: false,
    })
  }
  return days
})

const changeMonth = (offset: number) => {
  calendarDate.value = new Date(calendarYear.value, calendarMonth.value + offset, 1)
}
const selectDate = (day: Day) => {
  selectedDate.value = day
  // openModal()
}
const getEvents = (day: Day) => {
  const ds = `${day.year}-${String(day.month + 1).padStart(
    2,
    '0',
  )}-${String(day.date).padStart(2, '0')}`
  return importantDays.value.filter((e) => e.date === ds)
}

// 排序后的事件列表（按日期升序）
const sortedEvents = computed(() => {
  return [...importantDays.value].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取周期文本
const getCycleText = (cycle: string) => {
  const cycleMap: { [key: string]: string } = {
    yearly: '每年',
    monthly: '每月',
    weekly: '每周',
  }
  return cycleMap[cycle] || cycle
}

// 添加事件相关
const showAddEventModal = ref(false)
const selectedEvent = ref<ImportantDay | null>(null)
const newEvent = ref<ImportantDay>({
  id: '',
  date: '',
  title: '',
  desc: '',
  cycle: '',
})

// 添加事件
const addEvent = () => {
  if (!newEvent.value.title || !newEvent.value.date) return

  const id = Date.now().toString()
  importantDays.value.push({
    ...newEvent.value,
    id,
  })

  // 重置表单
  newEvent.value = {
    id: '',
    date: '',
    title: '',
    desc: '',
    cycle: '',
  }

  showAddEventModal.value = false
}

// 删除事件
const deleteEvent = (id: string) => {
  importantDays.value = importantDays.value.filter((e) => e.id !== id)
}

// 选择事件
const selectEvent = (event: ImportantDay) => {
  selectedEvent.value = event
}

const handleCreate = () => {
  // 直接复用你现有的逻辑：打开模态框
  showAddEventModal.value = true
}

// 2. 关键：使用 defineExpose 将该方法暴露给父组件
defineExpose({
  handleCreate,
})
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.day-cell {
  aspect-ratio: 1 / 1;
}
[v-cloak] {
  display: none;
}
</style>
```

这三个页面由一个中心组件vue管理，内容如下：

```vue
<template>
  <div
    class="w-full flex-1 glass-panel bg-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row"
    :class="containerClass"
  >
    <!-- 导航菜单 (左侧) -->
    <aside class="w-full md:w-64 p-6 flex flex-col border-r border-cyan-300">
      <div
        class="flex items-center space-x-3 text-base font-bold px-3.75 py-2.5 rounded-lg mb-8 text-brand inset_0_1px_1px_rgba(255,255,255,0.1)]"
      >
        <div
          class="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg"
        >
          <Sparkles :size="20" />
        </div>
        <h1 class="font-bold text-xl text-white tracking-tight">LingChat AI</h1>
      </div>

      <nav class="flex-1 space-y-2 w-full">
        <button
          class="w-full flex items-center space-x-6 px-5 py-3 no-underline rounded-lg text-white transition-colors duration-200 relative z-10 adv-nav-link hover:bg-gray-200 hover:text-black active:text-white active:font-bold"
          @click="changeView('schedule_groups')"
        >
          <Layers :size="18" />
          <span>日程主题</span>
        </button>
        <button
          class="w-full flex items-center space-x-6 px-5 py-3 no-underline rounded-lg text-white transition-colors duration-200 relative z-10 adv-nav-link hover:bg-gray-200 hover:text-black active:text-white active:font-bold"
          @click="changeView('todo_groups')"
        >
          <CheckCircle2 :size="18" />
          <span>待办事项</span>
        </button>
        <button
          class="w-full flex items-center space-x-6 px-5 py-3 no-underline rounded-lg text-white transition-colors duration-200 relative z-10 adv-nav-link hover:bg-gray-200 hover:text-black active:text-white active:font-bold"
          @click="changeView('calendar')"
        >
          <CalendarDays :size="18" />
          <span>重要日子</span>
        </button>
        <button
          class="w-full flex items-center space-x-6 px-5 py-3 no-underline rounded-lg text-white transition-colors duration-200 relative z-10 adv-nav-link hover:bg-gray-200 hover:text-black active:text-white active:font-bold"
        >
          <Cat :size="18" />
          <span>主动对话</span>
        </button>
      </nav>

      <div class="mt-auto mb-6 p-4 bg-cyan-50/10 rounded-2xl border border-cyan-500/20">
        <div class="flex items-center text-brand font-bold text-xs mb-2">
          <span class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse mr-2"></span>
          Ling Clock
        </div>
        <p class="text-xs text-white italic leading-relaxed">
          "在这里添加的信息屏幕后的那个ta也看得到哦！"
        </p>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden w-2xl">
      <header class="mt-2 p-6 flex justify-between items-center border-b border-cyan-300">
        <div class="flex items-center space-x-4 pl-4">
          <button
            v-show="uiStore.scheduleView === 'schedule_detail'"
            @click="uiStore.scheduleView = 'schedule_groups'"
            class="p-2 hover:bg-cyan-50 rounded-full text-cyan-600 transition-all"
          >
            <ChevronLeft />
          </button>
          <div>
            <h2 class="text-2xl font-bold text-brand mb-2">小灵闹钟</h2>
            <p class="text-xs text-white mt-0.5 tracking-wide">留下需要她提醒你的事情吧</p>
          </div>
        </div>

        <button
          @click="triggerCreate"
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus></Plus>
          <span class="font-medium">新建</span>
        </button>
      </header>

      <!-- 内容滚动容器 -->
      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <!--日程界面-->
        <SchedulePage ref="scheduleRef" />

        <!--待办事项界面-->
        <TodoPage ref="todoRef" />

        <!--日历页面-->
        <CalendarPage ref="calendarRef" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUIStore } from '@/stores/modules/ui/ui'
import TodoPage from '@/components/settings/pages/Schedule/TodoPage.vue'
import SchedulePage from '@/components/settings/pages/Schedule/SchedulePage.vue'
import CalendarPage from '@/components/settings/pages/Schedule/CalendarPage.vue'
import {
  Layers,
  CheckCircle2,
  CalendarDays,
  Plus,
  Cat,
  ChevronLeft,
  Sparkles,
} from 'lucide-vue-next'

type Variant = 'settings' | 'popup'

const props = withDefaults(
  defineProps<{
    variant?: Variant
  }>(),
  { variant: 'settings' },
)

const scheduleRef = ref()
const todoRef = ref()
const calendarRef = ref()

const uiStore = useUIStore()

const triggerCreate = () => {
  const currentView = uiStore.scheduleView

  // 这里的逻辑是：判断当前在哪个视图，就调用哪个组件内部的 handleCreate 方法
  if (currentView.startsWith('schedule')) {
    // 日程相关视图
    scheduleRef.value?.handleCreate()
  } else if (currentView.startsWith('todo')) {
    // 待办相关视图
    todoRef.value?.handleCreate()
  } else if (currentView === 'calendar') {
    // 日历视图
    calendarRef.value?.handleCreate()
  }
}

const changeView = (view: string) => {
  uiStore.scheduleView = view
}

const containerClass = computed(() => {
  // settings：沿用原来的全屏设置页布局
  if (props.variant === 'settings') {
    return 'h-[85vh] max-w-6xl md:w-[calc(100vw-4rem)]'
  }
  // popup：弹窗尺寸，不再全屏
  return 'h-[70vh] w-[820px] max-w-[90vw]'
})
</script>
```

也就是说，前端需要获取后端返回的关于待办事项的数据。

### 2. 后端需要完成的工作

后端需要提供接口，用于获取待办事项的数据。这个接口应该返回一个包含待办事项列表的 JSON 对象。

```python
# chat_schedule.py
import traceback

from fastapi import APIRouter

from ling_chat.core.service_manager import service_manager
from ling_chat.utils.runtime_path import user_data_path

router = APIRouter(prefix="/api/v1/chat/schedule", tags=["Chat Schedule"])


@router.get("/get_schedules")
async def get_schedules(client_id:str ,user_id: int):
    # TODO: 获取用户的日程记录相关内容。
    game_data_path = user_data_path / "game_data"
    schedules_path = game_data_path / "schedules.json"

    # 1. 返回 json 中的数据给前端

    pass
```

当然，也需要提供一个保存的接口。这个接口应该接受一个 JSON 对象，并将其保存到文件中。前端在改变数据后，就要即时调用这个接口，将最新的数据保存到文件中。
