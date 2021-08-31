import { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    title: '用户管理',
    requiresAuth: true,
  },
  children: [
    {
      path: '/user',
      name: 'UserIndex',
      component: () =>
        import(/* webpackChunkName: 'UserIndex' */ '@/views/User'),
      meta: {
        // title: '用户管理'
      },
    },
  ],
}

export default routes
