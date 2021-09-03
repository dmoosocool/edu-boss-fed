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
      name: 'CourseIndex',
      component: () =>
        import(/* webpackChunkName: 'CourseIndex' */ '@/views/Course'),
    },
    {
      path: 'create',
      name: 'CourseCreate',
      component: () =>
        import(/* webpackChunkName: 'CourseCreate */ '@/views/Course/create'),
    },
    {
      path: ':courseId/edit',
      name: 'CourseEdit',
      component: () =>
        import(/* webpackChunkName: 'CourseEdit' */ '@/views/Course/edit'),
      props: true,
    },
    {
      path: ':courseId/section',
      name: 'CourseSection',
      component: () =>
        import(
          /* webpackChunkName: 'CourseSection' */ '@/views/Course/section'
        ),
      props: true,
    },
    {
      path: ':courseId/video',
      name: 'CourseVideo',
      component: () =>
        import(/* webpackChunkName: 'CourseVideo' */ '@/views/Course/video'),
      props: true,
    },
  ],
}

export default routes
