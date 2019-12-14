module.exports = {
  plugins: [
    [
      '@vuepress/last-updated', {
        transformer: (timestamp) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          return moment(timestamp).format('YYYY-MM-DD h:mm:ss a')
        }
      }
    ],
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
  ]
}