---
title: nginx   
date: 2019-07-10
tags:
- nginx
- 大前端
---

# nginx

## 安装

- 安装就暂时略过了，记录一下配置

## 常用命令

- 做了软链接或者配置了 nginx 的环境变量可以用以下语法，没有话就需要指定到 nginx 所在的目录
- **nginx -s stop** 停止 nginx
- **nginx -s quit** 退出 nginx
- **nginx -s reload** 重新加载配置（修改配置文件后）
- **nginx -s reopen** 重启 nginx
- **nginx -v** 查看版本
- **nginx -t** 查看配置文件目录，检测配置文件是否有语法错误，然后退出

## nginx.conf 配置文件

::: tip
Nginx 配置文件主要分成四部分：main（全局设置）、server（主机设置）、upstream（上游服务器设置，主要为反向代理、负载均衡相关配置）和 location（URL 匹配特定位置后的设置），每部分包含若干个指令。main 部分设置的指令将影响其它所有部分的设置；server 部分的指令主要用于指定虚拟主机域名、IP 和端口；upstream 的指令用于设置一系列的后端服务器，设置反向代理及后端服务器的负载均衡；location 部分用于匹配网页位置（比如，根目录“/”,“/images”,等等）。他们之间的关系式：server 继承 main，location 继承 server；upstream 既不会继承指令也不会被继承。它有自己的特殊指令，不需要在其他地方的应用。
:::

<!-- ## 简单配置

- nginx默认端口是80，表示http协议，https协议默认443端口
- 开启进程数
  - **worker_processes** 要小于自己的CPU数，所以我们可以设置为 auto
- error_log
  - 自定义错误日志保存位置，全局设置，默认*logs/error.log*
  - error_log 级别分为debug， info， notice， warn， error， crit， 默认为crit
  - crit记录的日志最少， 而debug记录的日志最多。 如果你的nginx遇到一些问题， 比如502比较频繁出现， 但是看默认的error_log并没有看到有意义的信息， 那么就可以调一下错误日志的级别， 当调成error级别时， 错误日志记录的内容会更加丰富。
- pid
  - 进程ip，保存位置，默认为*logs/nginx.pid*
- http  -->

## main 全局配置

> nginx 在运行时与具体业务（比如 http 服务或者 email 服务代理）无关的参数，比如工作进程数、运行身份等

### woker_processes

- 在配置文件的顶级*main*部分，worker 角色的工作进程的个数，master 进程是接收并分配请求给 worker 处理。这个数据简单一点可以设置为 CPU 的核数 _grep ^processor /proc/cpuinfo | wc -l_，也是*auto*值。如果开启了 ssl 和 gzip 更应该设置成与逻辑 CPU 数量一样甚至为 2 倍，可以减少 I/O 操作，如果 nginx 服务器还有其他服务，可以适当减少。

### worker_cpu_affinity

- 也是写在 main 部分。在高并发情况下，通过设置 cpu 粘性来降低由于多 CPU 核切换造成的寄存器等现场重建带来的性能损耗。如*worker_cpu_affinity 0001 0010 0100 1000*; （四核）。

### worker_connections 2048

- 在 **events** 部分。每一个 worker 进程能并发处理（发起）的最大连接数（包括与客户端或后端被代理服务器间等所有的连接数）。
- nginx 作为反向代理服务器，计算公式 _最大连接数 = worker_processes _ worker_connections / 4*，所以这里客户端最大连接数是 1024，这个可以增加到 8192 都没关系，但是不能超过后面的 *worker_rlimit_nofile\*。
- 当 nginx 作为 http 服务器时，计算公式都除以 2

### worker_rlimit_nofile 10240

- 写在 main 部分。默认是没有设置，可以限制为操作系统最大的限制 65535。

### use epoll

- 写在 events 部分。在 Linux 操作系统下，nginx 默认使用 epoll 事件模型，得益于此，nginx 在 Linux 操作系统下效率相当高。同时 Nginx 在 OpenBSD 或 FreeBSD 操作系统上采用类似于 epoll 的高效事件模型 kqueue。在操作系统不支持这些高效模型时才使用 select。

## http 服务器

> 与提供 http 服务相关的一些配置参数。例如：是否使用*keeplive*，是否使用*gzip*进行压缩等

### sendfile on

- 开启高效的文件传输模式，sendfile 指令指定 nginx 是否调用 sendfile 函数来传输文件，减少用户空间到内核空间的上下文切换。
- 对于普通应用设为 on，如果用来进行下载等应用磁盘 IO 重负载应用，可设置为 off，以平衡磁盘与网络 I/O 处理速度，减低系统的负载

### keeplive_timeout 65

- 长连接超时时间，单位是秒。
- 这个参数很敏感，涉及浏览器的种类、后端服务器的超时设置、操作系统的设置，可以另外起一片文章了。长连接请求大量小文件的时候，可以减少重建连接的开销，但假如有大文件上传，65s 内没上传完成会导致失败。如果设置时间过长，用户又多，长时间保持连接会占用大量资源。

### send_timeout

- 用于指定响应客户端的超时时间。这个超时仅限于两个连接活动之间的时间，如果超过这个时间，客户端没有任何活动，Nginx 将会关闭连接。

### client_max_body_size 10m

- 允许客户端请求的最大单文件字节数。如果有上传较大文件，请设置它的限制值

### client_body_buffer_size 128k

- 缓冲区代理缓冲用户端请求的最大字节数

