'use strict';

const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default [
  { path: '/', redirect: '/home' },
  {
    path: '/',
    component: '@/layouts',
    flatMenu: true,
    routes: [
      {
        path: '/home',
        name: '首页',
        component: '@/pages/home',
        wrappers: [RouteWatcher]
      },
      {
        path: '/user',
        name: '用户',
        component: '@/pages/user',
        wrappers: [RouteWatcher]
      },
      {
        path: '/page',
        name: '层次',
        routes: [
          {
            path: '/page/page_sub1',
            component: '@/pages/sub/page_sub1',
            name: 'page_sub1',
            wrappers: [RouteWatcher],
          },
          {
            path: '/page/page_sub2',
            component: '@/pages/sub/page_sub2',
            name: 'page_sub2',
            wrappers: [RouteWatcher],
          }
        ]
      }
    ]
  },
  { 
    path: '/403', 
    component: '@/pages/403'
  }
]