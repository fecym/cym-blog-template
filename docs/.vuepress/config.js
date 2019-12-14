/*
 * @Description: 
 * @Author: chengyuming
 * @Date: 2019-08-01 11:28:21
 * @LastEditors: chengyuming
 * @LastEditTime: 2019-11-13 21:33:23
 */
const { themeConfig } = require('./config/themeConfig')
const { plugins } = require('./config/plugins')
const { chainWebpack, configureWebpack } = require('./config/webpackConfig')
const head = require('./config/head')
const markdown = require('./config/markdown')
module.exports = {
  title: "My Blog",
  description: 'Today, have you studied yet?',
  // 打包后的文件夹
  dest: './love',
  head,
  theme: 'reco',
  serviceWorker: true, // 是否开启 PWA
  themeConfig,
  markdown,
  plugins,
  chainWebpack,
  configureWebpack,
  // 不太在意兼容性
  evergreen: true
}