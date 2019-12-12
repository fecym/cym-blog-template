module.exports = [
  ['link', { rel: 'icon', href: '/imgs/oops.png' }],
  // 给iOS添加到主屏的图标
  ['link', { rel: 'apple-touch-icon', href: '/imgs/iOS.jpg' }],
  [
    'meta',
    {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,user-scalable=no'
    }
  ],
  ['link', { rel: 'manifest', href: '/manifest.json' }],
  ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  // ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
  // ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
  ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
]
