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
      {
        path: '/role/:roleId/allocation-menu',
        name: 'AllocationMenu',
        component: () =>
          import(
            /* webpackChunkName: 'AllocationMenu' */ '@/views/Role/allocation-menu'
          ),
      },
      {
        path: '/role/:roleId/allocation-resource',
        name: 'AllocationResource',
        component: () =>
          import(
            /* webpackChunkName: 'AllocationResource' */ '@/views/Role/allocation-resource'
          ),
      },

      {
        path: '/menu',
        name: 'Menu',
        component: () => import(/* webpackChunkName: 'Menu' */ '@/views/Menu'),
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
