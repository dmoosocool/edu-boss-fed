import { RouteConfig } from 'vue-router'
import Layout from '@/components/Layout'

const routes: RouteConfig = {
  path: '/course',
  component: Layout,
  meta: {
    title: '课程管理',
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'CourceIndex',
      component: () =>
        import(/* webpackChunkName: 'CourceIndex' */ '@/views/Course'),
    },
    {
      path: 'create',
      name: 'CourceCreate',
      component: () =>
        import(/* webpackChunkName: 'CourceCreate */ '@/views/Course/create'),
    },
    {
      path: ':courseId/edit',
      name: 'CourceEdit',
      component: () =>
        import(/* webpackChunkName: 'CourceEdit' */ '@/views/Course/edit'),
      props: true,
    },
    {
      path: ':courseId/section',
      name: 'CourceSection',
      component: () =>
        import(
          /* webpackChunkName: 'CourceSection' */ '@/views/Course/section'
        ),
      props: true,
    },
    {
      path: ':courseId/video',
      name: 'CourceVideo',
      component: () =>
        import(/* webpackChunkName: 'CourceVideo' */ '@/views/Course/video'),
      props: true,
    },
  ],
}

export default routes
