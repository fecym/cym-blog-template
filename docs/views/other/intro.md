# 关于博客

## vuepress 简介

- 我的博客是用 vuepress 快速搭建的
- 如果你发现现在布局跟我介绍的不一样了，请不要方，我是换了主题重构了整个博客
- vuepress 是一个 Vue 驱动的静态网站生成器，利用 Markdown 语法来快速书写
- 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- 享受 Vue + webpack 的开发体验，可以在 Markdown 中使用 Vue 组件，又可以使用 Vue 来开发自定义主题。
- VuePress 会为每个页面预渲染生成静态的 HTML，同时，每个页面被加载的时候，将作为 SPA 运行。
- 关于 vuepress 的简介可以查看官网的介绍，上手很容易 [传送门](https://vuepress.vuejs.org/zh/guide/#%E5%AE%83%E6%98%AF%E5%A6%82%E4%BD%95%E5%B7%A5%E4%BD%9C%E7%9A%84%EF%BC%9F)
- 下面来介绍下使用中遇到的一些问题，以及解决方法

## 快速上手

> 话不多少，先看看项目目录吧

### 项目基本结构

```sh
  ├── docs
  │   ├── .vuepress         # 可以理解为项目的配置文件吧
  │   │     └── config.js   # 项目配置文件
  │   │── other             # 其他要展示的页面
  │   └── README.md         # 首页
  ├── .travis.yml           # Travis CI 配置文件（配置自动化部署的关键，可以没有）
  ├── deploy.sh             # 项目部署脚本（可配置为自动化部署）
  └── package.json          # npm包依赖
```

### 搭建项目目录

- 那我们先搭建这些相关的文件目录，以及项目需要的依赖吧

```sh
  # 初始化项目
  npm init -y
  # 下载依赖
  yarn add -D vuepress
  # 新建基本目录
  mkdir docs && cd docs
  mkdir .vuepress && cd .vuepress
  # 在 .vuepress 新建 config.js 文件
  touch config.js
  # 返回上一级新建READMEmd
  cd .. && touch README.md
  # 到根目录修改package.json文件，script脚本下写入以下命令
  "scripts": {
    "start": "vuepress dev docs",
    "build": "vuepress build docs"
  }
```

### 配置首页

- 此时我们基本的项目目录就搭建完毕了
- 此时我们就可以执行 yarn start 来运行我们的项目
- 默认的主题提供了一个首页（Homepage）的布局 (用于 这个网站的主页)。想要使用它，需要在你的根级 README.md 的 [YAML front matter](https://vuepress.vuejs.org/zh/guide/markdown.html#front-matter) 指定 home: true。以下是这个网站实际使用的数据：

```yaml
  ---
    home: true
    heroImage: /hero.png
    actionText: 快速上手 →
    actionLink: /zh/guide/
    features:
    - title: 简洁至上
      details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
    - title: Vue驱动
      details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
    - title: 高性能
      details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
    footer: MIT Licensed | Copyright © 2018-present Evan You
    ---
```

### 注意事项

::: warning 注意事项
理论上 vuepress 搭建的文档是支持热加载的，但是 README.me 的修改，config.js 的修改以及配置了侧边栏为自动生成的时候，侧边栏的生成都需要重启项目才可以看到效果，他们是不会热更新的
:::

### 主题配置

- 导航栏可能包含你的页面标题、搜索框、 导航栏链接、多语言切换、仓库链接，它们均取决于你的配置。
- 通过配置 .vuepress/config.js 来配置我们的导航，基本语法如下 [传送门](https://vuepress.vuejs.org/zh/default-theme-config/)

```js
module.exports = {
  // base用来配置部署github后的文件夹
  // base: './',
  // 文章的标题
  title: 'Today',
  // 文章的介绍
  description: 'Today, have you studied yet?',
  // 主题的配置，核心配置
  themeConfig: {
    // 导航的配置
    nav: [
      { text: '首页', link: '/' },
      // 可下拉的导航
      {
        text: 'webpack',
        items: [
          { text: 'webpack简介', link: '/webpack/index' },
          { text: '从0搭建vue', link: '/webpack/vue' }
        ]
      },
      { text: 'mapbox', link: '/mapbox/index' },
      { text: 'vue', link: '/vue' }
    ],
    // 导航栏的配置，自动生成
    sidebar: 'auto',
    // 显示最后更新时间
    lastUpdated: '最后更新时间'
  },
  // Markdown的配置，包括Markdown的拓展
  markdown: {
    // 代码块显示行号
    lineNumbers: true
  }
}
```

- 在 nav 中配置标题是 text 字段，链接要写在 link 中，也可以写外部链接
- 默认的 / 执行了 docs 目录，比如 /webpack/index 实际上是 /docs/webpack/index.md

## 线上部署

::: warning 线上部署

- 当你的文档开发完毕，你可以执行 yarn build 命令对项目进行打包，打包之后会在 .vuepress/dist 里面就是你打包后的静态资源文件，他会转成 html 文件，然后你可以在你的服务器上用 nginx 开个一个端口，解析一个域名，创建一个对应的目录，把项目放进去就可以访问到了，你也可以本地起一个简单的服务器，测试你的项目，都是完全 ok 的
- 当然如果你想直接部署到 github 的博客上，也是可以的，你需要写一个部署脚本文件，配置一下就可以了，配置内容如下
  :::

```sh
  #!/usr/bin/env sh
  # 确保脚本抛出遇到的错误
  set -e
  npm install -g vuepress@next
  # 生成静态文件
  npm run build
  # 进入生成的文件夹
  cd docs/.vuepress/dist
  # 如果是发布到自定义域名
  # echo 'www.example.com' > CNAME
  git init
  git add -A
  git commit -m 'deploy'
  # 如果发布到 https://<USERNAME>.github.io
  git push -f https://github.com/cym-git/cym-git.github.io.git master
  # git push -f https://${blog}@${address} master:master
  # 如果发布到 https://<USERNAME>.github.io/<REPO>
  # git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
  cd -
```

- 然后在 package.json 里面增加一个执行脚本，每次开发完毕执行 yarn deploy 命令就会部署到 github 的博客上了

```json
  "scripts": {
    "start": "vuepress dev docs",
    "build": "vuepress build docs",
    "deploy": "bash deploy.sh"
  },
```

## 线上自动化部署

::: tip 关于线上自动化部署

- 关于线上部署，这里你需要额外在创建一个 git 项目，然后放到 git 上面你的项目名字要定义为：git 用户名 + github.io 组成，比如说，你的 github 用户名叫做 chengyuming，那么你就需要定义项目名称为 **chengyuming.github.io** 作为项目名字，这也将会是你的博客地址<br>
- 然后你需要配置一下 **Travis**，不了解 **Travis** 的话可以先简单了解下 [传送门](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
  :::

### 申请 Personal access tokens

- 首先你需啊在 github 上面申请一个 Personal access tokens，用来配置你的 Travis
- 在 github 界面，点击 **你的头像 -> Settings -> Developer settings -> Personal access tokens** 进入 Personal access tokens 申请页面，点击 Generate new token 按钮生成 token ，或者你嫌麻烦可以直接点这 [传送门](https://github.com/settings/tokens)

<p align="center">
  <img :src="$withBase('/imgs/Generate-token.png')""/>
</p>

- 进去之后，你可以输入一个名字，随便一个名字，你可以理解为一个全局的变量，你记住就可以了，下面的权限你都选中，然后点击 **Generate token** 就会生成一个 **Personal access tokens**

<p align="center">
  <img :src="$withBase('/imgs/Generate-token-after.png')""/>
</p>

- 上图生成之后的效果

### 配置 Travis

- 进入 [Travis 官网](https://travis-ci.org/) 用 github 账号登录
- 在里面选择你要进行部署的项目，如下图

<p align="center">
  <img :src="$withBase('/imgs/Travis-setting-project.png')""/>
</p>

- **cym-git.github.io** 是我部署到的项目名字，也就是博客的地址，不需要把它打勾，我们需要打勾的是 **docs** 因为是从这个项目打包后直接部署到 **cym-git.github.io** 里面，这个以后进入的入口是点击 头像 -> Settings 进入，第一次进入会直接进入这个页面的
- 然后我们点击 logo 图标进入首页，左边会出现你选择的项目，然后最右边的 **More options**

<p align="center">
  <img :src="$withBase('/imgs/Travis-setting-project-after.png')""/>
</p>

- 然后如下图，把在 **github** 里面生成的 **Personal access tokens** 放到 **Value** 里面，**Name** 里面起个名字。然后点击 **Add**，我起的名字叫做 blog
- 还需要添加一个地址，就是你要部署到 github 地址，不需要带 **https** 的，比如我的地址是 **github.com/cym-git/cym-git.github.io.git**，**name** 是 **address**

<p align="center">
  <img :src="$withBase('/imgs/Travis-setting-project-settings-token.png')""/>
</p>

### 项目里面配置自动化部署

- 此时我们编写在 docs 根目录下新建一个 .travis.yml 配置文件，用来配置一下我们的 [**Travis**](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
- 同时修改 deploy.sh 文件，注意高亮那行

```sh{28}
  # .travis.yml 文件如下
  sudo: required
  language: node_js
  node_js: stable
  script: bash ./deploy.sh
  branches:
    only:
      - master
  notifications:
    email: false

  # deploy.sh 修改后的

  #!/usr/bin/env sh
  # 确保脚本抛出遇到的错误
  set -e
  npm install -g vuepress@next
  # 生成静态文件
  npm run build
  # 进入生成的文件夹
  cd docs/.vuepress/dist
  # 如果是发布到自定义域名
  # echo 'www.example.com' > CNAME
  git init
  git add -A
  git commit -m 'deploy'
  # 如果发布到 https://<USERNAME>.github.io
  git push -f https://${blog}@${address} master:master
  # 如果发布到 https://<USERNAME>.github.io/<REPO>
  # git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
  cd -
```

- 注意里面的 **blog** 和 **address** 是我们在 **Travis** 配置的那个 blog 和 address
- 配置完毕之后，你可以修改你的博客，然后你当你 push 代码的时候就会触发 Travis 的执行
- 打开 Travis 就可以看到他在执行你设置的相应的命令来部署你的博客了

## 添加评论系统

- vuepress 是可以为自己的博客添加评论系统的，而且很简单
- 首先添加评论系统授权，所以要在 **github** 中生成 **clientID** 和 **clientSecret**
- 点击 **你的头像** -> **Settings** -> **Developer settings** -> **OAuth Apps** 里面点击 **New OAuth App** 按钮，或者直接点[这里](https://github.com/settings/applications/new)
- 准备工作做完了，接下来我们只需要配置两步就可以了
  - 第一步：安装插件
  ```sh
    npm install @vssue/vuepress-plugin-vssue
    npm install @vssue/api-github-v3
  ```
  - 配置插件
  ```js
  // 在.vuepress/config.js中添加plugins
  plugins: [
    [
      '@vssue/vuepress-plugin-vssue',
      {
        // 设置 `platform` 而不是 `api`
        platform: 'github',
        locale: 'zh', // 语言设置
        // 其他的 Vssue 配置
        owner: 'OWNER_OF_REPO', // github账户名称，登陆名字
        repo: 'NAME_OF_REPO', // Github博客仓库，仓库地址，不加要https
        clientId: 'YOUR_CLIENT_ID', // github上面申请的clientId
        clientSecret: 'YOUR_CLIENT_SECRET' // github上面申请的clientSecret
      }
    ]
  ]
  ```
- 最后在你想要显示评论的 md 文件下面，加上这句话就 ok 了

```html
<Vssue title="Vssue Demo" />
```

- 此时你的博客上的就会显示，像我下面显示评论一样了

:tada: :100:

<Vssue title="Vssue Demo" />
