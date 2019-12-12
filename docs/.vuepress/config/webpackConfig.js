/*
 * @Description:
 * @Author: chengyuming
 * @Date: 2019-09-03 22:38:46
 * @LastEditors: chengyuming
 * @LastEditTime: 2019-11-11 23:36:01
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  chainWebpack: (config, isServer) => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        },
        gifsicle: {
          interlaced: false
        }
      })
      .end()
    if (!isServer && config.mode === 'production') {
      // 分割vendor
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 9,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            priority: 50
          },
          vueRouter: {
            name: 'vue-router',
            test: /[\\/]node_modules[\\/]vue-router[\\/]/,
            priority: 70
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss|styl$/,
            chunks: 'all',
            enforce: true
          }
        }
      })
    }
    config.optimization.minimize(true)
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
    }
    if (!isServer && config.mode === 'production') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerHost: 'localhost',
          analyzerPort: 8990,
          reportFilename: 'report-client.html'
        })
      )
    }
  }
}
