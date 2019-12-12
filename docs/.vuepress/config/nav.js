module.exports = {
  nav: [
    { text: '首页', link: '/', icon: 'reco-home' },
    { text: '时间轴', link: '/timeLine/', icon: 'reco-date' },
    {
      text: 'menu-out-1',
      icon: 'reco-category',
      items: [
        { text: 'menu-in-1', link: '/views/menu/menu1' },
        { text: 'menu-in-2', link: '/views/menu/menu2' },
        { text: 'menu-in-3', link: '/views/menu/menu3' },
        { text: 'menu-in-4', link: '/views/menu/menu4' },
      ]
    },
    {
      text: 'menu-out-2',
      icon: 'reco-three',
      items: [
        { text: 'menu-in-1', link: '/views/menu/menu1' },
        { text: 'menu-in-2', link: '/views/menu/menu2' },
        { text: 'menu-in-3', link: '/views/menu/menu3' },
        { text: 'menu-in-4', link: '/views/menu/menu4' },
      ]
    },
  ]
}