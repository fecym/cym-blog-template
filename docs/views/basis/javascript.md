---
title: JavaScript 基础知识整理
date: 2019-05-12
tags:
  - JavaScript
  - 基础
---

# JavaScript 基础

## 类型转换

### 一个有趣的问题

<p align="center">
  <!-- ![类型改变]($withBase('/imgs/basis-javascript-type-change.jpg')) -->
  <img :src="$withBase('/imgs/basis-javascript-type-change.jpg')" height="260" />
</p>

> 看到了这个我亲自尝试了下，结果发现自己对 js 基础越来越陌生了，现在好好复习下吧

```js
0 == '0' // true
0 == [] // true
'0' == [] // false
```

### 为什么 '0' == [] 是 false ？

- 首先，对象和值类型没法比较，所以需要先把对象转值类型，然后在比较
- <code>==</code>运算符比较会做数据类型转换，数组是对象，他会根据要比较的值类型做相应的转换
- 跟字符串<code>'0'</code>比较，那么数组<code>[]</code>会调用自身的<code>toString</code>方法
- <code>[].toSting()</code>之后，得到一个空字符串。举个栗子<code>[1, 2, 3].toString()</code>之后得到字符串<code>'1, 2, 3'</code>
- 所以<code>'0' == []</code>得到一个**false**，因为<code>'0' != ''</code>
- 对了<code>'0' == false 返回为 true</code>

### 为什么 0 == [] 是 true？

- <code>Number([])，Number('')，Number(' ')</code> 都会返回 **0**
- 因为数组要和值类型进行比较，首先要把自己转换为值类型，调用自身的<code>valueOf()</code>返回了自身，那想转值类型，就需要转字符串了
- 其实<code>0 == []</code>做了两次转换，先转成了空字符串，然后转数字<code>Number('')</code>得到一个 **0**

### 类型转换规则

> 在 js 中类型转换有三种情况：转布尔值；转数字；转字符串。如果发生了隐式转换，那么各种类型互转符合下面的规则：

<p align="center">
  <img :src="$withBase('/imgs/js-type-transform.jpg')" width="" style="border-radius: 8px;">
</p>

#### 显示数据类型转换

- 转数字：**Number()**
  - 如果是数字类型的字符串，那么转换的时候回返回自己
  - 如果不是数字类型的字符串，那么转换结果是 **NaN**
  - 如果是空字符串，那么转换结果是 **0**
- 转数字：**parseInt()**
  - 忽略掉前面的空格，直到找到第一个非空字符串，还会降后面的非数字字符串去掉
  - 如果第一个字符不是数字符号或者负号，则返回 **NaN**
  - 会向下取整
- 转数字：**parseFloat**

  - 同上，但是会保留小数

- 转字符串：**String()**；**toString()**
- 转 boolean：**Boolean()**
  - 在进行转换 _boolean_ 的时候，所有的结果都为 **true**，除了 **false**、**''**、**0**、**-0**、**NaN**、**undefined**、**null**

#### 隐式转换

- 转 _number_：减乘除取余都可以让字符串隐式转换为 _number_
- 转 _string_：可以通过加 <code>''</code> 字符串来转换 <code>a = a + ''</code>
- 转 _boolean_：可以通过加 <code>!</code> 来转换 <code>a = !!a</code>
- 在条件判断时，除了 **false**、**''**、**0**、**-0**、**NaN**、**undefined**、**null**，其他值都可以转为 **true**，包括所有对象

#### 对象转原始类型

- 对象转换类型的时候，会调用内置的 **[toPrimitive]** 函数，对于该函数来说，算法逻辑如下：
  - 如果已经是原始类型了，那就不需要转换了
  - 调用 <code>x.valueOf()</code>，如果转为基础类型，就返回转换的值
  - 调用 <code>x.toString()</code>，如果转为基础类型，就返回转换的值
  - 如果都没有返回原始类型，就会报错
  - 当然也可以重写 **[Symbol.toPrimitive]**，该方法在转换原始类型时调用优先级最高
  ```js
  const obj = {
    valueOf() {
      return 0
    },
    toString() {
      return '1'
    },
    [Symbol.toPrimitive]() {
      return 2
    }
  }
  obj + 1 // 3
  ```