### 模块 http_proxy

> 这个模块实现的是 nginx 作为反向代理服务器的功能，包括缓存功能（[传送门](http://seanlook.com/2015/06/02/nginx-cache-check/)）

- _proxy_connect_timeout 60_

  - nginx 跟后端服务器连接超时时间(代理连接超时)

- _proxy_read_timeout 60_

  - 连接成功后，与后端服务器两个成功的响应操作之间超时时间(代理接收超时)

- _proxy_buffer_size 4k_

  - 设置代理服务器（nginx）从后端 realserver 读取并保存用户头信息的缓冲区大小，默认与 proxy_buffers 大小相同，其实可以将这个指令值设的小一点

- _proxy_buffers 4 32k_

  - proxy_buffers 缓冲区，nginx 针对单个连接缓存来自后端 realserver 的响应，网页平均在 32k 以下的话，这样设置

- _proxy_busy_buffers_size 64k_

  - 高负荷下缓冲大小（proxy_buffers\*2）

- _proxy_max_temp_file_size_

  - 当 proxy_buffers 放不下后端服务器的响应内容时，会将一部分保存到硬盘的临时文件中，这个值用来设置最大临时文件大小，默认 1024M，它与 proxy_cache 没有关系。大于这个值，将从 upstream 服务器传回。设置为 0 禁用。

- _proxy_temp_file_write_size 64k_

  - 当缓存被代理的服务器响应到临时文件时，这个选项限制每次写临时文件的大小。proxy_temp_path（可以在编译的时候）指定写到哪那个目录。

- _proxy_pass，proxy_redirect_ 见 [location](#location) 部分。

### 模块 http_gzip

- gzip on：开启 gzip 压缩输出，减少网络传输。
  - **gzip_min_length 1k**：设置允许压缩的页面最小字节数，页面字节数从 header 头得 content-length 中进行获取。默认值是 20。建议设置成大于 1k 的字节数，小于 1k 可能会越压越大。
  - **gzip_buffers 4 16k**：设置系统获取几个单位的缓存用于存储 gzip 的压缩结果数据流。4 16k 代表以 16k 为单位，安装原始数据大小以 16k 为单位的 4 倍申请内存。
  - **gzip_http_version 1.0**：用于识别 http 协议的版本，早期的浏览器不支持 Gzip 压缩，用户就会看到乱码，所以为了支持前期版本加上了这个选项，如果你用了 Nginx 的反向代理并期望也启用 Gzip 压缩的话，由于末端通信是 http/1.0，故请设置为 1.0。
  - **gzip_comp_level 6**：gzip 压缩比，1 压缩比最小处理速度最快，9 压缩比最大但处理速度最慢(传输快但比较消耗 cpu)
  - **gzip_types** ：匹配 mime 类型进行压缩，无论是否指定,”text/html”类型总是会被压缩的。
  - **gzip_proxied any**：Nginx 作为反向代理的时候启用，决定开启或者关闭后端服务器返回的结果是否压缩，匹配的前提是后端服务器必须要返回包含”Via”的 header 头。
  - **gzip_vary on**：和 http 头有关系，会在响应头加个 Vary: Accept-Encoding ，可以让前端的缓存服务器缓存经过 gzip 压缩的页面，例如，用 Squid 缓存经过 Nginx 压缩的数据。

## server 虚拟主机

::: tip
http 服务上支持若干个虚拟主机。每个虚拟主机一个对应的 server 配置项，配置项里面包含该虚拟主机相关的配置。在提供 mail 服务代理时，也可以建立多个 server。每个 server 通过监听地址或端口来区分
:::

### listen

- 监听端口，默认 80，小于 1024 的要以 root 启动。可以为 listen \*:80、listen 127.0.0.1:80 形式。

### server_name

- 服务器名，如 localhost、www.example.com，可以通过正则匹配

### 模块 http_stream

- 这个模块通过一个简单的调度算法来实现客户端 IP 到后端服务器的负载均衡，upstream 后接负载均衡器的名字，后端 realserver 以 host:port options; 方式组织在 {} 中。如果后端被代理的只有一台，也可以直接写在 proxy_pass 。

## location

> http 服务中，某些特定的 URL 对应的一系列配置项。

### root

- root /root/project/main;
- 定义服务器的默认网站根目录位置。如果 **location** URL 配置的是子目录或文件，root 没什么作用，一般放在*server*指令里面或者 / 下
- 也可以写成**alias**，来匹配，alias /root/cym/project/daily-admin/，但是 location / 不可以写成 alias，否则会是 403
  <p align="center">
    <img :src="$withBase('/imgs/nginx-location-conf.png')" height="">
  </p>

### index;

- index index.html index.htm;
- 定义路径下默认访问的文件名

### proxy_pass

- proxy_pass http://127.0.0.1:3000/api/;
- 请求转向 _http://127.0.0.1:3000/api/_，即反向代理，对应*upstream*负载均衡器

- proxy_pass http://wanfangdata.com.cn/;
- 访问代理到 _http://wanfangdata.com.cn/_ 网站

- 关于 location 匹配规则的写法，可以说尤为关键且基础的，参考文章 [nginx 配置 location 总结及 rewrite 规则写法](http://seanlook.com/2015/05/17/nginx-location-rewrite/);

- [本文章参考 _seanlook_ 的笔记](http://seanlook.com/2015/05/17/nginx-install-and-config/)
