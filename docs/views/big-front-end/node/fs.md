---
title: fs 文件系统   
date: 2019-06-28
tags:
- node
- 大前端
---

# fs 文件系统

> fs 模块是 nodejs 的核心模块，使用该模块只需要引入而不需要下载，对文件系统的操作，不外乎增删改查，我们就从这几步来入手

## 文件操作

### 读取文件

- fs 模块所有的都有同步和异步语法，异步语法直接写 api，同步写法就是 api 后紧跟 sync(同步)
- fs.readFile() 就是异步写法，那么同步写法就是 fs.readFilSync()
- 异步写法的返回值在回调函数中，同步写发直接就有返回值，这基本上也是 fs 所有模块的写法

```js
const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, '..', dir)
// 异步写法
fs.readFile(resolve('file/test.html'), 'utf8', (err, data) => {
  if (err) throw err
  // data就是他的返回值
  console.log('异步测试：--> ' + data)
})
// 同步写法
const result = fs.readFileSync(resolve('file/test.txt'), 'utf8')
// result就是返回值，返回读取到的文件内容
console.log(result)
```

- fs.readFile 接受三个参数 (path[, options], callback)
  - 文件目录、{ 文档编码, 文件系统标志 }, 回调函数(err, data)
  - node 基本上所有的 api 的回调函数的第一个参数都是错误
  - 如上面的写法就是 node 读取一个文件的例子

### 写入文件

