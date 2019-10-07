---
title: Mapbox GL JS   
date: 2019-08-24
tags:
- Mapbox
---

# Mapbox GL JS 

> [中文版](https://www.mapbox.cn/mapbox-gl-js/api/#map) [英文版](https://docs.mapbox.com/mapbox-gl-js/api/?q=addlayer&size=n_10_n)

## 底图渲染

- 初次渲染地图很简单，按照官网的配置
- 我们需要一个地图渲染容器，需要用到 mapbox-gl 库，有时候你可能需要准备一个开发者token，那我们开始吧
- 首先我们实例化一个Map类，在mapbox-gl里面有个Map类，该类接受一个options配置对象作为初始化地图的条件
```js
  import mapboxgl from 'mapbox-gl'
  const options = {
    container: '底图容器',
    style: '您的底图json',
    // 经度越大越靠左，纬度越大越靠下
    center: [108.5, 38],    // 初始化地图的中心点
    zoom: 3.9,              // 缩放比例
    bearing: 0,             // 地图的初始方位角（旋转度）
    pitch: 0,               // 地图的初始倾斜度，按偏离屏幕水平面的度数计量（0-60）
    doubleClickZoom: false, // 取消双击缩放
    dragRotate: false ,     // 取消地图旋转
  }
  const map = new mapboxgl.Map(options)
```

## 添加控制器

- 实例map的方法，map.addControl()
- 接受两个参数，**要添加的控制器** 和 **添加的位置** *('top-left' ,  'top-right' ,  'bottom-left' , and  'bottom-right' 。默认为  'top-right' )*
```js
  // 添加地图导航空间（放大缩小）
  map.addControl(new mapboxgl.NavigationControl(), 'top-left');
  // 添加比例尺
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
  })
  map.addControl(scale)
  scale.setUnit('metric')
  ...
```

## 添加/移除标记

- 在mapbox-gl类中有Marker类，专门用来处理标记
- 该类接受两个参数，element和options
- 只是添加一个标记，但是添加到哪就需要你来设置了
- 移除标记就是移除该类的实例
```js 
  // 全局可修改的marker
  let marker = null
  function addMarker(LngLat, el, options) {
    if (marker) {
      marker.remove()
    }
    marker = new mapboxgl.Marker(el, options).setLngLat(LngLat).addTo(map)
  }
```

## 地图移动

### flyTo 地图飞行

- 对地图中心、缩放级别、方位角和倾斜度做任意组合改变， 使其沿着一条曲线动态地变化并引发飞行效果。 该动态转换能够无缝引入缩放和平移，使用户即使在穿越了很长的距离后也能保持方位角不变
- 接收两个参数， **options**和**传递的其他属性**
- **options.curve** [number] (default 1.42)：缩放曲线效果
- **options.speed** [number] (default 1.2)：飞行速度
- **options.center** ：飞行后的中心点，类似于初始化地图的center
- **options.zoom** ：飞行后缩放级别
```js
  map.flyTo({
    center: [108.5, 38],
    zoom: 10,
    speed: 5,
    curve: 1,
    easing(t) { return t }
  })
```
### jumpTo 跳跃

- 地图移动的方法之一
- 参数和flyTo一样，**options**和**传递的其他属性**
- **options.center** (LngLatLike) : 目的地中心。
- **options.zoom** (number) : 目的地的缩放级别。
- **options.bearing** (number) : 目的地的方位角（bearing，rotation），按照逆时针偏离正北方的度数计算。
- **options.pitch** (number) : 目的地的倾斜度（pitch，tilt），单位为度。
- **options.around** (LngLatLike) : zoom 指定之后，  around 将决定缩放中心（默认为地图中心）。

### easeTo 动态转换
- 地图移动的方法之一，参数同上


## Layer 和 Source

- Layer是图层，Source是数据源
- Layer和Source需要相辅相成，一个负责界面呈现，一个是数据
- Source支持：vector、raster、geojson、image、video。
  - geojson 处理各种矢量类型，包括集合
  - vector 主要解决矢量瓦片
  - raster 解决目前常用的栅格化瓦片
  - video 的加入使得功能更加的现代化
  - mapbox在style里面，为source定义了一个type属性，来说明这些类型。
- Layer分为：background、fill、line、symbol、raster、circle，除了background类型的layer不需要绑定source之外。其他的都需要有source。
  - fill 只负责填充
  - line 只负责线条
  - symbol 处理sprite图，文字等
  - raster 只负责图片
  - circle 负责点
  - Filter 设置展示的过滤条件，定制化显示

### 添加/删除Layer

- 有这么一个需求，我输入一个经纬度或者一个别的什么条件来查到这个点在地图上的位置，并且根据这个区域的admincode或者别的什么条件圈出该区逇范围
- 如下图，左边是效果，右边是该区域的数据，原地图是没有那个紫色的边框的，我们要查出来后给该区域添加上
<p>
  <img :src="$withBase('/imgs/mapbox-addlayer-line-result.png')" height="248">
  <img :src="$withBase('/imgs/mapbox-addlayer-line-data.png')" height="220">
</p>

- 那么我么需要用到addLayer方法，添加layer，但是我们需要获取到底图的数据
- queryRenderedFeatures()，查询渲染后的功能信息，该返回一个GeoJSON Feature Object数据，表明满足查询参数的可见要素。[传送门](https://www.mapbox.cn/mapbox-gl-js/api/#map#queryrenderedfeatures)
- 我们使用该方法传递layerId，获取到我们要的数据
- 开始添加layer，map.addLayer() 接收一个配置对象，配置对象规则如下
  - 样式的layer属性将列出该样式中所有可用的图层。图层类型由 *type* 属性规定，且指定方式必须为 background, fill, line, symbol, raster, circle, fill-extrusion
  - 除了 background 类型的图层，其它每一个图层都需要参考一个数据源。 图层从数据源获取数据，选择性地筛选要素，然后定义为这些要素添加样式的方式。
  - 具体信息查看 [这里](https://www.mapbox.cn/mapbox-gl-js/style-spec/#layers)
- 我们的代码最终如下
```js
  drawLine(admincode) {
    // 添加前先删除之前的
    let _layer = map.getLayer('data_town_polygon')
    if (_layer) {
      map.removeLayer(_layer.id)
      map.removeSource(_layer.source)
    }
    const layer = {
      // 唯一ID，不可重复
      id: 'data_town_polygon',
      // 我们是画线，所以选择line
      type: 'line',
      source: {
        type: 'vector',
        tiles: ['http://10.125.214.22:8080/data/town/{z}/{x}/{y}.pbf']
      },
      'source-layer': 'town_polygon',
      'layout':{
        visibility:'visible'
      },
      // 定义layer的样式规则
      'paint': {
        'line-color': '#4D2EA5',
        'line-width': 5,
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1, 0.6
        ]
      },
      // 定义过滤条件，这里是传递过来的admincode
      filter: ['==', 'admincode', admincode]
    }
    map.addLayer(layer)
  }
```

## 地图事件

### on -> load事件

- 该事件一般用作地图渲染完毕处理一些事情

### on -> click 事件

- 鼠标单击事件，对原生的click做了很好的封装
- 比如说我们可以，获取到经纬度，点信息，我们可以根据点信息获取feature信息
```js
  // 截取一段根据事件对象获取到的点信息来画地图
  this.map.on('click', async(ev: any) => {
    if (this.isMouseGet) {
      const features: any[] = this.map.queryRenderedFeatures(ev.point)
      console.log(features, 'sss')
      if (!features.length) return this.$message.warning('未获取到该区域的数据')
      await this.drawLine(features[0].properties['admin_code'])
      const areaInfo: any = {}
      Object.entries(features[0].properties).forEach((item: any) => {
        areaInfo[toHump(item[0])] = item[1]
      })
      this.info = areaInfo
      // @ts-ignore
      this.$refs.dialog.handleDialogOpen(this.info)
    }
  })
```

### 改变鼠标手型

- _map_ 的实例有个 _getCanvas()_ 方法可以获取到 _canvas_ 地图上的 _canvas_ 元素
- 此时我们可以调用它的 _style.cursor_ 为其赋值，便可以改变地图上的鼠标手型
```js
  this.map.getCanvas().style.cursor = 'pointer'
```
- 关于鼠标手型，可以看下[这里](http://www.hangge.com/blog/cache/detail_2065.html)，这里列出来所有的鼠标手型以及长什么样子