- 引用类型转换为<code>Number</code>类型，先调用<code>valueOf</code>，在调用<code>toString</code>
- 引用类型转换为<code>String</code>类型，先调用<code>toString</code>，在调用<code>valueOf</code>
- 若<code>valueOf</code>和<code>toString</code>都不存在，或者没有返回基本类型，则会抛出<code>TypeError</code>异常

```js
// 可以转换的
const obj = {
  valueOf() {
    console.log('valueOf')
    return 123
  },
  toString() {
    console.log('toString')
    return 'cym'
  }
}
console.log(obj - 1) // valueOf 122
console.log(`${obj} 你好`) // toString cym 你好
// 转换报错
const o = {
  valueOf() {
    console.log('valueOf')
    return {}
  },
  toString() {
    console.log('toString')
    return {}
  }
}
console.log(o - 1) // Uncaught TypeError: Cannot convert object to primitive value
console.log(`${o} 你好`) // Uncaught TypeError: Cannot convert object to primitive value
```

## 枚举

- 声明一个变量然后直接赋值，会返回一个 _undefined_
- 声明一个变量之后，在为其赋值，将会返回你赋的那个值
- 那么一个 ts 的枚举就是利用这个来实现的

```js
var Days = {}
function enumerate(Enum = {}) {
  Enum[(Enum['a'] = 1)] = 'a'
  Enum[(Enum['b'] = 2)] = 'b'
  Enum[(Enum['c'] = 3)] = 'c'
  Enum[(Enum['d'] = 4)] = 'd'
  Enum[(Enum['e'] = 5)] = 'e'
  return Enum
}
// 那么枚举的实现应该这么写
function creatEnum(Enum = {}, args = []) {
  if (!args.length) return {}
  for (let i = 0, len = args.length; i < len; i++) {
    Enum[(Enum[i] = i)] = args[i]
  }
  return Enum
}
```

## 传值和传址

### 基础概念

> 对于一个引用类型，把这个引用类型赋值给其他的引用类型的后，对该引用类型的某个属性进行修改，则另外一个也会变，但是覆盖后，则对另一个不会有影响

```js
const obj = { a: 1, b: '我是b' }
let b = obj
// 对其某个属性修改，则会另外一个对象也会变，因为是同一个引用
b.b = '我是b'
console.log(obj, b) // {a: 1, b: "我是b"} {a: 1, b: "我是b"}
// 对其覆盖，则不会影响另一个对象
b = { c: '我是b的c' }
console.log(obj, b) // {a: 1, b: "我是b"} {c: "我是b的c"}
```

### 函数的传值和传址

- 传值：传给函数的是值的一个复制，函数中对其的修改 **不会影响到外面的值**
- 传址：传给函数的是一个引用，函数中 **对引用的属性做修改会影响到外部的对象**，但用 **新引用覆盖其则在不会影响到外面的引用**

```js
let a = [1, 2, 3]
let b = [5, 6]
function change(a, b) {
  a[0] = 4 // 对其属性的修改外部可见
  let c = a
  a = b // 用新引用覆盖
  b = c
  console.log(a) // '5, 6'
  console.log(b) // '4, 2, 3'
}
change(a, b)
console.log(a) // '4, 2, 3'
console.log(b) // '5, 6'
```

## 防抖和节流

### 防抖

- 防抖：触发高频事件后 n 秒内只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间。
- 思路：每次触发事件时都取消之前的延时调用

```js
function debounce(fn, step) {
  let timer = null
  return function() {
    clearTimeout(timer)
    // 每次调用前先清除
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, step)
  }
}
```

### 节流

- 高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率
- 思路：每次触发事件时都判断当前是否有等待执行的延时函数

