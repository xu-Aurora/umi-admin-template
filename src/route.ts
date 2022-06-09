'use strict';

export default [
  { path: '/', redirect: '/home' },
  {
    path: '/',
    component: '@/layouts',
    routes: [
      {
        path: '/home',
        key: 'home',
        component: '@/pages/home'
      },
      {
        path: '/user',
        key: 'user',
        component: '@/pages/user'
      },
      {
        path: '/page',
        routes: [
          {
            path: '/page/page_sub1',
            key: 'page_sub1',
            component: '@/pages/sub/page_sub1'
          },
          {
            path: '/page/page_sub2',
            key: 'page_sub2',
            component: '@/pages/sub/page_sub2'
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