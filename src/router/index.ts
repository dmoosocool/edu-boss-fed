import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: 'Login' */ '@/views/Login'),
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: 'Home' */ '@/views/Home'),
      },

      {
        path: '/role',
        name: 'Role',
        component: () => import(/* webpackChunkName: 'Role' */ '@/views/Role'),
      },
    ],
  },
  {
    path: '*',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: 'NotFound' */ '@/views/NotFound'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