```js
  function throttle(fn, step) {
    ley canRun = true
    return function() {
      if (!canRun) return
      canRun = false
      setTimeout(() => {
        fn.apply(this, arguments);
        canRun = true
      }, step)
    }
  }
```

### 补充

- 以前我认为防抖和节流都差不多，但是有一次在开发地图的时候发生改变
- 需求是这样的，我们要模仿百度地图的搜索，搜索完之后，把后台返回的数据展示为一个列表，然后对应的点显示上去
- 鼠标悬停列表后地图上的点也改变其颜色，如下图

  <!-- javascript-basis-mapbox.jpg -->
  <p align="center">
    <img :src="$withBase('/imgs/javascript-basis-mapbox.jpg')" width="700" style="border-radius: 8px;">
  </p>

- 鼠标滑动事件是高频事件，一定需要阻止一下，否则一会页面就卡死了，我想都没有想就想到了节流，限制事件的执行频率，代码如下

```html
<!-- vue结构 -->
<div
  v-for="(item, idx) in aoiNameList"
  :key="idx"
  class="item"
  @click="showDetails(item)"
  @mouseover="changeMapLocationIcon(idx)"
  @mouseout="clearTimer"
></div>
```

```typescript
  // 节流处理
  protected throttle: boolean = true
  // 根绝鼠标悬停改变mapbox中的样式
  protected changeMapLocationIcon(idx: number) {
    if (!this.throttle) return
    this.throttle = false
    setTimeout(() => {
      this.markerList.forEach((item: any, index: number) => {
        item._element.classList.remove('active')
        if (idx === index) {
          console.log(item)
          item._element.classList.add('active')
        }
      })
      this.throttle = true
    }, 200)
  }
```

- 我鼠标不停的滑动来切换，我发现 mapbox 上的图标颜色没有改变，
- 我才想到，这么玩的话，在满足条件再次执行该函数的时候，永远保持上一个状态，他只会记住一次状态，所有我们应该选择防抖而不是节流
- 于是，我把代码改了下:

```ts
  // 防抖处理高频事件
  protected timer: any = null
  protected changeMapLocationIcon(idx: number) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.markerList.forEach((item: any, index: number) => {
        item._element.classList.remove('active')
        if (idx === index) {
          item._element.classList.add('active')
        }
      })
    }, 300)
  }
  protected clearTimer() {
    clearTimeout(this.timer)
  }
  protected beforeDestroy() {
    clearTimeout(this.timer)
  }
```

## Reflect

::: tip
*Reflect*对象与*Proxy*对象一样，都是 Es6 为了操作对象而提供的新 API。*Reflect*对象的设计目的有这样几个

- 将*Object*对象的一些明显属于语言内部的方法（比如*Object.defineProperty*），放到*Reflect*对象上。现阶段，某些方法同时在*Object*和*Reflect*对象上部署，未来新的方法将只部署在*Reflect*对象上。也就是说，从*Reflect*对象上可以拿到语言内部的方法。
- 修改某些*Object*方法的返回结果，让其变得更合情合理。比如，*Object.defineProperty(obj, name, desc)*在无法定义属性时会抛出一个错误，而*Reflect.definProperty(obj, name, desc)*则会返回*false*
- 让*Object*操作都变成函数行为。某些*Object*操作都是命令式，比如*name in obj*和*delete obj[name]*，而*Reflect.has(obj, name)*和*Reflect.deleteProperty(obj, name)*让他它们变成了函数行为
- *Reflect*对象的方法与*Proxy*对象的方法一一对应，只要是*Proxy*对象的方法，就能在*Reflect*对象上找到对应的方法。这就让*Proxy*对象可以方便地调用对应的*Reflect*方法，完成默认行为，作为修改行为的基础。也就是说，**不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为**。
  :::

## 原型

<p align="center">
  <img :src="$withBase('/imgs/basis-javascript-prototype.png')" />
</p>

### prototype

- _prototype_ 是一个显示原型属性，只有**函数才拥有该属性**，基本上所有函数都有这个属性
- 但是也有例外，下面这种方法创建的函数不会具有 _prototype_ 属性

