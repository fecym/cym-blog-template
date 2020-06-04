const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')

const productionGzipExtensions = ['js', 'css']
module.exports = {
  chainWebpack: (config, isServer) => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');

    if (config.mode === 'production') {
      config.optimization.minimize(true)
      config.optimization.runtimeChunk('single')
    }
  },
  configureWebpack: (config, isServer) => {
    if (config.mode === 'production') {
      // 打包生产.gz包
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].[hash].css',
          chunkFilename: 'assets/css/[id].[hash].css'
        })
      )
      config.plugins.push(
        new webpack.IgnorePlugin(/\.\/locale/, /moment/)
      )
    }
  }
}