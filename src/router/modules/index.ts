import type { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'
import authority from './authority'
import user from './user'
import advert from './advert'
import course from './course'

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
  authority,
  user,
  advert,
  course,
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
