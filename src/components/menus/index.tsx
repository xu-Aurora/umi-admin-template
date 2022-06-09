
import Home from '@/pages/home'
import User from '@/pages/user'
import Page_sub1 from '@/pages/sub/page_sub1'
import Page_sub2 from '@/pages/sub/page_sub2'

export default [
  {
    path: '/home',
    name: '首页',
    icon: 'smile',
    key: 'home',
    component: Home
  },
  {
    path: '/user',
    name: '用户',
    icon: 'heart',
    key: 'user',
    component: User
  },
  {
    path: '/page',
    name: '层级',
    icon: 'heart',
    routes: [
      {
        path: '/page/page_sub1',
        name: 'page_sub1',
        key: 'page_sub1',
        component: Page_sub1
      },
      {
        path: '/page/page_sub2',
        name: 'page_sub2',
        key: 'page_sub2',
        component: Page_sub2
      }
    ]
  }
];