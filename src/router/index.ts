import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './modules'

Vue.use(VueRouter)

const router = new VueRouter({ routes })

router.beforeEach(async (to, from, next) => {
  nprogress.start()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      return next({
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      })
    }
  }

  next()
})

router.afterEach(() => nprogress.done())

export default router
