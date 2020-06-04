const { nav } = require('./nav')
module.exports = {
  themeConfig: {
    author: 'your-name',
    nav,
    // 不推荐使用这个
    // type: 'blog',
    sidebar: 'auto',
    sidebarDepth: 4,
    lastUpdated: '最后修改时间',

    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/fecym',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'Github',

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: 'xxxxxxxxx',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    // editLinks: true,
    // 默认为 "Edit this page"
    // editLinkText: '提出您宝贵的意见',
    // 博客设置
    blogConfig: {
      tag: {
        location: 2, // 在导航栏菜单中所占的位置，默认3
        text: '标签' // 默认 "标签"
      }
    },
    logo: '/imgs/head.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    sidebar: 'auto',
    // valineConfig 配置
    valineConfig: {
      // appId: 'xxxxxxxxxxxxxxxxxxxxx',// your appId
      // appKey: 'xxxxxxxxxxxxxxxxxxxxx', // your appKey
      verify: true,
      placeholder: '你想说点什么...',
      pageSize: 5,
      // 是否记录评论者IP
      recordIP: true
    },
    isComment: true,
    // 新增网站备案号，必填
    footerConf: {
      record: '京ICP备 xxxxxxxxxx 号',
      recordLink: 'http://beian.miit.gov.cn',
      leftText: 'MIT Licensed | Copyright © 2019 - present'
    }
  }
}