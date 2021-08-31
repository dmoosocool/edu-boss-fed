import type { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'
import authorityRoutes from './authority'
import userRoutes from './user'

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: 'Login' */ '@/views/Login'),
    meta: {
      hidden: true,
    },
  },

  {
    path: '/',
    component: Layout,
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: 'Home' */ '@/views/Home'),
      },
    ],
  },
  authorityRoutes,
  userRoutes,
  {
    path: '*',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: 'NotFound' */ '@/views/NotFound'),
    meta: {
      hidden: true,
    },
  },
]

export default routes
