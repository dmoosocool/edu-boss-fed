import { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    title: '权限管理',
    requiresAuht: true,
  },
  children: [
    {
      path: '/role',
      name: 'Role',
      component: () => import(/* webpackChunkName: 'Role' */ '@/views/Role'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: '/menu',
      name: 'Menu',
      component: () => import(/* webpackChunkName: 'Menu' */ '@/views/Menu'),
      meta: {
        title: '菜单管理',
      },
    },
    // {
    //   path: '/resource',
    //   name: 'resource',
    //   component: () =>
    //     import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
    //   meta: {
    //     title: '资源管理',
    //   },
    // },
    {
      path: '/menu/create',
      name: 'MenuCreate',
      component: () =>
        import(/* webpackChunkName: 'MenuCreate' */ '@/views/Menu/create'),
      meta: {
        title: '添加菜单',
      },
    },
    {
      path: '/menu/:id/edit',
      name: 'MenuEdit',
      component: () =>
        import(/* webpackChunkName: 'MenuEdit' */ '@/views/Menu/edit'),
    },
    {
      path: '/role/:roleId/allocation-menu',
      name: 'AllocationMenu',
      component: () =>
        import(
          /* webpackChunkName: 'AllocationMenu' */ '@/views/Role/allocation-menu'
        ),
      props: true, // 将路由路径参数映射到组件的 props 数据中
      meta: {
        title: '分配菜单',
      },
    },
    {
      path: '/role/:roleId/allocatopm-resource',
      name: 'AllocationResource',
      component: () =>
        import(
          /* webpackChunkName: 'AllocationResource' */ '@/views/Role/allocation-resource'
        ),
      props: true, // 将路由路径参数映射到组件的 props 数据中
      meta: {
        title: '分配资源',
      },
    },
  ],
}

export default routes
