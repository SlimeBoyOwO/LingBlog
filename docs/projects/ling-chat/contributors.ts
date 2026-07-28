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
    description: 'LingChat 的创始开发者，负责整体架构设计与核心功能实现。',
    link: 'https://github.com/SlimeBoyOwO'
  },
  {
    name: 'user1',
    role: 'test',
    description: '测试文本内容。'
  },
  {
    name: 'user2',
    role: 'test',
    description: '测试文本内容。'
  },
  {
    name: 'user3',
    role: 'test',
    description: '测试文本内容。'
  },
  {
    name: 'user4',
    role: 'test',
    description: '测试文本内容。'
  },
  {
    name: 'user5',
    role: 'test',
    description: '测试文本内容。'
  }
]
