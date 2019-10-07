/*
 * @Description:
 * @Author: chengyuming
 * @Date: 2019-09-03 22:38:46
 * @LastEditors: chengyuming
 * @LastEditTime: 2019-09-04 10:36:59
 */
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  chainWebpack: (config, isServer) => {
    
  },
  configureWebpack: (config, isServer) => {
    // 打包生产.gz包
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }
}
