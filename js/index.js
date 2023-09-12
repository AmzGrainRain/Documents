const searchList = [
  '/lang/scala/README.md',
  '/lang/modern_cpp/README.md',
  '/lang/sql/README.md',
  '/lang/sql_adv/README.md',
  '/docs/hadoop/README.md',
  '/docs/zookeeper/README.md',
  '/docs/mysql/README.md',
  '/docs/hive/README.md',
  '/docs/sqoop/README.md',
  '/docs/hbase/README.md',
  '/docs/scala&spark/README.md',
  '/docs/flume/README.md',
  '/docs/kafka/README.md'
]

window.$docsify = {
  el: '#app',
  repo: 'https://github.com/AmzGrainRain/Documents',
  maxLevel: 6,
  loadNavbar: true,
  auto2top: true,
  coverpage: true,
  name: '返回首页',
  nameLink: '/',
  themeColor: '#000000',
  noEmoji: false,
  routerMode: 'history',
  coverpage: true,
  onlyCover: true,
  requestHeaders: {
    'cache-control': 'max-age=600'
  },
  basePath: '/',
  search: {
    paths: searchList,
    placeholder: '全局搜索',
    noData: '找不到结果',
    depth: 6
  }
}

// Service Worker Register
if (typeof navigator.serviceWorker !== 'undefined') {
  navigator.serviceWorker.register('/js/sw.js')
}
