import { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    title: '广告管理',
    requiresAuth: true,
  },
  children: [
    {
      path: '/advert',
      name: 'advert',
      component: () =>
        import(/* webpackChunkName: 'advert' */ '@/views/Advert'),
      meta: {
        title: '广告列表',
      },
    },
    {
      path: '/billboard',
      name: 'Billboard',
      component: () =>
        import(/* webpackChunkName: 'Billboard' */ '@/views/Billboard'),
      meta: {
        title: '广告位列表',
      },
    },
  ],
}

export default routes
