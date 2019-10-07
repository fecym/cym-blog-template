---

title: Redis 小记
date: 2019-09-14
tags:

- redis
- 大前端

---

# Redis

## 安装

- 官网有 Linux 的详细教程，安装省略，记录一下基本配置以及基础用法

## 简介

> Redis 是一个开源的，内存数据结构存储，用作数据库、缓存和消息中间件。 它支持多种类型的数据结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps， hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了 复制（replication），LUA 脚本（Lua scripting）， LRU 驱动事件（LRU eviction），事务（transactions） 和不同级别的 磁盘持久化（persistence）， 并通过 Redis 哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。（摘自 Redis 官网）

- **Redis** 是 <code>ket-value</code>数据库。效率快，但功能单一；
- 常用做集中式会话管理（部署了负载均衡的服务之后，可用作 **redis** 来存储 _session_，可保证 _session_ 不用换一个服务请求一次）
- 用作缓存服务器（**Redis** 读取特别快：SET 操作每秒钟 110000 次，GET 操作每秒钟 81000 次。）

## 基本命令

```sh
  # 启动redis，window启动方式
  redis-server redis.window.conf
  # Linux启动
  redis-server
  # 启动客户端
  redis-cli
```

### 客户端命令

> 执行了<code>redis-cli</code>之后的命令

### 修改配置，查看某个配置

> 以下命令推荐使用大写，便于区分变量和命令

- 可用到 <code>config get | set configName</code>

```sh
  # 查看端口的配置
  config get port
  # 强制关闭Redis快照导致不能持久化。
  config set stop-writes-on-bgsave-error no
```

### 设置值

- <code>get、set</code> 命令设置值，语法 <code>set kyeName value | get keyName</code>

```sh
  # 设置成功会返回 ok
  set name chengyuming
  # 获取成功会返回之前设置的值，若没有设置过，则返回 (nil)
  get name
```

- <code>del</code> 删除值

```sh
  set testKey chengyuming
  del testKey     # 返回 1，则删除成功，返回 0，删除失败
```

- <code>getrange</code> 命令获取值的范围，语法 <code>getrange keyName start end</code>

```sh
  # 获取全部是从 0 到 -1，返回 chengyuming，所以是从0开始
  getrange name 0 -1
```

- <code>incr|incrby、decr|decrby</code> 递增递减命令，语法：<code>incr keyName | incrby keyName number</code>

```sh
  # 递增递减，只对number类型的数据有效
  set age 9
  # 递增
  incr age      # 返回 10
  incrby age 2  # 返回 12
  # 递减
  decr age      # 返回 11
  decrby age 5  # 返回 6
```

- <code>type keyName</code>查看变量类型

```sh
  type name     # string
```

### 设置过期时间

> 设置了过期时间后，变量会到期自动删除，这也是 redis 作为缓存数据库的一个优势，设置很简单只需要加 **expire** 就行

- <code>expire kyeName expireTime</code>设置过期时间，单位秒
- 请求数据的时候先查看 **redis** 是否保存有数据，如果有则读取 **redis** 数据，没有则为 **redis** 存储数据，并且设置过期时间

```sh
  # 设置 name 30秒之后过期
  expire name 30      # 设置成功返回 1，失败返回 0，redis返回的 1 代表成功，0 代表失败
```

### 哈希值

> 一个字符串类型的 key 和 value 的映射表，特别适合用于存储对象，语法也很简单，就是在 get 之前加一个 h，hget

- 设置哈希值<code>hset | hmset</code>，语法：<code>hset obj keyName value | hset obj key1 value1 key2 value2 ...</code>

```sh
  # 设置单个哈希值
  hset person1 name chengyuming
  hset person1 age 24
  hset person1 sex 1
  # 设置多个哈希值
  hset person2 name chengyuming age 24 sex 1
```

- 获取哈希值删除哈希值也差不多

```sh
  # 获取单个哈希值
  hget person1 name
  hget person1 age
  hget person1 sex
  # 获取多个哈希值
  hmget person1 name age
  # 获取所有值
  hgetall person2     # 返回 "name" "chengyuming" "age" "24" "sex" "1"
  # 删除哈希值
  hdel person name
```

- 获取所有的 __key__，<code>hkeys objName</code>
```sh
  # 获取所有的 key
  hkeys person1
```

### list 基本操作

<!-- <code></code> -->

- <code>lpush</code> 命令，语法：<code>lpush listName value</code>，从左边添加一个值
- <code>rpush</code> 命令，语法：<code>rpush listName value</code>，从右边添加一个值
- <code>lpop</code> 命令，语法：<code>lpop listName</code>，从左边弹出一个值
- <code>rpop</code> 命令，语法：<code>rpop listName</code>，从右边弹出一个值
- <code>lrange</code> 命令，语法：<code>lrange listName start end</code>，查看 list 的在 start 与 end 范围内的值
- <code>lindex</code> 命令，语法：<code>lindex listName index</code>，查看 list 索引为 index 的值
- <code>llen</code> 命令，语法：<code>llen listName</code>，查看 list 的长度
- <code>lrem</code> 命令，语法：<code>lrem listName length item</code>，从左边开始删除几个删除谁，如果 length 是负数则从右边开始删除