```js
  let fun = Function.prototype.bind
  let fun = Function.prototype.call
  ...
```

- 当我们创建一个函数时，_prototype_ 属性就被自动创建了
- _prototype_ 这个属性的值是一个对象（也就是一个原型），只有一个属性 _constructor_

### constructor

- _constructor_ 是一个公有且不可枚举的属性，一旦我们改变了函数的 _prototype_，那么新对象就没有这个属性了
- 当然可以通过原型链取到 _constructor_
- _constructor_ 属性指向了构造自己的构造函数

### \_\_proto\_\_

- \_\_\_proto\_\_\_ 是对象的属性，当然函数也可以访问，指向了 Function.prototype：**f.\_\_proto\_\_ === Function.prototype**
- \_\_\_proto\_\_\_ 指向了**创建该对象的构造函数的原型**
- 不推荐使用 \_\_\_proto\_\__ 来获取对象的这个属性，**Es6**提供了 \_Object.getPrototypeOf(tartget-object)_ 方法
- 因为在 js 中没有类的概念，为了实现类似继承的方式，通过 \_\_\_proto\_\_\_ 将对象和原型联系起来组成了原型链，得以让对象可以访问到不属于自己的属性
- 当我们使用 _new_ 操作符时，生成的实例对象就有了 \_\_\_proto\_\_\_ 属性

### new

- _new_ 一个函数经历了什么？
  1. 新生成了一个对象
  2. 链接到原型
  3. 绑定 this
  4. 返回一个新对象
- 在调用 _new_ 的过程中会发生以上四件事，尝试着分析一下
  - 新生成一个对象，比如我们生成了一个对象 _obj_
  - 连接到原型，我们让 _obj.\_\_proto\_\_ = F.prototype_
  - 绑定 this，然后执行，_F.apply(obj)_
  - 返回一个新的对象，此时 _obj_ 对象就是你 _new_ 一个函数得到的那个对象
  - 那么我们尝试着实现一个 _new_
  ```js
  function _new() {
    // 创建一个对象
    const obj = {}
    // 获取到我们传入的构造函数，获取arguments的第一项
    const F = [].shift.call(arguments)
    // 连接到原型
    obj.__proto__ = F.prototype
    // 执行构造函数，绑定this到新对象
    F.apply(obj, arguments)
    // 返回一个对象
    return obj
  }
  ```

### 总结

- 从图中我们可以发现，所有对象都可以通过原型链最终找到 **Object.prototype**
- **Object.prototype** 是一个对象，但是这个对象却不是 **Object** 创造的，而是引擎自己创建的
- 所以可以这么说：**所有的实例都是对象，但是对象不一定都是实例**
- **Function.prototype** 也是引擎自己创建的。所以 **let fun = Function.prototype.bind** 没有 **prototype** 属性
- 引擎首先创建了 **Object.prototype**，然后创建了 **Function.prototype**，并且通过 **\_\_proto\_\_** 将两者联系了起来
- 所以说：**不是所有的函数都是 new Function() 创造出来的**
- **Function.\_\_proto\_\_ === Function.prototype**
- 所有的构造函数都可以通过原型链找到 **Function.prototype**，并且 **function Function()** 本质上也是一个函数，为了不产生混乱就将 **function Function()** 的 **\_\_proto\_\_** 联系到了 **Function.prototype** 上
- **Object** 是所有对象的父亲，所有对象都可以通过 **\_\_proto\_\_** 找到它
- **Function** 是所有函数的父亲，所有函数都可以通过 **\_\_proto\_\_** 找到它
- **Function.prototype** 和 **Object.prototype** 是两个特殊的对象，他们由引擎来创建
- 除了以上两个特殊对象，其他对象都是通过构造器 **new** 出来的
- 函数的 **prototype** 是一个对象，也就是原型
- 对象的 **\_\_proto\_\_** 指向原型， **\_\_proto\_\_** 将对象和原型连接了起来组合成了原型链

## 继承

