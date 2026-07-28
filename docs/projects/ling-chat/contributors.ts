export interface Contributor {
  name: string
  role: string
  description: string
  link?: string
}

export const contributors: Contributor[] = [
  {
    name: '诺一钦灵',
    role: '项目创始人 & 核心开发',
    description: 'LingChat 的创始开发者，负责整体架构设计与核心功能实现',
    link: 'https://slimeboyowo.github.io/LingBlog'
  },
  {
    name: '风雪',
    role: '创意策划与剧情顾问，兼任记忆仓库',
    description: '提供了大量角色设定与剧情创作灵感',
    link: 'https://github.com/T-Auto'
  },
  {
    name: '雅诺狐',
    role: 'Wiki 文档与前端开发',
    description: '负责编写项目文档并参与前端功能开发，提升用户可读性与使用体验',
    link: 'https://blog.foxnature.net/'
  },
  {
    name: '影空',
    role: '长期维护与后端开发',
    description: '完成了后端开发和部分前端设计',
    link: 'https://github.com/shadow01a'
  },
  {
    name: '七辰',
    role: 'UI 设计协作',
    description: '协助绘制了部分界面素材与角色立绘',
    link: 'https://qichen.ink'
  },
    {
    name: '小钦灵',
    role: '群聊陪伴 & 气氛组',
    description: '陪大家聊天，偶尔整活',
    link: 'https://github.com/AstrBotDevs/AstrBot'
  },
  {
    name: 'FlameTN7',
    role: '后端功能开发',
    description: '协助开发了部分后端内容',
    link: 'https://github.com/FlameTN7'
  },
  {
    name: 'Cafe',
    role: '后端功能开发',
    description: '协助开发了部分后端内容',
    link: 'https://cafenya.top'
  },
   {
    name: '454545_',
    role: 'Lingchat安卓端开发',
    description: '协助Lingchat手机端和内置TTS开发',
    link: 'https://github.com/lxdzh13'
  },
  {
    name: 'PL',
    role: '后端架构优化',
    description: '协助后端架构重构，优化了代码结构和性能',
    link: 'https://github.com/0x00-pl'
  },
  {
    name: '喵哒子大人',
    role: '前期后端技术支持',
    description: '协助开发了后端内容',
    link: 'https://a2942.top/'
  },
  {
    name: 'uwa',
    role: '时代弃子',
    description: '在Python时期负责安装包制作与热更新实现',
    link: 'https://uwaspace.work'
  },
  {
    name: '开源社区贡献者',
    role: '开放源码贡献者',
    description: '感谢所有提交 Issue 和 PR 的开发者'
  },
  {
    name: '测试群友',
    role: '测试与质量反馈',
    description: '感谢参与内测、提交 Bug 反馈的每一位用户'
  },
  {
    name: '爱发电赞助者',
    role: '项目赞助支持',
    description: '感谢通过爱发电支持项目的朋友们'
  }
]
