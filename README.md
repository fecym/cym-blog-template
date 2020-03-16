# About My Cli

该脚手架是基于 _vuepress_ 框架搭建，然后使用了 _vuepress-theme-reco-cli_ 主题，由于该主题有些我不喜欢的地方，我重新做了简单封装，做成了自己的博客项目的脚手架，欢迎交流相互学习。

该项目是 `cym-blog` 脚手架的模板文件，下面介绍是脚手架的使用，[脚手架地址](https://www.npmjs.com/package/cym-blog)

## Version

2.0.0

## Experience

```sh

# create
npx cym-blog init my-blog

# or
npm install -g cym-blog
cym-blog init my-blog

# install
cd my-blog
npm install

# run
npm start

# build
npm run build
```

**if yarn**

```bash

# create
npx my-blog init my-blog

# or
yarn global add my-blog
cym-blog init my-blog

# install
cd my-blog
yarn install

# run
yarn start

# build
yarn build
```

## test

非脚手架功能，测试使用

```sh
  # 测试init命令
  npm run test:init
  # 测试下载功能
  npm run test:download
  # 测试全部功能
  npm run test:all
  # 删除测试所下载的文件
  npm run rm:all-test
```

## Blog

[About me](http://chengyuming.cn/)

## Q&A

博客模板下载完毕，下载博客依赖的时候推荐使用 yarn 下载

如果您有任何疑问请来[这里留言](https://chengyuming.cn/views/tools/npm/cli.html#%E5%8F%82%E8%80%83%E9%93%BE%E6%8E%A5)，我将会为您一一解答哦