- fs.writeFile 接受四个参数(file, data[, options], callback)
- 跟读取很像，不过第二个参数变成了要写入的数据
- options 参数中有个 flag，表示你要怎么写入文件 [传送门](/node/fs.html#写入文件)
- r 代表读取文件，w 代表写文件，a 代表追加。，默认为 w

```js
const data = Buffer.from('hello world')
const options = {
  encoding: 'utf8',
  mode: 0o666,
  // 文件描述符，r代表读取文件，w代表写文件，a代表追加。，默认为w
  // 'flag': 'w'
  flag: 'a'
}
fs.writeFile(resolve('write/options.txt'), data, options, err => {
  if (err) throw err
  console.log('文件写入成功')
})
```

### 追加文件

- fs.appendFile()，跟 fs.writeFile 基本不一样
- 不一样的地方是，fs.appendFile() 默认的 flag 是 a

### 复制文件

- fs.copyFile() 看文档吧，[传送门](http://nodejs.cn/api/fs.html#fs_fs_copyfile_src_dest_flags_callback)

### 链接文件

- 我们所认为的文件的复制操作，对于计算机而言是建立文件链接，把文件备份被称为硬链接（hard link）
- 把文件创建一个快捷方式就是软链接，也叫符号链接（symbolic link），软链接就是快捷方式
- fs 提供了这么两种方法，fs.link()就是备份文件，fs.symlink()就是软链接
- 接收三个参数，originPath，targetPath，callback(err)，前两个参数必须到 filename，你可以备份后名字不一样，但是不可以不写清楚 filename

```js
// 硬链接，备份文件
fs.link(resolve('file/test.txt'), resolve('write/test_copy.txt'), err => {
  if (err) throw err
  console.log('文件备份成功')
})
// 软链接，快捷方式
fs.symlink(
  resolve('file/test.txt'),
  resolve('write/test_symbolic.txt'),
  err => {
    if (err) throw err
    console.log('建立软链接成功')
  }
)
```

### 删除文件

- 删除文件很简单，备份文件是 link 那么删除就是 unlink 了
- 两个参数，path 和 callback

```js
fs.unlink(resolve('write/options.txt'), err => {
  if (err) throw err
  console.log('文件删除成功')
})
```

### 重命名文件

- fs.rename() 方法接收三个参数，源名字，新名字，回调函数
- 如果第一个参数和第二个参数不在同一个文件夹内，还会造成移动文件
- 如果新名字存在，则会覆盖它

```js
fs.rename(resolve('file/1.txt'), '哈哈哈.js', err => {
  if (err) throw err
  console.log('重命名完成')
})
```

### 文件系统标志

> 当 flag 选项采用字符串时，可用以下标志：

- 'a' - 打开文件用于追加。如果文件不存在，则创建该文件。
- 'ax' - 与 'a' 相似，但如果路径已存在则失败。
- 'a+' - 打开文件用于读取和追加。如果文件不存在，则创建该文件。
- 'ax+' - 与 'a+' 相似，但如果路径已存在则失败。
- 'as' - 以同步模式打开文件用于追加。如果文件不存在，则创建该文件。
- 'as+' - 以同步模式打开文件用于读取和追加。如果文件不存在，则创建该文件。
- 'r' - 打开文件用于读取。如果文件不存在，则出现异常。
- 'r+' - 打开文件用于读取和写入。如果文件不存在，则出现异常。
- 'rs+' - 以同步模式打开文件用于读取和写入。指示操作系统绕过本地的文件系统缓存。这对于在 NFS 挂载上打开文件时非常有用，因为它允许跳过可能过时的本地缓存。 它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。这不会将 fs.open() 或 fsPromises.open() 转换为同步的阻塞调用。 如果需要同步的操作，则应使用 fs.openSync() 之类的。
- 'w' - 打开文件用于写入。如果文件不存在则创建文件，如果文件已存在则截断文件。
- 'wx' - 与 'w' 相似，但如果路径已存在则失败。
- 'w+' - 打开文件用于读取和写入。如果文件不存在则创建文件，如果文件已存在则截断文件。
- 'wx+' - 与 'w+' 相似，但如果路径已存在则失败。

## 文件夹的操作

> 文件夹的操作都比较简单，直接上代码

### fs.mkdir 创建文件夹

```js
  fs.mkdir(resolve('mkdir'), function(err) {
    if (err) throw err
    console.log('创建目录成功')
  }
```

### fs.rmdir 删除文件夹

```js
fs.rmdir(dir, err => {
  if (err) throw err
  console.log('文件夹删除成功')
})
```

### fs.readdir 读取文件夹

- 文件夹读取成功返回一个数组，返回文件夹下的所有子目录，并且按照字符串的排序规则排序，如果是空文件夹则返回空数组

```js
  fs.readdir(dir, (err, data) => {
    if (err) throw err
    if (data.length) {
      console.log('说明有子文件')
    }
  }
```

### fs.existsSync 判断文件路径

- fs.existsSync 接收一个参数，文件路径
- 如果路径存在，返回 true，不存在返回 false
- 该方法的异步写法已被废弃，只有同步写法

## 文件对象属性

- fs.stat() 和 fs.lstat()
- 这俩方法用俩查看一个文件或目录的信息，如文件的大小、创建时间、权限等信息
- 唯一区别是当查看符号链接文件的信息时，必须使用 fs.lstat()方法
- 接受两个参数，path 和 callback

```js {4}
const filePath = path.resolve('D:/')
fs.stat(filePath, (err, stats) => {
  if (err) throw err
  console.log(stats)
})
```

- 此时我们可以在 stats 上看到文件的信息
  - **dev**: 文件或目录所在的设备 ID。该属性值在 UNIX 系统下有效；
  - **mode**: 文件或目录的权限标志，采用数值形式表示；
  - **nlink**: 文件或目录的的硬连接数量；
  - **uid**: 文件或目录的所有者的用户 ID。该属性值在 UNIX 系统下有效；
  - **gid**: 文件或目录的所有者的用户组 ID。该属性值在 UNIX 系统下有效；
  - **rdev**: 字符设备文件或块设备文件所在设备 ID。该属性值在 UNIX 系统下有效；\*\*
  - **ino**: 文件或目录的索引编号。该属性值仅在 UNIX 系统下有效；
  - **size**: 文件的字节数；
  - **atime**: 文件或目录的访问时间；
  - **mtime**: 文件或目录的最后修改时间；
  - **ctime**: 文件或目录状态的最后修改时间；
  - **birthtime**: 文件创建时间，文件创建时生成。在一些不提供文件 birthtime 的文件系统中，这个字段会使用 ctime 或 1970-01-01T00:00Z 来填充；
- states 上面有一些方法如下
  - **stats.isFile()**： 判断被查看对象是否是一个文件。如果是标准文件，返回 true。是目录、套接字、符号连接、或设备等返回 false。
  - **stats.isDirectory()**： 判断被查看对象是否是一个目录。如果是目录，返回 true。
  - **stats.isBlockDevice()**： 判断被查看对象是否是一个块设备文件。 如果是块设备，返回 true，大多数情况下类 UNIX 系统的块设备都位于/dev 目录下。
  - **stats.isCharacterDevice()**： 判断被查看对象是否是一个字符设备文件。如果是字符设备，返回 true。
  - **stats.isSymbolicLink()**： 判断被查看对象是否是一个符号链接文件。如果是符号连接，返回 true。该方法仅在 fs.lstat()方法的回调函数中有效。
  - **stats.isFIFO()**： 判断被查看对象是否是一个 FIFO 文件。如果是 FIFO，返回 true。FIFO 是 UNIX 中的一种特殊类型的命令管道。该方法仅在 LINUX 系统下有效。
  - **stats.isSocket()**： 判断被查看对象是否是一个 socket 文件。 如果是 UNIX 套接字，返回 true。该方法仅在 LINUX 系统下有效。
- 我们可能经常会用到的 stats.isFile() 和 stats.isDirectory()来判断该文件是文件夹还是文件
- 我们根据这些内容来做几个轮子，加深一下印象

## 轮子

### 批量创建文件

- 我们造俩轮子，来测试我们的猜想
- 指定一个存在的文件夹，为其批量创建 100 个文件
- 首先我们需要判断该文件夹存在，不存在则创建，存在则直接创建文件
- 判断有没有该文件夹的方法是没有的，我们可以直接创建，如果创建失败了，那么说明有文件夹，则直接创建文件，没有这个文件夹就创建成功了呗

```js
const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

// 判断是否有该文件夹

function isDir(dir) {
  console.log(dir)
  return new Promise(resolve => {
    fs.mkdir(dir, err => {
      if (err) {
        // 失败了说明文件夹创建过了
        return resolve(true)
      } else {
        return resolve(false)
      }
    })
  })
}

function betchCreateFile() {
  isDir(resolve('mkdir'))
    .then(result => {
      if (result) {
        for (let i = 0; i < 100; i++) {
          fs.writeFile(resolve(`mkdir/${i}.txt`), 'hello world', err => {
            if (err) throw err
            console.log('文件 ' + i + ' 写入成功')
          })
        }
      } else {
        betchCreateFile()
      }
    })
    .catch(err => {
      console.log(err, '哪出错了？？')
    })
}

betchCreateFile()
```

### 批量删除当前文件夹下的文件

- 删除文件和删除文件夹是不一样的，如果文件夹有文件那么删除会失败
- 根据这个我们先判断一下有没有文件了，然后进行删除，先来个简单的，只考虑一层的删除

```js
const rm = dir => {
  // 文件夹读取返回一个数组，返回文件夹下的所有子目录，并且按照字符串的排序规则排序
  fs.readdir(dir, (err, data) => {
    if (err) throw err
    if (data && data.length) {
      // 说明有文件
      data.forEach((item, idx) => {
        fs.unlinkSync(`${dir}/${item}`)
        console.log(`开始删除第${idx + 1}个文件：${item}`)
      })
      rm(dir)
    } else {
      fs.rmdir(dir, err => {
        if (err) throw err
        console.log('文件夹删除成功')
      })
    }
  })
}
```

### 批量读取文件

- 读取文件，读取一个文件夹下面所有的文件，如果读取到文件夹下面还有文件那么递归这个方法继续打印我们的文件
- 这个时候我们就需要使用 fs.stat() 返回的 stats 中得 stats.isFile()和 stats.isDirectory()来区分是文件还是文件夹了

```js
const fs = require('fs')
const path = require('path')

const fileDisplay = filePath => {
  console.log(filePath)
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.warn('文件夹读取失败' + err)
    } else {
      // 遍历文件列表
      files.forEach(filename => {
        // 获取当前路径
        let filedir = path.join(filePath, filename)
        fs.stat(filedir, (err, stats) => {
          if (err) {
            console.warn('获取文件stat失败：' + err)
          } else {
            let isFile = stats.isFile()
            let isDir = stats.isDirectory()
            if (isFile) console.log('文件读取成功：' + filedir)
            if (isDir) fileDisplay(filedir)
          }
        })
      })
    }
  })
}

fileDisplay(path.join(__dirname, '..', '..', '..'))
```

### 批量删除所有文件

- 删除的，我们需要用同步的写法，全部同步的写法，异步写法可能会出问题
- 因为没有办法获取到什么时候删除成功了，成功删除了文件还是文件夹

```js
// 同步写法
const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const rmdir = dir => {
  let files = []
  // 判断该文件路径是否存在返回一个布尔值
  if (fs.existsSync(dir)) {
    // 先读取文件
    files = fs.readdirSync(dir)
    files.forEach(filename => {
      // 获取当前的绝对路径
      let curPath = path.join(dir, filename)
      // 获取该文件的信息，如果是文件夹，那么递归
      if (fs.statSync(curPath).isDirectory()) {
        rmdir(curPath)
      } else {
        // 如果是文件，那么删除
        fs.unlinkSync(curPath)
        console.log('文件 ' + curPath + ' 删除成功')
      }
    })
    // 删除完文件删除文件夹
    fs.rmdirSync(dir)
    console.log('文件夹 ' + dir + ' 删除成功')
  }
}

rmdir(resolve('../../test'))
```

- 异步写法，为了不报错，只能删除掉所有的子文件，可能我写法有问题，先贴出来，求指正

```js
const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const rmdir = dir => {
  // 先读取文件
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.warn('文件读取失败：' + err)
    } else {
      // 说明文件夹里有东西
      if (files.length) {
        // 判断是文件还是文件夹
        files.forEach(filename => {
          // 获取当前的绝对路径
          let positionPath = path.join(dir, filename)
          fs.stat(positionPath, (err, stats) => {
            if (err) {
              console.warn('获取文件信息失败：' + err)
            } else {
              let isDir = stats.isDirectory()
              let isFile = stats.isFile()
              if (isDir) {
                // 如果是文件夹则递归
                rmdir(positionPath)
              }
              if (isFile) {
                // 若是文件则删除文件
                fs.unlink(positionPath, err => {
                  if (err) {
                    console.warn('文件 ' + positionPath + ' 删除失败：' + err)
                  } else {
                    console.warn('文件 ' + positionPath + ' 删除成功')
                    rmdir(dir)
                  }
                })
                // fs.unlinkSync(positionPath)
              }
            }
          })
        })
      } else {
        // 说明是空文件夹
        fs.rmdir(dir, err => {
          if (err) {
            console.warn('文件夹 ' + dir + ' 删除失败：' + err)
          } else {
            console.log('文件夹 ' + dir + ' 删除成功')
          }
        })
      }
    }
  })
}

rmdir(resolve('../../test'))
```