```sh
  # 添加值，返回添加后的length长度
  lpush ids 2
  lpush ids 1
  rpush ids 3
  rpush ids 4
  rpush ids 1
  rpush ids 1
  rpush ids 1
  # 查看list所有的值
  lrange ids 0 -1   # 返回 "1" "2" "3" "4" "1" "1" "1"
  # 查看索引为 3 的值
  lindex ids 3      # 返回 4
  # 删除最后的三个1，那就是从右边开始删除，所以传递负数
  lrem ids -3 1     # 返回删除的长度 3
  # 在查看下list
  lrange ids 0 -1   # 返回 "1" "2" "3" "4"
```

...

### 放到代码中怎么玩

> 放到代码中其实也是一样，一看代码便知

```js
const redis = require('redis')
// 拿到客户端
const client = redis.createClient(6379, 'localhost')
// 监听错误事件
client.on('error', err => {
  console.log(err)
})

// 异步的
client.set('home', 'beijing', (err, result) => {
  if (err) throw err
  console.log(result)
})
// hash
/**
 * person = {
 *   username: 'chengyuming',
 *   age: '24'
 * }
 */
client.hmset('person1', 'username', 'chengyuming', 'age', '24', (err, result) => {
    if (err) throw err
    console.log(result)
  }
)
client.hkeys('person1', (err, result) => {
  if (err) throw err
  console.log(result)
  result.forEach(key => {
    client.hget('person1', key, (err, value) => {
      console.log(key, value, '嘿嘿和')
    })
  })
})
```

## Redis 发布订阅

> 有很多人订阅了你的产品，当你产品上线后，你需要通知他们上线了，那么这会用到发布订阅，对于 **Redis** 来说发布订阅很简单

- 我们只需要在订阅的频道，使用 <code>subscribe channelName</code> 即可订阅
- 发布频道在发布消息的时候，就可以直接发布 <code>publish channelName</code> 即可发布消息，此时所有订阅过得人都会收到通知
- 下面用代码演示一下

```js
const redis = require('redis')
const subClient1 = redis.createClient(6379, 'localhost')
const subClient2 = redis.createClient(6379, 'localhost')
const pubClient = redis.createClient(6379, 'localhost')
// 订阅消息
subClient1.subscribe('food')
subClient2.subscribe('drink')
// 监听发布的消息之后要做什么
subClient1.on('message', (channel, message) => {
  console.log(channel, message)
  // 取消订阅
  subClient1.unsubscribe('food')
})
subClient2.on('message', (channel, message) => {
  console.log(channel, message)
})
// 发布消息
setTimeout(() => {
  pubClient.publish('food', '面包')
  pubClient.publish('drink', '可乐')
})
setTimeout(() => {
  pubClient.publish('food', '面包')
  pubClient.publish('drink', '可乐')
}, 1000)
```

## 事务

### MySQL 事务

> 举个栗子来说下 MySQL 的事务吧，别说那么多繁琐的概念了

```sh
  # 比如说转账，张三有1000元，李四有1000元，张三要转给李四500元
  # 那么就是
  #   张三: 1000 - 500 = 500 元
  #   李四: 1000 + 500 = 1500 元
  # 这个过程要么全部成功，要么全部失败，你不能给张三扣了，但是没有给李四加上去
```

### Redis 事务

> 对于 **Redis** 来说事务就是执行一个批量的脚本，那么就会用到 **multi** 和 **exec** 命令

- <code>multi</code> 命令开始事务
- 执行一些其他命令，但是这些命令都不会立即执行，会返回一个队列（QUEUED）
- 等到你执行 <code>exec</code> 命令之后，这些命令开始执行

```sh
  # 开始事务
  multi   # 返回 ok
  # 执行其他命令
  set name chengyuming    # 返回 QUEUED
  set age 24              # 返回 QUEUED
  # 执行
  exec                    # 返回 ok ok
```

- 放到代码中，来看一下

```js
const redis = require('redis')
const client = redis.createClient(6379, 'localhost')
// 开启事务
client
  .multi()
  .set('k3', 'v3')
  .set('k4', 'v4')
  .get('k4')
  .exec((err, result) => {
    if (err) throw err
    // 返回 [ 'OK', 'OK', 'v4' ]
    console.log(result)
  })
client.on('error', err => {
  console.log(err)
})
```

## 备份与恢复

> 对于 __Redis__ 的备份与恢复特别简单，备份只需要输入 __save__ 命令即可完成备份，此时会在 __Redis__ 的安装目录下生成一个 __dump.rdb__ 文件这就是 __Redis__ 的备份文件，你可以把它拿到别的地方，等下次想恢复到这个版本的数据的时候，直接在启动 __Redis__ 前把该文件copy到 __Redis__ 的安装目录就可以了
- 可能会遇到输入 save 命令返回一个 error 的问题，那是你权限不够，提升下权限就可以解决
- __Redis__ 就先记录这些，以后在做补充
