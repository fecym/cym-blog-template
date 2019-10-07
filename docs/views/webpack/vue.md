---
title: vue 项目的配置 
date: 2019-06-13
tags:
- webpack
- vue
---

# vue 项目的配置

## 从 0 开始搭建 vue 项目

<!-- 第一行的东西会被作为标题来展示 -->

[webpack](empty)打包部署 js 项目从以下几个方面考虑：

- js 的处理：转换 ES6 代码，解决浏览器兼容问题
- css 的处理：编译 css，自动添加前缀，抽取 css 到独立文件
- html 的处理：复制并压缩 html 文件
- dist 的清理：打包前清理源目录文件
- assets 的处理：静态资源处理
- server 的启用：development 模式下启动服务器并实时刷新

## 一、项目结构

::: tip 项目结构
我们按照 vue-cli 的目录结构来新建一些目录，然后 webpack 做相应的配置，打开控制台
:::

```sh
  cd 切换到你要把项目新建到的地方
  # 新建项目目录
  mkdir webpack-pit && cd webpack-pit
  # 初始化项目
  npm init -y
  # 新建基本结构
  mkdir src public
  # 新建基本配置文件
  touch webpack.config.js babel.config.js postcss.config.js .gitignore
  # 打开src目录，新建main.js，作为项目的主入口
  cd src && touch main.js
  # src作为我们编写的主文件，模拟vue的项目目录新建以下文件及文件夹
  mkdir assets components styles views
  # 最终生成以下目录结构
  ├── public
  │   ├── favicon.ico
  │   └── index.html      # html 模板
  ├── src
  │   ├── assets          # 静态资源
  │   ├── views
  │   ├── components      # 组件
  │   │   └── App.vue
  │   ├── styles
  │   │   └── index.scss
  │   ├── main.js         # 入口文件
  │   └── App.vue
  ├── babel.config.js     # babel7配置文件
  ├── package-lock.json   # npm包锁
  ├── package.json        # 项目配置文件
  ├── postcss.config.js   # css配置文件
  └── webpack.config.js   # 项目打包机主文件
```

## 二、简单配置 webpack

::: tip 简单配置 webpack
简单配置下 webpack，先把项目跑起来，下载 webpack 依赖
:::

- 首先我们需要用到 webpack、webpack-cli、webpack-dev-server，那么我们执行以下命令

  - webpack 用来打包项目，webpack-dev-server 用来本地开发，webpack-cli 必不可少

  ```sh
    yarn add webpack webpack-cli webpack-dev-server --save-dev
  ```

- 我们要编译 html，需要用到 html-webpack-plugin 插件，每次打包我们需要在 build 之前先删除之前打包后的文件因为 hash 的存在会导致文件冲突，所以我们安装以下两个插件

  ```sh
    yarn add html-webpack-plugin html-loader clean-webpack-plugin --save-dev
  ```

- html-loader 是 babel 的一个 loader 用来编译 html
- clean-webpack-plugin 用来对打包之前的删除操作，因为新版本的原因，引入方式有点不一样

  ```javascript
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  ```

- webpack 处理 html、css、js，就会处理路径，我们会用到 path 模块，一般会写一个 resolve 方法来处理路径
  ```javascript
    yarn add path --save-dev
    const resolve = dir => path.join(__dirname, dir)
  ```
