/*
 * @Description: 
 * @Author: chengyuming
 * @Date: 2019-08-01 11:28:21
 * @LastEditors: chengyuming
 * @LastEditTime: 2019-10-07 17:41:41
 */
const { themeConfig } = require('./config/themeConfig')
const { plugins } = require('./config/plugins')
const { chainWebpack, configureWebpack } = require('./config/webpackConfig')
module.exports = {
  title: "chengyuming",
  description: 'Today, have you studied yet?',
  // 打包后的地址
  dest: './love',
  head: [
    // favicon图标
    ['link', { rel: 'icon', href: '/imgs/oops.png' }],
    // 给iOS添加到主屏的图标
    ['link', { rel: 'apple-touch-icon', href: '/imgs/iOS.jpg' }],
    // 是否兼容移动端
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  serviceWorker: true, // 是否开启 PWA
  themeConfig,
  markdown: {
    lineNumbers: true
  },
  plugins,
  chainWebpack,
  configureWebpack
}