- new 运算符的缺点

  - 用构造函数生成的实例对象，有一个缺点，那就是无法共享属性和方法
  - 在 DOG 对象的构造函数中，设置一个实例对象的共有属性 _type_

  ```js
  function DOG(name) {
    this.name = name
    this.type = '犬科'
  }
  var dogA = new DOG('大毛')
  var dogB = new DOG('二毛')
  // 修改其中一个
  dogB.type = '猫科'
  console.log(dogA, dogB)
  ```

  <p align="center">
    <img :src="$withBase('/imgs/basis-javascript-inherit.png')" height="">
  </p>
  - 这两个*type*属性是独立的，修改其中一个不会影响到另外一个
  - 每一个实例对象，都有自己的属性和方法的副本。这不仅无法做到数据的共享，也是极大的资源浪费

- 因此，有了 _prototype_ 属性
  - 所有实例对象要共享的属性和方法，都放到这个 _prototype_ 对象里面
  - 那些不需要的共享的属性和方法就放在构造函数里面
  - 实例对象一旦被创建，将自动引用 _prototype_ 对象的属性和方法。也就是说，实例对象的属性和方法，分为两种，一种是本地的，一种是引用的
  - 其实就是两个对象共同引用同一个对象，作为自己的共有属性和方法
  ```js
  function DOG(name) {
    this.name = name
  }
  DOG.prototype = { type: '犬科' }
  var dogA = new DOG('大毛')
  var dogB = new DOG('二毛')
  DOG.prototype.type = '犬科'
  console.log(dogA.type, dogB.type)
  ```

### 原型链继承

- 让子类的原型(_proptype 对象_)指向父类的实例，就实现了原型链继承
- 利用原型让一个引用类型继承另一个引用类型的属性和方法(原型上的属性和方法以及自有属性和方法)
- 拓展一下, 属性分自有数字属性, 原型属性以及静态属性
- 每个构造函数都有一个原型对象, 原型对象包含一个指向构造函数的指针, 而实例都包含一个指向原型对象的内部指针
- 当构造函数的私有属性和原型上的属性同名的时候, 优先访问的是私有属性

```js {10}
function Parent() {
  this.name = '小明'
  this.colors = ['red', 'blue']
}
function Child() {}
Child.prototype = new Parent()

var c1 = new Child()
c1.colors.push('green')
c1.name = '小白'

var c2 = new Child()
c2.colors = ['a', 'b', 'c', 'd']
console.log(c2, c1)
```

<p align="center">
  <img :src="$withBase('/imgs/basis-javascript-prototype-inherit.png')" height="">
</p>

- 原型链继承会共享父类的属性，所有的子类都会共享一个属性
- 就是说如果你只是拿来使用那么就是共用父类的属性，有一处修改都会发生改变，但是直接修改值类型不会发生改变，因为那就变成自身属性
- 比如说第 10 行修改*name*属性后，其实就是在子类中添加该属性了
- 但是对于对象来说，如果自身拥有那么就会对原型屏蔽，如果自身没有则去查找原型链
- 如果你直接修改父类的属性值，而子类本身没有的话，那么子类所继承的属性都会发生改变
- **缺点**
  1. 重写子类的原型 = 父类的实例, 父类实例的属性变成子类原型的属性, 如果父类包含引用类型的属性, 那么子类所有实例都会共享该属性
  2. 在创建子类实例时，不能向父类的构造函数传递参数
  3. 子类丢失 constructor(让子类原型的 constructor 执行父类)

### 借用构造函数（类式继承）

- 使用 _call_ 或 _apply_ 方法，将父对象的构造函数绑定到子对象上，就是父对象在子对象内部执行，**this** 指向子对象
- 那不就是子对象上有父对象上的属性和方法了，因为父对象执行的时候，this 执行了子对象

```js {7}
function Parent(name, age) {
  this.name = name
  this.age = age
  this.colors = ['red', 'blue']
}

function Child(name, age) {
  Parent.apply(this, arguments)
}

var c1 = new Child('小明', 24)
var c2 = new Child('小白', 25)
c2.colors.push('green')
console.log(c1, c2)
```

