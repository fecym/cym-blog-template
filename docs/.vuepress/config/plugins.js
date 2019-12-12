module.exports = {
  plugins: [
    [
      '@vuepress/last-updated', {
        transformer: (timestamp) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          // moment.locale('zh-CN')
          return moment(timestamp).format('YYYY-MM-DD h:mm:ss a')
        }
      }
    ],
    // 如果你要配置 Vssue，请打开注释
    // [
    //   '@vssue/vuepress-plugin-vssue', {
    //     // 设置 `platform` 而不是 `api`
    //     platform: 'github',
    //     // locale: 'zh', // 语言设置
    //     // 其他的 Vssue 配置
    //     owner: 'xxxx', // github账户名称
    //     repo: 'xxxx', // Github博客仓库
    //     clientId: 'xxxx', // github上面申请的clientId
    //     clientSecret: 'xxxxxxxxxxxx', // github上面申请的clientSecret
    //   }
    // ],
    ['@vuepress/nprogress'],
    ['@vuepress/back-to-top'],
    ['@vuepress/medium-zoom', true],
    ['@vuepress/pwa', {
      serviceWorker: true,
      // popupComponent: 'MySWUpdatePopup',
      // updatePopup: true
      updatePopup: {
        message: "发现新内容可用",
        buttonText: "刷新"
      }
    }],
    // 如果你要配置 Google Analytics，请打开注释
    // ['@vuepress/google-analytics', {
    //   ga: 'xxxxxxxxxxxxxx'  // Google Analytics ID
    // }],
  ]
}