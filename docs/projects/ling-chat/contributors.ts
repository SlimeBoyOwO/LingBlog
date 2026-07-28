export interface Contributor {
  name: string
  role: string
  description: string
  link?: string
}

export const contributors: Contributor[] = [
  {
    name: '诺一钦灵',
    role: '项目发起 & 核心开发',
    description: 'LingChat 的创始开发者，负责整体架构设计与核心功能实现',
    link: 'https://github.com/SlimeBoyOwO'
  },
  {
    name: '风雪',
    role: '创意顾问',
    description: '提供了大量角色设定与剧情创作灵感'
  },
  {
    name: '七辰',
    role: 'UI 设计支持',
    description: '协助绘制了部分界面素材与角色立绘'
    link: 'https://qichen.ink'
  },
  {
    name: '开源社区贡献者',
    role: '代码贡献',
    description: '感谢所有提交 Issue 和 PR 的开发者'
  },
  {
    name: '测试群友',
    role: '测试反馈',
    description: '感谢参与内测、提交 Bug 反馈的每一位用户'
  },
  {
    name: '爱发电赞助者',
    role: '资金支持',
    description: '感谢通过爱发电支持项目的朋友们'
  }
]