<p align="center">
  <img :src="$withBase('/imgs/basis-javascript-constructor-inherit.png')" height="">
</p>

- 如上代码，其实父类执行了一次就是生成了两个属性，父类直接执行的话就是给 _window_ 生成了几个属性
- 让父类在子类创建中执行，并且改变其 **this** 为子类 this，那么不就是相当于把父类的拿两句话又写了一遍吗，不就是给子类添加了几个属性嘛
- 这种方法，每次实例化一个对象都是一个独立的对象，他们不会公用属性
- 他是解决了共享问题解决了，每一个属性都是独立的
- 但是我们是基于原型链的，但是我们并没有真正的去利用原型链的共享功能，完全抛弃了它，并且导致每次 _new_ 实例的时候，都会去调用父类的构造方法去加到子类的实例上，是完全的 copy paste 过程，这等于舍弃了 js 原型链的精髓部分，这样的代码自然是没有灵魂的~
- **坏处：** 子类不能继承父类原型上的方法, 那么方法就要写在构造函数中, 那么复用代码就无从谈起

### 组合继承

- 将原型链和借用构造函数的技术结合到一起使用, 从而发挥两者之长的一种继承模式.
- 其背后的思路是使用原型链实现对原型属性和方法的继承, 而借用构造函数来实现对实例属性的继承
- 这样既通过在原型上定义方法实现了函数复用, 又能够摆正每个实例都有他自己的属性
- 不要忘了让子类原型的构造函数指向子类的构造函数, 不会还是会丢失
- **优点：** 组合继承解决原型链继承的引用类型原型属性被实例共享问题
- **缺点**
  - 两次调用父类构造函数
  - 子类继承父类的属性, 一类是在子类的实例上, 一类是在子类的原型上(效率低)

## 发布订阅机制

> 发布订阅模式也是观察者模式，它定义了一种一对多的关系，让多个订阅对象同时监听某一个主题对象，这个主题对象某一状态发生改变的时候就会通知所有订阅者。它有两类对象组成：发布者和订阅者，发布者负责发布消息，同时订阅者通过订阅这些事件来观察主题。发布者和订阅者是完全解耦的，彼此不知道对方的存在，两者仅仅共享一个自定义事件的名称。（摘自博客园）

- 今天上午提到的 **Redis** 的发布订阅，就是一个发布订阅模式 [传送门](/views/big-front-end/redis/#redis-发布订阅)
- **node** 中的 **events** 模块中的 **EventEmitter** 类就是一个发布订阅模式

```js
// 演示下node中的发布订阅
const Emitter = require('events').EventEmitter
const emitter = new Emitter()
emitter.on('test', msg => {
  console.log(msg, '第一个')
})
emitter.on('test', (...msg) => {
  console.log(msg, '第二个')
})
emitter.on('test', msg => {
  console.log(msg, '第三个')
})
emitter.emit('test', 'chengyuming')
emitter.emit('test2', '嘿嘿嘿', '哈哈哈')
```

- 让我们来实现一个简单发布订阅模式
  - 首先我们要有一个 **Emitter** 类
  - 这个类里有个属性里面用来存放我们的消息队列
  - 这个类的实例要有两个方法，一个发布一个订阅

```js
class Emitter {
  constructor() {
    // 消息队列，以及消息类型
    this.handlers = {}
  }
  // 订阅事件，绑定函数
  on(eventType, handler) {
    // 判断消息队列里面有没有该事件，有则继续push没有则赋值空[]
    if (!(eventType in this.handlers)) {
      this.handlers[eventType] = []
    }
    this.handlers[eventType].push(handler)
  }
  // 发布消息
  emit(eventType) {
    // 获取到发布的所有消息
    const messages = Array.prototype.slice.call(arguments, 1)
    // 触发订阅事件的函数执行
    this.handlers[eventType].forEach(handler => {
      handler.apply(this, messages)
    })
  }
}
```