- webpack 必须配置的几项，entry、output
  - entry 顾名思义配置文件主入口的，他的配置方式多种多样，详细了解 webpack 的介绍 [传送门](/webpack/#一、-entry-入口配置)
  - 我们先简单的配置以下，使 js 和 html 耦合到一起，entry 我们选对象语法
  ```javascript
  entry: {
    app: resolve('./src/main.js')
  }
  ```
  - output 就是对象语法，必要的有两个配置项，path、filename 还有一个可有可无 publicPath 打包后静态资源文件夹的目录
  - path 是打包后的目录，若没有这个目录 webpack 会自己新建，filename 是打包后的文件名字，语法如下
  - hash 介绍看 webpack 的介绍 [传送门](/webpack/#四、hash、-chunkhash和contenthash有什么不同？)
  ```javascript
   output: {
     path: resolve('love'),
     filename: 'js/[name].[hash].js'
   }
  ```
  - 配置开发环境下的 node 服务器，devserver
  ```javascript
    devServer: {
      contentBase: resolve('public'), // 服务器根目录
      compress: true,                 // 开启gzip
      host: 'localhost',
      port: '8880',
      open: true,                     // 自动打开网站
      hot: true,                      // 开启热加载
      inline: true,                   // 热加载方式
      overlay: {
        warnings: true,
        errors: false
      }
    },
  ```
  - 配置 plugins，先介绍两个插件 html-webpack-plugin 和 clean-webpack-plugin，配置如下
  - HtmlWebpackPlugin 详细配置看这里 [传送门](https://github.com/jantimon/html-webpack-plugin)
  - CleanWebpackPlugin 详细配置看这里 [传送门](https://github.com/johnagan/clean-webpack-plugin)
  ```javascript{11}
    plugins: [
      new CleanWebpackPlugin(),
      // 处理html
      new HtmlWebpackPlugin({
        template: resolve('public/index.html'),  // 源模板文件，可以是ejs、pug等模板文件
        filename: 'index.html',                  // 输出的文件
        title: 'webpack构建项目',                 // html的title
        inject: true,                            // 是否动态注入
        hash: true,                              // 开启hash
        favicon: resolve('public/favicon.ico'),
        // 推荐你不要设置，有坑
        chunks: ['app'],                         // 注入的脚本，跟entry里面要对应上
        showErrors: true                         // 报错了是否展示
      })
  ```
  ::: danger 不推荐设置 chunks
  项目中之前设置了 chunks 打包后对应某个模块，但是我们用到了分离插件，导致分离后的东西，动态的我们不确定名字，导致不去加载那个文件，导致页面不渲染，这个属性不设置，也不会不错，他会动态的都给你加上去
  :::
- 最后我们修改下 package.json 的启动脚本，然后我们可以在 main.js 下写一些执行脚本，就可以看到效果了
- --mode development 设置 webpack 运行时的环境为 development，--progress 不用说了吧

```JSON
  "scripts": {
    "start": "webpack-dev-server --mode development --progress",
    "build": "webpack --mode production --progress"
  }
```

## 三、开始配置 vue

::: tip 配置 vue
配置 vue，需要下载 vue 核心的插件 vue-loader vue-template-compiler，以及我们将要用到的 sass 的配置
:::

```sh
  yarn add vue --save
  yarn add vue-loader vue-template-compiler --save-dev
```

- 配置 vue
  - vue 核心插件下载完之后在 vue-loader 下面的 lib 里面有他的插件配置，我们取出来就可以直接用
  ```javascript
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    ...省略上万行代码
    plugins: [ new VueLoaderPlugin() ]
  ```
  - 然后我们配置 module，配置 vue 文件怎么执行
  ```javascript
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
  ```
  - 然后我们在相应的地方写上我们改写的代码，此时就可以运行代码了
    - 在 public 下面的 index.html 里面写下
    ```html
    <div id="root"></div>
    ```
    - 在 main.js 里面引入 vue，并简单配置下 vue
    ```js
      import Vue form 'vue'
      import App from './App.vue'
      new Vue({
        render: h => h(App)
      }).$mount('#root')
    ```
    - 在 App.vue 里面写下
    ```html
    <template>
      <div id="root">
        hello world
        <router-view />
      </div>
    </template>
    <script>
      export default {
        name: 'app'
      }
    </script>
    ```
  - 此时 vue 最基本的功能就配置完成了
- 接下来我们配置 css 预编译 scss，还有 css 的兼容那个 postcss 自动填充浏览器前缀
  - css loader 介绍请看这里 [传送门](/webpack/#六、webpack处理css的一些介绍)
  - 首先需要几个插件 style-loader css-loader postcss-loader scss-loader
  - webpack 的模块的执行顺序是倒着来的，我们也要倒着来配置
  ```sh
    yarn add node-sass sass-loader postcss-loader style-loader css-loader --save-dev
    yarn add --dev autoprefixer
    # css loader配置
    {
      test: /\.(sa|sc|c)ss$/,
      loader: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }
  ```
  - postcss 是 css 后处理器 postcss.config.js 的配置如下
  ```javascript
  module.exports = {
    plugins: {
      autoprefixer: {}
    }
  }
  ```
- 可能会用到对一些文件的打包，比如说图片转 base64，解析字体，我们会用到 file-loader
  ```javascript
    yarn add file-loader --save-dev
    # 配置如下
    {
      test: /\.(png|svg|jpg|gif)$/,
      loader: 'file-loader',
      options: {
        limit: 5000,
        // 分离图片至imgs文件夹
        name: "imgs/[name].[ext]",
      }
    }
  ```
- 附上源码地址：[https://gitee.com/cym_git/webpack-pit.git](https://gitee.com/cym_git/webpack-pit.git) 请选择 basic 分支
- 基础篇完结

## 四、编译 js

::: tip 编译 js
忘了重要的一项，忘记了编译 js 了，我说怎么缺点什么呢
:::

- 编译 js 我选择了 env 插件，为什么？[传送门](https://zhuanlan.zhihu.com/p/29506685)
- 而且我试了用了 @babel/preset-es2015 但是还是一直报找不到这个模块
  <p align="center">
    <img :src="$withBase('/imgs/error-@babelpreset-es2015.png')" />
  </p>
- 最终选择了 @babel/preset-env 插件

```conf
  yarn add --save-dev @babel/core @babel/preset-env babel-loader
```

- babel-loader 默认下载就是 babel7 的插件，我们选择了 babel7 的插件，因为 babel 已经是最稳定的插件了
- 用了 babel7 之后 babel 配置文件是 babel.config.js 和.babelrc 都无所谓了，不过.babelrc 要求必须是严格的 JSON 语法
- 当我们配置了 babel.config.js 之后还是报了一个错
  <p align="center">
    <img :src="$withBase('/imgs/error-@babelpreset-env.png')" />
  </p>
- 那我们按照他的提示下载并且配置该插件就好

```conf
  yarn add @babel/plugin-syntax-dynamic-import
```

- 并附上 babel.config.js 的配置

```javascript
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-syntax-dynamic-import']
}
```

- 如果您喜欢用.babelrc 配置的话也是可以，下面是.babelrc 的配置

```JSON
  {
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
  }
```

- 编译 beble 的 loader 配置如下，我们只编译 src 目录下的文件，减少文件搜索范围

```javascript
  {
    test: /\.js$/,
    loader: 'babel-loader',
    include: [
      resolve('src'),
      resolve('node_modules/webpack-dev-server/client')
    ]
  },
```

## 五、项目优化

### 分离 css

- 插件是 mini-css-extract-plugin，该插件必须是 webpack4.0 以上才支持

```conf
  # 下载插件
  yarn add mini-css-extract-plugin
```

- 插件介绍：
  - 在 plugins 数组中直接 new MiniCSSExtractPlugin 就可以，它接受一个 options 作为一个参数
  - filename 和 chunkFilename，这两项都是可选的，类似于 webpackOptions.output
  - 简单配置如下 [传送门](https://webpack.js.org/plugins/mini-css-extract-plugin/)
  ```javascript
  new MiniCssExtractPlugin({
    filename: 'css/[name].[hash].css',
    chunkFilename: 'css/[id].[hash].css'
  })
  ```
  - 配置完后，需要修改 module 里面配置 css 的参数，修改为以下配置
  ```javascript
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // publicPath: '../',
            reloadAll: true
          }
        },
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    },
  ```

### 分离不常变化的文件

- node_modules 下面的模块，引用别人的库，我们是不需要编译，所以我们把它们分离出来，这是我们需要配置 optimization 配置项
- 这么配置以下，会看到项目下面会打包出一个 vendor.js 文件
- 具体配置参照 [传送门](https://imweb.io/topic/5b66dd601402769b60847149)

```javascript
optimization: {
  // 分离chunks
  splitChunks: isProduction
    ? {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          }
        }
      }
    : undefined
}
```

- 如果项目使用包模块多的话，我们可以把大点的包都分离出来，cacheGroup 就是配置的关键，可以卓个分离分离
- 比如说你想把 vue、vue-router 分离出来，或者你用了 element、echarts 因为打包后单个包太大，你想要分割代码，那就配置 cacheGroup
- 它是 webpack 自带的插件，不需要引入直接就可以用，简单配置如下

```JavaScript
  {
    chunks: 'all',
    cacheGroups: {
      libs: {
        name: 'chunk-libs',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        chunks: 'initial' // 只打包初始时依赖的第三方
      },
      vue: {
        name: 'vue',
        test: /[\\/]node_modules[\\/]vue[\\/]/,
        priority: 11,
      },
      // 单独分离vue-router
      // vueRouter: {
      //   name: 'vue-router',
      //   test: /[\\/]node_modules[\\/]vue-router[\\/]/,
      //   priority: 12,
      // }
    }
  }
```

### 压缩 js 和压缩 css

- 需要两个插件 optimize-css-assets-webpack-plugin 和 uglifyjs-webpack-plugin

```conf
  yarn add --save-dev uglifyjs-webpack-plugin
  yarn add optimize-css-assets-webpack-plugin
```

- 压缩文件出现的情况下都在生产环境下，开发环境是不需要的，所以我们可以下判断
- OptimizeCSSAssetsWebpackPlugin 插件基本不需要配置，直接实例化传入一个空的 options 就可以
- UgligyjsWebpackPlugin 有个坑，配置完毕后，项目打包报错了
  <p align="center">
    <img :src="$withBase('/imgs/error-uglifyjs.png')" />
  </p>
  - 他的意思说配置warnings配置出错，看下之前的配置
  ```JavaScript
    minimizer: isProduction
      ? [
          new UgligyjsWebpackPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
              },
              cache: true, // 开启缓存
              parallel: true, // 平行压缩
              sourceMap: false
            }
          }),
          new OptimizeCSSAssetsWebpackPlugin({})
        ]
      : []
  ```
  - 查找原因说插件升级造成的，配置应该给提出来 [传送门](https://stackoverflow.com/questions/55989693/warnings-is-not-a-supported-option-error-from-uglifyjs/55998303#55998303)
  - 那么我们修改为以下配置，此时不再报错
  ```JavaScript
    minimizer: isProduction
      ? [
          new UgligyjsWebpackPlugin({
            uglifyOptions: {
              compress: {
                drop_debugger: true,
                drop_console: true,
              },
              warnings: false,
              cache: true, // 开启缓存
              parallel: true, // 平行压缩
              sourceMap: false
            }
          }),
          new OptimizeCSSAssetsWebpackPlugin({})
        ]
      : []
  ```

### 去除无用的 css

- 需要用到两个插件 PurgecssPlugin 和 glob

```sh
  yarn add glob-all --save-dev
  yarn add purgecss-webpack-plugin -D
```

- 简单配置如下

```javascript
  new PurgecssPlugin({
    paths: glob.sync([
      path.join(__dirname, './src/index.html'),
      path.join(__dirname, './**/*.vue'),
      path.join(__dirname, './src/**/*.js')
    ])
  }),
```

### 开启 gzip

- 需要用到插件 CompressionWebpackPlugin

```sh
  yarn add -D compression-webpack-plugin
```

- 简单配置入下，这样配置下打包后项目就会生成 gz 压缩包

```javascript
  new CompressionWebpackPlugin({
    algorithm: 'gzip',
    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
    threshold: 10240,
    minRatio: 0.8
  }),
```

### 显示打包进度和打包时间

- 需要用到两个插件 progress-bar-webpack-plugin chalk
- [ProgressBarPlugin](https://www.npmjs.com/package/progress-bar-webpack-plugin) 是用来配置进度条的，[chalk](https://www.npmjs.com/package/chalk) 是用来定义展示的颜色的

```js
  // 打包时间
  new ProgressBarPlugin({
    format: '  编译进度：[:bar] ' + chalk.green.bold(':percent') + ' (已用时 :elapsed 秒)',
    clear: false
  }),
```

### 友好的错误提示

- 在 webpack 中编译过程中终端会输出很多信息的，看着很别扭，此时可以用到一个插件来很友好的显示
- 在开发环境下展示的 log 我们完全可以把 **devServer.quiet** 设置为 **true**，此时整个世界都安静了
- 模拟 vue-cli 中编译过程中输出的信息，我们用到 friendly-errors-webpack-plugin 插件
- 经测试，貌似只对开发环境管用，那么我们就模拟下 vue-cli 的展示
- 在 plugins 添加一下代码 [传送门](https://blog.csdn.net/kai_vin/article/details/89025966)

```js
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [`
        App running at:
        - Local:   ${chalk.hex('#66D9EF')('http://localhost:' + PORT)}
        - Network: ${chalk.hex('#66D9EF')('http://' + networkIp + ':' + PORT)}
      `],
      clearConsole: true,
      onErrors: (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()
        notifier.notify({
          title: packageConfig.name,
          message: severity + ': ' + error.name,
          subtitle: filename || '',
          // icon: path.join(__dirname, 'logo.png')
        })
      }
    }
  }),
```

- networkIp 是我们自己编写的一个利用 os 模块获取本机 ip 的方法，具体实现如下
- 获取 networkInterfaces 对象，里面有 ip 的各种格式，筛选出我们要的那个就可以了

```js
const interfaces = require('os').networkInterfaces()
const getNetworkIp = () => {
  let IpAddress = ''
  for (let devName in interfaces) {
    let iface = interfaces[devName]
    iface.forEach(ipInfo => {
      if (
        ipInfo.family === 'IPv4' &&
        ipInfo.address !== '127.0.0.1' &&
        !ipInfo.internal
      ) {
        IpAddress = ipInfo.address
      }
    })
  }
  return IpAddress
}
module.exports = getNetworkIp
```

- 最终实现的效果如下所示

<p align="center">
  <img :src="$withBase('/imgs/dev-error-info.png')""/>
</p>

## 六、Source Map

::: tip 为什么要用 source maps
因为 webpack 对源代码进行打包后，会对源代码进行压缩、精简、甚至变量名替换，在浏览器中，无法对代码逐行打断点进行调试，所有需要使用 source maps 进行调试，它使得我们在浏览器中可以看到源代码，进而逐行打断点调试。
:::

- 使用方法很简单，只需要在配置中添加 devtool 属性，赋值一个字符串或者布尔值即可 [传送门](https://www.webpackjs.com/configuration/devtool/)
- 使用 inline-source-map 不会对生产环境造成影响

```js
  devtool: 'inline-source-map',
```

- 到此告一段落了，项目地址还是原来的地址，但是分支换成了 develop [传送门](https://gitee.com/cym_git/webpack-pit.git)

:tada: :100:
